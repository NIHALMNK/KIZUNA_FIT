/**
 * KIZUNAFIT - Dispute Repository Implementation
 */

import { IDisputeRepository } from '../../domain/repositories/IDisputeRepository';
import {
  RaiseDisputeRequestDTO,
  ResolveDisputeRequestDTO,
  DisputeDetailsDTO,
  DisputeQueryParams,
  PaginatedDisputesResponseDTO,
} from '../../domain/types/dispute.types';
import { disputeApi } from '../api/disputeApi';

export class DisputeRepositoryImpl implements IDisputeRepository {
  public async raiseDispute(
    paymentId: string,
    payload: RaiseDisputeRequestDTO,
  ): Promise<DisputeDetailsDTO> {
    const res = await disputeApi.raiseDispute(paymentId, payload);
    return res.data;
  }

  public async getDispute(paymentId: string, disputeId: string): Promise<DisputeDetailsDTO> {
    const res = await disputeApi.getDispute(paymentId, disputeId);
    return res.data;
  }

  public async listDisputes(params?: DisputeQueryParams): Promise<PaginatedDisputesResponseDTO> {
    const res = await disputeApi.listDisputes(params);
    return res.data;
  }

  public async investigateDispute(
    paymentId: string,
    disputeId: string,
  ): Promise<DisputeDetailsDTO> {
    const res = await disputeApi.investigateDispute(paymentId, disputeId);
    return res.data;
  }

  public async resolveDispute(
    paymentId: string,
    disputeId: string,
    payload: ResolveDisputeRequestDTO,
  ): Promise<DisputeDetailsDTO> {
    const res = await disputeApi.resolveDispute(paymentId, disputeId, payload);
    return res.data;
  }

  public async closeDispute(paymentId: string, disputeId: string): Promise<DisputeDetailsDTO> {
    const res = await disputeApi.closeDispute(paymentId, disputeId);
    return res.data;
  }
}

export const disputeRepository = new DisputeRepositoryImpl();
