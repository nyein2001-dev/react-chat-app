import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { RegisterData } from '../../models/auth/types';
import { useToast } from '../../context/ToastContext';

export default function Register() {
  const { t } = useTranslation(['auth', 'common']);
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: RegisterData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirm_password: formData.get('confirm_password') as string,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
      settings: {
        notifications: true,
        theme: theme.mode,
      },
    };

    if (data.password !== data.confirm_password) {
      showToast('error', 'Validation Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await register(data);
      showToast('success', 'Registration Successful', 'You can now log in with your account');
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    } catch (err: any) {
      const errorData = err.response?.data;
      showToast('error', 'Registration Failed', errorData || 'An error occurred during registration');
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`
      min-h-screen flex flex-col justify-center py-12
    `}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`
          text-center text-3xl font-extrabold 
          text-${theme.colors.text.primary}
        `}>
          {t('auth:register.title')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`
          bg-${theme.colors.background}
          py-8 px-4 shadow sm:rounded-lg sm:px-10
          border border-${theme.colors.divider}
        `}>
          {error && (
            <div className={`
              mb-6 p-4 rounded-md
              bg-${theme.colors.error}/10
              text-${theme.colors.error}
              text-sm
            `}>
              {error}
            </div>
          )}

          <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
            <Input
              name="username"
              label={t('auth:register.username')}
              type="text"
              icon={<User className="h-5 w-5" />}
              placeholder={t('auth:register.usernamePlaceholder')}
              required
              fullWidth
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                name="first_name"
                label={t('auth:register.firstName')}
                type="text"
                placeholder={t('auth:register.firstNamePlaceholder')}
                required
                fullWidth
              />
              <Input
                name="last_name"
                label={t('auth:register.lastName')}
                type="text"
                placeholder={t('auth:register.lastNamePlaceholder')}
                required
                fullWidth
              />
            </div>

            <Input
              name="email"
              label={t('auth:register.email')}
              type="email"
              icon={<Mail className="h-5 w-5" />}
              placeholder={t('auth:register.emailPlaceholder')}
              required
              fullWidth
            />

            <Input
              name="phone"
              label={t('auth:register.phone')}
              type="tel"
              icon={<Phone className="h-5 w-5" />}
              placeholder={t('auth:register.phonePlaceholder')}
              required
              fullWidth
            />

            <Input
              name="password"
              label={t('auth:register.password')}
              type="password"
              icon={<Lock className="h-5 w-5" />}
              placeholder={t('auth:register.passwordPlaceholder')}
              required
              fullWidth
            />

            <Input
              name="confirm_password"
              label={t('auth:register.confirmPassword')}
              type="password"
              icon={<Lock className="h-5 w-5" />}
              placeholder={t('auth:register.confirmPasswordPlaceholder')}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('common:app.loading') : t('auth:register.submit')}
            </Button>
          </form>

          <p className={`
            mt-6 text-center text-sm
            text-${theme.colors.text.secondary}
          `}>
            {t('auth:register.hasAccount')}{' '}
            <Link
              to={ROUTES.AUTH.LOGIN}
              className={`
                font-medium 
                text-${theme.colors.primary}
                hover:text-${theme.colors.primary}-dark
              `}
            >
              {t('auth:register.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 