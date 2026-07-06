import { IEmailProvider } from '../../shared/contracts/IEmailProvider';
import { ILogger } from '../../shared/contracts/ILogger';

export class MockEmailProvider implements IEmailProvider {
  constructor(private logger: ILogger) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendEmail(to: string, subject: string, _bodyHtml: string): Promise<void> {
    this.logger.info(`[MOCK EMAIL] To: ${to}, Subject: ${subject}`);
    // Replace with SendGrid/AWS SES implementation later
  }
}
