export interface SendTemplatePayload {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface IEmailProvider {
  sendTemplate(payload: SendTemplatePayload): Promise<void>;
}
