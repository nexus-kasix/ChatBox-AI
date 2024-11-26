import { useAgentStore } from '../../store/agentStore';
import { useNavigate } from '@solidjs/router';

export default function AgentCard({ agent }) {
  const store = useAgentStore();
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    store.deleteAgent(agent.id);
  };

  const handleCardClick = () => {
    store.setCurrentAgent(agent);
    navigate('/agent-chat');
  };

  return (
    <div class="agent-card" onClick={handleCardClick}>
      <div class="agent-content">
        <i class={`${agent.icon} agent-icon`}></i>
        <div class="agent-info">
          <h3 class="agent-name">{agent.name}</h3>
          <p class="agent-description">{agent.description}</p>
        </div>
      </div>
      <div class="agent-actions">
        {agent.id !== 'default' && (
          <button 
            class="action-button delete-button" 
            onClick={handleDelete}
          >
            <i class="ri-delete-bin-line"></i>
          </button>
        )}
      </div>
    </div>
  );
}
