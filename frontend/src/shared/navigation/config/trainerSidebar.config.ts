import { SidebarConfig } from '../types/navigation.types';

export const trainerSidebarConfig: SidebarConfig = {
  portalName: 'trainer',
  sections: [
    {
      id: 'main',
      title: 'TRAINER DASHBOARD',
      items: [
        {
          id: 'trainer-dashboard',
          label: 'Dashboard',
          href: '/trainer',
          iconName: 'dashboard',
          status: 'active',
        },
        {
          id: 'trainer-profile',
          label: 'Trainer Profile',
          href: '/profile/trainer',
          iconName: 'profile',
          status: 'active',
        },
      ],
    },
  ],
};
