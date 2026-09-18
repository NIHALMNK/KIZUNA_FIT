import { Request, Response } from 'express';
import { ProcessRazorpayWebhookUseCase } from '../../application/use-cases/process-razorpay-webhook.use-case';

export class RazorpayWebhookController {
  constructor(private readonly processWebhookUseCase: ProcessRazorpayWebhookUseCase) {}

  public handle = async (req: Request, res: Response): Promise<void> => {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';

    // Obtain exact raw body Buffer
    const rawBody: Buffer | string =
      (req as unknown as { rawBody?: Buffer }).rawBody ||
      (Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body)));

    const payload =
      typeof req.body === 'object' && !Buffer.isBuffer(req.body)
        ? req.body
        : JSON.parse(rawBody.toString('utf8'));

    const result = await this.processWebhookUseCase.execute({
      rawBody,
      signature,
      payload,
    });

    if (result.isFailure) {
      const errorMsg = result.error || 'Webhook processing failed';
      if (errorMsg.includes('signature') || errorMsg.includes('Invalid')) {
        res.status(400).json({ error: errorMsg });
        return;
      }
      res.status(500).json({ error: errorMsg });
      return;
    }

    res.status(200).json({ status: 'ok', data: result.getValue() });
  };
}
