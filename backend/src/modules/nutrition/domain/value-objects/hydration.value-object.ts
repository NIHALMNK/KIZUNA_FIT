import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface HydrationGoalProps {
  targetMl: number;
  notes?: string | null;
}

export interface HydrationGoalPrimitives {
  targetMl: number;
  notes?: string | null;
}

export class HydrationGoal extends ValueObject<HydrationGoalProps> {
  private constructor(props: HydrationGoalProps) {
    super(props);
  }

  get targetMl(): number {
    return this.props.targetMl;
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public toPrimitives(): HydrationGoalPrimitives {
    return {
      targetMl: this.props.targetMl,
      notes: this.props.notes ?? null,
    };
  }

  public static create(props: HydrationGoalProps): Result<HydrationGoal> {
    if (props.targetMl <= 0) {
      return Result.fail<HydrationGoal>('Target hydration must be greater than zero ml.');
    }

    return Result.ok<HydrationGoal>(
      new HydrationGoal({
        targetMl: props.targetMl,
        notes: props.notes ? props.notes.trim() : null,
      }),
    );
  }
}

export interface HydrationSummaryProps {
  loggedMl: number;
  targetMl?: number | null;
}

export interface HydrationSummaryPrimitives {
  loggedMl: number;
  targetMl?: number | null;
}

export class HydrationSummary extends ValueObject<HydrationSummaryProps> {
  private constructor(props: HydrationSummaryProps) {
    super(props);
  }

  get loggedMl(): number {
    return this.props.loggedMl;
  }

  get targetMl(): number | null | undefined {
    return this.props.targetMl;
  }

  public toPrimitives(): HydrationSummaryPrimitives {
    return {
      loggedMl: this.props.loggedMl,
      targetMl: this.props.targetMl ?? null,
    };
  }

  public static create(props: HydrationSummaryProps): Result<HydrationSummary> {
    if (props.loggedMl < 0) {
      return Result.fail<HydrationSummary>('Logged hydration cannot be negative.');
    }
    if (props.targetMl !== undefined && props.targetMl !== null && props.targetMl <= 0) {
      return Result.fail<HydrationSummary>('Target hydration must be greater than zero ml.');
    }

    return Result.ok<HydrationSummary>(
      new HydrationSummary({
        loggedMl: props.loggedMl,
        targetMl: props.targetMl ?? null,
      }),
    );
  }
}
