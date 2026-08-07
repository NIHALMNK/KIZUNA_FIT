'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarConfig } from '../types/navigation.types';
import { useSidebar } from '../hooks/useSidebar';
import { SidebarHeader } from './SidebarHeader';
import { SidebarBody } from './SidebarBody';
import { SidebarFooter } from './SidebarFooter';

interface SidebarMobileDrawerProps {
  config: SidebarConfig;
}

export const SidebarMobileDrawer: React.FC<SidebarMobileDrawerProps> = ({ config }) => {
  const { isMobileOpen, closeMobile } = useSidebar();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, closeMobile]);

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobile}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md md:hidden"
            aria-hidden="true"
          />

          {/* Slide-over Drawer (Fixed 100vh height, zero outer scroll) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            className="fixed top-0 left-0 bottom-0 h-screen z-50 w-full max-w-[280px] bg-slate-950/95 border-r border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden md:hidden"
          >
            <SidebarHeader portalTitle={config.portalName.toUpperCase()} />
            <SidebarBody config={config} onItemClick={closeMobile} />
            <SidebarFooter />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
