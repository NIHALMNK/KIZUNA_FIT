import { IEventHandler } from '../../../../shared/infrastructure/events/InMemoryEventBus';
import { EmailVerificationRequestedEvent } from '../events/EmailVerificationRequestedEvent';
import { IEmailDispatcher } from '../../../../shared/application/ports/IEmailDispatcher';
import { env } from '../../../../config/env.config';

export class SendVerificationEmailHandler implements IEventHandler<EmailVerificationRequestedEvent> {
  constructor(private readonly emailDispatcher: IEmailDispatcher) {}

  public async handle(event: EmailVerificationRequestedEvent): Promise<void> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${event.rawToken}`;

    await this.emailDispatcher.dispatch({
      to: event.email,
      subject: 'Verify your KIZUNAFIT Account',
      template: 'verify-email',
      context: {
        token: event.rawToken,
        verificationUrl,
      },
      metadata: {
        userId: event.userId,
        eventType: 'EmailVerificationRequested',
      }
    });
  }
}
