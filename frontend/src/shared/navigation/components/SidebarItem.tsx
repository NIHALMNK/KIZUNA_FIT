'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SidebarNavItem } from '../types/navigation.types';
import { useSidebar } from '../hooks/useSidebar';
import { getSidebarIcon } from '../utils/iconResolver';
import { SidebarBadge } from './SidebarBadge';
import { SidebarTooltip } from './SidebarTooltip';
import { labelVariants, itemHoverVariants } from '../motion/sidebar.motion';

interface SidebarItemProps {
  item: SidebarNavItem;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, onClick }) => {
  const { isCollapsed, isRouteActive } = useSidebar();
  const Icon = getSidebarIcon(item.iconName);
  const active = isRouteActive(item.href);
  const isComingSoon = item.status === 'comingSoon';
  const isDisabled = item.status === 'disabled' || isComingSoon;

  const tooltipContent = isComingSoon
    ? 'This feature will be available in a future update.'
    : isCollapsed
    ? item.label
    : '';

  const buttonContent = (
    <motion.div
      variants={itemHoverVariants}
      initial="rest"
      whileHover={isDisabled ? 'rest' : 'hover'}
      className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-150 w-full ${
        active
          ? 'bg-gradient-to-r from-teal-500/20 via-cyan-500/10 to-transparent text-white border-l-2 border-teal-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
          : isDisabled
          ? 'opacity-40 text-slate-500 cursor-not-allowed'
          : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border-l-2 border-transparent'
      }`}
    >
      {/* Icon with active cyan-teal glow */}
      <Icon
        className={`w-5 h-5 shrink-0 transition-colors ${
          active
            ? 'text-teal-400 drop-shadow-[0_0_10px_rgba(20,184,166,0.6)]'
            : isDisabled
            ? 'text-slate-600'
            : 'text-slate-400 group-hover:text-teal-400'
        }`}
      />

      {/* Label and badges animated fade */}
      <motion.div
        variants={labelVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="flex items-center justify-between flex-1 min-w-0 whitespace-nowrap overflow-hidden"
      >
        <span className="truncate">{item.label}</span>
        {item.badge && <SidebarBadge badge={item.badge} className="ml-2" />}
      </motion.div>

      {/* Collapsed notification dot */}
      {isCollapsed && item.badge?.type === 'COUNT' && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
      )}
    </motion.div>
  );

  if (isDisabled) {
    return (
      <SidebarTooltip content={tooltipContent} disabled={!tooltipContent}>
        <div className="w-full cursor-not-allowed">{buttonContent}</div>
      </SidebarTooltip>
    );
  }

  return (
    <SidebarTooltip content={isCollapsed ? item.label : ''} disabled={!isCollapsed}>
      <Link href={item.href} onClick={onClick} className="w-full">
        {buttonContent}
      </Link>
    </SidebarTooltip>
  );
};
