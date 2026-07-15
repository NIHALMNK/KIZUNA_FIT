'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyEmail } from '../../../modules/identity/application/hooks/useVerifyEmail';
import { Card } from '../../../shared/components/ui/Card';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Button } from '../../../shared/components/ui/Button';

import { Input } from '../../../shared/components/ui/Input';
import { useResendVerification } from '../../../modules/identity/application/hooks/useResendVerification';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const verifyEmailMutation = useVerifyEmail();
  const resendMutation = useResendVerification();
  const [status, setStatus] = useState<'loading' | 'success' | 'expired' | 'invalid' | 'already_verified' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const hasFired = React.useRef(false);

  useEffect(() => {
    if (!token || hasFired.current) {
      setStatus('error');
      return;
    }

    hasFired.current = true;

    verifyEmailMutation.mutate(token, {
      onSuccess: () => {
        setStatus('success');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      },
      onError: (error: any) => {
        const message = error.message?.toLowerCase() || '';
        if (message.includes('expired')) {
          setStatus('expired');
        } else if (message.includes('already verified')) {
          setStatus('already_verified');
        } else if (message.includes('invalid')) {
          setStatus('invalid');
        } else {
          setStatus('error');
        }
      }
    });
  }, [token, verifyEmailMutation.mutate]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4"><Spinner /></div>
        <p className="text-gray-500">Verifying your email...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-green-600 mb-2">Email Verified!</h2>
        <p className="text-gray-500 mb-6">Your account is now active and ready to use.</p>
        <Button onClick={() => router.push('/login')} className="w-full">
          Continue to Login
        </Button>
      </div>
    );
  }

  const handleResend = () => {
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    resendMutation.mutate(email, {
      onSuccess: () => toast.success('Verification email resent.'),
      onError: (err: Error) => toast.error(err.message || 'Failed to resend.'),
    });
  };

  if (status === 'already_verified') {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-green-600 mb-2">Already Verified</h2>
        <p className="text-gray-500 mb-6">Your email is already verified.</p>
        <Button onClick={() => router.push('/login')} className="w-full">Continue to Login</Button>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Link Expired</h2>
        <p className="text-gray-500 mb-4">Your verification link has expired. Enter your email to resend.</p>
        <div className="flex flex-col gap-2 mb-4">
          <Input 
            placeholder="Enter your email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <Button onClick={handleResend} isLoading={resendMutation.isPending} className="w-full">
            Resend Verification
          </Button>
        </div>
        <Button onClick={() => router.push('/login')} variant="outline" className="w-full">Return to Login</Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">Verification Failed</h2>
      <p className="text-gray-500 mb-6">The verification link is invalid.</p>
      <Button onClick={() => router.push('/login')} variant="outline" className="w-full">
        Return to Login
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Card className="p-8 shadow-lg rounded-xl">
      <Suspense fallback={<div className="flex justify-center"><Spinner /></div>}>
        <VerifyEmailContent />
      </Suspense>
    </Card>
  );
}
