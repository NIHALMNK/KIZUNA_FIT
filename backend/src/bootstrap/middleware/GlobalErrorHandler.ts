import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/exceptions/AppError';
import { ILogger } from '../../shared/contracts/ILogger';

export const globalErrorHandler = (logger: ILogger) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error('Unhandled Exception', { error: err.message, stack: err.stack });

    if (err instanceof AppError) {
      return res.status(400).json({
        status: 'error',
        code: err.code,
        message: err.message
      });
    }

    res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    });
  };
};
