import { createStore } from 'solid-js/store';
import { createSignal } from 'solid-js';

const defaultAgent = {
  id: 'default',
  name: 'Default Agent',
  description: 'A general-purpose assistant',
  icon: 'ri-robot-line',
  model: 'gpt-3.5-turbo',
  systemPrompt: 'You are a helpful assistant.',
  context: '',
};



const [agents, setAgents] = createSignal(
  JSON.parse(localStorage.getItem('agents')) || []
);

const [currentAgent, setCurrentAgent] = createSignal(null);

export function useAgentStore() {
  const saveAgents = () => {
    localStorage.setItem('agents', JSON.stringify(agents()));
  };

  const addAgent = (agent) => {
    const newAgent = { ...agent, id: Date.now().toString() };
    setAgents([...agents(), newAgent]);
    saveAgents();
  };

  const updateAgent = (agentId, updates) => {
    setAgents(
      agents().map((agent) =>
        agent.id === agentId ? { ...agent, ...updates } : agent
      )
    );
    saveAgents();
  };

  const deleteAgent = (agentId) => {
    setAgents(agents().filter((agent) => agent.id !== agentId));
    saveAgents();
  };

  const resetAgent = (agentId) => {
    const defaultData = defaultAgent;
    if (defaultData) {
      updateAgent(agentId, defaultData);
    }
  };

  return {
    agents,
    get currentAgent() {
      return currentAgent();
    },
    setCurrentAgent,
    addAgent,
    updateAgent,
    deleteAgent,
    resetAgent
  };
}

export default useAgentStore;
