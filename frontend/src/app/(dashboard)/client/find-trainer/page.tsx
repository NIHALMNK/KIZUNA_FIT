'use client';

import React from 'react';
import { FindMyTrainerWorkspace } from '@/modules/find-trainer/presentation/components/FindMyTrainerWorkspace';

export default function ClientFindTrainerPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <FindMyTrainerWorkspace />
    </div>
  );
}
