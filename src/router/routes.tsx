import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import ProtectedRoute from './ProtectedRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthGuard from '../components/auth/AuthGuard';
import PublicGuard from '../components/auth/PublicGuard';

const AuthLayout = lazy(() => import('../layouts/AuthLayout'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

const ChatHome = lazy(() => import('../pages/chat'));
const Conversation = lazy(() => import('../pages/chat/Conversation'));
const NewChat = lazy(() => import('../pages/chat/NewChat'));

const Settings = lazy(() => import('../pages/settings'));
const Profile = lazy(() => import('../pages/settings/Profile'));
const Privacy = lazy(() => import('../pages/settings/Privacy'));

const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<PublicGuard>{<AuthLayout />}</PublicGuard>}>
          <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
          <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
          <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>

        <Route element={<AuthGuard>{<MainLayout />}</AuthGuard>}>
         
          <Route path={ROUTES.CHAT.ROOT} element={<ChatHome />} />
          <Route path={ROUTES.CHAT.NEW} element={<NewChat />} />
          <Route path={ROUTES.CHAT.CONVERSATION} element={<Conversation />} />

          <Route path={ROUTES.SETTINGS.ROOT} element={<Settings />} />
          <Route path={ROUTES.SETTINGS.PROFILE} element={<Profile />} />
          <Route path={ROUTES.SETTINGS.PRIVACY} element={<Privacy />} />
        </Route>

        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.CHAT.ROOT} replace />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
} 