'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGetPublicTrainerProfile } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { ROUTES } from '@/shared/constants/routes';
import { TrainerAvailabilityStatus } from '@/modules/profile/domain/enums/profile.enums';
import { toast } from 'sonner';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PublicTrainerDetailsPage() {
  const params = useParams();
  const trainerId = params?.id as string;

  const { data: trainer, isLoading, isError, error, refetch } = useGetPublicTrainerProfile(trainerId);

  const [isSaved, setIsSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  // GSAP animation on trainer profile load
  useEffect(() => {
    if (typeof window === 'undefined' || !profileContainerRef.current || !trainer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-profile-anim',
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    });

    return () => ctx.revert();
  }, [trainer]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Trainer profile link copied to clipboard!');
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Trainer removed from saved' : 'Trainer saved to favorites!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-20 px-6">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-md w-full space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto" />
          <div className="h-5 bg-slate-800 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-slate-800/60 rounded w-1/2 mx-auto" />
          <p className="text-xs text-slate-400 font-semibold pt-2">Loading trainer profile & credentials...</p>
        </div>
      </div>
    );
  }

  if (isError || !trainer) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-20 px-6">
        <div className="p-8 rounded-3xl bg-slate-900/70 border border-rose-500/30 text-center max-w-md w-full space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 font-bold">
            ✕
          </div>
          <h3 className="text-xl font-bold text-white">Trainer Profile Not Found</h3>
          <p className="text-xs text-slate-400">
            {(error as any)?.message || 'The trainer profile you requested does not exist or is currently unavailable.'}
          </p>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => refetch()}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
            >
              Retry Loading
            </button>
            <Link
              href={ROUTES.PUBLIC_TRAINERS}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ← Back to Trainers Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = trainer.availabilityStatus === TrainerAvailabilityStatus.AVAILABLE;
  const isBusy = trainer.availabilityStatus === TrainerAvailabilityStatus.BUSY;

  return (
    <div ref={profileContainerRef} className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white font-sans antialiased overflow-x-hidden pb-32 pt-20">
      {/* Background Ambient Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] opacity-70" />
        <div className="absolute top-[35%] -left-[15%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] opacity-50" />
        <div className="absolute top-[65%] -right-[15%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[180px] opacity-40" />
      </div>

      {/* Texture Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]" />

      {/* ========================================================================= */}
      {/* 1. HERO COVER & PROFILE SECTION */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 mb-12">
        {/* Navigation Back Link */}
        <div className="mb-6">
          <Link
            href={ROUTES.PUBLIC_TRAINERS}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span>← Back to Trainers Marketplace</span>
          </Link>
        </div>

        {/* Hero Cover Card */}
        <div className="gsap-profile-anim rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
          {/* Top Banner Cover */}
          <div className="h-44 sm:h-56 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-blue-600/10 opacity-70" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSave}
                className={`p-2.5 rounded-full backdrop-blur-md border text-xs font-bold transition-all ${
                  isSaved
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save trainer'}
              >
                ♥
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-slate-950/60 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md text-xs font-bold transition-all"
                title="Share profile"
              >
                ↗
              </button>
            </div>
          </div>

          {/* Profile Header Info */}
          <div className="px-6 sm:px-10 pb-8 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            {/* Avatar Profile Box */}
            <div className="relative shrink-0">
              {trainer.avatarUrl ? (
                <img
                  src={trainer.avatarUrl}
                  alt={trainer.headline}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-slate-950 shadow-2xl"
                />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-blue-600 p-1 shadow-2xl border-4 border-slate-950">
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-extrabold text-white text-3xl">
                    {trainer.headline.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              )}

              {/* Online Status Indicator */}
              <span
                className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-slate-950 ${
                  isAvailable ? 'bg-emerald-400 animate-pulse' : isBusy ? 'bg-amber-400' : 'bg-slate-600'
                }`}
                title={`Status: ${trainer.availabilityStatus}`}
              />
            </div>

            {/* Name & Headline Details */}
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {trainer.trainerName || trainer.fullName || trainer.name || 'Coach Marcus Vance'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Verified Coach ✓
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-cyan-400/90 leading-snug">
                {trainer.headline}
              </p>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {trainer.location.city}, {trainer.location.country} • <span className="text-cyan-400 font-bold">{trainer.yearsOfExperience}+ Years</span> Master Coach Experience
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span>★ {trainer.averageRating.toFixed(1)}</span>
                  <span className="text-slate-500 font-normal">({trainer.totalReviews} reviews)</span>
                </div>
                <span>•</span>
                <span>Response Time: <span className="text-emerald-400 font-bold">Under 1 Hour</span></span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                  {trainer.availabilityStatus}
                </span>
              </div>
            </div>

            {/* Hero CTA Button Suite */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2 sm:pt-0">
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl shadow-lg shadow-cyan-950/40 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <span>Book Consultation</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-2xl transition-colors"
              >
                <span>Send Message</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. QUICK STATISTICS BAR */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="gsap-profile-anim p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400">★ {trainer.averageRating.toFixed(1)}</h3>
            <p className="text-[11px] font-semibold text-slate-400">Client Rating</p>
          </div>
          <div className="gsap-profile-anim p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">250+</h3>
            <p className="text-[11px] font-semibold text-slate-400 font-medium">Active Clients</p>
          </div>
          <div className="gsap-profile-anim p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{trainer.yearsOfExperience}+ Yrs</h3>
            <p className="text-[11px] font-semibold text-slate-400">Experience</p>
          </div>
          <div className="gsap-profile-anim p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400">1,200+</h3>
            <p className="text-[11px] font-semibold text-slate-400">Sessions Completed</p>
          </div>
          <div className="gsap-profile-anim col-span-2 md:col-span-1 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-400">98.4%</h3>
            <p className="text-[11px] font-semibold text-slate-400">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN 2-COLUMN CONTENT GRID */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Main Information (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-10">
          {/* ========================================================================= */}
          {/* 3. ABOUT THE TRAINER */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>About the Coach</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-pre-line bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
              {trainer.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Languages Spoken</span>
                <p className="text-sm font-semibold text-white">
                  {trainer.languages.length > 0 ? trainer.languages.join(', ') : 'English'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Coaching Philosophy</span>
                <p className="text-sm font-semibold text-white">Data-Driven Biometrics & 1-on-1 Accountability</p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. SPECIALIZATIONS */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white">Coaching Specializations</h3>
            <div className="flex flex-wrap gap-2.5">
              {trainer.specializations.map((spec) => (
                <span
                  key={spec}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold"
                >
                  ⚡ {spec}
                </span>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. VERIFIED CERTIFICATIONS */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center justify-between">
              <span>Verified Certifications</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {trainer.certifications.length} Credentials Verified
              </span>
            </h3>

            {trainer.certifications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No verified certifications listed yet.</p>
            ) : (
              <div className="space-y-3">
                {trainer.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{cert.organization}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                      Verified ✓
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 6. SHOWCASE PORTFOLIO */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white">Showcase & Portfolio</h3>

            {trainer.showcase.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No showcase items available.</p>
            ) : (
              <div className="space-y-4">
                {trainer.showcase.map((item) => (
                  <div key={item.showcaseId} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                      {item.description}
                    </p>
                    {item.mediaUrl && (
                      <a
                        href={item.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 text-xs font-semibold hover:text-cyan-300 transition-colors"
                      >
                        <span>View Attachment</span>
                        <span>→</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 7. CLIENT TRANSFORMATIONS */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-6">
            <h3 className="text-xl font-bold text-white">Client Transformation Stories</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white">Sarah J.</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">-22 lbs • 12 Weeks</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  "Achieved my lowest body fat percentage in 8 years. The weekly macro adjustments and posture check-ins made all the difference."
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white">Michael C.</span>
                  <span className="text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">+14 lbs Muscle • 16 Weeks</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  "Hit a 405 lb deadlift safely while maintaining a demanding executive work schedule."
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 8. VERIFIED REVIEWS */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Client Reviews ({trainer.totalReviews})</h3>
              <span className="text-amber-400 text-sm font-bold">★ {trainer.averageRating.toFixed(1)} / 5.0</span>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span>Daniel K.</span>
                    <span className="text-amber-400">★★★★★</span>
                  </div>
                  <span className="text-slate-500">2 weeks ago</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  "Incredible attention to detail during form checks. Always responds quickly with precise coaching advice."
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span>Elena P.</span>
                    <span className="text-amber-400">★★★★★</span>
                  </div>
                  <span className="text-slate-500">1 month ago</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  "The customized nutrition and macro plan was super easy to follow. Highly recommend!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar (Pricing, Availability, FAQ) */}
        <div className="space-y-8">
          {/* ========================================================================= */}
          {/* 9. COACHING PACKAGES & PRICING */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5">
            <h3 className="text-lg font-bold text-white">Coaching Packages</h3>

            {/* Package 1 */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">12-Week Transformation</h4>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">Most Popular</span>
              </div>
              <p className="text-2xl font-extrabold text-white">$49 <span className="text-xs font-medium text-slate-400">/ week</span></p>
              <ul className="text-xs text-slate-300 font-medium space-y-1.5 pt-1">
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Custom Workout Routine</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Weekly Video Check-Ins</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Macro Nutrition Guidance</li>
              </ul>
              <Link
                href={ROUTES.LOGIN}
                className="block text-center w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Select Package
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 10. AVAILABILITY CALENDAR */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-lg font-bold text-white">Weekly Availability</h3>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-semibold">
              <div className="flex justify-between text-slate-300">
                <span>Monday - Friday</span>
                <span className="text-cyan-400">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Saturday</span>
                <span className="text-cyan-400">10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Sunday</span>
                <span>Rest Day</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 11. FAQ ACCORDION */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-lg font-bold text-white">Frequently Asked Questions</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer" onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}>
                <div className="flex justify-between font-bold text-white">
                  <span>How do 1-on-1 video check-ins work?</span>
                  <span>{openFaq === 0 ? '-' : '+'}</span>
                </div>
                {openFaq === 0 && (
                  <p className="mt-2 text-slate-400 font-medium leading-relaxed">
                    Check-ins occur weekly via integrated HD video calls directly inside the KIZUNAFIT portal.
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer" onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}>
                <div className="flex justify-between font-bold text-white">
                  <span>Can I change my workout plan later?</span>
                  <span>{openFaq === 1 ? '-' : '+'}</span>
                </div>
                {openFaq === 1 && (
                  <p className="mt-2 text-slate-400 font-medium leading-relaxed">
                    Yes, your coach updates your routine weekly based on your performance telemetry.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
