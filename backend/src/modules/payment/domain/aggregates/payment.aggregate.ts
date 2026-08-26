import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { PaymentStatus } from '../enums/payment-status.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { RefundStatus } from '../enums/refund-status.enum';
import { RefundType } from '../enums/refund-type.enum';
import { PayoutStatus } from '../enums/payout-status.enum';
import { TransactionType } from '../enums/transaction-type.enum';
import { PaymentPricing } from '../value-objects/payment-pricing.value-object';
import { Settlement } from '../value-objects/settlement.value-object';
import { ExceptionalTrainerFeeRefundPolicy } from '../policies/exceptional-trainer-fee-refund.policy';
import { Transaction } from '../entities/transaction.entity';
import { Subscription } from '../entities/subscription.entity';
import { Refund } from '../entities/refund.entity';
import { Dispute } from '../entities/dispute.entity';
import { Payout } from '../entities/payout.entity';
import { Invoice } from '../entities/invoice.entity';

import { PaymentCreatedEvent } from '../events/payment-created.event';
import { PaymentProcessingEvent } from '../events/payment-processing.event';
import { PaymentSucceededEvent } from '../events/payment-succeeded.event';
import { PaymentFailedEvent } from '../events/payment-failed.event';
import { RefundRequestedEvent } from '../events/refund-requested.event';
import { RefundProcessedEvent } from '../events/refund-processed.event';
import { DisputeRaisedEvent } from '../events/dispute-raised.event';
import { DisputeResolvedEvent } from '../events/dispute-resolved.event';
import { PayoutEligibleEvent } from '../events/payout-eligible.event';
import { PayoutPaidEvent } from '../events/payout-paid.event';

import {
  InvalidPaymentTransitionException,
  DisputeActiveFreezeException,
  PayoutNotEligibleException,
  RefundNotAllowedException,
} from '../exceptions/payment-domain.exceptions';

export interface PaymentProps {
  offerId: string;
  acquisitionPipelineId: string;
  clientId: string;
  trainerId: string;
  pricing: PaymentPricing;
  status: PaymentStatus;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  transactions: Transaction[];
  subscription: Subscription;
  refunds: Refund[];
  disputes: Dispute[];
  payout: Payout;
  invoice: Invoice;
  settlement?: Settlement | null;
  version?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aggregate Root for the Payment Domain.
 * Sole financial authority managing commercial lifecycle, escrow tracking,
 * transactions, subscriptions, refunds, disputes, payouts, invoices, and settlements.
 */
export class Payment extends AggregateRoot<PaymentProps> {
  private constructor(props: PaymentProps, id: string) {
    super(props, id);
  }

  get version(): number {
    return this.props.version ?? 0;
  }

  public incrementVersion(): void {
    this.props.version = (this.props.version ?? 0) + 1;
  }

  get paymentId(): string {
    return this._id;
  }

