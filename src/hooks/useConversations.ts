import { useState, useEffect } from 'react';
import { Conversation, PaginatedResponse } from '../models/chat/types';
import apiClient from '../api/client';
import { useAuth } from './useAuth';
import { logger } from '../utils/logger';

interface UseConversationsProps {
  pageSize?: number;
}

interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useConversations({ pageSize = 10 }: UseConversationsProps = {}): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useAuth();

  const fetchConversations = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<PaginatedResponse<Conversation>>(
        `/api/conversations/?page=${page}&page_size=${pageSize}`
      );

      if (page === 1) {
        setConversations(response.data.results);
      } else {
        setConversations(prev => [...prev, ...response.data.results]);
      }

      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.current_page);
    } catch (error: any) {
      logger.error('Failed to fetch conversations:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to load conversations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (currentPage < totalPages) {
      await fetchConversations(currentPage + 1);
    }
  };

  const refreshConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<PaginatedResponse<Conversation>>(
        `/api/conversations/?page=1&page_size=${pageSize}`
      );
      setConversations(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(1);
    } catch (error: any) {
      logger.error('Failed to refresh conversations:', error);
      setError('Failed to refresh conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations(1);
    }
  }, [isAuthenticated]);

  return {
    conversations,
    loading,
    error,
    totalPages,
    currentPage,
    hasMore: currentPage < totalPages,
    loadMore,
    refresh: refreshConversations,
  };
} 