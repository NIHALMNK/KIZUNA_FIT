import { DomainEventDispatcher } from '../../../../shared/events/domain-event-dispatcher';
import { ILogger } from '../../../../shared/contracts/ILogger';
import { CreateCoachingRelationshipUseCase } from '../../application/use-cases/create-coaching-relationship.use-case';
import { PaymentSucceededEvent } from '../../../payment/domain/events/payment-succeeded.event';

/**
 * Listens for PaymentSucceededEvent domain events and creates an ACTIVE
 * CoachingRelationship aggregate (CR-1, SM-07).
 */
export class CoachingPaymentSubscriber {
  constructor(
    private readonly domainEventDispatcher: DomainEventDispatcher,
    private readonly createCoachingRelationshipUseCase: CreateCoachingRelationshipUseCase,
    private readonly logger: ILogger,
  ) {}

  public register(): void {
    this.domainEventDispatcher.register<PaymentSucceededEvent>(
      'PaymentSucceededEvent',
      async (event: PaymentSucceededEvent) => {
        await this.handlePaymentSucceeded(event);
      },
    );

    this.logger.info('[CoachingPaymentSubscriber] Registered listener for PaymentSucceededEvent');
  }

  private async handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    try {
      if (!event.paymentId || !event.clientId || !event.trainerId) {
        this.logger.warn(
          `[CoachingPaymentSubscriber] Missing required fields in PaymentSucceededEvent: paymentId=${event.paymentId}, clientId=${event.clientId}, trainerId=${event.trainerId}`,
        );
        return;
      }

      this.logger.info(
        `[CoachingPaymentSubscriber] Creating ACTIVE coaching relationship for payment '${event.paymentId}' (Client: '${event.clientId}', Trainer: '${event.trainerId}')`,
      );

      await this.createCoachingRelationshipUseCase.execute({
        acquisitionPipelineId: event.acquisitionPipelineId || `pipe_auto_${event.paymentId}`,
        paymentId: event.paymentId,
        subscriptionId: event.subscriptionId,
        clientId: event.clientId,
        trainerId: event.trainerId,
      });

      this.logger.info(
        `[CoachingPaymentSubscriber] Successfully created/verified ACTIVE coaching relationship for payment '${event.paymentId}'`,
      );
    } catch (error: unknown) {
      const errMessage = (error as Error)?.message || String(error);

      // Idempotency: duplicate key race condition is safe
      if (errMessage.includes('already exists') || errMessage.includes('E11000')) {
        this.logger.info(
          `[CoachingPaymentSubscriber] Coaching relationship already exists for payment '${event.paymentId}'. Skipping duplicate creation.`,
        );
        return;
      }

      this.logger.error(
        `[CoachingPaymentSubscriber] Failed to create coaching relationship for payment '${event.paymentId}': ${errMessage}`,
        { error },
      );
    }
  }
}
