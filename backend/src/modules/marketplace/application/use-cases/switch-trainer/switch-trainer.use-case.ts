import { Result } from '../../../../../shared/result/Result';
import { AppError } from '../../../../../shared/exceptions/AppError';
import { IAcquisitionPipelineRepository } from '../../../domain/repositories/acquisition-pipeline.repository';
import { IConsultationRepository } from '../../../../consultation/domain/repositories/consultation.repository';
import { CancellationActor } from '../../../../consultation/domain/enums/cancellation-actor.enum';
import { SwitchTrainerDTO, SwitchTrainerResponseDTO } from '../../dto/switch-trainer.dto';

export class NoActivePipelineToSwitchException extends AppError {
  constructor(clientId: string) {
    super(
      `No active acquisition pipeline found for Client '${clientId}' to switch trainers.`,
      'NO_ACTIVE_PIPELINE',
      true,
    );
  }
}

export class SwitchTrainerUseCase {
  constructor(
    private readonly pipelineRepo: IAcquisitionPipelineRepository,
    private readonly consultationRepo: IConsultationRepository,
  ) {}

  public async execute(dto: SwitchTrainerDTO): Promise<Result<SwitchTrainerResponseDTO>> {
    try {
      // 1. Locate active pipeline for client
      const pipeline = await this.pipelineRepo.findActivePipeline(dto.clientId);
      if (!pipeline) {
        throw new NoActivePipelineToSwitchException(dto.clientId);
      }

      const pipelineId = pipeline.id;

      // 2. Locate associated consultation if one exists
      const consultation = await this.consultationRepo.findByAcquisitionPipelineId(pipelineId);
      const switchReason = dto.reason?.trim() || 'CLIENT_SWITCHED_TRAINER';

      if (consultation && consultation.canCancel()) {
        // Cancelling consultation emits ConsultationCancelledEvent,
        // which MarketplaceConsultationSubscriber receives to cancel the pipeline.
        consultation.cancel(CancellationActor.CLIENT, switchReason);
        await this.consultationRepo.save(consultation);
      } else {
        // If consultation was not yet created or already ended, cancel pipeline directly
        pipeline.cancel();
        await this.pipelineRepo.save(pipeline);
      }

      return Result.ok<SwitchTrainerResponseDTO>({
        success: true,
        message: 'Successfully initiated trainer switch. Pre-coaching relationship terminated.',
        cancelledPipelineId: pipelineId,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<SwitchTrainerResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while switching trainers';
      return Result.fail<SwitchTrainerResponseDTO>(message);
    }
  }
}