  get offerId(): string {
    return this.props.offerId;
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

  get pricing(): PaymentPricing {
    return this.props.pricing;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get providerOrderId(): string | null | undefined {
    return this.props.providerOrderId;
  }

  get providerPaymentId(): string | null | undefined {
    return this.props.providerPaymentId;
  }

  get transactions(): Transaction[] {
    return [...this.props.transactions];
  }

  get subscription(): Subscription {
    return this.props.subscription;
  }

  get refunds(): Refund[] {
    return [...this.props.refunds];
  }

  get disputes(): Dispute[] {
    return [...this.props.disputes];
  }

  get payout(): Payout {
    return this.props.payout;
  }

  get invoice(): Invoice {
    return this.props.invoice;
  }

  get settlement(): Settlement | null | undefined {
    return this.props.settlement;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --- Financial Queries & Dispute Checks ---

  public hasActiveDispute(): boolean {
    return this.props.disputes.some((d) => d.isActive());
  }

  public getTotalRefundedAmount(): number {
    return this.props.refunds
      .filter((r) => r.status === RefundStatus.PROCESSED)
      .reduce((sum, r) => sum + r.amount, 0);
  }

  public getAvailableRefundableAmount(): number {
    return this.props.pricing.totalAmount - this.getTotalRefundedAmount();
  }

  // --- State Machine Lifecycle Methods ---

  /**
   * Transitions state to PROCESSING upon Razorpay order creation.
   */
  public startProcessing(providerOrderId: string): void {
    if (
      this.props.status !== PaymentStatus.CREATED &&
      this.props.status !== PaymentStatus.PROCESSING
    ) {
      throw new InvalidPaymentTransitionException(this.props.status, PaymentStatus.PROCESSING);
    }

    this.props.status = PaymentStatus.PROCESSING;
    this.props.providerOrderId = providerOrderId;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new PaymentProcessingEvent(
        this._id,
        providerOrderId,
        this.props.clientId,
        this.props.trainerId,
      ),
    );
  }

  /**
   * Transitions state to SUCCESS upon verified provider evidence (Webhook or Server Verification).
   */
  public markSuccess(providerPaymentId: string, providerOrderId?: string): void {
    if (this.props.status === PaymentStatus.SUCCESS) {
      return; // Idempotent no-op
    }

    if (
      this.props.status !== PaymentStatus.CREATED &&
      this.props.status !== PaymentStatus.PROCESSING
    ) {
      throw new InvalidPaymentTransitionException(this.props.status, PaymentStatus.SUCCESS);
    }

    this.props.status = PaymentStatus.SUCCESS;
    this.props.providerPaymentId = providerPaymentId;
    if (providerOrderId) {
      this.props.providerOrderId = providerOrderId;
    }
    this.props.updatedAt = new Date();

    // 1. Create discrete PAYMENT transaction log
    const txResult = Transaction.create({
      providerTransactionId: providerPaymentId,
      type: TransactionType.PAYMENT,
      amount: this.props.pricing.totalAmount,
      currency: this.props.pricing.currency,
    });
    if (txResult.isSuccess && txResult.getValue()) {
      this.props.transactions.push(txResult.getValue()!);
    }

    // 2. Publish PaymentSucceededEvent
    this.addDomainEvent(
      new PaymentSucceededEvent(
        this._id,
        this.props.offerId,
        this.props.acquisitionPipelineId,
        this.props.clientId,
        this.props.trainerId,
        this.props.pricing.totalAmount,
        this.props.pricing.trainerFee,
        this.props.pricing.platformFee,
        this.props.pricing.currency,
        this.props.subscription.subscriptionId,
        this.props.invoice.invoiceNumber,
      ),
    );
  }

  /**
   * Transitions state to FAILED upon verified provider failure evidence.
   */
  public markFailed(reason: string): void {
    if (this.props.status === PaymentStatus.FAILED) {
      return; // Idempotent no-op
    }

    if (
      this.props.status !== PaymentStatus.CREATED &&
      this.props.status !== PaymentStatus.PROCESSING
    ) {
      throw new InvalidPaymentTransitionException(this.props.status, PaymentStatus.FAILED);
    }

    this.props.status = PaymentStatus.FAILED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new PaymentFailedEvent(
        this._id,
        this.props.offerId,
        this.props.clientId,
        this.props.trainerId,
        reason,
      ),
    );
  }

  // --- Refund Management (Admin Reviewed) ---

  public hasActiveRefund(): boolean {
    return this.props.refunds.some(
      (r) =>
        r.status === RefundStatus.PENDING ||
        r.status === RefundStatus.UNDER_REVIEW ||
        r.status === RefundStatus.APPROVED ||
        r.status === RefundStatus.PROCESSED,
    );
  }

  // --- Refund Management (Admin Reviewed Exceptional Remedy) ---

  /**
   * Client or Admin requests an exceptional service-failure refund.
   * Invariant: Refund amount is derived strictly from immutable trainerFee (platformFee is non-refundable).
   */
  public requestRefund(reason: string): Refund {
    if (this.props.status !== PaymentStatus.SUCCESS) {
      throw new RefundNotAllowedException(
        this._id,
        `Cannot request refund for payment in status '${this.props.status}'. Payment must be SUCCESS.`,
      );
    }

    if (this.props.payout.status === PayoutStatus.PAID) {
      throw new RefundNotAllowedException(
        this._id,
        'Cannot request refund: Trainer payout has already been released (PAID).',
      );
    }

    if (this.hasActiveDispute()) {
      throw new DisputeActiveFreezeException(this._id, 'requestRefund');
    }

    if (this.hasActiveRefund()) {
      throw new RefundNotAllowedException(
        this._id,
        'An exceptional refund request already exists for this payment.',
      );
    }

    const approvedAmount = this.props.pricing.trainerFee;
    const refundResult = Refund.create({
      amount: approvedAmount,
      currency: this.props.pricing.currency,
      reason,
      type: RefundType.FULL_TRAINER_FEE_REFUND,
      status: RefundStatus.PENDING,
    });

    if (refundResult.isFailure || !refundResult.getValue()) {
      throw new RefundNotAllowedException(this._id, refundResult.error || 'Invalid refund props');
    }

    const refund = refundResult.getValue()!;
    this.props.refunds.push(refund);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new RefundRequestedEvent(
        this._id,
        refund.refundId,
        this.props.clientId,
        this.props.trainerId,
        approvedAmount,
        reason,
      ),
    );

    return refund;
  }

