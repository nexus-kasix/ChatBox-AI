import MessagesArea from './MessagesArea'
import ChatInput from './ChatInput'

export default function ChatContainer() {
  return (
    <div style={{
      'width': '100%',
      'max-width': 'var(--max-width)',
      'margin': '0 auto',
      'height': '100%',
      'display': 'flex',
      'flex-direction': 'column',
      'position': 'relative',
      'overflow': 'hidden'
    }}>
      <MessagesArea />
      <ChatInput />
    </div>
  )
}
