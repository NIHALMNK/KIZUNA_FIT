import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { CancellationActor } from '../enums/cancellation-actor.enum';

export interface ConsultationCancellationProps {
  cancelledAt: Date;
  cancelledBy: CancellationActor;
  reason?: string | null;
}

/**
 * Immutable Value Object encapsulating cancellation details for a consultation.
 */
export class ConsultationCancellation extends ValueObject<ConsultationCancellationProps> {
  private constructor(props: ConsultationCancellationProps) {
    super(props);
  }

  get cancelledAt(): Date {
    return new Date(this.props.cancelledAt.getTime());
  }

  get cancelledBy(): CancellationActor {
    return this.props.cancelledBy;
  }

  get reason(): string | null {
    return this.props.reason || null;
  }

  public toPrimitives(): {
    cancelledAt: string;
    cancelledBy: CancellationActor;
    reason: string | null;
  } {
    return {
      cancelledAt: this.props.cancelledAt.toISOString(),
      cancelledBy: this.props.cancelledBy,
      reason: this.props.reason || null,
    };
  }

  public static create(props: {
    cancelledAt?: Date;
    cancelledBy: CancellationActor;
    reason?: string | null;
  }): Result<ConsultationCancellation> {
    if (!props.cancelledBy || !Object.values(CancellationActor).includes(props.cancelledBy)) {
      return Result.fail<ConsultationCancellation>(
        'ConsultationCancellation requires a valid CancellationActor',
      );
    }

    const cancelledAt = props.cancelledAt ? new Date(props.cancelledAt.getTime()) : new Date();

    return Result.ok<ConsultationCancellation>(
      new ConsultationCancellation({
        cancelledAt,
        cancelledBy: props.cancelledBy,
        reason: props.reason ? props.reason.trim() : null,
      }),
    );
  }
}
