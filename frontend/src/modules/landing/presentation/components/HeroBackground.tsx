'use client';

import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] opacity-70" />
    </div>
  );
};
