'use client';

import React from 'react';
import { TrainerConsultationDetailView } from '@/modules/consultation/presentation/components/TrainerConsultationDetailView';

export default function TrainerConsultationDetailPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const resolvedParams = React.use(params);
  return <TrainerConsultationDetailView consultationId={resolvedParams.consultationId} />;
}
