import { User } from './user.types';

export interface Participant {
  id: number;
  conversation: number;
  user: User;
  role: 'owner' | 'admin' | 'member';
  nickname?: string | null;
  last_read_message?: number | null;
  is_muted: boolean;
  joined_at: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  conversationId: string;
  createdAt: string;
}

export interface Conversation {
  id: number;
  type: 'direct' | 'group';
  title: string;
  description?: string;
  avatar_url?: string;
  creator: number;
  participants: Participant[];
  last_message?: Message | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export type MessageType = 'text' | 'image' | 'file';
export type MessageStatus = 'sent' | 'delivered' | 'read'; 