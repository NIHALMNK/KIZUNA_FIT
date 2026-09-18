import {
  IProgressNutritionGateway,
  NutritionRecordSummary,
} from '../../application/ports/IProgressNutritionGateway';
import { INutritionCompletionRepository } from '../../../nutrition/domain/repositories/INutritionCompletionRepository';
import { NutritionCompletion } from '../../../nutrition/domain/aggregates/nutrition-completion.aggregate';

export class ProgressNutritionGateway implements IProgressNutritionGateway {
  constructor(private readonly nutritionCompletionRepository: INutritionCompletionRepository) {}

  async getNutritionRecordsForClient(
    clientId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NutritionRecordSummary[]> {
    const records = await this.nutritionCompletionRepository.findByClientIdInRange(
      clientId,
      fromDate,
      toDate,
    );

    return records.map((r) => this.mapToSummary(r));
  }

  async getNutritionRecordsForRelationship(
    relationshipId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NutritionRecordSummary[]> {
    const records = await this.nutritionCompletionRepository.findByRelationshipIdInRange(
      relationshipId,
      fromDate,
      toDate,
    );

    return records.map((r) => this.mapToSummary(r));
  }

  private mapToSummary(r: NutritionCompletion): NutritionRecordSummary {
    const prescribedCount = r.nutritionDaySnapshot?.meals?.length ?? 0;
    const completedCount = r.mealCompletions?.filter((m) => m.isCompleted).length ?? 0;

    return {
      id: r.id,
      clientId: r.clientId,
      coachingRelationshipId: r.coachingRelationshipId,
      completionDate: r.completionDate,
      status: r.status,
      mealsPrescribedCount: prescribedCount,
      mealsCompletedCount: completedCount,
      totalCalories: r.macroSummary?.totalCalories ?? null,
      hydrationLoggedMl: r.hydrationSummary?.loggedMl ?? null,
    };
  }
}
