'use client';

import React from 'react';
import { STATS_DATA } from '../../constants/landing.data';
import { StaggerContainer } from '../../../../shared/motion/StaggerContainer';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const StatsSection: React.FC = () => {
  return (
    <section className="relative z-10 border-y border-slate-900 bg-slate-950/80 py-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS_DATA.map((stat) => (
            <SlideUp key={stat.label}>
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md space-y-1">
                <h3 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${stat.highlightColor}`}>
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-400">
                  {stat.label}
                </p>
              </div>
            </SlideUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
