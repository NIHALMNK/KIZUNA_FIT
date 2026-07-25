import React from 'react';
import { GuestGuard } from '../../shared/components/guards/GuestGuard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </GuestGuard>
  );
}
