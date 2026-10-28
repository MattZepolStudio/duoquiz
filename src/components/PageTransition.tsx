import React from 'react';
import { motion, AnimatePresence, type Transition } from 'motion/react';

interface PageTransitionProps {
  currentKey: string;
  children: React.ReactNode;
  className?: string;
}

const pageVariants = {
  enter: {
    opacity: 0,
    x: 24,
    scale: 0.985,
    filter: 'blur(2px)',
  },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    x: -24,
    scale: 0.985,
    filter: 'blur(2px)',
  },
};

const pageTransition: Transition = {
  x: { type: 'spring', stiffness: 340, damping: 32 },
  opacity: { duration: 0.22, ease: 'easeOut' },
  scale: { duration: 0.22, ease: 'easeOut' },
  filter: { duration: 0.22, ease: 'easeOut' },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  currentKey,
  children,
  className = 'w-full flex-1 min-h-0 flex flex-col items-center justify-start',
}) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentKey}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={pageTransition}
        className={className}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
