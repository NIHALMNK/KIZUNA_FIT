/**
 * KIZUNAFIT - Payout & Settlement Repository Contract
 * Defines Trainer Payouts and Final Settlement operations.
 */

import {
  PayoutEligibilityDTO,
  PayoutDetailsDTO,
  ProcessPayoutRequestDTO,
  PayoutQueryParams,
  PaginatedPayoutsResponseDTO,
} from '../types/payout.types';
import { SettlementDetailsDTO } from '../types/settlement.types';

export interface IPayoutRepository {
  /**
   * Checks payout eligibility based on 3-day review window, disputes, and refund state.
   */
  checkEligibility(paymentId: string): Promise<PayoutEligibilityDTO>;

  /**
   * Retrieves payout status and details for a payment.
   */
  getPayout(paymentId: string): Promise<PayoutDetailsDTO>;

  /**
   * Lists payouts (Trainer sees own, Admin sees all).
   */
  listPayouts(params?: PayoutQueryParams): Promise<PaginatedPayoutsResponseDTO>;

  /**
   * Admin processes payout transfer via Razorpay Route.
   */
  processPayout(paymentId: string, payload?: ProcessPayoutRequestDTO): Promise<PayoutDetailsDTO>;

  /**
   * Admin retries a FAILED payout transfer.
   */
  retryPayout(paymentId: string): Promise<PayoutDetailsDTO>;

  /**
   * Retrieves immutable final settlement snapshot (available only when payout is PAID).
   */
  getSettlement(paymentId: string): Promise<SettlementDetailsDTO>;
}
