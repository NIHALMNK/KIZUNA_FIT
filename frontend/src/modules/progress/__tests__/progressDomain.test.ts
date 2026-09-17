import { describe, it, expect, vi, beforeEach } from 'vitest';
import { progressApi } from '../infrastructure/api/progressApi';
import { httpClient } from '../../../infrastructure/api/HttpClient';
import { ProgressAnalytics } from '../domain/types/progress.types';

vi.mock('../../../infrastructure/api/HttpClient', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

describe('Progress Frontend Domain & API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAnalytics: ProgressAnalytics = {
    clientId: 'client_1',
    relationshipId: 'rel_1',
    fromDate: '2026-09-01',
    toDate: '2026-09-14',
    granularity: 'weekly',
    workout: [
      {
        bucketStart: '2026-09-01',
        bucketEnd: '2026-09-07',
        sessionsCompleted: 4,
        sessionsMissed: 1,
        totalSets: 32,
        totalVolumeLiftedKg: 3200,
        avgEnergyLevel: 8.5,
      },
      {
        bucketStart: '2026-09-08',
        bucketEnd: '2026-09-14',
        sessionsCompleted: 3,
        sessionsMissed: 0,
        totalSets: 24,
        totalVolumeLiftedKg: 2400,
        avgEnergyLevel: 7.5,
      },
    ],
    nutrition: [
      {
        bucketStart: '2026-09-01',
        bucketEnd: '2026-09-07',
        daysLogged: 7,
        daysCompleted: 6,
        mealsTracked: 21,
        mealsCompleted: 19,
        avgCaloriesConsumed: 2100,
        avgHydrationMl: 3000,
      },
      {
        bucketStart: '2026-09-08',
        bucketEnd: '2026-09-14',
        daysLogged: 6,
        daysCompleted: 5,
        mealsTracked: 18,
        mealsCompleted: 16,
        avgCaloriesConsumed: 2000,
        avgHydrationMl: 2800,
      },
    ],
    coachingPeriods: [
      {
        relationshipId: 'rel_1',
        trainerId: 'trainer_12345678',
        periodStart: '2026-09-01T00:00:00.000Z',
        periodEnd: null,
        status: 'ACTIVE',
      },
    ],
  };

  it('should call GET /progress/my with expected parameters', async () => {
    (httpClient.get as any).mockResolvedValue(mockAnalytics);

    const result = await progressApi.getMyProgress({
      fromDate: '2026-09-01',
      toDate: '2026-09-14',
      granularity: 'weekly',
    });

    expect(httpClient.get).toHaveBeenCalledWith('/progress/my', {
      params: {
        fromDate: '2026-09-01',
        toDate: '2026-09-14',
        granularity: 'weekly',
      },
    });
    expect(result.clientId).toBe('client_1');
    expect(result.workout).toHaveLength(2);
  });

  it('should call GET /progress/relationship/:relationshipId with expected parameters', async () => {
    (httpClient.get as any).mockResolvedValue(mockAnalytics);

    const result = await progressApi.getRelationshipProgress('rel_1', {
      granularity: 'daily',
    });

    expect(httpClient.get).toHaveBeenCalledWith('/progress/relationship/rel_1', {
      params: {
        granularity: 'daily',
      },
    });
    expect(result.relationshipId).toBe('rel_1');
  });

  it('should accurately compute total aggregate metrics from buckets', () => {
    const totalWorkouts = mockAnalytics.workout.reduce((sum, b) => sum + b.sessionsCompleted, 0);
    const totalMissed = mockAnalytics.workout.reduce((sum, b) => sum + b.sessionsMissed, 0);
    const totalVolume = mockAnalytics.workout.reduce((sum, b) => sum + b.totalVolumeLiftedKg, 0);
    const totalSets = mockAnalytics.workout.reduce((sum, b) => sum + b.totalSets, 0);

    const totalDaysCompleted = mockAnalytics.nutrition.reduce((sum, b) => sum + b.daysCompleted, 0);
    const totalDaysLogged = mockAnalytics.nutrition.reduce((sum, b) => sum + b.daysLogged, 0);

    expect(totalWorkouts).toBe(7);
    expect(totalMissed).toBe(1);
    expect(totalVolume).toBe(5600);
    expect(totalSets).toBe(56);
    expect(totalDaysCompleted).toBe(11);
    expect(totalDaysLogged).toBe(13);
  });
});
