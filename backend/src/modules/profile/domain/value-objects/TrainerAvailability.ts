import { Result } from '../../../../shared/result/Result';
import { TrainerAvailabilityStatus } from '../enums/TrainerAvailabilityStatus';

export interface TimeSlot {
  startTime: string; // "HH:MM" (24h format)
  endTime: string; // "HH:MM" (24h format)
}

export interface DaySchedule {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  slots: TimeSlot[];
}

export interface TrainerAvailabilityProps {
  status: TrainerAvailabilityStatus;
  timezone: string;
  weeklySchedule: DaySchedule[];
}

export class TrainerAvailability {
  private readonly props: TrainerAvailabilityProps;

  private constructor(props: TrainerAvailabilityProps) {
    this.props = Object.freeze(props);
  }

  get status(): TrainerAvailabilityStatus {
    return this.props.status;
  }

  get timezone(): string {
    return this.props.timezone;
  }

  get weeklySchedule(): DaySchedule[] {
    return this.props.weeklySchedule;
  }

  public isAvailableForBooking(): boolean {
    return this.props.status === TrainerAvailabilityStatus.AVAILABLE;
  }

  public static create(
    status: TrainerAvailabilityStatus = TrainerAvailabilityStatus.AVAILABLE,
    timezone: string = 'UTC',
    weeklySchedule: DaySchedule[] = [],
  ): Result<TrainerAvailability> {
    const trimmedTimezone = timezone ? timezone.trim() : 'UTC';

    const overlapResult = TrainerAvailability.validateWeeklySchedule(weeklySchedule);
    if (overlapResult.isFailure) {
      return Result.fail<TrainerAvailability>(overlapResult.error);
    }

    return Result.ok<TrainerAvailability>(
      new TrainerAvailability({
        status,
        timezone: trimmedTimezone,
        weeklySchedule,
      }),
    );
  }

  private static validateWeeklySchedule(schedule: DaySchedule[]): Result<void> {
    const timeToMinutes = (timeStr: string): number => {
      const parts = timeStr.split(':');
      if (parts.length !== 2) return -1;
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (isNaN(hours) || isNaN(minutes)) return -1;
      return hours * 60 + minutes;
    };

    for (const day of schedule) {
      if (day.dayOfWeek < 0 || day.dayOfWeek > 6) {
        return Result.fail<void>(`Invalid day of week: ${day.dayOfWeek}. Must be 0-6`);
      }

      const parsedSlots: { start: number; end: number }[] = [];
      for (const slot of day.slots) {
        const start = timeToMinutes(slot.startTime);
        const end = timeToMinutes(slot.endTime);

        if (start === -1 || end === -1 || start >= end) {
          return Result.fail<void>(
            `Invalid time slot: ${slot.startTime} - ${slot.endTime} on day ${day.dayOfWeek}`,
          );
        }
        parsedSlots.push({ start, end });
      }

      // Check overlapping within the day
      parsedSlots.sort((a, b) => a.start - b.start);
      for (let i = 0; i < parsedSlots.length - 1; i++) {
        if (parsedSlots[i].end > parsedSlots[i + 1].start) {
          return Result.fail<void>(`Overlapping time slots detected on day ${day.dayOfWeek}`);
        }
      }
    }

    return Result.ok<void>();
  }

  public updateStatus(newStatus: TrainerAvailabilityStatus): Result<TrainerAvailability> {
    return TrainerAvailability.create(newStatus, this.timezone, this.weeklySchedule);
  }

  public updateSchedule(
    newSchedule: DaySchedule[],
    newTimezone?: string,
  ): Result<TrainerAvailability> {
    return TrainerAvailability.create(this.status, newTimezone || this.timezone, newSchedule);
  }
}
