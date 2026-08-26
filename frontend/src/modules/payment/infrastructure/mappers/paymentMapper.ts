/**
 * KIZUNAFIT - Payment Domain Mapper
 * Maps backend API DTO responses to strict, immutable frontend domain models.
 * Preserves server-authoritative financial numbers without client-side recalculation.
 */

import {
  PaymentSummary,
  PaymentDetails,
  PaymentInvoice,
  PaymentDetailsResponseDTO,
  PaymentInvoiceResponseDTO,
  PaginatedPaymentsResponseDTO,
} from '../../domain/types/payment.types';
import { PaymentRefund, RefundDetailsDTO } from '../../domain/types/refund.types';
import { PaymentDispute, DisputeDetailsDTO } from '../../domain/types/dispute.types';
import { PaymentPayout, PayoutDetailsDTO } from '../../domain/types/payout.types';
import { PaymentSettlement, SettlementDetailsDTO } from '../../domain/types/settlement.types';

export class PaymentMapper {
  public static toRefundDomain(dto: RefundDetailsDTO): PaymentRefund {
    return {
      refundId: dto.refundId,
      amount: dto.amount,
      currency: dto.currency,
      type: dto.type,
      status: dto.status,
      reason: dto.reason,
      requestedBy: dto.requestedBy,
      adminNotes: dto.adminNotes || null,
      gatewayRefundId: dto.gatewayRefundId || null,
      requestedAt: dto.requestedAt,
      reviewedAt: dto.reviewedAt || null,
      processedAt: dto.processedAt || null,
    };
  }

  public static toDisputeDomain(dto: DisputeDetailsDTO): PaymentDispute {
    return {
      disputeId: dto.disputeId,
      status: dto.status,
      reason: dto.reason,
      raisedBy: dto.raisedBy,
      evidence: dto.evidence || null,
      resolutionNotes: dto.resolutionNotes || null,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      resolvedAt: dto.resolvedAt || null,
      closedAt: dto.closedAt || null,
    };
  }

