'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateClientProfileSchema, UpdateClientProfileFormValues } from '@/modules/profile/presentation/validation/clientProfile.schema';
import { useGetClientProfile, useUpdateClientProfile } from '@/modules/profile/presentation/hooks/useClientProfile';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { LoadingState } from '@/modules/profile/presentation/components/LoadingState';
import { ErrorState } from '@/modules/profile/presentation/components/ErrorState';
import {
  GENDER_OPTIONS,
  WEIGHT_UNIT_OPTIONS,
  HEIGHT_UNIT_OPTIONS,
  DIETARY_PREFERENCE_OPTIONS,
  FITNESS_GOAL_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  ACTIVITY_LEVEL_OPTIONS,
} from '@/modules/profile/presentation/constants/profile.constants';
import { Gender, WeightUnit, HeightUnit, DietaryPreference, FitnessGoal, ExperienceLevel, ActivityLevel } from '@/modules/profile/domain/enums/profile.enums';

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
      // Handled by toast
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Edit Profile" role="CLIENT" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <LoadingState message="Loading client details for editing..." />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Edit Profile" role="CLIENT" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ErrorState message={(error as any)?.message || 'Client profile not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title="Edit Client Profile"
        subtitle="Update your personal details, physical metrics, and fitness preferences"
        role="CLIENT"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionCard title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...register('city')}
                  placeholder="New York"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  {...register('state')}
                  placeholder="NY"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  {...register('country')}
                  placeholder="United States"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  {...register('timezone')}
                  placeholder="America/New_York"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Health & Physical Metrics">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Weight Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('weight.value')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Unit
                  </label>
                  <select
                    {...register('weight.unit')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {WEIGHT_UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Height Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('height.value')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Unit
                  </label>
                  <select
                    {...register('height.unit')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {HEIGHT_UNIT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Experience Level
                </label>
                <select
                  {...register('experienceLevel')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Level</option>
                  {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Activity Level
                </label>
                <select
                  {...register('activityLevel')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Activity</option>
                  {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Medical Notes / Injuries
              </label>
              <textarea
                rows={3}
                {...register('medicalNotes')}
                placeholder="Mention any relevant medical conditions, allergies, or past injuries..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </SectionCard>

          <SectionCard title="Goals & Preferences">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Fitness Goals (Select multiple)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FITNESS_GOAL_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        value={opt.value}
                        {...register('fitnessGoals')}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Dietary Preferences (Select multiple)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DIETARY_PREFERENCE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        value={opt.value}
                        {...register('dietaryPreferences')}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/profile/client')}
              className="px-5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
