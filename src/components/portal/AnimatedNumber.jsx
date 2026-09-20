import { useEffect, useState } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';

/** Counts up to `value` on mount / change. Non-numeric values render as-is. */
const AnimatedNumber = ({ value, className }) => {
  const reduce = useReducedMotion();
  const numeric = typeof value === 'number' && Number.isFinite(value);
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!numeric || reduce) {
      setDisplay(value);
      return undefined;
    }
    const controls = animate(mv, value, {
      duration: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v))
    });
    return () => controls.stop();
  }, [value, numeric, reduce, mv]);

  return <span className={className}>{numeric ? Number(display).toLocaleString() : value}</span>;
};

export default AnimatedNumber;
