import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponse } from '../responses/ApiResponse';
import { ApiErrorCode } from '../responses/ApiErrorCode';

export const validateRequest = (schema: AnyZodObject): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // We explicitly parse body, query, and params.
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Overwrite request properties only if defined in parsed schema result
      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.query !== undefined) {
        req.query = parsed.query as unknown as typeof req.query;
      }
      if (parsed.params !== undefined && Object.keys(parsed.params).length > 0) {
        req.params = parsed.params as unknown as typeof req.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));

        ApiResponse.error(
          res,
          'Request validation failed',
          ApiErrorCode.VALIDATION_ERROR,
          400,
          details,
        );
        return;
      }

      next(error);
    }
  };
};
