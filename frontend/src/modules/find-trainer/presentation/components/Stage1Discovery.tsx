'use client';

import React, { useState } from 'react';
import { useSearchTrainers } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { PublicTrainerProfile } from '@/modules/profile/domain/types/profile.types';
import { TrainerSpecialization } from '@/modules/profile/domain/enums/profile.enums';
import { SelectedTrainerInfo } from '../../domain/types/journey.types';
import {
  Search,
  Star,
  Award,
  Clock,
  Filter,
  CheckCircle,
  Sparkles,
  ChevronRight,
  User,
} from 'lucide-react';
import { Avatar } from '@/shared/components/ui/Avatar';

interface Stage1DiscoveryProps {
  onSelectTrainer: (trainer: SelectedTrainerInfo) => void;
}

const POPULAR_SPECIALIZATIONS = [
  { label: 'All Specialties', value: '' },
  { label: 'Weight Loss', value: TrainerSpecialization.WEIGHT_LOSS },
  { label: 'Strength Training', value: TrainerSpecialization.STRENGTH_TRAINING },
  { label: 'Muscle Gain', value: TrainerSpecialization.MUSCLE_GAIN },
  { label: 'Cardio', value: TrainerSpecialization.CARDIO },
  { label: 'Yoga', value: TrainerSpecialization.YOGA },
  { label: 'Nutrition', value: TrainerSpecialization.NUTRITION },
  { label: 'Functional', value: TrainerSpecialization.FUNCTIONAL_FITNESS },
];

export const Stage1Discovery: React.FC<Stage1DiscoveryProps> = ({ onSelectTrainer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  const { data, isLoading, isError, error } = useSearchTrainers({
    search: searchTerm.trim() ? searchTerm.trim() : undefined,
    specialization: (selectedSpecialization as TrainerSpecialization) || undefined,
    minRating: minRating,
    limit: 12,
  });

  const trainers: PublicTrainerProfile[] = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-black text-[var(--color-heading)] tracking-tight">
            Discover Your Ideal Coach
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Browse verified elite coaches, view real specializations, and start your coaching
            journey.
          </p>
        </div>

        {/* Search & Rating row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search coach by name, headline, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-xs sm:text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <select
              value={minRating || ''}
              onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-xs sm:text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            >
              <option value="">Any Rating</option>
              <option value="4.5">★ 4.5 & above</option>
              <option value="4.0">★ 4.0 & above</option>
              <option value="3.5">★ 3.5 & above</option>
            </select>
          </div>
        </div>

        {/* Specialization Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {POPULAR_SPECIALIZATIONS.map((spec) => {
            const active = selectedSpecialization === spec.value;
            return (
              <button
                key={spec.label}
                type="button"
                onClick={() => setSelectedSpecialization(spec.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  active
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
                }`}
              >
                {spec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-surface-alt)]" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-[var(--color-surface-alt)] rounded w-2/3" />
                  <div className="h-3 bg-[var(--color-surface-alt)] rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-[var(--color-surface-alt)] rounded" />
              <div className="h-8 bg-[var(--color-surface-alt)] rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="bg-[var(--color-surface)] border border-red-200 rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm font-bold text-red-600">Failed to load marketplace coaches</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {(error as any)?.message || 'An error occurred while communicating with the server.'}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && trainers.length === 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center mx-auto text-[var(--color-text-muted)]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--color-heading)]">No coaches found</h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
            Try adjusting your search keywords or removing active specialization filters to discover
            available coaches.
          </p>
          {(searchTerm || selectedSpecialization || minRating) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('');
                setMinRating(undefined);
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}

      {/* Real Trainer Cards Grid */}
      {!isLoading && !isError && trainers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trainers.map((trainer) => {
            const displayName =
              trainer.fullName || trainer.trainerName || trainer.name || 'Certified Coach';
            const specializationsList = trainer.specializations || [];

            return (
              <div
                key={trainer.id || trainer.userId}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[var(--color-primary)]/50 transition-all duration-200 group"
              >
                <div className="space-y-4">
                  {/* Top Avatar & Info */}
                  <div className="flex items-start gap-3.5">
                    <Avatar
                      src={trainer.avatarUrl || undefined}
                      alt={displayName}
                      fallback={displayName.substring(0, 2).toUpperCase()}
                      size="lg"
                      className="ring-1 ring-[var(--color-border)] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-extrabold text-[var(--color-heading)] truncate">
                          {displayName}
                        </h3>
                        <CheckCircle className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1 mt-0.5">
                        {trainer.headline || 'Fitness & Conditioning Coach'}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Experience */}
                  <div className="flex items-center gap-4 py-2 px-3 bg-[var(--color-surface-alt)] rounded-xl text-xs font-bold">
                    <div className="flex items-center gap-1 text-[var(--color-heading)]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>
                        {trainer.averageRating ? trainer.averageRating.toFixed(1) : 'New'}
                      </span>
                      {trainer.totalReviews !== undefined && (
                        <span className="text-[10px] text-[var(--color-text-muted)] font-normal">
                          ({trainer.totalReviews})
                        </span>
                      )}
                    </div>

                    <div className="w-px h-3 bg-[var(--color-border)]" />

                    <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      <span>
                        {trainer.yearsOfExperience !== undefined
                          ? `${trainer.yearsOfExperience} yrs exp`
                          : 'Certified'}
                      </span>
                    </div>
                  </div>

                  {/* Bio snippet if available */}
                  {trainer.bio && (
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                      {trainer.bio}
                    </p>
                  )}

                  {/* Specializations Tags */}
                  {specializationsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {specializationsList.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[var(--color-tag)] text-[var(--color-primary)] border border-[var(--color-border)]"
                        >
                          {spec.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {specializationsList.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-text-muted)]">
                          +{specializationsList.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Certifications preview if present */}
                  {trainer.certifications && trainer.certifications.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-text-muted)] pt-1">
                      <Award className="w-3 h-3 text-[var(--color-primary)] shrink-0" />
                      <span className="truncate">{trainer.certifications[0].title}</span>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectTrainer({
                        id: trainer.id || trainer.userId,
                        userId: trainer.userId,
                        fullName: displayName,
                        headline: trainer.headline,
                        avatarUrl: trainer.avatarUrl,
                        yearsOfExperience: trainer.yearsOfExperience,
                        specializations: trainer.specializations,
                        bio: trainer.bio,
                        averageRating: trainer.averageRating,
                        totalReviews: trainer.totalReviews,
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-[var(--color-primary)] text-white hover:opacity-95 shadow-xs transition-all active:scale-[0.99]"
                  >
                    <span>Select Coach</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
