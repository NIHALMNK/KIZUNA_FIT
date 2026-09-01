'use client';

import React, { useState } from 'react';
import { TrainerClientRoster } from '../../../../modules/coaching/presentation/trainer/TrainerClientRoster';
import { TrainerCoachingDetails } from '../../../../modules/coaching/presentation/trainer/TrainerCoachingDetails';

export default function TrainerCoachingPage() {
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {!selectedRelationshipId ? (
        <>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              TRAINER DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight">
              Client Roster & Coaching Contracts
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Manage your active coaching relationships, track contract lifecycles, and mark program
              completions.
            </p>
          </div>
          <TrainerClientRoster onSelectRelationship={setSelectedRelationshipId} />
        </>
      ) : (
        <TrainerCoachingDetails
          relationshipId={selectedRelationshipId}
          onBack={() => setSelectedRelationshipId(null)}
        />
      )}
    </div>
  );
}
