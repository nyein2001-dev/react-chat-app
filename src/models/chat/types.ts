import { User } from '../user/types';

export interface MessageReactions {
  reactions: string[];
}

export interface Message {
  id: number;
  conversation: number;
  sender: User;
  reply_to: number | null;
  type: 'text' | 'image' | 'file';
  content: string;
  metadata: any | null;
  is_edited: boolean;
  delivered_at: string | null;
  read_by: any | null;
  reactions: MessageReactions | null;
  created_at: string;
}

export interface Participant {
  id: number;
  conversation: number;
  user: User;
  role: 'owner' | 'member';
  nickname: string | null;
  last_read_message: number | null;
  is_muted: boolean;
  joined_at: string;
}

export interface Conversation {
  id: number;
  type: 'direct' | 'group';
  title: string;
  description: string;
  avatar_url: string | null;
  creator: number;
  participants: Participant[];
  last_message: any | null;
  last_activity_at: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  total_pages: number;
  current_page: number;
  results: T[];
} 