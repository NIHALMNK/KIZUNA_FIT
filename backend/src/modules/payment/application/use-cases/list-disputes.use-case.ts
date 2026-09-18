import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { ListDisputesQueryDTO, DisputeDetailsDTO } from '../dtos/dispute.dto';
import { PaymentDTOMapper } from '../mappers/payment-dto.mapper';
import { Payment } from '../../domain/aggregates/payment.aggregate';

export class ListDisputesUseCase {
  constructor(private readonly paymentRepo: IPaymentRepository) {}

  public async execute(query: ListDisputesQueryDTO): Promise<Result<DisputeDetailsDTO[]>> {
    try {
      if (query.paymentId) {
        const payment = await this.paymentRepo.findById(query.paymentId);
        if (!payment) {
          return Result.fail<DisputeDetailsDTO[]>(`Payment '${query.paymentId}' not found.`);
        }

        let disputes = payment.disputes.map((d) =>
          PaymentDTOMapper.toDisputeDetailsDTO(payment, d.disputeId)!,
        );
        if (query.status) {
          disputes = disputes.filter((d) => d.status.toUpperCase() === query.status!.toUpperCase());
        }

        return Result.ok<DisputeDetailsDTO[]>(disputes);
      }

      let payments: Payment[] = [];
      if (query.clientId) {
        payments = await this.paymentRepo.listByClientId(query.clientId);
      } else if (query.trainerId) {
        payments = await this.paymentRepo.listByTrainerId(query.trainerId);
      } else {
        payments = await this.paymentRepo.listAll();
      }

      const allDisputes: DisputeDetailsDTO[] = [];

      for (const payment of payments) {
        for (const d of payment.disputes) {
          if (!query.status || d.status.toUpperCase() === query.status.toUpperCase()) {
            const dto = PaymentDTOMapper.toDisputeDetailsDTO(payment, d.disputeId);
            if (dto) {
              allDisputes.push(dto);
            }
          }
        }
      }

      // Sort recent first
      allDisputes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return Result.ok<DisputeDetailsDTO[]>(allDisputes);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error listing disputes';
      return Result.fail<DisputeDetailsDTO[]>(`Failed to list disputes: ${message}`);
    }
  }
}
