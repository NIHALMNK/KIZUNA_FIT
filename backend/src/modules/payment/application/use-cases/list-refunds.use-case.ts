import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ListRefundsQueryDTO, RefundDetailsDTO } from '../dtos/refund.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';

export class ListRefundsUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(query: ListRefundsQueryDTO): Promise<Result<RefundDetailsDTO[]>> {
    try {
      const role = (query.requesterRole || 'CLIENT').toUpperCase();
      let payments: import('../../domain/aggregates/payment.aggregate').Payment[] = [];

      if (role === 'ADMIN') {
        payments = await this.paymentRepo.listAll();
      } else if (role === 'CLIENT') {
        payments = await this.paymentRepo.listByClientId(query.requesterId);
      } else if (role === 'TRAINER') {
        payments = await this.paymentRepo.listByTrainerId(query.requesterId);
      } else {
        return Result.fail<RefundDetailsDTO[]>('Unauthorized role for listing refunds.');
      }

      const allRefunds: RefundDetailsDTO[] = [];

      for (const payment of payments) {
        for (const refund of payment.refunds) {
          if (!query.status || refund.status === query.status) {
            const dto = PaymentDTOMapper.toRefundDetailsDTO(payment, refund.refundId);
            if (dto) {
              allRefunds.push(dto);
            }
          }
        }
      }

      // Sort recent first
      allRefunds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return Result.ok<RefundDetailsDTO[]>(allRefunds);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return Result.fail<RefundDetailsDTO[]>(`Failed to list refunds: ${message}`);
    }
  }
}
