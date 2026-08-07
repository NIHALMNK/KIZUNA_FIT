'use client';

import React from 'react';
import { HERO_DATA } from '../../constants/landing.data';

export const HeroContent: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
        {HERO_DATA.headlineLine1}<span className="text-cyan-400">.</span>
        <br className="hidden sm:inline" />
        {HERO_DATA.headlineLine2}<span className="text-teal-400">.</span>
      </h1>

      <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
        {HERO_DATA.subtitle}
      </p>
    </div>
  );
};
