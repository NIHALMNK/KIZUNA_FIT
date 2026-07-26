'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useRouter } from 'next/navigation';
import { Permission, PERMISSION_ROLES } from '../navigation/permissions';
import { ROUTES } from '../../constants/routes';

export interface RoleGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  allowedRole?: string;
  allowedRoles?: string[];
}

export function RoleGuard({ children, permission, allowedRole, allowedRoles }: RoleGuardProps) {
  const { status, user } = useAuthStore();
  const router = useRouter();

  const requiredRoles = permission
    ? PERMISSION_ROLES[permission]
    : allowedRoles || (allowedRole ? [allowedRole] : []);

  const isAuthorized = status === 'authenticated' && !!user?.role && requiredRoles.includes(user.role);

  useEffect(() => {
    if (status === 'authenticated' && !isAuthorized) {
      router.push(ROUTES.UNAUTHORIZED);
    }
  }, [status, isAuthorized, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gray-500 font-medium">Checking authorization permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
