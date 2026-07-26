'use client';

import React from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/shared/components/guards/AuthGuard';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';
import { Permission } from '@/shared/components/navigation/permissions';
import { ROUTES } from '@/shared/constants/routes';
import { useGetTrainerAvailability, useUpdateTrainerAvailability } from '@/modules/profile/presentation/hooks/useTrainerAvailability';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { AvailabilityEditor } from '@/modules/profile/presentation/components/AvailabilityEditor';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';

function TrainerAvailabilityContent() {
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
            href={ROUTES.TRAINER_PROFILE}
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            ← Back to Profile
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {isLoading && <LoadingState message="Loading availability schedule..." />}
        {isError && <ErrorState error={error} onRetry={refetch} />}
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

export default function TrainerAvailabilityPage() {
  return (
    <AuthGuard>
      <RoleGuard permission={Permission.TRAINER_AVAILABILITY}>
        <TrainerAvailabilityContent />
      </RoleGuard>
    </AuthGuard>
  );
}
