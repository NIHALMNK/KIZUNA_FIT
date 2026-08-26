import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ApproveRefundDTO, RefundDetailsDTO } from '../dtos/refund.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { RefundStatus } from '../../domain/enums/refund-status.enum';

export class ApproveRefundUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(dto: ApproveRefundDTO): Promise<Result<RefundDetailsDTO>> {
    try {
      if (!dto.paymentId || !dto.refundId || !dto.adminId) {
        return Result.fail<RefundDetailsDTO>('PaymentId, RefundId, and AdminId are required.');
      }

      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<RefundDetailsDTO>(`Payment '${dto.paymentId}' not found.`);
      }

      if (payment.payout.status === 'PAID') {
        return Result.fail<RefundDetailsDTO>(
          'Cannot approve refund: Trainer payout has already been released (PAID).',
        );
      }

      if (payment.hasActiveDispute()) {
        return Result.fail<RefundDetailsDTO>(
          'Cannot approve refund: An active dispute is open on this payment.',
        );
      }

      const refund = payment.refunds.find((r) => r.refundId === dto.refundId);
      if (!refund) {
        return Result.fail<RefundDetailsDTO>(`Refund '${dto.refundId}' not found on payment.`);
      }

      if (refund.status === RefundStatus.APPROVED) {
        const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId)!;
        return Result.ok<RefundDetailsDTO>(responseDto);
      }

      if (refund.status !== RefundStatus.PENDING && refund.status !== RefundStatus.UNDER_REVIEW) {
        return Result.fail<RefundDetailsDTO>(`Cannot approve refund in state '${refund.status}'.`);
      }

      refund.approve(dto.adminId, dto.notes);
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId)!;
      return Result.ok<RefundDetailsDTO>(responseDto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error during approval';
      return Result.fail<RefundDetailsDTO>(`Failed to approve refund: ${message}`);
    }
  }
}
