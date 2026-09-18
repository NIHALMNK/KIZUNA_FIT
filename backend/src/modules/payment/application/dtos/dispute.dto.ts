/**
 * Dispute Application DTOs.
 * Defines input/output schemas for Dispute management and active freeze lifecycle.
 */

export interface RaiseDisputeDTO {
  paymentId: string;
  reason: string;
  raisedBy: string;
  requesterRole?: string; // 'CLIENT' | 'ADMIN'
  evidence?: string;
}

export interface InvestigateDisputeDTO {
  paymentId: string;
  disputeId: string;
  adminId: string;
}

export interface ResolveDisputeDTO {
  paymentId: string;
  disputeId: string;
  adminId: string;
  resolutionNotes: string;
}

export interface CloseDisputeDTO {
  paymentId: string;
  disputeId: string;
  adminId: string;
}

export interface ListDisputesQueryDTO {
  paymentId?: string;
  status?: string;
  clientId?: string;
  trainerId?: string;
}

export interface DisputeDetailsDTO {
  disputeId: string;
  paymentId: string;
  reason: string;
  status: string; // 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'CLOSED'
  raisedBy: string;
  evidence?: string | null;
  resolutionNotes?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
