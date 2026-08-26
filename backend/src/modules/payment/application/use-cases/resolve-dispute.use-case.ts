import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ResolveDisputeDTO, DisputeDetailsDTO } from '../dtos/dispute.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { DisputeStatus } from '../../domain/enums/dispute-status.enum';

export class ResolveDisputeUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(dto: ResolveDisputeDTO): Promise<Result<DisputeDetailsDTO>> {
    try {
      if (!dto.paymentId || !dto.disputeId || !dto.adminId || !dto.resolutionNotes) {
        return Result.fail<DisputeDetailsDTO>(
          'PaymentId, DisputeId, AdminId, and ResolutionNotes are required.',
        );
      }

      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<DisputeDetailsDTO>(`Payment '${dto.paymentId}' not found.`);
      }

      const dispute = payment.disputes.find((d) => d.disputeId === dto.disputeId);
      if (!dispute) {
        return Result.fail<DisputeDetailsDTO>(`Dispute '${dto.disputeId}' not found on payment.`);
      }

      if (dispute.status === DisputeStatus.RESOLVED) {
        const responseDto = PaymentDTOMapper.toDisputeDetailsDTO(payment, dispute.disputeId)!;
        return Result.ok<DisputeDetailsDTO>(responseDto);
      }

      if (
        dispute.status !== DisputeStatus.OPEN &&
        dispute.status !== DisputeStatus.UNDER_INVESTIGATION
      ) {
        return Result.fail<DisputeDetailsDTO>(
          `Cannot resolve dispute in state '${dispute.status}'.`,
        );
      }

      payment.resolveDispute(dto.disputeId, dto.resolutionNotes.trim());
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toDisputeDetailsDTO(payment, dispute.disputeId)!;
      return Result.ok<DisputeDetailsDTO>(responseDto);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error during dispute resolution';
      return Result.fail<DisputeDetailsDTO>(`Failed to resolve dispute: ${message}`);
    }
  }
}
