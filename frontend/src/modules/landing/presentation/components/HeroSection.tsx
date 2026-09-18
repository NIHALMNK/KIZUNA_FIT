'use client';

import React from 'react';
import { HeroBadge } from './HeroBadge';
import { HeroContent } from './HeroContent';
import { HeroButtons } from './HeroButtons';
import { HeroDashboardPreview } from './HeroDashboardPreview';
import { HeroBackground } from './HeroBackground';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative z-10 pt-12 sm:pt-16 pb-20 sm:pb-32 px-6 sm:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      <HeroBackground />

      <SlideUp duration={0.6}>
        <HeroBadge />
        <HeroContent />
        <HeroButtons />
      </SlideUp>

      <HeroDashboardPreview />
    </section>
  );
};
