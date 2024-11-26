import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const AgentChatContext = createContext({});

export function AgentChatProvider(props) {
  const [chats, setChats] = createStore({});
  const [currentAgentId, setCurrentAgentId] = createStore(null);
  const [currentChatId, setCurrentChatId] = createStore(null);

  const store = {
    chats,
    currentAgentId,
    currentChatId,
    
    getCurrentChat() {
      if (!currentAgentId || !currentChatId) return null;
      return chats[currentAgentId]?.[currentChatId];
    },

    getAgentChats(agentId) {
      return Object.entries(chats[agentId] || {}).map(([id, chat]) => ({
        id,
        ...chat,
        messages: chat.messages.filter(msg => msg.type !== 'thinking')
      }));
    },

    createNewChat(agentId) {
      const chatId = Date.now().toString();
      setChats(prev => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          [chatId]: {
            messages: [],
            timestamp: Date.now()
          }
        }
      }));
      setCurrentAgentId(agentId);
      setCurrentChatId(chatId);
    },

    switchChat(agentId, chatId) {
      setCurrentAgentId(agentId);
      setCurrentChatId(chatId);
    },

    addMessage(content) {
      const message = {
        id: Date.now(),
        content,
        type: 'user',
        timestamp: Date.now()
      };

      setChats(prev => ({
        ...prev,
        [currentAgentId]: {
          ...prev[currentAgentId],
          [currentChatId]: {
            ...prev[currentAgentId][currentChatId],
            messages: [...prev[currentAgentId][currentChatId].messages, message]
          }
        }
      }));
    },

    addAIResponse(content) {
      const message = {
        id: Date.now(),
        content,
        type: 'ai',
        timestamp: Date.now()
      };

      setChats(prev => ({
        ...prev,
        [currentAgentId]: {
          ...prev[currentAgentId],
          [currentChatId]: {
            ...prev[currentAgentId][currentChatId],
            messages: [...prev[currentAgentId][currentChatId].messages, message]
          }
        }
      }));
    }
  };

  const Provider = AgentChatContext.Provider;
  return Provider({ value: store, children: props.children });
}

export function useAgentChatStore() {
  const context = useContext(AgentChatContext);
  if (!context) {
    throw new Error("useAgentChatStore must be used within an AgentChatProvider");
  }
  return context;
}