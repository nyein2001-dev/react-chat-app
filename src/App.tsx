import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import LoadingSpinner from './components/common/LoadingSpinner';
import AppRoutes from './router/routes';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import './i18n/config';

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ThemeProvider>
        <UserProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </Suspense>
  )
}