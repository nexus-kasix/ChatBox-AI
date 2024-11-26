import { useNavigate } from '@solidjs/router';
import { useAgentStore } from '../../store/agentStore';

export default function AgentsHeader() {
  const navigate = useNavigate();
  const store = useAgentStore();

  const handleAddAgent = () => {
    const newAgent = {
      name: 'New Agent',
      description: 'Custom agent for specific tasks',
      icon: 'ri-robot-line',
      model: 'gpt-3.5-turbo',
      systemPrompt: 'You are a helpful assistant.',
      context: ''
    };
    
    store.addAgent(newAgent);
  };

  return (
    <div class="top-panel">
      <div class="logo">ChatBox AI</div>
      <div class="top-buttons">
        <button class="top-button" onClick={() => navigate('/')}>
          <i class="ri-arrow-left-line"></i>
          <span>Back to Chat</span>
        </button>

        <button class="top-button" onClick={handleAddAgent}>
          <i class="ri-add-line"></i>
          <span>New Agent</span>
        </button>
      </div>
    </div>
  );
}
