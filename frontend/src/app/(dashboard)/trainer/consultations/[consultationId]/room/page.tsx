'use client';

import React from 'react';
import { useConsultationDetail } from '@/modules/consultation/application/hooks/useConsultationQueries';
import { useAuthStore } from '@/modules/identity/application/store/authStore';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { ConsultationVideoRoom } from '@/modules/consultation/presentation/components/ConsultationVideoRoom';

export default function TrainerConsultationRoomPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const { consultationId } = React.use(params);
  const { user } = useAuthStore();

  const { data: consultation, isLoading, isError, refetch } = useConsultationDetail(consultationId);

  if (isLoading) {
    return <LoadingState message="Connecting to client consultation session..." count={2} />;
  }

  if (isError || !consultation) {
    return (
      <ErrorState
        title="Room Unavailable"
        message="Unable to access client consultation session room."
        onRetry={() => refetch()}
      />
    );
  }

  const currentUserId = user?.id || consultation.trainerId;

  return (
    <ConsultationVideoRoom
      consultation={consultation}
      role="TRAINER"
      currentUserId={currentUserId}
      peerName={`Client #${consultation.clientId.slice(0, 8)}`}
    />
  );
}
