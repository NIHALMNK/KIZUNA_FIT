export type BadgeType = 'NEW' | 'BETA' | 'COUNT' | 'PREMIUM' | 'COMING_SOON';

export type NavItemStatus = 'active' | 'disabled' | 'comingSoon';

export type SidebarIconName =
  | 'dashboard'
  | 'search'
  | 'requests'
  | 'consultations'
  | 'offers'
  | 'workouts'
  | 'nutrition'
  | 'progress'
  | 'photos'
  | 'measurements'
  | 'goals'
  | 'messages'
  | 'video'
  | 'notifications'
  | 'subscription'
  | 'history'
  | 'invoices'
  | 'profile'
  | 'settings'
  | 'help'
  | 'logout'
  | 'chevronLeft'
  | 'chevronRight'
  | 'menu'
  | 'close';

export interface SidebarBadgeConfig {
  text?: string;
  type: BadgeType;
  count?: number;
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate' | 'purple';
}

export interface SidebarDisplayMatrix {
  desktop?: boolean;
  tablet?: boolean;
  mobile?: boolean;
}

export interface SidebarNavItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  iconName: SidebarIconName;
  status?: NavItemStatus;
  permission?: string;
  roles?: string[];
  featureFlag?: string;
  requiresAuth?: boolean;
  requiresProfile?: boolean;
  requiresSubscription?: boolean;
  badge?: SidebarBadgeConfig;
  badgeResolver?: () => SidebarBadgeConfig | null;
  count?: number;
  badgeSource?: string;
  analyticsKey?: string;
  pageTitle?: string;
  breadcrumb?: string[];
  keywords?: string[];
  display?: SidebarDisplayMatrix;
  children?: SidebarNavItem[];
}

export interface SidebarNavSection {
  id: string;
  title: string;
  items: SidebarNavItem[];
}

export interface SidebarConfig {
  portalName: 'client' | 'trainer' | 'admin';
  sections: SidebarNavSection[];
}

export interface SidebarUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  subscriptionPlan?: string;
  isOnline?: boolean;
}
