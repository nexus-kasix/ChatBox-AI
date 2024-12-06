import './App.css';
import { Router, Route } from "@solidjs/router";
import ChatPage from './pages/ChatPage';
import { AgentChatProvider } from './store/agentChatStore';

function App() {
  return (
    <AgentChatProvider>
      <Router>
        <Route path="/" component={ChatPage} />
      </Router>
    </AgentChatProvider>
  )
}

export default App