import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { RefundDetailsDTO } from '../dtos/refund.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';

export interface GetRefundInput {
  paymentId: string;
  refundId: string;
  requesterId: string;
  requesterRole: string; // 'CLIENT' | 'TRAINER' | 'ADMIN'
}

export class GetRefundUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(input: GetRefundInput): Promise<Result<RefundDetailsDTO>> {
    try {
      if (!input.paymentId || !input.refundId || !input.requesterId) {
        return Result.fail<RefundDetailsDTO>('PaymentId, RefundId, and RequesterId are required.');
      }

      const payment = await this.paymentRepo.findById(input.paymentId);
      if (!payment) {
        return Result.fail<RefundDetailsDTO>(`Payment '${input.paymentId}' not found.`);
      }

      const role = (input.requesterRole || 'CLIENT').toUpperCase();
      if (role === 'CLIENT' && payment.clientId !== input.requesterId) {
        return Result.fail<RefundDetailsDTO>(
          'Forbidden: You can only view refunds for your own payments.',
        );
      }
      if (role === 'TRAINER' && payment.trainerId !== input.requesterId) {
        return Result.fail<RefundDetailsDTO>(
          'Forbidden: You can only view refunds for your associated payments.',
        );
      }

      const dto = PaymentDTOMapper.toRefundDetailsDTO(payment, input.refundId);
      if (!dto) {
        return Result.fail<RefundDetailsDTO>(`Refund '${input.refundId}' not found on payment.`);
      }

      return Result.ok<RefundDetailsDTO>(dto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return Result.fail<RefundDetailsDTO>(`Failed to get refund: ${message}`);
    }
  }
}
