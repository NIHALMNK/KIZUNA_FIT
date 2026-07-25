import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../responses/ApiResponse';
import { ApiErrorCode } from '../responses/ApiErrorCode';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  ApiResponse.error(res, 'The requested endpoint does not exist', ApiErrorCode.ROUTE_NOT_FOUND, 404);
};
