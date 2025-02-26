import { Conversation, Message } from '../../models/chat.types';
import { StoreState } from '../types';
import { ChatAction, ChatActions } from './chatActions';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
}

export const initialState: StoreState<ChatState> = {
  isLoading: false,
  error: null,
  data: {
    conversations: [],
    activeConversation: null,
    messages: [],
  },
};

export function chatReducer(
  state: StoreState<ChatState>,
  action: ChatAction
): StoreState<ChatState> {
  switch (action.type) {
    case ChatActions.SET_LOADING:
      return { ...state, isLoading: true, error: null };
    case ChatActions.SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case ChatActions.SET_CONVERSATIONS:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: { ...state.data, conversations: action.payload },
      };
    case ChatActions.SET_ACTIVE_CONVERSATION:
      return {
        ...state,
        data: { ...state.data, activeConversation: action.payload },
      };
    case ChatActions.SET_MESSAGES:
      return {
        ...state,
        isLoading: false,
        error: null,
        data: { ...state.data, messages: action.payload },
      };
    case ChatActions.ADD_MESSAGE:
      return {
        ...state,
        data: {
          ...state.data,
          messages: [...state.data.messages, action.payload],
        },
      };
    case ChatActions.ADD_CONVERSATION:
      return {
        ...state,
        data: {
          ...state.data,
          conversations: [action.payload, ...state.data.conversations]
        }
      };
    default:
      return state;
  }
} 