import { describe, it, expect } from 'vitest';
import { WorkoutProgram } from '../../../../src/modules/workout/domain/aggregates/workout-program.aggregate';
import { WorkoutSchedule } from '../../../../src/modules/workout/domain/value-objects/workout-schedule.value-object';
import { WorkoutWeek } from '../../../../src/modules/workout/domain/entities/workout-week.entity';
import { WorkoutDay } from '../../../../src/modules/workout/domain/entities/workout-day.entity';
import { ExercisePrescription } from '../../../../src/modules/workout/domain/value-objects/exercise-prescription.value-object';
import { ExerciseSnapshot } from '../../../../src/modules/workout/domain/value-objects/exercise-snapshot.value-object';
import {
  DifficultyLevel,
  EquipmentType,
  ExerciseType,
  PrimaryMuscleGroup,
  WorkoutGoal,
  WorkoutProgramStatus,
} from '../../../../src/modules/workout/domain/enums';
import {
  ActiveWorkoutProgramImmutableException,
  InvalidWorkoutProgramTransitionException,
} from '../../../../src/modules/workout/domain/exceptions/workout-domain.exceptions';

describe('WorkoutProgram Aggregate Domain Tests', () => {
  const createMockPrescription = (): ExercisePrescription => {
    const snapshot = ExerciseSnapshot.create({
      exerciseId: 'ex_123',
      name: 'Barbell Bench Press',
      slug: 'barbell-bench-press',
      category: 'Chest',
      primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
      equipment: EquipmentType.BARBELL,
      difficulty: DifficultyLevel.INTERMEDIATE,
    }).getValue();

    return ExercisePrescription.create({
      order: 1,
      exercise: snapshot,
      type: ExerciseType.MAIN,
      sets: 3,
      reps: '8-10',
      restSeconds: 90,
    }).getValue();
  };

  const createMockProgram = (
    status: WorkoutProgramStatus = WorkoutProgramStatus.DRAFT,
  ): WorkoutProgram => {
    const day = WorkoutDay.create({
      dayNumber: 1,
      title: 'Chest & Triceps Push',
      exercises: [createMockPrescription()],
    }).getValue();

    const week = WorkoutWeek.create({
      weekNumber: 1,
      title: 'Week 1 Foundation',
      days: [day],
    }).getValue();

    const schedule = WorkoutSchedule.create({
      weeks: 4,
      sessionsPerWeek: 3,
    }).getValue();

    return WorkoutProgram.create({
      coachingRelationshipId: 'cr_123',
      trainerId: 'trainer_456',
      clientId: 'client_789',
      version: 1,
      title: 'Hypertrophy Phase 1',
      description: '4-week push/pull/legs block',
      goal: WorkoutGoal.MUSCLE_GAIN,
      schedule,
      weeks: [week],
      status,
    }).getValue();
  };

  it('should initialize program in DRAFT state with version 1', () => {
    const program = createMockProgram(WorkoutProgramStatus.DRAFT);

    expect(program.status).toBe(WorkoutProgramStatus.DRAFT);
    expect(program.version).toBe(1);
    expect(program.coachingRelationshipId).toBe('cr_123');
    expect(program.trainerId).toBe('trainer_456');
    expect(program.clientId).toBe('client_789');
    expect(program.weeks.length).toBe(1);
    expect(program.weeks[0].days.length).toBe(1);
  });

  it('should allow updating draft details', () => {
    const program = createMockProgram(WorkoutProgramStatus.DRAFT);

    program.updateDraft({
      title: 'Updated Hypertrophy Phase 1',
      description: 'Refined prescription',
      goal: WorkoutGoal.STRENGTH,
    });

    expect(program.title).toBe('Updated Hypertrophy Phase 1');
    expect(program.description).toBe('Refined prescription');
    expect(program.goal).toBe(WorkoutGoal.STRENGTH);
  });

  it('should activate draft program and emit WorkoutProgramActivatedEvent (DRAFT -> ACTIVE)', () => {
    const program = createMockProgram(WorkoutProgramStatus.DRAFT);

    expect(program.status).toBe(WorkoutProgramStatus.DRAFT);
    const activateRes = program.activate();
    expect(activateRes.isSuccess).toBe(true);
    expect(program.status).toBe(WorkoutProgramStatus.ACTIVE);
    expect(program.activatedAt).toBeInstanceOf(Date);

    const activatedEvent = program.domainEvents.find(
      (e) => e.constructor.name === 'WorkoutProgramActivatedEvent',
    );
    expect(activatedEvent).toBeDefined();
  });

  it('should reject direct mutations on ACTIVE program (Rule WP-4)', () => {
    const program = createMockProgram(WorkoutProgramStatus.ACTIVE);

    expect(() => {
      program.updateDraft({ title: 'Mutate Active Program Directly' });
    }).toThrow(ActiveWorkoutProgramImmutableException);
  });

  it('should clone program into new version in DRAFT state preserving original (Rule WP-4)', () => {
    const originalProgram = createMockProgram(WorkoutProgramStatus.ACTIVE);

    const newVersion = originalProgram.createNewVersion({
      title: 'Hypertrophy Phase 1 (v2)',
    });

    expect(newVersion.version).toBe(2);
    expect(newVersion.status).toBe(WorkoutProgramStatus.DRAFT);
    expect(newVersion.title).toBe('Hypertrophy Phase 1 (v2)');
    expect(newVersion.coachingRelationshipId).toBe(originalProgram.coachingRelationshipId);
    expect(newVersion.trainerId).toBe(originalProgram.trainerId);
    expect(newVersion.clientId).toBe(originalProgram.clientId);
    expect(newVersion.weeks.length).toBe(1);

    // Original program remains ACTIVE and unmodified
    expect(originalProgram.version).toBe(1);
    expect(originalProgram.status).toBe(WorkoutProgramStatus.ACTIVE);
  });

  it('should transition ACTIVE program to COMPLETED', () => {
    const program = createMockProgram(WorkoutProgramStatus.ACTIVE);

    const completeRes = program.complete();
    expect(completeRes.isSuccess).toBe(true);
    expect(program.status).toBe(WorkoutProgramStatus.COMPLETED);
    expect(program.completedAt).toBeInstanceOf(Date);
  });

  it('should reject invalid transition from DRAFT to COMPLETED', () => {
    const program = createMockProgram(WorkoutProgramStatus.DRAFT);

    expect(() => {
      program.complete();
    }).toThrow(InvalidWorkoutProgramTransitionException);
  });

  describe('Reconstitution & Lifecycle Invariant Tests', () => {
    it('1. Reconstituting an ACTIVE program from DB yields ZERO domain events', () => {
      const schedule = WorkoutSchedule.create({ weeks: 4, sessionsPerWeek: 3 }).getValue();
      const reconstituted = WorkoutProgram.reconstitute(
        {
          coachingRelationshipId: 'cr_reconstitute_1',
          trainerId: 'trainer_1',
          clientId: 'client_1',
          version: 1,
          title: 'Active Loaded From DB',
          goal: WorkoutGoal.MUSCLE_GAIN,
          schedule,
          weeks: [],
          status: WorkoutProgramStatus.ACTIVE,
          activatedAt: new Date('2026-01-01'),
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-01'),
        },
        'prog_active_db_123',
      );

      expect(reconstituted.id).toBe('prog_active_db_123');
      expect(reconstituted.status).toBe(WorkoutProgramStatus.ACTIVE);
      expect(reconstituted.domainEvents).toHaveLength(0);
    });

    it('2. Reconstituting a DRAFT program from DB yields ZERO domain events', () => {
      const schedule = WorkoutSchedule.create({ weeks: 4, sessionsPerWeek: 3 }).getValue();
      const reconstituted = WorkoutProgram.reconstitute(
        {
          coachingRelationshipId: 'cr_reconstitute_2',
          trainerId: 'trainer_1',
          clientId: 'client_1',
          version: 1,
          title: 'Draft Loaded From DB',
          goal: WorkoutGoal.MUSCLE_GAIN,
          schedule,
          weeks: [],
          status: WorkoutProgramStatus.DRAFT,
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-01'),
        },
        'prog_draft_db_456',
      );

      expect(reconstituted.id).toBe('prog_draft_db_456');
      expect(reconstituted.status).toBe(WorkoutProgramStatus.DRAFT);
      expect(reconstituted.domainEvents).toHaveLength(0);
    });

    it('3. Creating a new program only emits WorkoutProgramCreatedEvent and NOT WorkoutProgramActivatedEvent', () => {
      const program = createMockProgram(WorkoutProgramStatus.DRAFT);

      expect(program.domainEvents).toHaveLength(1);
      expect(program.domainEvents[0].constructor.name).toBe('WorkoutProgramCreatedEvent');
      const hasActivation = program.domainEvents.some(
        (e) => e.constructor.name === 'WorkoutProgramActivatedEvent',
      );
      expect(hasActivation).toBe(false);
    });

    it('4. Calling activate() on already ACTIVE program is a no-op and does NOT emit a second activation event', () => {
      const program = createMockProgram(WorkoutProgramStatus.DRAFT);
      program.clearEvents();

      // First activation (genuine transition DRAFT -> ACTIVE)
      const res1 = program.activate();
      expect(res1.isSuccess).toBe(true);
      expect(program.domainEvents).toHaveLength(1);
      expect(program.domainEvents[0].constructor.name).toBe('WorkoutProgramActivatedEvent');

      program.clearEvents();

      // Second activation attempt on already ACTIVE program
      const res2 = program.activate();
      expect(res2.isSuccess).toBe(true);
      expect(program.domainEvents).toHaveLength(0); // No duplicate event
    });
  });
});
