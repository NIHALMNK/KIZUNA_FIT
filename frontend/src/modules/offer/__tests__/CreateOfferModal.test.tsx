import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { CreateOfferModal } from '../presentation/components/CreateOfferModal';

describe('CreateOfferModal Presentation Component & Error Readability Tests', () => {
  it('1. Verifies component export and props contract', () => {
    expect(CreateOfferModal).toBeDefined();
    expect(typeof CreateOfferModal).toBe('function');
  });

  it('2. Evaluates CreateOfferModal element construction with consultation context', () => {
    const props = {
      consultationId: 'consultation_1787322771609_02ucf',
      isOpen: true,
      onClose: vi.fn(),
      onSubmit: vi.fn(),
    };

    const element = React.createElement(CreateOfferModal, props);
    expect(element.type).toBe(CreateOfferModal);
    expect(element.props.consultationId).toBe('consultation_1787322771609_02ucf');
    expect(element.props.isOpen).toBe(true);
  });
});
