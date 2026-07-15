import { Request, Response, NextFunction } from 'express';
import { env } from '../../../../config/env.config';
import { ApiResponse } from '../responses/ApiResponse';
import { ZodError } from 'zod';
import { ApiErrorCode } from '../responses/ApiErrorCode';
import { AppError, AuthenticationIntegrityException } from '../../../exceptions/AppError';


export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // We know err is likely an Error or has these fields
  const error = err as Error & { body?: unknown };

  // Extract correlation ID if available (from headers or context in future)
  const correlationId = req.headers['x-correlation-id'] || 'unknown';

  // 0. Handle AppError (e.g. AuthenticationIntegrityException or other Custom Operational AppErrors)
  if (err instanceof AppError) {
    const statusCode = err instanceof AuthenticationIntegrityException ? 500 : 400;
    ApiResponse.error(res, err.message, err.code as ApiErrorCode, statusCode);
    return;
  }

  // 1. Handle JSON Parsing Errors (e.g. malformed body)
  if (error instanceof SyntaxError && 'body' in error) {
    ApiResponse.error(res, 'Malformed JSON payload', ApiErrorCode.MALFORMED_JSON, 400);
    return;
  }

  // 2. Handle Leaked Zod Errors (safety net, although validateRequest handles most)
  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    ApiResponse.error(res, 'Validation failed', ApiErrorCode.VALIDATION_ERROR, 422, details);
    return;
  }

  // 3. Fallback: Internal Server Error
  // Only log the actual error stack in development/test or dump it cleanly.
  // We use console.error here as the single source of logging. 
  // In a robust implementation, this would use a real logger (e.g. Pino, Winston).
    console.error(`[ERROR] [${correlationId}] ${error.name}: ${error.message}`, error.stack);

  const message = env.NODE_ENV === 'production' 
    ? 'An unexpected system error occurred' 
    : error.message || 'Internal Server Error';

  const details = env.NODE_ENV === 'production' 
    ? undefined 
    : { name: error.name, stack: error.stack };

  ApiResponse.error(res, message, ApiErrorCode.INTERNAL_SERVER_ERROR, 500, details);
};
