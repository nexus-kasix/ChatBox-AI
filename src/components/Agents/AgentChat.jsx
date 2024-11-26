import { createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Message from '../Chat/Message';
import ChatInput from '../Chat/ChatInput';
import MessagesArea from '../Chat/MessagesArea';
import { useAgentStore } from '../../store/agentStore';
import { getAIClient, apiKeys } from '../../store/settingsStore';
import DropdownPanel from '../Common/DropdownPanel';

export default function AgentChat() {
  const [showSettings, setShowSettings] = createSignal(false);
  const [isThinking, setIsThinking] = createSignal(false);
  const navigate = useNavigate();
  const store = useAgentStore();
  const agent = store.currentAgent;

  const handleSendMessage = async (message) => {
    if (!message || isThinking()) return;

    store.addMessage({
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    setIsThinking(true);
    store.addMessage({
      type: 'thinking',
      content: 'Thinking...',
      timestamp: new Date().toISOString(),
      model: agent().model
    });

    try {
      let response;
      const model = agent().model;
      const provider = model.startsWith('gemini') ? 'google' : 'mistral';

      if (provider === 'google') {
        response = await handleGoogleRequest(message);
      } else {
        response = await handleMistralRequest(message);
      }

      // Remove thinking message and add AI response
      store.removeThinkingMessage();
      store.addMessage({
        type: 'ai',
        content: response,
        timestamp: new Date().toISOString(),
        model: agent().model
      });
    } catch (error) {
      console.error('API Error:', error);
      store.removeThinkingMessage();
      store.addMessage({
        type: 'error',
        content: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleGoogleRequest = async (message) => {
    const client = getAIClient('google');
    if (!client) {
      throw new Error('Please set up your Google API key in settings first');
    }

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };

    const model = client.getGenerativeModel({ 
      model: agent().model,
      generationConfig,
    });

    const chat = model.startChat({
      generationConfig,
      history: [],
      context: agent().context || undefined,
    });

    // Add system prompt if available
    if (agent().systemPrompt) {
      await chat.sendMessage(agent().systemPrompt);
    }

    const result = await chat.sendMessage(message);
    return result.response.text();
  };

  const handleMistralRequest = async (message) => {
    const keys = apiKeys();
    if (!keys.mistral) {
      throw new Error('Please set up your Mistral API key in settings first');
    }

    const messages = [];
    if (agent().systemPrompt) {
      messages.push({
        role: 'system',
        content: agent().systemPrompt
      });
    }
    if (agent().context) {
      messages.push({
        role: 'system',
        content: agent().context
      });
    }
    messages.push({
      role: 'user',
      content: message
    });

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keys.mistral}`
      },
      body: JSON.stringify({
        model: agent().model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from Mistral API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleBack = () => {
    navigate('/agents');
  };

  return (
    <>
      <div class="app-container">
        <header class="chat-header">
          <button class="back-button" onClick={handleBack}>
            <i class="ri-arrow-left-line"></i>
          </button>
          <div class="agent-info">
            <i class={`${agent().icon} agent-icon`}></i>
            <span class="agent-name">{agent().name}</span>
          </div>
          <button class="settings-button" onClick={() => setShowSettings(!showSettings())}>
            <i class="ri-settings-3-line"></i>
          </button>
        </header>

        <MessagesArea />
        <ChatInput onSendMessage={handleSendMessage} disabled={isThinking()} />
      </div>

      <Show when={showSettings()}>
        <DropdownPanel 
          title="Agent Settings"
          onClose={() => setShowSettings(false)}
          position="right"
        >
          <div class="settings-content">
            <div class="setting-group">
              <label>Name</label>
              <input
                type="text"
                value={agent().name}
                onChange={(e) => store.updateAgent(agent().id, { name: e.target.value })}
              />
            </div>

            <div class="setting-group">
              <label>Description</label>
              <textarea
                value={agent().description}
                onChange={(e) => store.updateAgent(agent().id, { description: e.target.value })}
              />
            </div>

            <div class="setting-group">
              <label>System Prompt</label>
              <textarea
                value={agent().systemPrompt}
                onChange={(e) => store.updateAgent(agent().id, { systemPrompt: e.target.value })}
                rows="4"
              />
            </div>

            <div class="setting-group">
              <label>Context</label>
              <textarea
                value={agent().context}
                onChange={(e) => store.updateAgent(agent().id, { context: e.target.value })}
                rows="4"
              />
            </div>

            <button class="reset-button" onClick={() => store.resetAgent(agent().id)}>
              Reset Agent
            </button>
          </div>
        </DropdownPanel>
      </Show>

      <style>
        {`
          .chat-header {
            display: flex;
            align-items: center;
            padding: 1rem;
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border-color);
            gap: 1rem;
          }

          .back-button,
          .settings-button {
            background: none;
            border: none;
            padding: 0.5rem;
            cursor: pointer;
            color: var(--text-primary);
            border-radius: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .back-button:hover,
          .settings-button:hover {
            background: var(--bg-secondary);
          }

          .agent-info {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .agent-icon {
            font-size: 1.5rem;
          }

          .agent-name {
            font-weight: 500;
          }

          .settings-content {
            padding: 1rem;
          }

          .setting-group {
            margin-bottom: 1rem;
          }

          .setting-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          .setting-group input,
          .setting-group textarea {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-secondary);
            color: var(--text-primary);
          }

          .reset-button {
            width: 100%;
            padding: 0.5rem;
            background: var(--danger-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
          }

          .reset-button:hover {
            opacity: 0.9;
          }
        `}
      </style>
    </>
  );
}
