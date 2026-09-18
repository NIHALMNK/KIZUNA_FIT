'use client';

import React from 'react';
import { HeroSection } from './presentation/components/HeroSection';
import { StatsSection } from './presentation/components/StatsSection';
import { ProblemSolutionSection } from './presentation/components/ProblemSolutionSection';
import { FeaturesSection } from './presentation/components/FeaturesSection';
import { HowItWorksSection } from './presentation/components/HowItWorksSection';
import { FeaturedTrainersSection } from './presentation/components/FeaturedTrainersSection';
import { ProgressTrackingSection } from './presentation/components/ProgressTrackingSection';
import { TestimonialsSection } from './presentation/components/TestimonialsSection';
import { CTASection } from './presentation/components/CTASection';

export default function LandingPage() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Platform Statistics Bar */}
      <StatsSection />

      {/* 3. Problem vs Solution Comparison */}
      <ProblemSolutionSection />

      {/* 4. Features Grid */}
      <FeaturesSection />

      {/* 5. How It Works Timeline */}
      <HowItWorksSection />

      {/* 6. Featured Trainers Marketplace Preview */}
      <FeaturedTrainersSection />

      {/* 7. Biometrics Telemetry & Progress Engine */}
      <ProgressTrackingSection />

      {/* 8. Testimonials & Client Transformations */}
      <TestimonialsSection />

      {/* 9. Final Call To Action */}
      <CTASection />
    </>
  );
}
