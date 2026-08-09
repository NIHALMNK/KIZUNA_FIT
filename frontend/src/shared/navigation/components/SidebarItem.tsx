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
      className={`group relative flex items-center gap-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 w-full ${
        isCollapsed ? 'px-0 justify-center' : 'px-3.5'
      } ${
        active
          ? 'bg-[var(--color-tag)] text-[var(--color-tag-text)] border-l-3 border-[var(--color-primary)] font-extrabold'
          : isDisabled
          ? 'opacity-50 text-[var(--color-text-muted)] cursor-not-allowed'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] border-l-3 border-transparent'
      }`}
    >
      {/* Icon */}
      <Icon
        className={`w-5 h-5 shrink-0 transition-colors ${
          active
            ? 'text-[var(--color-primary)]'
            : isDisabled
            ? 'text-[var(--color-text-muted)]'
            : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]'
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
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
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
