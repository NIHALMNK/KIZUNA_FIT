import { Response } from 'express';
import { ApiErrorCode } from './ApiErrorCode';

export class ApiResponse {
  static ok<T>(res: Response, data: T, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data
    });
  }

  static created<T>(res: Response, data: T): void {
    this.ok(res, data, 201);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }

  static error(
    res: Response,
    message: string,
    code: ApiErrorCode | string,
    statusCode: number = 400,
    details?: unknown
  ): void {
    res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        details
      }
    });
  }
}
