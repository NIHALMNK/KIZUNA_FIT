export const DURATION = {
  FAST: 0.15,
  NORMAL: 0.25,
  SLOW: 0.4,
} as const;

export const EASING = {
  SPRING: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  EASE_OUT: [0.21, 0.47, 0.32, 0.98],
  SMOOTH: [0.4, 0, 0.2, 1],
} as const;
