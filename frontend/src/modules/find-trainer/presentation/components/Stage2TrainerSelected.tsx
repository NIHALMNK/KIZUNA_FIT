'use client';

import React, { useState } from 'react';
import { SelectedTrainerInfo } from '../../domain/types/journey.types';
import { useCreateTrainerRequest } from '@/modules/marketplace/application/useMarketplace';
import { useGetPublicTrainerProfile } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import {
  ArrowLeft,
  User,
  Star,
  Clock,
  Award,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Avatar } from '@/shared/components/ui/Avatar';

interface Stage2TrainerSelectedProps {
  trainer: SelectedTrainerInfo;
  onBack: () => void;
}

export const Stage2TrainerSelected: React.FC<Stage2TrainerSelectedProps> = ({
  trainer,
  onBack,
}) => {
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState('');
  const [goalTouched, setGoalTouched] = useState(false);

  // Fetch full public trainer profile for rich details (certifications, showcase, bio)
  const { data: fullProfile } = useGetPublicTrainerProfile(trainer.id || trainer.userId || '');

  const createRequestMutation = useCreateTrainerRequest();

  const isGoalValid = goal.trim().length >= 3 && goal.trim().length <= 100;
  const goalError =
    goalTouched && !isGoalValid
      ? goal.trim().length < 3
        ? 'Goal must be at least 3 characters long.'
        : 'Goal cannot exceed 100 characters.'
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoalTouched(true);

    if (!isGoalValid) return;

    try {
      await createRequestMutation.mutateAsync({
        trainerId: trainer.id || trainer.userId || '',
        goal: goal.trim(),
        message: message.trim() ? message.trim() : undefined,
      });
      // Mutation invalidates trainer-requests query family, triggering progression to Stage 3
    } catch (err) {
      // Error handled by hook's toast
    }
  };

  const displayName =
    fullProfile?.fullName ||
    fullProfile?.trainerName ||
    fullProfile?.name ||
    trainer.fullName ||
    'Selected Coach';

  const displayBio = fullProfile?.bio || trainer.bio;
  const displaySpecializations = fullProfile?.specializations || trainer.specializations || [];
  const displayCertifications = fullProfile?.certifications || [];
  const displayShowcase = fullProfile?.showcase || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to coach discovery</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Coach Summary Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={fullProfile?.avatarUrl || trainer.avatarUrl || undefined}
                alt={displayName}
                fallback={displayName.substring(0, 2).toUpperCase()}
                size="xl"
                className="w-16 h-16 ring-1 ring-[var(--color-border)] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-[var(--color-heading)] truncate">
                    {displayName}
                  </h2>
                  <CheckCircle className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mt-0.5">
                  {fullProfile?.headline || trainer.headline || 'Fitness & Conditioning Coach'}
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-border)]">
              <div className="bg-[var(--color-surface-alt)] p-3 rounded-xl">
                <span className="block text-[10px] uppercase font-bold text-[var(--color-text-muted)]">
                  Rating
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-extrabold text-[var(--color-heading)]">
                    {trainer.averageRating ? trainer.averageRating.toFixed(1) : 'New'}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--color-surface-alt)] p-3 rounded-xl">
                <span className="block text-[10px] uppercase font-bold text-[var(--color-text-muted)]">
                  Experience
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span className="text-xs font-extrabold text-[var(--color-heading)]">
                    {trainer.yearsOfExperience !== undefined
                      ? `${trainer.yearsOfExperience} years`
                      : 'Certified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {displayBio && (
              <div className="pt-2 border-t border-[var(--color-border)] space-y-1">
                <span className="text-xs font-bold text-[var(--color-heading)]">
                  About the Coach
                </span>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {displayBio}
                </p>
              </div>
            )}

            {/* Specializations */}
            {displaySpecializations.length > 0 && (
              <div className="pt-2 border-t border-[var(--color-border)] space-y-1.5">
                <span className="text-xs font-bold text-[var(--color-heading)]">
                  Specializations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {displaySpecializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[var(--color-tag)] text-[var(--color-primary)] border border-[var(--color-border)]"
                    >
                      {spec.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {displayCertifications.length > 0 && (
              <div className="pt-2 border-t border-[var(--color-border)] space-y-1.5">
                <span className="text-xs font-bold text-[var(--color-heading)]">
                  Certifications
                </span>
                <div className="space-y-1">
                  {displayCertifications.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]"
                    >
                      <Award className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      <span className="font-semibold">{cert.title}</span>
                      {cert.organization && (
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          • {cert.organization}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Coaching Proposal Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-[var(--color-heading)]">
                Submit Coaching Proposal
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Introduce yourself and let your coach know what you want to achieve.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Goal Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--color-heading)]">
                  Primary Fitness Goal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lose 8kg and prepare for a half-marathon"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onBlur={() => setGoalTouched(true)}
                  className={`w-full px-3.5 py-2.5 bg-[var(--color-surface-alt)] border rounded-xl text-xs sm:text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all ${
                    goalError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'
                  }`}
                  maxLength={100}
                />
                <div className="flex items-center justify-between text-[10px]">
                  {goalError ? (
                    <span className="text-red-500 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {goalError}
                    </span>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">
                      3 to 100 characters required
                    </span>
                  )}
                  <span className="text-[var(--color-text-muted)] font-mono">
                    {goal.trim().length}/100
                  </span>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[var(--color-heading)]">
                  Personal Message{' '}
                  <span className="text-[var(--color-text-muted)] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell your coach about your current routine, dietary preferences, schedule, or past injuries..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-xs sm:text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all resize-none"
                  maxLength={500}
                />
                <div className="text-right text-[10px] text-[var(--color-text-muted)] font-mono">
                  {message.length}/500
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createRequestMutation.isPending || !isGoalValid}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-extrabold bg-[var(--color-primary)] text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all active:scale-[0.99]"
                >
                  {createRequestMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Coaching Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
