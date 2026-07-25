'use client';

import { RoleGuard } from '../../../shared/components/guards/RoleGuard';

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="TRAINER">
      {children}
    </RoleGuard>
  );
}
