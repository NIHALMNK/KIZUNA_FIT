import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { SettlementDetailsDTO } from '../dtos/payout.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';

export interface GetSettlementInput {
  paymentId: string;
  requesterId: string;
  requesterRole: string; // 'CLIENT' | 'TRAINER' | 'ADMIN'
}

export class GetSettlementUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(input: GetSettlementInput): Promise<Result<SettlementDetailsDTO>> {
    try {
      if (!input.paymentId) {
        return Result.fail<SettlementDetailsDTO>('PaymentId is required.');
      }

      const payment = await this.paymentRepo.findById(input.paymentId);
      if (!payment) {
        return Result.fail<SettlementDetailsDTO>(`Payment '${input.paymentId}' not found.`);
      }

      const role = (input.requesterRole || 'CLIENT').toUpperCase();
      if (role === 'TRAINER' && payment.trainerId !== input.requesterId) {
        return Result.fail<SettlementDetailsDTO>(
          'Forbidden: You can only view settlements for your coaching offers.',
        );
      }

      if (role === 'CLIENT' && payment.clientId !== input.requesterId) {
        return Result.fail<SettlementDetailsDTO>(
          'Forbidden: You can only view settlements on your own payments.',
        );
      }

      const dto = PaymentDTOMapper.toSettlementDetailsDTO(payment);
      if (!dto) {
        return Result.fail<SettlementDetailsDTO>(
          `Payment '${input.paymentId}' has not been settled yet. Payout must be confirmed (PAID) first.`,
        );
      }

      return Result.ok<SettlementDetailsDTO>(dto);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error retrieving settlement';
      return Result.fail<SettlementDetailsDTO>(`Failed to get settlement: ${message}`);
    }
  }
}
