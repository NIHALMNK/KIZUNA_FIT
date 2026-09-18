'use client';

import React from 'react';
import { Section } from '../../../../shared/sections/Section';
import { SectionHeader } from '../../../../shared/sections/SectionHeader';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const ProgressTrackingSection: React.FC = () => {
  return (
    <Section id="telemetry" borderTop className="bg-slate-950/40">
      <SectionHeader
        badge="Biometric Telemetry"
        title={
          <>
            Real-Time Progress Engine<span className="text-emerald-400">.</span>
          </>
        }
        subtitle="Track weight trends, body recomp curves, and 1RM strength progression backed by telemetry charts."
      />

      <SlideUp>
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-8 max-w-5xl mx-auto">
          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight Loss Trend</span>
              <p className="text-2xl font-extrabold text-white">-14.2 lbs <span className="text-xs font-bold text-emerald-400">(-8.4%)</span></p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lean Muscle Mass</span>
              <p className="text-2xl font-extrabold text-white">+4.8 lbs <span className="text-xs font-bold text-cyan-400">(Recomp)</span></p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Squat 1RM PR</span>
              <p className="text-2xl font-extrabold text-white">315 lbs <span className="text-xs font-bold text-amber-400">(+35 lbs)</span></p>
            </div>
          </div>

          {/* Biometric Interactive SVG Telemetry Curve */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>12-Week Body Recomp Telemetry</span>
              <span className="text-cyan-400">Updated Today, 08:30 AM</span>
            </div>
            <div className="h-44 w-full relative pt-2">
              <svg className="w-full h-full" viewBox="0 0 500 120" fill="none" preserveAspectRatio="none">
                <path
                  d="M0 100 Q 125 70, 250 50 T 500 15"
                  stroke="url(#gradient-line-progress)"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M0 100 Q 125 70, 250 50 T 500 15 V 120 H 0 Z"
                  fill="url(#gradient-area-progress)"
                  opacity="0.18"
                />
                <defs>
                  <linearGradient id="gradient-line-progress" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="gradient-area-progress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </SlideUp>
    </Section>
  );
};
