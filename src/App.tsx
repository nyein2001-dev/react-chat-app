import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import LoadingSpinner from './components/common/LoadingSpinner';
import AppRoutes from './router/routes';
import { UserProvider } from './store/user/UserContext';

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </Suspense>
  )
}