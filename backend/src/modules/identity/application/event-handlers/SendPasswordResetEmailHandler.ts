import { IEventHandler } from '../../../../shared/infrastructure/events/InMemoryEventBus';
import { PasswordResetRequestedEvent } from '../events/PasswordResetRequestedEvent';
import { IEmailDispatcher } from '../../../../shared/application/ports/IEmailDispatcher';
import { env } from '../../../../config/env.config';

export class SendPasswordResetEmailHandler implements IEventHandler<PasswordResetRequestedEvent> {
  constructor(private readonly emailDispatcher: IEmailDispatcher) {}

  public async handle(event: PasswordResetRequestedEvent): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${event.rawToken}`;

    await this.emailDispatcher.dispatch({
      to: event.email,
      subject: 'KIZUNAFIT Password Reset',
      template: 'password-reset',
      context: {
        token: event.rawToken,
        resetUrl,
      },
      metadata: {
        userId: event.userId,
        eventType: 'PasswordResetRequested',
      }
    });
  }
}
