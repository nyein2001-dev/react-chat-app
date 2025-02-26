import { useCallback } from 'react';
import { useUser } from '../store/user/UserContext';
import { auth } from '../utils/auth';
import { LoginData, RegisterData } from '../models/auth/types';

export function useAuth() {
  const { data: user, isLoading, login, logout, register: userRegister } = useUser();

  const isAuthenticated = useCallback(() => {
    return !!user && auth.isAuthenticated();
  }, [user]);

  const register = async (data: RegisterData) => {
    await userRegister(data);
  };

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    register: userRegister,
  };
} 