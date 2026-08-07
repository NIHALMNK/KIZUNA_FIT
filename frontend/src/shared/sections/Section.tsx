'use client';

import React from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  borderTop?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  id,
  className = '',
  children,
  borderTop = false,
}) => {
  return (
    <section
      id={id}
      className={`relative z-10 py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto ${
        borderTop ? 'border-t border-slate-900' : ''
      } ${className}`}
    >
      {children}
    </section>
  );
};
