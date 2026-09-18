'use client';

import React from 'react';
import { SectionBadge } from './SectionBadge';

interface SectionHeaderProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignStyles = align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-3xl';

  return (
    <div className={`space-y-4 mb-14 sm:mb-16 ${alignStyles} ${className}`}>
      {badge && <SectionBadge label={badge} />}
      <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
