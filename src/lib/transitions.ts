
import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    x: '-100%', 
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    y: '100%', 
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { opacity: 0 }
};
