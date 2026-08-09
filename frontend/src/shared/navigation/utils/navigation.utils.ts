import { SidebarBadgeConfig } from '../types/navigation.types';

export const isNavRouteActive = (pathname: string, targetHref: string): boolean => {
  if (!pathname || !targetHref) return false;
  if (targetHref === '/client' || targetHref === '/trainer' || targetHref === '/admin') {
    return pathname === targetHref;
  }
  return pathname.startsWith(targetHref);
};

export const getBadgeClasses = (badge?: SidebarBadgeConfig): string => {
  if (!badge) return '';

  if (badge.type === 'COMING_SOON') {
    return 'bg-amber-50 text-amber-700 border border-amber-200/80 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider';
  }

  if (badge.type === 'NEW') {
    return 'bg-[var(--color-tag)] text-[var(--color-tag-text)] border border-[var(--color-border)] text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider';
  }

  if (badge.type === 'BETA') {
    return 'bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider';
  }

  if (badge.type === 'PREMIUM') {
    return 'bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider';
  }

  if (badge.type === 'COUNT') {
    return 'bg-[var(--color-tag)] text-[var(--color-tag-text)] font-extrabold text-[10px] px-2 py-0.5 rounded-full';
  }

  return 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] text-[10px] font-semibold px-2 py-0.5 rounded-md';
};
