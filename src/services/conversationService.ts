import apiClient from '../api/client';
import { Conversation } from '../models/chat.types';
import { User } from '../models/user.types';
import { useAuth } from '../hooks/useAuth';

interface CreateConversationData {
  type: 'direct' | 'group';
  title: string;
  description?: string;
  avatar_url?: string;
  creator: number;
}

interface AddParticipantsData {
  user_ids: number[];
  role: 'member' | 'admin' | 'owner';
}

export const conversationService = {
  async findDirectConversation(user1Id: number, user2Id: number): Promise<Conversation | null> {
    try {
      const response = await apiClient.get<Conversation>(
        `/api/conversations/find-direct/?user1=${user1Id}&user2=${user2Id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createDirectConversation(selectedUser: User, creatorId: number): Promise<Conversation> {
    const createData: CreateConversationData = {
      type: 'direct',
      title: `Chat with ${selectedUser.username}`,
      description: 'Direct conversation',
      creator: creatorId,
    };

    const response = await apiClient.post<Conversation>('/api/conversations/', createData);
    const conversation = response.data;

    await this.addParticipants(conversation.id, {
      user_ids: [selectedUser.id],
      role: 'member'
    });

    return conversation;
  },

  async addParticipants(conversationId: number, data: AddParticipantsData) {
    return apiClient.post(`/api/conversations/${conversationId}/add-participants/`, data);
  }
}; 