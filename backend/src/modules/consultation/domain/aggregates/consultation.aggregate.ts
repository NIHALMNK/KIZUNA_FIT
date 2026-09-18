import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { ConsultationStatus } from '../enums/consultation-status.enum';
import { ConsultationPlatform } from '../enums/consultation-platform.enum';
import { CancellationActor } from '../enums/cancellation-actor.enum';
import { ConsultationSlot } from '../value-objects/consultation-slot.vo';
import { MeetingDetails } from '../value-objects/meeting-details.vo';
import { ConsultationCancellation } from '../value-objects/consultation-cancellation.vo';
import { ConsultationCreatedEvent } from '../events/consultation-created.event';
import { ConsultationSlotBookedEvent } from '../events/consultation-slot-booked.event';
import { ConsultationScheduledEvent } from '../events/consultation-scheduled.event';
import { ConsultationCancelledEvent } from '../events/consultation-cancelled.event';
import { ConsultationCompletedEvent } from '../events/consultation-completed.event';
import { ConsultationNoShowEvent } from '../events/consultation-no-show.event';
import { ConsultationRescheduledEvent } from '../events/consultation-rescheduled.event';
import { InvalidConsultationStateTransitionException } from '../exceptions/invalid-consultation-state-transition.exception';

export interface ConsultationProps {
  acquisitionPipelineId: string;
  clientId: string;
  trainerId: string;
  slot: ConsultationSlot;
  platform: ConsultationPlatform;
  roomId: string;
  meetingUrl?: string | null;
  meetingDetails?: MeetingDetails | null;
  status: ConsultationStatus;
  completedAt?: Date | null;
  cancellation?: ConsultationCancellation | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aggregate Root for the Consultation Domain.
 * Sole consistency boundary managing consultation state transitions, invariants,
 * and domain event generation.
 */
export class Consultation extends AggregateRoot<ConsultationProps> {
  private constructor(props: ConsultationProps, id: string) {
    super(props, id);
  }

  get consultationId(): string {
    return this._id;
  }

  get acquisitionPipelineId(): string {
    return this.props.acquisitionPipelineId;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get slot(): ConsultationSlot {
    return this.props.slot;
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

  get meetingDetails(): MeetingDetails | null {
    return this.props.meetingDetails || null;
  }

  get status(): ConsultationStatus {
    return this.props.status;
  }

  get completedAt(): Date | null {
    return this.props.completedAt || null;
  }

  get cancellation(): ConsultationCancellation | null {
    return this.props.cancellation || null;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --- State Guard & Predicate Methods ---

  public canBookSlot(): boolean {
    return this.props.status === ConsultationStatus.CREATED;
  }

  public canSchedule(): boolean {
    return (
      this.props.status === ConsultationStatus.CREATED ||
      this.props.status === ConsultationStatus.SLOT_BOOKED
    );
  }

  public canConfirmSchedule(): boolean {
    return this.props.status === ConsultationStatus.SLOT_BOOKED;
  }

  public canReschedule(): boolean {
    return (
      this.props.status === ConsultationStatus.SLOT_BOOKED ||
      this.props.status === ConsultationStatus.SCHEDULED
    );
  }

  public canCancel(): boolean {
    return (
      this.props.status === ConsultationStatus.CREATED ||
      this.props.status === ConsultationStatus.SLOT_BOOKED ||
      this.props.status === ConsultationStatus.SCHEDULED
    );
  }

  public canComplete(): boolean {
    return this.props.status === ConsultationStatus.SCHEDULED;
  }

  public canMarkNoShow(): boolean {
    return this.props.status === ConsultationStatus.SCHEDULED;
  }

  public isTerminal(): boolean {
    return (
      this.props.status === ConsultationStatus.COMPLETED ||
      this.props.status === ConsultationStatus.CANCELLED ||
      this.props.status === ConsultationStatus.NO_SHOW
    );
  }

  // --- Business Behavior & State Transition Methods ---

  /**
   * Client selects and books a consultation slot.
   * Transitions state from CREATED -> SLOT_BOOKED.
   */
  public bookSlot(slot: ConsultationSlot): void {
    if (!this.canBookSlot()) {
      throw new InvalidConsultationStateTransitionException(this.props.status, 'bookSlot');
    }

    this.props.slot = slot;
    this.props.status = ConsultationStatus.SLOT_BOOKED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConsultationSlotBookedEvent(
        this._id,
        this.props.clientId,
        this.props.trainerId,
        slot.scheduledStartAt,
        slot.scheduledEndAt,
      ),
    );
  }

  /**
   * Schedule or finalize a consultation with slot and platform settings.
   * Transitions state from CREATED / SLOT_BOOKED -> SCHEDULED.
   */
  public schedule(
    slot: ConsultationSlot,
    platform?: ConsultationPlatform,
    meetingDetails?: MeetingDetails,
  ): void {
    if (!this.canSchedule()) {
      throw new InvalidConsultationStateTransitionException(this.props.status, 'schedule');
    }

    this.props.slot = slot;
    if (platform) {
      this.props.platform = platform;
    }
    if (meetingDetails) {
      this.props.meetingDetails = meetingDetails;
      if (meetingDetails.meetingUrl) {
        this.props.meetingUrl = meetingDetails.meetingUrl;
      }
    }

    this.props.status = ConsultationStatus.SCHEDULED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConsultationScheduledEvent(
        this._id,
        this.props.acquisitionPipelineId,
        this.props.clientId,
        this.props.trainerId,
        slot.scheduledStartAt,
        slot.scheduledEndAt,
        this.props.roomId,
      ),
    );
  }

  /**
   * Confirm schedule after slot was booked.
   * Transitions state from SLOT_BOOKED -> SCHEDULED.
   */
  public confirmSchedule(): void {
    if (!this.canConfirmSchedule()) {
      throw new InvalidConsultationStateTransitionException(this.props.status, 'confirmSchedule');
    }

    this.props.status = ConsultationStatus.SCHEDULED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConsultationScheduledEvent(
        this._id,
        this.props.acquisitionPipelineId,
        this.props.clientId,
        this.props.trainerId,
        this.props.slot.scheduledStartAt,
        this.props.slot.scheduledEndAt,
        this.props.roomId,
      ),
    );
  }

