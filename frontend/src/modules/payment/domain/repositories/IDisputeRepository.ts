/**
 * KIZUNAFIT - Dispute Repository Contract
 * Defines dispute lifecycle operations and payout freeze controls.
 */

import {
  RaiseDisputeRequestDTO,
  ResolveDisputeRequestDTO,
  DisputeDetailsDTO,
  DisputeQueryParams,
  PaginatedDisputesResponseDTO,
} from '../types/dispute.types';

export interface IDisputeRepository {
  /**
   * Client or Trainer raises dispute on eligible payment (freezes payout).
   */
  raiseDispute(paymentId: string, payload: RaiseDisputeRequestDTO): Promise<DisputeDetailsDTO>;

  /**
   * Retrieves specific dispute details.
   */
  getDispute(paymentId: string, disputeId: string): Promise<DisputeDetailsDTO>;

  /**
   * Admin lists all disputes across payments.
   */
  listDisputes(params?: DisputeQueryParams): Promise<PaginatedDisputesResponseDTO>;

  /**
   * Admin moves dispute to UNDER_INVESTIGATION.
   */
  investigateDispute(paymentId: string, disputeId: string): Promise<DisputeDetailsDTO>;

  /**
   * Admin resolves dispute with resolution notes.
   */
  resolveDispute(
    paymentId: string,
    disputeId: string,
    payload: ResolveDisputeRequestDTO,
  ): Promise<DisputeDetailsDTO>;

  /**
   * Admin closes dispute and releases payout hold if no active disputes remain.
   */
  closeDispute(paymentId: string, disputeId: string): Promise<DisputeDetailsDTO>;
}
