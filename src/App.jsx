import './App.css'
import { Router, Route } from "@solidjs/router"
import ChatPage from './pages/ChatPage'
import AgentsPage from './pages/AgentsPage'
import StonesPage from './pages/StonesPage'

function App() {
  return (
    <div class="app">
      <Router>
        <Route path="/" component={ChatPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/stones" component={StonesPage} />
      </Router>
    </div>
  )
}

export default App