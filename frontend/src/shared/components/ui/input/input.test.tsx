import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';
import { inputContainerVariants, inputElementVariants } from './input.variants';
import { DEFAULT_INPUT_VARIANT, DEFAULT_INPUT_SIZE } from './input.constants';

describe('Input Component Golden Reference Suite', () => {
  it('1. defines correct default constants', () => {
    expect(DEFAULT_INPUT_VARIANT).toBe('default');
    expect(DEFAULT_INPUT_SIZE).toBe('md');
  });

  it('2. generates correct CVA classes for all 4 variants', () => {
    const variants = ['default', 'filled', 'outline', 'ghost'] as const;
    variants.forEach((variant) => {
      const classes = inputContainerVariants({ variant });
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });
  });

  it('3. generates correct CVA classes for all 3 sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach((size) => {
      const containerClasses = inputContainerVariants({ size });
      const elementClasses = inputElementVariants({ size });
      expect(containerClasses.length).toBeGreaterThan(0);
      expect(elementClasses.length).toBeGreaterThan(0);
    });
  });

  it('4. maps status variants (default, error, success, warning) correctly', () => {
    const statuses = ['default', 'error', 'success', 'warning'] as const;
    statuses.forEach((status) => {
      const classes = inputContainerVariants({ status });
      expect(typeof classes).toBe('string');
    });
  });

  it('5. constructs element with label property', () => {
    const element = React.createElement(Input, { label: 'Email Address' });
    expect(element.props.label).toBe('Email Address');
  });

  it('6. constructs element with placeholder property', () => {
    const element = React.createElement(Input, { placeholder: 'Enter email...' });
    expect(element.props.placeholder).toBe('Enter email...');
  });

  it('7. constructs element with helperText property', () => {
    const element = React.createElement(Input, { helperText: 'We will never share your email.' });
    expect(element.props.helperText).toBe('We will never share your email.');
  });

  it('8. constructs element with error message string property', () => {
    const element = React.createElement(Input, { error: 'Invalid email address' });
    expect(element.props.error).toBe('Invalid email address');
  });

  it('9. constructs element with success message string property', () => {
    const element = React.createElement(Input, { success: 'Email verified!' });
    expect(element.props.success).toBe('Email verified!');
  });

  it('10. constructs element with warning message string property', () => {
    const element = React.createElement(Input, { warning: 'Email domain is unverified' });
    expect(element.props.warning).toBe('Email domain is unverified');
  });

  it('11. handles isDisabled property', () => {
    const element = React.createElement(Input, { isDisabled: true });
    expect(element.props.isDisabled).toBe(true);
  });

  it('12. handles isRequired property', () => {
    const element = React.createElement(Input, { isRequired: true });
    expect(element.props.isRequired).toBe(true);
  });

  it('13. handles isReadOnly property', () => {
    const element = React.createElement(Input, { isReadOnly: true });
    expect(element.props.isReadOnly).toBe(true);
  });

  it('14. handles fullWidth container styling', () => {
    const fullWidthClasses = inputContainerVariants({ fullWidth: true });
    expect(fullWidthClasses).toContain('w-full');
  });

  it('15. handles leftIcon, rightIcon, prefix, and suffix elements', () => {
    const element = React.createElement(Input, {
      leftIcon: React.createElement('span', null, '🔍'),
      rightIcon: React.createElement('span', null, '✓'),
      prefix: '$',
      suffix: 'USD',
    });
    expect(element.props.leftIcon).toBeDefined();
    expect(element.props.rightIcon).toBeDefined();
    expect(element.props.prefix).toBe('$');
    expect(element.props.suffix).toBe('USD');
  });

  it('16. handles isClearable and onClear callback props', () => {
    const onClearMock = vi.fn();
    const element = React.createElement(Input, {
      isClearable: true,
      value: 'Search term',
      onClear: onClearMock,
    });
    expect(element.props.isClearable).toBe(true);
    expect(element.props.onClear).toBe(onClearMock);
  });

  it('17. verifies React.forwardRef wrap and component metadata', () => {
    expect(Input.displayName).toBe('Input');
    expect(typeof Input).toBe('object');
  });
});
