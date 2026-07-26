'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTrainerProfileSchema, UpdateTrainerProfileFormValues } from '@/modules/profile/presentation/validation/trainerProfile.schema';
import { useGetTrainerProfile, useUpdateTrainerProfile } from '@/modules/profile/presentation/hooks/useTrainerProfile';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { LoadingState } from '@/modules/profile/presentation/components/LoadingState';
import { ErrorState } from '@/modules/profile/presentation/components/ErrorState';
import { SPECIALIZATION_OPTIONS } from '@/modules/profile/presentation/constants/profile.constants';

export default function EditTrainerProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading, isError, error } = useGetTrainerProfile();
  const updateMutation = useUpdateTrainerProfile();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateTrainerProfileFormValues>({
    resolver: zodResolver(updateTrainerProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        headline: profile.headline || '',
        bio: profile.bio || '',
        yearsOfExperience: profile.yearsOfExperience || 0,
        languages: profile.languages || [],
        specializations: profile.specializations || [],
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: UpdateTrainerProfileFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
      router.push('/profile/trainer');
    } catch {
      // Toast handles error
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Edit Trainer Profile" role="TRAINER" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <LoadingState message="Loading trainer details..." />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Edit Trainer Profile" role="TRAINER" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ErrorState message={(error as any)?.message || 'Trainer profile not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title="Edit Trainer Profile"
        subtitle="Update your professional bio, experience, specializations, and location"
        role="TRAINER"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionCard title="Professional Overview">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  {...register('headline')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.headline && <p className="mt-1 text-xs text-red-600">{errors.headline.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Biography
                </label>
                <textarea
                  rows={4}
                  {...register('bio')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('yearsOfExperience')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {errors.yearsOfExperience && <p className="mt-1 text-xs text-red-600">{errors.yearsOfExperience.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Languages (Comma-separated)
                  </label>
                  <input
                    type="text"
                    defaultValue={profile.languages.join(', ')}
                    onChange={(e) => {
                      const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      setValue('languages', list);
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Specializations & Location">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Specializations
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SPECIALIZATION_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        value={opt.value}
                        {...register('specializations')}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/profile/trainer')}
              className="px-5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
