import { AwilixContainer, asClass } from 'awilix';

// Repositories & Adapters
import { MongoExerciseRepository } from './infrastructure/persistence/mongoose/repositories/mongo-exercise.repository';
import { MongoWorkoutProgramRepository } from './infrastructure/persistence/mongoose/repositories/mongo-workout-program.repository';
import { MongoWorkoutCompletionRepository } from './infrastructure/persistence/mongoose/repositories/mongo-workout-completion.repository';
import { WorkoutCoachingAdapter } from './infrastructure/gateways/workout-coaching.adapter';
import { MongoCoachingRelationshipRepository } from '../coaching/infrastructure/persistence/mongoose/repositories/mongo-coaching-relationship.repository';
import { WorkoutStorageAdapter } from './infrastructure/gateways/workout-storage.adapter';

// Exercise Use Cases
import { CreateExerciseUseCase } from './application/use-cases/exercise/create-exercise.use-case';
import { GetExerciseUseCase } from './application/use-cases/exercise/get-exercise.use-case';
import { ListExercisesUseCase } from './application/use-cases/exercise/list-exercises.use-case';
import { UpdateExerciseUseCase } from './application/use-cases/exercise/update-exercise.use-case';
import { DeprecateExerciseUseCase } from './application/use-cases/exercise/deprecate-exercise.use-case';
import { ReportExerciseUseCase } from './application/use-cases/exercise/report-exercise.use-case';
import { UploadExerciseMediaUseCase } from './application/use-cases/exercise/upload-exercise-media.use-case';
import { DeleteExerciseMediaUseCase } from './application/use-cases/exercise/delete-exercise-media.use-case';

// Workout Program Use Cases
import { CreateWorkoutProgramUseCase } from './application/use-cases/program/create-workout-program.use-case';
import { GetWorkoutProgramUseCase } from './application/use-cases/program/get-workout-program.use-case';
import { ListWorkoutProgramsUseCase } from './application/use-cases/program/list-workout-programs.use-case';
import { GetActiveWorkoutProgramUseCase } from './application/use-cases/program/get-active-workout-program.use-case';
import { UpdateDraftWorkoutProgramUseCase } from './application/use-cases/program/update-draft-workout-program.use-case';
import { ActivateWorkoutProgramUseCase } from './application/use-cases/program/activate-workout-program.use-case';
import { DuplicateWorkoutProgramUseCase } from './application/use-cases/program/duplicate-workout-program.use-case';
import { GetOrCreateDraftProgramUseCase } from './application/use-cases/program/get-or-create-draft-program.use-case';

// Workout Completion Use Cases
import { StartWorkoutCompletionUseCase } from './application/use-cases/completion/start-workout-completion.use-case';
import { UpdateWorkoutExecutionUseCase } from './application/use-cases/completion/update-workout-execution.use-case';
import { CompleteWorkoutUseCase } from './application/use-cases/completion/complete-workout.use-case';
import { GetWorkoutCompletionUseCase } from './application/use-cases/completion/get-workout-completion.use-case';
import { ListWorkoutCompletionsUseCase } from './application/use-cases/completion/list-workout-completions.use-case';
import { GetWorkoutHistoryUseCase } from './application/use-cases/completion/get-workout-history.use-case';

// Controllers
import { ExerciseController } from './presentation/controllers/exercise.controller';
import { WorkoutProgramController } from './presentation/controllers/workout-program.controller';
import { WorkoutCompletionController } from './presentation/controllers/workout-completion.controller';

export const registerWorkoutDependencies = (container: AwilixContainer): void => {
  // Repositories & Adapters
  container.register({
    exerciseRepository: asClass(MongoExerciseRepository).scoped(),
    workoutProgramRepository: asClass(MongoWorkoutProgramRepository).scoped(),
    workoutCompletionRepository: asClass(MongoWorkoutCompletionRepository).scoped(),
    coachingRelationshipRepository: asClass(MongoCoachingRelationshipRepository).scoped(),
    workoutCoachingGateway: asClass(WorkoutCoachingAdapter).scoped(),
    workoutStorageGateway: asClass(WorkoutStorageAdapter).scoped(),
  });

  // Exercise Use Cases
  container.register({
    createExerciseUseCase: asClass(CreateExerciseUseCase).scoped(),
    getExerciseUseCase: asClass(GetExerciseUseCase).scoped(),
    listExercisesUseCase: asClass(ListExercisesUseCase).scoped(),
    updateExerciseUseCase: asClass(UpdateExerciseUseCase).scoped(),
    deprecateExerciseUseCase: asClass(DeprecateExerciseUseCase).scoped(),
    reportExerciseUseCase: asClass(ReportExerciseUseCase).scoped(),
    uploadExerciseMediaUseCase: asClass(UploadExerciseMediaUseCase).scoped(),
    deleteExerciseMediaUseCase: asClass(DeleteExerciseMediaUseCase).scoped(),
  });

  // Workout Program Use Cases
  container.register({
    createWorkoutProgramUseCase: asClass(CreateWorkoutProgramUseCase).scoped(),
    getWorkoutProgramUseCase: asClass(GetWorkoutProgramUseCase).scoped(),
    listWorkoutProgramsUseCase: asClass(ListWorkoutProgramsUseCase).scoped(),
    getActiveWorkoutProgramUseCase: asClass(GetActiveWorkoutProgramUseCase).scoped(),
    updateDraftWorkoutProgramUseCase: asClass(UpdateDraftWorkoutProgramUseCase).scoped(),
    activateWorkoutProgramUseCase: asClass(ActivateWorkoutProgramUseCase).scoped(),
    duplicateWorkoutProgramUseCase: asClass(DuplicateWorkoutProgramUseCase).scoped(),
    getOrCreateDraftProgramUseCase: asClass(GetOrCreateDraftProgramUseCase).scoped(),
  });

  // Workout Completion Use Cases
  container.register({
    startWorkoutCompletionUseCase: asClass(StartWorkoutCompletionUseCase).scoped(),
    updateWorkoutExecutionUseCase: asClass(UpdateWorkoutExecutionUseCase).scoped(),
    completeWorkoutUseCase: asClass(CompleteWorkoutUseCase).scoped(),
    getWorkoutCompletionUseCase: asClass(GetWorkoutCompletionUseCase).scoped(),
    listWorkoutCompletionsUseCase: asClass(ListWorkoutCompletionsUseCase).scoped(),
    getWorkoutHistoryUseCase: asClass(GetWorkoutHistoryUseCase).scoped(),
  });

  // Controllers
  container.register({
    exerciseController: asClass(ExerciseController).scoped(),
    workoutProgramController: asClass(WorkoutProgramController).scoped(),
    workoutCompletionController: asClass(WorkoutCompletionController).scoped(),
  });
};
