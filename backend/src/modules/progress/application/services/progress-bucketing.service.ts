import {
  GetProgressQueryDto,
  NutritionProgressBucketDto,
  ProgressGranularity,
  WorkoutProgressBucketDto,
} from '../dtos/progress-analytics.dto';
import { WorkoutRecordSummary } from '../ports/IProgressWorkoutGateway';
import { NutritionRecordSummary } from '../ports/IProgressNutritionGateway';

export interface DateBucket {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
}

export class ProgressBucketingService {
  public static resolveDateRangeAndGranularity(query?: GetProgressQueryDto): {
    fromDate: Date;
    toDate: Date;
    granularity: ProgressGranularity;
  } {
    let toDate: Date;
    if (query?.toDate) {
      toDate = new Date(query.toDate);
      if (isNaN(toDate.getTime())) {
        toDate = new Date();
      }
    } else {
      toDate = new Date();
    }
    // Set to end of the day UTC
    toDate = new Date(
      Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth(), toDate.getUTCDate(), 23, 59, 59, 999),
    );

    let fromDate: Date;
    if (query?.fromDate) {
      fromDate = new Date(query.fromDate);
      if (isNaN(fromDate.getTime())) {
        fromDate = new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    } else {
      fromDate = new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    // Set to start of the day UTC
    fromDate = new Date(
      Date.UTC(
        fromDate.getUTCFullYear(),
        fromDate.getUTCMonth(),
        fromDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    if (fromDate > toDate) {
      const temp = fromDate;
      fromDate = toDate;
      toDate = temp;
    }

    let granularity: ProgressGranularity;
    if (query?.granularity && ['daily', 'weekly', 'monthly'].includes(query.granularity)) {
      granularity = query.granularity;
    } else {
      const diffDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 14) {
        granularity = 'daily';
      } else if (diffDays <= 90) {
        granularity = 'weekly';
      } else {
        granularity = 'monthly';
      }
    }

    return { fromDate, toDate, granularity };
  }

  public static generateBuckets(
    fromDate: Date,
    toDate: Date,
    granularity: ProgressGranularity,
  ): DateBucket[] {
    const buckets: DateBucket[] = [];
    const current = new Date(fromDate.getTime());

    if (granularity === 'daily') {
      while (current <= toDate) {
        const start = new Date(
          Date.UTC(
            current.getUTCFullYear(),
            current.getUTCMonth(),
            current.getUTCDate(),
            0,
            0,
            0,
            0,
          ),
        );
        const end = new Date(
          Date.UTC(
            current.getUTCFullYear(),
            current.getUTCMonth(),
            current.getUTCDate(),
            23,
            59,
            59,
            999,
          ),
        );
        buckets.push({
          start,
          end,
          startStr: start.toISOString().slice(0, 10),
          endStr: end.toISOString().slice(0, 10),
        });
        current.setUTCDate(current.getUTCDate() + 1);
      }
    } else if (granularity === 'weekly') {
      while (current <= toDate) {
        const start = new Date(current.getTime());
        const endDay = new Date(current.getTime() + 6 * 24 * 60 * 60 * 1000);
        const end = new Date(
          Date.UTC(
            endDay.getUTCFullYear(),
            endDay.getUTCMonth(),
            endDay.getUTCDate(),
            23,
            59,
            59,
            999,
          ),
        );
        const actualEnd = end > toDate ? toDate : end;
        buckets.push({
          start,
          end: actualEnd,
          startStr: start.toISOString().slice(0, 10),
          endStr: actualEnd.toISOString().slice(0, 10),
        });
        current.setUTCDate(current.getUTCDate() + 7);
      }
    } else {
      // monthly
      while (current <= toDate) {
        const year = current.getUTCFullYear();
        const month = current.getUTCMonth();
        const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
        const effectiveStart = start < fromDate ? fromDate : start;

        // Last day of month
        const nextMonth = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
        const lastDayOfMonth = new Date(nextMonth.getTime() - 1);
        const effectiveEnd = lastDayOfMonth > toDate ? toDate : lastDayOfMonth;

        buckets.push({
          start: effectiveStart,
          end: effectiveEnd,
          startStr: effectiveStart.toISOString().slice(0, 10),
          endStr: effectiveEnd.toISOString().slice(0, 10),
        });

        // Advance to first day of next month
        current.setUTCMonth(current.getUTCMonth() + 1);
        current.setUTCDate(1);
        current.setUTCHours(0, 0, 0, 0);
      }
    }

    return buckets;
  }

  public static buildWorkoutBuckets(
    records: WorkoutRecordSummary[],
    buckets: DateBucket[],
  ): WorkoutProgressBucketDto[] {
    const result: WorkoutProgressBucketDto[] = [];

    for (const bucket of buckets) {
      const bucketRecords = records.filter((r) => {
        const t = new Date(r.recordDate).getTime();
        return t >= bucket.start.getTime() && t <= bucket.end.getTime();
      });

      // Strictly only generate bucket point if actual WorkoutCompletion records exist
      if (bucketRecords.length === 0) {
        continue;
      }

      let sessionsCompleted = 0;
      let sessionsMissed = 0;
      let totalSets = 0;
      let totalVolumeLiftedKg = 0;
      const energyLevels: number[] = [];

      for (const rec of bucketRecords) {
        if (rec.status === 'COMPLETED') {
          sessionsCompleted++;
          totalSets += rec.completedSetsCount;
          totalVolumeLiftedKg += rec.totalVolumeKg;
          if (rec.energyLevel !== null && rec.energyLevel !== undefined) {
            energyLevels.push(rec.energyLevel);
          }
        } else if (rec.status === 'MISSED') {
          sessionsMissed++;
        }
      }

      const avgEnergyLevel =
        energyLevels.length > 0
          ? Math.round((energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length) * 10) / 10
          : null;

      result.push({
        bucketStart: bucket.startStr,
        bucketEnd: bucket.endStr,
        sessionsCompleted,
        sessionsMissed,
        totalSets,
        totalVolumeLiftedKg: Math.round(totalVolumeLiftedKg * 10) / 10,
        avgEnergyLevel,
      });
    }

    return result;
  }

  public static buildNutritionBuckets(
    records: NutritionRecordSummary[],
    buckets: DateBucket[],
  ): NutritionProgressBucketDto[] {
    const result: NutritionProgressBucketDto[] = [];

    for (const bucket of buckets) {
      const bucketRecords = records.filter((r) => {
        const t = new Date(r.completionDate).getTime();
        return t >= bucket.start.getTime() && t <= bucket.end.getTime();
      });

      // Strictly only generate bucket point if actual NutritionCompletion records exist
      if (bucketRecords.length === 0) {
        continue;
      }

      let daysLogged = 0;
      let daysCompleted = 0;
      let mealsTracked = 0;
      let mealsCompleted = 0;
      const caloriesList: number[] = [];
      const hydrationList: number[] = [];

      for (const rec of bucketRecords) {
        if (rec.status === 'COMPLETED' || rec.status === 'IN_PROGRESS') {
          daysLogged++;
        }
        if (rec.status === 'COMPLETED') {
          daysCompleted++;
        }
        mealsTracked += rec.mealsPrescribedCount;
        mealsCompleted += rec.mealsCompletedCount;

        if (
          rec.totalCalories !== null &&
          rec.totalCalories !== undefined &&
          rec.totalCalories > 0
        ) {
          caloriesList.push(rec.totalCalories);
        }
        if (
          rec.hydrationLoggedMl !== null &&
          rec.hydrationLoggedMl !== undefined &&
          rec.hydrationLoggedMl > 0
        ) {
          hydrationList.push(rec.hydrationLoggedMl);
        }
      }

      const avgCaloriesConsumed =
        caloriesList.length > 0
          ? Math.round(caloriesList.reduce((a, b) => a + b, 0) / caloriesList.length)
          : null;

      const avgHydrationMl =
        hydrationList.length > 0
          ? Math.round(hydrationList.reduce((a, b) => a + b, 0) / hydrationList.length)
          : null;

      result.push({
        bucketStart: bucket.startStr,
        bucketEnd: bucket.endStr,
        daysLogged,
        daysCompleted,
        mealsTracked,
        mealsCompleted,
        avgCaloriesConsumed,
        avgHydrationMl,
      });
    }

    return result;
  }
}
