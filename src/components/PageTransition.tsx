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
    x: 20,
    scale: 0.99,
  },
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.99,
  },
};

const pageTransition: Transition = {
  x: { type: 'spring', stiffness: 360, damping: 34 },
  opacity: { duration: 0.2, ease: 'easeOut' },
  scale: { duration: 0.2, ease: 'easeOut' },
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
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
