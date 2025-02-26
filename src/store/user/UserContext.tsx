import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { User } from '../../models/user/types';
import { RegisterData, RegisterResponse, LoginData, LoginResponse } from '../../models/auth/types';
import { StoreState } from '../types';
import { userReducer, initialState } from './userReducer';
import { UserActions } from './userActions';
import apiClient from '../../api/client';
import { logger } from '../../utils/logger';
import { auth } from '../../utils/auth';
import { clearAvatarCaches } from '../../utils/avatar';

interface UserContextType extends StoreState<User | null> {
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const mapApiUserToUser = (apiUser: User): User => ({
  ...apiUser,
  isOnline: apiUser.status === 'online'
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch({ type: UserActions.SET_LOADING });
        
        if (!auth.isAuthenticated()) {
          auth.clearTokens();
          dispatch({ type: UserActions.CLEAR_USER });
          return;
        }

        const response = await apiClient.get<User>('/api/users/me/');
        dispatch({ 
          type: UserActions.SET_USER, 
          payload: mapApiUserToUser(response.data) 
        });
      } catch (error) {
        auth.clearTokens();
        dispatch({ type: UserActions.CLEAR_USER });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (data: LoginData) => {
    try {
      dispatch({ type: UserActions.SET_LOADING });
      const response = await apiClient.post<LoginResponse>('/api/login/', data);
      
      auth.setTokens(response.data.access, response.data.refresh);
      dispatch({ 
        type: UserActions.SET_USER, 
        payload: mapApiUserToUser(response.data.user) 
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
      clearAvatarCaches();
      dispatch({ type: UserActions.CLEAR_USER });
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      dispatch({ type: UserActions.SET_LOADING });
      const response = await apiClient.patch('/users/profile', data);
      dispatch({ type: UserActions.SET_USER, payload: response.data });
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      logger.info('Starting user registration', { username: data.username });
      dispatch({ type: UserActions.SET_LOADING });
      
      const response = await apiClient.post<RegisterResponse>('/api/register/', data);
      const mappedUser = mapApiUserToUser(response.data.user);
      
      dispatch({ type: UserActions.SET_USER, payload: mappedUser });
      logger.info('User registration successful', { userId: mappedUser.id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error('Registration failed', { error });
        dispatch({ type: UserActions.SET_ERROR, payload: error.message });
      }
      throw error;
    }
  }, []);

  return (
    <UserContext.Provider value={{ ...state, login, logout, updateProfile, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 