/**
 * KIZUNAFIT - Refund Repository Implementation
 */

import { IRefundRepository } from '../../domain/repositories/IRefundRepository';
import {
  RequestRefundRequestDTO,
  AdminReviewRefundRequestDTO,
  AdminApproveRefundRequestDTO,
  AdminRejectRefundRequestDTO,
  RefundDetailsDTO,
  RefundQueryParams,
  PaginatedRefundsResponseDTO,
} from '../../domain/types/refund.types';
import { refundApi } from '../api/refundApi';

export class RefundRepositoryImpl implements IRefundRepository {
  public async requestRefund(
    paymentId: string,
    payload: RequestRefundRequestDTO,
  ): Promise<RefundDetailsDTO> {
    const res = await refundApi.requestRefund(paymentId, payload);
    return res.data;
  }

  public async getRefund(paymentId: string, refundId: string): Promise<RefundDetailsDTO> {
    const res = await refundApi.getRefund(paymentId, refundId);
    return res.data;
  }

  public async listRefunds(params?: RefundQueryParams): Promise<PaginatedRefundsResponseDTO> {
    const res = await refundApi.listRefunds(params);
    return res.data;
  }

  public async reviewRefund(
    paymentId: string,
    refundId: string,
    payload?: AdminReviewRefundRequestDTO,
  ): Promise<RefundDetailsDTO> {
    const res = await refundApi.reviewRefund(paymentId, refundId, payload);
    return res.data;
  }

  public async approveRefund(
    paymentId: string,
    refundId: string,
    payload?: AdminApproveRefundRequestDTO,
  ): Promise<RefundDetailsDTO> {
    const res = await refundApi.approveRefund(paymentId, refundId, payload);
    return res.data;
  }

  public async rejectRefund(
    paymentId: string,
    refundId: string,
    payload: AdminRejectRefundRequestDTO,
  ): Promise<RefundDetailsDTO> {
    const res = await refundApi.rejectRefund(paymentId, refundId, payload);
    return res.data;
  }

  public async processApprovedRefund(
    paymentId: string,
    refundId: string,
  ): Promise<RefundDetailsDTO> {
    const res = await refundApi.processApprovedRefund(paymentId, refundId);
    return res.data;
  }
}

export const refundRepository = new RefundRepositoryImpl();
