/**
 * KIZUNAFIT - Payout Repository Implementation
 */

import { IPayoutRepository } from '../../domain/repositories/IPayoutRepository';
import {
  PayoutEligibilityDTO,
  PayoutDetailsDTO,
  ProcessPayoutRequestDTO,
  PayoutQueryParams,
  PaginatedPayoutsResponseDTO,
} from '../../domain/types/payout.types';
import { SettlementDetailsDTO } from '../../domain/types/settlement.types';
import { payoutApi } from '../api/payoutApi';

export class PayoutRepositoryImpl implements IPayoutRepository {
  public async checkEligibility(paymentId: string): Promise<PayoutEligibilityDTO> {
    const res = await payoutApi.checkEligibility(paymentId);
    return res.data;
  }

  public async getPayout(paymentId: string): Promise<PayoutDetailsDTO> {
    const res = await payoutApi.getPayout(paymentId);
    return res.data;
  }

  public async listPayouts(params?: PayoutQueryParams): Promise<PaginatedPayoutsResponseDTO> {
    const res = await payoutApi.listPayouts(params);
    return res.data;
  }

  public async processPayout(
    paymentId: string,
    payload?: ProcessPayoutRequestDTO,
  ): Promise<PayoutDetailsDTO> {
    const res = await payoutApi.processPayout(paymentId, payload);
    return res.data;
  }

  public async retryPayout(paymentId: string): Promise<PayoutDetailsDTO> {
    const res = await payoutApi.retryPayout(paymentId);
    return res.data;
  }

  public async getSettlement(paymentId: string): Promise<SettlementDetailsDTO> {
    const res = await payoutApi.getSettlement(paymentId);
    return res.data;
  }
}

export const payoutRepository = new PayoutRepositoryImpl();
