import { PUBLIC_ROUTES } from '../../constants/routes/public.routes';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  isExternal?: boolean;
  showInDesktop: boolean;
  showInMobile: boolean;
  isCTA?: boolean;
  prefetch?: boolean;
}

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  {
    id: 'find-trainers',
    label: 'Find Trainers',
    href: PUBLIC_ROUTES.FIND_TRAINERS,
    showInDesktop: true,
    showInMobile: true,
    prefetch: true,
  },
  {
    id: 'about',
    label: 'About',
    href: PUBLIC_ROUTES.ABOUT,
    showInDesktop: true,
    showInMobile: true,
    prefetch: true,
  },
  {
    id: 'contact',
    label: 'Contact',
    href: PUBLIC_ROUTES.CONTACT,
    showInDesktop: true,
    showInMobile: true,
    prefetch: true,
  },
];

export const PUBLIC_NAV_ACTIONS = {
  login: {
    id: 'login',
    label: 'Login',
    href: PUBLIC_ROUTES.LOGIN,
  },
  findTrainers: {
    id: 'find-trainers',
    label: 'Find Trainers',
    href: PUBLIC_ROUTES.FIND_TRAINERS,
  },
};
