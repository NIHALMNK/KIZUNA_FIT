'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyEmail } from '../../../modules/identity/application/hooks/useVerifyEmail';
import { Card, CardContent } from '../../../shared/components/ui/Card';
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
        }, 2500);
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
      },
    });
  }, [token, verifyEmailMutation.mutate, router]);

  const handleResend = () => {
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    resendMutation.mutate(email, {
      onSuccess: () => toast.success('Verification email dispatched to your inbox.'),
      onError: (err: Error) => toast.error(err.message || 'Failed to resend verification email.'),
    });
  };

  if (status === 'loading') {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-spin">
          <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Verifying Email...</h3>
        <p className="text-sm text-slate-400">Communicating with security server...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
        <p className="text-sm text-slate-300">Your KIZUNAFIT account is now active and ready.</p>
        <Button variant="primary" size="lg" fullWidth onClick={() => router.push('/login')} className="mt-4">
          Continue to Sign In
        </Button>
      </div>
    );
  }

  if (status === 'already_verified') {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Already Verified</h2>
        <p className="text-sm text-slate-300">Your email address has already been verified.</p>
        <Button variant="primary" size="lg" fullWidth onClick={() => router.push('/login')} className="mt-4">
          Continue to Sign In
        </Button>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Link Expired</h2>
        <p className="text-sm text-slate-300 mb-4">Your verification link has expired. Enter your email to resend.</p>
        <div className="space-y-3">
          <Input
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="primary" size="md" fullWidth onClick={handleResend} isLoading={resendMutation.isPending}>
            Resend Verification Email
          </Button>
          <Button variant="outline" size="md" fullWidth onClick={() => router.push('/login')}>
            Return to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-4 space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
      <p className="text-sm text-slate-300">The verification link is invalid or malformed.</p>
      <Button variant="outline" size="lg" fullWidth onClick={() => router.push('/login')} className="mt-4">
        Return to Sign In
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Card variant="default" size="lg" className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <Suspense fallback={<div className="text-center text-slate-400 py-8">Loading verification...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}
