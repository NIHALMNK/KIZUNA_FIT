'use client';

import React from 'react';
import { ClientRequestList } from '@/modules/marketplace/presentation/components/ClientRequestList';

export default function ClientRequestsPage() {
  return (
    <div className="space-y-6">
      <ClientRequestList />
    </div>
  );
}
