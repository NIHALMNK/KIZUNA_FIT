'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useLogout } from '../../../modules/identity/application/hooks/useLogout';
import { NAVIGATION_CONFIG } from '../navigation/navigation.config';
import { ROUTES } from '../../constants/routes';

export const Navbar = () => {
  const { status, user } = useAuthStore();
  const logoutMutation = useLogout();

  if (status === 'loading') {
    return (
      <nav className="border-b bg-white p-4 flex justify-between items-center h-16 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="flex gap-4 items-center">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </nav>
    );
  }

  const role = status === 'authenticated' && user?.role ? (user.role as 'CLIENT' | 'TRAINER' | 'ADMIN') : 'guest';
  const navItems = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG.guest;

  const roleBadgeStyle =
    role === 'TRAINER'
      ? 'bg-emerald-100 text-emerald-800'
      : role === 'CLIENT'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <nav className="border-b border-gray-200 bg-white px-4 sm:px-6 flex justify-between items-center h-16 shadow-sm">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.HOME} className="font-extrabold text-xl tracking-tight text-gray-900">
          KIZUNAFIT
        </Link>
        {status === 'authenticated' && user?.role && (
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wider ${roleBadgeStyle}`}>
            {user.role}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors">
            {item.label}
          </Link>
        ))}

        {status === 'authenticated' && (
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
          >
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </button>
        )}
      </div>
    </nav>
  );
};
