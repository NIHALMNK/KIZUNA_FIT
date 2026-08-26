import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { IPaymentGatewayPort } from '../ports/payment-gateway.port';
import { ProcessPayoutDTO, PayoutDetailsDTO } from '../dtos/payout.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { PayoutStatus } from '../../domain/enums/payout-status.enum';
import {
  DisputeActiveFreezeException,
  PayoutNotEligibleException,
} from '../../domain/exceptions/payment-domain.exceptions';

export class ProcessPayoutUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly gatewayPort: IPaymentGatewayPort,
  ) {}

  public async execute(dto: ProcessPayoutDTO): Promise<Result<PayoutDetailsDTO>> {
    try {
      if (!dto.paymentId) {
        return Result.fail<PayoutDetailsDTO>('PaymentId is required.');
      }

      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<PayoutDetailsDTO>(`Payment with ID '${dto.paymentId}' was not found.`);
      }

      // Idempotency check: if already PAID, return successfully without re-triggering gateway
      if (payment.payout.status === PayoutStatus.PAID) {
        return Result.ok<PayoutDetailsDTO>(PaymentDTOMapper.toPayoutDetailsDTO(payment));
      }

      // Active Dispute & Eligibility validation
      if (payment.hasActiveDispute()) {
        return Result.fail<PayoutDetailsDTO>(
          'Cannot process payout: Payment is ON_HOLD due to an active dispute.',
        );
      }

      const check = payment.checkPayoutEligibility();
      if (!check.isEligible) {
        return Result.fail<PayoutDetailsDTO>(`Payout is not eligible: ${check.reason}`);
      }

      // 1. Move to PROCESSING and persist
      payment.startProcessingPayout();
      await this.paymentRepo.save(payment);

      // 2. Execute provider payout via gateway port
      try {
        const gatewayResult = await this.gatewayPort.processPayout({
          paymentId: payment.paymentId,
          payoutId: payment.payout.payoutId,
          trainerId: payment.trainerId,
          amount: payment.payout.amount,
          currency: payment.payout.currency,
          idempotencyKey: dto.idempotencyKey || payment.payout.payoutId,
          notes: {
            paymentId: payment.paymentId,
            trainerId: payment.trainerId,
            adminId: dto.adminId || 'system',
          },
        });

        if (gatewayResult.status === 'FAILED') {
          payment.failPayout(gatewayResult.failureReason || 'Provider payout failed.');
          await this.paymentRepo.save(payment);
          return Result.fail<PayoutDetailsDTO>(
            `Gateway payout failed: ${gatewayResult.failureReason}`,
          );
        }

        // 3. Mark PAID, append PAYOUT Transaction, and create Settlement snapshot
        payment.recordSuccessfulPayout(gatewayResult.gatewayPayoutId);
        await this.paymentRepo.save(payment);

        return Result.ok<PayoutDetailsDTO>(PaymentDTOMapper.toPayoutDetailsDTO(payment));
      } catch (gatewayErr: unknown) {
        const errorMsg =
          gatewayErr instanceof Error ? gatewayErr.message : 'Gateway provider error';
        payment.failPayout(errorMsg);
        await this.paymentRepo.save(payment);
        return Result.fail<PayoutDetailsDTO>(`Provider payout execution error: ${errorMsg}`);
      }
    } catch (error: unknown) {
      if (
        error instanceof DisputeActiveFreezeException ||
        error instanceof PayoutNotEligibleException
      ) {
        return Result.fail<PayoutDetailsDTO>(error.message);
      }
      const message = error instanceof Error ? error.message : 'Unknown payout error';
      return Result.fail<PayoutDetailsDTO>(`Failed to process payout: ${message}`);
    }
  }
}
