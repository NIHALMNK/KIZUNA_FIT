'use client';

import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { IdentityControls } from '../../../modules/identity/presentation/components/IdentityControls';
import { Button } from '../../../shared/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Welcome, {user?.email}</h2>
          <p className="text-gray-600">Role: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{user?.role}</span></p>
        </div>
        {/* TODO: Temporary dashboard navigation entry point for Change Password. Future destination: Profile -> Security -> Change Password */}
        <Button onClick={() => router.push('/change-password')} variant="outline">
          Change Password
        </Button>
      </div>
      <IdentityControls />
    </div>
  );
}
