import { describe, it, expect } from 'vitest';
import React from 'react';
import { trainerSidebarConfig } from '../../../../shared/navigation/config/trainerSidebar.config';
import { TrainerWorkoutClientsList } from '../../presentation/trainer/TrainerWorkoutClientsList';
import { TrainerClientWorkoutWorkspace } from '../../presentation/trainer/TrainerClientWorkoutWorkspace';
import { CreateExerciseModal } from '../../presentation/catalog/CreateExerciseModal';
import { ExerciseCatalogModal } from '../../presentation/catalog/ExerciseCatalogModal';
import { CoachingRelationshipStatus } from '../../../coaching/domain/types/coaching.types';

describe('Trainer Workout UX & Exercise Library Tests', () => {
  it('1. verifies Workouts navigation is ACTIVE and not Coming Soon', () => {
    const programsSection = trainerSidebarConfig.sections.find((s) => s.id === 'programs');
    expect(programsSection).toBeDefined();

    const workoutsItem = programsSection?.items.find((item) => item.id === 'trainer-workouts');
    expect(workoutsItem).toBeDefined();
    expect(workoutsItem?.status).toBe('active');
    expect(workoutsItem?.href).toBe('/trainer/workouts');
    expect((workoutsItem as any)?.badge).toBeUndefined();
  });

  it('2. instantiates TrainerWorkoutClientsList component', () => {
    const el = React.createElement(TrainerWorkoutClientsList, {
      onSelectClientWorkspace: () => {},
      onCreateProgramForClient: () => {},
      onOpenExerciseLibrary: () => {},
    });
    expect(el).toBeDefined();
  });

  it('3. instantiates TrainerClientWorkoutWorkspace component with relationship', () => {
    const mockRelationship = {
      relationshipId: 'cr_test_100',
      trainer: { id: 'usr_trainer_01', fullName: 'Coach Sarah' },
      client: { id: 'usr_client_01', fullName: 'John Athlete' },
      acquisitionPipelineId: 'pipe_100',
      paymentId: 'pay_100',
      subscriptionId: 'sub_100',
      status: CoachingRelationshipStatus.ACTIVE,
      startedAt: '2026-08-01T00:00:00Z',
      completedAt: null,
      createdAt: '2026-08-01T00:00:00Z',
    };

    const el = React.createElement(TrainerClientWorkoutWorkspace, {
      relationship: mockRelationship,
      onBack: () => {},
      onCreateProgram: () => {},
      onEditProgram: () => {},
    });
    expect(el).toBeDefined();
    expect(el.props.relationship.relationshipId).toBe('cr_test_100');
  });

  it('4. instantiates CreateExerciseModal component', () => {
    const el = React.createElement(CreateExerciseModal, {
      isOpen: true,
      onClose: () => {},
      onCreated: () => {},
    });
    expect(el.props.isOpen).toBe(true);
  });

  it('5. instantiates ExerciseCatalogModal component', () => {
    const el = React.createElement(ExerciseCatalogModal, {
      isOpen: true,
      onClose: () => {},
      onSelectExercise: () => {},
    });
    expect(el.props.isOpen).toBe(true);
  });
});
