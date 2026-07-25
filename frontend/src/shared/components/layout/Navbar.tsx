'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useLogout } from '../../../modules/identity/application/hooks/useLogout';

export const Navbar = () => {
  const { status, user } = useAuthStore();
  const logoutMutation = useLogout();

  return (
    <nav className="border-b bg-white p-4 flex justify-between items-center h-16">
      <Link href="/" className="font-bold text-xl">KIZUNAFIT</Link>
      <div className="flex gap-4 items-center">
        {status === 'authenticated' && user ? (
          <>
            <Link href={`/${user.role?.toLowerCase()}`} className="text-sm font-medium hover:underline">Dashboard</Link>
            {user.role === 'CLIENT' && <Link href="/profile" className="text-sm font-medium hover:underline">Profile</Link>}
            {user.role === 'TRAINER' && <Link href="/trainer/clients" className="text-sm font-medium hover:underline">Clients</Link>}
            {user.role === 'ADMIN' && <Link href="/admin/settings" className="text-sm font-medium hover:underline">Admin</Link>}
            <button 
              onClick={() => logoutMutation.mutate()} 
              disabled={logoutMutation.isPending}
              className="text-sm font-medium hover:underline text-red-600"
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <>
            <Link href="/" className="text-sm font-medium hover:underline">Home</Link>
            <Link href="/login" className="text-sm font-medium hover:underline">Login</Link>
            <Link href="/register" className="text-sm font-medium hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};
