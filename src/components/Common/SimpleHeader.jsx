import { useNavigate } from '@solidjs/router';
import DropdownPanel from '../Common/DropdownPanel';
import { createSignal } from 'solid-js';

export default function SimpleHeader(props) {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = createSignal(false);

  const handleEdit = () => {
    if (props.onEdit) {
      props.onEdit();
    }
  };

  const handleNewChat = () => {
    if (props.onNewChat) {
      props.onNewChat();
    }
  };

  return (
    <div class="top-panel">
      <div class="logo">{props.title || 'ChatBox AI'}</div>
      <div class="top-buttons">
        {props.backPath && (
          <button class="top-button" onClick={() => navigate(props.backPath)}>
            <i class="ri-arrow-left-line"></i>
            <span>{props.backText || 'Back'}</span>
          </button>
        )}
        
        {props.showNewChat && (
          <button class="top-button" onClick={handleNewChat}>
            <i class="ri-add-line"></i>
            <span>New Chat</span>
          </button>
        )}

        {props.showHistory && (
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
              <div class="dropdown-list">
                {props.history?.map((item, index) => (
                  <div class="dropdown-item" onClick={() => {
                    if (props.onHistorySelect) {
                      props.onHistorySelect(item);
                      setIsHistoryOpen(false);
                    }
                  }}>
                    <span class="history-title">
                      {item.title || `Chat ${index + 1}`}
                    </span>
                    <span class="history-date">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {(!props.history || props.history.length === 0) && (
                  <div class="dropdown-item">
                    <span class="history-title">No history yet</span>
                  </div>
                )}
              </div>
            </DropdownPanel>
          </div>
        )}

        {props.showEdit && (
          <button class="top-button" onClick={handleEdit}>
            <i class="ri-edit-line"></i>
            <span>Edit</span>
          </button>
        )}
      </div>
    </div>
  );
}
