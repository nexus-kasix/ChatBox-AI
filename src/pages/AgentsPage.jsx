import AgentsHeader from '../components/Agents/AgentsHeader'
import AgentCard from '../components/Agents/AgentCard'
import { createSignal } from 'solid-js'

export default function AgentsPage() {
  const [agents] = createSignal([
    {
      id: 1,
      name: 'Coder',
      description: 'Powered by Codestral',
      icon: 'ri-code-line'
    },
    {
      id: 2,
      name: 'Coder+',
      description: 'Powered by Gemini exp 1121, provides the best experience',
      icon: 'ri-code-box-line'
    },
    {
      id: 3,
      name: 'Teacher',
      description: 'Powered by LearnLM 1.5 Pro',
      icon: 'ri-book-open-line'
    },
    {
      id: 4,
      name: 'Cooker',
      description: 'Powered by Gemini 1.5 Pro',
      icon: 'ri-restaurant-line'
    }
  ])

  const handleDelete = (id) => {
    console.log('Delete agent:', id)
  }

  const handleEdit = (id) => {
    console.log('Edit agent:', id)
  }

  return (
    <div class="app">
      <div class="app-container">
        <AgentsHeader />
        <main class="main-content">
          <div class="agents-grid">
            {agents().map(agent => (
              <AgentCard
                agent={agent}
                onDelete={() => handleDelete(agent.id)}
                onEdit={() => handleEdit(agent.id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
