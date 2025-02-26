import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { LoginData } from '../../models/auth/types';

export default function Login() {
  const { t } = useTranslation(['auth', 'common']);
  const { login } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: LoginData = {
      username_or_email: formData.get('username_or_email') as string,
      password: formData.get('password') as string,
    };

    try {
      setIsLoading(true);
      await login(data);
      showToast('success', 'Login Successful', 'Welcome back!');
      navigate(ROUTES.CHAT.ROOT, { replace: true });
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.detail || 
        (errorData?.username_or_email && errorData.username_or_email[0]) || 
        'An error occurred during login';
      
      showToast('error', 'Login Failed', errorMessage);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`
          text-center text-3xl font-extrabold 
          text-${theme.colors.text.primary}
        `}>
          {t('auth:login.title')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`
          bg-${theme.colors.background}
          py-8 px-4 shadow sm:rounded-lg sm:px-10
          border border-${theme.colors.divider}
        `}>
          <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
            <Input
              name="username_or_email"
              label={t('auth:login.usernameOrEmail')}
              type="text"
              icon={<Mail className="h-5 w-5" />}
              placeholder={t('auth:login.usernamePlaceholder')}
              required
              fullWidth
            />

            <Input
              name="password"
              label={t('auth:login.password')}
              type="password"
              icon={<Lock className="h-5 w-5" />}
              placeholder={t('auth:login.passwordPlaceholder')}
              required
              fullWidth
            />

            <div className="flex items-center justify-between">
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className={`
                  text-sm font-medium
                  text-${theme.colors.primary}
                  hover:text-${theme.colors.primary}-dark
                `}
              >
                {t('auth:login.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('common:app.loading') : t('auth:login.submit')}
            </Button>
          </form>

          <p className={`
            mt-6 text-center text-sm
            text-${theme.colors.text.secondary}
          `}>
            {t('auth:login.noAccount')}{' '}
            <Link
              to={ROUTES.AUTH.REGISTER}
              className={`
                font-medium 
                text-${theme.colors.primary}
                hover:text-${theme.colors.primary}-dark
              `}
            >
              {t('auth:login.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 