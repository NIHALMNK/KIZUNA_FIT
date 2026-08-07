'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PUBLIC_NAV_ITEMS, NavItem } from './navigation.config';
import { usePublicNavbar } from './hooks/usePublicNavbar';

export const PublicDesktopMenu: React.FC = () => {
  const { isLinkActive } = usePublicNavbar();

  return (
    <nav className="hidden lg:flex items-center gap-8" aria-label="Main Public Navigation">
      {PUBLIC_NAV_ITEMS.filter((item) => item.showInDesktop).map((item: NavItem) => {
        const active = isLinkActive(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            prefetch={item.prefetch}
            className={`relative py-1 text-sm font-bold transition-colors duration-200 ${
              active ? 'text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>{item.label}</span>

            {/* Framer Motion Soft Active Indicator */}
            {active && (
              <motion.span
                layoutId="activePublicNavUnderline"
                className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
