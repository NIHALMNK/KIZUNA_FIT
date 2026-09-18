import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProgressBucketingService } from '../../../src/modules/progress/application/services/progress-bucketing.service';
import { GetClientOverallProgressUseCase } from '../../../src/modules/progress/application/use-cases/get-client-overall-progress.use-case';
import { GetRelationshipProgressUseCase } from '../../../src/modules/progress/application/use-cases/get-relationship-progress.use-case';
import { ProgressController } from '../../../src/modules/progress/presentation/controllers/progress.controller';
import {
  IProgressWorkoutGateway,
  WorkoutRecordSummary,
} from '../../../src/modules/progress/application/ports/IProgressWorkoutGateway';
import {
  IProgressNutritionGateway,
  NutritionRecordSummary,
} from '../../../src/modules/progress/application/ports/IProgressNutritionGateway';
import {
  IProgressCoachingGateway,
  CoachingRelationshipSummary,
} from '../../../src/modules/progress/application/ports/IProgressCoachingGateway';
import { ForbiddenError, NotFoundError } from '../../../src/shared/exceptions/AppError';

describe('Progress Domain V1 - Unit Tests', () => {
  describe('ProgressBucketingService', () => {
    it('should resolve adaptive granularity: daily for <= 14 days', () => {
      const result = ProgressBucketingService.resolveDateRangeAndGranularity({
        fromDate: '2026-09-01',
        toDate: '2026-09-10',
      });
      expect(result.granularity).toBe('daily');
    });

    it('should resolve adaptive granularity: weekly for 15 to 90 days', () => {
      const result = ProgressBucketingService.resolveDateRangeAndGranularity({
        fromDate: '2026-08-01',
        toDate: '2026-09-15',
      });
      expect(result.granularity).toBe('weekly');
    });

    it('should resolve adaptive granularity: monthly for > 90 days', () => {
      const result = ProgressBucketingService.resolveDateRangeAndGranularity({
        fromDate: '2026-01-01',
        toDate: '2026-06-01',
      });
      expect(result.granularity).toBe('monthly');
    });

    it('should respect explicitly requested granularity', () => {
      const result = ProgressBucketingService.resolveDateRangeAndGranularity({
        fromDate: '2026-01-01',
        toDate: '2026-06-01',
        granularity: 'daily',
      });
      expect(result.granularity).toBe('daily');
    });

    it('should calculate workout metrics accurately in buckets', () => {
      const buckets = ProgressBucketingService.generateBuckets(
        new Date('2026-09-01T00:00:00Z'),
        new Date('2026-09-03T23:59:59Z'),
        'daily',
      );

      const records: WorkoutRecordSummary[] = [
        {
          id: 'w1',
          clientId: 'c1',
          coachingRelationshipId: 'r1',
          recordDate: new Date('2026-09-01T10:00:00Z'),
          status: 'COMPLETED',
          completedSetsCount: 12,
          totalVolumeKg: 1500,
          energyLevel: 8,
        },
        {
          id: 'w2',
          clientId: 'c1',
          coachingRelationshipId: 'r1',
          recordDate: new Date('2026-09-01T18:00:00Z'),
          status: 'COMPLETED',
          completedSetsCount: 8,
          totalVolumeKg: 1000,
          energyLevel: 6,
        },
        {
          id: 'w3',
          clientId: 'c1',
          coachingRelationshipId: 'r1',
          recordDate: new Date('2026-09-02T10:00:00Z'),
          status: 'MISSED',
          completedSetsCount: 0,
          totalVolumeKg: 0,
          energyLevel: null,
        },
      ];

      const result = ProgressBucketingService.buildWorkoutBuckets(records, buckets);

      expect(result).toHaveLength(2);
      // Day 1: 2 completed sessions, 20 sets, 2500kg, avg energy 7
      expect(result[0].sessionsCompleted).toBe(2);
      expect(result[0].sessionsMissed).toBe(0);
      expect(result[0].totalSets).toBe(20);
      expect(result[0].totalVolumeLiftedKg).toBe(2500);
      expect(result[0].avgEnergyLevel).toBe(7);

      // Day 2: 1 missed session
      expect(result[1].sessionsCompleted).toBe(0);
      expect(result[1].sessionsMissed).toBe(1);
      expect(result[1].avgEnergyLevel).toBeNull();
    });

    it('should calculate nutrition metrics and averages accurately in buckets', () => {
      const buckets = ProgressBucketingService.generateBuckets(
        new Date('2026-09-01T00:00:00Z'),
        new Date('2026-09-02T23:59:59Z'),
        'daily',
      );

      const records: NutritionRecordSummary[] = [
        {
          id: 'n1',
          clientId: 'c1',
          coachingRelationshipId: 'r1',
          completionDate: new Date('2026-09-01T12:00:00Z'),
          status: 'COMPLETED',
          mealsPrescribedCount: 4,
          mealsCompletedCount: 4,
          totalCalories: 2200,
          hydrationLoggedMl: 3000,
        },
        {
          id: 'n2',
          clientId: 'c1',
          coachingRelationshipId: 'r1',
          completionDate: new Date('2026-09-02T12:00:00Z'),
          status: 'IN_PROGRESS',
          mealsPrescribedCount: 4,
          mealsCompletedCount: 2,
          totalCalories: 1000,
          hydrationLoggedMl: 1500,
        },
      ];

      const result = ProgressBucketingService.buildNutritionBuckets(records, buckets);

      expect(result).toHaveLength(2);
      expect(result[0].daysCompleted).toBe(1);
      expect(result[0].daysLogged).toBe(1);
      expect(result[0].mealsCompleted).toBe(4);
      expect(result[0].avgCaloriesConsumed).toBe(2200);
      expect(result[0].avgHydrationMl).toBe(3000);

      expect(result[1].daysCompleted).toBe(0);
      expect(result[1].daysLogged).toBe(1);
      expect(result[1].mealsCompleted).toBe(2);
      expect(result[1].avgCaloriesConsumed).toBe(1000);
      expect(result[1].avgHydrationMl).toBe(1500);
    });
  });

  describe('GetClientOverallProgressUseCase', () => {
    let workoutGateway: IProgressWorkoutGateway;
    let nutritionGateway: IProgressNutritionGateway;
    let coachingGateway: IProgressCoachingGateway;
    let useCase: GetClientOverallProgressUseCase;

    beforeEach(() => {
      workoutGateway = {
        getWorkoutRecordsForClient: vi.fn().mockResolvedValue([]),
        getWorkoutRecordsForRelationship: vi.fn().mockResolvedValue([]),
      };
      nutritionGateway = {
        getNutritionRecordsForClient: vi.fn().mockResolvedValue([]),
        getNutritionRecordsForRelationship: vi.fn().mockResolvedValue([]),
      };
      coachingGateway = {
        getClientRelationships: vi.fn().mockResolvedValue([
          {
            id: 'rel_1',
            clientId: 'client_1',
            trainerId: 'trainer_1',
            status: 'COMPLETED',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-03-31'),
          },
          {
            id: 'rel_2',
            clientId: 'client_1',
            trainerId: 'trainer_2',
            status: 'ACTIVE',
            startDate: new Date('2026-04-01'),
            endDate: null,
          },
        ]),
        getRelationshipById: vi.fn(),
      };

      useCase = new GetClientOverallProgressUseCase(
        workoutGateway,
        nutritionGateway,
        coachingGateway,
      );
    });

    it('should aggregate progress across coaching periods and return coaching period markers', async () => {
      const result = await useCase.execute('client_1', {
        fromDate: '2026-09-01',
        toDate: '2026-09-07',
        granularity: 'daily',
      });

      expect(result.clientId).toBe('client_1');
      expect(result.coachingPeriods).toHaveLength(2);
      expect(result.coachingPeriods![0].trainerId).toBe('trainer_1');
      expect(result.coachingPeriods![1].trainerId).toBe('trainer_2');
      expect(workoutGateway.getWorkoutRecordsForClient).toHaveBeenCalled();
      expect(nutritionGateway.getNutritionRecordsForClient).toHaveBeenCalled();
    });
  });

  describe('GetRelationshipProgressUseCase', () => {
    let workoutGateway: IProgressWorkoutGateway;
    let nutritionGateway: IProgressNutritionGateway;
    let coachingGateway: IProgressCoachingGateway;
    let useCase: GetRelationshipProgressUseCase;

    const mockRelationship: CoachingRelationshipSummary = {
      id: 'rel_100',
      clientId: 'client_100',
      trainerId: 'trainer_100',
      status: 'ACTIVE',
      startDate: new Date('2026-08-01'),
      endDate: null,
    };

    beforeEach(() => {
      workoutGateway = {
        getWorkoutRecordsForClient: vi.fn(),
        getWorkoutRecordsForRelationship: vi.fn().mockResolvedValue([]),
      };
      nutritionGateway = {
        getNutritionRecordsForClient: vi.fn(),
        getNutritionRecordsForRelationship: vi.fn().mockResolvedValue([]),
      };
      coachingGateway = {
        getClientRelationships: vi.fn(),
        getRelationshipById: vi.fn().mockImplementation((id: string) => {
          if (id === 'rel_100') return Promise.resolve(mockRelationship);
          return Promise.resolve(null);
        }),
      };

      useCase = new GetRelationshipProgressUseCase(
        workoutGateway,
        nutritionGateway,
        coachingGateway,
      );
    });

    it('should throw NotFoundError if relationship does not exist', async () => {
      await expect(useCase.execute('rel_nonexistent', 'client_100')).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError if requesting user is neither client nor trainer', async () => {
      await expect(useCase.execute('rel_100', 'random_user_403')).rejects.toThrow(ForbiddenError);
    });

    it('should allow the client of the relationship to access analytics', async () => {
      const result = await useCase.execute('rel_100', 'client_100');
      expect(result.relationshipId).toBe('rel_100');
      expect(result.clientId).toBe('client_100');
      expect(workoutGateway.getWorkoutRecordsForRelationship).toHaveBeenCalledWith(
        'rel_100',
        expect.any(Date),
        expect.any(Date),
      );
    });

    it('should allow the trainer of the relationship to access analytics', async () => {
      const result = await useCase.execute('rel_100', 'trainer_100');
      expect(result.relationshipId).toBe('rel_100');
      expect(result.clientId).toBe('client_100');
    });
  });

  describe('ProgressController', () => {
    let mockGetClientProgressUseCase: any;
    let mockGetRelationshipProgressUseCase: any;
    let controller: ProgressController;
    let mockRes: any;

    beforeEach(() => {
      mockGetClientProgressUseCase = {
        execute: vi.fn().mockResolvedValue({
          clientId: 'client_1',
          workout: [],
          nutrition: [],
        }),
      };
      mockGetRelationshipProgressUseCase = {
        execute: vi.fn().mockResolvedValue({
          relationshipId: 'rel_1',
          workout: [],
          nutrition: [],
        }),
      };

      controller = new ProgressController(
        mockGetClientProgressUseCase,
        mockGetRelationshipProgressUseCase,
      );

      mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
    });

    it('should handle getMyProgress for authenticated client', async () => {
      const req: any = {
        auth: { userId: 'client_1', role: 'CLIENT' },
        query: { granularity: 'weekly' },
      };

      await controller.getMyProgress(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockGetClientProgressUseCase.execute).toHaveBeenCalledWith('client_1', {
        fromDate: undefined,
        toDate: undefined,
        granularity: 'weekly',
      });
    });

    it('should handle 403 ForbiddenError correctly', async () => {
      mockGetRelationshipProgressUseCase.execute.mockRejectedValue(new ForbiddenError('Forbidden'));

      const req: any = {
        auth: { userId: 'intruder', role: 'TRAINER' },
        params: { relationshipId: 'rel_1' },
        query: {},
      };

      await controller.getRelationshipProgress(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });
});
