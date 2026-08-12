'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGetPublicTrainerProfile } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { useAuthStore } from '@/modules/identity/application/store/authStore';
import { RequestCoachingModal } from '@/modules/marketplace/presentation/components/RequestCoachingModal';
import { ROUTES } from '@/shared/constants/routes';
import { TrainerAvailabilityStatus } from '@/modules/profile/domain/enums/profile.enums';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { Button } from '@/shared/components/ui/Button';
import { socketClientService } from '@/infrastructure/realtime/SocketClientService';
import { toast } from 'sonner';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PublicTrainerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const trainerId = params?.id as string;

  const { status: authStatus, user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: trainer,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPublicTrainerProfile(trainerId);

  const [isSaved, setIsSaved] = useState(false);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  // Subscribe to realtime trainer profile room updates
  useEffect(() => {
    const targetId = trainer?.id || trainerId;
    if (!targetId) return;

    socketClientService.subscribeToTrainerProfile(targetId);

    return () => {
      socketClientService.unsubscribeFromTrainerProfile(targetId);
    };
  }, [trainer?.id, trainerId]);

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
        },
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

  const handleCoachingCTA = () => {
    if (authStatus !== 'authenticated' || !user) {
      toast.info('Please log in or register as a client to request coaching.');
      router.push(`${ROUTES.LOGIN}?redirect=/trainers/${trainerId}`);
      return;
    }

    if (user.role === 'TRAINER') {
      toast.warning('Trainers cannot submit coaching requests to other trainers.');
      return;
    }

    setIsModalOpen(true);
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
          message={
            (error as any)?.message ||
            'The trainer profile you requested does not exist or is currently unavailable.'
          }
          onRetry={() => refetch()}
        />
        <div className="text-center mt-4">
          <Link
            href={ROUTES.PUBLIC_TRAINERS}
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            ← Back to Trainers Directory
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = trainer.availabilityStatus === TrainerAvailabilityStatus.AVAILABLE;
  const ratingDisplay =
    trainer.totalReviews > 0 ? `★ ${trainer.averageRating?.toFixed(1)}` : 'No reviews yet';
  const trainerDisplayName =
    trainer.trainerName || trainer.fullName || trainer.name || 'Certified Trainer';

  return (
    <div
      ref={profileContainerRef}
      className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans antialiased pb-24 pt-20"
    >
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
                  {trainerDisplayName}
                </h1>
                <Badge variant="primary">Verified Coach ✓</Badge>
              </div>

              <p className="text-sm font-semibold text-[var(--color-primary)] leading-snug">
                {trainer.headline}
              </p>

              {trainer.location && (
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                  {trainer.location.city}, {trainer.location.country} •{' '}
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {trainer.yearsOfExperience}+ Years Experience
                  </span>
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-medium text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
                  <span>{ratingDisplay}</span>
                  {trainer.totalReviews > 0 && (
                    <span className="text-[var(--color-text-muted)] font-normal">
                      ({trainer.totalReviews} reviews)
                    </span>
                  )}
                </div>
                <span>•</span>
                <StatusBadge
                  status={isAvailable ? 'active' : 'suspended'}
                  label={trainer.availabilityStatus}
                />
              </div>
            </div>

            {/* Hero CTA Button */}
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2 sm:pt-0">
              <Button variant="primary" size="md" onClick={handleCoachingCTA}>
                Interested in Coaching
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL METRICS BAR */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="gsap-profile-anim p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-amber-500">
              {trainer.totalReviews > 0 ? `★ ${trainer.averageRating?.toFixed(1)}` : 'N/A'}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Average Rating</p>
          </div>
          <div className="gsap-profile-anim p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-heading)]">
              {trainer.totalReviews || 0}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Public Reviews</p>
          </div>
          <div className="gsap-profile-anim p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-primary)]">
              {trainer.yearsOfExperience || 0}+ Yrs
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Experience</p>
          </div>
          <div className="gsap-profile-anim p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-success)]">
              {trainer.certifications?.length || 0}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">Certifications</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN 2-COLUMN CONTENT GRID */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Main Information */}
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
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Languages Spoken
                </span>
                <p className="text-sm font-semibold text-white">
                  {trainer.languages && trainer.languages.length > 0
                    ? trainer.languages.join(', ')
                    : 'Not specified'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Location
                </span>
                <p className="text-sm font-semibold text-white">
                  {trainer.location
                    ? `${trainer.location.city}, ${trainer.location.state}, ${trainer.location.country}`
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. SPECIALIZATIONS */}
          {/* ========================================================================= */}
          {trainer.specializations && trainer.specializations.length > 0 && (
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
          )}

          {/* ========================================================================= */}
          {/* 5. VERIFIED CERTIFICATIONS */}
          {/* ========================================================================= */}
          <div className="gsap-profile-anim p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center justify-between">
              <span>Verified Certifications</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {trainer.certifications ? trainer.certifications.length : 0} Credentials Verified
              </span>
            </h3>

            {!trainer.certifications || trainer.certifications.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No verified certifications listed yet.
              </p>
            ) : (
              <div className="space-y-3">
                {trainer.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                  >
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

            {!trainer.showcase || trainer.showcase.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No showcase items available.</p>
            ) : (
              <div className="space-y-4">
                {trainer.showcase.map((item) => (
                  <div
                    key={item.showcaseId}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2"
                  >
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
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="space-y-8">
          {/* Coaching Availability Status Card */}
          <div className="gsap-profile-anim p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <h3 className="text-lg font-bold text-white">Coaching Availability</h3>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Status</span>
                <StatusBadge
                  status={isAvailable ? 'active' : 'suspended'}
                  label={trainer.availabilityStatus}
                />
              </div>
              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                {isAvailable
                  ? 'This coach is currently accepting new 1-on-1 clients.'
                  : 'This coach is currently at capacity or unavailable for new clients.'}
              </p>
              <Button variant="primary" size="md" className="w-full" onClick={handleCoachingCTA}>
                Interested in Coaching
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Coaching Modal */}
      <RequestCoachingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trainerId={trainer.id || trainerId}
        trainerName={trainerDisplayName}
        trainerHeadline={trainer.headline}
        avatarUrl={trainer.avatarUrl || undefined}
      />
    </div>
  );
}
