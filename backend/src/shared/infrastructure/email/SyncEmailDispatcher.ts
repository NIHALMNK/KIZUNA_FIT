import { IEmailDispatcher } from '../../application/ports/IEmailDispatcher';
import { IEmailProvider, SendTemplatePayload } from '../../application/ports/IEmailProvider';

export class SyncEmailDispatcher implements IEmailDispatcher {
  constructor(private readonly emailProvider: IEmailProvider) {}

  public async dispatch(payload: SendTemplatePayload): Promise<void> {
    try {
      await this.emailProvider.sendTemplate(payload);
    } catch (error) {
      console.error(`[SyncEmailDispatcher] Failed to send email to ${payload.to}:`, error);
      // We do not rethrow because we must isolate email failures from business transactions.
    }
  }
}
