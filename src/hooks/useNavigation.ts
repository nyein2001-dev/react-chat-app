import { useNavigate } from 'react-router-dom';
import { navigation } from '../services/navigation';

export function useNavigation() {
  const navigate = useNavigate();

  return {
    chat: {
      goToConversation: (conversationId: string) => 
        navigate(navigation.chat.toConversation(conversationId)),
      goToNew: () => navigate(navigation.chat.toNew()),
      goToRoot: () => navigate(navigation.chat.toRoot()),
    },
    settings: {
      goToProfile: () => navigate(navigation.settings.toProfile()),
      goToPrivacy: () => navigate(navigation.settings.toPrivacy()),
      goToRoot: () => navigate(navigation.settings.toRoot()),
    },
    auth: {
      goToLogin: () => navigate(navigation.auth.toLogin()),
      goToRegister: () => navigate(navigation.auth.toRegister()),
      goToForgotPassword: () => navigate(navigation.auth.toForgotPassword()),
      goToResetPassword: (token: string) => 
        navigate(navigation.auth.toResetPassword(token)),
    },
  };
} 