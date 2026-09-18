/**
 * KIZUNAFIT - Payout & Settlement API Client
 * Encapsulates HTTP endpoints for Trainer Payouts, Escrow Reviews, and Final Settlement snapshots.
 */

import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  PayoutEligibilityDTO,
  PayoutDetailsDTO,
  ProcessPayoutRequestDTO,
  PayoutQueryParams,
  PaginatedPayoutsResponseDTO,
} from '../../domain/types/payout.types';
import { SettlementDetailsDTO } from '../../domain/types/settlement.types';

export const payoutApi = {
  /**
   * Checks payout eligibility (3-day review window, active disputes, refund state).
   */
  checkEligibility: async (
    paymentId: string,
  ): Promise<{ status: string; data: PayoutEligibilityDTO }> => {
    return httpClient.get<{ status: string; data: PayoutEligibilityDTO }>(
      `/payments/${paymentId}/payout/eligibility`,
    );
  },

  /**
   * Retrieves payout status and details for a payment.
   */
  getPayout: async (paymentId: string): Promise<{ status: string; data: PayoutDetailsDTO }> => {
    return httpClient.get<{ status: string; data: PayoutDetailsDTO }>(
      `/payments/${paymentId}/payout`,
    );
  },

  /**
   * Lists payouts (Trainer sees own, Admin sees all).
   */
  listPayouts: async (
    params?: PayoutQueryParams,
  ): Promise<{ status: string; data: PaginatedPayoutsResponseDTO }> => {
    return httpClient.get<{ status: string; data: PaginatedPayoutsResponseDTO }>(
      '/payments/payouts',
      { params },
    );
  },

  /**
   * Admin processes payout transfer via Razorpay Route.
   * Never accepts client-side payout amounts.
   */
  processPayout: async (
    paymentId: string,
    payload?: ProcessPayoutRequestDTO,
  ): Promise<{ status: string; data: PayoutDetailsDTO }> => {
    return httpClient.post<{ status: string; data: PayoutDetailsDTO }>(
      `/payments/${paymentId}/payout/process`,
      payload || {},
    );
  },

  /**
   * Admin retries a FAILED payout transfer.
   */
  retryPayout: async (paymentId: string): Promise<{ status: string; data: PayoutDetailsDTO }> => {
    return httpClient.post<{ status: string; data: PayoutDetailsDTO }>(
      `/payments/${paymentId}/payout/retry`,
      {},
    );
  },

  /**
   * Retrieves immutable final settlement snapshot (available only when payout is PAID).
   */
  getSettlement: async (
    paymentId: string,
  ): Promise<{ status: string; data: SettlementDetailsDTO }> => {
    return httpClient.get<{ status: string; data: SettlementDetailsDTO }>(
      `/payments/${paymentId}/settlement`,
    );
  },
};
