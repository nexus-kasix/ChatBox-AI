/** @jsxImportSource solid-js */
import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const AgentChatContext = createContext();

export function AgentChatProvider(props) {
  const [state, setState] = createStore({
    chats: {},
    currentAgentId: null,
    currentChatId: null
  });

  const store = {
    get chats() {
      return state.chats;
    },
    get currentAgentId() {
      return state.currentAgentId;
    },
    get currentChatId() {
      return state.currentChatId;
    },

    getCurrentChat() {
      if (!state.currentAgentId || !state.currentChatId) return null;
      return state.chats[state.currentAgentId]?.[state.currentChatId];
    },

    getAgentChats(agentId) {
      return Object.entries(state.chats[agentId] || {}).map(([id, chat]) => ({
        id,
        ...chat,
        messages: chat.messages.filter(msg => msg.type !== 'thinking')
      }));
    },

    createNewChat(agentId) {
      const chatId = Date.now().toString();
      setState(prev => {
        const newChats = { ...prev.chats };
        if (!newChats[agentId]) {
          newChats[agentId] = {};
        }
        newChats[agentId][chatId] = {
          messages: [],
          timestamp: Date.now()
        };
        return {
          ...prev,
          chats: newChats,
          currentAgentId: agentId,
          currentChatId: chatId
        };
      });
      return chatId;
    },

    switchChat(agentId, chatId) {
      setState(prev => ({
        ...prev,
        currentAgentId: agentId,
        currentChatId: chatId
      }));
    },

    addMessage(content) {
      if (!state.currentAgentId || !state.currentChatId) return;
      
      const message = {
        id: Date.now(),
        content,
        type: 'user',
        timestamp: Date.now()
      };

      setState(prev => {
        const newChats = { ...prev.chats };
        if (!newChats[state.currentAgentId][state.currentChatId].messages) {
          newChats[state.currentAgentId][state.currentChatId].messages = [];
        }
        newChats[state.currentAgentId][state.currentChatId].messages.push(message);
        return { ...prev, chats: newChats };
      });
    },

    addAIResponse(content) {
      if (!state.currentAgentId || !state.currentChatId) return;

      const message = {
        id: Date.now(),
        content,
        type: 'ai',
        timestamp: Date.now()
      };

      setState(prev => {
        const newChats = { ...prev.chats };
        if (!newChats[state.currentAgentId][state.currentChatId].messages) {
          newChats[state.currentAgentId][state.currentChatId].messages = [];
        }
        newChats[state.currentAgentId][state.currentChatId].messages.push(message);
        return { ...prev, chats: newChats };
      });
    }
  };

  return (
    <AgentChatContext.Provider value={store}>
      {props.children}
    </AgentChatContext.Provider>
  );
}

export function useAgentChatStore() {
  const context = useContext(AgentChatContext);
  if (!context) {
    throw new Error("useAgentChatStore must be used within an AgentChatProvider");
  }
  return context;
}