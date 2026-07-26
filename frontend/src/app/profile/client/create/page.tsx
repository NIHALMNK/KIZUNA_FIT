'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientProfileSchema, CreateClientProfileFormValues } from '@/modules/profile/presentation/validation/clientProfile.schema';
import { useCreateClientProfile } from '@/modules/profile/presentation/hooks/useClientProfile';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';

export default function CreateClientProfilePage() {
  const router = useRouter();
  const createMutation = useCreateClientProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClientProfileFormValues>({
    resolver: zodResolver(createClientProfileSchema),
    defaultValues: { fullName: '' },
  });

  const onSubmit = async (values: CreateClientProfileFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      router.push('/profile/client');
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title="Create Client Profile"
        subtitle="Set up your basic client details to get started with KIZUNAFIT"
        role="CLIENT"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <SectionCard title="Basic Information" subtitle="Enter your full name as it should appear to trainers">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                {...register('fullName')}
                placeholder="John Doe"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
