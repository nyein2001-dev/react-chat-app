import { useState, useEffect, useCallback } from 'react';
import { Message, PaginatedResponse } from '../models/chat/types';
import apiClient from '../api/client';
import { logger } from '../utils/logger';

interface UseMessagesProps {
  conversationId?: number;
  pageSize?: number;
}

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export function useMessages({ conversationId, pageSize = 10 }: UseMessagesProps = {}): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchMessages = async (page: number) => {
    if (!conversationId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<PaginatedResponse<Message>>(
        `/api/messages/?conversation=${conversationId}&page=${page}&page_size=${pageSize}`
      );

      const newMessages = response.data.results;
      if (page === 1) {
        setMessages(newMessages.reverse());
      } else {
        setMessages(prev => [...newMessages.reverse(), ...prev]);
      }

      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page);
      setHasMore(!!response.data.links.next);
    } catch (error: any) {
      logger.error('Failed to fetch messages:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to load messages. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (currentPage < totalPages) {
      await fetchMessages(currentPage + 1);
    }
  };

  const refresh = async () => {
    setCurrentPage(1);
    await fetchMessages(1);
  };

  const refreshMessages = async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      const response = await apiClient.get<PaginatedResponse<Message>>(
         `/api/messages/?conversation=${conversationId}&page=1&page_size=10`
      );
      setMessages(response.data.results.reverse());
      setHasMore(!!response.data.links.next);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error refreshing messages:', error);
      setError('Failed to refresh messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conversationId) {
      setMessages([]);
      setCurrentPage(1);
      fetchMessages(1);
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    refreshMessages
  };
} 