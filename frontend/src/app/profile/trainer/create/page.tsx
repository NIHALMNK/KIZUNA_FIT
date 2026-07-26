'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTrainerProfileSchema, CreateTrainerProfileFormValues } from '@/modules/profile/presentation/validation/trainerProfile.schema';
import { useCreateTrainerProfile } from '@/modules/profile/presentation/hooks/useTrainerProfile';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { SPECIALIZATION_OPTIONS } from '@/modules/profile/presentation/constants/profile.constants';

export default function CreateTrainerProfilePage() {
  const router = useRouter();
  const createMutation = useCreateTrainerProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTrainerProfileFormValues>({
    resolver: zodResolver(createTrainerProfileSchema),
    defaultValues: {
      headline: '',
      bio: '',
      yearsOfExperience: 1,
      languages: ['English'],
      specializations: [],
      city: '',
      state: '',
      country: '',
      timezone: 'UTC',
    },
  });

  const onSubmit = async (values: CreateTrainerProfileFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      router.push('/profile/trainer');
    } catch {
      // Toast handles error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title="Create Trainer Profile"
        subtitle="Build your professional fitness coach profile for KIZUNAFIT"
        role="TRAINER"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionCard title="Professional Overview">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Professional Headline *
                </label>
                <input
                  type="text"
                  {...register('headline')}
                  placeholder="e.g. Certified Strength Coach & Fat Loss Specialist"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.headline && <p className="mt-1 text-xs text-red-600">{errors.headline.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Biography *
                </label>
                <textarea
                  rows={4}
                  {...register('bio')}
                  placeholder="Tell potential clients about your coaching philosophy, background, and results..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.bio && <p className="mt-1 text-xs text-red-600">{errors.bio.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Years of Experience *
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
                    Languages (Comma-separated) *
                  </label>
                  <input
                    type="text"
                    placeholder="English, Spanish"
                    onChange={(e) => {
                      const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                      register('languages').onChange({ target: { name: 'languages', value: list } });
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {errors.languages && <p className="mt-1 text-xs text-red-600">{errors.languages.message}</p>}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Specializations & Location">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Specializations (Select at least one) *
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
                {errors.specializations && <p className="mt-1 text-xs text-red-600">{errors.specializations.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder="Los Angeles"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    {...register('state')}
                    placeholder="CA"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    placeholder="USA"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>}
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating Profile...' : 'Create Trainer Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
