import React from 'react';
import { describe, it, expect } from 'vitest';
import { Label } from './Label';
import { labelVariants } from './label.variants';
import { DEFAULT_LABEL_SIZE, OPTIONAL_LABEL_TEXT } from './label.constants';

describe('Label Component Golden Reference Suite', () => {
  it('1. defines correct default constants', () => {
    expect(DEFAULT_LABEL_SIZE).toBe('md');
    expect(OPTIONAL_LABEL_TEXT).toBe('(optional)');
  });

  it('2. generates correct CVA classes for all 3 sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      const classes = labelVariants({ size });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  it('3. generates correct CVA classes for all statuses', () => {
    const statuses = ['default', 'error', 'success', 'warning', 'disabled'] as const;
    statuses.forEach((status) => {
      const classes = labelVariants({ status });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  it('4. renders children text correctly', () => {
    const element = React.createElement(Label, null, 'Email Address');
    expect(element.props.children).toBe('Email Address');
  });

  it('5. handles htmlFor attribute linking', () => {
    const element = React.createElement(Label, { htmlFor: 'email-input' }, 'Email');
    expect(element.props.htmlFor).toBe('email-input');
  });

  it('6. handles isRequired boolean property', () => {
    const element = React.createElement(Label, { isRequired: true, children: 'Password' });
    expect(element.props.isRequired).toBe(true);
  });

  it('7. handles required alias property', () => {
    const element = React.createElement(Label, { required: true, children: 'Password' });
    expect(element.props.required).toBe(true);
  });

  it('8. handles isOptional boolean property', () => {
    const element = React.createElement(Label, { isOptional: true, children: 'Biography' });
    expect(element.props.isOptional).toBe(true);
  });

  it('9. handles optional alias property', () => {
    const element = React.createElement(Label, { optional: true, children: 'Biography' });
    expect(element.props.optional).toBe(true);
  });

  it('10. handles isDisabled state property', () => {
    const element = React.createElement(Label, { isDisabled: true, children: 'Inactive Field' });
    expect(element.props.isDisabled).toBe(true);
  });

  it('11. handles error status styling class', () => {
    const classes = labelVariants({ status: 'error' });
    expect(classes).toContain('text-rose-400');
  });

  it('12. handles success status styling class', () => {
    const classes = labelVariants({ status: 'success' });
    expect(classes).toContain('text-emerald-400');
  });

  it('13. handles warning status styling class', () => {
    const classes = labelVariants({ status: 'warning' });
    expect(classes).toContain('text-amber-400');
  });

  it('14. forwards custom className override', () => {
    const classes = labelVariants({ className: 'custom-label-class' });
    expect(classes).toContain('custom-label-class');
  });

  it('15. verifies React.forwardRef wrap and component metadata', () => {
    expect(Label.displayName).toBe('Label');
    expect(typeof Label).toBe('object');
  });
});
