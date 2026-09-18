import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { ICoachingOfferRepository } from '../../domain/repositories/coaching-offer.repository';
import { GetOffersQueryDTO } from '../dtos/offer-command.dto';
import { PaginatedOffersResponseDTO } from '../dtos/offer-response.dto';
import { OfferDTOMapper } from '../mappers/offer-dto.mapper';

export class ListReceivedOffersUseCase {
  constructor(private readonly offerRepo: ICoachingOfferRepository) {}

  public async execute(dto: GetOffersQueryDTO): Promise<Result<PaginatedOffersResponseDTO>> {
    try {
      const page = dto.page && dto.page > 0 ? dto.page : 1;
      const limit = dto.limit && dto.limit > 0 ? dto.limit : 10;
      const offset = (page - 1) * limit;

      const result = await this.offerRepo.findByClientId(dto.userId, {
        status: dto.status,
        sort: dto.sort,
        limit,
        offset,
      });

      return Result.ok<PaginatedOffersResponseDTO>(
        OfferDTOMapper.toPaginatedDTO(result.offers, result.total, page, limit),
      );
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<PaginatedOffersResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while retrieving received offers';
      return Result.fail<PaginatedOffersResponseDTO>(message);
    }
  }
}
