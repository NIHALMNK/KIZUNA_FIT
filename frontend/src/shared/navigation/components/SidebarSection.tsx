'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSidebar } from '../hooks/useSidebar';
import { labelVariants } from '../motion/sidebar.motion';

interface SidebarSectionProps {
  title: string;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title }) => {
  const { isCollapsed } = useSidebar();

  if (!title) return null;

  return (
    <div className="px-3 pt-4 pb-1.5 min-h-[28px] flex items-center">
      <motion.span
        variants={labelVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)] whitespace-nowrap overflow-hidden"
      >
        {title}
      </motion.span>

      {isCollapsed && (
        <div className="w-6 h-[1px] bg-[var(--color-border)] mx-auto my-auto" aria-hidden="true" />
      )}
    </div>
  );
};
