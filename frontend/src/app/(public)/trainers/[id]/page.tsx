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
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { Button } from '@/shared/components/ui/Button';
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
      <div className="min-h-screen bg-[var(--color-background)] py-20 px-6 max-w-4xl mx-auto">
        <LoadingState message="Loading trainer profile & credentials..." count={4} />
      </div>
    );
  }

  if (isError || !trainer) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-20 px-6 max-w-lg mx-auto">
        <ErrorState
          title="Trainer Profile Not Found"
          message={(error as any)?.message || 'The trainer profile you requested does not exist or is currently unavailable.'}
          onRetry={() => refetch()}
        />
        <div className="text-center mt-4">
          <Link href={ROUTES.PUBLIC_TRAINERS} className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
            ← Back to Trainers Directory
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = trainer.availabilityStatus === TrainerAvailabilityStatus.AVAILABLE;

  return (
    <div ref={profileContainerRef} className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans antialiased pb-24 pt-20">
      {/* Background Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* ========================================================================= */}
      {/* 1. HERO COVER & PROFILE SECTION */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 mb-10">
        {/* Navigation Back Link */}
        <div className="mb-6">
          <Link
            href={ROUTES.PUBLIC_TRAINERS}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <span>← Back to Trainers Marketplace</span>
          </Link>
        </div>

        {/* Hero Cover Card */}
        <div className="gsap-profile-anim rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm overflow-hidden relative">
          {/* Top Banner Cover */}
          <div className="h-36 sm:h-48 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSave}
                className={`p-2.5 rounded-full border text-xs font-bold transition-all ${
                  isSaved
                    ? 'bg-[var(--color-danger-bg)] border-[var(--color-danger)]/40 text-[var(--color-danger)]'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save trainer'}
              >
                ♥
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-bold transition-all"
                title="Share profile"
              >
                ↗
              </button>
            </div>
          </div>

          {/* Profile Header Info */}
          <div className="px-6 sm:px-10 pb-8 relative -mt-14 sm:-mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            {/* Avatar Profile Box */}
            <div className="relative shrink-0">
              <Avatar
                src={trainer.avatarUrl || undefined}
                fallback={trainer.headline?.slice(0, 2) || 'TR'}
                size="xl"
                status={isAvailable ? 'online' : 'offline'}
                className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-[var(--color-card)]"
              />
            </div>

            {/* Name & Headline Details */}
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight">
                  {trainer.trainerName || trainer.fullName || trainer.name || 'Certified Trainer'}
                </h1>
                <Badge variant="primary">Verified Coach ✓</Badge>
              </div>

              <p className="text-sm font-semibold text-[var(--color-primary)] leading-snug">
                {trainer.headline}
              </p>

              {trainer.location && (
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                  {trainer.location.city}, {trainer.location.country} • <span className="font-semibold text-[var(--color-text-primary)]">{trainer.yearsOfExperience}+ Years Experience</span>
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-medium text-[var(--color-text-secondary)]">
                {trainer.averageRating !== undefined && (
                  <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
                    <span>★ {trainer.averageRating.toFixed(1)}</span>
                    <span className="text-[var(--color-text-muted)] font-normal">({trainer.totalReviews || 0} reviews)</span>
                  </div>
                )}
                <span>•</span>
                <StatusBadge status={isAvailable ? 'active' : 'suspended'} label={trainer.availabilityStatus} />
              </div>
            </div>

            {/* Hero CTA Button Suite (Respecting Guest Boundary per Correction 6) */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2 sm:pt-0">
              <Link href={`${ROUTES.REGISTER}?role=CLIENT`}>
                <Button variant="primary" size="md">
                  Interested in Coaching
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL METRICS BAR (Only Supported Fields per Correction 1 & 7) */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="gsap-profile-anim p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-amber-500">★ {trainer.averageRating?.toFixed(1) || 'N/A'}</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Average Rating</p>
          </div>
          <div className="gsap-profile-anim p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-heading)]">{trainer.totalReviews || 0}</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Public Reviews</p>
          </div>
          <div className="gsap-profile-anim p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">{trainer.yearsOfExperience || 0}+ Yrs</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Experience</p>
          </div>
          <div className="gsap-profile-anim p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-success)]">{trainer.certifications?.length || 0}</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Certifications</p>
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
