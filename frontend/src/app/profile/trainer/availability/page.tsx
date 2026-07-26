'use client';

import React from 'react';
import Link from 'next/link';
import { useGetTrainerAvailability, useUpdateTrainerAvailability } from '@/modules/profile/presentation/hooks/useTrainerAvailability';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { AvailabilityEditor } from '@/modules/profile/presentation/components/AvailabilityEditor';
import { LoadingState } from '@/modules/profile/presentation/components/LoadingState';
import { ErrorState } from '@/modules/profile/presentation/components/ErrorState';

export default function TrainerAvailabilityPage() {
  const { data: availability, isLoading, isError, error, refetch } = useGetTrainerAvailability();
  const updateMutation = useUpdateTrainerAvailability();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title="Manage Availability Schedule"
        subtitle="Configure your working status, timezone, and weekly time slots"
        role="TRAINER"
        action={
          <Link
            href="/profile/trainer"
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            ← Back to Profile
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {isLoading && <LoadingState message="Loading availability schedule..." />}
        {isError && <ErrorState message={(error as any)?.message || 'Failed to load availability'} onRetry={refetch} />}
        {availability && (
          <SectionCard title="Weekly Recurring Schedule">
            <AvailabilityEditor
              initialAvailability={availability}
              onSave={async (newAvailability) => {
                await updateMutation.mutateAsync(newAvailability);
              }}
              isLoading={updateMutation.isPending}
            />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
