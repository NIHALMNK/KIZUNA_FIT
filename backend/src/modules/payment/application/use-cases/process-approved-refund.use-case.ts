import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { IPaymentGatewayPort } from '../ports/payment-gateway.port';
import { ProcessRefundDTO, RefundDetailsDTO } from '../dtos/refund.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { RefundStatus } from '../../domain/enums/refund-status.enum';
import {
  DisputeActiveFreezeException,
  RefundNotAllowedException,
} from '../../domain/exceptions/payment-domain.exceptions';

export class ProcessApprovedRefundUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly gatewayPort: IPaymentGatewayPort,
  ) {}

  public async execute(dto: ProcessRefundDTO): Promise<Result<RefundDetailsDTO>> {
    try {
      if (!dto.paymentId || !dto.refundId || !dto.adminId) {
        return Result.fail<RefundDetailsDTO>('PaymentId, RefundId, and AdminId are required.');
      }

      // 1. Load Payment aggregate
      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<RefundDetailsDTO>(`Payment with ID '${dto.paymentId}' was not found.`);
      }

      // 2. Payout Status & Active Dispute Check
      if (payment.payout.status === 'PAID') {
        return Result.fail<RefundDetailsDTO>(
          'Cannot process refund: Trainer payout has already been released (PAID).',
        );
      }

      if (payment.hasActiveDispute()) {
        return Result.fail<RefundDetailsDTO>(
          'Cannot process refund: An active dispute is currently open on this payment.',
        );
      }

      // 3. Provider Payment ID check
      if (!payment.providerPaymentId) {
        return Result.fail<RefundDetailsDTO>(
          'Cannot process refund: Payment has no associated provider payment reference.',
        );
      }

      // 4. Find and validate Refund entity
      const refund = payment.refunds.find((r) => r.refundId === dto.refundId);
      if (!refund) {
        return Result.fail<RefundDetailsDTO>(`Refund '${dto.refundId}' was not found on payment.`);
      }

      // Idempotency: If already processed, return success without re-invoking gateway
      if (refund.status === RefundStatus.PROCESSED) {
        const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId)!;
        return Result.ok<RefundDetailsDTO>(responseDto);
      }

      if (refund.status !== RefundStatus.APPROVED) {
        return Result.fail<RefundDetailsDTO>(
          `Cannot process refund in state '${refund.status}'. Refund must be APPROVED first.`,
        );
      }

      // 5. Execute Gateway Refund through Port
      let gatewayResult;
      try {
        gatewayResult = await this.gatewayPort.processRefund({
          providerPaymentId: payment.providerPaymentId,
          amount: refund.amount,
          currency: refund.currency,
          reason: refund.reason,
          notes: {
            paymentId: payment.paymentId,
            refundId: refund.refundId,
            adminId: dto.adminId,
          },
        });
      } catch (gatewayErr: unknown) {
        const errMessage =
          gatewayErr instanceof Error ? gatewayErr.message : 'Gateway refund failed';
        return Result.fail<RefundDetailsDTO>(
          `Payment gateway refund processing failed: ${errMessage}`,
        );
      }

      if (!gatewayResult || !gatewayResult.gatewayRefundId) {
        return Result.fail<RefundDetailsDTO>(
          'Payment gateway did not return a valid refund identifier.',
        );
      }

      // 6. Aggregate Mutation (Transitions refund to PROCESSED, records Transaction, updates payment state)
      payment.processApprovedRefund(refund.refundId, gatewayResult.gatewayRefundId);

      // 7. Atomic Persistence & Event Dispatching
      await this.paymentRepo.save(payment);

      const responseDto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId)!;
      return Result.ok<RefundDetailsDTO>(responseDto);
    } catch (error: unknown) {
      if (
        error instanceof DisputeActiveFreezeException ||
        error instanceof RefundNotAllowedException
      ) {
        return Result.fail<RefundDetailsDTO>(error.message);
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error during refund processing';
      return Result.fail<RefundDetailsDTO>(`Failed to process refund: ${message}`);
    }
  }
}
