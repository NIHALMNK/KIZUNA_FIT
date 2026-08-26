import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { RaiseDisputeDTO, DisputeDetailsDTO } from '../dtos/dispute.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';

export class RaiseDisputeUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(dto: RaiseDisputeDTO): Promise<Result<DisputeDetailsDTO>> {
    try {
      if (!dto.paymentId || !dto.reason || dto.reason.trim().length === 0 || !dto.raisedBy) {
        return Result.fail<DisputeDetailsDTO>('PaymentId, RaisedBy, and Reason are required.');
      }

      // 1. Load Payment
      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<DisputeDetailsDTO>(`Payment with ID '${dto.paymentId}' was not found.`);
      }

      // 2. Authorization (Rule 32: Client and Trainer can open disputes on own eligible payments)
      const role = (dto.requesterRole || 'CLIENT').toUpperCase();
      if (role === 'CLIENT' && payment.clientId !== dto.raisedBy) {
        return Result.fail<DisputeDetailsDTO>(
          'Forbidden: You can only raise disputes on your own payments.',
        );
      }
      if (role === 'TRAINER' && payment.trainerId !== dto.raisedBy) {
        return Result.fail<DisputeDetailsDTO>(
          'Forbidden: You can only raise disputes on your own coaching payments.',
        );
      }
      if (role !== 'CLIENT' && role !== 'TRAINER' && role !== 'ADMIN') {
        return Result.fail<DisputeDetailsDTO>('Forbidden: Unauthorized role.');
      }

      // 3. Status checks (Payment must be Successful, Payout must not be Released)
      if (payment.status !== PaymentStatus.SUCCESS) {
        return Result.fail<DisputeDetailsDTO>(
          `Cannot raise dispute on payment in state '${payment.status}'. Payment must be SUCCESS.`,
        );
      }

      if (payment.payout.status === 'PAID') {
        return Result.fail<DisputeDetailsDTO>(
          'Cannot raise dispute: Trainer payout has already been released (PAID).',
        );
      }

      // 4. Raise dispute on aggregate (freezes payout hold, appends domain event)
      const dispute = payment.raiseDispute(dto.reason.trim(), dto.raisedBy.trim(), dto.evidence);

      // 5. Persist aggregate & atomic events
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toDisputeDetailsDTO(payment, dispute.disputeId);
      if (!responseDto) {
        return Result.fail<DisputeDetailsDTO>('Failed to map created dispute.');
      }

      return Result.ok<DisputeDetailsDTO>(responseDto);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error during dispute creation';
      return Result.fail<DisputeDetailsDTO>(`Failed to raise dispute: ${message}`);
    }
  }
}
