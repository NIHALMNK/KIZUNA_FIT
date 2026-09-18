'use client';

import React from 'react';
import { usePublicNavigation } from './context/PublicNavigationContext';

export const PublicMobileMenu: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = usePublicNavigation();

  return (
    <button
      type="button"
      onClick={toggleDrawer}
      className="lg:hidden p-2.5 rounded-full bg-slate-900/80 text-slate-200 hover:text-white border border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      aria-label={isDrawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
      aria-expanded={isDrawerOpen}
    >
      {isDrawerOpen ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
};
