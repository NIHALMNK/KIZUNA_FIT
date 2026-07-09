import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../responses/ApiResponse';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  ApiResponse.error(res, 'The requested endpoint does not exist', 'ROUTE_NOT_FOUND', 404);
};
