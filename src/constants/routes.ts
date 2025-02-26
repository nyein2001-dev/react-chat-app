export const ROUTES = {
  ROOT: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password/:token',
  },
  CHAT: {
    ROOT: '/chat',
    CONVERSATION: '/chat/:conversationId',
    NEW: '/chat/new',
  },
  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings/profile',
    PRIVACY: '/settings/privacy',
  },
} as const; 