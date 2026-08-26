import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { CloseDisputeDTO, DisputeDetailsDTO } from '../dtos/dispute.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { DisputeStatus } from '../../domain/enums/dispute-status.enum';

export class CloseDisputeUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(dto: CloseDisputeDTO): Promise<Result<DisputeDetailsDTO>> {
    try {
      if (!dto.paymentId || !dto.disputeId || !dto.adminId) {
        return Result.fail<DisputeDetailsDTO>('PaymentId, DisputeId, and AdminId are required.');
      }

      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<DisputeDetailsDTO>(`Payment '${dto.paymentId}' not found.`);
      }

      const dispute = payment.disputes.find((d) => d.disputeId === dto.disputeId);
      if (!dispute) {
        return Result.fail<DisputeDetailsDTO>(`Dispute '${dto.disputeId}' not found on payment.`);
      }

      if (dispute.status === DisputeStatus.CLOSED) {
        const responseDto = PaymentDTOMapper.toDisputeDetailsDTO(payment, dispute.disputeId)!;
        return Result.ok<DisputeDetailsDTO>(responseDto);
      }

      if (dispute.status !== DisputeStatus.RESOLVED) {
        return Result.fail<DisputeDetailsDTO>(
          `Cannot close dispute from state '${dispute.status}'. Dispute must be RESOLVED before closing.`,
        );
      }

      payment.closeDispute(dto.disputeId);
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toDisputeDetailsDTO(payment, dispute.disputeId)!;
      return Result.ok<DisputeDetailsDTO>(responseDto);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error during dispute closing';
      return Result.fail<DisputeDetailsDTO>(`Failed to close dispute: ${message}`);
    }
  }
}
