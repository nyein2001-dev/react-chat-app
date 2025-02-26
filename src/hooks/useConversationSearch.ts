import { useState, useCallback, useEffect } from 'react';
import { Conversation, PaginatedResponse } from '../models/chat/types';
import apiClient from '../api/client';
import { logger } from '../utils/logger';
import { debounce } from 'lodash';

interface UseConversationSearchReturn {
  searchResults: Conversation[];
  loading: boolean;
  error: string | null;
  searchConversations: (query: string) => void;
}

export function useConversationSearch(): UseConversationSearchReturn {
  const [searchResults, setSearchResults] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<PaginatedResponse<Conversation>>(
        `/api/conversations/?search=${encodeURIComponent(query)}`
      );

      setSearchResults(response.data.results);
    } catch (error: any) {
      logger.error('Failed to search conversations:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to search conversations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => fetchSearchResults(query), 300),
    []
  );

  const searchConversations = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    searchResults,
    loading,
    error,
    searchConversations,
  };
} 