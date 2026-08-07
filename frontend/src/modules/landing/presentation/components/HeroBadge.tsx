'use client';

import React from 'react';
import { HERO_DATA } from '../../constants/landing.data';
import { SectionBadge } from '../../../../shared/sections/SectionBadge';

export const HeroBadge: React.FC = () => {
  return <SectionBadge label={HERO_DATA.badge} className="mb-8" />;
};
