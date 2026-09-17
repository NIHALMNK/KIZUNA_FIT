export type ProgressGranularity = 'daily' | 'weekly' | 'monthly';

export interface ProgressQueryParams {
  fromDate?: string;
  toDate?: string;
  granularity?: ProgressGranularity;
}

export interface WorkoutProgressBucket {
  bucketStart: string;
  bucketEnd: string;
  sessionsCompleted: number;
  sessionsMissed: number;
  totalSets: number;
  totalVolumeLiftedKg: number;
  avgEnergyLevel: number | null;
}

export interface NutritionProgressBucket {
  bucketStart: string;
  bucketEnd: string;
  daysLogged: number;
  daysCompleted: number;
  mealsTracked: number;
  mealsCompleted: number;
  avgCaloriesConsumed: number | null;
  avgHydrationMl: number | null;
}

export interface CoachingPeriod {
  relationshipId: string;
  trainerId: string;
  periodStart: string;
  periodEnd: string | null;
  status: string;
}

export interface ProgressAnalytics {
  clientId: string;
  relationshipId?: string | null;
  fromDate: string;
  toDate: string;
  granularity: ProgressGranularity;
  workout: WorkoutProgressBucket[];
  nutrition: NutritionProgressBucket[];
  coachingPeriods?: CoachingPeriod[];
}
