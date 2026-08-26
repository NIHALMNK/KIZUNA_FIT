import { Request, Response } from 'express';
import { InitiatePaymentUseCase } from '../../application/use-cases/initiate-payment.use-case';
import { VerifyPaymentUseCase } from '../../application/use-cases/verify-payment.use-case';
import { GetPaymentUseCase } from '../../application/use-cases/get-payment.use-case';
import { ListPaymentsUseCase } from '../../application/use-cases/list-payments.use-case';
import { GetInvoiceUseCase } from '../../application/use-cases/get-invoice.use-case';

export class PaymentController {
  constructor(
    private readonly initiatePaymentUseCase: InitiatePaymentUseCase,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly listPaymentsUseCase: ListPaymentsUseCase,
    private readonly getInvoiceUseCase: GetInvoiceUseCase,
  ) {}

  public initiatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const role = (user.role || '').toUpperCase();
      if (role !== 'CLIENT') {
        res
          .status(403)
          .json({
            error: 'Forbidden: Only Clients can initiate payment for accepted coaching offers.',
          });
        return;
      }

      const { offerId } = req.body;
      if (!offerId || typeof offerId !== 'string' || offerId.trim() === '') {
        res.status(400).json({ error: 'Invalid request: offerId is required.' });
        return;
      }

      const result = await this.initiatePaymentUseCase.execute({
        offerId: offerId.trim(),
        clientId: user.id || user.userId,
      });

      if (result.isFailure) {
        const errorMsg = result.error as string;
        const status =
          errorMsg.includes('Unauthorized') || errorMsg.includes('Forbidden')
            ? 403
            : errorMsg.includes('not found')
              ? 404
              : errorMsg.includes('already exists')
                ? 409
                : 400;
        res.status(status).json({ error: errorMsg });
        return;
      }

      res.status(201).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const paymentId = req.params.id;
      const { providerOrderId, providerPaymentId, providerSignature } = req.body;

      if (!providerOrderId || !providerPaymentId || !providerSignature) {
        res.status(400).json({
          error:
            'Invalid request: providerOrderId, providerPaymentId, and providerSignature are required.',
        });
        return;
      }

      const result = await this.verifyPaymentUseCase.execute({
        paymentId,
        providerOrderId,
        providerPaymentId,
        providerSignature,
        clientId: user.id || user.userId,
      });

      if (result.isFailure) {
        const errorMsg = result.error as string;
        const status =
          errorMsg.includes('Unauthorized') || errorMsg.includes('Forbidden')
            ? 403
            : errorMsg.includes('not found')
              ? 404
              : 400;
        res.status(status).json({ error: errorMsg });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public getPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const paymentId = req.params.id;
      const result = await this.getPaymentUseCase.execute({
        paymentId,
        userId: user.id || user.userId,
        role: user.role,
      });

      if (result.isFailure) {
        const errorMsg = result.error as string;
        const status =
          errorMsg.includes('Unauthorized') || errorMsg.includes('Forbidden')
            ? 403
            : errorMsg.includes('not found')
              ? 404
              : 400;
        res.status(status).json({ error: errorMsg });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public listPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const { limit, offset } = req.query;
      const result = await this.listPaymentsUseCase.execute({
        userId: user.id || user.userId,
        role: user.role,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public getInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const paymentId = req.params.id;
      const result = await this.getInvoiceUseCase.execute({
        paymentId,
        userId: user.id || user.userId,
        role: user.role,
      });

      if (result.isFailure) {
        const errorMsg = result.error as string;
        const status =
          errorMsg.includes('Unauthorized') || errorMsg.includes('Forbidden')
            ? 403
            : errorMsg.includes('not found')
              ? 404
              : 400;
        res.status(status).json({ error: errorMsg });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };
}
