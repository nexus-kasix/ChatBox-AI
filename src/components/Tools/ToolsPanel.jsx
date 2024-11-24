import { createSignal } from 'solid-js';
import { useNavigate } from "@solidjs/router";
import DropdownPanel from '../Common/DropdownPanel';

export default function ToolsPanel() {
  const [isOpen, setIsOpen] = createSignal(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div class="dropdown-container">
      <button class="top-button" onClick={() => setIsOpen(!isOpen())}>
        <i class="ri-tools-line"></i>
        <span>Tools</span>
      </button>

      <DropdownPanel 
        isOpen={isOpen()} 
        title="Tools" 
        onClose={() => setIsOpen(false)}
      >
        <div class="dropdown-list">
          <button class="dropdown-item" onClick={() => handleNavigation('/')}>
            <i class="ri-message-3-line"></i>
            <span>Chat</span>
          </button>
          <button class="dropdown-item" onClick={() => handleNavigation('/stones')}>
            <i class="ri-at-line"></i>
            <span>Stones</span>
          </button>
          <button class="dropdown-item" onClick={() => handleNavigation('/agents')}>
            <i class="ri-robot-line"></i>
            <span>Agents</span>
          </button>
        </div>
      </DropdownPanel>
    </div>
  );
}
