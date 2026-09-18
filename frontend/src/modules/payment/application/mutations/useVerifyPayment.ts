/**
 * KIZUNAFIT - Payment Mutation: useVerifyPayment
 * Submits client Razorpay payment credentials to backend for cryptographic signature verification.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentRepository } from '../../infrastructure/repositories/PaymentRepositoryImpl';
import {
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
} from '../../domain/types/payment.types';
import { PAYMENT_QUERY_KEYS } from '../queryKeys';

export interface VerifyPaymentMutationParams {
  paymentId: string;
  payload: VerifyPaymentRequestDTO;
}

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<VerifyPaymentResponseDTO, Error, VerifyPaymentMutationParams>({
    mutationFn: ({ paymentId, payload }: VerifyPaymentMutationParams) =>
      paymentRepository.verifyPayment(paymentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard'] });
    },
  });
};
