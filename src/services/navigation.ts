import { ROUTES } from '../constants/routes';

export const navigation = {
  chat: {
    toConversation: (conversationId: string) => 
      ROUTES.CHAT.CONVERSATION.replace(':conversationId', conversationId),
    toNew: () => ROUTES.CHAT.NEW,
    toRoot: () => ROUTES.CHAT.ROOT,
  },
  settings: {
    toProfile: () => ROUTES.SETTINGS.PROFILE,
    toPrivacy: () => ROUTES.SETTINGS.PRIVACY,
    toRoot: () => ROUTES.SETTINGS.ROOT,
  },
  auth: {
    toLogin: () => ROUTES.AUTH.LOGIN,
    toRegister: () => ROUTES.AUTH.REGISTER,
    toForgotPassword: () => ROUTES.AUTH.FORGOT_PASSWORD,
    toResetPassword: (token: string) => 
      ROUTES.AUTH.RESET_PASSWORD.replace(':token', token),
  },
}; 