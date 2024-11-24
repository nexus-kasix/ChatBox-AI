import Header from '../components/Header/Header'
import MessagesArea from '../components/Chat/MessagesArea'
import ChatInput from '../components/Chat/ChatInput'
import SettingsModal from '../components/Settings/SettingsModal'

function ChatPage() {
  return (
    <>
      <div class="app-container">
        <Header />
        <MessagesArea />
        <ChatInput />
      </div>
      <SettingsModal />
    </>
  )
}

export default ChatPage
