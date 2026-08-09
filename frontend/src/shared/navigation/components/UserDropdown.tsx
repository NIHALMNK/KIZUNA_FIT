'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useLogout } from '../../../modules/identity/application/hooks/useLogout';
import { useGetClientProfile } from '../../../modules/profile/presentation/hooks/useClientProfile';
import { useGetTrainerProfile } from '../../../modules/profile/presentation/hooks/useTrainerProfile';
import { getSidebarIcon } from '../utils/iconResolver';
import { Avatar } from '../../components/ui/Avatar';

export const UserDropdown: React.FC = () => {
  const { user } = useAuthStore();
  const isClient = user?.role === 'CLIENT';
  const isTrainer = user?.role === 'TRAINER';

  const { data: clientProfile } = useGetClientProfile(isClient);
  const { data: trainerProfile } = useGetTrainerProfile(isTrainer);

  const logoutMutation = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const UserIcon = getSidebarIcon('profile');
  const SettingsIcon = getSidebarIcon('settings');
  const HelpIcon = getSidebarIcon('help');
  const LogOutIcon = getSidebarIcon('logout');

  const rawName = isTrainer
    ? user?.email?.split('@')[0] || 'Trainer'
    : clientProfile?.fullName || user?.email?.split('@')[0] || 'Client User';
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const email = user?.email || (isTrainer ? 'trainer@kizunafit.com' : 'client@kizunafit.com');
  const role = user?.role || 'CLIENT';
  const initials = rawName.substring(0, 2).toUpperCase();
  const avatarUrl = isTrainer ? trainerProfile?.avatarUrl : clientProfile?.avatarUrl;
  const accountLabel = isTrainer ? 'Trainer Account' : 'Client Account';
  const profileHref = isTrainer ? '/profile/trainer' : '/profile/client';

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
        className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-[var(--color-surface-alt)] border border-transparent hover:border-[var(--color-border)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative shrink-0">
          <Avatar
            src={avatarUrl || undefined}
            fallback={initials}
            size="sm"
            className="ring-2 ring-[var(--color-border)]"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--color-surface)]" />
        </div>

        <div className="hidden lg:flex flex-col text-left">
          <span className="text-xs font-extrabold text-[var(--color-heading)] leading-tight capitalize truncate max-w-[120px]">
            {displayName}
          </span>
          <span className="text-[10px] font-bold text-[var(--color-text-muted)]">
            {accountLabel}
          </span>
        </div>

        <svg
          className="w-4 h-4 text-[var(--color-text-muted)] hidden lg:block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
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
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-2xl p-4 z-50 space-y-3"
          >
            {/* User Profile Header */}
            <div className="p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center gap-3">
              <Avatar
                src={avatarUrl || undefined}
                fallback={initials}
                size="md"
                className="shrink-0"
              />

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[var(--color-heading)] truncate capitalize">
                    {displayName}
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[var(--color-tag)] text-[var(--color-tag-text)] border border-[var(--color-border)]">
                    {role}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] font-medium truncate">
                  {email}
                </p>
              </div>
            </div>

            {/* Quick Verified Navigation Links */}
            <div className="space-y-1 py-1 border-y border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)]">
              <Link
                href={profileHref}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
              >
                <UserIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span>My Profile</span>
              </Link>

              {!isTrainer && (
                <>
                  <Link
                    href="/client/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/client/help"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
                  >
                    <HelpIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span>Help Center</span>
                  </Link>
                </>
              )}
            </div>

            {/* Logout Action */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logoutMutation.mutate();
              }}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors disabled:opacity-50"
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
