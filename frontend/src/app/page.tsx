'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../modules/identity/application/store/authStore';
import { Button } from '../shared/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const { status, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && user?.role) {
      router.push(`/${user.role.toLowerCase()}`);
    }
  }, [status, user, router]);

  if (status === 'authenticated') {
    return null; // Redirecting...
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-5xl font-extrabold text-primary mb-6">Welcome to KIZUNAFIT</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl text-center">
        The ultimate platform connecting clients with elite personal trainers. Achieve your fitness goals today.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/login">
          <Button variant="outline" size="lg">Login</Button>
        </Link>
        <Link href="/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/profile/client">
          <Button variant="secondary" size="lg">Client Profile</Button>
        </Link>
        <Link href="/profile/trainer">
          <Button variant="secondary" size="lg">Trainer Profile</Button>
        </Link>
        <Link href="/trainers">
          <Button variant="outline" size="lg">Find Trainers</Button>
        </Link>
      </div>
    </div>
  );
}
