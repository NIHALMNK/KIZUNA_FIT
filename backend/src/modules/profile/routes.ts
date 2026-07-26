import { Router } from 'express';
import { clientProfileRouter } from './presentation/routes/clientProfile.routes';
import { trainerProfileRouter } from './presentation/routes/trainerProfile.routes';

export const profileRouter = (): { clientRouter: Router; trainerRouter: Router } => {
  return {
    clientRouter: clientProfileRouter(),
    trainerRouter: trainerProfileRouter(),
  };
};
