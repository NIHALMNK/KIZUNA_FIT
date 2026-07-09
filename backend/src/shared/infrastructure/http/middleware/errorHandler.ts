import { Request, Response, NextFunction } from 'express';
import { env } from '../../../../config/env.config';
import { ApiResponse } from '../responses/ApiResponse';
import { ZodError } from 'zod';

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

  // 1. Handle JSON Parsing Errors (e.g. malformed body)
  if (error instanceof SyntaxError && 'body' in error) {
    ApiResponse.error(res, 'Malformed JSON payload', 'MALFORMED_JSON', 400);
    return;
  }

  // 2. Handle Leaked Zod Errors (safety net, although validateRequest handles most)
  if (error instanceof ZodError) {
    const details = error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    ApiResponse.error(res, 'Validation failed', 'VALIDATION_ERROR', 400, details);
    return;
  }

  // 3. Fallback: Internal Server Error
  // Only log the actual error stack in development/test or dump it cleanly.
  // We use console.error here as the single source of logging. 
  // In a robust implementation, this would use a real logger (e.g. Pino, Winston).
  if (env.NODE_ENV !== 'test') {
    console.error(`[ERROR] [${correlationId}] ${error.name}: ${error.message}`, error.stack);
  }

  const message = env.NODE_ENV === 'production' 
    ? 'An unexpected system error occurred' 
    : error.message || 'Internal Server Error';

  const details = env.NODE_ENV === 'production' 
    ? undefined 
    : { name: error.name, stack: error.stack };

  ApiResponse.error(res, message, 'INTERNAL_SERVER_ERROR', 500, details);
};
