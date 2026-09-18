export interface ExceptionalRefundCalculationResult {
  approvedRefundAmount: number;
  eligibleTrainerPayout: number;
  retainedPlatformCommission: number;
  currency: string;
}

/**
 * Domain Policy: Exceptional Trainer-Fee Refund Policy (Rules 29-31).
 *
 * KIZUNAFIT does not support normal/client-initiated discretionary partial refunds.
 * Refunds exist ONLY as an Admin-approved service-failure remedy.
 *
 * Financial Rule:
 * - approvedRefundAmount = immutable trainerFee from PaymentPricing.
 * - platformFee is 100% non-refundable and retained by the platform.
 * - Trainer receives ₹0 payout when an exceptional service-failure refund is approved.
 */
export class ExceptionalTrainerFeeRefundPolicy {
  public static calculateApprovedRefund(
    trainerFee: number,
    platformFee: number,
    currency: string,
  ): ExceptionalRefundCalculationResult {
    return {
      approvedRefundAmount: trainerFee,
      eligibleTrainerPayout: 0,
      retainedPlatformCommission: platformFee,
      currency,
    };
  }

  public static calculatePayoutEligibility(
    trainerFee: number,
    platformFee: number,
    hasApprovedOrProcessedRefund: boolean,
    currency: string,
  ): ExceptionalRefundCalculationResult {
    return {
      approvedRefundAmount: hasApprovedOrProcessedRefund ? trainerFee : 0,
      eligibleTrainerPayout: hasApprovedOrProcessedRefund ? 0 : trainerFee,
      retainedPlatformCommission: platformFee,
      currency,
    };
  }
}
