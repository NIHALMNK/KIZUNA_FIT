export interface RequestRefundDTO {
  paymentId: string;
  requesterId: string;
  requesterRole: string; // 'CLIENT' | 'ADMIN'
  reason: string;
}

export interface ReviewRefundDTO {
  paymentId: string;
  refundId: string;
  adminId: string;
  notes?: string;
}

export interface ApproveRefundDTO {
  paymentId: string;
  refundId: string;
  adminId: string;
  notes?: string;
}

export interface RejectRefundDTO {
  paymentId: string;
  refundId: string;
  adminId: string;
  reason: string;
}

export interface ProcessRefundDTO {
  paymentId: string;
  refundId: string;
  adminId: string;
}

export interface ListRefundsQueryDTO {
  requesterId: string;
  requesterRole: string;
  status?: string;
}

export interface RefundDetailsDTO {
  refundId: string;
  paymentId: string;
  clientId: string;
  trainerId: string;
  amount: number;
  currency: string;
  reason: string;
  type: string;
  status: string;
  adminNotes?: string | null;
  adminId?: string | null;
  gatewayRefundId?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  processedAt?: string | null;
}
