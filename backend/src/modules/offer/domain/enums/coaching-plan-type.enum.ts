export enum CoachingPlanType {
  BASIC = 'BASIC',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

export interface IPlatformPlanDefinition {
  planType: CoachingPlanType;
  name: string;
  durationDays: number;
  commissionRate: number; // e.g. 0.10 for 10%
  includedFeatures: string[];
  omittedFeatures: string[];
  liveSessionsDescription: string;
  hasProgressAnalyzer: boolean;
  hasPrioritySupport: boolean;
  tagline: string;
}

export const PLATFORM_COACHING_PLANS: Record<CoachingPlanType, IPlatformPlanDefinition> = {
  [CoachingPlanType.BASIC]: {
    planType: CoachingPlanType.BASIC,
    name: 'Basic Plan',
    durationDays: 30,
    commissionRate: 0.1, // 10%
    includedFeatures: ['Chat Support', 'Custom Workout Plan', 'Custom Diet Plan'],
    omittedFeatures: ['Live Video Sessions', 'Progress Analyzer', 'Priority Support'],
    liveSessionsDescription: 'No Live Sessions',
    hasProgressAnalyzer: false,
    hasPrioritySupport: false,
    tagline: 'Foundational coaching with continuous chat and personalized diet & workouts.',
  },
  [CoachingPlanType.PRO]: {
    planType: CoachingPlanType.PRO,
    name: 'Pro Plan',
    durationDays: 30,
    commissionRate: 0.15, // 15%
    includedFeatures: [
      'Chat Support',
      'Custom Workout Plan',
      'Custom Diet Plan',
      '3 Live Sessions / Week',
      'Progress Analyzer',
    ],
    omittedFeatures: ['Priority Support'],
    liveSessionsDescription: '3 Live Sessions / Week',
    hasProgressAnalyzer: true,
    hasPrioritySupport: false,
    tagline: 'Comprehensive coaching with 3 weekly live video sessions & progress analytics.',
  },
  [CoachingPlanType.PREMIUM]: {
    planType: CoachingPlanType.PREMIUM,
    name: 'Premium Plan',
    durationDays: 30,
    commissionRate: 0.2, // 20%
    includedFeatures: [
      'Chat Support',
      'Custom Workout Plan',
      'Custom Diet Plan',
      'Unlimited Live Sessions',
      'Progress Analyzer',
      'Priority Support',
    ],
    omittedFeatures: [],
    liveSessionsDescription: 'Unlimited Live Sessions (subject to availability)',
    hasProgressAnalyzer: true,
    hasPrioritySupport: true,
    tagline:
      'Elite coaching with unlimited live sessions, deep analytics, and VIP priority support.',
  },
};

export const getPlatformPlan = (planType: CoachingPlanType | string): IPlatformPlanDefinition => {
  const normalized = String(planType).toUpperCase().trim() as CoachingPlanType;
  const plan = PLATFORM_COACHING_PLANS[normalized];
  if (!plan) {
    throw new Error(
      `Unknown or unsupported platform plan type: '${planType}'. Must be BASIC, PRO, or PREMIUM.`,
    );
  }
  return plan;
};
