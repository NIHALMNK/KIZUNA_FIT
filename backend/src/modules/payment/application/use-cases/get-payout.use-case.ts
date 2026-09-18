import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { PayoutDetailsDTO } from '../dtos/payout.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';

export interface GetPayoutInput {
  paymentId: string;
  requesterId: string;
  requesterRole: string; // 'CLIENT' | 'TRAINER' | 'ADMIN'
}

export class GetPayoutUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(input: GetPayoutInput): Promise<Result<PayoutDetailsDTO>> {
    try {
      if (!input.paymentId) {
        return Result.fail<PayoutDetailsDTO>('PaymentId is required.');
      }

      const payment = await this.paymentRepo.findById(input.paymentId);
      if (!payment) {
        return Result.fail<PayoutDetailsDTO>(`Payment '${input.paymentId}' not found.`);
      }

      const role = (input.requesterRole || 'CLIENT').toUpperCase();
      if (role === 'TRAINER' && payment.trainerId !== input.requesterId) {
        return Result.fail<PayoutDetailsDTO>(
          'Forbidden: You can only view payouts related to your coaching offers.',
        );
      }

      if (role === 'CLIENT' && payment.clientId !== input.requesterId) {
        return Result.fail<PayoutDetailsDTO>(
          'Forbidden: You can only view payouts on your own payments.',
        );
      }

      const dto = PaymentDTOMapper.toPayoutDetailsDTO(payment);
      return Result.ok<PayoutDetailsDTO>(dto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error retrieving payout';
      return Result.fail<PayoutDetailsDTO>(`Failed to get payout: ${message}`);
    }
  }
}
