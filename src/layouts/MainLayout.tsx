import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
} 