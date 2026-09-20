import { motion, useReducedMotion } from 'framer-motion';

import { EASE, fadeUp } from './motionVariants';

const container = (stagger = 0.07, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } }
});

/** Wrap a group of <Item/>s: children fade up one after another. */
export const Stagger = ({ children, className, stagger = 0.07, delay = 0, as = 'div', ...rest }) => {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      variants={container(stagger, delay)}
      initial={reduce ? false : 'hidden'}
      animate="show"
      {...rest}
    >
      {children}
    </Comp>
  );
};

export const Item = ({ children, className, variants = fadeUp, as = 'div', ...rest }) => {
  const Comp = motion[as] || motion.div;
  return (
    <Comp className={className} variants={variants} {...rest}>
      {children}
    </Comp>
  );
};

/** Single element that fades up on mount. */
export const FadeIn = ({ children, className, delay = 0, y = 14, ...rest }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
