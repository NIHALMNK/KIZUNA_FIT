/**
 * KIZUNAFIT Public Route Constants
 * Used strictly across the public marketing website, navigation, footers, and CTAs.
 */

export const PUBLIC_ROUTES = {
  HOME: '/',
  FIND_TRAINERS: '/trainers',
  TRAINER_PROFILE: (id: string) => `/trainers/${id}`,
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export type PublicRoutePath = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES];

/**
 * Returns the appropriate dashboard route based on the user's role.
 */
export const getDashboardRoute = (role?: string): string => {
  switch (role?.toUpperCase()) {
    case 'TRAINER':
      return '/trainer';
    case 'ADMIN':
      return '/admin';
    case 'CLIENT':
    default:
      return '/client';
  }
};
