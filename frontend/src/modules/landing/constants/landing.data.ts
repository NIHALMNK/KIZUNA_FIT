import { PUBLIC_ROUTES } from '../../../shared/constants/routes/public.routes';

export const HERO_DATA = {
  badge: 'KIZUNAFIT 2.0 • AI-POWERED 1-ON-1 COACHING',
  headlineLine1: 'Elite Fitness Coaching',
  headlineLine2: 'Transformed by Intelligence',
  subtitle:
    'Connect 1-on-1 with certified personal trainers, track real-time biometrics, and experience hyper-personalized workout & nutrition programming built for real physical transformation.',
  primaryCta: {
    label: 'Find Your Trainer',
    href: PUBLIC_ROUTES.FIND_TRAINERS,
  },
  secondaryCta: {
    label: 'Login / Explore',
    href: PUBLIC_ROUTES.LOGIN,
  },
};

export const STATS_DATA = [
  { value: '2,400+', label: 'Clients Transformed', highlightColor: 'text-white' },
  { value: '150+', label: 'Certified Master Trainers', highlightColor: 'text-cyan-400' },
  { value: '98.4%', label: 'Program Completion Rate', highlightColor: 'text-emerald-400' },
  { value: '4.9 / 5 ★', label: 'Average Client Rating', highlightColor: 'text-amber-400' },
];

export const PROBLEM_SOLUTION_DATA = {
  badge: 'The Problem & The Solution',
  title: 'Traditional Coaching is Broken.',
  subtitle:
    'Generic PDF workout plans, lost WhatsApp messages, and zero biometric tracking lead to frustration. KIZUNAFIT replaces chaos with intelligent 1-on-1 structure.',
  oldWay: {
    title: 'The Old Way of Online Coaching',
    points: [
      'Static PDF workout sheets emailed once and forgotten',
      'Disconnected WhatsApp chats with delayed feedback',
      'Zero real-time telemetry or biometric tracking',
      'No accountability when motivation drops',
    ],
  },
  newWay: {
    title: 'The KIZUNAFIT Experience',
    points: [
      'Interactive workout logger with live set & rep counters',
      'Direct 1-on-1 HD video check-ins and form analysis',
      'Live biometric weight progression & macro telemetry',
      'Certified coach matching tailored to your specific goals',
    ],
  },
};

export const FEATURES_DATA = [
  {
    id: 'discovery',
    title: 'Trainer Discovery & Matching',
    description:
      'Filter certified coaches by specialization, certifications, pricing, and verified client success rates.',
    iconColor: 'cyan',
  },
  {
    id: 'tracking',
    title: 'Precision Workout Tracking',
    description:
      'Log sets, reps, load, and RPE with instant trainer review and automated progress curves.',
    iconColor: 'teal',
  },
  {
    id: 'nutrition',
    title: 'Smart Nutrition & Macros',
    description:
      'Custom caloric targets and macronutrient split guidance adjusted weekly based on body response.',
    iconColor: 'emerald',
  },
  {
    id: 'video',
    title: '1-on-1 Video Consultations',
    description:
      'Integrated HD video sessions for posture evaluation, movement checkups, and goal setting.',
    iconColor: 'blue',
  },
  {
    id: 'messaging',
    title: 'Direct Coach Messaging',
    description:
      'Encrypted messaging with exercise video attachments for instant form feedback.',
    iconColor: 'purple',
  },
  {
    id: 'analytics',
    title: 'Performance Analytics',
    description:
      'Track 1RM PR milestones, body fat composition, and workout streak achievements over time.',
    iconColor: 'amber',
  },
];

export const HOW_IT_WORKS_DATA = [
  {
    step: 1,
    title: 'Discover Your Coach',
    description:
      'Browse verified trainer profiles, review specializations, and find the perfect match.',
    color: 'cyan',
  },
  {
    step: 2,
    title: 'Book Consultation',
    description:
      'Schedule your 1-on-1 video intake session to align on goals, injuries, and target timelines.',
    color: 'teal',
  },
  {
    step: 3,
    title: 'Receive Custom Plan',
    description:
      'Get your custom weekly workouts, video exercise guides, and caloric macro breakdown.',
    color: 'emerald',
  },
  {
    step: 4,
    title: 'Execute & Transform',
    description:
      'Log daily workouts, receive trainer feedback, track biometrics, and achieve your goals.',
    color: 'amber',
  },
];

export const FEATURED_TRAINERS_DATA = [
  {
    id: 'marcus-vance',
    name: 'Coach Marcus Vance',
    title: 'NASM Master Trainer • CSCS',
    rating: '5.0 ★',
    reviewCount: 128,
    tags: ['Hypertrophy', 'Powerlifting', '8+ Yrs Exp'],
    price: '$49',
    initials: 'MV',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'elena-rostova',
    name: 'Coach Elena Rostova',
    title: 'IFBB Pro • Precision Nutrition',
    rating: '4.9 ★',
    reviewCount: 94,
    tags: ['Body Recomp', 'Fat Loss', '6+ Yrs Exp'],
    price: '$55',
    initials: 'ER',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'david-chen',
    name: 'Coach David Chen',
    title: 'EXOS Performance • D1 Specialist',
    rating: '5.0 ★',
    reviewCount: 156,
    tags: ['Athletic Speed', 'Mobility', '10+ Yrs Exp'],
    price: '$65',
    initials: 'DC',
    gradient: 'from-amber-500 to-orange-600',
  },
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    quote:
      'KIZUNAFIT transformed how I train. Having Coach Marcus look at my set videos and adjust macros every Sunday lost me 18 lbs of fat while adding 40 lbs to my deadlift.',
    author: 'Alex Rivera',
    role: 'Software Engineer',
    result: '-18 lbs Fat • +40 lbs Deadlift',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'The live biometrics telemetry and instant feedback from Coach Elena kept me accountable for 12 straight weeks. I’ve never seen my abs before now!',
    author: 'Sophia Zhang',
    role: 'Product Designer',
    result: '12-Week Body Recomp Success',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'As a busy executive, I needed structure without wasted time. The 1-on-1 video consults and weekly plan adjustments fit seamlessly into my calendar.',
    author: 'Michael Sterling',
    role: 'Managing Director',
    result: '15% Body Fat Reduction',
    rating: 5,
  },
];
