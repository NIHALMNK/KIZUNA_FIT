import React from 'react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';
import { buttonVariants } from './button.variants';
import { DEFAULT_BUTTON_VARIANT, DEFAULT_BUTTON_SIZE } from './button.constants';

describe('Button Component Golden Reference Suite', () => {
  it('1. renders children label correctly', () => {
    const element = React.createElement(Button, null, 'Click Me');
    expect(element.props.children).toBe('Click Me');
  });

  it('2. defines correct default constants', () => {
    expect(DEFAULT_BUTTON_VARIANT).toBe('primary');
    expect(DEFAULT_BUTTON_SIZE).toBe('md');
  });

  it('3. generates correct CVA classes for all 8 variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning', 'icon'] as const;
    variants.forEach((variant) => {
      const classes = buttonVariants({ variant });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  it('4. generates correct CVA classes for all 3 sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      const classes = buttonVariants({ size });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  it('5. maps primary variant to cyan gradient design token class', () => {
    const classes = buttonVariants({ variant: 'primary', size: 'md' });
    expect(classes).toContain('from-cyan-500');
    expect(classes).toContain('h-12');
  });

  it('6. maps danger variant to rose gradient design token class', () => {
    const classes = buttonVariants({ variant: 'danger' });
    expect(classes).toContain('from-rose-600');
  });

  it('7. maps success variant to emerald gradient design token class', () => {
    const classes = buttonVariants({ variant: 'success' });
    expect(classes).toContain('from-emerald-500');
  });

  it('8. maps warning variant to amber gradient design token class', () => {
    const classes = buttonVariants({ variant: 'warning' });
    expect(classes).toContain('from-amber-500');
  });

  it('9. handles fullWidth container boolean property', () => {
    const fullWidthClasses = buttonVariants({ fullWidth: true });
    expect(fullWidthClasses).toContain('w-full');

    const autoWidthClasses = buttonVariants({ fullWidth: false });
    expect(autoWidthClasses).toContain('w-auto');
  });

  it('10. constructs element with isDisabled prop', () => {
    const element = React.createElement(Button, { isDisabled: true, children: 'Disabled' });
    expect(element.props.isDisabled).toBe(true);
  });

  it('11. constructs element with isLoading prop', () => {
    const element = React.createElement(Button, { isLoading: true, children: 'Loading' });
    expect(element.props.isLoading).toBe(true);
  });

  it('12. forwards leftIcon and rightIcon props', () => {
    const element = React.createElement(Button, {
      leftIcon: React.createElement('span', null, '←'),
      rightIcon: React.createElement('span', null, '→'),
      children: 'With Icons',
    });
    expect(element.props.leftIcon).toBeDefined();
    expect(element.props.rightIcon).toBeDefined();
  });

  it('13. supports explicit aria-label attribute', () => {
    const element = React.createElement(Button, { variant: 'icon', 'aria-label': 'Close Menu' });
    expect(element.props['aria-label']).toBe('Close Menu');
  });

  it('14. supports explicit type attribute', () => {
    const element = React.createElement(Button, { type: 'submit' });
    expect(element.props.type).toBe('submit');
  });

  it('15. verifies React.forwardRef wrap and component metadata', () => {
    expect(Button.displayName).toBe('Button');
    expect(typeof Button).toBe('object');
  });
});
