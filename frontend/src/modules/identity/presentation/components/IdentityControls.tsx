'use client';

import React from 'react';
import { useAuthStore } from '../../application/store/authStore';
import { useLogout } from '../../application/hooks/useLogout';
import { Button } from '../../../../shared/components/ui/Button';
import { toast } from 'sonner';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';
import { useRouter } from 'next/navigation';

import { GoogleAuthButton } from '../../../../shared/components/ui/GoogleAuthButton';

export const IdentityControls = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUnlink = async () => {
    try {
      setIsLoading(true);
      await identityRepository.unlinkGoogle();
      toast.success('Google account unlinked successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to unlink Google account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setIsLoading(true);
      await identityRepository.logoutAll();
      toast.success('Logged out from all devices');
      logoutMutation.mutate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout from all devices');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mt-6 space-y-4">
      <h2 className="text-xl font-semibold mb-2">Temporary Identity Controls</h2>
      <p className="text-sm text-gray-500 mb-4">Use these controls to test end-to-end authentication flows.</p>
      
      <div className="flex flex-wrap gap-4">
        {/* TODO: Temporary dashboard navigation entry point for Change Password. Future destination: Profile -> Security -> Change Password */}
        <Button 
          onClick={() => router.push('/change-password')} 
          variant="outline"
        >
          Change Password
        </Button>
        <Button 
          onClick={() => logoutMutation.mutate()} 
          isLoading={logoutMutation.isPending}
          variant="outline"
        >
          Logout (Current Session)
        </Button>
        <Button 
          onClick={handleLogoutAll} 
          isLoading={isLoading}
          variant="danger"
        >
          Logout All Sessions
        </Button>
        <Button 
          onClick={handleUnlink} 
          isLoading={isLoading}
          variant="secondary"
        >
          Unlink Google
        </Button>
      </div>
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600 mb-2">Note: To test linking a Google account, please use the button below in a real environment.</p>
        <GoogleAuthButton />
      </div>
    </div>
  );
};
