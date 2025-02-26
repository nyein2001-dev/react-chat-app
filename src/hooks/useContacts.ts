import { useState, useEffect, useCallback } from 'react';
import { User } from '../models/user/types';
import { PaginatedResponse } from '../models/chat/types';
import apiClient from '../api/client';

interface UseContactsReturn {
  contacts: User[];
  totalContacts: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadMore: () => Promise<void>;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export function useContacts(pageSize = 10): UseContactsReturn {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchContacts = async (page: number, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }

      const response = await apiClient.get<PaginatedResponse<User>>(`/api/users/?${params}`);
      
      setTotalContacts(response.data.count);
      setTotalPages(response.data.total_pages);
      
      if (page === 1) {
        setContacts(response.data.results);
      } else {
        setContacts(prev => [...prev, ...response.data.results]);
      }
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchContacts(1, searchQuery);
  }, [searchQuery]);

  const loadMore = async () => {
    if (currentPage < totalPages) {
      await fetchContacts(currentPage + 1, searchQuery);
      setCurrentPage(prev => prev + 1);
    }
  };

  const toggleExpanded = () => setIsExpanded(prev => !prev);

  return {
    contacts,
    totalContacts,
    loading,
    error,
    hasMore: currentPage < totalPages,
    searchQuery,
    setSearchQuery,
    loadMore,
    isExpanded,
    toggleExpanded,
  };
} 