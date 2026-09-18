import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import { UpdateUserSchema } from '../validation/auth.schema';

export const userRouter = (): Router => {
  const router = Router();

  const resolveUser = (req: Request): UserController =>
    req.scope.resolve<UserController>('userController');

  router.get(
    '/me',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveUser(req).getMe(req, res)),
  );

  router.patch(
    '/me',
    requireAuth,
    validateRequest(UpdateUserSchema),
    asyncHandler((req: Request, res: Response) => resolveUser(req).updateMe(req, res)),
  );

  return router;
};
