import { Variants } from 'framer-motion';

export const sidebarContainerVariants: Variants = {
  expanded: {
    width: 280,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  collapsed: {
    width: 80,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

export const drawerVariants: Variants = {
  hidden: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 32,
    },
  },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 32,
    },
  },
};

export const labelVariants: Variants = {
  expanded: {
    opacity: 1,
    display: 'block',
    transition: {
      duration: 0.18,
      delay: 0.05,
    },
  },
  collapsed: {
    opacity: 0,
    transitionEnd: {
      display: 'none',
    },
    transition: {
      duration: 0.1,
    },
  },
};

export const itemHoverVariants: Variants = {
  rest: {
    scale: 1,
    x: 0,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.01,
    x: 2,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
};
