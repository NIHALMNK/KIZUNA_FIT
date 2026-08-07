'use client';

import React from 'react';
import { FEATURES_DATA } from '../../constants/landing.data';
import { Section } from '../../../../shared/sections/Section';
import { SectionHeader } from '../../../../shared/sections/SectionHeader';
import { StaggerContainer } from '../../../../shared/motion/StaggerContainer';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const FeaturesSection: React.FC = () => {
  return (
    <Section id="features">
      <SectionHeader
        badge="Everything You Need"
        title={
          <>
            Built for Elite Performance<span className="text-cyan-400">.</span>
          </>
        }
        subtitle="Every feature is designed to eliminate friction between client and trainer, creating the ultimate accountability ecosystem."
      />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES_DATA.map((feature) => (
          <SlideUp key={feature.id}>
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 space-y-4 group h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </SlideUp>
        ))}
      </StaggerContainer>
    </Section>
  );
};
