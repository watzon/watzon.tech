'use client';

import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const screenVariants = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(2px)', transition: { duration: 0.2 } },
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full max-w-4xl mx-auto"
    >
      {children}
    </motion.div>
  );
}