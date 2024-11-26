import { createSignal } from 'solid-js'
import { selectedModel, models } from './modelStore'

export const MessageType = {
  USER: 'user',
  AI: 'ai',
  ERROR: 'error',
  THINKING: 'thinking'
}

const createStore = () => {
  // Load chats from localStorage or create default
  const loadChats = () => {
    const savedChats = localStorage.getItem('chatbox_chats')
    return savedChats ? JSON.parse(savedChats) : [{
      id: 'default',
      title: 'New Chat',
      messages: []
    }]
  }

  const savedChats = loadChats()
  const savedCurrentId = localStorage.getItem('chatbox_current_chat')
  
  const [chats, setChats] = createSignal(savedChats)
  const [currentChatId, setCurrentChatId] = createSignal(
    savedCurrentId && savedChats.find(chat => chat.id === savedCurrentId) 
      ? savedCurrentId 
      : savedChats[0].id
  )

  // Save chats to localStorage
  const saveChats = (newChats) => {
    localStorage.setItem('chatbox_chats', JSON.stringify(newChats))
  }

  const getCurrentChat = () => {
    return chats().find(chat => chat.id === currentChatId()) || chats()[0]
  }

  const renameChat = (chatId, newTitle) => {
    const updatedChats = chats().map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    )
    setChats(updatedChats)
    saveChats(updatedChats)
  }

  const searchChats = (query) => {
    if (!query) return chats()
    const lowerQuery = query.toLowerCase()
    return chats().filter(chat => 
      chat.title.toLowerCase().includes(lowerQuery) ||
      chat.messages.some(msg => 
        msg.type === MessageType.USER && 
        msg.content.toLowerCase().includes(lowerQuery)
      )
    )
  }

  const addMessage = (content, type = MessageType.USER) => {
    const newMessage = { 
      id: Date.now(), 
      content, 
      type,
      model: type === MessageType.AI ? selectedModel() : null 
    }
    const updatedChats = chats().map(chat => {
      if (chat.id === currentChatId()) {
        // Update chat title based on first user message if it's "New Chat"
        let title = chat.title
        if (title === 'New Chat' && type === MessageType.USER) {
          title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
        }
        return {
          ...chat,
          title,
          messages: [...chat.messages, newMessage]
        }
      }
      return chat
    })
    setChats(updatedChats)
    saveChats(updatedChats)
  }

  const addAIResponse = (content) => {
    // First clear any thinking messages
    const updatedChats = chats().map(chat => {
      if (chat.id === currentChatId()) {
        return {
          ...chat,
          messages: chat.messages.filter(msg => msg.type !== MessageType.THINKING)
        }
      }
      return chat
    })
    setChats(updatedChats)
    
    // Then add the AI response
    addMessage(content, MessageType.AI)
  }

  const addError = (error) => {
    addMessage(error, MessageType.ERROR)
  }

  const showThinking = () => {
    const thinkingMessage = {
      id: Date.now(),
      content: '',
      type: MessageType.THINKING,
      model: selectedModel()
    }
    const updatedChats = chats().map(chat => {
      if (chat.id === currentChatId()) {
        return {
          ...chat,
          messages: [...chat.messages, thinkingMessage]
        }
      }
      return chat
    })
    setChats(updatedChats)
  }

  const clearThinking = () => {
    const updatedChats = chats().map(chat => {
      if (chat.id === currentChatId()) {
        return {
          ...chat,
          messages: chat.messages.filter(msg => msg.type !== MessageType.THINKING)
        }
      }
      return chat
    })
    setChats(updatedChats)
  }

  const switchChat = (chatId) => {
    if (chats().find(chat => chat.id === chatId)) {
      setCurrentChatId(chatId)
      localStorage.setItem('chatbox_current_chat', chatId)
    }
  }

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }
    const updatedChats = [newChat, ...chats()]  // Новые чаты добавляем в начало списка
    setChats(updatedChats)
    setCurrentChatId(newChat.id)
    saveChats(updatedChats)
    localStorage.setItem('chatbox_current_chat', newChat.id)
    return newChat
  }

  const deleteChat = (chatId) => {
    const updatedChats = chats().filter(chat => chat.id !== chatId)
    setChats(updatedChats)
    
    // Если удалили текущий чат
    if (chatId === currentChatId()) {
      // Если есть другие чаты, переключаемся на первый
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id)
        localStorage.setItem('chatbox_current_chat', updatedChats[0].id)
      } else {
        // Если чатов не осталось, создаем новый
        const newChat = createNewChat()
        setChats([newChat])
        setCurrentChatId(newChat.id)
      }
    }
    saveChats(updatedChats)
  }

  // Функция для очистки всех чатов
  const clearChats = () => {
    const defaultChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }
    setChats([defaultChat])
    switchChat(defaultChat.id)
    localStorage.removeItem('chatbox_chats')
    localStorage.removeItem('chatbox_current_chat')
  }

  return {
    chats,
    currentChatId,
    getCurrentChat,
    renameChat,
    searchChats,
    addMessage,
    addAIResponse,
    addError,
    showThinking,
    clearThinking,
    createNewChat,
    switchChat,
    deleteChat,
    clearChats
  }
}

const store = createStore()
export const useStore = () => store
