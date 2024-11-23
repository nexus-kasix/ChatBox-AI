import { createSignal } from 'solid-js'
import { selectedModel, models } from './modelStore'

export const MessageType = {
  USER: 'user',
  AI: 'ai',
  ERROR: 'error'
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

  const [chats, setChats] = createSignal(loadChats())
  const [currentChatId, setCurrentChatId] = createSignal(chats()[0].id)

  // Save chats to localStorage
  const saveChats = (newChats) => {
    localStorage.setItem('chatbox_chats', JSON.stringify(newChats))
  }

  const getCurrentChat = () => {
    return chats().find(chat => chat.id === currentChatId()) || chats()[0]
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
    addMessage(content, MessageType.AI)
  }

  const addError = (error) => {
    addMessage(error, MessageType.ERROR)
  }

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }
    const updatedChats = [newChat, ...chats()]
    setChats(updatedChats)
    setCurrentChatId(newChat.id)
    saveChats(updatedChats)
    return newChat
  }

  const switchChat = (chatId) => {
    setCurrentChatId(chatId)
  }

  const deleteChat = (chatId) => {
    const updatedChats = chats().filter(chat => chat.id !== chatId)
    setChats(updatedChats)
    
    // Если удалили текущий чат
    if (chatId === currentChatId()) {
      // Если есть другие чаты, переключаемся на первый
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id)
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
    setCurrentChatId(defaultChat.id)
    localStorage.removeItem('chatbox_chats')
  }

  return {
    chats,
    currentChatId,
    getCurrentChat,
    addMessage,
    addAIResponse,
    addError,
    createNewChat,
    switchChat,
    deleteChat,
    clearChats
  }
}

const store = createStore()
export const useStore = () => store
