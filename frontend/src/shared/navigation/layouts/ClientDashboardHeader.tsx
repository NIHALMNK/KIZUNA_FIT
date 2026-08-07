'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '../hooks/useSidebar';
import { getSidebarIcon } from '../utils/iconResolver';
import { UserDropdown } from '../components/UserDropdown';

interface ClientDashboardHeaderProps {
  title?: string;
  breadcrumb?: string[];
}

export const ClientDashboardHeader: React.FC<ClientDashboardHeaderProps> = ({
  title = 'Overview',
  breadcrumb = ['Dashboard', 'Overview'],
}) => {
  const { toggleMobile } = useSidebar();
  const MenuIcon = getSidebarIcon('menu');
  const BellIcon = getSidebarIcon('notifications');
  const SearchIcon = getSidebarIcon('search');

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle, Logo & Desktop Breadcrumbs + Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobile}
          className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 focus:outline-none"
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
          <span className="font-extrabold text-base tracking-tight text-white">KIZUNA-FIT</span>
        </Link>

        {/* Desktop Breadcrumbs & Page Title */}
        <div className="hidden md:flex flex-col">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && <span>/</span>}
                <span className={index === breadcrumb.length - 1 ? 'text-teal-400 font-bold' : ''}>
                  {item}
                </span>
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-base font-extrabold text-white tracking-tight">{title}</h1>
        </div>
      </div>

      {/* Center: Quick Search Trigger Placeholder */}
      <div className="hidden lg:flex items-center max-w-xs w-full">
        <div className="w-full relative flex items-center">
          <SearchIcon className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            readOnly
            placeholder="Search... Ctrl + K"
            className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl py-1.5 pl-9 pr-3 text-xs text-slate-400 font-medium cursor-pointer hover:border-slate-700 transition-colors focus:outline-none"
          />
        </div>
      </div>

      {/* Right: Notifications & UserDropdown */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon Button */}
        <button
          type="button"
          className="p-2 rounded-2xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 transition-colors relative"
          aria-label="Notifications"
        >
          <BellIcon className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        </button>

        {/* User Profile Dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
};
