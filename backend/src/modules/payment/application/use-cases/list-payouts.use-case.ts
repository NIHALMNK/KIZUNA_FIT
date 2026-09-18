import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ListPayoutsQueryDTO, PayoutDetailsDTO } from '../dtos/payout.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { Payment } from '../../domain/aggregates/payment.aggregate';

export class ListPayoutsUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(query: ListPayoutsQueryDTO): Promise<Result<PayoutDetailsDTO[]>> {
    try {
      let payments: Payment[] = [];
      if (query.trainerId) {
        payments = await this.paymentRepo.listByTrainerId(
          query.trainerId,
          query.limit,
          query.offset,
        );
      } else {
        payments = await this.paymentRepo.listAll(query.limit, query.offset);
      }

      const dtos: PayoutDetailsDTO[] = [];
      for (const payment of payments) {
        if (!query.status || payment.payout.status.toUpperCase() === query.status.toUpperCase()) {
          dtos.push(PaymentDTOMapper.toPayoutDetailsDTO(payment));
        }
      }

      // Sort recent first
      dtos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return Result.ok<PayoutDetailsDTO[]>(dtos);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error listing payouts';
      return Result.fail<PayoutDetailsDTO[]>(`Failed to list payouts: ${message}`);
    }
  }
}
