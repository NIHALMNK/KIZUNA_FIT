export interface EmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export interface IEmailProvider {
  sendEmail(payload: EmailPayload): Promise<void>;
}
