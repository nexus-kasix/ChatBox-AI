import { createSignal } from "solid-js";
import { useAgentChatStore } from "../../store/agentChatStore";
import { useAgentStore } from "../../store/agentStore";

export default function AgentChatInput() {
  const [message, setMessage] = createSignal("");
  const chatStore = useAgentChatStore();
  const store = useAgentStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageText = message().trim();
    if (messageText) {
      // Создаем новый чат, если нет текущего
      if (!chatStore.getCurrentChat()) {
        chatStore.createNewChat(store.currentAgent.id);
      }

      chatStore.addMessage(messageText);
      setMessage("");
      chatStore.showThinking();

      // Временный ответ агента (пока нет реальной интеграции)
      setTimeout(() => {
        chatStore.clearThinking();
        chatStore.addAIResponse("This is a placeholder response from the agent. Real AI integration coming soon!");
      }, 1000);
    }
  };

  return (
    <div class="input-panel">
      <form class="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message()}
          onInput={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          disabled={!store.currentAgent}
        />
        <button 
          type="submit" 
          class="send-button" 
          disabled={!store.currentAgent || message().trim().length === 0}
        >
          <span>Send</span>
          <i class="ri-send-plane-fill"></i>
        </button>
      </form>
    </div>
  );
}
