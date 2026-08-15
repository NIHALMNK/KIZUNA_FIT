'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PUBLIC_NAV_ACTIONS } from './navigation.config';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { getDashboardRoute } from '../../constants/routes/public.routes';

export const PublicCTAButtons: React.FC = () => {
  const { status, user } = useAuthStore();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && Boolean(user);
  const dashboardRoute = getDashboardRoute(user?.role);

  return (
    <div className="hidden sm:flex items-center gap-3 shrink-0">
      {/* Secondary Button: Skeleton / Dashboard / Login */}
      {isLoading ? (
        <div
          className="w-[84px] h-[38px] rounded-xl bg-slate-900/60 border border-slate-800/80 animate-pulse"
          aria-hidden="true"
        />
      ) : isAuthenticated ? (
        <Link
          href={dashboardRoute}
          className="px-5 py-2.5 text-xs font-extrabold rounded-xl btn-public-secondary"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href={PUBLIC_NAV_ACTIONS.login.href}
          className="px-5 py-2.5 text-xs font-extrabold rounded-xl btn-public-secondary"
        >
          {PUBLIC_NAV_ACTIONS.login.label}
        </Link>
      )}

      {/* Primary Find Trainers CTA Pill Button */}
      <motion.div whileHover={{ scale: 1.02, y: -1.5 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
        <Link
          href={PUBLIC_NAV_ACTIONS.findTrainers.href}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-extrabold rounded-full btn-public-primary shadow-md shadow-cyan-950/40"
        >
          <span>{PUBLIC_NAV_ACTIONS.findTrainers.label}</span>
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
};
