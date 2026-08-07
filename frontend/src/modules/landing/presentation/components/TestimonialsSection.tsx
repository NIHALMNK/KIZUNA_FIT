'use client';

import React from 'react';
import { TESTIMONIALS_DATA } from '../../constants/landing.data';
import { Section } from '../../../../shared/sections/Section';
import { SectionHeader } from '../../../../shared/sections/SectionHeader';
import { StaggerContainer } from '../../../../shared/motion/StaggerContainer';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const TestimonialsSection: React.FC = () => {
  return (
    <Section id="testimonials">
      <SectionHeader
        badge="Proven Results"
        title={
          <>
            Client Success Stories<span className="text-cyan-400">.</span>
          </>
        }
        subtitle="Real physical transformations from real people using KIZUNAFIT 1-on-1 coaching."
      />

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS_DATA.map((item) => (
          <SlideUp key={item.id}>
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  {[...Array(item.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-slate-200 text-sm font-medium leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-1">
                <h4 className="text-sm font-extrabold text-white">{item.author}</h4>
                <p className="text-xs text-slate-400 font-semibold">{item.role}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                  {item.result}
                </span>
              </div>
            </div>
          </SlideUp>
        ))}
      </StaggerContainer>
    </Section>
  );
};
