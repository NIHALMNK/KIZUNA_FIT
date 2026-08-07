'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PublicNavLogo } from './PublicNavLogo';
import { PublicDesktopMenu } from './PublicDesktopMenu';
import { PublicCTAButtons } from './PublicCTAButtons';
import { PublicMobileMenu } from './PublicMobileMenu';
import { MobileDrawer } from './MobileDrawer';
import { usePublicNavbar } from './hooks/usePublicNavbar';

export const PublicNavbar: React.FC = () => {
  const { isScrolled } = usePublicNavbar();

  return (
    <>
      <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 transition-all duration-300">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`w-full px-5 sm:px-8 flex items-center justify-between rounded-full border transition-all duration-300 ${
            isScrolled
              ? 'py-2.5 public-glass-nav-scrolled'
              : 'py-3.5 public-glass-nav'
          }`}
        >
          {/* Brand Logo */}
          <PublicNavLogo />

          {/* Desktop Navigation Links */}
          <PublicDesktopMenu />

          {/* Desktop CTA Action Buttons */}
          <PublicCTAButtons />

          {/* Mobile Hamburger Toggle Button */}
          <PublicMobileMenu />
        </motion.nav>
      </header>

      {/* Slide-over Mobile Navigation Drawer */}
      <MobileDrawer />
    </>
  );
};
