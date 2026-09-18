'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../modules/identity/application/store/authStore';
import { tokenStorage } from '../../infrastructure/storage/TokenStorage';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { status, setAuthenticated } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Attempt to restore session silently on initial app load
    // This relies on the backend HttpOnly 'refreshToken' cookie
    const restoreSession = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await axios.post<{ success: boolean; data: { accessToken: string } }>(
          `${API_BASE_URL}/identity/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.data.accessToken;
        tokenStorage.setAccessToken(newAccessToken);
        setAuthenticated(newAccessToken);
      } catch (error) {
        // No valid session, or token expired.
        // User remains unauthenticated in Zustand.
        setAuthenticated(null);
      }
    };

    // Only run on mount
    restoreSession();
    // Multi-tab logout synchronization
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'kizuna_logout') {
        tokenStorage.removeAccessToken();
        setAuthenticated(null);
        window.location.href = '/';
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, [setAuthenticated]);

  return (
    <>
      {status === 'loading' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Starting KIZUNAFIT...</p>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
