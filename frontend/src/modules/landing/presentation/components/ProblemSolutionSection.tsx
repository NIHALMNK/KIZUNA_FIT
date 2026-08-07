'use client';

import React from 'react';
import { PROBLEM_SOLUTION_DATA } from '../../constants/landing.data';
import { Section } from '../../../../shared/sections/Section';
import { SectionHeader } from '../../../../shared/sections/SectionHeader';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const ProblemSolutionSection: React.FC = () => {
  const { badge, title, subtitle, oldWay, newWay } = PROBLEM_SOLUTION_DATA;

  return (
    <Section id="about">
      <SectionHeader
        badge={badge}
        title={
          <>
            {title.replace('.', '')}
            <span className="text-rose-500">.</span>
          </>
        }
        subtitle={subtitle}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Old Way */}
        <SlideUp delay={0.1}>
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-rose-500/20 space-y-6 relative overflow-hidden h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                ✕
              </div>
              <h3 className="text-xl font-bold text-white">{oldWay.title}</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-300 font-medium">
              {oldWay.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </SlideUp>

        {/* The KIZUNAFIT Way */}
        <SlideUp delay={0.2}>
          <div className="p-8 rounded-3xl bg-slate-900/70 border border-cyan-500/30 space-y-6 relative overflow-hidden backdrop-blur-xl shadow-xl shadow-cyan-950/20 h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">{newWay.title}</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-200 font-medium">
              {newWay.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="text-cyan-400 font-bold shrink-0">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </SlideUp>
      </div>
    </Section>
  );
};
