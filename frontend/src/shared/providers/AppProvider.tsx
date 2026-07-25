'use client';

import React, { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { AuthInitializer } from './AuthInitializer';
import { GoogleAuthInitializer } from './GoogleAuthInitializer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryProvider } from './QueryProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
      <QueryProvider>
        <AuthInitializer>
          <GoogleAuthInitializer />
          {children}
        </AuthInitializer>
        <Toaster position="top-right" />
      </QueryProvider>
    </GoogleOAuthProvider>
  );
}
