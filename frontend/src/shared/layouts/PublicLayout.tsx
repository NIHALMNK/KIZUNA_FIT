'use client';

import React from 'react';
import { PublicNavigationProvider } from '../navigation/public/context/PublicNavigationContext';
import { PublicNavbar } from '../navigation/public/PublicNavbar';
import { PublicFooter } from '../navigation/public/PublicFooter';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <PublicNavigationProvider>
      <div className="theme-public min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-white relative overflow-x-hidden flex flex-col justify-between">
        {/* Ambient Lighting Orbs */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] opacity-70" />
          <div className="absolute top-[35%] -left-[15%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] opacity-50" />
          <div className="absolute top-[65%] -right-[15%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[180px] opacity-40" />
        </div>

        {/* Architectural Texture Grid */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]" />

        {/* Floating Public Navigation */}
        <PublicNavbar />

        {/* Main Content Area */}
        <main className="flex-1 relative z-10 pt-20 sm:pt-24">
          {children}
        </main>

        {/* Enterprise Public Footer */}
        <PublicFooter />
      </div>
    </PublicNavigationProvider>
  );
};
