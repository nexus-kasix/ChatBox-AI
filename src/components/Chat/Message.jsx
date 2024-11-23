import { createSignal } from 'solid-js'
import { MessageType } from "../../store/chatStore"
import { models } from "../../store/modelStore"
import { marked } from "marked"

export default function Message({ message }) {
  const [isCopied, setIsCopied] = createSignal(false)
  const [isHovered, setIsHovered] = createSignal(false)

  const getModelIcon = () => {
    if (!message.model) return ""
    return models[message.model]?.icon || ""
  }

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div 
      class={`message ${message.type === MessageType.USER ? "user-message" : "ai-message"} ${
        message.type === MessageType.ERROR ? "error-message" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {message.type === MessageType.USER ? (
        <>
          <div class="message-content">{message.content}</div>
          <i class="ri-user-line message-icon"></i>
        </>
      ) : message.type === MessageType.ERROR ? (
        <div class="message-content">{message.content}</div>
      ) : (
        <div class="message-wrapper">
          <i class={`${getModelIcon()} message-icon`}></i>
          <div class="message-content">
            <div innerHTML={marked(message.content)} />
          </div>
          <button 
            class={`copy-button ${isHovered() ? 'visible' : ''} ${isCopied() ? 'copied' : ''}`}
            onClick={copyText}
            title={isCopied() ? 'Copied!' : 'Copy to clipboard'}
          >
            <i class={`ri-${isCopied() ? 'check-line' : 'file-copy-line'}`}></i>
          </button>
        </div>
      )}
    </div>
  )
}
