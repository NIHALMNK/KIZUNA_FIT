'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Label } from '@/shared/components/ui/Label';
import { Alert } from '@/shared/components/ui/Alert';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Safe response message per security standards
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-7 sm:p-9 text-slate-900 transition-all duration-200">
      <div className="text-center mb-6 space-y-1.5">
        <div className="mx-auto w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mb-3">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Resend Verification Email
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
          Enter your email address to receive a new verification link.
        </p>
      </div>

      <div className="space-y-4">
        {isSubmitted ? (
          <Alert variant="info" title="Verification Link Sent">
            If an account exists for {email}, a verification email has been sent. Please check your inbox and spam folder.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="resend-email" className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="resend-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:bg-white transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl shadow-md shadow-cyan-500/20"
            >
              Send Verification Email
            </Button>
          </form>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-slate-200 flex justify-center text-xs sm:text-sm font-semibold">
        <Link href="/login" className="text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus:underline">
          ← Return to Sign In
        </Link>
      </div>
    </div>
  );
}
