import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { RequestRefundDTO, RefundDetailsDTO } from '../dtos/refund.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { PayoutStatus } from '../../domain/enums/payout-status.enum';
import { RefundStatus } from '../../domain/enums/refund-status.enum';
import {
  DisputeActiveFreezeException,
  RefundNotAllowedException,
} from '../../domain/exceptions/payment-domain.exceptions';

export class RequestRefundUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(dto: RequestRefundDTO): Promise<Result<RefundDetailsDTO>> {
    try {
      if (!dto.paymentId || !dto.requesterId || !dto.reason || dto.reason.trim().length === 0) {
        return Result.fail<RefundDetailsDTO>('PaymentId, RequesterId, and Reason are required.');
      }

      // 1. Authorization checks
      const role = (dto.requesterRole || 'CLIENT').toUpperCase();
      if (role === 'TRAINER') {
        return Result.fail<RefundDetailsDTO>('Trainers are not authorized to request refunds.');
      }

      // 2. Load Payment Aggregate Root
      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<RefundDetailsDTO>(`Payment with ID '${dto.paymentId}' was not found.`);
      }

      if (role === 'CLIENT' && payment.clientId !== dto.requesterId) {
        return Result.fail<RefundDetailsDTO>(
          'Forbidden: You can only request refunds on your own payments.',
        );
      }

      // 3. Financial Eligibility & Invariant Enforcement
      if (payment.status !== PaymentStatus.SUCCESS) {
        return Result.fail<RefundDetailsDTO>(
          `Payment in status '${payment.status}' is not eligible for refund. Must be SUCCESS.`,
        );
      }

      if (payment.payout.status === PayoutStatus.PAID) {
        return Result.fail<RefundDetailsDTO>(
          'Cannot request refund: Trainer payout has already been released (PAID).',
        );
      }

      if (payment.hasActiveDispute()) {
        return Result.fail<RefundDetailsDTO>(
          'Cannot request refund: An active dispute is open on this payment.',
        );
      }

      if (payment.hasActiveRefund()) {
        const existing = payment.refunds.find(
          (r) =>
            r.status === RefundStatus.PENDING ||
            r.status === RefundStatus.UNDER_REVIEW ||
            r.status === RefundStatus.APPROVED ||
            r.status === RefundStatus.PROCESSED,
        );
        if (existing) {
          const dtoResult = PaymentDTOMapper.toRefundDetailsDTO(payment, existing.refundId);
          if (dtoResult) {
            return Result.ok<RefundDetailsDTO>(dtoResult);
          }
        }
        return Result.fail<RefundDetailsDTO>(
          'Cannot request refund: An exceptional refund request already exists for this payment.',
        );
      }

      // 4. Aggregate State Transition (amount is strictly derived from trainerFee)
      const refund = payment.requestRefund(dto.reason.trim());

      // 5. Persistence & Atomic Event Dispatch
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId);
      if (!responseDto) {
        return Result.fail<RefundDetailsDTO>('Failed to map created refund.');
      }

      return Result.ok<RefundDetailsDTO>(responseDto);
    } catch (error: unknown) {
      if (
        error instanceof DisputeActiveFreezeException ||
        error instanceof RefundNotAllowedException
      ) {
        return Result.fail<RefundDetailsDTO>(error.message);
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error during refund request';
      return Result.fail<RefundDetailsDTO>(`Failed to request refund: ${message}`);
    }
  }
}
