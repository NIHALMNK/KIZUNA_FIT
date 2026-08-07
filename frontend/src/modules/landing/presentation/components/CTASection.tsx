'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PUBLIC_ROUTES } from '../../../../shared/constants/routes/public.routes';
import { Section } from '../../../../shared/sections/Section';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const CTASection: React.FC = () => {
  return (
    <Section id="pricing">
      <SlideUp>
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30 p-10 sm:p-16 text-center space-y-8 overflow-hidden shadow-2xl shadow-cyan-950/40 max-w-5xl mx-auto">
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />

          <div className="space-y-4 max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Start Your Journey Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
              Ready to Transform Your Fitness<span className="text-cyan-400">?</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium">
              Join thousands of clients working 1-on-1 with certified master trainers on KIZUNAFIT.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 max-w-md mx-auto">
            <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href={PUBLIC_ROUTES.FIND_TRAINERS}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-extrabold text-white btn-public-primary rounded-2xl shadow-xl shadow-cyan-950/60"
              >
                <span>Find Your Trainer Now</span>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>

            <Link
              href={PUBLIC_ROUTES.LOGIN}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-extrabold btn-public-secondary rounded-2xl"
            >
              <span>Login to Account</span>
            </Link>
          </div>
        </div>
      </SlideUp>
    </Section>
  );
};
