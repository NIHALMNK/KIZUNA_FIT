'use client';

import { usePathname } from 'next/navigation';
import { usePublicNavigation } from '../context/PublicNavigationContext';

export const usePublicNavbar = () => {
  const pathname = usePathname();
  const navigationState = usePublicNavigation();

  // Helper to determine if a route is currently active
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href.startsWith('/#')) {
      // Hash section link on home page
      const section = href.replace('/#', '');
      return pathname === '/' && navigationState.activeSection === section;
    }
    return pathname.startsWith(href);
  };

  return {
    ...navigationState,
    pathname,
    isLinkActive,
  };
};
