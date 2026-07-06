'use client';

import React from 'react';
// Note: When @tanstack/react-query is installed, this will wrap the children in QueryClientProvider.

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
