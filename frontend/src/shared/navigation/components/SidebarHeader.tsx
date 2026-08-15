'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSidebar } from '../hooks/useSidebar';
import { SidebarCollapseButton } from './SidebarCollapseButton';
import { labelVariants } from '../motion/sidebar.motion';

interface SidebarHeaderProps {
  portalTitle?: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ portalTitle = 'CLIENT' }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`h-16 border-b border-[var(--color-border)] shrink-0 flex items-center transition-all ${
      isCollapsed ? 'justify-center px-0' : 'justify-between px-4'
    }`}>
      <Link
        href="/"
        className={`flex items-center gap-3 group focus:outline-none rounded-xl shrink-0 overflow-hidden ${
          isCollapsed ? 'justify-center w-full' : ''
        }`}
        aria-label="KIZUNAFIT Home"
      >
        <div className="relative h-9 w-9 flex items-center justify-center shrink-0">
          <Image
            src="/assets/KIZUNA-FIT.png"
            alt="KIZUNAFIT Logo"
            width={36}
            height={36}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        <motion.div
          variants={labelVariants}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          className="flex flex-col whitespace-nowrap overflow-hidden"
        >
          <span className="font-extrabold text-base tracking-tight text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
            KIZUNA-FIT
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
            {portalTitle} PORTAL
          </span>
        </motion.div>
      </Link>
    </div>
  );
};
