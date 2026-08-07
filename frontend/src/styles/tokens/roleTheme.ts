export type ApplicationScope = 'PUBLIC' | 'CLIENT' | 'TRAINER' | 'ADMIN';

export interface RoleThemeConfig {
  scope: ApplicationScope;
  className: string;
  primaryColor: string;
  secondaryColor: string;
  badgeStyle: string;
}

export const ROLE_THEMES: Record<ApplicationScope, RoleThemeConfig> = {
  PUBLIC: {
    scope: 'PUBLIC',
    className: 'theme-public',
    primaryColor: '#06b6d4',
    secondaryColor: '#2563eb',
    badgeStyle: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  },
  CLIENT: {
    scope: 'CLIENT',
    className: 'theme-client',
    primaryColor: '#14b8a6',
    secondaryColor: '#06b6d4',
    badgeStyle: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
  },
  TRAINER: {
    scope: 'TRAINER',
    className: 'theme-trainer',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    badgeStyle: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  },
  ADMIN: {
    scope: 'ADMIN',
    className: 'theme-admin',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    badgeStyle: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
  },
};

export const getRoleTheme = (role?: string): RoleThemeConfig => {
  switch (role?.toUpperCase()) {
    case 'TRAINER':
      return ROLE_THEMES.TRAINER;
    case 'ADMIN':
      return ROLE_THEMES.ADMIN;
    case 'CLIENT':
      return ROLE_THEMES.CLIENT;
    default:
      return ROLE_THEMES.PUBLIC;
  }
};
