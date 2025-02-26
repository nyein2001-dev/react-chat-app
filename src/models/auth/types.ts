import { User } from '../user/types';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url?: string;
  settings: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface LoginData {
  username_or_email: string;
  password: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface AuthResponse {
  user: User;
  token: string;
} 