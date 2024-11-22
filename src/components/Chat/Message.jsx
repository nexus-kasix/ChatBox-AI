import { MessageType } from '../../store/chatStore'

export default function Message({ message }) {
  return (
    <div 
      class={`message ${message.type === MessageType.USER ? 'user-message' : 'ai-message'} ${
        message.type === MessageType.ERROR ? 'error-message' : ''
      }`}
    >
      <div class="message-content">
        {message.content}
      </div>
    </div>
  )
}
