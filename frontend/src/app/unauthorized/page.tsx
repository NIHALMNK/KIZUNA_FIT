'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/modules/identity/application/store/authStore';
import { ROUTES } from '@/shared/constants/routes';

export default function UnauthorizedPage() {
  const { user } = useAuthStore();

  const homeHref = user?.role ? (user.role === 'TRAINER' ? ROUTES.TRAINER_PROFILE : ROUTES.CLIENT_PROFILE) : ROUTES.HOME;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full shadow-sm">
        <div className="mx-auto h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-2xl mb-4">
          403
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">403 - Access Forbidden</h1>
        <p className="text-xs text-gray-600 mb-6">
          You don't have permission to view or access this page. Please return to your designated dashboard.
        </p>
        <Link
          href={homeHref}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Return to Safe Page
        </Link>
      </div>
    </div>
  );
}
