'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HERO_DATA } from '../../constants/landing.data';

export const HeroButtons: React.FC = () => {
  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
      {/* Primary CTA */}
      <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
        <Link
          href={HERO_DATA.primaryCta.href}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-extrabold text-white btn-public-primary rounded-2xl shadow-xl shadow-cyan-950/60"
        >
          <span>{HERO_DATA.primaryCta.label}</span>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </motion.div>

      {/* Secondary CTA */}
      <Link
        href={HERO_DATA.secondaryCta.href}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-extrabold btn-public-secondary rounded-2xl"
      >
        <span>{HERO_DATA.secondaryCta.label}</span>
      </Link>
    </div>
  );
};
