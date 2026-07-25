import { IEmailProvider, SendTemplatePayload } from '../../application/ports/IEmailProvider';

export class MockEmailProvider implements IEmailProvider {
  private sentEmails: SendTemplatePayload[] = [];

  public async sendTemplate(payload: SendTemplatePayload): Promise<void> {
    this.sentEmails.push(payload);
    
    // In Mock, we can just print a short log so development tests don't look completely dead.
    console.log(`[MockEmailProvider] Captured email for ${payload.to} via template ${payload.template}`);
  }

  public getSentEmails(): SendTemplatePayload[] {
    return this.sentEmails;
  }

  public clear(): void {
    this.sentEmails = [];
  }
}
