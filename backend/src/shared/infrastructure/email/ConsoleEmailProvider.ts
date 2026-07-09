import { IEmailProvider, EmailPayload } from '../../application/ports/IEmailProvider';

export class ConsoleEmailProvider implements IEmailProvider {
  public async sendEmail(payload: EmailPayload): Promise<void> {
    console.log(`[ConsoleEmailProvider] Sending email to: ${payload.to}`);
    console.log(`[ConsoleEmailProvider] Subject: ${payload.subject}`);
    console.log(`[ConsoleEmailProvider] HTML Body: ${payload.htmlBody.substring(0, 50)}...`);
  }
}
