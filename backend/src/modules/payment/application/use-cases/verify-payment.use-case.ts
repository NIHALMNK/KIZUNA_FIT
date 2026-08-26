import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { IPaymentGatewayPort } from '../ports/payment-gateway.port';
import { VerifyPaymentCommandDTO, VerifyPaymentResponseDTO } from '../dtos/verify-payment.dto';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import {
  PaymentNotFoundException,
  UnauthorizedPaymentException,
  PaymentVerificationFailedException,
} from '../exceptions/payment-application.exceptions';

export class VerifyPaymentUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly paymentGateway: IPaymentGatewayPort,
  ) {}

  public async execute(dto: VerifyPaymentCommandDTO): Promise<Result<VerifyPaymentResponseDTO>> {
    try {
      // 1. Load Payment aggregate
      const payment = await this.paymentRepo.findById(dto.paymentId);
      if (!payment) {
        throw new PaymentNotFoundException(dto.paymentId);
      }

      // 2. Enforce Client ownership
      if (payment.clientId !== dto.clientId) {
        throw new UnauthorizedPaymentException(dto.clientId, payment.paymentId);
      }

      // 3. Idempotency guard: If already successful, return current state
      if (payment.status === PaymentStatus.SUCCESS) {
        return Result.ok(PaymentDTOMapper.toVerifyResponseDTO(payment));
      }

      // 4. Delegate signature and gateway verification to Gateway Port
      const verification = await this.paymentGateway.verifyPayment({
        paymentId: payment.paymentId,
        providerOrderId: dto.providerOrderId,
        providerPaymentId: dto.providerPaymentId,
        providerSignature: dto.providerSignature,
      });

      if (!verification.isValid) {
        payment.markFailed(`Signature verification failed for payment ${payment.paymentId}`);
        await this.paymentRepo.save(payment);
        throw new PaymentVerificationFailedException(
          payment.paymentId,
          'Invalid gateway signature or verification payload.',
        );
      }

      // 5. Authoritative transition to SUCCESS
      payment.markSuccess(dto.providerPaymentId, dto.providerOrderId);

      // 6. Save Payment (repository dispatches PaymentSucceededEvent automatically)
      await this.paymentRepo.save(payment);

      return Result.ok(PaymentDTOMapper.toVerifyResponseDTO(payment));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.fail(error.message);
      }
      return Result.fail('An unexpected error occurred during payment verification.');
    }
  }
}
