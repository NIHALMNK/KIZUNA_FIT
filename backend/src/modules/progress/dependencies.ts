import { AwilixContainer, asFunction } from 'awilix';
import { ICoachingRelationshipRepository } from '../coaching/application/ports/coaching-relationship.repository.interface';
import { IWorkoutCompletionRepository } from '../workout/domain/repositories/workout-completion.repository.interface';
import { INutritionCompletionRepository } from '../nutrition/domain/repositories/INutritionCompletionRepository';
import { IProgressCoachingGateway } from './application/ports/IProgressCoachingGateway';
import { IProgressWorkoutGateway } from './application/ports/IProgressWorkoutGateway';
import { IProgressNutritionGateway } from './application/ports/IProgressNutritionGateway';
import { ProgressCoachingGateway } from './infrastructure/gateways/progress-coaching.gateway';
import { ProgressWorkoutGateway } from './infrastructure/gateways/progress-workout.gateway';
import { ProgressNutritionGateway } from './infrastructure/gateways/progress-nutrition.gateway';
import { GetClientOverallProgressUseCase } from './application/use-cases/get-client-overall-progress.use-case';
import { GetRelationshipProgressUseCase } from './application/use-cases/get-relationship-progress.use-case';
import { ProgressController } from './presentation/controllers/progress.controller';

export const registerProgressDependencies = (container: AwilixContainer): void => {
  container.register({
    // Gateways
    progressCoachingGateway: asFunction(
      (coachingRelationshipRepository: ICoachingRelationshipRepository) =>
        new ProgressCoachingGateway(coachingRelationshipRepository),
    ).scoped(),

    progressWorkoutGateway: asFunction(
      (workoutCompletionRepository: IWorkoutCompletionRepository) =>
        new ProgressWorkoutGateway(workoutCompletionRepository),
    ).scoped(),

    progressNutritionGateway: asFunction(
      (nutritionCompletionRepository: INutritionCompletionRepository) =>
        new ProgressNutritionGateway(nutritionCompletionRepository),
    ).scoped(),

    // Use Cases
    getClientOverallProgressUseCase: asFunction(
      (
        progressWorkoutGateway: IProgressWorkoutGateway,
        progressNutritionGateway: IProgressNutritionGateway,
        progressCoachingGateway: IProgressCoachingGateway,
      ) =>
        new GetClientOverallProgressUseCase(
          progressWorkoutGateway,
          progressNutritionGateway,
          progressCoachingGateway,
        ),
    ).scoped(),

    getRelationshipProgressUseCase: asFunction(
      (
        progressWorkoutGateway: IProgressWorkoutGateway,
        progressNutritionGateway: IProgressNutritionGateway,
        progressCoachingGateway: IProgressCoachingGateway,
      ) =>
        new GetRelationshipProgressUseCase(
          progressWorkoutGateway,
          progressNutritionGateway,
          progressCoachingGateway,
        ),
    ).scoped(),

    // Controller
    progressController: asFunction(
      (
        getClientOverallProgressUseCase: GetClientOverallProgressUseCase,
        getRelationshipProgressUseCase: GetRelationshipProgressUseCase,
      ) => new ProgressController(getClientOverallProgressUseCase, getRelationshipProgressUseCase),
    ).scoped(),
  });
};