  /**
   * Reschedule consultation with a new slot.
   * Keeps status as SLOT_BOOKED or SCHEDULED while updating slot.
   */
  public reschedule(newSlot: ConsultationSlot): void {
    if (!this.canReschedule()) {
      throw new InvalidConsultationStateTransitionException(this.props.status, 'reschedule');
    }

    this.props.slot = newSlot;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConsultationRescheduledEvent(
        this._id,
        this.props.acquisitionPipelineId,
        this.props.clientId,
        this.props.trainerId,
        newSlot.scheduledStartAt,
        newSlot.scheduledEndAt,
        newSlot.timezone,
      ),
    );
  }

  /**
   * Cancel an active consultation.
   * Transitions state to CANCELLED (Terminal).
   */
  public cancel(cancelledBy: CancellationActor, reason?: string): void {
    if (!this.canCancel()) {
      throw new InvalidConsultationStateTransitionException(this.props.status, 'cancel');
    }

    const cancellationResult = ConsultationCancellation.create({
      cancelledBy,
      reason,
      cancelledAt: new Date(),
    });

    if (cancellationResult.isFailure) {
      throw new Error(cancellationResult.error);
    }

    this.props.cancellation = cancellationResult.getValue();
    this.props.status = ConsultationStatus.CANCELLED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConsultationCancelledEvent(
        this._id,
        this.props.clientId,
        this.props.trainerId,
        cancelledBy,
        reason,
      ),
    );
  }

  /**
   * Mark consultation as successfully completed by trainer.
   * Transitions state from SCHEDULED -> COMPLETED (Terminal).
   */
  public complete(): void {
    if (!this.canComplete()) {
      throw new InvalidConsultationStateTransitionException(this.props.status, 'complete');
    }

    const completedAt = new Date();
    this.props.completedAt = completedAt;
    this.props.status = ConsultationStatus.COMPLETED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConsultationCompletedEvent(
        this._id,
        this.props.acquisitionPipelineId,
        this.props.clientId,
        this.props.trainerId,
        completedAt,
      ),
    );
  }

  /**
   * Mark consultation as no-show by trainer.
   * Transitions state from SCHEDULED -> NO_SHOW (Terminal).
   */
  public markNoShow(): void {
    if (!this.canMarkNoShow()) {
      throw new InvalidConsultationStateTransitionException(this.props.status, 'markNoShow');
    }

    this.props.status = ConsultationStatus.NO_SHOW;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new ConsultationNoShowEvent(this._id, this.props.clientId, this.props.trainerId),
    );
  }

  // --- Factory Method ---

  public static create(
    props: {
      acquisitionPipelineId: string;
      clientId: string;
      trainerId: string;
      slot: ConsultationSlot;
      platform?: ConsultationPlatform;
      roomId?: string;
      meetingUrl?: string | null;
      meetingDetails?: MeetingDetails | null;
      status?: ConsultationStatus;
      completedAt?: Date | null;
      cancellation?: ConsultationCancellation | null;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<Consultation> {
    if (!props.acquisitionPipelineId || props.acquisitionPipelineId.trim() === '') {
      return Result.fail<Consultation>('Consultation requires a valid acquisitionPipelineId');
    }

    if (!props.clientId || props.clientId.trim() === '') {
      return Result.fail<Consultation>('Consultation requires a valid clientId');
    }

    if (!props.trainerId || props.trainerId.trim() === '') {
      return Result.fail<Consultation>('Consultation requires a valid trainerId');
    }

    if (props.clientId.trim() === props.trainerId.trim()) {
      return Result.fail<Consultation>('Client cannot have a consultation with themselves');
    }

    if (!props.slot) {
      return Result.fail<Consultation>('Consultation requires a valid ConsultationSlot');
    }

    const consultationId =
      id || `consultation_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isNew = !id;

    const roomId =
      props.roomId && props.roomId.trim() !== '' ? props.roomId.trim() : `room_${consultationId}`;

    const consultationProps: ConsultationProps = {
      acquisitionPipelineId: props.acquisitionPipelineId.trim(),
      clientId: props.clientId.trim(),
      trainerId: props.trainerId.trim(),
      slot: props.slot,
      platform: props.platform || ConsultationPlatform.WEBRTC,
      roomId,
      meetingUrl: props.meetingUrl ? props.meetingUrl.trim() : null,
      meetingDetails: props.meetingDetails || null,
      status: props.status || ConsultationStatus.CREATED,
      completedAt: props.completedAt || null,
      cancellation: props.cancellation || null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    const consultation = new Consultation(consultationProps, consultationId);

    if (isNew) {
      consultation.addDomainEvent(
        new ConsultationCreatedEvent(
          consultation.consultationId,
          consultation.acquisitionPipelineId,
          consultation.clientId,
          consultation.trainerId,
        ),
      );
    }

    return Result.ok<Consultation>(consultation);
  }
}
