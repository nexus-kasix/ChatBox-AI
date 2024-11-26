import { For, Show } from "solid-js";
import { useAgentChatStore } from "../../store/agentChatStore";
import { useAgentStore } from "../../store/agentStore";
import AgentWelcomeScreen from "./AgentWelcomeScreen";
import AgentMessage from "./AgentMessage";
import styles from './AgentMessagesArea.module.css';

export default function AgentMessagesArea() {
  const chatStore = useAgentChatStore();
  const store = useAgentStore();

  const messages = () => {
    const currentChat = chatStore.getCurrentChat();
    return currentChat ? currentChat.messages : [];
  };

  // Добавляем информацию об агенте к сообщениям
  const getMessageWithAgent = (message) => {
    if (message.type === 'ai') {
      return {
        ...message,
        agent: store.currentAgent
      };
    }
    return message;
  };

  return (
    <div class={styles.container}>
      <Show
        when={messages().length > 0}
        fallback={
          <AgentWelcomeScreen
            name={store.currentAgent?.name}
            description={store.currentAgent?.description}
            icon={store.currentAgent?.icon}
          />
        }
      >
        <div class={styles.messagesList}>
          <For each={messages()}>
            {(message) => (
              <AgentMessage message={getMessageWithAgent(message)} />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
