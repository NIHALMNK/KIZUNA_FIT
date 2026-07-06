export interface IEmailProvider {
  sendEmail(to: string, subject: string, bodyHtml: string): Promise<void>;
}
