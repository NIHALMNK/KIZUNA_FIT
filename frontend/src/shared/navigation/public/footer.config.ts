import { PUBLIC_ROUTES } from '../../constants/routes/public.routes';

export interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Find Trainers', href: PUBLIC_ROUTES.FIND_TRAINERS },
      { label: 'Features', href: PUBLIC_ROUTES.FEATURES },
      { label: 'How It Works', href: PUBLIC_ROUTES.HOW_IT_WORKS },
      { label: 'Pricing Plans', href: PUBLIC_ROUTES.PRICING },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About KIZUNAFIT', href: PUBLIC_ROUTES.ABOUT },
      { label: 'Success Stories', href: '/#testimonials' },
      { label: 'Contact Us', href: PUBLIC_ROUTES.CONTACT },
      { label: 'Trainer Portal', href: PUBLIC_ROUTES.LOGIN },
    ],
  },
  {
    title: 'Legal & Security',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'HIPAA & Biometric Compliance', href: '/security' },
      { label: 'Cookie Settings', href: '#' },
    ],
  },
];

export const FOOTER_BRAND_TEXT = {
  tagline: 'Elite 1-on-1 personal coaching transformed by real-time biometrics and intelligent programming.',
  copyright: `© ${new Date().getFullYear()} KIZUNAFIT Inc. All rights reserved.`,
};
