'use client';

import { useSidebarContext } from '../context/SidebarContext';

export const useSidebar = () => {
  return useSidebarContext();
};
