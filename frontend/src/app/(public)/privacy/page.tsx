'use client';

import React from 'react';
import { Heading, Paragraph, Text } from '@/shared/components/ui/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <Heading level={1} className="text-3xl sm:text-4xl font-extrabold">
          Privacy Policy
        </Heading>
        <Text size="xs" variant="muted" className="block">
          Last Updated: August 2026
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Data Collection & Privacy Respect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Paragraph variant="secondary">
            KIZUNAFIT collects information necessary to connect Clients with certified Trainers. This includes account credentials (full name, email address, password hash), public profile information, and user-submitted communications.
          </Paragraph>
          <Paragraph variant="secondary">
            We do not sell user personal data to third parties. Data access is restricted to operational service delivery and platform security auditing.
          </Paragraph>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Public Marketplace vs Private Account Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Paragraph variant="secondary">
            Trainer profiles, specializations, credentials, ratings, and public reviews are displayed publicly to facilitate trainer discovery.
          </Paragraph>
          <Paragraph variant="secondary">
            Client account information, personal training logs, private messages, and billing details remain encrypted and accessible only to authorized account holders and their assigned coaches.
          </Paragraph>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Account Deletion & Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Paragraph variant="secondary">
            Users may request complete deletion of their account data at any time by contacting privacy@kizunafit.com.
          </Paragraph>
        </CardContent>
      </Card>
    </div>
  );
}
