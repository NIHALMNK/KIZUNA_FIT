'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientProfileSchema, CreateClientProfileFormValues } from '../../../../modules/profile/presentation/validation/clientProfile.schema';
import { useCreateClientProfile } from '../../../../modules/profile/presentation/hooks/useClientProfile';
import { Button } from '../../../../shared/components/ui/Button';

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
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[var(--color-heading)] tracking-tight">
          Complete Your Fitness Profile
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Help us understand your identity so your KIZUNAFIT coaching experience can be personalized.
        </p>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Full Name *
            </label>
            <input
              type="text"
              {...register('fullName')}
              placeholder="e.g. Nihal Keedath"
              className="w-full px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30 transition-all"
            />
            {errors.fullName && (
              <p className="text-xs font-semibold text-rose-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.back()}
              className="border-[var(--color-border)] text-[var(--color-text-primary)] rounded-xl font-semibold text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={createMutation.isPending}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl text-xs"
            >
              Complete Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
