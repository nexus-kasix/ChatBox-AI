import { MessageType } from '../../store/chatStore'
import { models } from '../../store/modelStore'

export default function Message({ message }) {
  const getModelIcon = () => {
    if (!message.model) return '';
    return models[message.model]?.icon || '';
  };

  return (
    <div 
      class={`message ${message.type === MessageType.USER ? 'user-message' : 'ai-message'} ${
        message.type === MessageType.ERROR ? 'error-message' : ''
      }`}
    >
      {message.type === MessageType.USER ? (
        <>
          <div class="message-content">
            {message.content}
          </div>
          <i class="ri-user-line message-icon"></i>
        </>
      ) : message.type === MessageType.ERROR ? (
        <div class="message-content">
          {message.content}
        </div>
      ) : (
        <>
          <i class={`${getModelIcon()} message-icon`}></i>
          <div class="message-content">
            {message.content}
          </div>
        </>
      )}
    </div>
  )
}
