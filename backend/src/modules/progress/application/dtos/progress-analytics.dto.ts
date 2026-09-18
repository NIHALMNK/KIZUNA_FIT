export type ProgressGranularity = 'daily' | 'weekly' | 'monthly';

export interface GetProgressQueryDto {
  fromDate?: string;
  toDate?: string;
  granularity?: ProgressGranularity;
}

export interface WorkoutProgressBucketDto {
  bucketStart: string;
  bucketEnd: string;
  sessionsCompleted: number;
  sessionsMissed: number;
  totalSets: number;
  totalVolumeLiftedKg: number;
  avgEnergyLevel: number | null;
}

export interface NutritionProgressBucketDto {
  bucketStart: string;
  bucketEnd: string;
  daysLogged: number;
  daysCompleted: number;
  mealsTracked: number;
  mealsCompleted: number;
  avgCaloriesConsumed: number | null;
  avgHydrationMl: number | null;
}

export interface CoachingPeriodDto {
  relationshipId: string;
  trainerId: string;
  periodStart: string;
  periodEnd: string | null;
  status: string;
}

export interface ProgressAnalyticsDto {
  clientId: string;
  relationshipId?: string | null;
  fromDate: string;
  toDate: string;
  granularity: ProgressGranularity;
  workout: WorkoutProgressBucketDto[];
  nutrition: NutritionProgressBucketDto[];
  coachingPeriods?: CoachingPeriodDto[];
}
