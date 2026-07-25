'use client';

import { useEffect, useCallback } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { useGoogleLogin as useBackendGoogleLogin } from '../../modules/identity/application/hooks/useGoogleLogin';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../modules/identity/application/store/authStore';

export function GoogleAuthInitializer() {
  const router = useRouter();
  const { mutate } = useBackendGoogleLogin();

  const handleCredentialResponse = useCallback(
    (credentialResponse: CredentialResponse) => {
      console.log('3. callback invoked');
      if (!credentialResponse.credential) {
        toast.error('Google login failed: No credential received.');
        return;
      }

      const { status } = useAuthStore.getState();

      if (status === 'authenticated') {
        // User is logged in, this is a Link action
        import('../../modules/identity/infrastructure/api/IdentityRepository').then(({ identityRepository }) => {
          identityRepository.linkGoogle(credentialResponse.credential!)
            .then(() => toast.success('Google account linked successfully!'))
            .catch((error: any) => toast.error(error.message || 'Failed to link Google account.'));
        });
      } else {
        // User is not logged in, this is a Login action
        console.log('4. credential received');
        mutate(credentialResponse.credential, {
          onSuccess: () => {
            toast.success('Google login successful!');
            const user = useAuthStore.getState().user;
            if (user && user.role) {
              router.push(`/${user.role.toLowerCase()}`);
            } else {
              router.push('/');
            }
          },
          onError: (error: any) => {
            const errMsg = error.message || '';
            if (errMsg.includes('GOOGLE_ACCOUNT_NOT_FOUND')) {
              toast.error('No KIZUNAFIT account exists for this Google account. Please register first.', { duration: 5000 });
              router.push('/register');
            } else if (errMsg.includes('GOOGLE_ACCOUNT_NOT_LINKED')) {
              toast.error('This account exists. Please login using email and password first, then link Google from Settings.', { duration: 5000 });
              router.push('/login');
            } else {
              toast.error(errMsg || 'Google authentication failed.');
            }
          },
        });
      }
    },
    [mutate, router]
  );

  useEffect(() => {
    // Only initialize once when the script is loaded and we are on the client
    if (typeof window !== 'undefined') {
      const w = window as any;
      const initGoogle = () => {
        if (w.google && w.google.accounts && w.google.accounts.id) {
          const origin = window.location.origin;
          const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id';
          console.log('2. initialize() executed');
          w.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          w.__google_initialized = true;
        }
      };

      // If already initialized globally, do nothing.
      if (w.__google_initialized) {
        return;
      }

      // If google script is already loaded but not initialized
      if (w.google) {
        initGoogle();
      } else {
        // Poll for script load
        const checkInterval = setInterval(() => {
          if (w.google && !w.__google_initialized) {
            initGoogle();
            clearInterval(checkInterval);
          }
        }, 100);

        return () => clearInterval(checkInterval);
      }
    }
  }, [handleCredentialResponse]);

  return null;
}
