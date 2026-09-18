import React, { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode;
  isDisabled?: boolean;
  isRequired?: boolean;
  isError?: boolean;
  className?: string;
}
