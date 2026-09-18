import { WorkoutCompletion } from '../../../../domain/aggregates/workout-completion.aggregate';
import { WorkoutDaySnapshot } from '../../../../domain/value-objects/workout-day-snapshot.value-object';
import { CompletedExercise } from '../../../../domain/entities/completed-exercise.entity';
import { CompletedSet } from '../../../../domain/value-objects/completed-set.value-object';
import { WorkoutFeedback } from '../../../../domain/value-objects/workout-feedback.value-object';
import { IWorkoutCompletionDocument } from '../schemas/workout-completion.schema';

export class WorkoutCompletionPersistenceMapper {
  public static toDomain(doc: IWorkoutCompletionDocument): WorkoutCompletion {
    const daySnapshot = WorkoutDaySnapshot.create({
      weekNumber: doc.workoutDaySnapshot?.weekNumber || 1,
      dayNumber: doc.workoutDaySnapshot?.dayNumber || doc.workoutDay || 1,
      title: doc.workoutDaySnapshot?.title || `Workout Day ${doc.workoutDay}`,
      plannedExercisesCount:
        doc.workoutDaySnapshot?.plannedExercisesCount || (doc.completedExercises || []).length,
    }).getValue()!;

    const completedExercises: CompletedExercise[] = (doc.completedExercises || []).map((ex) => {
      const sets: CompletedSet[] = (ex.completedSets || []).map((s) => {
        return CompletedSet.create({
          setNumber: s.setNumber,
          plannedReps: s.plannedReps,
          completedReps: s.completedReps ?? 0,
          weight: s.weight ?? 0,
          completed: s.completed ?? false,
          notes: s.notes ?? null,
        }).getValue()!;
      });

      return CompletedExercise.create(
        {
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          completedSets: sets,
          notes: ex.notes ?? null,
        },
        ex.id,
      ).getValue()!;
    });

    let feedback: WorkoutFeedback | null = null;
    if (doc.feedback) {
      feedback = WorkoutFeedback.create({
        difficulty: doc.feedback.difficulty,
        energyLevel: doc.feedback.energyLevel,
        notes: doc.feedback.notes ?? null,
      }).getValue()!;
    }

    return WorkoutCompletion.reconstitute(
      {
        coachingRelationshipId: doc.coachingRelationshipId,
        workoutProgramId: doc.workoutProgramId,
        clientId: doc.clientId,
        trainerId: doc.trainerId,
        workoutDay: doc.workoutDay,
        workoutDaySnapshot: daySnapshot,
        completedExercises,
        feedback,
        status: doc.status,
        startedAt: doc.startedAt,
        completedAt: doc.completedAt ?? null,
        completedBy: doc.completedBy,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );
  }

  public static toPersistence(entity: WorkoutCompletion): Record<string, any> {
    return {
      _id: entity.id,
      coachingRelationshipId: entity.coachingRelationshipId,
      workoutProgramId: entity.workoutProgramId,
      clientId: entity.clientId,
      trainerId: entity.trainerId,
      workoutDay: entity.workoutDay,
      workoutDaySnapshot: entity.workoutDaySnapshot.toPrimitives(),
      completedExercises: entity.completedExercises.map((ex) => ({
        id: ex.id,
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        completedSets: ex.completedSets.map((s) => s.toPrimitives()),
        notes: ex.notes ?? null,
      })),
      feedback: entity.feedback ? entity.feedback.toPrimitives() : null,
      status: entity.status,
      startedAt: entity.startedAt,
      completedAt: entity.completedAt ?? null,
      completedBy: entity.completedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