  /**
   * Processes an approved refund after gateway execution.
   */
  public processApprovedRefund(refundId: string, gatewayRefundId: string): void {
    if (this.hasActiveDispute()) {
      throw new DisputeActiveFreezeException(this._id, 'processApprovedRefund');
    }

    if (this.props.payout.status === PayoutStatus.PAID) {
      throw new RefundNotAllowedException(
        this._id,
        'Cannot process refund: Trainer payout has already been released (PAID).',
      );
    }

    const refund = this.props.refunds.find((r) => r.refundId === refundId);
    if (!refund) {
      throw new RefundNotAllowedException(this._id, `Refund '${refundId}' not found on payment.`);
    }

    if (refund.status !== RefundStatus.APPROVED) {
      throw new RefundNotAllowedException(
        this._id,
        `Cannot process refund in status '${refund.status}'. Refund must be APPROVED.`,
      );
    }

    refund.markProcessed(gatewayRefundId);

    // Record discrete REFUND transaction
    const txResult = Transaction.create({
      providerTransactionId: gatewayRefundId,
      type: TransactionType.REFUND,
      amount: refund.amount,
      currency: refund.currency,
    });
    if (txResult.isSuccess && txResult.getValue()) {
      this.props.transactions.push(txResult.getValue()!);
    }

    // Payment transitions to REFUNDED, subscription marked refunded, trainer payout adjusted to 0
    this.props.status = PaymentStatus.REFUNDED;
    this.props.subscription.markRefunded();
    this.props.payout.adjustAmount(0);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new RefundProcessedEvent(
        this._id,
        refund.refundId,
        this.props.clientId,
        this.props.trainerId,
        refund.amount,
        true,
        gatewayRefundId,
      ),
    );
  }

  // --- Dispute Governance ---

  public raiseDispute(reason: string, raisedBy: string, evidence?: string): Dispute {
    if (this.props.payout.status === PayoutStatus.PAID) {
      throw new Error('Cannot raise dispute: Payout has already been released (PAID).');
    }

    const disputeResult = Dispute.create({
      reason,
      raisedBy,
      evidence,
    });

    if (disputeResult.isFailure || !disputeResult.getValue()) {
      throw new Error(disputeResult.error || 'Invalid dispute parameters');
    }

    const dispute = disputeResult.getValue()!;
    this.props.disputes.push(dispute);

    // Active dispute freezes payout
    this.props.payout.hold(`Dispute raised by ${raisedBy}: ${reason}`);
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new DisputeRaisedEvent(
        this._id,
        dispute.disputeId,
        this.props.clientId,
        this.props.trainerId,
        reason,
        raisedBy,
      ),
    );

