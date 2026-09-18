import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { WorkoutGoal, WorkoutProgramStatus } from '../enums';
import {
  WorkoutSchedule,
  WorkoutScheduleProps,
} from '../value-objects/workout-schedule.value-object';
import { WorkoutWeek } from '../entities/workout-week.entity';
import {
  ActiveWorkoutProgramImmutableException,
  InvalidWorkoutProgramTransitionException,
} from '../exceptions/workout-domain.exceptions';
import { WorkoutProgramActivatedEvent, WorkoutProgramCreatedEvent } from '../events';

export interface WorkoutProgramProps {
  coachingRelationshipId: string;
  trainerId: string;
  clientId: string;
  version: number;
  title: string;
  description?: string | null;
  goal: WorkoutGoal;
  schedule: WorkoutSchedule;
  weeks: WorkoutWeek[];
  status: WorkoutProgramStatus;
  activatedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkoutProgram extends AggregateRoot<WorkoutProgramProps> {
  private constructor(props: WorkoutProgramProps, id: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
  }

  get coachingRelationshipId(): string {
    return this.props.coachingRelationshipId;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get version(): number {
    return this.props.version;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null | undefined {
    return this.props.description;
  }

  get goal(): WorkoutGoal {
    return this.props.goal;
  }

  get schedule(): WorkoutSchedule {
    return this.props.schedule;
  }

  get weeks(): WorkoutWeek[] {
    return [...this.props.weeks];
  }

  get status(): WorkoutProgramStatus {
    return this.props.status;
  }

  get activatedAt(): Date | null | undefined {
    return this.props.activatedAt;
  }

  get completedAt(): Date | null | undefined {
    return this.props.completedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateDraft(updates: {
    title?: string;
    description?: string | null;
    goal?: WorkoutGoal;
    schedule?: WorkoutSchedule;
    weeks?: WorkoutWeek[];
  }): Result<void> {
    if (this.props.status !== WorkoutProgramStatus.DRAFT) {
      throw new ActiveWorkoutProgramImmutableException(this._id);
    }

    if (updates.title && updates.title.trim().length > 0) {
      this.props.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      this.props.description = updates.description;
    }
    if (updates.goal) {
      this.props.goal = updates.goal;
    }
    if (updates.schedule) {
      this.props.schedule = updates.schedule;
    }
    if (updates.weeks) {
      this.props.weeks = [...updates.weeks];
    }
    this.props.updatedAt = new Date();

    return Result.ok<void>();
  }

  public activate(activatedAt: Date = new Date()): Result<void> {
    if (this.props.status === WorkoutProgramStatus.ACTIVE) {
      return Result.ok<void>();
    }

    if (this.props.status !== WorkoutProgramStatus.DRAFT) {
      throw new InvalidWorkoutProgramTransitionException(
        this.props.status,
        WorkoutProgramStatus.ACTIVE,
      );
    }

    if (this.props.weeks.length === 0) {
      return Result.fail<void>(
        'Cannot activate a workout program with no planned weeks/exercises.',
      );
    }

    this.props.status = WorkoutProgramStatus.ACTIVE;
    this.props.activatedAt = activatedAt;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new WorkoutProgramActivatedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        this.props.activatedAt,
      ),
    );

    return Result.ok<void>();
  }

  public complete(completedAt: Date = new Date()): Result<void> {
    if (this.props.status === WorkoutProgramStatus.COMPLETED) {
      return Result.ok<void>();
    }

    if (this.props.status !== WorkoutProgramStatus.ACTIVE) {
      throw new InvalidWorkoutProgramTransitionException(
        this.props.status,
        WorkoutProgramStatus.COMPLETED,
      );
    }

    this.props.status = WorkoutProgramStatus.COMPLETED;
    this.props.completedAt = completedAt;
    this.props.updatedAt = new Date();

    return Result.ok<void>();
  }

  public createNewVersion(
    newProps?: Partial<
      Pick<WorkoutProgramProps, 'title' | 'description' | 'goal' | 'schedule' | 'weeks'>
    > & { versionOverride?: number },
  ): WorkoutProgram {
    const nextVersion = newProps?.versionOverride || this.props.version + 1;
    const now = new Date();

    const newProgramResult = WorkoutProgram.create({
      coachingRelationshipId: this.props.coachingRelationshipId,
      trainerId: this.props.trainerId,
      clientId: this.props.clientId,
      version: nextVersion,
      title: newProps?.title || `${this.props.title} (v${nextVersion})`,
      description:
        newProps?.description !== undefined ? newProps.description : this.props.description,
      goal: newProps?.goal || this.props.goal,
      schedule: newProps?.schedule || this.props.schedule,
      weeks: newProps?.weeks || this.props.weeks,
      status: WorkoutProgramStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    });

    if (newProgramResult.isFailure) {
      throw new Error(
        `Failed to clone program to version ${nextVersion}: ${newProgramResult.error}`,
      );
    }

    return newProgramResult.getValue();
  }

  public static create(
    props: Omit<WorkoutProgramProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<WorkoutProgram> {
    if (!props.coachingRelationshipId) {
      return Result.fail<WorkoutProgram>('Coaching relationship ID is required.');
    }
    if (!props.trainerId || !props.clientId) {
      return Result.fail<WorkoutProgram>('Trainer ID and Client ID are required.');
    }
    if (!props.title || props.title.trim().length === 0) {
      return Result.fail<WorkoutProgram>('Workout program title is required.');
    }
    if (props.version < 1) {
      return Result.fail<WorkoutProgram>('Program version must be 1 or higher.');
    }

    const programId = id || crypto.randomUUID();
    const now = new Date();

    const program = new WorkoutProgram(
      {
        ...props,
        weeks: props.weeks || [],
        status: props.status || WorkoutProgramStatus.DRAFT,
        createdAt: props.createdAt || now,
        updatedAt: props.updatedAt || now,
      },
      programId,
    );

    if (!id) {
      program.addDomainEvent(
        new WorkoutProgramCreatedEvent(
          programId,
          props.coachingRelationshipId,
          props.trainerId,
          props.clientId,
          props.version,
          program.status,
        ),
      );
    }

    return Result.ok<WorkoutProgram>(program);
  }

  public static reconstitute(props: WorkoutProgramProps, id: string): WorkoutProgram {
    return new WorkoutProgram(props, id);
  }
}
