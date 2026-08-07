'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from '../hooks/useSidebar';
import { labelVariants } from '../motion/sidebar.motion';

export const SidebarFooter: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="p-4 border-t border-slate-800/80 shrink-0 text-center">
      <motion.div
        variants={labelVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="flex flex-col items-center gap-0.5 whitespace-nowrap overflow-hidden"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">
          CLIENT PORTAL
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          Certified Coaching Platform
        </span>
        <span className="text-[10px] font-bold text-slate-600 mt-1">
          Version 2.0
        </span>
      </motion.div>

      {isCollapsed && (
        <div className="w-2 h-2 rounded-full bg-teal-400 mx-auto animate-pulse" aria-label="Portal Active" />
      )}
    </div>
  );
};
