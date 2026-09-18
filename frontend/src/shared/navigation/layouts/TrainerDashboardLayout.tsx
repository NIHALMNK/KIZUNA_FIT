'use client';

import React from 'react';
import { SidebarProvider } from '../providers/SidebarProvider';
import { Sidebar } from '../components/Sidebar';
import { trainerSidebarConfig } from '../config/trainerSidebar.config';
import { TrainerDashboardHeader } from '../headers/TrainerDashboardHeader';
import { useSidebar } from '../hooks/useSidebar';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { SidebarSkeleton } from '../components/SidebarSkeleton';

interface TrainerDashboardLayoutContentProps {
  children: React.ReactNode;
}

const TrainerDashboardLayoutContent: React.FC<TrainerDashboardLayoutContentProps> = ({
  children,
}) => {
  const { isCollapsed } = useSidebar();
  const { status } = useAuthStore();

  const isLoading = status === 'loading';

  return (
    <div className="theme-trainer min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans antialiased relative selection:bg-[var(--color-primary)] selection:text-white">
      {/* Universal Sidebar Component Engine */}
      {isLoading ? (
        <div className="hidden md:block fixed top-0 left-0 bottom-0 z-40 w-[280px]">
          <SidebarSkeleton />
        </div>
      ) : (
        <Sidebar config={trainerSidebarConfig} />
      )}

      {/* Main Viewport Content Layout with Dynamic Left Margin */}
      <div
        className={`transition-all duration-300 flex flex-col min-h-screen ${
          isCollapsed ? 'md:pl-[80px]' : 'md:pl-[280px]'
        }`}
      >
        {/* Full-width Topbar Header */}
        <TrainerDashboardHeader />

        {/* Centered Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export const TrainerDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <TrainerDashboardLayoutContent>{children}</TrainerDashboardLayoutContent>
    </SidebarProvider>
  );
};
