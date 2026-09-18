'use client';

import React from 'react';

interface SectionBadgeProps {
  label: string;
  className?: string;
}

export const SectionBadge: React.FC<SectionBadgeProps> = ({ label, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-400 text-xs font-extrabold tracking-wider uppercase backdrop-blur-md shadow-inner ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      <span>{label}</span>
    </div>
  );
};
