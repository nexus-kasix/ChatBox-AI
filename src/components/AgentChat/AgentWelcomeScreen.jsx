import { useAgentStore } from '../../store/agentStore';

export default function AgentWelcomeScreen() {
  const store = useAgentStore();
  const agent = store.currentAgent;

  return (
    <div class="messages-content">
      <div class="welcome-screen">
        <div class="welcome-agent-icon">
          <i class={agent?.icon}></i>
        </div>
        <h1 class="welcome-title">{agent?.name || 'AI Agent'}</h1>
        <p class="welcome-text">
          {agent?.description || 'Start chatting with your AI agent'}
        </p>
      </div>
    </div>
  );
}
