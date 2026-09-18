'use client';

import React from 'react';
import { ClientConsultationDetailView } from '@/modules/consultation/presentation/components/ClientConsultationDetailView';

export default function ClientConsultationDetailPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const resolvedParams = React.use(params);
  return <ClientConsultationDetailView consultationId={resolvedParams.consultationId} />;
}
