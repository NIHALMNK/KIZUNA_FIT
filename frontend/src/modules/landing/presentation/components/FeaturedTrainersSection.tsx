'use client';

import React from 'react';
import Link from 'next/link';
import { FEATURED_TRAINERS_DATA } from '../../constants/landing.data';
import { PUBLIC_ROUTES } from '../../../../shared/constants/routes/public.routes';
import { Section } from '../../../../shared/sections/Section';
import { StaggerContainer } from '../../../../shared/motion/StaggerContainer';
import { SlideUp } from '../../../../shared/motion/SlideUp';

export const FeaturedTrainersSection: React.FC = () => {
  return (
    <Section id="trainers">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Featured Coaches</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Meet Elite Trainers<span className="text-cyan-400">.</span>
          </h2>
          <p className="text-base text-slate-300 font-medium max-w-xl">
            Every trainer on KIZUNAFIT is rigorously vetted, certified, and dedicated to your physical success.
          </p>
        </div>

        <Link
          href={PUBLIC_ROUTES.FIND_TRAINERS}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sm font-bold text-slate-200 hover:text-white w-fit transition-colors"
        >
          <span>Explore All Certified Trainers</span>
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURED_TRAINERS_DATA.map((trainer) => (
          <SlideUp key={trainer.id}>
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${trainer.gradient} p-0.5 shrink-0 shadow-md`}>
                    <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-extrabold text-white text-lg">
                      {trainer.initials}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{trainer.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{trainer.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-amber-400">
                      <span>{trainer.rating}</span>
                      <span className="text-slate-500 font-normal">({trainer.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {trainer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Starting at</span>
                  <p className="text-base font-extrabold text-white">
                    {trainer.price} <span className="text-xs font-medium text-slate-400">/ week</span>
                  </p>
                </div>
                <Link
                  href={PUBLIC_ROUTES.TRAINER_PROFILE(trainer.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </SlideUp>
        ))}
      </StaggerContainer>
    </Section>
  );
};
