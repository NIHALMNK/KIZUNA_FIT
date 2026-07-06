'use client';

import React from 'react';

// Foundation for a toast provider (e.g. Sonner, react-hot-toast)
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* <Toaster /> */}
    </>
  );
}
