import './App.css'
import { Router, Route } from "@solidjs/router"
import ChatPage from './pages/ChatPage'
import AgentsPage from './pages/AgentsPage'
import StonesPage from './pages/StonesPage'
import AgentChatPage from './pages/AgentChatPage'
import { AgentChatProvider } from './store/agentChatStore';

function App() {
  return (
    <AgentChatProvider>
      <Router>
        <Route path="/" component={ChatPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/stones" component={StonesPage} />
        <Route path="/agent-chat" component={AgentChatPage} />
      </Router>
    </AgentChatProvider>
  )
}

export default App