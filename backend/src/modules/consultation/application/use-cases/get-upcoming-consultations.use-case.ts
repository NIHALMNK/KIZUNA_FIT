import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IConsultationRepository } from '../../domain/repositories/consultation.repository';
import { ListConsultationsQueryDTO } from '../dtos/consultation-command.dto';
import { PaginatedConsultationsResponseDTO } from '../dtos/consultation-response.dto';
import { ConsultationDTOMapper } from '../mappers/consultation-dto.mapper';

export class GetUpcomingConsultationsUseCase {
  constructor(private readonly consultationRepo: IConsultationRepository) {}

  public async execute(
    dto: ListConsultationsQueryDTO,
  ): Promise<Result<PaginatedConsultationsResponseDTO>> {
    try {
      const page = dto.page || 1;
      const limit = dto.limit || 10;
      const offset = (page - 1) * limit;

      const options = {
        status: dto.status,
        sort: dto.sort,
        limit,
        offset,
      };

      const result = dto.isTrainer
        ? await this.consultationRepo.findUpcomingByTrainerId(dto.userId, options)
        : await this.consultationRepo.findUpcomingByClientId(dto.userId, options);

      return Result.ok<PaginatedConsultationsResponseDTO>(
        ConsultationDTOMapper.toPaginatedDTO(result.consultations, result.total, page, limit),
      );
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<PaginatedConsultationsResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while listing upcoming consultations';
      return Result.fail<PaginatedConsultationsResponseDTO>(message);
    }
  }
}
