import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ReviewRefundDTO, RefundDetailsDTO } from '../dtos/refund.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { RefundStatus } from '../../domain/enums/refund-status.enum';

export class ReviewRefundUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(dto: ReviewRefundDTO): Promise<Result<RefundDetailsDTO>> {
    try {
      if (!dto.paymentId || !dto.refundId || !dto.adminId) {
        return Result.fail<RefundDetailsDTO>('PaymentId, RefundId, and AdminId are required.');
      }

      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<RefundDetailsDTO>(`Payment '${dto.paymentId}' not found.`);
      }

      const refund = payment.refunds.find((r) => r.refundId === dto.refundId);
      if (!refund) {
        return Result.fail<RefundDetailsDTO>(`Refund '${dto.refundId}' not found on payment.`);
      }

      if (refund.status === RefundStatus.UNDER_REVIEW) {
        // Idempotent success
        const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId)!;
        return Result.ok<RefundDetailsDTO>(responseDto);
      }

      if (refund.status !== RefundStatus.PENDING) {
        return Result.fail<RefundDetailsDTO>(
          `Cannot place refund under review from state '${refund.status}'.`,
        );
      }

      refund.putUnderReview(dto.adminId, dto.notes);
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId)!;
      return Result.ok<RefundDetailsDTO>(responseDto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error during review';
      return Result.fail<RefundDetailsDTO>(`Failed to put refund under review: ${message}`);
    }
  }
}
