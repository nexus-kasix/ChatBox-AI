import { createSignal } from "solid-js";
import { selectedModel, models } from "../../store/modelStore";
import { useStore } from "../../store/chatStore";
import { getAIClient, apiKeys } from "../../store/settingsStore";
import ModelSelector from "../ModelSelector/ModelSelector";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

export default function ChatInput() {
  const [inputValue, setInputValue] = createSignal("");
  const { addMessage, addAIResponse, addError, showThinking } = useStore();
  const [chatSession, setChatSession] = createSignal(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = inputValue().trim();
    if (message) {
      addMessage(message);
      setInputValue("");
      showThinking();

      const model = selectedModel();
      const modelConfig = models[model];
      const provider = modelConfig.provider;
      
      if (provider === 'google') {
        const client = getAIClient(provider);
        if (!client) {
          addError(`Please set up your Google API key in settings first`);
          return;
        }

        try {
          const model = client.getGenerativeModel({ 
            model: modelConfig.model,
            generationConfig,
          });

          if (!chatSession()) {
            setChatSession(model.startChat({
              generationConfig,
              history: [],
            }));
          }

          const result = await chatSession().sendMessage(message);
          console.log('Response from model:', {
            model: result.response.promptFeedback?.modelId || modelConfig.model,
            safetyRatings: result.response.promptFeedback?.safetyRatings,
            candidates: result.response.candidates,
          });
          addAIResponse(result.response.text());
        } catch (error) {
          console.error('API Error:', error);
          addError(error.message);
        }
      } else if (provider === 'together') {
        const keys = apiKeys();
        if (!keys.together) {
          addError('Please set up your Together AI API key in settings first');
          return;
        }

        try {
          const requestBody = {
            model: modelConfig.model,
            messages: [{
              role: "user",
              content: message
            }],
            max_tokens: 800,
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1,
            stop: modelConfig.stop || ["<|eot_id|>", "<|eom_id|>"]
          };

          console.log('Sending request to Together AI:', {
            model: modelConfig.model,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${keys.together.substring(0, 5)}...`
            },
            body: requestBody
          });

          const response = await fetch('https://api.together.xyz/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${keys.together}`
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Together AI Error:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText
            });
            throw new Error(`API request failed: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          console.log('Response from model:', {
            model: modelConfig.model,
            response: result
          });
          
          addAIResponse(result.choices[0].message.content);
        } catch (error) {
          console.error('API Error:', error);
          addError(error.message);
        }
      } else if (provider === 'mistral') {
        const keys = apiKeys();
        if (!keys.mistral) {
          addError('Please set up your Mistral API key in settings first');
          return;
        }

        try {
          const requestBody = {
            model: modelConfig.model,
            messages: [
              {
                role: "user",
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 800
          };

          console.log('Sending request to Mistral:', {
            url: 'https://api.mistral.ai/v1/chat/completions',
            model: modelConfig.model,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${keys.mistral.substring(0, 5)}...`
            },
            body: requestBody
          });

          const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${keys.mistral}`
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Mistral API Error:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText
            });
            throw new Error(`API request failed: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          console.log('Response from model:', {
            model: modelConfig.model,
            response: result
          });
          addAIResponse(result.choices[0].message.content);
        } catch (error) {
          console.error('API Error:', error);
          addError(error.message);
        }
      }
    }
  };

  return (
    <div class="input-panel">
      <form class="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue()}
          onInput={(e) => setInputValue(e.target.value)}
          placeholder="Message..."
        />
        <ModelSelector />
        <button type="submit" class="send-button">
          <i class="ri-send-plane-fill"></i>
        </button>
      </form>
    </div>
  );
}
