export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string | null;
  status: 'online' | 'offline';
  last_seen_at: string | null;
  is_verified: boolean;
  is_active: boolean;
  is_blocked: boolean;
  isOnline: boolean;
  settings: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  created_at: string;
  updated_at: string;
}

export type UserStatus = 'online' | 'offline' | 'away'; 