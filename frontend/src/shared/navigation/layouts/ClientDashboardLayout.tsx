'use client';

import React from 'react';
import { SidebarProvider } from '../providers/SidebarProvider';
import { Sidebar } from '../components/Sidebar';
import { clientSidebarConfig } from '../config/clientSidebar.config';
import { ClientDashboardHeader } from './ClientDashboardHeader';
import { useSidebar } from '../hooks/useSidebar';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useLogout } from '../../../modules/identity/application/hooks/useLogout';
import { SidebarSkeleton } from '../components/SidebarSkeleton';

interface ClientDashboardLayoutContentProps {
  children: React.ReactNode;
}

const ClientDashboardLayoutContent: React.FC<ClientDashboardLayoutContentProps> = ({ children }) => {
  const { isCollapsed } = useSidebar();
  const { status, user } = useAuthStore();
  const logoutMutation = useLogout();

  const isLoading = status === 'loading';

  const currentUser = user
    ? {
        id: user.id,
        email: user.email,
        name: user.email?.split('@')[0] || 'Client User',
        role: 'CLIENT',
        subscriptionPlan: 'Free',
        isOnline: true,
      }
    : null;

  return (
    <div className="theme-client min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans antialiased relative selection:bg-[var(--color-primary)] selection:text-white">
      {/* Universal Sidebar Component Engine */}
      {isLoading ? (
        <div className="hidden md:block fixed top-0 left-0 bottom-0 z-40 w-[280px]">
          <SidebarSkeleton />
        </div>
      ) : (
        <Sidebar
          config={clientSidebarConfig}
          user={currentUser}
          onLogout={() => logoutMutation.mutate()}
        />
      )}

      {/* Main Viewport Content Layout with Dynamic Left Margin */}
      <div
        className={`transition-all duration-300 flex flex-col min-h-screen ${
          isCollapsed ? 'md:pl-[80px]' : 'md:pl-[280px]'
        }`}
      >
        {/* Full-width Topbar Header */}
        <ClientDashboardHeader />

        {/* Centered Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export const ClientDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <ClientDashboardLayoutContent>{children}</ClientDashboardLayoutContent>
    </SidebarProvider>
  );
};
