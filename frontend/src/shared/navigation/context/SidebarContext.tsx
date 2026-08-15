'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isNavRouteActive } from '../utils/navigation.utils';

interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  activeRoute: string;
  expandedGroups: Set<string>;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  toggleGroup: (groupId: string) => void;
  isRouteActive: (href: string) => boolean;
}

const STORAGE_KEY = 'kizunafit_sidebar_collapsed';

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Restore collapsed state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // Ignore
    }
  };

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const isRouteActive = (href: string) => isNavRouteActive(pathname, href);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        activeRoute: pathname,
        expandedGroups,
        toggleCollapse,
        setCollapsed,
        toggleMobile,
        openMobile,
        closeMobile,
        toggleGroup,
        isRouteActive,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = (): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};
