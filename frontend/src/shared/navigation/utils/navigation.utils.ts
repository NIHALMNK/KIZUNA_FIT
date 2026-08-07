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
    return 'bg-slate-800/80 text-slate-400 border border-slate-700/60 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider';
  }

  if (badge.type === 'NEW') {
    return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider';
  }

  if (badge.type === 'BETA') {
    return 'bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider';
  }

  if (badge.type === 'PREMIUM') {
    return 'bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider';
  }

  if (badge.type === 'COUNT') {
    return 'bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full';
  }

  return 'bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md';
};
