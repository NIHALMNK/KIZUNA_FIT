'use client';

import React from 'react';
import { SidebarBadgeConfig } from '../types/navigation.types';
import { getBadgeClasses } from '../utils/navigation.utils';

interface SidebarBadgeProps {
  badge?: SidebarBadgeConfig;
  className?: string;
}

export const SidebarBadge: React.FC<SidebarBadgeProps> = ({ badge, className = '' }) => {
  if (!badge) return null;

  const content = badge.type === 'COUNT' && badge.count !== undefined
    ? (badge.count > 99 ? '99+' : String(badge.count))
    : (badge.text || badge.type);

  return (
    <span className={`${getBadgeClasses(badge)} shrink-0 ${className}`}>
      {content}
    </span>
  );
};
