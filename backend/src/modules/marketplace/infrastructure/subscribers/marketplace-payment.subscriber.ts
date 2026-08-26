import { DomainEventDispatcher } from '../../../../shared/events/domain-event-dispatcher';
import { ILogger } from '../../../../shared/contracts/ILogger';
import { IAcquisitionPipelineRepository } from '../../domain/repositories/acquisition-pipeline.repository';
import { AcquisitionPipelineStatus } from '../../domain/enums/acquisition-pipeline-status.enum';
import { PaymentSucceededEvent } from '../../../payment/domain/events/payment-succeeded.event';

/**
 * Listens for PaymentSucceededEvent domain events and advances the AcquisitionPipeline aggregate
 * from OFFER_ACCEPTED -> PAYMENT_COMPLETED -> CONVERTED.
 */
export class MarketplacePaymentSubscriber {
  constructor(
    private readonly domainEventDispatcher: DomainEventDispatcher,
    private readonly pipelineRepo: IAcquisitionPipelineRepository,
    private readonly logger: ILogger,
  ) {}

  public register(): void {
    this.domainEventDispatcher.register<PaymentSucceededEvent>(
      'PaymentSucceededEvent',
      async (event: PaymentSucceededEvent) => {
        await this.handlePaymentSucceeded(event);
      },
    );

    this.logger.info(
      '[MarketplacePaymentSubscriber] Registered listener for PaymentSucceededEvent',
    );
  }

  private async handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    try {
      if (!event.acquisitionPipelineId && !event.clientId) {
        return;
      }

      // 1. Locate pipeline by acquisitionPipelineId or fallback to client/trainer active pair
      let pipeline = null;
      if (event.acquisitionPipelineId) {
        pipeline = await this.pipelineRepo.findById(event.acquisitionPipelineId);
      }

      if (!pipeline && event.clientId && event.trainerId) {
        pipeline = await this.pipelineRepo.findActivePipelineBetween(
          event.clientId,
          event.trainerId,
        );
      }

      if (!pipeline) {
        this.logger.warn(
          `[MarketplacePaymentSubscriber] No acquisition pipeline found for ID '${event.acquisitionPipelineId}' (Client: '${event.clientId}', Trainer: '${event.trainerId}')`,
        );
        return;
      }

      // 2. Idempotency guard: If already converted, skip
      if (pipeline.isConverted() || pipeline.status === AcquisitionPipelineStatus.CONVERTED) {
        this.logger.debug(
          `[MarketplacePaymentSubscriber] Pipeline '${pipeline.id}' is already CONVERTED. Skipping.`,
        );
        return;
      }

      // 3. Sequential Aggregate State Transition (OFFER_ACCEPTED -> PAYMENT_COMPLETED -> CONVERTED)
      if (pipeline.status === AcquisitionPipelineStatus.OFFER_ACCEPTED) {
        pipeline.markPaymentCompleted();
        pipeline.convert();
        await this.pipelineRepo.save(pipeline);
        this.logger.info(
          `[MarketplacePaymentSubscriber] Successfully converted AcquisitionPipeline '${pipeline.id}' after Payment '${event.paymentId}'.`,
        );
        return;
      }

      if (pipeline.status === AcquisitionPipelineStatus.PAYMENT_COMPLETED) {
        pipeline.convert();
        await this.pipelineRepo.save(pipeline);
        this.logger.info(
          `[MarketplacePaymentSubscriber] Converted AcquisitionPipeline '${pipeline.id}' from PAYMENT_COMPLETED.`,
        );
        return;
      }

      this.logger.warn(
        `[MarketplacePaymentSubscriber] Pipeline '${pipeline.id}' in unexpected status '${pipeline.status}' for PaymentSucceededEvent.`,
      );
    } catch (error: unknown) {
      // Non-blocking catch to ensure downstream consumer errors never break financial payment authority
      this.logger.error(
        `[MarketplacePaymentSubscriber] Failed to process PaymentSucceededEvent for payment '${event.paymentId}'`,
        { error },
      );
    }
  }
}
