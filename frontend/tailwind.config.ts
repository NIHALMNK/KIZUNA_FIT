import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-input-focus)',
        background: 'var(--color-background)',
        foreground: 'var(--color-text-primary)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: '#ffffff',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-text-primary)',
          hover: 'var(--color-secondary-hover)',
        },
        danger: {
          DEFAULT: 'var(--color-button-danger)',
          foreground: '#ffffff',
          hover: 'var(--color-button-danger-hover)',
        },
        destructive: {
          DEFAULT: 'var(--color-button-danger)',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: 'var(--color-surface-alt)',
          foreground: 'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-text-primary)',
        },
        popover: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-text-primary)',
        },
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-text-primary)',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        full: 'var(--radius-full)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [],
};
export default config;
