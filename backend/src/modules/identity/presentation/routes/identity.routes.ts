import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import {
  RegisterUserSchema,
  LoginSchema,
  GoogleLoginSchema,
  VerifyEmailSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  DeleteAccountSchema
} from '../validation/auth.schema';

export const identityRouter = (): Router => {
  const router = Router();

  // Helper to dynamically resolve controllers from Awilix scoped container
  const resolveAuth = (req: Request): AuthController => req.scope.resolve<AuthController>('authController');
  const resolveUser = (req: Request): UserController => req.scope.resolve<UserController>('userController');

  // --- AuthController Routes ---

  router.post(
    '/register',
    validateRequest(RegisterUserSchema),
    asyncHandler((req: Request, res: Response) => resolveAuth(req).register(req, res))
  );

  router.post(
    '/login',
    validateRequest(LoginSchema),
    asyncHandler((req: Request, res: Response) => resolveAuth(req).login(req, res))
  );

  router.post(
    '/google',
    validateRequest(GoogleLoginSchema),
    asyncHandler((req: Request, res: Response) => resolveAuth(req).googleLogin(req, res))
  );

  router.post(
    '/refresh',
    // No body schema required for refresh as it reads from cookie
    asyncHandler((req: Request, res: Response) => resolveAuth(req).refresh(req, res))
  );

  router.post(
    '/logout',
    asyncHandler((req: Request, res: Response) => resolveAuth(req).logout(req, res))
  );

  // --- UserController Routes ---

  router.post(
    '/verify-email',
    validateRequest(VerifyEmailSchema),
    asyncHandler((req: Request, res: Response) => resolveUser(req).verifyEmail(req, res))
  );

  router.post(
    '/password/forgot',
    validateRequest(ForgotPasswordSchema),
    asyncHandler((req: Request, res: Response) => resolveUser(req).forgotPassword(req, res))
  );

  router.post(
    '/password/reset',
    validateRequest(ResetPasswordSchema),
    asyncHandler((req: Request, res: Response) => resolveUser(req).resetPassword(req, res))
  );

  router.put(
    '/password/change',
    requireAuth,
    validateRequest(ChangePasswordSchema),
    asyncHandler((req: Request, res: Response) => resolveUser(req).changePassword(req, res))
  );

  router.delete(
    '/account',
    requireAuth,
    validateRequest(DeleteAccountSchema),
    asyncHandler((req: Request, res: Response) => resolveUser(req).deleteAccount(req, res))
  );

  return router;
};
