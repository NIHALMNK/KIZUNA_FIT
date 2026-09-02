import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exerciseApi } from '../../infrastructure/api/exerciseApi';
import { workoutProgramApi } from '../../infrastructure/api/workoutProgramApi';
import { workoutCompletionApi } from '../../infrastructure/api/workoutCompletionApi';
import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  ExerciseStatus,
  PrimaryMuscleGroup,
  EquipmentType,
  DifficultyLevel,
} from '../../domain/types/workout.types';

vi.mock('../../../../infrastructure/api/HttpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Workout API Adapters Response Unwrapping Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exerciseApi', () => {
    const sampleExercise = {
      id: 'ex_deadlift_1',
      name: 'Conventional Barbell Deadlift',
      slug: 'conventional-barbell-deadlift',
      category: 'Back',
      primaryMuscleGroup: PrimaryMuscleGroup.BACK,
      secondaryMuscleGroups: [PrimaryMuscleGroup.LEGS, PrimaryMuscleGroup.GLUTES],
      equipment: EquipmentType.BARBELL,
      difficulty: DifficultyLevel.ADVANCED,
      instructions: [{ step: 1, instruction: 'Grip bar and lift.' }],
      media: { images: [] },
      caloriesPerMinute: 9,
      status: ExerciseStatus.ACTIVE,
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    };

    it('correctly maps unwrapped array from httpClient.get in list()', async () => {
      // HttpClient returns unwrapped array directly
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue([sampleExercise]);

      const result = await exerciseApi.list({ status: ExerciseStatus.ACTIVE, search: 'dead' });

      expect(httpClient.get).toHaveBeenCalledWith('/exercises', {
        params: { status: ExerciseStatus.ACTIVE, search: 'dead' },
      });
      expect(result.exercises).toHaveLength(1);
      expect(result.exercises[0].name).toBe('Conventional Barbell Deadlift');
      expect(result.total).toBe(1);
    });

    it('correctly handles empty array in list()', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const result = await exerciseApi.list();

      expect(result.exercises).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('correctly returns exercise entity from getById(), create(), update(), deprecate()', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(sampleExercise);
      const getRes = await exerciseApi.getById('ex_deadlift_1');
      expect(getRes.id).toBe('ex_deadlift_1');

      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(sampleExercise);
      const createRes = await exerciseApi.create({ name: 'New Exercise' });
      expect(createRes.id).toBe('ex_deadlift_1');

      (httpClient.patch as ReturnType<typeof vi.fn>).mockResolvedValue(sampleExercise);
      const updateRes = await exerciseApi.update('ex_deadlift_1', { name: 'Updated Exercise' });
      expect(updateRes.id).toBe('ex_deadlift_1');

      (httpClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue(sampleExercise);
      const deleteRes = await exerciseApi.deprecate('ex_deadlift_1');
      expect(deleteRes.id).toBe('ex_deadlift_1');
    });

    it('correctly requests report and returns confirmation payload', async () => {
      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
        reportId: 'rep_123',
        message: 'Exercise report submitted successfully.',
      });

      const res = await exerciseApi.report('ex_deadlift_1', { reason: 'Incorrect difficulty' });
      expect(httpClient.post).toHaveBeenCalledWith('/exercises/ex_deadlift_1/report', {
        reason: 'Incorrect difficulty',
      });
      expect(res.reportId).toBe('rep_123');
    });
  });

  describe('workoutProgramApi', () => {
    const sampleProgram = {
      id: 'prog_123',
      title: 'Hypertrophy Block A',
      status: 'ACTIVE',
      version: 1,
    };

    it('correctly maps unwrapped array in list()', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue([sampleProgram]);

      const result = await workoutProgramApi.list();

      expect(result.programs).toHaveLength(1);
      expect(result.programs[0].id).toBe('prog_123');
      expect(result.total).toBe(1);
    });

    it('correctly returns assigned program object from getAssigned()', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(sampleProgram);

      const result = await workoutProgramApi.getAssigned('cr_123');

      expect(httpClient.get).toHaveBeenCalledWith('/workout-programs/assigned', {
        params: { coachingRelationshipId: 'cr_123' },
      });
      expect(result?.id).toBe('prog_123');
    });

    it('correctly fetches or creates draft for editing via getOrCreateDraft()', async () => {
      const draftProgram = {
        id: 'prog_draft_2',
        title: 'Hypertrophy Block A (v2)',
        status: 'DRAFT',
        version: 2,
      };
      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(draftProgram);

      const result = await workoutProgramApi.getOrCreateDraft('cr_123');
      expect(httpClient.post).toHaveBeenCalledWith(
        '/workout-programs/relationship/cr_123/edit-draft',
      );
      expect(result.id).toBe('prog_draft_2');
      expect(result.version).toBe(2);
      expect(result.status).toBe('DRAFT');
    });
  });

  describe('workoutCompletionApi', () => {
    const sampleCompletion = {
      id: 'comp_123',
      clientId: 'usr_client_1',
      status: 'COMPLETED',
    };

    it('correctly maps unwrapped array in list()', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue([sampleCompletion]);

      const result = await workoutCompletionApi.list();

      expect(result.completions).toHaveLength(1);
      expect(result.completions[0].id).toBe('comp_123');
      expect(result.total).toBe(1);
    });
  });
});
