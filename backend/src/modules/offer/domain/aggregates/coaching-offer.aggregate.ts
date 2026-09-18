import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { CoachingOfferStatus } from '../enums/coaching-offer-status.enum';
import { PricingSnapshot } from '../value-objects/pricing-snapshot.value-object';
import { ScopeSnapshot } from '../value-objects/scope-snapshot.value-object';
import { OfferCreatedEvent } from '../events/offer-created.event';
import { OfferSentEvent } from '../events/offer-sent.event';
import { OfferAcceptedEvent } from '../events/offer-accepted.event';
import { OfferDeclinedEvent } from '../events/offer-declined.event';
import { OfferExpiredEvent } from '../events/offer-expired.event';
import {
  InvalidOfferStateTransitionException,
  OfferExpiredException,
  OfferImmutableException,
} from '../exceptions/offer-domain.exceptions';

export interface CoachingOfferProps {
  acquisitionPipelineId: string;
  consultationId: string;
  clientId: string;
  trainerId: string;
  pricingSnapshot: PricingSnapshot;
  scopeSnapshot: ScopeSnapshot;
  status: CoachingOfferStatus;
  expiresAt: Date;
  acceptedAt?: Date | null;
  declinedAt?: Date | null;
  declineReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aggregate Root for CoachingOffer domain.
 * Enforces authoritative lifecycle:
 * DRAFT -> SENT -> ACCEPTED
 *               -> DECLINED
 *               -> EXPIRED
 * Terminal states: ACCEPTED, DECLINED, EXPIRED.
 * Accepted offers become immutable.
 */
export class CoachingOffer extends AggregateRoot<CoachingOfferProps> {
  private constructor(props: CoachingOfferProps, id: string) {
    super(props, id);
  }

  get offerId(): string {
    return this._id;
  }

  get acquisitionPipelineId(): string {
    return this.props.acquisitionPipelineId;
  }

  get consultationId(): string {
    return this.props.consultationId;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get pricingSnapshot(): PricingSnapshot {
    return this.props.pricingSnapshot;
  }

  get scopeSnapshot(): ScopeSnapshot {
    return this.props.scopeSnapshot;
  }

  get status(): CoachingOfferStatus {
    return this.props.status;
  }

  get expiresAt(): Date {
    return new Date(this.props.expiresAt.getTime());
  }

  get acceptedAt(): Date | null {
    return this.props.acceptedAt ? new Date(this.props.acceptedAt.getTime()) : null;
  }

  get declinedAt(): Date | null {
    return this.props.declinedAt ? new Date(this.props.declinedAt.getTime()) : null;
  }

  get declineReason(): string | null {
    return this.props.declineReason || null;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt.getTime());
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt.getTime());
  }

  // --- State Guard & Predicate Methods ---

  public canSend(): boolean {
    return this.props.status === CoachingOfferStatus.DRAFT;
  }

  public canAccept(): boolean {
    return this.props.status === CoachingOfferStatus.SENT && !this.isExpired();
  }

  public canDecline(): boolean {
    return this.props.status === CoachingOfferStatus.SENT && !this.isExpired();
  }

  public canExpire(): boolean {
    return this.props.status === CoachingOfferStatus.SENT;
  }

  public isTerminal(): boolean {
    return (
      this.props.status === CoachingOfferStatus.ACCEPTED ||
      this.props.status === CoachingOfferStatus.DECLINED ||
      this.props.status === CoachingOfferStatus.EXPIRED
    );
  }

  public isImmutable(): boolean {
    return this.props.status === CoachingOfferStatus.ACCEPTED;
  }

  public isExpired(): boolean {
    if (this.props.status === CoachingOfferStatus.EXPIRED) {
      return true;
    }
    if (
      this.props.status === CoachingOfferStatus.SENT &&
      this.props.expiresAt.getTime() <= Date.now()
    ) {
      return true;
    }
    return false;
  }

  // --- Business Behavior & State Transition Methods ---

