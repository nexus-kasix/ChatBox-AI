import { For, onMount, createEffect, Show } from 'solid-js'
import { useStore } from '../../store/chatStore'
import Message from './Message'
import WelcomeScreen from './WelcomeScreen'

export default function MessagesArea() {
  const { getCurrentChat } = useStore();
  let messagesRef;

  const scrollToBottom = () => {
    if (messagesRef) {
      messagesRef.scrollTop = messagesRef.scrollHeight;
    }
  };

  createEffect(() => {
    const currentChat = getCurrentChat();
    if (currentChat && currentChat.messages) {
      // Следим за изменениями в сообщениях текущего чата
      currentChat.messages;
      scrollToBottom();
    }
  });

  return (
    <div 
      class="messages-area" 
      ref={messagesRef}
    >
      <Show
        when={getCurrentChat()?.messages?.length > 0}
        fallback={<WelcomeScreen />}
      >
        <For each={getCurrentChat()?.messages || []}>
          {(message) => <Message message={message} />}
        </For>
      </Show>
    </div>
  )
}
