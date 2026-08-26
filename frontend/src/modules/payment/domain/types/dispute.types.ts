/**
 * KIZUNAFIT - Dispute Domain Contracts
 * Authoritative client-facing definitions for Payment Disputes & Chargeback Freezes.
 */

export enum DisputeStatus {
  OPEN = 'OPEN',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// --- Domain Models ---

export interface PaymentDispute {
  readonly disputeId: string;
  readonly status: DisputeStatus;
  readonly reason: string;
  readonly raisedBy: string;
  readonly evidence?: string | null;
  readonly resolutionNotes?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly resolvedAt?: string | null;
  readonly closedAt?: string | null;
}

// --- API DTO Contracts ---

export interface RaiseDisputeRequestDTO {
  reason: string;
  evidence?: string;
}

export interface ResolveDisputeRequestDTO {
  resolutionNotes: string;
}

export interface DisputeDetailsDTO {
  disputeId: string;
  paymentId: string;
  status: DisputeStatus;
  reason: string;
  raisedBy: string;
  evidence?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface DisputeQueryParams {
  status?: DisputeStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedDisputesResponseDTO {
  data: DisputeDetailsDTO[];
  total: number;
  page: number;
  limit: number;
}

// --- Status Guards & Helpers ---

export const isDisputeActive = (status: DisputeStatus): boolean =>
  status === DisputeStatus.OPEN || status === DisputeStatus.UNDER_INVESTIGATION;

export const isDisputeClosed = (status: DisputeStatus): boolean => status === DisputeStatus.CLOSED;

export const isDisputeResolved = (status: DisputeStatus): boolean =>
  status === DisputeStatus.RESOLVED;
