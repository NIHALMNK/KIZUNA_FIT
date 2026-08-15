'use client';

import React from 'react';
import { RoleGuard } from '../../../shared/components/guards/RoleGuard';
import { TrainerDashboardLayout } from '../../../shared/navigation/layouts/TrainerDashboardLayout';

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="TRAINER">
      <TrainerDashboardLayout>{children}</TrainerDashboardLayout>
    </RoleGuard>
  );
}
