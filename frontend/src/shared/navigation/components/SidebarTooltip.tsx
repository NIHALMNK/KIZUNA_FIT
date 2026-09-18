'use client';

import React, { useState } from 'react';

interface SidebarTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'right' | 'top';
  disabled?: boolean;
}

export const SidebarTooltip: React.FC<SidebarTooltipProps> = ({
  content,
  children,
  side = 'right',
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled || !content) {
    return <>{children}</>;
  }

  const sideClasses =
    side === 'right'
      ? 'left-full ml-3 top-1/2 -translate-y-1/2'
      : 'bottom-full mb-2 left-1/2 -translate-x-1/2';

  return (
    <div
      className="relative inline-flex w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      aria-label={content}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={`aria-hidden:hidden absolute z-50 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-100 shadow-xl backdrop-blur-md whitespace-nowrap pointer-events-none transition-opacity duration-150 animate-in fade-in-0 ${sideClasses}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
