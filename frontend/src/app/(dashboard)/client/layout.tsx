'use client';

import { RoleGuard } from '../../../shared/components/guards/RoleGuard';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="CLIENT">
      {children}
    </RoleGuard>
  );
}
