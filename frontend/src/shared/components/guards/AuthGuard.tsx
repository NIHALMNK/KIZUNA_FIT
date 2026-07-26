'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '../../constants/routes';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      const redirectUrl = encodeURIComponent(pathname || ROUTES.HOME);
      router.push(`${ROUTES.LOGIN}?redirect=${redirectUrl}`);
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gray-500 font-medium">Verifying session authentication...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
