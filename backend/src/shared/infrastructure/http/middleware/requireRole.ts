import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../responses/ApiResponse';
import { ApiErrorCode } from '../responses/ApiErrorCode';


export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      ApiResponse.error(res, 'Insufficient permissions', ApiErrorCode.FORBIDDEN, 403);
      return;
    }

    next();
  };
};
