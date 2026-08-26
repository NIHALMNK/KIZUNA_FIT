/**
 * KIZUNAFIT - Payment Repository Implementation
 */

import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import {
  InitiatePaymentResponseDTO,
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
  PaymentQueryParams,
  PaginatedPaymentsResponseDTO,
  PaymentDetails,
  PaymentInvoice,
} from '../../domain/types/payment.types';
import { paymentApi } from '../api/paymentApi';
import { PaymentMapper } from '../mappers/paymentMapper';

export class PaymentRepositoryImpl implements IPaymentRepository {
  public async initiatePayment(offerId: string): Promise<InitiatePaymentResponseDTO> {
    const res = await paymentApi.initiatePayment({ offerId });
    return res.data;
  }

  public async verifyPayment(
    paymentId: string,
    payload: VerifyPaymentRequestDTO,
  ): Promise<VerifyPaymentResponseDTO> {
    const res = await paymentApi.verifyPayment(paymentId, payload);
    return res.data;
  }

  public async getPayment(paymentId: string): Promise<PaymentDetails> {
    const res = await paymentApi.getPaymentById(paymentId);
    return PaymentMapper.toPaymentDetailsDomain(res.data);
  }

  public async listPayments(params?: PaymentQueryParams): Promise<PaginatedPaymentsResponseDTO> {
    const res = await paymentApi.listPayments(params);
    return PaymentMapper.toPaginatedPaymentsDomain(res.data);
  }

  public async getInvoice(paymentId: string): Promise<PaymentInvoice> {
    const res = await paymentApi.getInvoice(paymentId);
    return PaymentMapper.toInvoiceDomain(res.data);
  }
}

export const paymentRepository = new PaymentRepositoryImpl();
