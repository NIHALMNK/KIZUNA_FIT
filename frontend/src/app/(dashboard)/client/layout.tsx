'use client';

import { RoleGuard } from '../../../shared/components/guards/RoleGuard';
import { ClientDashboardLayout } from '../../../shared/navigation/layouts/ClientDashboardLayout';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="CLIENT">
      <ClientDashboardLayout>{children}</ClientDashboardLayout>
    </RoleGuard>
  );
}
