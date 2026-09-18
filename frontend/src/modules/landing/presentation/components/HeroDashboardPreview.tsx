'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const HeroDashboardPreview: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mt-16 sm:mt-24 relative max-w-5xl mx-auto perspective-1000"
    >
      {/* Top Edge Beam */}
      <div className="absolute -top-[1px] inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent z-20" />

      <div className="relative rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 shadow-[0_25px_80px_-15px_rgba(2,6,23,0.95)] p-4 sm:p-8 overflow-hidden text-left">
        {/* Mockup Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-semibold text-slate-400 ml-2">KIZUNAFIT Live Biometrics Engine v2.4</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Sync Active</span>
          </div>
        </div>

        {/* Dashboard Mockup Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Client Active Program Progress */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Program</span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">12-Week Hypertrophy & Recomp</h3>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                Week 6 of 12
              </span>
            </div>

            {/* Progress Bar & Curve */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Program Completion</span>
                <span>58% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 rounded-full w-[58%]" />
              </div>
            </div>

            {/* Biometric SVG Chart Graphic */}
            <div className="h-28 w-full relative pt-2">
              <svg className="w-full h-full text-cyan-500" viewBox="0 0 400 100" fill="none" preserveAspectRatio="none">
                <path
                  d="M0 80 Q 80 60, 160 70 T 320 30 T 400 20"
                  stroke="url(#gradient-line-hero)"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M0 80 Q 80 60, 160 70 T 320 30 T 400 20 V 100 H 0 Z"
                  fill="url(#gradient-area-hero)"
                  opacity="0.15"
                />
                <defs>
                  <linearGradient id="gradient-line-hero" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="gradient-area-hero" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Card 2: Trainer 1-on-1 Snapshot */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Coach</span>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-500 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-sm">
                    MV
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Coach Marcus Vance</h4>
                  <p className="text-xs text-slate-400 font-medium">CSCS • NASM Master</p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>Next Video Session</span>
                <span className="text-cyan-400">Today, 4:00 PM</span>
              </div>
              <p className="text-[11px] text-slate-400">Form check & weekly macro adjustment</p>
            </div>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 text-xs font-bold transition-colors"
            >
              Message Coach
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
