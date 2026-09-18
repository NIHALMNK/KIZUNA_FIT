import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { DisputeDetailsDTO } from '../dtos/dispute.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';

export interface GetDisputeInput {
  paymentId: string;
  disputeId: string;
  requesterId: string;
  requesterRole: string; // 'CLIENT' | 'TRAINER' | 'ADMIN'
}

export class GetDisputeUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(input: GetDisputeInput): Promise<Result<DisputeDetailsDTO>> {
    try {
      if (!input.paymentId || !input.disputeId) {
        return Result.fail<DisputeDetailsDTO>('PaymentId and DisputeId are required.');
      }

      const payment = await this.paymentRepo.findById(input.paymentId);
      if (!payment) {
        return Result.fail<DisputeDetailsDTO>(`Payment '${input.paymentId}' not found.`);
      }

      const role = (input.requesterRole || 'CLIENT').toUpperCase();
      if (role === 'CLIENT' && payment.clientId !== input.requesterId) {
        return Result.fail<DisputeDetailsDTO>(
          'Forbidden: You can only view disputes on your own payments.',
        );
      }

      if (role === 'TRAINER' && payment.trainerId !== input.requesterId) {
        return Result.fail<DisputeDetailsDTO>(
          'Forbidden: You can only view disputes related to your coaching offers.',
        );
      }

      const dto = PaymentDTOMapper.toDisputeDetailsDTO(payment, input.disputeId);
      if (!dto) {
        return Result.fail<DisputeDetailsDTO>(`Dispute '${input.disputeId}' not found on payment.`);
      }

      return Result.ok<DisputeDetailsDTO>(dto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error retrieving dispute';
      return Result.fail<DisputeDetailsDTO>(`Failed to get dispute: ${message}`);
    }
  }
}
