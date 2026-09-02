'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCoachingRelationships } from '../../../../modules/coaching/application/queries/useCoachingRelationships';
import { CoachingRelationshipListItem } from '../../../../modules/coaching/domain/types/coaching.types';
import { TrainerWorkoutClientsList } from '../../../../modules/workout/presentation/trainer/TrainerWorkoutClientsList';
import { TrainerClientWorkoutWorkspace } from '../../../../modules/workout/presentation/trainer/TrainerClientWorkoutWorkspace';
import { WorkoutProgramBuilder } from '../../../../modules/workout/presentation/trainer/WorkoutProgramBuilder';
import { ExerciseCatalogModal } from '../../../../modules/workout/presentation/catalog/ExerciseCatalogModal';
import { WorkoutProgram } from '../../../../modules/workout/domain/types/workout.types';
import { Button } from '../../../../shared/components/ui/Button';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function TrainerWorkoutsPage() {
  const searchParams = useSearchParams();
  const relationshipIdParam = searchParams.get('coachingRelationshipId') || '';

  const [viewMode, setViewMode] = useState<'clients' | 'workspace' | 'builder'>('clients');
  const [selectedRelationship, setSelectedRelationship] =
    useState<CoachingRelationshipListItem | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const { data: coachingData } = useCoachingRelationships({ limit: 100 });
  const relationships = coachingData?.relationships || [];

  // If URL contains coachingRelationshipId, locate relationship and open workspace or builder
  useEffect(() => {
    if (relationshipIdParam && relationships.length > 0) {
      const match = relationships.find((r) => r.relationshipId === relationshipIdParam);
      if (match) {
        setSelectedRelationship(match);
        setViewMode('workspace');
      }
    }
  }, [relationshipIdParam, relationships]);

  const handleSelectClientWorkspace = (relationship: CoachingRelationshipListItem) => {
    setSelectedRelationship(relationship);
    setSelectedProgram(null);
    setViewMode('workspace');
  };

  const handleCreateProgramForClient = (relationship: CoachingRelationshipListItem) => {
    setSelectedRelationship(relationship);
    setSelectedProgram(null);
    setViewMode('builder');
  };

  const handleEditProgram = (program: WorkoutProgram) => {
    setSelectedProgram(program);
    setViewMode('builder');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Global Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/trainer/coaching">
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] font-bold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Client Roster
            </Button>
          </Link>

          {viewMode !== 'clients' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('clients')}
              className="text-xs font-bold text-[var(--color-primary)] hover:underline"
            >
              All Clients
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCatalogOpen(true)}
            className="rounded-xl border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
            Exercise Library
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'builder' ? (
        <WorkoutProgramBuilder
          coachingRelationshipId={
            selectedProgram?.coachingRelationshipId ||
            selectedRelationship?.relationshipId ||
            'cr_default'
          }
          existingProgram={selectedProgram}
          onBack={() => {
            if (selectedRelationship) {
              setViewMode('workspace');
            } else {
              setViewMode('clients');
            }
          }}
          onSaved={(saved) => {
            setSelectedProgram(saved);
          }}
        />
      ) : viewMode === 'workspace' && selectedRelationship ? (
        <TrainerClientWorkoutWorkspace
          relationship={selectedRelationship}
          onBack={() => setViewMode('clients')}
          onCreateProgram={() => {
            setSelectedProgram(null);
            setViewMode('builder');
          }}
          onEditProgram={handleEditProgram}
        />
      ) : (
        <TrainerWorkoutClientsList
          onSelectClientWorkspace={handleSelectClientWorkspace}
          onCreateProgramForClient={handleCreateProgramForClient}
          onOpenExerciseLibrary={() => setIsCatalogOpen(true)}
        />
      )}

      {/* Exercise Catalog Modal */}
      <ExerciseCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectExercise={() => {}}
      />
    </div>
  );
}
