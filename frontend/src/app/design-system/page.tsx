'use client';

import React, { useState } from 'react';
import { Heading, Text, Paragraph } from '@/shared/components/ui/Typography';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Label } from '@/shared/components/ui/Label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { StatusBadge, DomainStatus } from '@/shared/components/ui/StatusBadge';
import { Alert } from '@/shared/components/ui/Alert';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Progress } from '@/shared/components/ui/Progress';
import { Dialog, DialogFooter } from '@/shared/components/ui/Dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { MetricCard } from '@/shared/components/ui/MetricCard';
import { Sparkles, Users, Activity, ShieldCheck, Sun, Moon, Check, Filter } from 'lucide-react';

type ScopeTheme = 'PUBLIC' | 'CLIENT' | 'TRAINER' | 'ADMIN';

const THEME_CONFIG: Record<ScopeTheme, { label: string; className: string; description: string; badge: string }> = {
  PUBLIC: {
    label: 'PUBLIC',
    className: 'theme-public',
    description: 'Premium dark marketplace (#020617 background, cyan/blue primary)',
    badge: 'Marketplace',
  },
  CLIENT: {
    label: 'CLIENT',
    className: 'theme-client',
    description: 'Light wellness CRM (#f8fafc background, teal primary)',
    badge: 'Wellness CRM',
  },
  TRAINER: {
    label: 'TRAINER',
    className: 'theme-trainer',
    description: 'Light professional CRM (#fafaf9 background, emerald primary)',
    badge: 'Pro Coach CRM',
  },
  ADMIN: {
    label: 'ADMIN',
    className: 'theme-admin',
    description: 'Light operational CRM (#f1f5f9 background, indigo primary)',
    badge: 'Operations CRM',
  },
};