    return dispute;
  }

  public investigateDispute(disputeId: string): void {
    const dispute = this.props.disputes.find((d) => d.disputeId === disputeId);
    if (!dispute) {
      throw new Error(`Dispute '${disputeId}' not found on payment.`);
    }

    dispute.investigate();
    this.props.payout.hold(`Dispute '${disputeId}' is under investigation`);
    this.props.updatedAt = new Date();
  }

  public resolveDispute(disputeId: string, notes: string): void {
    const dispute = this.props.disputes.find((d) => d.disputeId === disputeId);
    if (!dispute) {
      throw new Error(`Dispute '${disputeId}' not found on payment.`);
    }

    dispute.resolve(notes);

    // If no remaining active disputes, release hold
    if (!this.hasActiveDispute()) {
      this.props.payout.releaseHold();
    }

    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new DisputeResolvedEvent(
        this._id,
        dispute.disputeId,
        this.props.clientId,
        this.props.trainerId,
        notes,
      ),
    );
  }

  public closeDispute(disputeId: string): void {
    const dispute = this.props.disputes.find((d) => d.disputeId === disputeId);
    if (!dispute) {
      throw new Error(`Dispute '${disputeId}' not found on payment.`);
    }

    dispute.close();

    // If no remaining active disputes, release hold
    if (!this.hasActiveDispute()) {
      this.props.payout.releaseHold();
    }

    this.props.updatedAt = new Date();
  }

  // --- Subscription & Payout Escrow Release (3-Day Review Window) ---

  /**
   * Marks the coaching subscription complete and calculates the 3-day review window.
   */
  public completeSubscription(completedAt?: Date): void {
    const completionDate = completedAt || new Date();
    this.props.subscription.complete();

    // 3-Day Review Window calculation
    const reviewWindowMs = 3 * 24 * 60 * 60 * 1000;
    const eligibleDate = new Date(completionDate.getTime() + reviewWindowMs);
    this.props.payout.markEligible(eligibleDate);
    this.props.updatedAt = new Date();

    if (new Date() >= eligibleDate && !this.hasActiveDispute()) {
      this.addDomainEvent(
        new PayoutEligibleEvent(
          this._id,
          this.props.payout.payoutId,
          this.props.trainerId,
          this.props.payout.amount,
          this.props.payout.currency,
        ),
      );
    }
  }

  public getEligiblePayoutAmount(): number {
    const hasRefund =
      this.props.status === PaymentStatus.REFUNDED ||
      this.props.refunds.some(
        (r) => r.status === RefundStatus.APPROVED || r.status === RefundStatus.PROCESSED,
      );

    const calculation = ExceptionalTrainerFeeRefundPolicy.calculatePayoutEligibility(
      this.props.pricing.trainerFee,
      this.props.pricing.platformFee,
      hasRefund,
      this.props.pricing.currency,
    );
    return calculation.eligibleTrainerPayout;
  }

  /**
   * Checks full payout eligibility based on authoritative payment state.
   */
  public checkPayoutEligibility(currentDate: Date = new Date()): {
    isEligible: boolean;
    reason?: string;
    eligibleAmount: number;
    currency: string;
    eligibleAt: Date | null;
  } {
    const eligibleAmount = this.getEligiblePayoutAmount();
    const eligibleAt = this.props.payout.eligibleAt || null;

    if (this.props.status !== PaymentStatus.SUCCESS) {
      return {
        isEligible: false,
        reason: `Payment is in state '${this.props.status}'. Must be SUCCESS.`,
        eligibleAmount,
        currency: this.props.payout.currency,
        eligibleAt,
      };
    }

    if (this.props.subscription.status !== SubscriptionStatus.COMPLETED) {
      return {
        isEligible: false,
        reason: `Subscription is '${this.props.subscription.status}'. Must be COMPLETED.`,
        eligibleAmount,
        currency: this.props.payout.currency,
        eligibleAt,
      };
    }

    if (!eligibleAt) {
      return {
        isEligible: false,
        reason: 'Subscription completion timestamp and 3-day review window not calculated.',
        eligibleAmount,
        currency: this.props.payout.currency,
        eligibleAt: null,
      };
    }

    if (currentDate.getTime() < eligibleAt.getTime()) {
      return {
        isEligible: false,
        reason: `3-Day Review Window has not expired (eligible at: ${eligibleAt.toISOString()}).`,
        eligibleAmount,
        currency: this.props.payout.currency,
        eligibleAt,
      };
    }

    if (this.hasActiveDispute()) {
      return {
        isEligible: false,
        reason: 'Payment has an active dispute (status is ON_HOLD).',
        eligibleAmount,
        currency: this.props.payout.currency,
        eligibleAt,
      };
    }

    if (this.props.payout.status === PayoutStatus.PAID) {
      return {
        isEligible: false,
        reason: 'Payout has already been PAID.',
        eligibleAmount: 0,
        currency: this.props.payout.currency,
        eligibleAt,
      };
    }

    if (this.props.payout.status === PayoutStatus.PROCESSING) {
      return {
        isEligible: false,
        reason: 'Payout is currently PROCESSING.',
        eligibleAmount,
        currency: this.props.payout.currency,
        eligibleAt,
      };
    }

    if (eligibleAmount <= 0) {
      return {
        isEligible: false,
        reason: 'Processed refunds have exhausted eligible payout amount balance.',
        eligibleAmount: 0,
        currency: this.props.payout.currency,
        eligibleAt,
      };
    }

    return {
      isEligible: true,
      eligibleAmount,
      currency: this.props.payout.currency,
      eligibleAt,
    };
  }

  /**
   * Begins payout processing after validating all eligibility rules.
   */
  public startProcessingPayout(currentDate: Date = new Date()): void {
    if (this.hasActiveDispute()) {
      throw new DisputeActiveFreezeException(this._id, 'processPayout');
    }

    const check = this.checkPayoutEligibility(currentDate);
    if (!check.isEligible) {
      throw new PayoutNotEligibleException(this._id, check.reason || 'Payout is not eligible.');
    }

    this.props.payout.adjustAmount(check.eligibleAmount);
    this.props.payout.startProcessing();
    this.props.updatedAt = new Date();
  }

  /**
   * Marks payout as failed upon provider error.
   */
  public failPayout(reason: string): void {
    this.props.payout.markFailed(reason);
    this.props.updatedAt = new Date();
  }

  /**
   * Releases trainer payout and records final Settlement snapshot.
   * Invariant: Payout amount is strictly calculated from Payment state (never trainer-supplied).
   */
  public recordSuccessfulPayout(gatewayPayoutId: string): void {
    this.props.payout.markPaid(gatewayPayoutId);

    // Record discrete PAYOUT transaction
    const txResult = Transaction.create({
      providerTransactionId: gatewayPayoutId,
      type: TransactionType.PAYOUT,
      amount: this.props.payout.amount,
      currency: this.props.payout.currency,
    });
    if (txResult.isSuccess && txResult.getValue()) {
      this.props.transactions.push(txResult.getValue()!);
    }

    // Create immutable Settlement record
    const settlementResult = Settlement.create({
      trainerAmount: this.props.payout.amount,
      platformAmount: this.props.pricing.platformFee,
      currency: this.props.pricing.currency,
      settledAt: new Date(),
    });
    if (settlementResult.isSuccess && settlementResult.getValue()) {
      this.props.settlement = settlementResult.getValue();
    }

    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new PayoutPaidEvent(
        this._id,
        this.props.payout.payoutId,
        this.props.trainerId,
        this.props.payout.amount,
        this.props.payout.currency,
        gatewayPayoutId,
      ),
    );
  }

  /**
   * Legacy convenience wrapper preserving backward compatibility.
   */
  public processPayout(gatewayPayoutId?: string): void {
    this.startProcessingPayout();
    this.recordSuccessfulPayout(gatewayPayoutId || `payout_sim_${Date.now()}`);
  }

  // --- Factory / Creation Method ---

  public static create(
    props: {
      offerId: string;
      acquisitionPipelineId: string;
      clientId: string;
      trainerId: string;
      pricing: PaymentPricing;
      status?: PaymentStatus;
      providerOrderId?: string | null;
      providerPaymentId?: string | null;
      transactions?: Transaction[];
      subscription?: Subscription;
      refunds?: Refund[];
      disputes?: Dispute[];
      payout?: Payout;
      invoice?: Invoice;
      settlement?: Settlement | null;
      version?: number;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<Payment> {
    if (!props.offerId || props.offerId.trim().length === 0) {
      return Result.fail<Payment>('offerId is required');
    }
    if (!props.acquisitionPipelineId || props.acquisitionPipelineId.trim().length === 0) {
      return Result.fail<Payment>('acquisitionPipelineId is required');
    }
    if (!props.clientId || props.clientId.trim().length === 0) {
      return Result.fail<Payment>('clientId is required');
    }
    if (!props.trainerId || props.trainerId.trim().length === 0) {
      return Result.fail<Payment>('trainerId is required');
    }
    if (!props.pricing) {
      return Result.fail<Payment>('PaymentPricing is required');
    }

    const paymentId = id || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isNew = !id;

    // Initialize default embedded entities if creating anew
    const subscription =
      props.subscription || Subscription.create({ status: SubscriptionStatus.PENDING }).getValue()!;

    const payout =
      props.payout ||
      Payout.create({
        trainerId: props.trainerId,
        amount: props.pricing.trainerFee,
        currency: props.pricing.currency,
      }).getValue()!;

    const invoice =
      props.invoice ||
      Invoice.create({
        trainerFee: props.pricing.trainerFee,
        platformFee: props.pricing.platformFee,
        totalAmount: props.pricing.totalAmount,
        currency: props.pricing.currency,
      }).getValue()!;

    const payment = new Payment(
      {
        offerId: props.offerId.trim(),
        acquisitionPipelineId: props.acquisitionPipelineId.trim(),
        clientId: props.clientId.trim(),
        trainerId: props.trainerId.trim(),
        pricing: props.pricing,
        status: props.status || PaymentStatus.CREATED,
        providerOrderId: props.providerOrderId || null,
        providerPaymentId: props.providerPaymentId || null,
        transactions: props.transactions || [],
        subscription,
        refunds: props.refunds || [],
        disputes: props.disputes || [],
        payout,
        invoice,
        settlement: props.settlement || null,
        version: props.version ?? 0,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      paymentId,
    );

    if (isNew) {
      payment.addDomainEvent(
        new PaymentCreatedEvent(
          payment.paymentId,
          payment.offerId,
          payment.clientId,
          payment.trainerId,
          payment.pricing.totalAmount,
          payment.pricing.currency,
        ),
      );
    }

    return Result.ok<Payment>(payment);
  }
}
