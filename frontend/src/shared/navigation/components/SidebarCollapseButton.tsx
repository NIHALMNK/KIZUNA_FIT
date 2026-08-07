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
      className="p-1.5 rounded-xl bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40 shrink-0 shadow-sm"
    >
      <ChevronIcon className="w-4 h-4" />
    </button>
  );
};
