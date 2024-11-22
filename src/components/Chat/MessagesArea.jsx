import { For, onMount, createEffect } from 'solid-js'
import { useStore } from '../../store/chatStore'
import Message from './Message'

export default function MessagesArea() {
  const { getCurrentChat } = useStore();
  let messagesRef;

  const scrollToBottom = () => {
    messagesRef.scrollTop = messagesRef.scrollHeight;
  };

  createEffect(() => {
    // Следим за изменениями в сообщениях текущего чата
    getCurrentChat().messages;
    scrollToBottom();
  });

  return (
    <div 
      class="messages-area" 
      ref={messagesRef}
    >
      <For each={getCurrentChat().messages}>
        {(message) => <Message message={message} />}
      </For>
    </div>
  )
}
