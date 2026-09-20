// Shared animation constants (kept out of motion.jsx so that file only exports components).
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }
};

export const pop = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE } }
};
