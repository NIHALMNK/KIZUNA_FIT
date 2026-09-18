'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SidebarConfig, SidebarUser } from '../types/navigation.types';
import { useSidebar } from '../hooks/useSidebar';
import { SidebarHeader } from './SidebarHeader';
import { SidebarBody } from './SidebarBody';
import { SidebarFooter } from './SidebarFooter';
import { SidebarMobileDrawer } from './SidebarMobileDrawer';
import { SidebarCollapseButton } from './SidebarCollapseButton';
import { sidebarContainerVariants } from '../motion/sidebar.motion';

export interface SidebarProps {
  config: SidebarConfig;
  user?: SidebarUser | null;
  onLogout?: () => void;
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ config, isLoading = false }) => {
  const { isCollapsed } = useSidebar();

  return (
    <>
      {/* Desktop Sticky Floating Sidebar (Fixed 100vh height, zero outer scroll) */}
      <motion.aside
        variants={sidebarContainerVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="hidden md:flex fixed top-0 left-0 bottom-0 h-screen z-40 bg-[var(--color-sidebar)] border-r border-[var(--color-border)] shadow-xs flex-col justify-between overflow-visible max-w-full text-[var(--color-text-primary)] transition-colors"
      >
        {/* Floating Edge Collapse Control Button */}
        <div className="absolute -right-3.5 top-[18px] z-50">
          <SidebarCollapseButton />
        </div>

        <SidebarHeader portalTitle={config.portalName.toUpperCase()} />
        <SidebarBody config={config} />
        <SidebarFooter portalName={config.portalName} />
      </motion.aside>

      {/* Mobile Drawer */}
      <SidebarMobileDrawer config={config} />
    </>
  );
};
