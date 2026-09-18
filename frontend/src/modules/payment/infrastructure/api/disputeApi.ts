/**
 * KIZUNAFIT - Dispute API Client
 * Encapsulates HTTP endpoints for Payment Disputes & Chargeback Freeze management.
 */

import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  RaiseDisputeRequestDTO,
  ResolveDisputeRequestDTO,
  DisputeDetailsDTO,
  DisputeQueryParams,
  PaginatedDisputesResponseDTO,
} from '../../domain/types/dispute.types';

export const disputeApi = {
  /**
   * Client or Trainer raises dispute on eligible payment (freezes payout).
   */
  raiseDispute: async (
    paymentId: string,
    payload: RaiseDisputeRequestDTO,
  ): Promise<{ status: string; data: DisputeDetailsDTO }> => {
    return httpClient.post<{ status: string; data: DisputeDetailsDTO }>(
      `/payments/${paymentId}/disputes`,
      payload,
    );
  },

  /**
   * Retrieves specific dispute details.
   */
  getDispute: async (
    paymentId: string,
    disputeId: string,
  ): Promise<{ status: string; data: DisputeDetailsDTO }> => {
    return httpClient.get<{ status: string; data: DisputeDetailsDTO }>(
      `/payments/${paymentId}/disputes/${disputeId}`,
    );
  },

  /**
   * Admin lists all disputes across payments.
   */
  listDisputes: async (
    params?: DisputeQueryParams,
  ): Promise<{ status: string; data: PaginatedDisputesResponseDTO }> => {
    return httpClient.get<{ status: string; data: PaginatedDisputesResponseDTO }>(
      '/payments/disputes',
      { params },
    );
  },

  /**
   * Admin moves dispute to UNDER_INVESTIGATION.
   */
  investigateDispute: async (
    paymentId: string,
    disputeId: string,
  ): Promise<{ status: string; data: DisputeDetailsDTO }> => {
    return httpClient.patch<{ status: string; data: DisputeDetailsDTO }>(
      `/payments/${paymentId}/disputes/${disputeId}/investigate`,
      {},
    );
  },

  /**
   * Admin resolves dispute with resolution notes.
   */
  resolveDispute: async (
    paymentId: string,
    disputeId: string,
    payload: ResolveDisputeRequestDTO,
  ): Promise<{ status: string; data: DisputeDetailsDTO }> => {
    return httpClient.patch<{ status: string; data: DisputeDetailsDTO }>(
      `/payments/${paymentId}/disputes/${disputeId}/resolve`,
      payload,
    );
  },

  /**
   * Admin closes dispute and releases payout hold if no active disputes remain.
   */
  closeDispute: async (
    paymentId: string,
    disputeId: string,
  ): Promise<{ status: string; data: DisputeDetailsDTO }> => {
    return httpClient.patch<{ status: string; data: DisputeDetailsDTO }>(
      `/payments/${paymentId}/disputes/${disputeId}/close`,
      {},
    );
  },
};
