'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useRouter } from 'next/navigation';

export function RoleGuard({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const { status, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (user?.role !== allowedRole) {
        // Redirect unauthorized users to their proper dashboard or login
        if (user?.role) {
          router.push(`/${user.role.toLowerCase()}`);
        } else {
          router.push('/login');
        }
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, user, allowedRole, router]);

  if (status !== 'authenticated' || user?.role !== allowedRole) {
    return null; // Return nothing while redirecting
  }

  return <>{children}</>;
}
