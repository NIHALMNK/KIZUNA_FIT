import { Schema, model, Model } from 'mongoose';
import {
  IPaymentDocument,
  ITransactionSubDocument,
  ISubscriptionSubDocument,
  IRefundSubDocument,
  IDisputeSubDocument,
  IPayoutSubDocument,
  IInvoiceSubDocument,
  ISettlementSubDocument,
} from '../documents/payment.document';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { SubscriptionStatus } from '../../../../domain/enums/subscription-status.enum';
import { RefundStatus } from '../../../../domain/enums/refund-status.enum';
import { RefundType } from '../../../../domain/enums/refund-type.enum';
import { DisputeStatus } from '../../../../domain/enums/dispute-status.enum';
import { PayoutStatus } from '../../../../domain/enums/payout-status.enum';
import { TransactionType } from '../../../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../../../domain/enums/transaction-status.enum';

const PaymentPricingSchema = new Schema(
  {
    trainerFee: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'INR' },
  },
  { _id: false },
);

const TransactionSchema = new Schema<ITransactionSubDocument>(
  {
    _id: { type: String, required: true },
    providerTransactionId: { type: String, default: null, trim: true },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'INR' },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
      default: TransactionStatus.SUCCESS,
    },
    processedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const SubscriptionSchema = new Schema<ISubscriptionSubDocument>(
  {
    _id: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      required: true,
      default: SubscriptionStatus.PENDING,
    },
    coachingRelationshipId: { type: String, default: null, trim: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    sessionsIncluded: { type: Number, required: true, default: 1, min: 0 },
    sessionsRemaining: { type: Number, required: true, default: 1, min: 0 },
    activatedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { _id: false },
);

const RefundSchema = new Schema<IRefundSubDocument>(
  {
    _id: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'INR' },
    reason: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(RefundType),
      required: true,
      default: RefundType.FULL_TRAINER_FEE_REFUND,
    },
    status: {
      type: String,
      enum: Object.values(RefundStatus),
      required: true,
      default: RefundStatus.PENDING,
    },
    adminNotes: { type: String, default: null, trim: true },
    adminId: { type: String, default: null, trim: true },
    gatewayRefundId: { type: String, default: null, trim: true },
    createdAt: { type: Date, required: true, default: Date.now },
    reviewedAt: { type: Date, default: null },
    processedAt: { type: Date, default: null },
  },
  { _id: false },
);

const DisputeSchema = new Schema<IDisputeSubDocument>(
  {
    _id: { type: String, required: true },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(DisputeStatus),
      required: true,
      default: DisputeStatus.OPEN,
    },
    raisedBy: { type: String, required: true, trim: true },
    evidence: { type: String, default: null, trim: true },
    resolutionNotes: { type: String, default: null, trim: true },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const PayoutSchema = new Schema<IPayoutSubDocument>(
  {
    _id: { type: String, required: true },
    trainerId: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'INR' },
    status: {
      type: String,
      enum: Object.values(PayoutStatus),
      required: true,
      default: PayoutStatus.PENDING,
    },
    eligibleAt: { type: Date, default: null },
    processedAt: { type: Date, default: null },
    gatewayPayoutId: { type: String, default: null, trim: true },
    failureReason: { type: String, default: null, trim: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const InvoiceSchema = new Schema<IInvoiceSubDocument>(
  {
    _id: { type: String, required: true },
    invoiceNumber: { type: String, required: true, trim: true },
    trainerFee: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'INR' },
    issuedAt: { type: Date, required: true, default: Date.now },
    pdfUrl: { type: String, default: null, trim: true },
  },
  { _id: false },
);

const SettlementSchema = new Schema<ISettlementSubDocument>(
  {
    _id: { type: String, required: true },
    trainerAmount: { type: Number, required: true, min: 0 },
    platformAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'INR' },
    settledAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

export const PaymentSchema = new Schema<IPaymentDocument>(
  {
    _id: { type: String, required: true },
    offerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    acquisitionPipelineId: {
      type: String,
      required: true,
      index: true,
    },
    clientId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    pricing: { type: PaymentPricingSchema, required: true },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.CREATED,
      required: true,
      index: true,
    },
    providerOrderId: {
      type: String,
      trim: true,
      index: { unique: true, sparse: true },
    },
    providerPaymentId: {
      type: String,
      trim: true,
      index: { unique: true, sparse: true },
    },
    transactions: { type: [TransactionSchema], default: [] },
    subscription: { type: SubscriptionSchema, required: true },
    refunds: { type: [RefundSchema], default: [] },
    disputes: { type: [DisputeSchema], default: [] },
    payout: { type: PayoutSchema, required: true },
    invoice: { type: InvoiceSchema, required: true },
    settlement: { type: SettlementSchema, default: null },
  },
  {
    timestamps: true,
    collection: 'payments',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        const output = ret as Record<string, unknown>;
        delete output._id;
        delete output.__v;
        return output;
      },
    },
  },
);

// --- Compound Indexes ---
PaymentSchema.index({ clientId: 1, createdAt: -1 });
PaymentSchema.index({ trainerId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

export const PaymentModel: Model<IPaymentDocument> = model<IPaymentDocument>(
  'Payment',
  PaymentSchema,
);
