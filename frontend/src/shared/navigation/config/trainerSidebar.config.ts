import { SidebarConfig } from '../types/navigation.types';

export const trainerSidebarConfig: SidebarConfig = {
  portalName: 'trainer',
  sections: [
    {
      id: 'main',
      title: 'MAIN',
      items: [
        {
          id: 'trainer-dashboard',
          label: 'Dashboard',
          description: 'Overview of coaching activity',
          href: '/trainer',
          iconName: 'dashboard',
          status: 'active',
          pageTitle: 'Overview',
          breadcrumb: ['Dashboard', 'Overview'],
        },
      ],
    },
    {
      id: 'profile-management',
      title: 'PROFILE & MANAGEMENT',
      items: [
        {
          id: 'trainer-profile',
          label: 'My Profile',
          description: 'Manage professional profile & bio',
          href: '/profile/trainer',
          iconName: 'profile',
          status: 'active',
          pageTitle: 'Profile',
          breadcrumb: ['Dashboard', 'Profile'],
        },
        {
          id: 'trainer-certifications',
          label: 'Certifications',
          description: 'Verified fitness credentials',
          href: '/profile/trainer/certifications',
          iconName: 'requests',
          status: 'active',
          pageTitle: 'Certifications',
          breadcrumb: ['Dashboard', 'Certifications'],
        },
        {
          id: 'trainer-showcase',
          label: 'Showcase',
          description: 'Portfolio & transformations',
          href: '/profile/trainer/showcase',
          iconName: 'photos',
          status: 'active',
          pageTitle: 'Showcase',
          breadcrumb: ['Dashboard', 'Showcase'],
        },
        {
          id: 'trainer-availability',
          label: 'Availability',
          description: 'Working hours & consultation slots',
          href: '/profile/trainer/availability',
          iconName: 'consultations',
          status: 'active',
          pageTitle: 'Availability',
          breadcrumb: ['Dashboard', 'Availability'],
        },
      ],
    },
  ],
};
