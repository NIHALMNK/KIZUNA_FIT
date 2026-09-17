'use client';

import React from 'react';
import Link from 'next/link';
import { CoachingRelationship } from '@/modules/coaching/domain/types/coaching.types';
import { useGetPublicTrainerProfile } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import {
  Trophy,
  Dumbbell,
  Apple,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Award,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';

interface Stage6MyTrainerProps {
  coaching: CoachingRelationship;
}

export const Stage6MyTrainer: React.FC<Stage6MyTrainerProps> = ({ coaching }) => {
  const { data: trainerProfile } = useGetPublicTrainerProfile(coaching.trainerId);

  const displayName =
    trainerProfile?.fullName ||
    trainerProfile?.trainerName ||
    trainerProfile?.name ||
    coaching.trainer?.fullName ||
    'Your Assigned Coach';

  const displayAvatar = trainerProfile?.avatarUrl || coaching.trainer?.avatarUrl;

  const startDateStr = coaching.startedAt || coaching.timeline?.activatedAt || coaching.createdAt;

  const formattedStartDate = startDateStr
    ? new Date(startDateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Active';

  const specializations =
    trainerProfile?.specializations ||
    (coaching.trainer?.specialization ? [coaching.trainer.specialization] : []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Active Coach Hub Card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--color-surface-alt)] border-2 border-[var(--color-primary)] overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
              {displayAvatar ? (
                <Image src={displayAvatar} alt={displayName} fill className="object-cover" />
              ) : (
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-text-muted)]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  <CheckCircle className="w-3 h-3" />
                  Active Coaching Contract
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-[var(--color-heading)] mt-1">
                {displayName}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
                {trainerProfile?.headline || 'Your Dedicated 1-on-1 Fitness Coach'}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--color-border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Coaching Since
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)]">
              {formattedStartDate}
            </span>
            {coaching.planType && (
              <span className="text-[11px] font-semibold text-[var(--color-primary)] mt-0.5">
                {coaching.planType} Plan
              </span>
            )}
          </div>
        </div>

        {/* Coach Bio & Highlights */}
        {trainerProfile?.bio && (
          <div className="p-4 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] space-y-1">
            <span className="text-[11px] font-bold uppercase text-[var(--color-text-muted)] tracking-wider">
              Coach Philosophy
            </span>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {trainerProfile.bio}
            </p>
          </div>
        )}

        {/* Specializations & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
          {specializations.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--color-heading)] block">
                Focus Areas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[var(--color-tag)] text-[var(--color-primary)] border border-[var(--color-border)]"
                  >
                    {spec.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {trainerProfile?.certifications && trainerProfile.certifications.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--color-heading)] block">
                Verified Credentials
              </span>
              <div className="space-y-1">
                {trainerProfile.certifications.slice(0, 2).map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]"
                  >
                    <Award className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                    <span className="font-semibold">{cert.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
          Coaching Workspace Shortcuts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Workout Programs */}
          <Link
            href="/client/workouts"
            className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs hover:border-[var(--color-primary)]/50 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                  Workout Programs
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Access your prescribed exercise routines and log daily sets.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 flex items-center gap-1 text-xs font-bold text-[var(--color-primary)]">
              <span>Open Workouts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Nutrition Plans */}
          <Link
            href="/client/nutrition"
            className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs hover:border-[var(--color-primary)]/50 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <Apple className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                  Nutrition Plans
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  View daily macro targets, meal structures and nutritional guidance.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 flex items-center gap-1 text-xs font-bold text-[var(--color-primary)]">
              <span>Open Nutrition</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Progress Tracking */}
          <Link
            href="/client/progress"
            className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs hover:border-[var(--color-primary)]/50 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                  Progress Tracking
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Analyze your workout adherence, macro compliance, and milestones.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 flex items-center gap-1 text-xs font-bold text-[var(--color-primary)]">
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
