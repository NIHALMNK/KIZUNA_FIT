import { GetProgressQueryDto, ProgressAnalyticsDto } from '../dtos/progress-analytics.dto';
import { IProgressWorkoutGateway } from '../ports/IProgressWorkoutGateway';
import { IProgressNutritionGateway } from '../ports/IProgressNutritionGateway';
import { IProgressCoachingGateway } from '../ports/IProgressCoachingGateway';
import { ProgressBucketingService } from '../services/progress-bucketing.service';

export class GetClientOverallProgressUseCase {
  constructor(
    private readonly workoutGateway: IProgressWorkoutGateway,
    private readonly nutritionGateway: IProgressNutritionGateway,
    private readonly coachingGateway: IProgressCoachingGateway,
  ) {}

  async execute(clientId: string, query?: GetProgressQueryDto): Promise<ProgressAnalyticsDto> {
    const { fromDate, toDate, granularity } =
      ProgressBucketingService.resolveDateRangeAndGranularity(query);

    const [relationships, workoutRecords, nutritionRecords] = await Promise.all([
      this.coachingGateway.getClientRelationships(clientId),
      this.workoutGateway.getWorkoutRecordsForClient(clientId, fromDate, toDate),
      this.nutritionGateway.getNutritionRecordsForClient(clientId, fromDate, toDate),
    ]);

    const buckets = ProgressBucketingService.generateBuckets(fromDate, toDate, granularity);

    const workoutBuckets = ProgressBucketingService.buildWorkoutBuckets(workoutRecords, buckets);

    const nutritionBuckets = ProgressBucketingService.buildNutritionBuckets(
      nutritionRecords,
      buckets,
    );

    const coachingPeriods = relationships.map((rel) => ({
      relationshipId: rel.id,
      trainerId: rel.trainerId,
      periodStart: rel.startDate.toISOString(),
      periodEnd: rel.endDate ? rel.endDate.toISOString() : null,
      status: rel.status,
    }));

    return {
      clientId,
      relationshipId: null,
      fromDate: fromDate.toISOString().slice(0, 10),
      toDate: toDate.toISOString().slice(0, 10),
      granularity,
      workout: workoutBuckets,
      nutrition: nutritionBuckets,
      coachingPeriods,
    };
  }
}
