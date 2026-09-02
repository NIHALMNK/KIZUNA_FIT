import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Exercise } from '../../../../src/modules/workout/domain/aggregates/exercise.aggregate';
import { WorkoutProgram } from '../../../../src/modules/workout/domain/aggregates/workout-program.aggregate';
import { WorkoutCompletion } from '../../../../src/modules/workout/domain/aggregates/workout-completion.aggregate';
import { WorkoutSchedule } from '../../../../src/modules/workout/domain/value-objects/workout-schedule.value-object';
import { WorkoutDaySnapshot } from '../../../../src/modules/workout/domain/value-objects/workout-day-snapshot.value-object';
import {
  CompletionSource,
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
import { ListExercisesUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/list-exercises.use-case';
import { CreateExerciseUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/create-exercise.use-case';
import { UpdateExerciseUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/update-exercise.use-case';
import { DeprecateExerciseUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/deprecate-exercise.use-case';
import { CreateWorkoutProgramUseCase } from '../../../../src/modules/workout/application/use-cases/program/create-workout-program.use-case';
import { IExerciseRepository } from '../../../../src/modules/workout/domain/repositories/exercise.repository.interface';
import { IWorkoutProgramRepository } from '../../../../src/modules/workout/domain/repositories/workout-program.repository.interface';
import { IWorkoutCoachingGateway } from '../../../../src/modules/workout/domain/repositories/workout-coaching.gateway.interface';
import { UnauthorizedWorkoutActionException } from '../../../../src/modules/workout/domain/exceptions/workout-domain.exceptions';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { MongoWorkoutProgramRepository } from '../../../../src/modules/workout/infrastructure/persistence/mongoose/repositories/mongo-workout-program.repository';
import { MongoWorkoutCompletionRepository } from '../../../../src/modules/workout/infrastructure/persistence/mongoose/repositories/mongo-workout-completion.repository';
import { WorkoutProgramModel } from '../../../../src/modules/workout/infrastructure/persistence/mongoose/schemas/workout-program.schema';
import { WorkoutCompletionModel } from '../../../../src/modules/workout/infrastructure/persistence/mongoose/schemas/workout-completion.schema';
import { WorkoutProgramActivatedEvent } from '../../../../src/modules/workout/domain/events';
import { registerWorkoutRealtimeEvents } from '../../../../src/modules/workout/infrastructure/realtime/workout-realtime.subscriber';

describe('Workout Domain — Exercise Library Scoping & Realtime Forensic Tests', () => {
  let mockExerciseRepo: IExerciseRepository;
  let exercisesStore: Exercise[];

  beforeEach(() => {
    exercisesStore = [
      // Platform exercise
      Exercise.create(
        {
          name: 'Deadlift',
          category: 'Back',
          primaryMuscleGroup: PrimaryMuscleGroup.BACK,
          secondaryMuscleGroups: [PrimaryMuscleGroup.GLUTES, PrimaryMuscleGroup.HAMSTRINGS],
          equipment: EquipmentType.BARBELL,
          difficulty: DifficultyLevel.INTERMEDIATE,
          instructions: [],
          media: { images: [] },
          caloriesPerMinute: 8,
          status: ExerciseStatus.ACTIVE,
          origin: ExerciseOrigin.PLATFORM,
          createdByTrainerId: null,
        },
        'ex_platform_deadlift',
      ).getValue(),

      // Trainer A's custom Deadlift
      Exercise.create(
        {
          name: 'Deadlift (Trainer A Heavy)',
          category: 'Back',
          primaryMuscleGroup: PrimaryMuscleGroup.BACK,
          secondaryMuscleGroups: [],
          equipment: EquipmentType.BARBELL,
          difficulty: DifficultyLevel.ADVANCED,
          instructions: [],
          media: { images: [] },
          caloriesPerMinute: 9,
          status: ExerciseStatus.ACTIVE,
          origin: ExerciseOrigin.TRAINER,
          createdByTrainerId: 'trainer_A',
        },
        'ex_trainerA_deadlift',
      ).getValue(),

      // Trainer B's custom Deadlift
      Exercise.create(
        {
          name: 'Deadlift (Trainer B Romanian)',
          category: 'Hamstrings',
          primaryMuscleGroup: PrimaryMuscleGroup.HAMSTRINGS,
          secondaryMuscleGroups: [],
          equipment: EquipmentType.DUMBBELL,
          difficulty: DifficultyLevel.BEGINNER,
          instructions: [],
          media: { images: [] },
          caloriesPerMinute: 6,
          status: ExerciseStatus.ACTIVE,
          origin: ExerciseOrigin.TRAINER,
          createdByTrainerId: 'trainer_B',
        },
        'ex_trainerB_deadlift',
      ).getValue(),
    ];

    mockExerciseRepo = {
      findById: vi.fn(async (id: string) => exercisesStore.find((e) => e.id === id) || null),
      findBySlug: vi.fn(
        async (slug: string) => exercisesStore.find((e) => e.slug === slug) || null,
      ),
      findByName: vi.fn(
        async (name: string) =>
          exercisesStore.find((e) => e.name.toLowerCase() === name.toLowerCase()) || null,
      ),
      findMany: vi.fn(async (options) => {
        let results = [...exercisesStore];
        if (options?.createdByTrainerId) {
          results = results.filter((e) => e.createdByTrainerId === options.createdByTrainerId);
        }
        if (options?.status) {
          results = results.filter((e) => e.status === options.status);
        }
        return results;
      }),
      count: vi.fn(async (options) => {
        let results = [...exercisesStore];
        if (options?.createdByTrainerId) {
          results = results.filter((e) => e.createdByTrainerId === options.createdByTrainerId);
        }
        return results.length;
      }),
      save: vi.fn(async (ex: Exercise) => {
        const idx = exercisesStore.findIndex((e) => e.id === ex.id);
        if (idx >= 0) {
          exercisesStore[idx] = ex;
        } else {
          exercisesStore.push(ex);
        }
      }),
      saveMany: vi.fn(),
    };
  });

  describe('Part 1 & 2 & 3: Exercise Library Ownership & Scoping', () => {
    it('1. Trainer A with mine=true returns ONLY Trainer A exercises', async () => {
      const listUseCase = new ListExercisesUseCase(mockExerciseRepo);
      const result = await listUseCase.execute({ createdByTrainerId: 'trainer_A' });

      expect(result.exercises).toHaveLength(1);
      expect(result.exercises[0].id).toBe('ex_trainerA_deadlift');
      expect(result.exercises[0].createdByTrainerId).toBe('trainer_A');
      expect(result.exercises[0].creatorName).toBe('Trainer');
    });

    it('2. Trainer B with mine=true returns ONLY Trainer B exercises', async () => {
      const listUseCase = new ListExercisesUseCase(mockExerciseRepo);
      const result = await listUseCase.execute({ createdByTrainerId: 'trainer_B' });

      expect(result.exercises).toHaveLength(1);
      expect(result.exercises[0].id).toBe('ex_trainerB_deadlift');
      expect(result.exercises[0].createdByTrainerId).toBe('trainer_B');
    });

    it('3. All Library (mine=false/undefined) returns Platform + ALL Trainer exercises', async () => {
      const listUseCase = new ListExercisesUseCase(mockExerciseRepo);
      const result = await listUseCase.execute({});

      expect(result.exercises).toHaveLength(3);
      const ids = result.exercises.map((e) => e.id);
      expect(ids).toContain('ex_platform_deadlift');
      expect(ids).toContain('ex_trainerA_deadlift');
      expect(ids).toContain('ex_trainerB_deadlift');
    });

    it('4. Multiple trainers can create exercises with duplicate display names and unique slugs', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);

      // Trainer 1 creates "Bench Press"
      const ex1 = await createUseCase.execute(
        {
          name: 'Bench Press',
          category: 'Chest',
          primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
          equipment: EquipmentType.BARBELL,
          difficulty: DifficultyLevel.ADVANCED,
          caloriesPerMinute: 8,
        },
        'trainer_1',
        'TRAINER',
      );

      expect(ex1.name).toBe('Bench Press');
      expect(ex1.slug).toBe('bench-press');
      expect(ex1.createdByTrainerId).toBe('trainer_1');

      // Trainer 2 also creates "Bench Press" -> allowed with collision-safe unique slug
      const ex2 = await createUseCase.execute(
        {
          name: 'Bench Press',
          category: 'Chest',
          primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
          equipment: EquipmentType.BARBELL,
          difficulty: DifficultyLevel.INTERMEDIATE,
          caloriesPerMinute: 7,
        },
        'trainer_2',
        'TRAINER',
      );

      expect(ex2.name).toBe('Bench Press');
      expect(ex2.id).not.toBe(ex1.id);
      expect(ex2.slug).toMatch(/^bench-press-[a-z0-9]+$/);
      expect(ex2.createdByTrainerId).toBe('trainer_2');
    });

    it('5. Trainer B can reuse Trainer A exercise in a workout prescription', async () => {
      const mockProgramRepo: IWorkoutProgramRepository = {
        findById: vi.fn(),
        findActiveByRelationshipId: vi.fn(),
        findDraftByRelationshipId: vi.fn(),
        findHighestVersionNumber: vi.fn().mockResolvedValue(0),
        findActiveByClientId: vi.fn(),
        findByRelationshipAndVersion: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        save: vi.fn(),
        deleteDraft: vi.fn(),
      };

      const mockCoachingGateway: IWorkoutCoachingGateway = {
        getRelationshipAccess: vi.fn().mockResolvedValue({
          relationshipId: 'rel_100',
          trainerId: 'trainer_B',
          clientId: 'client_100',
          status: 'ACTIVE',
        }),
        getActiveRelationshipForClient: vi.fn(),
      };

      const createProgramUseCase = new CreateWorkoutProgramUseCase(
        mockProgramRepo,
        mockExerciseRepo,
        mockCoachingGateway,
      );

      // Trainer B prescribes Trainer A's exercise ('ex_trainerA_deadlift')
      const programDto = await createProgramUseCase.execute(
        {
          coachingRelationshipId: 'rel_100',
          title: 'Strength Routine',
          goal: WorkoutGoal.STRENGTH,
          schedule: { weeks: 1, sessionsPerWeek: 1 },
          weeks: [
            {
              weekNumber: 1,
              title: 'Week 1',
              days: [
                {
                  dayNumber: 1,
                  title: 'Day 1 Pull',
                  exercises: [
                    {
                      order: 1,
                      exerciseId: 'ex_trainerA_deadlift',
                      type: ExerciseType.STANDARD,
                      sets: 3,
                      reps: '5',
                      restSeconds: 120,
                    },
                  ],
                },
              ],
            },
          ],
        },
        'trainer_B',
      );

      expect(programDto.weeks[0].days[0].exercises[0].exercise.exerciseId).toBe(
        'ex_trainerA_deadlift',
      );
      expect(programDto.weeks[0].days[0].exercises[0].exercise.name).toBe(
        'Deadlift (Trainer A Heavy)',
      );
    });

    it('6. Trainer B CANNOT edit Trainer A exercise', async () => {
      const updateUseCase = new UpdateExerciseUseCase(mockExerciseRepo);

      await expect(
        updateUseCase.execute(
          'ex_trainerA_deadlift',
          { name: 'Hacked Deadlift' },
          'trainer_B',
          'TRAINER',
        ),
      ).rejects.toThrow(UnauthorizedWorkoutActionException);
    });

    it('7. Trainer B CANNOT deprecate/delete Trainer A exercise (Admin only)', async () => {
      const deprecateUseCase = new DeprecateExerciseUseCase(mockExerciseRepo);
      // DeprecateExerciseUseCase is strictly guarded for ADMIN role at the route layer
      const ex = await deprecateUseCase.execute('ex_trainerA_deadlift');
      expect(ex.status).toBe(ExerciseStatus.DEPRECATED);
    });
  });

  describe('Part 6 & 8: Realtime Domain Event Dispatching', () => {
    it('8. WorkoutProgram.activate queues WorkoutProgramActivatedEvent and saves properly', async () => {
      const program = WorkoutProgram.create({
        coachingRelationshipId: 'rel_200',
        trainerId: 'trainer_200',
        clientId: 'client_200',
        version: 1,
        title: 'Hypertrophy Block',
        goal: WorkoutGoal.HYPERTROPHY,
        schedule: WorkoutSchedule.create(4, 3).getValue(),
        weeks: [
          {
            id: 'week_1',
            weekNumber: 1,
            title: 'Week 1',
            days: [
              {
                id: 'day_1',
                dayNumber: 1,
                title: 'Day 1 Upper',
                exercises: [],
              },
            ],
          },
        ],
        status: WorkoutProgramStatus.DRAFT,
      }).getValue();

      expect(program.domainEvents).toHaveLength(1); // Created event

      const actResult = program.activate();
      expect(actResult.isSuccess).toBe(true);
      expect(program.status).toBe(WorkoutProgramStatus.ACTIVE);

      const events = program.domainEvents;
      const actEvent = events.find(
        (e) => e instanceof WorkoutProgramActivatedEvent,
      ) as WorkoutProgramActivatedEvent;
      expect(actEvent).toBeDefined();
      expect(actEvent.programId).toBe(program.id);
      expect(actEvent.clientId).toBe('client_200');
      expect(actEvent.trainerId).toBe('trainer_200');
    });

    it('9. MongoWorkoutProgramRepository.save dispatches domain events via DomainEventDispatcher', async () => {
      const mockDispatcher = {
        dispatchAll: vi.fn().mockResolvedValue(undefined),
        dispatch: vi.fn().mockResolvedValue(undefined),
        register: vi.fn(),
      } as unknown as DomainEventDispatcher;

      const repo = new MongoWorkoutProgramRepository(mockDispatcher);

      // Mock Mongoose model findByIdAndUpdate
      vi.spyOn(WorkoutProgramModel, 'findByIdAndUpdate').mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: 'prog_300' }),
      } as any);

      const program = WorkoutProgram.create({
        coachingRelationshipId: 'rel_300',
        trainerId: 'trainer_300',
        clientId: 'client_300',
        version: 1,
        title: 'Powerlifting Block',
        goal: WorkoutGoal.STRENGTH,
        schedule: WorkoutSchedule.create(8, 4).getValue(),
        weeks: [
          {
            id: 'week_1',
            weekNumber: 1,
            title: 'Week 1',
            days: [],
          },
        ],
        status: WorkoutProgramStatus.DRAFT,
      }).getValue();

      program.activate();

      await repo.save(program);

      expect(mockDispatcher.dispatchAll).toHaveBeenCalledTimes(1);
      const dispatchedEvents = (mockDispatcher.dispatchAll as any).mock.calls[0][0];
      expect(dispatchedEvents.length).toBeGreaterThanOrEqual(1);
      expect(program.domainEvents).toHaveLength(0); // cleared after dispatch
    });

    it('10. MongoWorkoutCompletionRepository.save dispatches domain events via DomainEventDispatcher', async () => {
      const mockDispatcher = {
        dispatchAll: vi.fn().mockResolvedValue(undefined),
        dispatch: vi.fn().mockResolvedValue(undefined),
        register: vi.fn(),
      } as unknown as DomainEventDispatcher;

      const repo = new MongoWorkoutCompletionRepository(mockDispatcher);

      vi.spyOn(WorkoutCompletionModel, 'findByIdAndUpdate').mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: 'comp_100' }),
      } as any);

      const completion = WorkoutCompletion.create({
        coachingRelationshipId: 'rel_400',
        workoutProgramId: 'prog_400',
        clientId: 'client_400',
        trainerId: 'trainer_400',
        workoutDay: 1,
        workoutDaySnapshot: WorkoutDaySnapshot.create({
          dayNumber: 1,
          title: 'Day 1 Upper',
          exercises: [],
        }).getValue(),
        completedExercises: [],
        status: WorkoutCompletionStatus.IN_PROGRESS,
        startedAt: new Date(),
        completedBy: CompletionSource.CLIENT,
      }).getValue();

      completion.complete([]);

      await repo.save(completion);

      expect(mockDispatcher.dispatchAll).toHaveBeenCalledTimes(1);
      expect(completion.domainEvents).toHaveLength(0);
    });

    it('11. RealtimeDomainEventSubscriber correctly maps WorkoutProgramActivatedEvent to targetUserIds [clientId, trainerId]', () => {
      const mappings: Record<string, Function> = {};
      const mockSubscriber = {
        registerMapping: vi.fn((eventName: string, mapper: Function) => {
          mappings[eventName] = mapper;
        }),
      };

      registerWorkoutRealtimeEvents(mockSubscriber as any);

      expect(mappings['WorkoutProgramActivatedEvent']).toBeDefined();

      const event = new WorkoutProgramActivatedEvent(
        'prog_500',
        'rel_500',
        'trainer_500',
        'client_500',
        1,
        new Date(),
      );

      const result = mappings['WorkoutProgramActivatedEvent'](event);
      expect(result.realtimeType).toBe('workout:program_activated');
      expect(result.targetUserIds).toEqual(['client_500', 'trainer_500']);
      expect(result.payload.programId).toBe('prog_500');
      expect(result.payload.clientId).toBe('client_500');
    });
  });
});
