import { SidebarConfig } from '../types/navigation.types';

export const adminSidebarConfig: SidebarConfig = {
  portalName: 'admin',
  sections: [
    {
      id: 'main',
      title: 'ADMIN CONTROL PANEL',
      items: [
        {
          id: 'admin-dashboard',
          label: 'Admin Overview',
          href: '/admin',
          iconName: 'dashboard',
          status: 'active',
        },
        {
          id: 'admin-payments',
          label: 'Payments & Payouts',
          href: '/admin/payments',
          iconName: 'invoices',
          status: 'active',
        },
      ],
    },
  ],
};
