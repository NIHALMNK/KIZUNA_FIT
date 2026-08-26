import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { CheckPayoutEligibilityDTO, PayoutEligibilityResponseDTO } from '../dtos/payout.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';

export class CheckPayoutEligibilityUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(
    dto: CheckPayoutEligibilityDTO,
  ): Promise<Result<PayoutEligibilityResponseDTO>> {
    try {
      if (!dto.paymentId) {
        return Result.fail<PayoutEligibilityResponseDTO>('PaymentId is required.');
      }

      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        return Result.fail<PayoutEligibilityResponseDTO>(
          `Payment with ID '${dto.paymentId}' was not found.`,
        );
      }

      const check = payment.checkPayoutEligibility();
      const responseDto = PaymentDTOMapper.toPayoutEligibilityDTO(payment, check);

      return Result.ok<PayoutEligibilityResponseDTO>(responseDto);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error checking payout eligibility';
      return Result.fail<PayoutEligibilityResponseDTO>(
        `Failed to check payout eligibility: ${message}`,
      );
    }
  }
}
