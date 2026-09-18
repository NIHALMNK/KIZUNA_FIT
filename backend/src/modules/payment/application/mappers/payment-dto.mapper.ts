import { Payment } from '../../domain/aggregates/payment.aggregate';
import { PaymentResponseDTO } from '../dtos/payment-response.dto';
import { InvoiceResponseDTO } from '../dtos/invoice-response.dto';
import { InitiatePaymentResponseDTO } from '../dtos/initiate-payment.dto';
import { VerifyPaymentResponseDTO } from '../dtos/verify-payment.dto';

export class PaymentDTOMapper {
  public static toResponseDTO(payment: Payment): PaymentResponseDTO {
    const pricing = payment.pricing.toPrimitives();
    const sub = payment.subscription.toPrimitives();
    const payout = payment.payout.toPrimitives();
    const inv = payment.invoice.toPrimitives();
    const settlement = payment.settlement ? payment.settlement.toPrimitives() : null;

    return {
      id: payment.paymentId,
      offerId: payment.offerId,
      acquisitionPipelineId: payment.acquisitionPipelineId,
      clientId: payment.clientId,
      trainerId: payment.trainerId,
      pricing: {
        trainerFee: pricing.trainerFee,
        platformFee: pricing.platformFee,
        totalAmount: pricing.totalAmount,
        currency: pricing.currency,
      },
      status: payment.status,
      providerOrderId: payment.providerOrderId || null,
      providerPaymentId: payment.providerPaymentId || null,
      subscription: {
        id: sub.subscriptionId,
        status: sub.status,
        coachingRelationshipId: sub.coachingRelationshipId || null,
        startDate: sub.startDate ? sub.startDate.toISOString() : null,
        endDate: sub.endDate ? sub.endDate.toISOString() : null,
        sessionsIncluded: sub.sessionsIncluded,
        sessionsRemaining: sub.sessionsRemaining,
      },
      payout: {
        id: payout.payoutId,
        amount: payout.amount,
        status: payout.status,
        eligibleAt: payout.eligibleAt ? payout.eligibleAt.toISOString() : null,
        processedAt: payout.processedAt ? payout.processedAt.toISOString() : null,
      },
      invoice: {
        id: inv.invoiceId,
        invoiceNumber: inv.invoiceNumber,
        totalAmount: inv.totalAmount,
        currency: inv.currency,
        issuedAt: inv.issuedAt.toISOString(),
        pdfUrl: inv.pdfUrl || null,
      },
      settlement: settlement
        ? {
            id: settlement.settlementId,
            trainerAmount: settlement.trainerAmount,
            platformAmount: settlement.platformAmount,
            settledAt: settlement.settledAt.toISOString(),
          }
        : null,
      transactions: payment.transactions.map((t) => {
        const p = t.toPrimitives();
        return {
          transactionId: p.transactionId,
          providerTransactionId: p.providerTransactionId || null,
          type: p.type,
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          processedAt: p.processedAt.toISOString(),
        };
      }),
      refunds: payment.refunds.map((r) => {
        const p = r.toPrimitives();
        return {
          refundId: p.refundId,
          amount: p.amount,
          currency: p.currency,
          reason: p.reason,
          type: p.type,
          status: p.status,
          adminNotes: p.adminNotes || null,
          createdAt: p.createdAt.toISOString(),
          processedAt: p.processedAt ? p.processedAt.toISOString() : null,
        };
      }),
      disputes: payment.disputes.map((d) => {
        const p = d.toPrimitives();
        return {
          disputeId: p.disputeId,
          reason: p.reason,
          status: p.status,
          raisedBy: p.raisedBy,
          evidence: p.evidence || null,
          resolutionNotes: p.resolutionNotes || null,
          createdAt: p.createdAt.toISOString(),
          resolvedAt: p.resolvedAt ? p.resolvedAt.toISOString() : null,
        };
      }),
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }

  public static toInitiateResponseDTO(
    payment: Payment,
    providerOrderId: string,
    keyId: string,
  ): InitiatePaymentResponseDTO {
    const pricing = payment.pricing.toPrimitives();
    return {
      paymentId: payment.paymentId,
      offerId: payment.offerId,
      providerOrderId,
      keyId,
      amount: pricing.totalAmount,
      currency: pricing.currency,
      status: payment.status,
      trainerFee: pricing.trainerFee,
      platformFee: pricing.platformFee,
      totalAmount: pricing.totalAmount,
    };
  }

  public static toVerifyResponseDTO(payment: Payment): VerifyPaymentResponseDTO {
    return {
      paymentId: payment.paymentId,
      offerId: payment.offerId,
      status: payment.status,
      providerPaymentId: payment.providerPaymentId || '',
      providerOrderId: payment.providerOrderId || '',
      totalAmount: payment.pricing.totalAmount,
      currency: payment.pricing.currency,
      verifiedAt: payment.updatedAt.toISOString(),
    };
  }

  public static toInvoiceResponseDTO(payment: Payment): InvoiceResponseDTO {
    const inv = payment.invoice.toPrimitives();
    return {
      invoiceId: inv.invoiceId,
      paymentId: payment.paymentId,
      invoiceNumber: inv.invoiceNumber,
      clientId: payment.clientId,
      trainerId: payment.trainerId,
      trainerFee: inv.trainerFee,
      platformFee: inv.platformFee,
      totalAmount: inv.totalAmount,
      currency: inv.currency,
      issuedAt: inv.issuedAt.toISOString(),
      pdfUrl: inv.pdfUrl || null,
      status: payment.status,
    };
  }

  public static toRefundDetailsDTO(
    payment: Payment,
    refundId: string,
  ): import('../dtos/refund.dto').RefundDetailsDTO | null {
    const refund = payment.refunds.find((r) => r.refundId === refundId);
    if (!refund) return null;
    const p = refund.toPrimitives();
    return {
      refundId: p.refundId,
      paymentId: payment.paymentId,
      clientId: payment.clientId,
      trainerId: payment.trainerId,
      amount: p.amount,
      currency: p.currency,
      reason: p.reason,
      type: p.type,
      status: p.status,
      adminNotes: p.adminNotes || null,
      adminId: p.adminId || null,
      gatewayRefundId: p.gatewayRefundId || null,
      createdAt: p.createdAt.toISOString(),
      reviewedAt: p.reviewedAt ? p.reviewedAt.toISOString() : null,
      processedAt: p.processedAt ? p.processedAt.toISOString() : null,
    };
  }

  public static toDisputeDetailsDTO(
    payment: Payment,
    disputeId: string,
  ): import('../dtos/dispute.dto').DisputeDetailsDTO | null {
    const dispute = payment.disputes.find((d) => d.disputeId === disputeId);
    if (!dispute) return null;
    const p = dispute.toPrimitives();
    return {
      disputeId: p.disputeId,
      paymentId: payment.paymentId,
      reason: p.reason,
      status: p.status,
      raisedBy: p.raisedBy,
      evidence: p.evidence || null,
      resolutionNotes: p.resolutionNotes || null,
      resolvedAt: p.resolvedAt ? p.resolvedAt.toISOString() : null,
      closedAt: p.closedAt ? p.closedAt.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  public static toPayoutDetailsDTO(
    payment: Payment,
  ): import('../dtos/payout.dto').PayoutDetailsDTO {
    const p = payment.payout.toPrimitives();
    return {
      payoutId: p.payoutId,
      paymentId: payment.paymentId,
      trainerId: p.trainerId,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      eligibleAt: p.eligibleAt ? p.eligibleAt.toISOString() : null,
      processedAt: p.processedAt ? p.processedAt.toISOString() : null,
      gatewayPayoutId: p.gatewayPayoutId || null,
      failureReason: p.failureReason || null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  public static toSettlementDetailsDTO(
    payment: Payment,
  ): import('../dtos/payout.dto').SettlementDetailsDTO | null {
    if (!payment.settlement) return null;
    const s = payment.settlement.toPrimitives();
    return {
      settlementId: s.settlementId,
      paymentId: payment.paymentId,
      trainerAmount: s.trainerAmount,
      platformAmount: s.platformAmount,
      currency: s.currency,
      settledAt: s.settledAt.toISOString(),
    };
  }

  public static toPayoutEligibilityDTO(
    payment: Payment,
    check: {
      isEligible: boolean;
      reason?: string;
      eligibleAmount: number;
      currency: string;
      eligibleAt: Date | null;
    },
  ): import('../dtos/payout.dto').PayoutEligibilityResponseDTO {
    return {
      paymentId: payment.paymentId,
      isEligible: check.isEligible,
      eligibleAmount: check.eligibleAmount,
      currency: check.currency,
      eligibleAt: check.eligibleAt ? check.eligibleAt.toISOString() : null,
      reason: check.reason,
    };
  }
}
