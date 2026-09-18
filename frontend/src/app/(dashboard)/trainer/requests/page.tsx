'use client';

import React from 'react';
import { TrainerRequestList } from '@/modules/marketplace/presentation/components/TrainerRequestList';

export default function TrainerRequestsPage() {
  return (
    <div className="space-y-6">
      <TrainerRequestList />
    </div>
  );
}
