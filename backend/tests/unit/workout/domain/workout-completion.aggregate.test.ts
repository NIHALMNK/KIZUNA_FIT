import { describe, it, expect } from 'vitest';
import { WorkoutCompletion } from '../../../../src/modules/workout/domain/aggregates/workout-completion.aggregate';
import { WorkoutDaySnapshot } from '../../../../src/modules/workout/domain/value-objects/workout-day-snapshot.value-object';
import { CompletedExercise } from '../../../../src/modules/workout/domain/entities/completed-exercise.entity';
import { CompletedSet } from '../../../../src/modules/workout/domain/value-objects/completed-set.value-object';
import { WorkoutFeedback } from '../../../../src/modules/workout/domain/value-objects/workout-feedback.value-object';
import {
  CompletionSource,
  WorkoutCompletionStatus,
  WorkoutDifficulty,
} from '../../../../src/modules/workout/domain/enums';
import {
  InvalidWorkoutCompletionTransitionException,
  WorkoutCompletionImmutableException,
} from '../../../../src/modules/workout/domain/exceptions/workout-domain.exceptions';

describe('WorkoutCompletion Aggregate Domain Tests', () => {
  const createMockSession = (
    status: WorkoutCompletionStatus = WorkoutCompletionStatus.IN_PROGRESS,
  ): WorkoutCompletion => {
    const daySnapshot = WorkoutDaySnapshot.create({
      weekNumber: 1,
      dayNumber: 1,
      title: 'Chest & Triceps Push',
      plannedExercisesCount: 1,
    }).getValue();

    const set1 = CompletedSet.create({
      setNumber: 1,
      plannedReps: '8-10',
      completedReps: 10,
      weight: 80,
      completed: true,
    }).getValue();

    const exercise = CompletedExercise.create({
      exerciseId: 'ex_123',
      exerciseName: 'Barbell Bench Press',
      completedSets: [set1],
    }).getValue();

    return WorkoutCompletion.create({
      coachingRelationshipId: 'cr_123',
      workoutProgramId: 'wp_456',
      clientId: 'client_789',
      trainerId: 'trainer_012',
      workoutDay: 1,
      workoutDaySnapshot: daySnapshot,
      completedExercises: [exercise],
      status,
      startedAt: new Date(),
      completedBy: CompletionSource.CLIENT,
    }).getValue();
  };

  it('should initialize workout completion session in IN_PROGRESS state', () => {
    const session = createMockSession(WorkoutCompletionStatus.IN_PROGRESS);

    expect(session.status).toBe(WorkoutCompletionStatus.IN_PROGRESS);
    expect(session.coachingRelationshipId).toBe('cr_123');
    expect(session.workoutProgramId).toBe('wp_456');
    expect(session.clientId).toBe('client_789');
    expect(session.workoutDay).toBe(1);
    expect(session.workoutDaySnapshot.title).toBe('Chest & Triceps Push');
    expect(session.completedExercises.length).toBe(1);
    expect(session.completedExercises[0].completedSets.length).toBe(1);
  });

  it('should update live execution sets and feedback while in IN_PROGRESS state', () => {
    const session = createMockSession(WorkoutCompletionStatus.IN_PROGRESS);

    const set2 = CompletedSet.create({
      setNumber: 2,
      plannedReps: '8-10',
      completedReps: 8,
      weight: 82.5,
      completed: true,
    }).getValue();

    const updatedExercise = CompletedExercise.create({
      exerciseId: 'ex_123',
      exerciseName: 'Barbell Bench Press',
      completedSets: [session.completedExercises[0].completedSets[0], set2],
    }).getValue();

    const feedback = WorkoutFeedback.create({
      difficulty: WorkoutDifficulty.HARD,
      energyLevel: 8,
      notes: 'Strong bench press session.',
    }).getValue();

    const updateRes = session.updateExecution([updatedExercise], feedback);
    expect(updateRes.isSuccess).toBe(true);
    expect(session.completedExercises[0].completedSets.length).toBe(2);
    expect(session.feedback?.difficulty).toBe(WorkoutDifficulty.HARD);
  });

  it('should complete workout session and emit WorkoutCompletedEvent (Rule WC-2 / WC-3)', () => {
    const session = createMockSession(WorkoutCompletionStatus.IN_PROGRESS);

    const feedback = WorkoutFeedback.create({
      difficulty: WorkoutDifficulty.MODERATE,
      energyLevel: 7,
    }).getValue();

    const completeRes = session.complete(session.completedExercises, feedback);
    expect(completeRes.isSuccess).toBe(true);
    expect(session.status).toBe(WorkoutCompletionStatus.COMPLETED);
    expect(session.completedAt).toBeInstanceOf(Date);

    const completedEvent = session.domainEvents.find(
      (e) => e.constructor.name === 'WorkoutCompletedEvent',
    );
    expect(completedEvent).toBeDefined();
  });

  it('should reject modifications on finalized COMPLETED sessions (Rule WC-2: immutable history)', () => {
    const session = createMockSession(WorkoutCompletionStatus.COMPLETED);

    expect(() => {
      session.updateExecution([]);
    }).toThrow(WorkoutCompletionImmutableException);
  });
});
