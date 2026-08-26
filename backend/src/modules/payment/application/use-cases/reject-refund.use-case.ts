import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { RejectRefundDTO, RefundDetailsDTO } from '../dtos/refund.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { RefundStatus } from '../../domain/enums/refund-status.enum';

export class RejectRefundUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(dto: RejectRefundDTO): Promise<Result<RefundDetailsDTO>> {
    try {
      if (
        !dto.paymentId ||
        !dto.refundId ||
        !dto.adminId ||
        !dto.reason ||
        dto.reason.trim().length === 0
      ) {
        return Result.fail<RefundDetailsDTO>(
          'PaymentId, RefundId, AdminId, and Rejection Reason are required.',
        );
      }

      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<RefundDetailsDTO>(`Payment '${dto.paymentId}' not found.`);
      }

      const refund = payment.refunds.find((r) => r.refundId === dto.refundId);
      if (!refund) {
        return Result.fail<RefundDetailsDTO>(`Refund '${dto.refundId}' not found on payment.`);
      }

      if (refund.status === RefundStatus.REJECTED) {
        const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId)!;
        return Result.ok<RefundDetailsDTO>(responseDto);
      }

      if (refund.status === RefundStatus.PROCESSED || refund.status === RefundStatus.CANCELLED) {
        return Result.fail<RefundDetailsDTO>(
          `Cannot reject refund in terminal state '${refund.status}'.`,
        );
      }

      refund.reject(dto.adminId, dto.reason.trim());
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId)!;
      return Result.ok<RefundDetailsDTO>(responseDto);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error during rejection';
      return Result.fail<RefundDetailsDTO>(`Failed to reject refund: ${message}`);
    }
  }
}
