'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateClientProfileSchema,
  UpdateClientProfileFormValues,
} from '../../../../modules/profile/presentation/validation/clientProfile.schema';
import {
  useGetClientProfile,
  useUpdateClientProfile,
} from '../../../../modules/profile/presentation/hooks/useClientProfile';
import {
  GENDER_OPTIONS,
  WEIGHT_UNIT_OPTIONS,
  HEIGHT_UNIT_OPTIONS,
  FITNESS_GOAL_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  ACTIVITY_LEVEL_OPTIONS,
} from '../../../../modules/profile/presentation/constants/profile.constants';
import { Button } from '../../../../shared/components/ui/Button';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';
import { ErrorState } from '../../../../shared/components/feedback/ErrorState';

export default function EditClientProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading, isError, error } = useGetClientProfile();
  const updateMutation = useUpdateClientProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateClientProfileFormValues>({
    resolver: zodResolver(updateClientProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        gender: profile.gender || undefined,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        phoneNumber: profile.phoneNumber || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        timezone: profile.timezone || '',
        weight: profile.weight ? { value: profile.weight.value, unit: profile.weight.unit } : undefined,
        height: profile.height ? { value: profile.height.value, unit: profile.height.unit } : undefined,
        medicalNotes: profile.medicalNotes || '',
        bio: profile.bio || '',
        dietaryPreferences: profile.dietaryPreferences || [],
        fitnessGoals: profile.fitnessGoals || [],
        experienceLevel: profile.experienceLevel || undefined,
        activityLevel: profile.activityLevel || undefined,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: UpdateClientProfileFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
      router.push('/profile/client');
    } catch {
      // Handled by toast mutation
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading your profile details..." />;
  }

  if (isError || !profile) {
    return <ErrorState error={error} message="Unable to load client profile for editing" />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-[var(--color-heading)] tracking-tight">Edit Profile</h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Keep your physical details, fitness preferences, and health information up to date.
          </p>
        </div>
      </div>

      {/* Account Info Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 text-amber-800 text-xs font-medium flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Account email, password, and identity roles are managed in Settings.</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Personal Details */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            PERSONAL INFORMATION
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Full Name
              </label>
              <input
                type="text"
                {...register('fullName')}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
              />
              {errors.fullName && <p className="text-xs font-semibold text-rose-600">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Gender
              </label>
              <select
                {...register('gender')}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
              >
                <option value="">Select Gender</option>
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Date of Birth
              </label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                City
              </label>
              <input
                type="text"
                {...register('city')}
                placeholder="e.g. New York"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Country
              </label>
              <input
                type="text"
                {...register('country')}
                placeholder="e.g. United States"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Timezone
              </label>
              <input
                type="text"
                {...register('timezone')}
                placeholder="e.g. UTC, EST"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fitness Profile */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            FITNESS PROFILE
          </span>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Fitness Goals (Select multiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {FITNESS_GOAL_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center space-x-2 text-xs font-medium text-[var(--color-text-primary)] cursor-pointer p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] transition-all">
                    <input
                      type="checkbox"
                      value={opt.value}
                      {...register('fitnessGoals')}
                      className="rounded text-[var(--color-primary)] focus:ring-[var(--color-ring)]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Activity Level
                </label>
                <select
                  {...register('activityLevel')}
                  className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
                >
                  <option value="">Select Activity Level</option>
                  {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Experience Level
                </label>
                <select
                  {...register('experienceLevel')}
                  className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
                >
                  <option value="">Select Experience Level</option>
                  {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Body Metrics */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            BODY METRICS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Height
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('height.value')}
                  placeholder="175"
                  className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
                />
              </div>
              <div className="w-28 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Unit
                </label>
                <select
                  {...register('height.unit')}
                  className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
                >
                  {HEIGHT_UNIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Weight
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('weight.value')}
                  placeholder="70"
                  className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
                />
              </div>
              <div className="w-28 space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Unit
                </label>
                <select
                  {...register('weight.unit')}
                  className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
                >
                  {WEIGHT_UNIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: About You (Bio) */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)] block">
            ABOUT YOU (BIO)
          </span>

          <div className="space-y-1">
            <textarea
              rows={3}
              {...register('bio')}
              placeholder="Tell your coach about yourself, your motivation, and your lifestyle..."
              className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
            />
            {errors.bio && <p className="text-xs font-semibold text-rose-600">{errors.bio.message}</p>}
          </div>
        </div>

        {/* Section 5: Health Information */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              HEALTH & MEDICAL CONDITIONS
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] font-medium">Shared privately with assigned coaches</span>
          </div>

          <div className="space-y-1">
            <textarea
              rows={3}
              {...register('medicalNotes')}
              placeholder="Mention any past injuries, medical conditions, allergies, or physical limitations..."
              className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => router.push('/profile/client')}
            className="border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl font-semibold text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={updateMutation.isPending}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl text-xs"
          >
            {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
