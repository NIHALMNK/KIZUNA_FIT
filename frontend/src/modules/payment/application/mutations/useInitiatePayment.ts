/**
 * KIZUNAFIT - Payment Mutation: useInitiatePayment
 * Requests payment initiation for an accepted offer.
 * Strictly sends { offerId: string } to preserve server-side financial authority.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentRepository } from '../../infrastructure/repositories/PaymentRepositoryImpl';
import {
  InitiatePaymentRequestDTO,
  InitiatePaymentResponseDTO,
} from '../../domain/types/payment.types';
import { PAYMENT_QUERY_KEYS } from '../queryKeys';

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<InitiatePaymentResponseDTO, Error, InitiatePaymentRequestDTO>({
    mutationFn: (payload: InitiatePaymentRequestDTO) =>
      paymentRepository.initiatePayment(payload.offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.lists() });
    },
  });
};
