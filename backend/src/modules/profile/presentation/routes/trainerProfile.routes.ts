import { Router, Request, Response } from 'express';
import multer from 'multer';
import { TrainerProfileController } from '../controllers/TrainerProfileController';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import {
  CreateTrainerProfileSchema,
  UpdateTrainerProfileSchema,
  UpdateAvailabilitySchema,
  AddCertificationSchema,
  UpdateCertificationSchema,
  AddShowcaseItemSchema,
  UpdateShowcaseItemSchema,
  SearchTrainerQuerySchema,
} from '../validation/trainer/trainer-profile.schema';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const trainerProfileRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): TrainerProfileController =>
    req.scope.resolve<TrainerProfileController>('trainerProfileController');

  // --- Public Routes ---
  router.get(
    '/',
    validateRequest(SearchTrainerQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).searchTrainers(req, res)),
  );

  router.get(
    '/:trainerId',
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getPublicProfile(req, res),
    ),
  );

  // --- Authenticated Trainer Profile Routes ---
  router.post(
    '/',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(CreateTrainerProfileSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).createProfile(req, res)),
  );

  router.get(
    '/me',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).getProfile(req, res)),
  );

  router.patch(
    '/me',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(UpdateTrainerProfileSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).updateProfile(req, res)),
  );

  router.post(
    '/me/avatar',
    requireAuth,
    requireRole(['TRAINER']),
    upload.single('avatar'),
    asyncHandler((req: Request, res: Response) => resolveController(req).uploadAvatar(req, res)),
  );

  router.delete(
    '/me/avatar',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).deleteAvatar(req, res)),
  );

  // Availability
  router.get(
    '/me/availability',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).getAvailability(req, res)),
  );

  router.patch(
    '/me/availability',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(UpdateAvailabilitySchema),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).updateAvailability(req, res),
    ),
  );

  // Certifications
  router.post(
    '/me/certifications',
    requireAuth,
    requireRole(['TRAINER']),
    upload.single('file'),
    validateRequest(AddCertificationSchema),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).addCertification(req, res),
    ),
  );

  router.patch(
    '/me/certifications/:certificationId',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(UpdateCertificationSchema),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).updateCertification(req, res),
    ),
  );

  router.delete(
    '/me/certifications/:certificationId',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).deleteCertification(req, res),
    ),
  );

  // Showcase
  router.post(
    '/me/showcase',
    requireAuth,
    requireRole(['TRAINER']),
    upload.single('file'),
    validateRequest(AddShowcaseItemSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).addShowcaseItem(req, res)),
  );

  router.get(
    '/me/showcase',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getShowcaseItems(req, res),
    ),
  );

  router.patch(
    '/me/showcase/:itemId',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(UpdateShowcaseItemSchema),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).updateShowcaseItem(req, res),
    ),
  );

  router.delete(
    '/me/showcase/:itemId',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).deleteShowcaseItem(req, res),
    ),
  );

  return router;
};
