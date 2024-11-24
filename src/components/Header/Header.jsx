import { createSignal } from 'solid-js';
import { setIsSettingsOpen } from '../../store/settingsStore';
import { useStore } from '../../store/chatStore';
import DropdownPanel from '../Common/DropdownPanel';

export default function Header() {
  const [isHistoryOpen, setIsHistoryOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [editingChatId, setEditingChatId] = createSignal(null);
  const [editingTitle, setEditingTitle] = createSignal('');
  const { chats, currentChatId, createNewChat, switchChat, deleteChat, renameChat, searchChats } = useStore();

  const filteredChats = () => searchChats(searchQuery());

  const startEditing = (chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveTitle = () => {
    if (editingTitle().trim()) {
      renameChat(editingChatId(), editingTitle().trim());
    }
    setEditingChatId(null);
  };

  return (
    <div class="top-panel">
      <div class="logo">ChatBox AI</div>
      <div class="top-buttons">
        <button class="top-button" onClick={createNewChat}>
          <i class="ri-add-line"></i>
          <span>New Chat</span>
        </button>

        <div class="dropdown-container">
          <button class="top-button" onClick={() => setIsHistoryOpen(!isHistoryOpen())}>
            <i class="ri-history-line"></i>
            <span>History</span>
          </button>

          <DropdownPanel 
            isOpen={isHistoryOpen()} 
            title="Chat History" 
            onClose={() => setIsHistoryOpen(false)}
          >
            <div class="search-container">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.target.value)}
                class="search-input"
              />
            </div>
            <div class="dropdown-list">
              {filteredChats().map(chat => (
                <div 
                  class={`dropdown-item ${chat.id === currentChatId() ? 'active' : ''}`}
                  onClick={() => {
                    if (!editingChatId()) {
                      switchChat(chat.id);
                      setIsHistoryOpen(false);
                    }
                  }}
                >
                  {editingChatId() === chat.id ? (
                    <input
                      type="text"
                      value={editingTitle()}
                      onInput={(e) => setEditingTitle(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') saveTitle();
                        if (e.key === 'Escape') setEditingChatId(null);
                      }}
                      onBlur={saveTitle}
                      class="edit-title-input"
                      onClick={(e) => e.stopPropagation()}
                      autofocus
                    />
                  ) : (
                    <span class="history-title">
                      {chat.title}
                    </span>
                  )}
                  <div class="history-buttons">
                    <button 
                      class="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(chat);
                      }}
                    >
                      <i class="ri-pencil-line"></i>
                    </button>
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
                </div>
              ))}
            </div>
          </DropdownPanel>
        </div>

        <button class="top-button" onClick={() => setIsSettingsOpen(true)}>
          <i class="ri-settings-3-line"></i>
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
