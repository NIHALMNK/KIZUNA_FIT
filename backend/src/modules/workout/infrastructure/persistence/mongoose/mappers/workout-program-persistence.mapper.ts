import { WorkoutProgram } from '../../../../domain/aggregates/workout-program.aggregate';
import { WorkoutSchedule } from '../../../../domain/value-objects/workout-schedule.value-object';
import { WorkoutWeek } from '../../../../domain/entities/workout-week.entity';
import { WorkoutDay } from '../../../../domain/entities/workout-day.entity';
import { ExercisePrescription } from '../../../../domain/value-objects/exercise-prescription.value-object';
import { ExerciseSnapshot } from '../../../../domain/value-objects/exercise-snapshot.value-object';
import { IWorkoutProgramDocument } from '../schemas/workout-program.schema';

export class WorkoutProgramPersistenceMapper {
  public static toDomain(doc: IWorkoutProgramDocument): WorkoutProgram {
    const schedule = WorkoutSchedule.create({
      weeks: doc.schedule?.weeks || 4,
      sessionsPerWeek: doc.schedule?.sessionsPerWeek || 3,
    }).getValue()!;

    const weeks: WorkoutWeek[] = (doc.weeks || []).map((w) => {
      const days: WorkoutDay[] = (w.days || []).map((d) => {
        const prescriptions: ExercisePrescription[] = (d.exercises || []).map((ex) => {
          const snapshot = ExerciseSnapshot.create({
            exerciseId: ex.exercise.exerciseId,
            name: ex.exercise.name,
            slug: ex.exercise.slug,
            category: ex.exercise.category,
            primaryMuscleGroup: ex.exercise.primaryMuscleGroup,
            equipment: ex.exercise.equipment,
            difficulty: ex.exercise.difficulty,
          }).getValue()!;

          return ExercisePrescription.create({
            order: ex.order,
            exercise: snapshot,
            type: ex.type,
            sets: ex.sets,
            reps: ex.reps,
            durationSeconds: ex.durationSeconds ?? null,
            restSeconds: ex.restSeconds,
            tempo: ex.tempo ?? null,
            notes: ex.notes ?? null,
          }).getValue()!;
        });

        return WorkoutDay.create(
          {
            dayNumber: d.dayNumber,
            title: d.title,
            exercises: prescriptions,
          },
          d.id,
        ).getValue()!;
      });

      return WorkoutWeek.create(
        {
          weekNumber: w.weekNumber,
          title: w.title,
          days,
        },
        w.id,
      ).getValue()!;
    });

    return WorkoutProgram.reconstitute(
      {
        coachingRelationshipId: doc.coachingRelationshipId,
        trainerId: doc.trainerId,
        clientId: doc.clientId,
        version: doc.version,
        title: doc.title,
        description: doc.description ?? null,
        goal: doc.goal,
        schedule,
        weeks,
        status: doc.status,
        activatedAt: doc.activatedAt ?? null,
        completedAt: doc.completedAt ?? null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );
  }

  public static toPersistence(entity: WorkoutProgram): Record<string, any> {
    return {
      _id: entity.id,
      coachingRelationshipId: entity.coachingRelationshipId,
      trainerId: entity.trainerId,
      clientId: entity.clientId,
      version: entity.version,
      title: entity.title,
      description: entity.description,
      goal: entity.goal,
      schedule: entity.schedule.toPrimitives(),
      weeks: entity.weeks.map((w) => ({
        id: w.id,
        weekNumber: w.weekNumber,
        title: w.title,
        days: w.days.map((d) => ({
          id: d.id,
          dayNumber: d.dayNumber,
          title: d.title,
          exercises: d.exercises.map((ex) => ({
            order: ex.order,
            exercise: ex.exercise.toPrimitives(),
            type: ex.type,
            sets: ex.sets,
            reps: ex.reps,
            durationSeconds: ex.durationSeconds ?? null,
            restSeconds: ex.restSeconds,
            tempo: ex.tempo ?? null,
            notes: ex.notes ?? null,
          })),
        })),
      })),
      status: entity.status,
      activatedAt: entity.activatedAt ?? null,
      completedAt: entity.completedAt ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
