'use client';

import React from 'react';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { Permission, PERMISSION_ROLES } from '../navigation/permissions';

interface PermissionGateProps {
  children: React.ReactElement;
  permission?: Permission;
  allowedRoles?: string[];
  mode?: 'hide' | 'disable';
  disabledMessage?: string;
}

export function PermissionGate({
  children,
  permission,
  allowedRoles,
  mode = 'hide',
  disabledMessage = 'You do not have permission to perform this action.',
}: PermissionGateProps) {
  const { status, user } = useAuthStore();
  const requiredRoles = permission ? PERMISSION_ROLES[permission] : allowedRoles || [];

  const isAllowed = status === 'authenticated' && !!user?.role && requiredRoles.includes(user.role);

  if (isAllowed) {
    return children;
  }

  if (mode === 'hide') {
    return null;
  }

  // mode === 'disable'
  return React.cloneElement(children, {
    disabled: true,
    title: disabledMessage,
    className: `${children.props.className || ''} opacity-50 cursor-not-allowed pointer-events-none`,
  });
}
