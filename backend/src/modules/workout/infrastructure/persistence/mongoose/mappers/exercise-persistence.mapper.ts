import { Exercise } from '../../../../domain/aggregates/exercise.aggregate';
import { ExerciseOrigin } from '../../../../domain/enums';
import { IExerciseDocument } from '../schemas/exercise.schema';

export class ExercisePersistenceMapper {
  public static toDomain(doc: IExerciseDocument): Exercise {
    return Exercise.reconstitute(
      {
        name: doc.name,
        slug: doc.slug,
        category: doc.category,
        primaryMuscleGroup: doc.primaryMuscleGroup,
        secondaryMuscleGroups: doc.secondaryMuscleGroups || [],
        equipment: doc.equipment,
        difficulty: doc.difficulty,
        instructions: (doc.instructions || []).map((ins) => ({
          step: ins.step,
          instruction: ins.instruction,
        })),
        media: {
          thumbnailUrl: doc.media?.thumbnailUrl ?? null,
          videoUrl: doc.media?.videoUrl ?? null,
          imageUrls: doc.media?.imageUrls || doc.media?.images || [],
          images: doc.media?.imageUrls || doc.media?.images || [],
        },
        caloriesPerMinute: doc.caloriesPerMinute ?? 5,
        status: doc.status,
        origin: doc.origin || ExerciseOrigin.PLATFORM,
        createdByTrainerId: doc.createdByTrainerId || null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );
  }

  public static toPersistence(entity: Exercise): Record<string, any> {
    return {
      _id: entity.id,
      name: entity.name,
      slug: entity.slug,
      category: entity.category,
      primaryMuscleGroup: entity.primaryMuscleGroup,
      secondaryMuscleGroups: entity.secondaryMuscleGroups,
      equipment: entity.equipment,
      difficulty: entity.difficulty,
      instructions: entity.instructions,
      media: entity.media,
      caloriesPerMinute: entity.caloriesPerMinute,
      status: entity.status,
      origin: entity.origin,
      createdByTrainerId: entity.createdByTrainerId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
