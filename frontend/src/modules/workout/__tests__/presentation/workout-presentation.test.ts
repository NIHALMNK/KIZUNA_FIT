import { describe, it, expect } from 'vitest';
import React from 'react';
import { WorkoutStatusBadge } from '../../presentation/components/WorkoutStatusBadge';
import { WorkoutGoalBadge } from '../../presentation/components/WorkoutGoalBadge';
import {
  WorkoutGoal,
  WorkoutProgramStatus,
  WorkoutCompletionStatus,
} from '../../domain/types/workout.types';

describe('Frontend Workout Presentation Tests', () => {
  describe('WorkoutStatusBadge', () => {
    it('instantiates ACTIVE workout program badge', () => {
      const el = React.createElement(WorkoutStatusBadge, {
        status: WorkoutProgramStatus.ACTIVE,
      });
      expect(el.props.status).toBe(WorkoutProgramStatus.ACTIVE);
    });

    it('instantiates DRAFT workout program badge', () => {
      const el = React.createElement(WorkoutStatusBadge, {
        status: WorkoutProgramStatus.DRAFT,
      });
      expect(el.props.status).toBe(WorkoutProgramStatus.DRAFT);
    });

    it('instantiates IN_PROGRESS completion session badge', () => {
      const el = React.createElement(WorkoutStatusBadge, {
        status: WorkoutCompletionStatus.IN_PROGRESS,
      });
      expect(el.props.status).toBe(WorkoutCompletionStatus.IN_PROGRESS);
    });

    it('instantiates COMPLETED session badge', () => {
      const el = React.createElement(WorkoutStatusBadge, {
        status: WorkoutCompletionStatus.COMPLETED,
      });
      expect(el.props.status).toBe(WorkoutCompletionStatus.COMPLETED);
    });
  });

  describe('WorkoutGoalBadge', () => {
    it('instantiates MUSCLE_GAIN goal badge', () => {
      const el = React.createElement(WorkoutGoalBadge, {
        goal: WorkoutGoal.MUSCLE_GAIN,
      });
      expect(el.props.goal).toBe(WorkoutGoal.MUSCLE_GAIN);
    });

    it('instantiates STRENGTH goal badge', () => {
      const el = React.createElement(WorkoutGoalBadge, {
        goal: WorkoutGoal.STRENGTH,
      });
      expect(el.props.goal).toBe(WorkoutGoal.STRENGTH);
    });
  });
});
