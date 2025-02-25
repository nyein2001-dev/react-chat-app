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
    }
}