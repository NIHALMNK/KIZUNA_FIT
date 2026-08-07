'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useLogout } from '../../../modules/identity/application/hooks/useLogout';
import { getSidebarIcon } from '../utils/iconResolver';

export const UserDropdown: React.FC = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const UserIcon = getSidebarIcon('profile');
  const CreditCardIcon = getSidebarIcon('subscription');
  const ReceiptIcon = getSidebarIcon('invoices');
  const HelpIcon = getSidebarIcon('help');
  const SettingsIcon = getSidebarIcon('settings');
  const LogOutIcon = getSidebarIcon('logout');

  const name = user?.email?.split('@')[0] || 'Client User';
  const email = user?.email || 'client@kizunafit.com';
  const role = user?.role || 'CLIENT';
  const initials = name.substring(0, 2).toUpperCase();

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-900/80 border border-transparent hover:border-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 p-0.5 shadow-md">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-bold text-white text-xs">
              {initials}
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
        </div>

        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs font-extrabold text-white leading-tight capitalize">{name}</span>
          <span className="text-[10px] font-bold text-slate-400">Client Account</span>
        </div>

        <svg className="w-4 h-4 text-slate-400 hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-72 rounded-3xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl p-4 z-50 space-y-3"
          >
            {/* User Profile Header */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 p-0.5 shrink-0">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-bold text-white text-xs">
                  {initials}
                </div>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-white truncate capitalize">{name}</h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    {role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">{email}</p>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="space-y-1 py-1 border-y border-slate-800/80 text-xs font-bold text-slate-300">
              <Link
                href="/profile/client"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/client/subscription"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition-colors"
              >
                <CreditCardIcon className="w-4 h-4 text-slate-400" />
                <span>Subscription</span>
              </Link>

              <Link
                href="/client/payment-history"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition-colors"
              >
                <ReceiptIcon className="w-4 h-4 text-slate-400" />
                <span>Billing & History</span>
              </Link>

              <Link
                href="/client/help"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition-colors"
              >
                <HelpIcon className="w-4 h-4 text-slate-400" />
                <span>Help Center</span>
              </Link>

              <Link
                href="/client/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </Link>
            </div>

            {/* Logout Action */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logoutMutation.mutate();
              }}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold transition-colors disabled:opacity-50"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>{logoutMutation.isPending ? 'Logging out...' : 'Sign Out'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
