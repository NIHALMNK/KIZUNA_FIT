import { INutritionPlanRepository } from '../../domain/repositories/INutritionPlanRepository';
import { INutritionCompletionRepository } from '../../domain/repositories/INutritionCompletionRepository';

export interface NutritionTransactionalRepositories {
  planRepo: INutritionPlanRepository;
  completionRepo: INutritionCompletionRepository;
}

export interface INutritionUnitOfWork {
  withTransaction<T>(work: (repos: NutritionTransactionalRepositories) => Promise<T>): Promise<T>;
}
