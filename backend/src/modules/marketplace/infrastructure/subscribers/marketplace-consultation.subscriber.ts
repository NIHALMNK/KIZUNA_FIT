import { DomainEventDispatcher } from '../../../../shared/events/domain-event-dispatcher';
import { ILogger } from '../../../../shared/contracts/ILogger';
import { IAcquisitionPipelineRepository } from '../../domain/repositories/acquisition-pipeline.repository';
import { ConsultationCancelledEvent } from '../../../consultation/domain/events/consultation-cancelled.event';

/**
 * Listens for Consultation domain events and updates corresponding AcquisitionPipeline aggregate.
 * Cancels the active AcquisitionPipeline when an associated Consultation is cancelled.
 */
export class MarketplaceConsultationSubscriber {
  constructor(
    private readonly domainEventDispatcher: DomainEventDispatcher,
    private readonly pipelineRepo: IAcquisitionPipelineRepository,
    private readonly logger: ILogger,
  ) {}

  public register(): void {
    this.domainEventDispatcher.register<ConsultationCancelledEvent>(
      'ConsultationCancelledEvent',
      async (event: ConsultationCancelledEvent) => {
        await this.handleConsultationCancelled(event);
      },
    );

    this.logger.info(
      '[MarketplaceConsultationSubscriber] Registered listener for ConsultationCancelledEvent',
    );
  }

  private async handleConsultationCancelled(event: ConsultationCancelledEvent): Promise<void> {
    try {
      if (!event.consultationId) {
        return;
      }

      // 1. Find active pipeline for Client and Trainer pair
      const pipeline = await this.pipelineRepo.findActivePipelineBetween(
        event.clientId,
        event.trainerId,
      );

      if (!pipeline) {
        this.logger.warn(
          `[MarketplaceConsultationSubscriber] No acquisition pipeline found for Client '${event.clientId}' and Trainer '${event.trainerId}'`,
        );
        return;
      }

      // 2. Idempotent state guard: only transition if pipeline is currently open
      if (!pipeline.isOpen()) {
        this.logger.debug(
          `[MarketplaceConsultationSubscriber] Pipeline '${pipeline.id}' is already in terminal state '${pipeline.status}'. Skipping cancellation.`,
        );
        return;
      }

      // 3. Cancel the open pipeline and save
      pipeline.cancel();
      await this.pipelineRepo.save(pipeline);

      this.logger.info(
        `[MarketplaceConsultationSubscriber] Successfully cancelled AcquisitionPipeline '${pipeline.id}' following Consultation cancellation.`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `[MarketplaceConsultationSubscriber] Failed to handle ConsultationCancelledEvent for consultation '${event.consultationId}'`,
        { error },
      );
    }
  }
}
