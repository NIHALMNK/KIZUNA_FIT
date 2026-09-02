import { ExerciseModel } from '../persistence/mongoose/schemas/exercise.schema';
import { DEFAULT_EXERCISES_SEED } from './default-exercises.seed';
import { Exercise } from '../../domain/aggregates/exercise.aggregate';
import { ExercisePersistenceMapper } from '../persistence/mongoose/mappers/exercise-persistence.mapper';

export async function seedExercisesIfEmpty(): Promise<void> {
  try {
    const count = await ExerciseModel.countDocuments();
    if (count > 0) return;

    for (const raw of DEFAULT_EXERCISES_SEED) {
      const exerciseResult = Exercise.create(raw);
      if (exerciseResult.isSuccess) {
        const doc = ExercisePersistenceMapper.toPersistence(exerciseResult.getValue());
        await ExerciseModel.create(doc);
      }
    }
  } catch (error) {
    // Non-fatal seed error
    console.warn('[WorkoutSeed] Failed to seed default exercises:', error);
  }
}
