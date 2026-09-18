import { GetProgressQueryDto, ProgressAnalyticsDto } from '../dtos/progress-analytics.dto';
import { IProgressWorkoutGateway } from '../ports/IProgressWorkoutGateway';
import { IProgressNutritionGateway } from '../ports/IProgressNutritionGateway';
import { IProgressCoachingGateway } from '../ports/IProgressCoachingGateway';
import { ProgressBucketingService } from '../services/progress-bucketing.service';
import { NotFoundError, ForbiddenError } from '../../../../shared/exceptions/AppError';

export class GetRelationshipProgressUseCase {
  constructor(
    private readonly workoutGateway: IProgressWorkoutGateway,
    private readonly nutritionGateway: IProgressNutritionGateway,
    private readonly coachingGateway: IProgressCoachingGateway,
  ) {}

  async execute(
    relationshipId: string,
    requestingUserId: string,
    query?: GetProgressQueryDto,
  ): Promise<ProgressAnalyticsDto> {
    const relationship = await this.coachingGateway.getRelationshipById(relationshipId);
    if (!relationship) {
      throw new NotFoundError(`Coaching relationship '${relationshipId}' not found.`);
    }

    if (relationship.clientId !== requestingUserId && relationship.trainerId !== requestingUserId) {
      throw new ForbiddenError(
        'You do not have permission to view progress for this coaching relationship.',
      );
    }

    const defaultFrom = query?.fromDate ? query.fromDate : relationship.startDate.toISOString();
    const defaultTo = query?.toDate
      ? query.toDate
      : relationship.endDate
        ? relationship.endDate.toISOString()
        : new Date().toISOString();

    const { fromDate, toDate, granularity } =
      ProgressBucketingService.resolveDateRangeAndGranularity({
        fromDate: defaultFrom,
        toDate: defaultTo,
        granularity: query?.granularity,
      });

    const [workoutRecords, nutritionRecords] = await Promise.all([
      this.workoutGateway.getWorkoutRecordsForRelationship(relationshipId, fromDate, toDate),
      this.nutritionGateway.getNutritionRecordsForRelationship(relationshipId, fromDate, toDate),
    ]);

    const buckets = ProgressBucketingService.generateBuckets(fromDate, toDate, granularity);

    const workoutBuckets = ProgressBucketingService.buildWorkoutBuckets(workoutRecords, buckets);

    const nutritionBuckets = ProgressBucketingService.buildNutritionBuckets(
      nutritionRecords,
      buckets,
    );

    const coachingPeriods = [
      {
        relationshipId: relationship.id,
        trainerId: relationship.trainerId,
        periodStart: relationship.startDate.toISOString(),
        periodEnd: relationship.endDate ? relationship.endDate.toISOString() : null,
        status: relationship.status,
      },
    ];

    return {
      clientId: relationship.clientId,
      relationshipId: relationship.id,
      fromDate: fromDate.toISOString().slice(0, 10),
      toDate: toDate.toISOString().slice(0, 10),
      granularity,
      workout: workoutBuckets,
      nutrition: nutritionBuckets,
      coachingPeriods,
    };
  }
}
