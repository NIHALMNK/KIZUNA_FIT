'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SidebarUser } from '../types/navigation.types';
import { useSidebar } from '../hooks/useSidebar';
import { getSidebarIcon } from '../utils/iconResolver';
import { labelVariants } from '../motion/sidebar.motion';

interface SidebarUserCardProps {
  user?: SidebarUser | null;
  onLogout?: () => void;
}

export const SidebarUserCard: React.FC<SidebarUserCardProps> = ({ user, onLogout }) => {
  const { isCollapsed } = useSidebar();
  const SettingsIcon = getSidebarIcon('settings');
  const LogOutIcon = getSidebarIcon('logout');

  const name = user?.name || user?.email?.split('@')[0] || 'Client User';
  const email = user?.email || 'client@kizunafit.com';
  const role = user?.role || 'CLIENT';
  const plan = user?.subscriptionPlan || 'Free';

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
      <div className="flex items-center gap-3">
        {/* Avatar with status indicator */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 p-0.5 shadow-md">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-bold text-white text-xs">
              {initials}
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
        </div>

        {/* User Details Fade Container */}
        <motion.div
          variants={labelVariants}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          className="flex flex-col min-w-0 flex-1 whitespace-nowrap overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-white truncate">{name}</h4>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {role}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium truncate">{email}</p>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700/60">
              {plan} Plan
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons Footer Row */}
      <motion.div
        variants={labelVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="pt-2 border-t border-slate-800/80 flex items-center justify-between"
      >
        <Link
          href="/client/settings"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
          title="Account Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </Link>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOutIcon className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        )}
      </motion.div>
    </div>
  );
};
