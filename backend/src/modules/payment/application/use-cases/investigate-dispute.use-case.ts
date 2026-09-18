import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { InvestigateDisputeDTO, DisputeDetailsDTO } from '../dtos/dispute.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { DisputeStatus } from '../../domain/enums/dispute-status.enum';

export class InvestigateDisputeUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(dto: InvestigateDisputeDTO): Promise<Result<DisputeDetailsDTO>> {
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

      if (dispute.status === DisputeStatus.UNDER_INVESTIGATION) {
        const responseDto = PaymentDTOMapper.toDisputeDetailsDTO(payment, dispute.disputeId)!;
        return Result.ok<DisputeDetailsDTO>(responseDto);
      }

      if (dispute.status !== DisputeStatus.OPEN) {
        return Result.fail<DisputeDetailsDTO>(
          `Cannot place dispute under investigation from state '${dispute.status}'. Must be OPEN.`,
        );
      }

      payment.investigateDispute(dto.disputeId);
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toDisputeDetailsDTO(payment, dispute.disputeId)!;
      return Result.ok<DisputeDetailsDTO>(responseDto);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error during dispute investigation';
      return Result.fail<DisputeDetailsDTO>(`Failed to investigate dispute: ${message}`);
    }
  }
}
