'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../hooks/useSidebar';
import { getSidebarIcon } from '../utils/iconResolver';
import { UserDropdown } from '../components/UserDropdown';

interface ClientDashboardHeaderProps {
  title?: string;
  breadcrumb?: string[];
}

export const ClientDashboardHeader: React.FC<ClientDashboardHeaderProps> = ({
  title,
  breadcrumb,
}) => {
  const pathname = usePathname();
  const { toggleMobile } = useSidebar();
  const MenuIcon = getSidebarIcon('menu');
  const BellIcon = getSidebarIcon('notifications');

  // Resolve dynamic title and breadcrumb if not explicitly passed
  let computedTitle = title;
  let computedBreadcrumb = breadcrumb;

  if (!computedTitle || !computedBreadcrumb) {
    if (pathname === '/profile/client') {
      computedTitle = 'Profile';
      computedBreadcrumb = ['Dashboard', 'Profile'];
    } else if (pathname === '/profile/client/create') {
      computedTitle = 'Create Profile';
      computedBreadcrumb = ['Dashboard', 'Profile', 'Create'];
    } else if (pathname === '/profile/client/edit') {
      computedTitle = 'Edit Profile';
      computedBreadcrumb = ['Dashboard', 'Profile', 'Edit'];
    } else if (pathname.startsWith('/client/workouts')) {
      computedTitle = 'Workout Programs';
      computedBreadcrumb = ['Dashboard', 'My Coaching', 'Workouts'];
    } else if (pathname.startsWith('/client/nutrition')) {
      computedTitle = 'Nutrition Plans';
      computedBreadcrumb = ['Dashboard', 'My Coaching', 'Nutrition'];
    } else if (pathname.startsWith('/client/progress')) {
      computedTitle = 'Progress Tracking';
      computedBreadcrumb = ['Dashboard', 'My Coaching', 'Progress'];
    } else if (pathname.startsWith('/client/requests')) {
      computedTitle = 'Trainer Requests';
      computedBreadcrumb = ['Dashboard', 'Requests'];
    } else if (pathname.startsWith('/client/consultations')) {
      computedTitle = 'Consultations';
      computedBreadcrumb = ['Dashboard', 'Consultations'];
    } else if (pathname.startsWith('/client/offers')) {
      computedTitle = 'Coaching Offers';
      computedBreadcrumb = ['Dashboard', 'Offers'];
    } else if (pathname === '/client/settings/change-password') {
      computedTitle = 'Change Password';
      computedBreadcrumb = ['Dashboard', 'Settings', 'Change Password'];
    } else if (pathname.startsWith('/client/settings')) {
      computedTitle = 'Settings';
      computedBreadcrumb = ['Dashboard', 'Settings'];
    } else if (pathname.startsWith('/client/help')) {
      computedTitle = 'Help & Support';
      computedBreadcrumb = ['Dashboard', 'Account', 'Help Center'];
    } else {
      computedTitle = 'Client Dashboard';
      computedBreadcrumb = ['Dashboard', 'Overview'];
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[var(--color-navbar)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs transition-colors">
      {/* Left: Mobile Toggle, Logo & Desktop Breadcrumbs + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobile}
          className="md:hidden p-2 rounded-xl bg-[var(--color-surface-alt)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] focus:outline-none transition-colors"
          aria-label="Open sidebar menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        {/* Mobile Brand Logo */}
        <Link href="/" className="md:hidden flex items-center gap-2">
          <div className="relative h-7 w-7">
            <Image
              src="/assets/KIZUNA-FIT.png"
              alt="KIZUNAFIT Logo"
              width={28}
              height={28}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[var(--color-heading)]">KIZUNA-FIT</span>
        </Link>

        {/* Desktop Breadcrumbs & Page Title */}
        <div className="hidden md:flex flex-col">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-text-muted)]">
            {computedBreadcrumb.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && <span className="opacity-60">/</span>}
                <span className={index === computedBreadcrumb.length - 1 ? 'text-[var(--color-primary)] font-bold' : ''}>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-base sm:text-lg font-extrabold text-[var(--color-heading)] tracking-tight leading-tight">{computedTitle}</h1>
        </div>
      </div>

      {/* Right: Notifications & UserDropdown */}
      <div className="flex items-center gap-3">
        {/* Notifications Trigger Icon (Clean, no fake unread counts per Correction 4) */}
        <button
          type="button"
          className="p-2 rounded-xl bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] transition-colors relative"
          aria-label="Notifications"
        >
          <BellIcon className="w-4 h-4" />
        </button>

        {/* User Profile Dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
};
