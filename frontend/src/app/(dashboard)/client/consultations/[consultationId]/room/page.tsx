'use client';

import React from 'react';
import { useConsultationDetail } from '@/modules/consultation/application/hooks/useConsultationQueries';
import { useGetPublicTrainerProfile } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { useAuthStore } from '@/modules/identity/application/store/authStore';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { ConsultationVideoRoom } from '@/modules/consultation/presentation/components/ConsultationVideoRoom';

export default function ClientConsultationRoomPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const { consultationId } = React.use(params);
  const { user } = useAuthStore();

  const { data: consultation, isLoading, isError, refetch } = useConsultationDetail(consultationId);
  const { data: trainerProfile } = useGetPublicTrainerProfile(consultation?.trainerId || '');

  if (isLoading) {
    return <LoadingState message="Connecting to live consultation session..." count={2} />;
  }

  if (isError || !consultation) {
    return (
      <ErrorState
        title="Room Unavailable"
        message="Unable to access consultation session room."
        onRetry={() => refetch()}
      />
    );
  }

  const currentUserId = user?.id || consultation.clientId;

  return (
    <ConsultationVideoRoom
      consultation={consultation}
      role="CLIENT"
      currentUserId={currentUserId}
      peerName={trainerProfile?.fullName || 'Assigned Coach'}
      peerAvatarUrl={trainerProfile?.avatarUrl || undefined}
    />
  );
}
