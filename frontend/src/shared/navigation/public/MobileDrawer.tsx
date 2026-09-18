'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PUBLIC_NAV_ITEMS, PUBLIC_NAV_ACTIONS } from './navigation.config';
import { usePublicNavigation } from './context/PublicNavigationContext';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { getDashboardRoute } from '../../constants/routes/public.routes';

export const MobileDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = usePublicNavigation();
  const { status, user } = useAuthStore();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && Boolean(user);
  const dashboardRoute = getDashboardRoute(user?.role);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden"
            aria-hidden="true"
          />

          {/* Slide-Over Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-slate-950/95 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Navigation</span>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav Items List */}
            <nav className="flex flex-col gap-2 py-6">
              {PUBLIC_NAV_ITEMS.filter((item) => item.showInMobile).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeDrawer}
                  className="px-4 py-3 rounded-2xl text-base font-bold text-slate-200 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <Link
                href={PUBLIC_NAV_ACTIONS.findTrainers.href}
                onClick={closeDrawer}
                className="w-full py-3.5 text-sm font-extrabold text-white text-center rounded-2xl btn-public-primary shadow-lg shadow-cyan-950/50"
              >
                {PUBLIC_NAV_ACTIONS.findTrainers.label}
              </Link>

              {isLoading ? (
                <div
                  className="w-full h-11 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse"
                  aria-hidden="true"
                />
              ) : isAuthenticated ? (
                <Link
                  href={dashboardRoute}
                  onClick={closeDrawer}
                  className="w-full py-3 text-sm font-extrabold text-slate-200 text-center rounded-2xl btn-public-secondary"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href={PUBLIC_NAV_ACTIONS.login.href}
                  onClick={closeDrawer}
                  className="w-full py-3 text-sm font-extrabold text-slate-200 text-center rounded-2xl btn-public-secondary"
                >
                  {PUBLIC_NAV_ACTIONS.login.label}
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
