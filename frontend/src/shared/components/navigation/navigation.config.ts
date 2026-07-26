import { ROUTES } from '../../constants/routes';

export interface NavItem {
  label: string;
  href: string;
  isDanger?: boolean;
}

export const NAVIGATION_CONFIG: Record<'guest' | 'CLIENT' | 'TRAINER' | 'ADMIN', NavItem[]> = {
  guest: [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Find Trainers', href: ROUTES.PUBLIC_TRAINERS },
    { label: 'Login', href: ROUTES.LOGIN },
    { label: 'Register', href: ROUTES.REGISTER },
  ],
  CLIENT: [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Find Trainers', href: ROUTES.PUBLIC_TRAINERS },
    { label: 'My Profile', href: ROUTES.CLIENT_PROFILE },
  ],
  TRAINER: [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Trainer Profile', href: ROUTES.TRAINER_PROFILE },
    { label: 'Availability', href: ROUTES.TRAINER_AVAILABILITY },
    { label: 'Certifications', href: ROUTES.TRAINER_CERTIFICATIONS },
    { label: 'Showcase', href: ROUTES.TRAINER_SHOWCASE },
  ],
  ADMIN: [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Find Trainers', href: ROUTES.PUBLIC_TRAINERS },
  ],
};
