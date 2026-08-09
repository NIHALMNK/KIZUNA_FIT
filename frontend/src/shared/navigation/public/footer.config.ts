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
      { label: 'Create Account', href: PUBLIC_ROUTES.REGISTER },
      { label: 'Login', href: PUBLIC_ROUTES.LOGIN },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About KIZUNAFIT', href: PUBLIC_ROUTES.ABOUT },
      { label: 'Contact Us', href: PUBLIC_ROUTES.CONTACT },
    ],
  },
  {
    title: 'Legal & Security',
    links: [
      { label: 'Privacy Policy', href: PUBLIC_ROUTES.PRIVACY },
      { label: 'Terms of Service', href: PUBLIC_ROUTES.TERMS },
    ],
  },
];

export const FOOTER_BRAND_TEXT = {
  tagline: 'Elite 1-on-1 personal coaching transformed by real-time biometrics and intelligent programming.',
  copyright: `© ${new Date().getFullYear()} KIZUNAFIT Inc. All rights reserved.`,
};
