import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { CompletionSource, WorkoutCompletionStatus } from '../enums';
import { WorkoutDaySnapshot } from '../value-objects/workout-day-snapshot.value-object';
import { CompletedExercise } from '../entities/completed-exercise.entity';
import { WorkoutFeedback } from '../value-objects/workout-feedback.value-object';
import {
  InvalidWorkoutCompletionTransitionException,
  WorkoutCompletionImmutableException,
} from '../exceptions/workout-domain.exceptions';
import { WorkoutCompletedEvent, WorkoutCompletionStartedEvent } from '../events';

export interface WorkoutCompletionProps {
  coachingRelationshipId: string;
  workoutProgramId: string;
  clientId: string;
  trainerId: string;
  workoutDay: number;
  workoutDaySnapshot: WorkoutDaySnapshot;
  completedExercises: CompletedExercise[];
  feedback?: WorkoutFeedback | null;
  status: WorkoutCompletionStatus;
  startedAt: Date;
  completedAt?: Date | null;
  completedBy: CompletionSource;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkoutCompletion extends AggregateRoot<WorkoutCompletionProps> {
  private constructor(props: WorkoutCompletionProps, id: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
  }

  get coachingRelationshipId(): string {
    return this.props.coachingRelationshipId;
  }

  get workoutProgramId(): string {
    return this.props.workoutProgramId;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get workoutDay(): number {
    return this.props.workoutDay;
  }

  get workoutDaySnapshot(): WorkoutDaySnapshot {
    return this.props.workoutDaySnapshot;
  }

  get completedExercises(): CompletedExercise[] {
    return [...this.props.completedExercises];
  }

  get feedback(): WorkoutFeedback | null | undefined {
    return this.props.feedback;
  }

  get status(): WorkoutCompletionStatus {
    return this.props.status;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get completedAt(): Date | null | undefined {
    return this.props.completedAt;
  }

  get completedBy(): CompletionSource {
    return this.props.completedBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateExecution(
    completedExercises: CompletedExercise[],
    feedback?: WorkoutFeedback | null,
  ): Result<void> {
    if (this.props.status !== WorkoutCompletionStatus.IN_PROGRESS) {
      throw new WorkoutCompletionImmutableException(this._id, this.props.status);
    }

    this.props.completedExercises = [...completedExercises];
    if (feedback !== undefined) {
      this.props.feedback = feedback;
    }
    this.props.updatedAt = new Date();

    return Result.ok<void>();
  }

  public complete(
    completedExercises: CompletedExercise[],
    feedback?: WorkoutFeedback | null,
    completedAt: Date = new Date(),
    completedBy: CompletionSource = CompletionSource.CLIENT,
  ): Result<void> {
    if (this.props.status === WorkoutCompletionStatus.COMPLETED) {
      return Result.ok<void>();
    }

    if (this.props.status !== WorkoutCompletionStatus.IN_PROGRESS) {
      throw new InvalidWorkoutCompletionTransitionException(
        this.props.status,
        WorkoutCompletionStatus.COMPLETED,
      );
    }

    this.props.completedExercises = [...completedExercises];
    if (feedback !== undefined) {
      this.props.feedback = feedback;
    }
    this.props.status = WorkoutCompletionStatus.COMPLETED;
    this.props.completedAt = completedAt;
    this.props.completedBy = completedBy;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new WorkoutCompletedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.workoutProgramId,
        this.props.clientId,
        this.props.trainerId,
        this.props.workoutDay,
        this.props.completedAt,
      ),
    );

    return Result.ok<void>();
  }

  public markMissed(notes?: string | null, missedAt: Date = new Date()): Result<void> {
    if (this.props.status === WorkoutCompletionStatus.COMPLETED) {
      throw new WorkoutCompletionImmutableException(this._id, this.props.status);
    }

    this.props.status = WorkoutCompletionStatus.MISSED;
    this.props.completedAt = missedAt;
    this.props.completedBy = CompletionSource.SYSTEM;
    this.props.updatedAt = new Date();

    return Result.ok<void>();
  }

  public static create(
    props: Omit<WorkoutCompletionProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<WorkoutCompletion> {
    if (!props.coachingRelationshipId || !props.workoutProgramId) {
      return Result.fail<WorkoutCompletion>(
        'Coaching relationship ID and workout program ID are required.',
      );
    }
    if (!props.clientId || !props.trainerId) {
      return Result.fail<WorkoutCompletion>('Client ID and Trainer ID are required.');
    }
    if (props.workoutDay < 1) {
      return Result.fail<WorkoutCompletion>('Workout day must be 1 or higher.');
    }

    const completionId = id || crypto.randomUUID();
    const now = new Date();

    const completion = new WorkoutCompletion(
      {
        ...props,
        completedExercises: props.completedExercises || [],
        status: props.status || WorkoutCompletionStatus.IN_PROGRESS,
        startedAt: props.startedAt || now,
        completedBy: props.completedBy || CompletionSource.CLIENT,
        createdAt: props.createdAt || now,
        updatedAt: props.updatedAt || now,
      },
      completionId,
    );

    if (!id && completion.status === WorkoutCompletionStatus.IN_PROGRESS) {
      completion.addDomainEvent(
        new WorkoutCompletionStartedEvent(
          completionId,
          props.coachingRelationshipId,
          props.workoutProgramId,
          props.clientId,
          props.trainerId,
          props.workoutDay,
          completion.startedAt,
        ),
      );
    }

    return Result.ok<WorkoutCompletion>(completion);
  }

  public static reconstitute(props: WorkoutCompletionProps, id: string): WorkoutCompletion {
    return new WorkoutCompletion(props, id);
  }
}
