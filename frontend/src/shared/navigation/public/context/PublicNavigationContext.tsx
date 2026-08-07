'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PublicNavigationContextValue {
  isScrolled: boolean;
  isDrawerOpen: boolean;
  activeSection: string;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  setActiveSection: (sectionId: string) => void;
}

const PublicNavigationContext = createContext<PublicNavigationContextValue | undefined>(undefined);

export const PublicNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);
  const openDrawer = () => setIsDrawerOpen(true);

  return (
    <PublicNavigationContext.Provider
      value={{
        isScrolled,
        isDrawerOpen,
        activeSection,
        toggleDrawer,
        closeDrawer,
        openDrawer,
        setActiveSection,
      }}
    >
      {children}
    </PublicNavigationContext.Provider>
  );
};

export const usePublicNavigation = (): PublicNavigationContextValue => {
  const context = useContext(PublicNavigationContext);
  if (!context) {
    throw new Error('usePublicNavigation must be used within a PublicNavigationProvider');
  }
  return context;
};
