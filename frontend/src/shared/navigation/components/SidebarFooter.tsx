'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from '../hooks/useSidebar';
import { labelVariants } from '../motion/sidebar.motion';

export const SidebarFooter: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="p-4 border-t border-[var(--color-border)] shrink-0 text-center">
      <motion.div
        variants={labelVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="flex flex-col items-center gap-0.5 whitespace-nowrap overflow-hidden"
      >
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          CLIENT PORTAL
        </span>
        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
          Certified Coaching Platform
        </span>
        <span className="text-[10px] font-medium text-[var(--color-text-muted)] mt-0.5">
          Version 2.0
        </span>
      </motion.div>

      {isCollapsed && (
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mx-auto animate-pulse" aria-label="Portal Active" />
      )}
    </div>
  );
};
