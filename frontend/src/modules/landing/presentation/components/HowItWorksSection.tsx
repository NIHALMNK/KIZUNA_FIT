'use client';

import React from 'react';
import { HOW_IT_WORKS_DATA } from '../../constants/landing.data';
import { Section } from '../../../../shared/sections/Section';
import { SectionHeader } from '../../../../shared/sections/SectionHeader';
import { StaggerContainer } from '../../../../shared/motion/StaggerContainer';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const HowItWorksSection: React.FC = () => {
  return (
    <Section id="how-it-works" borderTop className="bg-slate-950/60">
      <SectionHeader
        badge="Simple From Day One"
        title={
          <>
            How KIZUNAFIT Works<span className="text-cyan-400">.</span>
          </>
        }
        subtitle="Four simple steps to kickstart your physical transformation with elite 1-on-1 coaching."
      />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {HOW_IT_WORKS_DATA.map((step) => (
          <SlideUp key={step.step}>
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 relative space-y-3 h-full">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-sm flex items-center justify-center border border-cyan-500/30">
                {step.step}
              </span>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          </SlideUp>
        ))}
      </StaggerContainer>
    </Section>
  );
};