export default function DesignSystemShowcase() {
  const [activeTheme, setActiveTheme] = useState<ScopeTheme>('PUBLIC');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'foundation' | 'components' | 'states' | 'patterns' | 'comparison'>('components');

  const currentTheme = THEME_CONFIG[activeTheme];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${currentTheme.className} ${isDarkMode ? 'dark' : ''} bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans p-4 sm:p-6 lg:p-10`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Development Showcase Control Header */}
        <header className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Heading level={1} className="text-2xl sm:text-3xl font-extrabold">
                  KIZUNAFIT Design System
                </Heading>
                <Badge variant="primary" className="text-xs">UI-1 Showcase</Badge>
              </div>
              <Paragraph variant="secondary" size="sm" className="mt-1">
                Visual validation target for canonical token architecture and multi-theme primitives.
              </Paragraph>
            </div>

            {/* Dark Mode Developer Preview Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                leftIcon={isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
              >
                {isDarkMode ? 'Light Preview' : 'Dark Preview'}
              </Button>
            </div>
          </div>

          {/* Theme Selector Controls */}
          <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
            <Text size="xs" weight="medium" variant="muted" className="uppercase tracking-wider">
              Active Scope Theme (Zero Reload Switch)
            </Text>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(THEME_CONFIG) as ScopeTheme[]).map((themeKey) => {
                const config = THEME_CONFIG[themeKey];
                const isActive = activeTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => setActiveTheme(themeKey)}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-[var(--color-primary)] bg-[var(--color-surface-alt)] ring-2 ring-[var(--color-ring)] ring-offset-1'
                        : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[var(--color-heading)]">{config.label}</span>
                      {isActive && <Check className="h-4 w-4 text-[var(--color-primary)] shrink-0" />}
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)] mt-1 truncate">{config.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: 'components', label: 'Components' },
              { id: 'foundation', label: 'Foundation & Tokens' },
              { id: 'patterns', label: 'Patterns' },
              { id: 'states', label: 'States & Feedback' },
              { id: 'comparison', label: 'Side-by-Side Comparison' },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </header>

        {/* 1. COMPONENTS SECTION */}
        {activeTab === 'components' && (
          <div className="space-y-8">
            
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons & Actions</CardTitle>
                <CardDescription>Consumes --color-primary, --color-surface-alt, --color-danger with focus rings and loading states.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Text size="xs" weight="semibold" variant="muted" className="uppercase tracking-wider mb-3 block">Variants</Text>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                  </div>
                </div>

                <div>
                  <Text size="xs" weight="semibold" variant="muted" className="uppercase tracking-wider mb-3 block">Sizes & States</Text>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button isLoading loadingText="Saving...">Loading</Button>
                    <Button isDisabled>Disabled</Button>
                    <Button leftIcon={<Sparkles className="h-4 w-4" />}>With Icon</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Inputs & Form Controls</CardTitle>
                <CardDescription>Consumes --color-input, --color-border, --color-ring.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-default">Default Input</Label>
                    <Input id="input-default" placeholder="Enter text..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="input-filled">Filled Variant</Label>
                    <Input id="input-filled" variant="filled" placeholder="Filled input..." className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="input-error" error>Error Validation State</Label>
                    <Input id="input-error" error="Invalid value" placeholder="Invalid value" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="input-disabled" isDisabled>Disabled Input</Label>
                    <Input id="input-disabled" disabled placeholder="Disabled field" className="mt-1" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Select Component"
                    options={[
                      { value: 'client', label: 'Client Portal' },
                      { value: 'trainer', label: 'Trainer Portal' },
                      { value: 'admin', label: 'Admin Portal' },
                    ]}
                  />

                  <div>
                    <Label htmlFor="demo-textarea">Textarea</Label>
                    <Textarea id="demo-textarea" placeholder="Type detailed notes..." className="mt-1" />
                  </div>

                  <div className="space-y-2 pt-2">
                    <Checkbox id="check-1" label="I accept terms and conditions" isRequired />
                    <Checkbox id="check-2" label="Send workout summary via email" checked readOnly />
                    <Checkbox id="check-3" label="Disabled checkbox state" isDisabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges, Avatars, Progress & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Avatars</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Text size="xs" weight="semibold" variant="muted" className="uppercase tracking-wider mb-3 block">Badges</Text>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="primary">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="danger">Danger</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                  </div>

                  <div>
                    <Text size="xs" weight="semibold" variant="muted" className="uppercase tracking-wider mb-3 block">Avatars</Text>
                    <div className="flex items-center gap-4">
                      <Avatar size="sm" fallback="KF" status="online" />
                      <Avatar size="md" fallback="JD" status="busy" />
                      <Avatar size="lg" fallback="AL" status="offline" />
                      <Avatar size="xl" fallback="AD" />
                    </div>
                  </div>

                  <div>
                    <Text size="xs" weight="semibold" variant="muted" className="uppercase tracking-wider mb-3 block">Progress Indicator</Text>
                    <Progress value={68} showLabel variant="primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Dialogs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="info" title="Information Notice">
                    Your session preferences have been updated.
                  </Alert>
                  <Alert variant="success" title="Workout Saved">
                    Client workout log successfully recorded.
                  </Alert>
                  <Alert variant="warning" title="Subscription Expiring">
                    Trainer membership renews in 3 days.
                  </Alert>
                  <Alert variant="danger" title="Access Error">
                    Insufficient permissions to view admin logs.
                  </Alert>

                  <div className="pt-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                      Test Accessible Dialog
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tables */}
            <Card>
              <CardHeader>
                <CardTitle>Data Table</CardTitle>
                <CardDescription>Responsive data layout styled using theme border and surface tokens.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role Scope</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'Alex Johnson', role: 'CLIENT', status: 'active' as DomainStatus, progress: 85 },
                      { name: 'Sarah Miller', role: 'TRAINER', status: 'completed' as DomainStatus, progress: 100 },
                      { name: 'David Chen', role: 'ADMIN', status: 'pending' as DomainStatus, progress: 40 },
                    ].map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium flex items-center gap-3">
                          <Avatar size="sm" fallback={row.name.slice(0, 2)} />
                          {row.name}
                        </TableCell>
                        <TableCell><Badge variant="outline">{row.role}</Badge></TableCell>
                        <TableCell><StatusBadge status={row.status} /></TableCell>
                        <TableCell><Progress value={row.progress} size="sm" className="w-24" /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </div>
        )}

        {/* 2. FOUNDATION & TOKENS SECTION */}
        {activeTab === 'foundation' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Theme Tokens Palette ({currentTheme.label})</CardTitle>
                <CardDescription>Live semantic variables defined by {currentTheme.className}.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { name: '--color-background', bg: 'var(--color-background)', text: 'var(--color-text-primary)' },
                  { name: '--color-surface', bg: 'var(--color-surface)', text: 'var(--color-text-primary)' },
                  { name: '--color-surface-alt', bg: 'var(--color-surface-alt)', text: 'var(--color-text-primary)' },
                  { name: '--color-card', bg: 'var(--color-card)', text: 'var(--color-text-primary)' },
                  { name: '--color-primary', bg: 'var(--color-primary)', text: '#ffffff' },
                  { name: '--color-secondary', bg: 'var(--color-secondary)', text: '#ffffff' },
                  { name: '--color-accent', bg: 'var(--color-accent)', text: '#ffffff' },
                  { name: '--color-border', bg: 'var(--color-border)', text: 'var(--color-text-primary)' },
                  { name: '--color-success', bg: 'var(--color-success)', text: '#ffffff' },
                  { name: '--color-warning', bg: 'var(--color-warning)', text: '#ffffff' },
                  { name: '--color-danger', bg: 'var(--color-danger)', text: '#ffffff' },
                  { name: '--color-info', bg: 'var(--color-info)', text: '#ffffff' },
                ].map((token) => (
                  <div key={token.name} className="rounded-xl border border-[var(--color-border)] p-3 space-y-2">
                    <div
                      className="h-12 w-full rounded-lg border border-[var(--color-border)] flex items-center justify-center font-mono text-xs shadow-inner"
                      style={{ backgroundColor: token.bg, color: token.text }}
                    >
                      Sample
                    </div>
                    <Text size="xs" weight="medium" className="font-mono block truncate">{token.name}</Text>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography Scale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Heading level={1}>H1 Heading Scale</Heading>
                <Heading level={2}>H2 Heading Scale</Heading>
                <Heading level={3}>H3 Heading Scale</Heading>
                <Heading level={4}>H4 Heading Scale</Heading>
                <Paragraph size="lg">Large Paragraph text for leads and introductory sections.</Paragraph>
                <Paragraph size="md">Standard Body Paragraph text for primary content display.</Paragraph>
                <Text variant="secondary" size="sm">Secondary text color for supporting details.</Text>
                <Text variant="muted" size="xs" className="block">Muted text color for footnotes and timestamps.</Text>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 3. PATTERNS SECTION */}
        {activeTab === 'patterns' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Layout & Pattern Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Page Header */}
                <PageHeader
                  title="Client Overview"
                  description="Manage client progress, assigned workouts, and subscription status."
                  badge={<StatusBadge status="active" />}
                  actions={
                    <>
                      <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
                      <Button variant="primary" size="sm">Add Client</Button>
                    </>
                  }
                />

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricCard
                    title="Total Revenue"
                    value="$12,450"
                    change="+14.2%"
                    changeType="positive"
                    icon={<Activity className="h-5 w-5" />}
                  />
                  <MetricCard
                    title="Active Clients"
                    value="148"
                    change="+8.5%"
                    changeType="positive"
                    icon={<Users className="h-5 w-5" />}
                  />
                  <MetricCard
                    title="Pending Invites"
                    value="12"
                    change="-2"
                    changeType="negative"
                    icon={<ShieldCheck className="h-5 w-5" />}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 4. STATES & FEEDBACK SECTION */}
        {activeTab === 'states' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>System Feedback & Empty States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <EmptyState
                  title="No Workouts Scheduled"
                  description="Get started by creating your first workout program or assigning a template."
                  action={<Button variant="primary">Create Program</Button>}
                />

                <ErrorState
                  title="Failed to Sync Data"
                  message="Could not reach the server. Please verify your connection."
                  onRetry={() => alert('Retrying...')}
                />

                <LoadingState message="Fetching workspace data..." count={2} />

                <div>
                  <Text size="xs" weight="semibold" variant="muted" className="uppercase tracking-wider mb-2 block">Skeleton Loaders</Text>
                  <div className="space-y-2 max-w-md">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 5. SIDE-BY-SIDE THEME COMPARISON SECTION */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Theme Side-by-Side Comparison</CardTitle>
                <CardDescription>Proves that the exact SAME component structure renders according to token values across all 4 scope themes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(Object.keys(THEME_CONFIG) as ScopeTheme[]).map((scopeKey) => {
                    const themeObj = THEME_CONFIG[scopeKey];
                    return (
                      <div
                        key={scopeKey}
                        className={`${themeObj.className} rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 space-y-4 shadow-sm text-[var(--color-text-primary)]`}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                          <span className="font-extrabold text-sm text-[var(--color-heading)]">{themeObj.label}</span>
                          <Badge variant="primary" className="text-[10px]">{themeObj.badge}</Badge>
                        </div>

                        {/* Sample Card */}
                        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 space-y-3">
                          <Heading level={4} className="text-sm">Metric Title</Heading>
                          <Text size="lg" weight="bold" className="block text-[var(--color-heading)]">$4,850</Text>
                          <Progress value={72} size="sm" variant="primary" />
                        </div>

                        {/* Sample Buttons */}
                        <div className="space-y-2">
                          <Button variant="primary" fullWidth size="sm">Primary Action</Button>
                          <Button variant="outline" fullWidth size="sm">Secondary Action</Button>
                        </div>

                        {/* Sample Input */}
                        <div>
                          <Input size="sm" placeholder="Input token demo" />
                        </div>

                        {/* Sample Alert */}
                        <Alert variant="info" title="Token Notice">
                          Theme scope active.
                        </Alert>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Accessible Dialog Test Modal */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Accessible Dialog Component"
          description="Supports keyboard Escape, backdrop click, focus management, and semantic tokens."
        >
          <div className="space-y-4">
            <Paragraph size="sm">
              This dialog primitive is built according to WAI-ARIA modal dialog accessibility patterns.
            </Paragraph>
            <Input label="Sample Field" placeholder="Type inside dialog..." />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setIsDialogOpen(false)}>Confirm</Button>
            </DialogFooter>
          </div>
        </Dialog>

      </div>
    </div>
  );
}
