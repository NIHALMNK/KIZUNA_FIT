import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateExerciseUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/create-exercise.use-case';
import { UpdateExerciseUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/update-exercise.use-case';
import { UploadExerciseMediaUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/upload-exercise-media.use-case';
import { DeleteExerciseMediaUseCase } from '../../../../src/modules/workout/application/use-cases/exercise/delete-exercise-media.use-case';
import { IExerciseRepository } from '../../../../src/modules/workout/domain/repositories/exercise.repository.interface';
import { IWorkoutStorageGateway } from '../../../../src/modules/workout/application/ports/workout-storage.gateway.interface';
import { Exercise } from '../../../../src/modules/workout/domain/aggregates/exercise.aggregate';
import { WorkoutProgram } from '../../../../src/modules/workout/domain/aggregates/workout-program.aggregate';
import {
  DifficultyLevel,
  EquipmentType,
  ExerciseOrigin,
  ExerciseStatus,
  PrimaryMuscleGroup,
  WorkoutGoal,
  WorkoutProgramStatus,
} from '../../../../src/modules/workout/domain/enums';
import { WorkoutSchedule } from '../../../../src/modules/workout/domain/value-objects/workout-schedule.value-object';
import { ValidationError } from '../../../../src/shared/exceptions/AppError';
import { UnauthorizedWorkoutActionException } from '../../../../src/modules/workout/domain/exceptions/workout-domain.exceptions';

describe('Exercise Media System End-to-End Tests', () => {
  let mockExerciseRepo: IExerciseRepository;
  let mockStorageGateway: IWorkoutStorageGateway;
  let storedExercises: Map<string, Exercise>;

  beforeEach(() => {
    storedExercises = new Map();

    mockExerciseRepo = {
      findById: vi.fn(async (id: string) => storedExercises.get(id) || null),
      findBySlug: vi.fn(async (slug: string) => {
        for (const ex of storedExercises.values()) {
          if (ex.slug === slug) return ex;
        }
        return null;
      }),
      findAll: vi.fn(async () => Array.from(storedExercises.values())),
      findActiveExercises: vi.fn(async () =>
        Array.from(storedExercises.values()).filter((e) => e.status === ExerciseStatus.ACTIVE),
      ),
      findCreatedByTrainer: vi.fn(async (trainerId: string) =>
        Array.from(storedExercises.values()).filter((e) => e.createdByTrainerId === trainerId),
      ),
      save: vi.fn(async (exercise: Exercise) => {
        storedExercises.set(exercise.id, exercise);
      }),
    };

    mockStorageGateway = {
      uploadFile: vi.fn(async (_buffer: Buffer, _mime: string, options?: any) => {
        const ext = options?.resourceType === 'video' ? 'mp4' : 'jpg';
        return `https://res.cloudinary.com/kizunafit/${options?.folder || 'exercises'}/asset_${Date.now()}.${ext}`;
      }),
      deleteFile: vi.fn(async (_fileUrl: string) => {}),
    };
  });

  describe('Upload & Delete Media Use Cases', () => {
    it('1. Uploads image successfully when valid JPEG buffer provided', async () => {
      const useCase = new UploadExerciseMediaUseCase(mockStorageGateway);
      const buffer = Buffer.from('fake-image-bytes');
      const res = await useCase.execute({
        fileBuffer: buffer,
        mimeType: 'image/jpeg',
        sizeBytes: buffer.length,
      });

      expect(res.url).toContain('https://res.cloudinary.com');
      expect(res.resourceType).toBe('image');
      expect(mockStorageGateway.uploadFile).toHaveBeenCalledTimes(1);
    });

    it('2. Uploads video successfully when valid MP4 buffer provided', async () => {
      const useCase = new UploadExerciseMediaUseCase(mockStorageGateway);
      const buffer = Buffer.from('fake-video-bytes');
      const res = await useCase.execute({
        fileBuffer: buffer,
        mimeType: 'video/mp4',
        sizeBytes: buffer.length,
      });

      expect(res.url).toContain('.mp4');
      expect(res.resourceType).toBe('video');
    });

    it('3. Rejects unsupported MIME types (e.g. application/pdf)', async () => {
      const useCase = new UploadExerciseMediaUseCase(mockStorageGateway);
      const buffer = Buffer.from('fake-pdf');
      await expect(
        useCase.execute({
          fileBuffer: buffer,
          mimeType: 'application/pdf',
          sizeBytes: buffer.length,
        }),
      ).rejects.toThrow(ValidationError);
    });

    it('4. Rejects oversized image (> 10MB)', async () => {
      const useCase = new UploadExerciseMediaUseCase(mockStorageGateway);
      const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024);
      await expect(
        useCase.execute({
          fileBuffer: oversizedBuffer,
          mimeType: 'image/png',
          sizeBytes: oversizedBuffer.length,
        }),
      ).rejects.toThrow(/exceeds 10MB/);
    });

    it('5. Rejects oversized video (> 50MB)', async () => {
      const useCase = new UploadExerciseMediaUseCase(mockStorageGateway);
      const oversizedVideo = Buffer.alloc(55 * 1024 * 1024);
      await expect(
        useCase.execute({
          fileBuffer: oversizedVideo,
          mimeType: 'video/mp4',
          sizeBytes: oversizedVideo.length,
        }),
      ).rejects.toThrow(/exceeds 50MB/);
    });

    it('6. Delete media use case calls storageGateway.deleteFile', async () => {
      const useCase = new DeleteExerciseMediaUseCase(mockStorageGateway);
      await useCase.execute('https://res.cloudinary.com/kizunafit/exercises/sample.jpg');
      expect(mockStorageGateway.deleteFile).toHaveBeenCalledWith(
        'https://res.cloudinary.com/kizunafit/exercises/sample.jpg',
      );
    });
  });

  describe('Create Exercise with Complete Media Options', () => {
    it('7. Creates Exercise without media (clean empty defaults)', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      const res = await createUseCase.execute(
        {
          name: 'Classic Bench Press',
          category: 'Chest',
          primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
          equipment: EquipmentType.BARBELL,
          difficulty: DifficultyLevel.INTERMEDIATE,
        },
        'trainer_1',
        'TRAINER',
      );

      expect(res.name).toBe('Classic Bench Press');
      expect(res.media.thumbnailUrl).toBeNull();
      expect(res.media.videoUrl).toBeNull();
      expect(res.media.imageUrls).toEqual([]);
    });

    it('8. Creates Exercise with thumbnail only', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      const res = await createUseCase.execute(
        {
          name: 'Incline Dumbbell Press',
          category: 'Chest',
          primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
          equipment: EquipmentType.DUMBBELL,
          difficulty: DifficultyLevel.INTERMEDIATE,
          media: {
            thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/incline_thumb.jpg',
          },
        },
        'trainer_1',
        'TRAINER',
      );

      expect(res.media.thumbnailUrl).toBe(
        'https://res.cloudinary.com/kizunafit/exercises/incline_thumb.jpg',
      );
      expect(res.media.imageUrls).toEqual([]);
      expect(res.media.videoUrl).toBeNull();
    });

    it('9. Creates Exercise with multiple images gallery and YouTube demonstration video', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      const res = await createUseCase.execute(
        {
          name: 'Barbell Back Squat',
          category: 'Legs',
          primaryMuscleGroup: PrimaryMuscleGroup.LEGS,
          secondaryMuscleGroups: [PrimaryMuscleGroup.GLUTES, PrimaryMuscleGroup.CORE],
          equipment: EquipmentType.BARBELL,
          difficulty: DifficultyLevel.ADVANCED,
          media: {
            thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/squat_thumb.jpg',
            imageUrls: [
              'https://res.cloudinary.com/kizunafit/exercises/squat_step1.jpg',
              'https://res.cloudinary.com/kizunafit/exercises/squat_step2.jpg',
            ],
            videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
          },
        },
        'trainer_1',
        'TRAINER',
      );

      expect(res.media.thumbnailUrl).toBe(
        'https://res.cloudinary.com/kizunafit/exercises/squat_thumb.jpg',
      );
      expect(res.media.imageUrls).toHaveLength(2);
      expect(res.media.videoUrl).toBe('https://www.youtube.com/watch?v=aclHkVaku9U');
      expect(res.secondaryMuscleGroups).toContain(PrimaryMuscleGroup.GLUTES);
    });

    it('9b. Accepts youtu.be and youtube.com/shorts URLs', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      const resShorts = await createUseCase.execute(
        {
          name: 'Bulgarian Split Squat',
          category: 'Legs',
          primaryMuscleGroup: PrimaryMuscleGroup.LEGS,
          equipment: EquipmentType.DUMBBELL,
          difficulty: DifficultyLevel.INTERMEDIATE,
          media: {
            videoUrl: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
          },
        },
        'trainer_1',
        'TRAINER',
      );
      expect(resShorts.media.videoUrl).toBe('https://www.youtube.com/shorts/dQw4w9WgXcQ');

      const resYoutuBe = await createUseCase.execute(
        {
          name: 'Walking Lunges',
          category: 'Legs',
          primaryMuscleGroup: PrimaryMuscleGroup.LEGS,
          equipment: EquipmentType.DUMBBELL,
          difficulty: DifficultyLevel.BEGINNER,
          media: {
            videoUrl: 'https://youtu.be/dQw4w9WgXcQ?si=test',
          },
        },
        'trainer_1',
        'TRAINER',
      );
      expect(resYoutuBe.media.videoUrl).toBe('https://youtu.be/dQw4w9WgXcQ?si=test');
    });

    it('9c. Rejects invalid non-YouTube video URLs', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      await expect(
        createUseCase.execute(
          {
            name: 'Invalid Video Exercise',
            category: 'Legs',
            primaryMuscleGroup: PrimaryMuscleGroup.LEGS,
            equipment: EquipmentType.BODYWEIGHT,
            difficulty: DifficultyLevel.BEGINNER,
            media: {
              videoUrl: 'https://vimeo.com/12345678',
            },
          },
          'trainer_1',
          'TRAINER',
        ),
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('Edit & Media Replacement Authorization', () => {
    it('10. Owner trainer can edit details, replace thumbnail, and add YouTube video', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      const updateUseCase = new UpdateExerciseUseCase(mockExerciseRepo);

      const created = await createUseCase.execute(
        {
          name: 'Overhead Press',
          category: 'Shoulders',
          primaryMuscleGroup: PrimaryMuscleGroup.SHOULDERS,
          equipment: EquipmentType.BARBELL,
          difficulty: DifficultyLevel.INTERMEDIATE,
          media: {
            thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/ohp_v1.jpg',
          },
        },
        'trainer_owner',
        'TRAINER',
      );

      const updated = await updateUseCase.execute(
        created.id,
        {
          difficulty: DifficultyLevel.ADVANCED,
          media: {
            thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/ohp_v2_replaced.jpg',
            imageUrls: ['https://res.cloudinary.com/kizunafit/exercises/ohp_extra.jpg'],
            videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
          },
        },
        'trainer_owner',
        'TRAINER',
      );

      expect(updated.difficulty).toBe(DifficultyLevel.ADVANCED);
      expect(updated.media.thumbnailUrl).toBe(
        'https://res.cloudinary.com/kizunafit/exercises/ohp_v2_replaced.jpg',
      );
      expect(updated.media.videoUrl).toBe('https://www.youtube.com/watch?v=2yjwXTZQDDI');
      expect(updated.media.imageUrls).toContain(
        'https://res.cloudinary.com/kizunafit/exercises/ohp_extra.jpg',
      );
    });

    it('11. Another trainer CANNOT edit an exercise owned by a different trainer', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      const updateUseCase = new UpdateExerciseUseCase(mockExerciseRepo);

      const created = await createUseCase.execute(
        {
          name: 'Lateral Raise',
          category: 'Shoulders',
          primaryMuscleGroup: PrimaryMuscleGroup.SHOULDERS,
          equipment: EquipmentType.DUMBBELL,
          difficulty: DifficultyLevel.BEGINNER,
        },
        'trainer_alice',
        'TRAINER',
      );

      await expect(
        updateUseCase.execute(
          created.id,
          { name: 'Hacked Lateral Raise' },
          'trainer_bob',
          'TRAINER',
        ),
      ).rejects.toThrow(UnauthorizedWorkoutActionException);
    });

    it('12. Admin CAN edit a PLATFORM exercise', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      const updateUseCase = new UpdateExerciseUseCase(mockExerciseRepo);

      const platformExercise = await createUseCase.execute(
        {
          name: 'Platform Push Up',
          category: 'Chest',
          primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
          equipment: EquipmentType.BODYWEIGHT,
          difficulty: DifficultyLevel.BEGINNER,
        },
        undefined,
        'ADMIN',
      );

      expect(platformExercise.origin).toBe(ExerciseOrigin.PLATFORM);

      const updated = await updateUseCase.execute(
        platformExercise.id,
        {
          media: {
            thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/pushup_admin.jpg',
          },
        },
        'admin_user',
        'ADMIN',
      );

      expect(updated.media.thumbnailUrl).toBe(
        'https://res.cloudinary.com/kizunafit/exercises/pushup_admin.jpg',
      );
    });
  });

  describe('Historical Snapshot Integrity', () => {
    it('13. Modifying exercise media in catalog does NOT mutate historical WorkoutProgram ExerciseSnapshots', async () => {
      const createUseCase = new CreateExerciseUseCase(mockExerciseRepo);
      const updateUseCase = new UpdateExerciseUseCase(mockExerciseRepo);

      // 1. Create exercise with initial media
      const exerciseDto = await createUseCase.execute(
        {
          name: 'Conventional Deadlift',
          category: 'Back',
          primaryMuscleGroup: PrimaryMuscleGroup.BACK,
          equipment: EquipmentType.BARBELL,
          difficulty: DifficultyLevel.ADVANCED,
          media: {
            thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/deadlift_v1.jpg',
          },
        },
        'trainer_1',
        'TRAINER',
      );

      const exerciseAggregate = (await mockExerciseRepo.findById(exerciseDto.id))!;
      const snapshotV1 = exerciseAggregate.toSnapshot();

      // 2. Prescribe snapshot into a WorkoutProgram
      const program = WorkoutProgram.create({
        coachingRelationshipId: 'rel_history_1',
        trainerId: 'trainer_1',
        clientId: 'client_1',
        version: 1,
        title: 'Strength V1',
        goal: WorkoutGoal.STRENGTH,
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
                title: 'Pull Day',
                exercises: [
                  {
                    id: 'pe_1',
                    exerciseSnapshot: snapshotV1,
                    sets: [
                      { setNumber: 1, plannedReps: '5', targetRpe: 8, restPeriodSeconds: 180 },
                    ],
                    order: 1,
                  },
                ],
              },
            ],
          },
        ],
        status: WorkoutProgramStatus.ACTIVE,
      }).getValue();

      // 3. Later, trainer updates exercise media, name, difficulty in catalog
      await updateUseCase.execute(
        exerciseDto.id,
        {
          name: 'Updated Deadlift Pro',
          difficulty: DifficultyLevel.INTERMEDIATE,
          media: {
            thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/deadlift_v2_new.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
          },
        },
        'trainer_1',
        'TRAINER',
      );

      // 4. Verify that historical WorkoutProgram retains original snapshot
      const historicalExerciseSnapshot = program.weeks[0].days[0].exercises[0].exerciseSnapshot;
      expect(historicalExerciseSnapshot.name).toBe('Conventional Deadlift');
      expect(historicalExerciseSnapshot.difficulty).toBe(DifficultyLevel.ADVANCED);
      expect(historicalExerciseSnapshot.exerciseId).toBe(exerciseDto.id);
    });
  });
});
