'use client';

import React from 'react';
import { HistoryWorkspace } from '@/modules/find-trainer/presentation/components/HistoryWorkspace';

export default function ClientFindTrainerHistoryPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <HistoryWorkspace />
    </div>
  );
}
