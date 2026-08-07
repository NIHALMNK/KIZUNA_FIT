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
    <div className="flex items-center justify-between p-4 border-b border-slate-800/80 shrink-0">
      <Link
        href="/"
        className="flex items-center gap-3 group focus:outline-none rounded-xl shrink-0 overflow-hidden"
        aria-label="KIZUNAFIT Home"
      >
        <div className="relative h-9 w-9 flex items-center justify-center shrink-0">
          <Image
            src="/assets/KIZUNA-FIT.png"
            alt="KIZUNAFIT Logo"
            width={36}
            height={36}
            priority
            className="h-full w-full object-contain drop-shadow-[0_2px_10px_rgba(6,182,212,0.4)]"
          />
        </div>

        <motion.div
          variants={labelVariants}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          className="flex flex-col whitespace-nowrap overflow-hidden"
        >
          <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            KIZUNA-FIT
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
            {portalTitle} PORTAL
          </span>
        </motion.div>
      </Link>

      <div className="hidden md:block">
        <SidebarCollapseButton />
      </div>
    </div>
  );
};
