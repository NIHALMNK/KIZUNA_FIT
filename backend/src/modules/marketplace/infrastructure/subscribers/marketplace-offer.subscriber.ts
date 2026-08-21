import { DomainEventDispatcher } from '../../../../shared/events/domain-event-dispatcher';
import { ILogger } from '../../../../shared/contracts/ILogger';
import { IAcquisitionPipelineRepository } from '../../domain/repositories/acquisition-pipeline.repository';
import { OfferDeclinedEvent } from '../../../offer/domain/events/offer-declined.event';
import { OfferExpiredEvent } from '../../../offer/domain/events/offer-expired.event';
import { OfferSentEvent } from '../../../offer/domain/events/offer-sent.event';
import { OfferAcceptedEvent } from '../../../offer/domain/events/offer-accepted.event';

/**
 * Listens for Offer domain events and synchronizes the AcquisitionPipeline aggregate state.
 * Specifically closes the AcquisitionPipeline when an Offer is DECLINED or EXPIRED so the Client
 * is immediately free to start a new acquisition journey with any trainer.
 */
export class MarketplaceOfferSubscriber {
  constructor(
    private readonly domainEventDispatcher: DomainEventDispatcher,
    private readonly pipelineRepo: IAcquisitionPipelineRepository,
    private readonly logger: ILogger,
  ) {}

  public register(): void {
    this.domainEventDispatcher.register<OfferDeclinedEvent>(
      'OfferDeclinedEvent',
      async (event: OfferDeclinedEvent) => {
        await this.handleOfferDeclined(event);
      },
    );

    this.domainEventDispatcher.register<OfferExpiredEvent>(
      'OfferExpiredEvent',
      async (event: OfferExpiredEvent) => {
        await this.handleOfferExpired(event);
      },
    );

    this.domainEventDispatcher.register<OfferSentEvent>(
      'OfferSentEvent',
      async (event: OfferSentEvent) => {
        await this.handleOfferSent(event);
      },
    );

    this.domainEventDispatcher.register<OfferAcceptedEvent>(
      'OfferAcceptedEvent',
      async (event: OfferAcceptedEvent) => {
        await this.handleOfferAccepted(event);
      },
    );

    this.logger.info(
      '[MarketplaceOfferSubscriber] Registered listeners for Offer domain events (OfferDeclinedEvent, OfferExpiredEvent, OfferSentEvent, OfferAcceptedEvent)',
    );
  }

  private async handleOfferDeclined(event: OfferDeclinedEvent): Promise<void> {
    try {
      let pipeline = await this.pipelineRepo.findById(event.acquisitionPipelineId);
      if (!pipeline) {
        pipeline = await this.pipelineRepo.findActivePipelineBetween(
          event.clientId,
          event.trainerId,
        );
      }

      if (!pipeline) {
        this.logger.warn(
          `[MarketplaceOfferSubscriber] No pipeline found for declined offer '${event.offerId}' (pipelineId: '${event.acquisitionPipelineId}')`,
        );
        return;
      }

      if (!pipeline.isOpen()) {
        this.logger.debug(
          `[MarketplaceOfferSubscriber] Pipeline '${pipeline.id}' is already terminal ('${pipeline.status}'). Skipping decline.`,
        );
        return;
      }

      pipeline.declineOffer();
      await this.pipelineRepo.save(pipeline);

      this.logger.info(
        `[MarketplaceOfferSubscriber] Successfully closed AcquisitionPipeline '${pipeline.id}' to status 'OFFER_DECLINED' following Offer decline.`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `[MarketplaceOfferSubscriber] Failed to handle OfferDeclinedEvent for offer '${event.offerId}'`,
        { error },
      );
    }
  }

  private async handleOfferExpired(event: OfferExpiredEvent): Promise<void> {
    try {
      let pipeline = await this.pipelineRepo.findById(event.acquisitionPipelineId);
      if (!pipeline) {
        pipeline = await this.pipelineRepo.findActivePipelineBetween(
          event.clientId,
          event.trainerId,
        );
      }

      if (!pipeline || !pipeline.isOpen()) {
        return;
      }

      pipeline.cancel();
      await this.pipelineRepo.save(pipeline);

      this.logger.info(
        `[MarketplaceOfferSubscriber] Successfully closed AcquisitionPipeline '${pipeline.id}' following Offer expiration.`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `[MarketplaceOfferSubscriber] Failed to handle OfferExpiredEvent for offer '${event.offerId}'`,
        { error },
      );
    }
  }

  private async handleOfferSent(event: OfferSentEvent): Promise<void> {
    try {
      let pipeline = await this.pipelineRepo.findById(event.acquisitionPipelineId);
      if (!pipeline) {
        pipeline = await this.pipelineRepo.findActivePipelineBetween(
          event.clientId,
          event.trainerId,
        );
      }

      if (!pipeline || !pipeline.isOpen()) {
        return;
      }

      if (pipeline.canSendOffer()) {
        pipeline.sendOffer();
        await this.pipelineRepo.save(pipeline);
      }
    } catch (error: unknown) {
      this.logger.error(
        `[MarketplaceOfferSubscriber] Failed to handle OfferSentEvent for offer '${event.offerId}'`,
        { error },
      );
    }
  }

  private async handleOfferAccepted(event: OfferAcceptedEvent): Promise<void> {
    try {
      let pipeline = await this.pipelineRepo.findById(event.acquisitionPipelineId);
      if (!pipeline) {
        pipeline = await this.pipelineRepo.findActivePipelineBetween(
          event.clientId,
          event.trainerId,
        );
      }

      if (!pipeline || !pipeline.isOpen()) {
        return;
      }

      pipeline.acceptOffer();
      await this.pipelineRepo.save(pipeline);
    } catch (error: unknown) {
      this.logger.error(
        `[MarketplaceOfferSubscriber] Failed to handle OfferAcceptedEvent for offer '${event.offerId}'`,
        { error },
      );
    }
  }
}
