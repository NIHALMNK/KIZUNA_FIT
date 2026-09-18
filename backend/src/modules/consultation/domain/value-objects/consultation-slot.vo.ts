import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface ConsultationSlotProps {
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  timezone: string;
  bookedAt: Date;
}

/**
 * Immutable Value Object representing the scheduled time slot for a consultation.
 * Enforces start/end validation and duration bounds (15 - 120 minutes).
 */
export class ConsultationSlot extends ValueObject<ConsultationSlotProps> {
  private constructor(props: ConsultationSlotProps) {
    super(props);
  }

  get scheduledStartAt(): Date {
    return new Date(this.props.scheduledStartAt.getTime());
  }

  get scheduledEndAt(): Date {
    return new Date(this.props.scheduledEndAt.getTime());
  }

  get timezone(): string {
    return this.props.timezone;
  }

  get bookedAt(): Date {
    return new Date(this.props.bookedAt.getTime());
  }

  public getDurationInMinutes(): number {
    return Math.round(
      (this.props.scheduledEndAt.getTime() - this.props.scheduledStartAt.getTime()) / (1000 * 60),
    );
  }

  public toPrimitives(): {
    scheduledStartAt: string;
    scheduledEndAt: string;
    timezone: string;
    bookedAt: string;
  } {
    return {
      scheduledStartAt: this.props.scheduledStartAt.toISOString(),
      scheduledEndAt: this.props.scheduledEndAt.toISOString(),
      timezone: this.props.timezone,
      bookedAt: this.props.bookedAt.toISOString(),
    };
  }

  public static create(props: {
    scheduledStartAt: Date;
    scheduledEndAt: Date;
    timezone: string;
    bookedAt?: Date;
  }): Result<ConsultationSlot> {
    if (
      !props.scheduledStartAt ||
      !(props.scheduledStartAt instanceof Date) ||
      isNaN(props.scheduledStartAt.getTime())
    ) {
      return Result.fail<ConsultationSlot>(
        'ConsultationSlot requires a valid scheduledStartAt date',
      );
    }

    if (
      !props.scheduledEndAt ||
      !(props.scheduledEndAt instanceof Date) ||
      isNaN(props.scheduledEndAt.getTime())
    ) {
      return Result.fail<ConsultationSlot>('ConsultationSlot requires a valid scheduledEndAt date');
    }

    if (props.scheduledEndAt.getTime() <= props.scheduledStartAt.getTime()) {
      return Result.fail<ConsultationSlot>(
        'scheduledEndAt must be strictly after scheduledStartAt',
      );
    }

    const durationMs = props.scheduledEndAt.getTime() - props.scheduledStartAt.getTime();
    const durationMinutes = durationMs / (1000 * 60);

    if (durationMinutes < 15) {
      return Result.fail<ConsultationSlot>('Consultation duration must be at least 15 minutes');
    }

    if (durationMinutes > 120) {
      return Result.fail<ConsultationSlot>('Consultation duration must not exceed 120 minutes');
    }

    if (!props.timezone || typeof props.timezone !== 'string' || props.timezone.trim() === '') {
      return Result.fail<ConsultationSlot>('ConsultationSlot requires a valid timezone string');
    }

    const bookedAt = props.bookedAt ? new Date(props.bookedAt.getTime()) : new Date();

    return Result.ok<ConsultationSlot>(
      new ConsultationSlot({
        scheduledStartAt: new Date(props.scheduledStartAt.getTime()),
        scheduledEndAt: new Date(props.scheduledEndAt.getTime()),
        timezone: props.timezone.trim(),
        bookedAt,
      }),
    );
  }
}