  /**
   * Trainer transitions DRAFT -> SENT.
   * Starts the 7-day expiration window.
   */
  public send(): void {
    if (!this.canSend()) {
      throw new InvalidOfferStateTransitionException(this.props.status, 'send');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    this.props.status = CoachingOfferStatus.SENT;
    this.props.expiresAt = expiresAt;
    this.props.updatedAt = now;

    this.addDomainEvent(
      new OfferSentEvent(
        this._id,
        this.props.acquisitionPipelineId,
        this.props.consultationId,
        this.props.clientId,
        this.props.trainerId,
        expiresAt,
      ),
    );
  }

  /**
   * Client accepts the offer: SENT -> ACCEPTED (Terminal, Immutable).
   */
  public accept(): void {
    if (this.isExpired()) {
      // Transition to expired if time has passed
      this.props.status = CoachingOfferStatus.EXPIRED;
      this.props.updatedAt = new Date();
      throw new OfferExpiredException(this._id);
    }

    if (this.isTerminal()) {
      throw new OfferImmutableException(this._id, this.props.status);
    }

    if (!this.canAccept()) {
      throw new InvalidOfferStateTransitionException(this.props.status, 'accept');
    }

    const acceptedAt = new Date();
    this.props.status = CoachingOfferStatus.ACCEPTED;
    this.props.acceptedAt = acceptedAt;
    this.props.updatedAt = acceptedAt;

    this.addDomainEvent(
      new OfferAcceptedEvent(
        this._id,
        this.props.acquisitionPipelineId,
        this.props.consultationId,
        this.props.clientId,
        this.props.trainerId,
        acceptedAt,
      ),
    );
  }

  /**
   * Client declines the offer: SENT -> DECLINED (Terminal).
   */
  public decline(reason?: string): void {
    if (this.isExpired()) {
      this.props.status = CoachingOfferStatus.EXPIRED;
      this.props.updatedAt = new Date();
      throw new OfferExpiredException(this._id);
    }

    if (this.isTerminal()) {
      throw new OfferImmutableException(this._id, this.props.status);
    }

    if (!this.canDecline()) {
      throw new InvalidOfferStateTransitionException(this.props.status, 'decline');
    }

    const declinedAt = new Date();
    this.props.status = CoachingOfferStatus.DECLINED;
    this.props.declinedAt = declinedAt;
    this.props.declineReason = reason ? reason.trim() : null;
    this.props.updatedAt = declinedAt;

    this.addDomainEvent(
      new OfferDeclinedEvent(
        this._id,
        this.props.acquisitionPipelineId,
        this.props.consultationId,
        this.props.clientId,
        this.props.trainerId,
        declinedAt,
        this.props.declineReason || undefined,
      ),
    );
  }

  /**
   * System / scheduler marks SENT -> EXPIRED (Terminal).
   */
  public expire(): void {
    if (this.props.status === CoachingOfferStatus.EXPIRED) {
      return; // Idempotent
    }

    if (
      this.props.status === CoachingOfferStatus.ACCEPTED ||
      this.props.status === CoachingOfferStatus.DECLINED
    ) {
      throw new OfferImmutableException(this._id, this.props.status);
    }

    if (!this.canExpire()) {
      throw new InvalidOfferStateTransitionException(this.props.status, 'expire');
    }

    const expiredAt = new Date();
    this.props.status = CoachingOfferStatus.EXPIRED;
    this.props.updatedAt = expiredAt;

    this.addDomainEvent(
      new OfferExpiredEvent(
        this._id,
        this.props.acquisitionPipelineId,
        this.props.consultationId,
        this.props.clientId,
        this.props.trainerId,
        expiredAt,
      ),
    );
  }

  // --- Factory Method ---

  public static create(
    props: {
      acquisitionPipelineId: string;
      consultationId: string;
      clientId: string;
      trainerId: string;
      pricingSnapshot: PricingSnapshot;
      scopeSnapshot: ScopeSnapshot;
      status?: CoachingOfferStatus;
      expiresAt?: Date;
      acceptedAt?: Date | null;
      declinedAt?: Date | null;
      declineReason?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<CoachingOffer> {
    if (!props.acquisitionPipelineId || props.acquisitionPipelineId.trim() === '') {
      return Result.fail<CoachingOffer>('CoachingOffer requires a valid acquisitionPipelineId');
    }

    if (!props.consultationId || props.consultationId.trim() === '') {
      return Result.fail<CoachingOffer>('CoachingOffer requires a valid consultationId');
    }

    if (!props.clientId || props.clientId.trim() === '') {
      return Result.fail<CoachingOffer>('CoachingOffer requires a valid clientId');
    }

    if (!props.trainerId || props.trainerId.trim() === '') {
      return Result.fail<CoachingOffer>('CoachingOffer requires a valid trainerId');
    }

    if (props.clientId.trim() === props.trainerId.trim()) {
      return Result.fail<CoachingOffer>('Client cannot create an offer for themselves');
    }

    if (!props.pricingSnapshot) {
      return Result.fail<CoachingOffer>('CoachingOffer requires a valid PricingSnapshot');
    }

    if (!props.scopeSnapshot) {
      return Result.fail<CoachingOffer>('CoachingOffer requires a valid ScopeSnapshot');
    }

    const offerId = id || `offer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isNew = !id;

    const now = new Date();
    const status = props.status || CoachingOfferStatus.DRAFT;
    const expiresAt = props.expiresAt || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const offerProps: CoachingOfferProps = {
      acquisitionPipelineId: props.acquisitionPipelineId.trim(),
      consultationId: props.consultationId.trim(),
      clientId: props.clientId.trim(),
      trainerId: props.trainerId.trim(),
      pricingSnapshot: props.pricingSnapshot,
      scopeSnapshot: props.scopeSnapshot,
      status,
      expiresAt,
      acceptedAt: props.acceptedAt || null,
      declinedAt: props.declinedAt || null,
      declineReason: props.declineReason || null,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now,
    };

    const offer = new CoachingOffer(offerProps, offerId);

    if (isNew) {
      offer.addDomainEvent(
        new OfferCreatedEvent(
          offer.offerId,
          offer.acquisitionPipelineId,
          offer.consultationId,
          offer.clientId,
          offer.trainerId,
        ),
      );

      // If created directly in SENT status, add OfferSentEvent
      if (status === CoachingOfferStatus.SENT) {
        offer.addDomainEvent(
          new OfferSentEvent(
            offer.offerId,
            offer.acquisitionPipelineId,
            offer.consultationId,
            offer.clientId,
            offer.trainerId,
            offer.expiresAt,
          ),
        );
      }
    }

    return Result.ok<CoachingOffer>(offer);
  }
}
