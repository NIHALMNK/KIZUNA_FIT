'use client';

import React from 'react';
import { SidebarConfig } from '../types/navigation.types';
import { SidebarSection } from './SidebarSection';
import { SidebarItem } from './SidebarItem';

interface SidebarBodyProps {
  config: SidebarConfig;
  onItemClick?: () => void;
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({ config, onItemClick }) => {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-4 custom-sidebar-scrollbar w-full max-w-full">
      {config.sections.map((section) => (
        <div key={section.id} className="space-y-1 w-full max-w-full overflow-hidden">
          <SidebarSection title={section.title} />
          <div className="space-y-0.5 w-full max-w-full overflow-hidden">
            {section.items.map((item) => (
              <SidebarItem key={item.id} item={item} onClick={onItemClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
