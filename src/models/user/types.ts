export interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar_url: string | null;
    status: 'online' | 'offline' | 'busy' | 'away' | 'invisible';
    last_seen_at: string | null;
    isverified: boolean;
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