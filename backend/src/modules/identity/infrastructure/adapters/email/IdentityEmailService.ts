import { IEmailService } from '../../../application/ports/IEmailService';
import { IEmailProvider } from '../../../../../shared/application/ports/IEmailProvider';

export class IdentityEmailService implements IEmailService {
  constructor(private readonly emailProvider: IEmailProvider) {}

  public async sendVerification(email: string, token: string): Promise<void> {
    const subject = 'Verify your KIZUNAFIT Account';
    const htmlBody = `
      <h1>Welcome to KIZUNAFIT!</h1>
      <p>Please verify your email address by using the token below:</p>
      <h2>${token}</h2>
      <p>This token is valid for 24 hours.</p>
    `;
    const textBody = `Welcome to KIZUNAFIT! Please verify your email with token: ${token}`;

    // Masking the email for logging (e.g., j***@domain.com)
    const maskedEmail = this.maskEmail(email);
    console.log(`[IdentityEmailService] Sending verification email to ${maskedEmail}`);

    await this.emailProvider.sendEmail({
      to: email,
      subject,
      htmlBody,
      textBody
    });
  }

  public async sendPasswordReset(email: string, token: string): Promise<void> {
    const subject = 'KIZUNAFIT Password Reset';
    const htmlBody = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Use the token below to reset your password:</p>
      <h2>${token}</h2>
      <p>If you did not request this, please ignore this email.</p>
    `;
    const textBody = `Password Reset Request. Your token is: ${token}`;

    const maskedEmail = this.maskEmail(email);
    console.log(`[IdentityEmailService] Sending password reset email to ${maskedEmail}`);

    await this.emailProvider.sendEmail({
      to: email,
      subject,
      htmlBody,
      textBody
    });
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const maskedLocal = local.length > 2 
      ? `${local[0]}***${local[local.length - 1]}` 
      : `${local[0]}***`;
    return `${maskedLocal}@${domain}`;
  }
}
