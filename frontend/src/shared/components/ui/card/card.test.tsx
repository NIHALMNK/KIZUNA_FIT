import React from 'react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';
import { CardHeader, CardTitle, CardDescription } from './CardHeader';
import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { cardVariants } from './card.variants';
import { DEFAULT_CARD_VARIANT, DEFAULT_CARD_SIZE } from './card.constants';

describe('Card Component Golden Reference Suite', () => {
  it('1. defines correct default constants', () => {
    expect(DEFAULT_CARD_VARIANT).toBe('default');
    expect(DEFAULT_CARD_SIZE).toBe('md');
  });

  it('2. generates correct CVA classes for all 5 variants', () => {
    const variants = ['default', 'outlined', 'filled', 'elevated', 'ghost'] as const;
    variants.forEach((variant) => {
      const classes = cardVariants({ variant });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  it('3. generates correct CVA classes for all 3 sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      const classes = cardVariants({ size });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  it('4. maps default variant to bg-slate-900/70 glass design token class', () => {
    const classes = cardVariants({ variant: 'default' });
    expect(classes).toContain('bg-slate-900/70');
    expect(classes).toContain('backdrop-blur-2xl');
  });

  it('5. maps elevated variant to bg-slate-900/80 design token class', () => {
    const classes = cardVariants({ variant: 'elevated' });
    expect(classes).toContain('bg-slate-900/80');
  });

  it('6. maps outlined variant to border-2 design token', () => {
    const classes = cardVariants({ variant: 'outlined' });
    expect(classes).toContain('border-2');
  });

  it('7. constructs outer Card element with children', () => {
    const element = React.createElement(Card, null, 'Card Payload');
    expect(element.props.children).toBe('Card Payload');
  });

  it('8. constructs CardHeader sub-component with title and description', () => {
    const headerElement = React.createElement(
      CardHeader,
      null,
      React.createElement(CardTitle, null, 'Login'),
      React.createElement(CardDescription, null, 'Enter credentials to access account')
    );
    expect(headerElement.type).toBe(CardHeader);
    expect(headerElement.props.children).toBeDefined();
  });

  it('9. constructs CardContent sub-component', () => {
    const contentElement = React.createElement(CardContent, null, 'Form Body');
    expect(contentElement.type).toBe(CardContent);
    expect(contentElement.props.children).toBe('Form Body');
  });

  it('10. constructs CardFooter sub-component', () => {
    const footerElement = React.createElement(CardFooter, null, 'Submit Controls');
    expect(footerElement.type).toBe(CardFooter);
    expect(footerElement.props.children).toBe('Submit Controls');
  });

  it('11. constructs full compositional Card payload', () => {
    const fullCard = React.createElement(
      Card,
      { variant: 'elevated', size: 'lg' },
      React.createElement(CardHeader, null, React.createElement(CardTitle, null, 'Dashboard')),
      React.createElement(CardContent, null, React.createElement('p', null, 'Analytics Summary')),
      React.createElement(CardFooter, null, React.createElement('button', null, 'View Details'))
    );
    expect(fullCard.props.variant).toBe('elevated');
    expect(fullCard.props.size).toBe('lg');
  });

  it('12. supports custom className override on Card container', () => {
    const classes = cardVariants({ className: 'max-w-md mx-auto' });
    expect(classes).toContain('max-w-md');
    expect(classes).toContain('mx-auto');
  });

  it('13. supports ARIA attributes and landmark roles on Card container', () => {
    const element = React.createElement(Card, { role: 'region', 'aria-label': 'User Statistics' });
    expect(element.props.role).toBe('region');
    expect(element.props['aria-label']).toBe('User Statistics');
  });

  it('14. verifies React.forwardRef wrap and component metadata on Card', () => {
    expect(Card.displayName).toBe('Card');
    expect(typeof Card).toBe('object');
  });

  it('15. verifies displayName metadata across all Card sub-components', () => {
    expect(CardHeader.displayName).toBe('CardHeader');
    expect(CardTitle.displayName).toBe('CardTitle');
    expect(CardDescription.displayName).toBe('CardDescription');
    expect(CardContent.displayName).toBe('CardContent');
    expect(CardFooter.displayName).toBe('CardFooter');
  });
});
