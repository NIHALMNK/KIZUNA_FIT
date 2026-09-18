import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentResponseDTO } from '../dtos/payment-response.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import {
  PaymentNotFoundException,
  UnauthorizedPaymentException,
} from '../exceptions/payment-application.exceptions';

export interface GetPaymentQueryDTO {
  paymentId: string;
  userId: string;
  role: 'CLIENT' | 'TRAINER' | 'ADMIN';
}

export class GetPaymentUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(query: GetPaymentQueryDTO): Promise<Result<PaymentResponseDTO>> {
    try {
      const payment = await this.paymentRepo.findById(query.paymentId);
      if (!payment) {
        throw new PaymentNotFoundException(query.paymentId);
      }

      // Authorization guard
      if (query.role === 'CLIENT' && payment.clientId !== query.userId) {
        throw new UnauthorizedPaymentException(query.userId, payment.paymentId);
      }

      if (query.role === 'TRAINER' && payment.trainerId !== query.userId) {
        throw new UnauthorizedPaymentException(query.userId, payment.paymentId);
      }

      return Result.ok(PaymentDTOMapper.toResponseDTO(payment));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.fail(error.message);
      }
      return Result.fail('An unexpected error occurred retrieving the payment.');
    }
  }
}
