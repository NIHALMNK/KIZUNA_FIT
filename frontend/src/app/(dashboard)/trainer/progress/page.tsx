'use client';

import React from 'react';
import { TrainerClientProgressView } from '../../../../modules/progress/presentation/trainer/TrainerClientProgressView';

export default function TrainerProgressPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <TrainerClientProgressView />
    </div>
  );
}
