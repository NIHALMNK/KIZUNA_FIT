import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateWorkoutProgramUseCase } from '../../../../src/modules/workout/application/use-cases/program/create-workout-program.use-case';
import { ActivateWorkoutProgramUseCase } from '../../../../src/modules/workout/application/use-cases/program/activate-workout-program.use-case';
import { StartWorkoutCompletionUseCase } from '../../../../src/modules/workout/application/use-cases/completion/start-workout-completion.use-case';
import { CompleteWorkoutUseCase } from '../../../../src/modules/workout/application/use-cases/completion/complete-workout.use-case';
import { CreateExerciseUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/create-exercise.use-case';
import { UpdateExerciseUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/update-exercise.use-case';
import { ReportExerciseUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/report-exercise.use-case';
import { GetOrCreateDraftProgramUseCase } from '../../../../src/modules/workout/application/use-cases/program/get-or-create-draft-program.use-case';
import { IWorkoutProgramRepository } from '../../../../src/modules/workout/domain/repositories/workout-program.repository.interface';
import { IExerciseRepository } from '../../../../src/modules/workout/domain/repositories/exercise.repository.interface';
import { IWorkoutCoachingGateway } from '../../../../src/modules/workout/domain/repositories/workout-coaching.gateway.interface';
import { IWorkoutCompletionRepository } from '../../../../src/modules/workout/domain/repositories/workout-completion.repository.interface';
import { Exercise } from '../../../../src/modules/workout/domain/aggregates/exercise.aggregate';
import { WorkoutProgram } from '../../../../src/modules/workout/domain/aggregates/workout-program.aggregate';
import { WorkoutCompletion } from '../../../../src/modules/workout/domain/aggregates/workout-completion.aggregate';
import {
  DifficultyLevel,
  EquipmentType,
  ExerciseOrigin,
  ExerciseStatus,
  ExerciseType,
  PrimaryMuscleGroup,
  WorkoutCompletionStatus,
  WorkoutGoal,
  WorkoutProgramStatus,
} from '../../../../src/modules/workout/domain/enums';
import {
  DeprecatedExerciseUsageException,
  UnauthorizedWorkoutActionException,
} from '../../../../src/modules/workout/domain/exceptions/workout-domain.exceptions';

describe('Workout Application Use Cases Tests', () => {
  let mockProgramRepo: IWorkoutProgramRepository;
  let mockExerciseRepo: IExerciseRepository;
  let mockCoachingGateway: IWorkoutCoachingGateway;
  let mockCompletionRepo: IWorkoutCompletionRepository;

  let activeExercise: Exercise;
  let deprecatedExercise: Exercise;
  const exercisesMap = new Map<string, Exercise>();

  beforeEach(() => {
    exercisesMap.clear();

    activeExercise = Exercise.create(
      {
        name: 'Barbell Bench Press',
        category: 'Chest',
        primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
        secondaryMuscleGroups: [],
        equipment: EquipmentType.BARBELL,
        difficulty: DifficultyLevel.INTERMEDIATE,
        instructions: [],
        media: { images: [] },
        caloriesPerMinute: 7,
        status: ExerciseStatus.ACTIVE,
      },
      'ex_bench',
    ).getValue();

    deprecatedExercise = Exercise.create(
      {
        name: 'Behind Neck Press',
        category: 'Shoulders',
        primaryMuscleGroup: PrimaryMuscleGroup.SHOULDERS,
        secondaryMuscleGroups: [],
        equipment: EquipmentType.BARBELL,
        difficulty: DifficultyLevel.ADVANCED,
        instructions: [],
        media: { images: [] },
        caloriesPerMinute: 5,
        status: ExerciseStatus.DEPRECATED,
      },
      'ex_deprecated',
    ).getValue();

    exercisesMap.set(activeExercise.id, activeExercise);
    exercisesMap.set(deprecatedExercise.id, deprecatedExercise);

    const programsMap = new Map<string, WorkoutProgram>();
    const completionsMap = new Map<string, WorkoutCompletion>();

    mockExerciseRepo = {
      findById: vi.fn(async (id: string) => exercisesMap.get(id) || null),
      findBySlug: vi.fn(async (slug: string) => {
        for (const ex of exercisesMap.values()) {
          if (ex.slug === slug) return ex;
        }
        return null;
      }),
      findByName: vi.fn(async (name: string) => {
        for (const ex of exercisesMap.values()) {
          if (ex.name.toLowerCase() === name.toLowerCase()) return ex;
        }
        return null;
      }),
      findMany: vi.fn(async () => Array.from(exercisesMap.values())),
      count: vi.fn(async () => exercisesMap.size),
      save: vi.fn(async (ex: Exercise) => {
        exercisesMap.set(ex.id, ex);
      }),
      saveMany: vi.fn(),
    };

    mockProgramRepo = {
      findById: vi.fn(async (id: string) => programsMap.get(id) || null),
      findActiveByRelationshipId: vi.fn(async (relId: string) => {
        for (const p of programsMap.values()) {
          if (p.coachingRelationshipId === relId && p.status === WorkoutProgramStatus.ACTIVE) {
            return p;
          }
        }
        return null;
      }),
      findDraftByRelationshipId: vi.fn(async (relId: string) => {
        for (const p of programsMap.values()) {
          if (p.coachingRelationshipId === relId && p.status === WorkoutProgramStatus.DRAFT) {
            return p;
          }
        }
        return null;
      }),
      findHighestVersionNumber: vi.fn(async (relId: string) => {
        let maxV = 0;
        for (const p of programsMap.values()) {
          if (p.coachingRelationshipId === relId && p.version > maxV) {
            maxV = p.version;
          }
        }
        return maxV;
      }),
      findActiveByClientId: vi.fn(async (clientId: string) => {
        for (const p of programsMap.values()) {
          if (p.clientId === clientId && p.status === WorkoutProgramStatus.ACTIVE) {
            return p;
          }
        }
        return null;
      }),
      findByRelationshipAndVersion: vi.fn(),
      findMany: vi.fn(async () => Array.from(programsMap.values())),
      count: vi.fn(async () => programsMap.size),
      save: vi.fn(async (p: WorkoutProgram) => {
        programsMap.set(p.id, p);
      }),
      deleteDraft: vi.fn(async (id: string) => {
        programsMap.delete(id);
      }),
    };

    mockCoachingGateway = {
      getRelationshipAccess: vi.fn(async (id: string) => ({
        relationshipId: id,
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
        isActive: true,
        status: 'ACTIVE',
      })),
      getActiveRelationshipForClient: vi.fn(),
    };

    mockCompletionRepo = {
      findById: vi.fn(async (id: string) => completionsMap.get(id) || null),
      findLatestByProgramAndDay: vi.fn(),
      findActiveSession: vi.fn(async (clientId: string, programId: string, day: number) => {
        for (const c of completionsMap.values()) {
          if (
            c.clientId === clientId &&
            c.workoutProgramId === programId &&
            c.workoutDay === day &&
            c.status === WorkoutCompletionStatus.IN_PROGRESS
          ) {
            return c;
          }
        }
        return null;
      }),
      findMany: vi.fn(async () => Array.from(completionsMap.values())),
      count: vi.fn(async () => completionsMap.size),
      save: vi.fn(async (c: WorkoutCompletion) => {
        completionsMap.set(c.id, c);
      }),
    };
  });

  it('should create a draft workout program when trainer owns coaching relationship', async () => {
    const useCase = new CreateWorkoutProgramUseCase(
      mockProgramRepo,
      mockExerciseRepo,
      mockCoachingGateway,
    );

    const result = await useCase.execute(
      {
        coachingRelationshipId: 'cr_123',
        title: 'Full Body Foundations',
        goal: WorkoutGoal.GENERAL_FITNESS,
        schedule: { weeks: 4, sessionsPerWeek: 3 },
        weeks: [
          {
            weekNumber: 1,
            title: 'Week 1',
            days: [
              {
                dayNumber: 1,
                title: 'Push Day',
                exercises: [
                  {
                    order: 1,
                    exerciseId: 'ex_bench',
                    type: ExerciseType.MAIN,
                    sets: 3,
                    reps: '10',
                    restSeconds: 90,
                  },
                ],
              },
            ],
          },
        ],
      },
      'usr_trainer_01',
    );

    expect(result.status).toBe(WorkoutProgramStatus.DRAFT);
    expect(result.version).toBe(1);
    expect(result.weeks[0].days[0].exercises[0].exercise.name).toBe('Barbell Bench Press');
  });

  it('should reject program creation with deprecated exercise (Rule EX-2)', async () => {
    const useCase = new CreateWorkoutProgramUseCase(
      mockProgramRepo,
      mockExerciseRepo,
      mockCoachingGateway,
    );

    await expect(
      useCase.execute(
        {
          coachingRelationshipId: 'cr_123',
          title: 'Invalid Program',
          goal: WorkoutGoal.GENERAL_FITNESS,
          schedule: { weeks: 4, sessionsPerWeek: 3 },
          weeks: [
            {
              weekNumber: 1,
              title: 'Week 1',
              days: [
                {
                  dayNumber: 1,
                  title: 'Day 1',
                  exercises: [
                    {
                      order: 1,
                      exerciseId: 'ex_deprecated',
                      type: ExerciseType.MAIN,
                      sets: 3,
                      reps: '10',
                      restSeconds: 90,
                    },
                  ],
                },
              ],
            },
          ],
        },
        'usr_trainer_01',
      ),
    ).rejects.toThrow(DeprecatedExerciseUsageException);
  });

  it('should activate program and maintain single active program invariant (Rule WP-3)', async () => {
    const createUseCase = new CreateWorkoutProgramUseCase(
      mockProgramRepo,
      mockExerciseRepo,
      mockCoachingGateway,
    );
    const activateUseCase = new ActivateWorkoutProgramUseCase(mockProgramRepo);

    // Create Program 1
    const p1 = await createUseCase.execute(
      {
        coachingRelationshipId: 'cr_123',
        title: 'Program 1',
        goal: WorkoutGoal.MUSCLE_GAIN,
        schedule: { weeks: 4, sessionsPerWeek: 3 },
        weeks: [
          {
            weekNumber: 1,
            title: 'Week 1',
            days: [
              {
                dayNumber: 1,
                title: 'Day 1',
                exercises: [
                  {
                    order: 1,
                    exerciseId: 'ex_bench',
                    type: ExerciseType.MAIN,
                    sets: 3,
                    reps: '10',
                    restSeconds: 60,
                  },
                ],
              },
            ],
          },
        ],
      },
      'usr_trainer_01',
    );

    // Activate Program 1
    const activatedP1 = await activateUseCase.execute(p1.id, 'usr_trainer_01');
    expect(activatedP1.status).toBe(WorkoutProgramStatus.ACTIVE);

    // Create Program 2
    const p2 = await createUseCase.execute(
      {
        coachingRelationshipId: 'cr_123',
        title: 'Program 2',
        goal: WorkoutGoal.STRENGTH,
        schedule: { weeks: 4, sessionsPerWeek: 3 },
        weeks: [
          {
            weekNumber: 1,
            title: 'Week 1',
            days: [
              {
                dayNumber: 1,
                title: 'Day 1',
                exercises: [
                  {
                    order: 1,
                    exerciseId: 'ex_bench',
                    type: ExerciseType.MAIN,
                    sets: 4,
                    reps: '5',
                    restSeconds: 120,
                  },
                ],
              },
            ],
          },
        ],
      },
      'usr_trainer_01',
    );

    // Activate Program 2 -> Program 1 should be completed
    const activatedP2 = await activateUseCase.execute(p2.id, 'usr_trainer_01');
    expect(activatedP2.status).toBe(WorkoutProgramStatus.ACTIVE);

    const reloadedP1 = await mockProgramRepo.findById(p1.id);
    expect(reloadedP1?.status).toBe(WorkoutProgramStatus.COMPLETED);
  });

  it('should start and complete a workout session for a client', async () => {
    const createUseCase = new CreateWorkoutProgramUseCase(
      mockProgramRepo,
      mockExerciseRepo,
      mockCoachingGateway,
    );
    const activateUseCase = new ActivateWorkoutProgramUseCase(mockProgramRepo);
    const startCompletionUseCase = new StartWorkoutCompletionUseCase(
      mockCompletionRepo,
      mockProgramRepo,
    );
    const completeUseCase = new CompleteWorkoutUseCase(mockCompletionRepo);

    const programDto = await createUseCase.execute(
      {
        coachingRelationshipId: 'cr_123',
        title: 'Session Test Program',
        goal: WorkoutGoal.GENERAL_FITNESS,
        schedule: { weeks: 4, sessionsPerWeek: 3 },
        weeks: [
          {
            weekNumber: 1,
            title: 'Week 1',
            days: [
              {
                dayNumber: 1,
                title: 'Day 1',
                exercises: [
                  {
                    order: 1,
                    exerciseId: 'ex_bench',
                    type: ExerciseType.MAIN,
                    sets: 2,
                    reps: '10',
                    restSeconds: 60,
                  },
                ],
              },
            ],
          },
        ],
      },
      'usr_trainer_01',
    );

    await activateUseCase.execute(programDto.id, 'usr_trainer_01');

    // Start workout
    const session = await startCompletionUseCase.execute(
      {
        coachingRelationshipId: 'cr_123',
        workoutProgramId: programDto.id,
        workoutDay: 1,
      },
      'usr_client_01',
    );

    expect(session.status).toBe(WorkoutCompletionStatus.IN_PROGRESS);
    expect(session.completedExercises.length).toBe(1);

    // Complete workout
    const completed = await completeUseCase.execute(
      session.id,
      {
        completedExercises: [
          {
            exerciseId: 'ex_bench',
            exerciseName: 'Barbell Bench Press',
            completedSets: [
              { setNumber: 1, plannedReps: '10', completedReps: 10, weight: 60, completed: true },
              { setNumber: 2, plannedReps: '10', completedReps: 10, weight: 60, completed: true },
            ],
          },
        ],
      },
      'usr_client_01',
    );

    expect(completed.status).toBe(WorkoutCompletionStatus.COMPLETED);
    expect(completed.completedAt).toBeDefined();
  });

  it('should allow multiple trainers to create exercises with identical display names and distinct slugs', async () => {
    const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);

    // Trainer A creates Deadlift
    const exA = await createUseCase.execute(
      {
        name: 'Deadlift',
        category: 'Back',
        primaryMuscleGroup: PrimaryMuscleGroup.BACK,
        equipment: EquipmentType.BARBELL,
        difficulty: DifficultyLevel.ADVANCED,
      },
      'trainer_a',
      'TRAINER',
    );

    expect(exA.name).toBe('Deadlift');
    expect(exA.slug).toBe('deadlift');
    expect(exA.origin).toBe(ExerciseOrigin.TRAINER);
    expect(exA.createdByTrainerId).toBe('trainer_a');

    // Trainer B creates Deadlift
    const exB = await createUseCase.execute(
      {
        name: 'Deadlift',
        category: 'Back',
        primaryMuscleGroup: PrimaryMuscleGroup.BACK,
        equipment: EquipmentType.BARBELL,
        difficulty: DifficultyLevel.ADVANCED,
      },
      'trainer_b',
      'TRAINER',
    );

    expect(exB.name).toBe('Deadlift');
    expect(exB.slug).toContain('deadlift-');
    expect(exB.origin).toBe(ExerciseOrigin.TRAINER);
    expect(exB.createdByTrainerId).toBe('trainer_b');
    expect(exA.id).not.toBe(exB.id);
  });

  it('should enforce that only author trainer or admin can update an exercise', async () => {
    const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
    const updateUseCase = new UpdateExerciseUseCase(mockExerciseRepo);

    const created = await createUseCase.execute(
      {
        name: 'Romanian Deadlift',
        category: 'Legs',
        primaryMuscleGroup: PrimaryMuscleGroup.LEGS,
        equipment: EquipmentType.BARBELL,
        difficulty: DifficultyLevel.INTERMEDIATE,
      },
      'trainer_author',
      'TRAINER',
    );

    // Other trainer attempt should fail
    await expect(
      updateUseCase.execute(created.id, { name: 'Hacked Deadlift' }, 'trainer_other', 'TRAINER'),
    ).rejects.toThrow(UnauthorizedWorkoutActionException);

    // Author trainer attempt should succeed
    const updated = await updateUseCase.execute(
      created.id,
      { name: 'Romanian Deadlift (Tempo 3-0-1)' },
      'trainer_author',
      'TRAINER',
    );
    expect(updated.name).toBe('Romanian Deadlift (Tempo 3-0-1)');

    // Admin should also succeed
    const adminUpdated = await updateUseCase.execute(
      created.id,
      { category: 'Hamstrings' },
      'admin_user',
      'ADMIN',
    );
    expect(adminUpdated.category).toBe('Hamstrings');
  });

  it('should allow trainers to report eligible exercises but prevent reporting own exercises', async () => {
    const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
    const reportUseCase = new ReportExerciseUseCase(mockExerciseRepo);

    const ex = await createUseCase.execute(
      {
        name: 'Questionable Exercise',
        category: 'Custom',
        primaryMuscleGroup: PrimaryMuscleGroup.CORE,
        equipment: EquipmentType.BODYWEIGHT,
        difficulty: DifficultyLevel.BEGINNER,
      },
      'trainer_author',
      'TRAINER',
    );

    // Reporting own exercise fails
    await expect(
      reportUseCase.execute(ex.id, { reason: 'I made a mistake' }, 'trainer_author'),
    ).rejects.toThrow('You cannot report your own exercise.');

    // Reporting another trainer's exercise succeeds
    const reportRes = await reportUseCase.execute(
      ex.id,
      { reason: 'Misleading description', details: 'Form instructions are unsafe' },
      'trainer_reviewer',
    );

    expect(reportRes.reportId).toBeDefined();
    expect(reportRes.exerciseId).toBe(ex.id);
    expect(reportRes.message).toContain('submitted successfully');
  });

  it('should idempotently return existing DRAFT or create next version DRAFT from ACTIVE program', async () => {
    const createUseCase = new CreateWorkoutProgramUseCase(
      mockProgramRepo,
      mockExerciseRepo,
      mockCoachingGateway,
    );
    const activateUseCase = new ActivateWorkoutProgramUseCase(mockProgramRepo);
    const getOrCreateDraftUseCase = new GetOrCreateDraftProgramUseCase(
      mockProgramRepo,
      mockCoachingGateway,
    );

    // 1. Create and activate v1 program
    const v1 = await createUseCase.execute(
      {
        coachingRelationshipId: 'cr_test_edit',
        title: 'Hypertrophy Cycle v1',
        goal: WorkoutGoal.MUSCLE_GAIN,
        schedule: { weeks: 4, sessionsPerWeek: 3 },
        weeks: [
          {
            weekNumber: 1,
            title: 'Week 1',
            days: [
              {
                dayNumber: 1,
                title: 'Day 1 Chest',
                exercises: [
                  {
                    order: 1,
                    exerciseId: 'ex_bench',
                    type: ExerciseType.MAIN,
                    sets: 3,
                    reps: '10',
                    restSeconds: 90,
                  },
                ],
              },
            ],
          },
        ],
      },
      'usr_trainer_01',
    );
    await activateUseCase.execute(v1.id, 'usr_trainer_01');

    // 2. Call getOrCreateDraftProgram -> should create DRAFT v2 cloned from v1
    const draft1 = await getOrCreateDraftUseCase.execute('cr_test_edit', 'usr_trainer_01');
    expect(draft1.version).toBe(2);
    expect(draft1.status).toBe(WorkoutProgramStatus.DRAFT);
    expect(draft1.weeks.length).toBe(1);
    expect(draft1.weeks[0].days[0].exercises.length).toBe(1);

    // 3. Call getOrCreateDraftProgram again -> should idempotently return the exact same draft (v2) without creating v3
    const draft2 = await getOrCreateDraftUseCase.execute('cr_test_edit', 'usr_trainer_01');
    expect(draft2.id).toBe(draft1.id);
    expect(draft2.version).toBe(2);
    expect(draft2.status).toBe(WorkoutProgramStatus.DRAFT);
  });
});
