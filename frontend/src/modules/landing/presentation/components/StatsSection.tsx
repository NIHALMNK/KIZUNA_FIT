'use client';

import React from 'react';
import { VALUE_PROPOSITIONS } from '../../constants/landing.data';
import { StaggerContainer } from '../../../../shared/motion/StaggerContainer';
import { SlideUp } from '../../../../shared/motion/SlideUp';
import { ShieldCheck, UserCheck, Dumbbell, Activity } from 'lucide-react';

const icons = [ShieldCheck, UserCheck, Dumbbell, Activity];

export const StatsSection: React.FC = () => {
  return (
    <section className="relative z-10 border-y border-[var(--color-border)] bg-[var(--color-surface)] py-10 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {VALUE_PROPOSITIONS.map((prop, idx) => {
            const IconComp = icons[idx % icons.length];
            return (
              <SlideUp key={prop.title}>
                <div className="p-5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-2 h-full flex flex-col justify-center">
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`h-5 w-5 ${prop.highlightColor} shrink-0`} />
                    <h3 className="text-base font-bold text-[var(--color-heading)]">
                      {prop.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </SlideUp>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};

