import React from 'react';
import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';

export const springTransition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
};

export const easeOutQuint = [0.22, 1, 0.36, 1] as const;

interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
  viewportOnce?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  delay = 0,
  direction = 'up',
  distance = 28,
  duration = 0.6,
  children,
  className = '',
  viewportOnce = true,
  ...props
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const initial = {
    opacity: 0,
    ...getInitialPosition(),
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: easeOutQuint,
        },
      }}
      viewport={{ once: viewportOnce, margin: '-60px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  staggerChildren?: number;
  delayChildren?: number;
  children: React.ReactNode;
  className?: string;
  viewportOnce?: boolean;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  staggerChildren = 0.08,
  delayChildren = 0.05,
  children,
  className = '',
  viewportOnce = true,
  ...props
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: viewportOnce, margin: '-60px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<HTMLMotionProps<'div'> & { children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
  ...props
}) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: easeOutQuint,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

export const HoverScale: React.FC<HTMLMotionProps<'div'> & { children: React.ReactNode; className?: string; y?: number }> = ({
  children,
  className = '',
  y = -4,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y, transition: { duration: 0.22, ease: 'easeOut' } }}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
