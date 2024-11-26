import SimpleHeader from '../components/Common/SimpleHeader';
import AgentMessagesArea from '../components/AgentChat/AgentMessagesArea';
import AgentChatInput from '../components/AgentChat/AgentChatInput';
import SettingsModal from '../components/Settings/SettingsModal';
import { useAgentStore } from '../store/agentStore';
import { useAgentChatStore } from '../store/agentChatStore';
import { useNavigate } from '@solidjs/router';
import { createEffect, onCleanup } from 'solid-js';

export default function AgentChatPage() {
  const navigate = useNavigate();
  const store = useAgentStore();
  const chatStore = useAgentChatStore();

  createEffect(() => {
    if (!store.currentAgent) {
      navigate('/agents');
    } else {
      const agentChats = chatStore.getAgentChats(store.currentAgent.id);
      if (agentChats.length === 0) {
        chatStore.createNewChat(store.currentAgent.id);
      }
    }
  });

  const handleEdit = () => {
    // Временный placeholder
    console.log('Editing agent:', store.currentAgent?.name);
  };

  const handleHistorySelect = (chat) => {
    chatStore.switchChat(store.currentAgent.id, chat.id);
  };

  const handleNewChat = () => {
    if (store.currentAgent) {
      chatStore.createNewChat(store.currentAgent.id);
    }
  };

  // Очищаем текущий чат при размонтировании
  onCleanup(() => {
    chatStore.switchChat(null);
  });

  return (
    <>
      <div class="app-container">
        <SimpleHeader 
          title={store.currentAgent?.name || 'Agent Chat'} 
          backPath="/agents"
          backText="Back to Agents"
          showEdit={true}
          onEdit={handleEdit}
          showHistory={true}
          history={store.currentAgent ? chatStore.getAgentChats(store.currentAgent.id) : []}
          onHistorySelect={handleHistorySelect}
          showNewChat={true}
          onNewChat={handleNewChat}
        />
        <div class="messages-area">
          <AgentMessagesArea />
        </div>
        <AgentChatInput />
      </div>
      <SettingsModal />
    </>
  );
}
