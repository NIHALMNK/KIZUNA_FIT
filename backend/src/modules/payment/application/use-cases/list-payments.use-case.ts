import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ListPaymentsQueryDTO, ListPaymentsResponseDTO } from '../dtos/list-payments.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { Payment } from '../../domain/aggregates/payment.aggregate';

export class ListPaymentsUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(query: ListPaymentsQueryDTO): Promise<Result<ListPaymentsResponseDTO>> {
    try {
      const limit = query.limit || 20;
      const offset = query.offset || 0;

      let payments: Payment[] = [];

      if (query.role === 'CLIENT') {
        payments = await this.paymentRepo.listByClientId(query.userId, limit, offset);
      } else if (query.role === 'TRAINER') {
        payments = await this.paymentRepo.listByTrainerId(query.userId, limit, offset);
      } else if (query.role === 'ADMIN') {
        payments = await this.paymentRepo.listAll(limit, offset);
      } else {
        return Result.fail(`Unsupported role '${query.role}' for listing payments.`);
      }

      const responseDTOs = payments.map((p) => PaymentDTOMapper.toResponseDTO(p));

      return Result.ok({
        payments: responseDTOs,
        total: responseDTOs.length,
        limit,
        offset,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.fail(error.message);
      }
      return Result.fail('An unexpected error occurred listing payments.');
    }
  }
}
