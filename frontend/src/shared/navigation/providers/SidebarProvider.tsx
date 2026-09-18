'use client';

import React from 'react';
import { SidebarContextProvider } from '../context/SidebarContext';

export interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  return <SidebarContextProvider>{children}</SidebarContextProvider>;
};