  public static toPayoutDomain(dto: PayoutDetailsDTO): PaymentPayout {
    return {
      payoutId: dto.payoutId,
      amount: dto.amount,
      currency: dto.currency,
      status: dto.status,
      eligibleAt: dto.eligibleAt || null,
      processedAt: dto.processedAt || null,
      gatewayPayoutId: dto.gatewayPayoutId || null,
      failureReason: dto.failureReason || null,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  public static toSettlementDomain(dto: SettlementDetailsDTO): PaymentSettlement {
    return {
      settlementId: dto.settlementId,
      trainerAmount: dto.trainerAmount,
      platformAmount: dto.platformAmount,
      currency: dto.currency,
      settledAt: dto.settledAt,
    };
  }

  public static toInvoiceDomain(dto: PaymentInvoiceResponseDTO): PaymentInvoice {
    return {
      invoiceNumber: dto.invoiceNumber,
      paymentId: dto.paymentId,
      offerId: dto.offerId,
      issuedAt: dto.issuedAt,
      client: {
        id: dto.client.id,
      },
      trainer: {
        id: dto.trainer.id,
      },
      lineItems: {
        description: dto.lineItems.description,
        trainerFee: dto.lineItems.trainerFee,
        platformFee: dto.lineItems.platformFee,
        totalAmount: dto.lineItems.totalAmount,
        currency: dto.lineItems.currency,
      },
      paidAt: dto.paidAt || null,
      providerPaymentId: dto.providerPaymentId || null,
    };
  }

  public static toSummaryDomain(dto: any): PaymentSummary {
    const hasActiveDispute = Boolean(
      dto.hasActiveDispute ||
      (Array.isArray(dto.disputes) &&
        dto.disputes.some(
          (d: any) =>
            d.status === 'OPEN' ||
            d.status === 'UNDER_INVESTIGATION' ||
            d.status === 'UNDER_REVIEW' ||
            d.status === 'REQUIRES_ACTION',
        )),
    );

    return {
      paymentId: dto.paymentId || dto.id || '',
      offerId: dto.offerId || '',
      acquisitionPipelineId: dto.acquisitionPipelineId || null,
      clientId: dto.clientId || '',
      trainerId: dto.trainerId || '',
      pricing: {
        trainerFee: dto.pricing?.trainerFee ?? 0,
        platformFee: dto.pricing?.platformFee ?? 0,
        totalAmount: dto.pricing?.totalAmount ?? 0,
        currency: dto.pricing?.currency || 'INR',
        commissionRate: dto.pricing?.commissionRate ?? 0,
      },
      status: dto.status,
      providerOrderId: dto.providerOrderId || null,
      providerPaymentId: dto.providerPaymentId || null,
      hasActiveDispute,
      subscriptionStatus: dto.subscription?.status || dto.subscriptionStatus,
      payout: dto.payout ? PaymentMapper.toPayoutDomain(dto.payout) : undefined,
      settlement: dto.settlement ? PaymentMapper.toSettlementDomain(dto.settlement) : null,
      createdAt: dto.createdAt || new Date().toISOString(),
      updatedAt: dto.updatedAt || new Date().toISOString(),
    };
  }

  public static toPaginatedPaymentsDomain(dto: any): PaginatedPaymentsResponseDTO {
    if (!dto) {
      return { data: [], total: 0, page: 1, limit: 20 };
    }

    const rawList = Array.isArray(dto.payments)
      ? dto.payments
      : Array.isArray(dto.data)
        ? dto.data
        : Array.isArray(dto)
          ? dto
          : [];

    const payments = rawList.map((p: any) => PaymentMapper.toSummaryDomain(p));
    const total = typeof dto.total === 'number' ? dto.total : payments.length;
    const limit = typeof dto.limit === 'number' ? dto.limit : 20;
    const page =
      typeof dto.page === 'number'
        ? dto.page
        : typeof dto.offset === 'number'
          ? Math.floor(dto.offset / limit) + 1
          : 1;

    return {
      data: payments,
      total,
      page,
      limit,
    };
  }

  public static toPaymentDetailsDomain(dto: PaymentDetailsResponseDTO): PaymentDetails {
    return {
      paymentId: dto.paymentId,
      offerId: dto.offerId,
      acquisitionPipelineId: dto.acquisitionPipelineId || null,
      clientId: dto.clientId,
      trainerId: dto.trainerId,
      pricing: {
        trainerFee: dto.pricing.trainerFee,
        platformFee: dto.pricing.platformFee,
        totalAmount: dto.pricing.totalAmount,
        currency: dto.pricing.currency,
        commissionRate: dto.pricing.commissionRate,
      },
      status: dto.status,
      providerOrderId: dto.providerOrderId || null,
      providerPaymentId: dto.providerPaymentId || null,
      transactions: (dto.transactions || []).map((tx) => ({
        transactionId: tx.transactionId,
        providerTransactionId: tx.providerTransactionId,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        createdAt: tx.createdAt,
      })),
      subscription: {
        subscriptionId: dto.subscription.subscriptionId,
        status: dto.subscription.status,
        startDate: dto.subscription.startDate || null,
        endDate: dto.subscription.endDate || null,
        sessionsIncluded: dto.subscription.sessionsIncluded,
        sessionsRemaining: dto.subscription.sessionsRemaining,
        coachingRelationshipId: dto.subscription.coachingRelationshipId || null,
        activatedAt: dto.subscription.activatedAt || null,
        completedAt: dto.subscription.completedAt || null,
      },
      refunds: (dto.refunds || []).map((r) => PaymentMapper.toRefundDomain(r)),
      disputes: (dto.disputes || []).map((d) => PaymentMapper.toDisputeDomain(d)),
      payout: PaymentMapper.toPayoutDomain(dto.payout),
      settlement: dto.settlement ? PaymentMapper.toSettlementDomain(dto.settlement) : null,
      hasActiveDispute: Boolean(dto.hasActiveDispute),
      isLockedByDispute: Boolean(dto.isLockedByDispute),
      eligiblePayoutAmount: dto.eligiblePayoutAmount,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }
}
