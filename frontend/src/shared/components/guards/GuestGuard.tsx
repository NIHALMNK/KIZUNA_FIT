'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useRouter } from 'next/navigation';

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (user?.role) {
        router.push(`/${user.role.toLowerCase()}`);
      } else {
        router.push('/');
      }
    }
  }, [status, user, router]);

  if (status === 'authenticated') {
    return null; // Return nothing while redirecting
  }

  return <>{children}</>;
}
