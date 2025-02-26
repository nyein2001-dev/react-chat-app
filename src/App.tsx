import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './store/user/UserContext';
import { ChatProvider } from './store/chat/ChatContext';
import { SocketProvider } from './context/SocketContext';
import AppRoutes from './router/routes';
import LoadingSpinner from './components/common/LoadingSpinner';
import './i18n/config';
import './App.css';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Notification from './components/common/Notification';

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <UserProvider>
              <SocketProvider>
                <ChatProvider>
                  <Notification />
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </ChatProvider>
              </SocketProvider>
            </UserProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Suspense>
  );
}