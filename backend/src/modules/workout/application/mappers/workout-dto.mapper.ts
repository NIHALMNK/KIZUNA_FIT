import { Exercise } from '../../domain/aggregates/exercise.aggregate';
import { WorkoutProgram } from '../../domain/aggregates/workout-program.aggregate';
import { WorkoutCompletion } from '../../domain/aggregates/workout-completion.aggregate';
import { ExerciseResponseDto } from '../dtos/exercise.dto';
import { WorkoutProgramResponseDto } from '../dtos/workout-program.dto';
import { WorkoutCompletionResponseDto } from '../dtos/workout-completion.dto';

export class WorkoutDtoMapper {
  public static toExerciseResponseDto(
    exercise: Exercise,
    creatorName?: string | null,
  ): ExerciseResponseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      slug: exercise.slug,
      category: exercise.category,
      primaryMuscleGroup: exercise.primaryMuscleGroup,
      secondaryMuscleGroups: exercise.secondaryMuscleGroups,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions,
      media: {
        thumbnailUrl: exercise.media.thumbnailUrl ?? null,
        videoUrl: exercise.media.videoUrl ?? null,
        imageUrls: exercise.media.imageUrls || exercise.media.images || [],
        images: exercise.media.imageUrls || exercise.media.images || [],
      },
      caloriesPerMinute: exercise.caloriesPerMinute,
      status: exercise.status,
      origin: exercise.origin,
      createdByTrainerId: exercise.createdByTrainerId,
      creatorName:
        creatorName ??
        (exercise.origin === 'PLATFORM'
          ? 'KIZUNAFIT / Platform'
          : exercise.createdByTrainerId
            ? 'Trainer'
            : 'KIZUNAFIT / Platform'),
      createdAt: exercise.createdAt.toISOString(),
      updatedAt: exercise.updatedAt.toISOString(),
    };
  }

  public static toWorkoutProgramResponseDto(program: WorkoutProgram): WorkoutProgramResponseDto {
    return {
      id: program.id,
      coachingRelationshipId: program.coachingRelationshipId,
      trainerId: program.trainerId,
      clientId: program.clientId,
      version: program.version,
      title: program.title,
      description: program.description,
      goal: program.goal,
      schedule: program.schedule.toPrimitives(),
      weeks: program.weeks.map((week) => ({
        id: week.id,
        weekNumber: week.weekNumber,
        title: week.title,
        days: week.days.map((day) => ({
          id: day.id,
          dayNumber: day.dayNumber,
          title: day.title,
          exercises: day.exercises.map((ex) => ex.toPrimitives()),
        })),
      })),
      status: program.status,
      activatedAt: program.activatedAt ? program.activatedAt.toISOString() : null,
      completedAt: program.completedAt ? program.completedAt.toISOString() : null,
      createdAt: program.createdAt.toISOString(),
      updatedAt: program.updatedAt.toISOString(),
    };
  }

  public static toWorkoutCompletionResponseDto(
    completion: WorkoutCompletion,
  ): WorkoutCompletionResponseDto {
    return {
      id: completion.id,
      coachingRelationshipId: completion.coachingRelationshipId,
      workoutProgramId: completion.workoutProgramId,
      clientId: completion.clientId,
      trainerId: completion.trainerId,
      workoutDay: completion.workoutDay,
      workoutDaySnapshot: completion.workoutDaySnapshot.toPrimitives(),
      completedExercises: completion.completedExercises.map((ex) => ({
        id: ex.id,
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        completedSets: ex.completedSets.map((s) => s.toPrimitives()),
        notes: ex.notes ?? null,
      })),
      feedback: completion.feedback ? completion.feedback.toPrimitives() : null,
      status: completion.status,
      startedAt: completion.startedAt.toISOString(),
      completedAt: completion.completedAt ? completion.completedAt.toISOString() : null,
      completedBy: completion.completedBy,
      createdAt: completion.createdAt.toISOString(),
      updatedAt: completion.updatedAt.toISOString(),
    };
  }
}
