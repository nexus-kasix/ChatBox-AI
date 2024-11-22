import { createSignal } from 'solid-js';
import { setIsSettingsOpen } from '../../store/settingsStore';
import { useStore } from '../../store/chatStore';

export default function Header() {
  const [isHistoryOpen, setIsHistoryOpen] = createSignal(false);
  const { chats, currentChatId, createNewChat, switchChat, deleteChat } = useStore();

  return (
    <div class="top-panel">
      <div class="logo">ChatBox AI</div>
      <div class="top-buttons">
        <button class="top-button" onClick={createNewChat}>
          <i class="ri-add-line"></i>
          <span>New Chat</span>
        </button>
        <div style="position: relative;">
          <button class="top-button" onClick={() => setIsHistoryOpen(!isHistoryOpen())}>
            <i class="ri-history-line"></i>
            <span>History</span>
          </button>

          {/* History Panel */}
          <div class={`history-panel ${isHistoryOpen() ? 'open' : ''}`}>
            <div class="history-header">
              <h3>Chat History</h3>
              <button class="close-button" onClick={() => setIsHistoryOpen(false)}>
                <i class="ri-close-line"></i>
              </button>
            </div>
            <div class="history-list">
              {chats().map(chat => (
                <div 
                  class={`history-item ${chat.id === currentChatId() ? 'active' : ''}`}
                  onClick={() => {
                    switchChat(chat.id);
                    setIsHistoryOpen(false);
                  }}
                >
                  <span class="history-title">{chat.title}</span>
                  <button 
                    class="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                  >
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button class="top-button" onClick={() => setIsSettingsOpen(true)}>
          <i class="ri-settings-3-line"></i>
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}
