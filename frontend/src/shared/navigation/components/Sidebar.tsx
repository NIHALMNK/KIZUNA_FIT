'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SidebarConfig, SidebarUser } from '../types/navigation.types';
import { useSidebar } from '../hooks/useSidebar';
import { SidebarHeader } from './SidebarHeader';
import { SidebarBody } from './SidebarBody';
import { SidebarFooter } from './SidebarFooter';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { sidebarContainerVariants } from '../motion/sidebar.motion';

export interface SidebarProps {
  config: SidebarConfig;
  user?: SidebarUser | null;
  onLogout?: () => void;
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  isLoading = false,
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <>
      {/* Desktop Sticky Floating Sidebar (Fixed 100vh height, zero outer scroll) */}
      <motion.aside
        variants={sidebarContainerVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="hidden md:flex fixed top-0 left-0 bottom-0 h-screen z-40 bg-slate-950/85 backdrop-blur-2xl border-r border-slate-800/90 shadow-2xl shadow-black/60 flex-col justify-between overflow-hidden max-w-full"
      >
        <SidebarHeader portalTitle={config.portalName.toUpperCase()} />
        <SidebarBody config={config} />
        <SidebarFooter />
      </motion.aside>

      {/* Mobile Drawer */}
      <SidebarMobileDrawer config={config} />
    </>
  );
};
