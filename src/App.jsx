import './App.css'
import Header from './components/Header/Header'
import MessagesArea from './components/Chat/MessagesArea'
import ChatInput from './components/Chat/ChatInput'
import SettingsModal from './components/Settings/SettingsModal'

function App() {
  return (
    <div class="app">
      <Header />
      <MessagesArea />
      <ChatInput />
      <SettingsModal />
    </div>
  )
}

export default App