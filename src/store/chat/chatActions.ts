import { Conversation, Message } from '../../models/chat.types';

export enum ChatActions {
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  SET_CONVERSATIONS = 'SET_CONVERSATIONS',
  SET_ACTIVE_CONVERSATION = 'SET_ACTIVE_CONVERSATION',
  SET_MESSAGES = 'SET_MESSAGES',
  ADD_MESSAGE = 'ADD_MESSAGE',
  ADD_CONVERSATION = 'ADD_CONVERSATION'
}

export type ChatAction =
  | { type: ChatActions.SET_LOADING }
  | { type: ChatActions.SET_ERROR; payload: string }
  | { type: ChatActions.SET_CONVERSATIONS; payload: Conversation[] }
  | { type: ChatActions.SET_ACTIVE_CONVERSATION; payload: Conversation | null }
  | { type: ChatActions.SET_MESSAGES; payload: Message[] }
  | { type: ChatActions.ADD_MESSAGE; payload: Message }
  | { type: ChatActions.ADD_CONVERSATION; payload: Conversation }; 