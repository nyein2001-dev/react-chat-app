import { jwtDecode } from "jwt-decode";
import apiClient from '../api/client';
import { logger } from './logger';

interface TokenPayload {
  exp: number;
  user_id: number;
}

export const AUTH_TOKENS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
};

export const auth = {
  setTokens(access: string, refresh: string) {
    localStorage.setItem(AUTH_TOKENS.ACCESS, access);
    localStorage.setItem(AUTH_TOKENS.REFRESH, refresh);
  },

  clearTokens() {
    localStorage.removeItem(AUTH_TOKENS.ACCESS);
    localStorage.removeItem(AUTH_TOKENS.REFRESH);
  },

  getAccessToken() {
    return localStorage.getItem(AUTH_TOKENS.ACCESS);
  },

  getRefreshToken() {
    return localStorage.getItem(AUTH_TOKENS.REFRESH);
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
      this.clearTokens();
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }
}; 