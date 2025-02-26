import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="m-auto w-full max-w-md">
          <Outlet />
      </div>
    </div>
  );
} 