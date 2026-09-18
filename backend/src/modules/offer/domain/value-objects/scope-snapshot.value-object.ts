import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { CoachingPlanType, getPlatformPlan } from '../enums/coaching-plan-type.enum';

export interface ScopeSnapshotProps {
  durationDays: number;
  planType: CoachingPlanType | string;
  includedFeatures: string[];
  trainerNotes?: string;
}

/**
 * Immutable Value Object representing the agreed scope and deliverables of a CoachingOffer.
 * V1 Rules:
 * - durationDays is strictly 30 days.
 * - planType is platform-owned (BASIC, PRO, PREMIUM).
 * - includedFeatures are snapshotted from the platform plan definition.
 */
export class ScopeSnapshot extends ValueObject<ScopeSnapshotProps> {
  private constructor(props: ScopeSnapshotProps) {
    super(props);
  }

  get durationDays(): number {
    return this.props.durationDays;
  }

  get planType(): string {
    return this.props.planType;
  }

  get includedFeatures(): string[] {
    return [...this.props.includedFeatures];
  }

  get trainerNotes(): string | undefined {
    return this.props.trainerNotes;
  }

  public toPrimitives(): ScopeSnapshotProps {
    return {
      durationDays: this.props.durationDays,
      planType: this.props.planType,
      includedFeatures: [...this.props.includedFeatures],
      trainerNotes: this.props.trainerNotes,
    };
  }

  public static createForPlan(
    planType: CoachingPlanType | string,
    trainerNotes?: string,
  ): Result<ScopeSnapshot> {
    try {
      const plan = getPlatformPlan(planType);
      return Result.ok<ScopeSnapshot>(
        new ScopeSnapshot({
          durationDays: plan.durationDays, // exactly 30 days
          planType: plan.planType,
          includedFeatures: [...plan.includedFeatures],
          trainerNotes:
            trainerNotes && trainerNotes.trim().length > 0 ? trainerNotes.trim() : undefined,
        }),
      );
    } catch (err: unknown) {
      return Result.fail<ScopeSnapshot>(
        err instanceof Error ? err.message : 'Invalid platform plan type',
      );
    }
  }

  public static create(props: {
    durationDays?: number;
    planType: string;
    includedFeatures?: string[];
    trainerNotes?: string;
  }): Result<ScopeSnapshot> {
    if (
      !props.planType ||
      typeof props.planType !== 'string' ||
      props.planType.trim().length === 0
    ) {
      return Result.fail<ScopeSnapshot>('planType must be a non-empty string');
    }

    const durationDays = props.durationDays !== undefined ? props.durationDays : 30;
    if (typeof durationDays !== 'number' || isNaN(durationDays) || durationDays < 1) {
      return Result.fail<ScopeSnapshot>('durationDays must be a positive number');
    }

    const includedFeatures = Array.isArray(props.includedFeatures)
      ? props.includedFeatures.map((f) => String(f).trim()).filter((f) => f.length > 0)
      : [];

    const trainerNotes =
      props.trainerNotes &&
      typeof props.trainerNotes === 'string' &&
      props.trainerNotes.trim().length > 0
        ? props.trainerNotes.trim()
        : undefined;

    return Result.ok<ScopeSnapshot>(
      new ScopeSnapshot({
        durationDays,
        planType: props.planType.trim(),
        includedFeatures,
        trainerNotes,
      }),
    );
  }
}
