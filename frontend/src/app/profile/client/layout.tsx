'use client';

import React from 'react';
import { ClientDashboardLayout } from '../../../shared/navigation/layouts/ClientDashboardLayout';
import { RoleGuard } from '../../../shared/components/guards/RoleGuard';

export default function ClientProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="CLIENT">
      <ClientDashboardLayout>{children}</ClientDashboardLayout>
    </RoleGuard>
  );
}
