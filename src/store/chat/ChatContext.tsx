import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Conversation, Message } from '../../models/chat.types';
import { StoreState } from '../types';
import { chatReducer, initialState } from './chatReducer';
import { ChatActions } from './chatActions';
import apiClient from '../../api/client';
import { useSocket } from '../../context/SocketContext';
import { logger } from '../../utils/logger';
import { conversationService } from '../../services/conversationService';
import { User } from '../../models/user.types';
import { useAuth } from '../../hooks/useAuth';

interface ChatContextType extends StoreState<{
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
}> {
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (params: SendMessageParams) => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
  dispatch: React.Dispatch<any>;
  createOrFindDirectConversation: (user: User) => Promise<Conversation>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface SendMessageParams {
  conversationId: number;
  content: string;
  type?: 'text' | 'image' | 'file';
  replyTo?: number | null;
  metadata?: any;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { sendMessage: sendWebSocketMessage } = useSocket();
  const { user } = useAuth();

  const fetchConversations = useCallback(async () => {
    try {
      dispatch({ type: ChatActions.SET_LOADING });
      const response = await apiClient.get('/conversations');
      dispatch({ type: ChatActions.SET_CONVERSATIONS, payload: response.data });
    } catch (error) {
      throw error;
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      dispatch({ type: ChatActions.SET_LOADING });
      const response = await apiClient.get(`/conversations/${conversationId}/messages`);
      dispatch({ type: ChatActions.SET_MESSAGES, payload: response.data });
    } catch (error) {
      throw error;
    }
  }, []);

  const sendMessage = useCallback(async ({
    conversationId,
    content,
    type = 'text',
    replyTo = null,
    metadata = null
  }: SendMessageParams) => {
    try {
      const response = await apiClient.post('/api/messages/', {
        conversation: conversationId,
        type,
        content,
        reply_to: replyTo,
        metadata,
        is_edited: false
      });

      dispatch({ type: ChatActions.ADD_MESSAGE, payload: response.data });

      return response.data;
    } catch (error) {
      logger.error('Failed to send message:', error);
      throw error;
    }
  }, []);

  const setActiveConversation = useCallback((conversation: Conversation | null) => {
    dispatch({ type: ChatActions.SET_ACTIVE_CONVERSATION, payload: conversation });
  }, []);

  const createOrFindDirectConversation = async (selectedUser: User) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const existingConversation = await conversationService.findDirectConversation(
        user.id,
        selectedUser.id
      );

      if (existingConversation) {
        dispatch({ 
          type: ChatActions.SET_ACTIVE_CONVERSATION, 
          payload: existingConversation 
        });
        return existingConversation;
      }

      const newConversation = await conversationService.createDirectConversation(
        selectedUser,
        user.id
      );

      dispatch({ 
        type: ChatActions.ADD_CONVERSATION, 
        payload: newConversation 
      });
      
      return newConversation;
    } catch (error) {
      console.error('Error creating/finding conversation:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setActiveConversation,
    dispatch,
    createOrFindDirectConversation,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 