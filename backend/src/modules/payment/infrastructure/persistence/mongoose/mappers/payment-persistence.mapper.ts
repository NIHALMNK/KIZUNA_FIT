import { Payment } from '../../../../domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../domain/value-objects/payment-pricing.value-object';
import { Settlement } from '../../../../domain/value-objects/settlement.value-object';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { Subscription } from '../../../../domain/entities/subscription.entity';
import { Refund } from '../../../../domain/entities/refund.entity';
import { Dispute } from '../../../../domain/entities/dispute.entity';
import { Payout } from '../../../../domain/entities/payout.entity';
import { Invoice } from '../../../../domain/entities/invoice.entity';
import { IPaymentDocument } from '../documents/payment.document';

export class PaymentPersistenceMapper {
  public static toDomain(doc: IPaymentDocument): Payment {
    // 1. Value Object: PaymentPricing
    const pricingResult = PaymentPricing.create({
      trainerFee: doc.pricing.trainerFee,
      platformFee: doc.pricing.platformFee,
      totalAmount: doc.pricing.totalAmount,
      currency: doc.pricing.currency,
    });

    if (pricingResult.isFailure || !pricingResult.getValue()) {
      throw new Error(`Failed to hydrate PaymentPricing: ${pricingResult.error}`);
    }

    // 2. Entities: Transactions
    const transactions = (doc.transactions || []).map((t) => {
      const txResult = Transaction.create(
        {
          providerTransactionId: t.providerTransactionId,
          type: t.type,
          amount: t.amount,
          currency: t.currency,
          status: t.status,
          processedAt: t.processedAt,
        },
        t._id,
      );
      if (txResult.isFailure || !txResult.getValue()) {
        throw new Error(`Failed to hydrate Transaction: ${txResult.error}`);
      }
      return txResult.getValue()!;
    });

    // 3. Entity: Subscription
    const subResult = Subscription.create(
      {
        status: doc.subscription.status,
        coachingRelationshipId: doc.subscription.coachingRelationshipId,
        startDate: doc.subscription.startDate,
        endDate: doc.subscription.endDate,
        sessionsIncluded: doc.subscription.sessionsIncluded,
        sessionsRemaining: doc.subscription.sessionsRemaining,
        activatedAt: doc.subscription.activatedAt,
        completedAt: doc.subscription.completedAt,
      },
      doc.subscription._id,
    );

    if (subResult.isFailure || !subResult.getValue()) {
      throw new Error(`Failed to hydrate Subscription: ${subResult.error}`);
    }

    // 4. Entities: Refunds
    const refunds = (doc.refunds || []).map((r) => {
      const refResult = Refund.create(
        {
          amount: r.amount,
          currency: r.currency,
          reason: r.reason,
          type: r.type,
          status: r.status,
          adminNotes: r.adminNotes,
          adminId: r.adminId,
          gatewayRefundId: r.gatewayRefundId,
          createdAt: r.createdAt,
          reviewedAt: r.reviewedAt,
          processedAt: r.processedAt,
        },
        r._id,
      );
      if (refResult.isFailure || !refResult.getValue()) {
        throw new Error(`Failed to hydrate Refund: ${refResult.error}`);
      }
      return refResult.getValue()!;
    });

    // 5. Entities: Disputes
    const disputes = (doc.disputes || []).map((d) => {
      const dspResult = Dispute.create(
        {
          reason: d.reason,
          status: d.status,
          raisedBy: d.raisedBy,
          evidence: d.evidence,
          resolutionNotes: d.resolutionNotes,
          resolvedAt: d.resolvedAt,
          closedAt: d.closedAt,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        },
        d._id,
      );
      if (dspResult.isFailure || !dspResult.getValue()) {
        throw new Error(`Failed to hydrate Dispute: ${dspResult.error}`);
      }
      return dspResult.getValue()!;
    });

    // 6. Entity: Payout
    const payoutResult = Payout.create(
      {
        trainerId: doc.payout.trainerId,
        amount: doc.payout.amount,
        currency: doc.payout.currency,
        status: doc.payout.status,
        eligibleAt: doc.payout.eligibleAt,
        processedAt: doc.payout.processedAt,
        gatewayPayoutId: doc.payout.gatewayPayoutId,
        failureReason: doc.payout.failureReason,
        createdAt: doc.payout.createdAt,
        updatedAt: doc.payout.updatedAt,
      },
      doc.payout._id,
    );

    if (payoutResult.isFailure || !payoutResult.getValue()) {
      throw new Error(`Failed to hydrate Payout: ${payoutResult.error}`);
    }

    // 7. Entity: Invoice
    const invoiceResult = Invoice.create(
      {
        invoiceNumber: doc.invoice.invoiceNumber,
        trainerFee: doc.invoice.trainerFee,
        platformFee: doc.invoice.platformFee,
        totalAmount: doc.invoice.totalAmount,
        currency: doc.invoice.currency,
        issuedAt: doc.invoice.issuedAt,
        pdfUrl: doc.invoice.pdfUrl,
      },
      doc.invoice._id,
    );

    if (invoiceResult.isFailure || !invoiceResult.getValue()) {
      throw new Error(`Failed to hydrate Invoice: ${invoiceResult.error}`);
    }

    // 8. Value Object: Settlement (Optional)
    let settlement: Settlement | null = null;
    if (doc.settlement) {
      const stlResult = Settlement.create({
        settlementId: doc.settlement._id,
        trainerAmount: doc.settlement.trainerAmount,
        platformAmount: doc.settlement.platformAmount,
        currency: doc.settlement.currency,
        settledAt: doc.settlement.settledAt,
      });
      if (stlResult.isSuccess && stlResult.getValue()) {
        settlement = stlResult.getValue()!;
      }
    }

    // 9. Construct Aggregate Root
    const paymentResult = Payment.create(
      {
        offerId: doc.offerId,
        acquisitionPipelineId: doc.acquisitionPipelineId,
        clientId: doc.clientId,
        trainerId: doc.trainerId,
        pricing: pricingResult.getValue()!,
        status: doc.status,
        providerOrderId: doc.providerOrderId,
        providerPaymentId: doc.providerPaymentId,
        transactions,
        subscription: subResult.getValue()!,
        refunds,
        disputes,
        payout: payoutResult.getValue()!,
        invoice: invoiceResult.getValue()!,
        settlement,
        version: (doc as any).__v ?? (doc as any).version ?? 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );

    if (paymentResult.isFailure || !paymentResult.getValue()) {
      throw new Error(`Failed to hydrate Payment Aggregate: ${paymentResult.error}`);
    }

    return paymentResult.getValue()!;
  }

  public static toPersistence(aggregate: Payment): Record<string, unknown> {
    const pricing = aggregate.pricing.toPrimitives();
    const subscription = aggregate.subscription.toPrimitives();
    const payout = aggregate.payout.toPrimitives();
    const invoice = aggregate.invoice.toPrimitives();
    const settlement = aggregate.settlement ? aggregate.settlement.toPrimitives() : null;

    const transactions = aggregate.transactions.map((tx) => {
      const p = tx.toPrimitives();
      return {
        _id: p.transactionId,
        providerTransactionId: p.providerTransactionId || null,
        type: p.type,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        processedAt: p.processedAt,
      };
    });

    const refunds = aggregate.refunds.map((r) => {
      const p = r.toPrimitives();
      return {
        _id: p.refundId,
        amount: p.amount,
        currency: p.currency,
        reason: p.reason,
        type: p.type,
        status: p.status,
        adminNotes: p.adminNotes || null,
        adminId: p.adminId || null,
        gatewayRefundId: p.gatewayRefundId || null,
        createdAt: p.createdAt,
        reviewedAt: p.reviewedAt || null,
        processedAt: p.processedAt || null,
      };
    });

    const disputes = aggregate.disputes.map((d) => {
      const p = d.toPrimitives();
      return {
        _id: p.disputeId,
        reason: p.reason,
        status: p.status,
        raisedBy: p.raisedBy,
        evidence: p.evidence || null,
        resolutionNotes: p.resolutionNotes || null,
        resolvedAt: p.resolvedAt || null,
        closedAt: p.closedAt || null,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return {
      _id: aggregate.paymentId,
      offerId: aggregate.offerId,
      acquisitionPipelineId: aggregate.acquisitionPipelineId,
      clientId: aggregate.clientId,
      trainerId: aggregate.trainerId,
      pricing: {
        trainerFee: pricing.trainerFee,
        platformFee: pricing.platformFee,
        totalAmount: pricing.totalAmount,
        currency: pricing.currency,
      },
      status: aggregate.status,
      providerOrderId: aggregate.providerOrderId || undefined,
      providerPaymentId: aggregate.providerPaymentId || undefined,
      transactions,
      subscription: {
        _id: subscription.subscriptionId,
        status: subscription.status,
        coachingRelationshipId: subscription.coachingRelationshipId || null,
        startDate: subscription.startDate || null,
        endDate: subscription.endDate || null,
        sessionsIncluded: subscription.sessionsIncluded,
        sessionsRemaining: subscription.sessionsRemaining,
        activatedAt: subscription.activatedAt || null,
        completedAt: subscription.completedAt || null,
      },
      refunds,
      disputes,
      payout: {
        _id: payout.payoutId,
        trainerId: payout.trainerId,
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
        eligibleAt: payout.eligibleAt || null,
        processedAt: payout.processedAt || null,
        gatewayPayoutId: payout.gatewayPayoutId || null,
        failureReason: payout.failureReason || null,
        createdAt: payout.createdAt,
        updatedAt: payout.updatedAt,
      },
      invoice: {
        _id: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        trainerFee: invoice.trainerFee,
        platformFee: invoice.platformFee,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        issuedAt: invoice.issuedAt,
        pdfUrl: invoice.pdfUrl || null,
      },
      settlement: settlement
        ? {
            _id: settlement.settlementId,
            trainerAmount: settlement.trainerAmount,
            platformAmount: settlement.platformAmount,
            currency: settlement.currency,
            settledAt: settlement.settledAt,
          }
        : null,
      __v: aggregate.version,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
