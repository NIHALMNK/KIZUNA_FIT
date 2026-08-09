'use client';

import React from 'react';
import { useSidebar } from '../hooks/useSidebar';
import { getSidebarIcon } from '../utils/iconResolver';

export const SidebarCollapseButton: React.FC = () => {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const ChevronIcon = getSidebarIcon(isCollapsed ? 'chevronRight' : 'chevronLeft');

  return (
    <button
      type="button"
      onClick={toggleCollapse}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className="w-7 h-7 rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] shadow-md flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30 shrink-0 cursor-pointer"
    >
      <ChevronIcon className="w-3.5 h-3.5" />
    </button>
  );
};
