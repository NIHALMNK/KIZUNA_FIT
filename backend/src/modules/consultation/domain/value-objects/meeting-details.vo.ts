import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { ConsultationPlatform } from '../enums/consultation-platform.enum';

export interface MeetingDetailsProps {
  platform: ConsultationPlatform;
  roomId: string;
  meetingUrl?: string | null;
  joinCode?: string | null;
  instructions?: string | null;
}

/**
 * Immutable Value Object storing meeting provider details and access details.
 */
export class MeetingDetails extends ValueObject<MeetingDetailsProps> {
  private constructor(props: MeetingDetailsProps) {
    super(props);
  }

  get platform(): ConsultationPlatform {
    return this.props.platform;
  }

  get roomId(): string {
    return this.props.roomId;
  }

  get meetingUrl(): string | null {
    return this.props.meetingUrl || null;
  }

  get joinCode(): string | null {
    return this.props.joinCode || null;
  }

  get instructions(): string | null {
    return this.props.instructions || null;
  }

  public toPrimitives(): MeetingDetailsProps {
    return {
      platform: this.props.platform,
      roomId: this.props.roomId,
      meetingUrl: this.props.meetingUrl || null,
      joinCode: this.props.joinCode || null,
      instructions: this.props.instructions || null,
    };
  }

  public static create(props: MeetingDetailsProps): Result<MeetingDetails> {
    if (!props.platform || !Object.values(ConsultationPlatform).includes(props.platform)) {
      return Result.fail<MeetingDetails>('MeetingDetails requires a valid ConsultationPlatform');
    }

    if (!props.roomId || typeof props.roomId !== 'string' || props.roomId.trim() === '') {
      return Result.fail<MeetingDetails>('MeetingDetails requires a valid roomId');
    }

    return Result.ok<MeetingDetails>(
      new MeetingDetails({
        platform: props.platform,
        roomId: props.roomId.trim(),
        meetingUrl: props.meetingUrl ? props.meetingUrl.trim() : null,
        joinCode: props.joinCode ? props.joinCode.trim() : null,
        instructions: props.instructions ? props.instructions.trim() : null,
      }),
    );
  }
}
