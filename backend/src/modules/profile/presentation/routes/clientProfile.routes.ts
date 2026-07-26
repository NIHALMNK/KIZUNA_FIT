import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ClientProfileController } from '../controllers/ClientProfileController';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import {
  CreateClientProfileSchema,
  UpdateClientProfileSchema,
} from '../validation/client/client-profile.schema';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

export const clientProfileRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): ClientProfileController =>
    req.scope.resolve<ClientProfileController>('clientProfileController');

  router.post(
    '/',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(CreateClientProfileSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).createProfile(req, res)),
  );

  router.get(
    '/me',
    requireAuth,
    requireRole(['CLIENT']),
    asyncHandler((req: Request, res: Response) => resolveController(req).getProfile(req, res)),
  );

  router.patch(
    '/me',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(UpdateClientProfileSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).updateProfile(req, res)),
  );

  router.post(
    '/me/avatar',
    requireAuth,
    requireRole(['CLIENT']),
    upload.single('avatar'),
    asyncHandler((req: Request, res: Response) => resolveController(req).uploadAvatar(req, res)),
  );

  router.delete(
    '/me/avatar',
    requireAuth,
    requireRole(['CLIENT']),
    asyncHandler((req: Request, res: Response) => resolveController(req).deleteAvatar(req, res)),
  );

  return router;
};
