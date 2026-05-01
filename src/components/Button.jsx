import React, { useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Button({ children, className, variant = 'primary', ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const center = { x: left + width / 2, y: top + height / 2 };
    const distance = { x: clientX - center.x, y: clientY - center.y };
    x.set(distance.x * 0.35);
    y.set(distance.y * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variants = {
    primary: 'bg-primary-600 text-white shadow-lg shadow-primary-500/20',
    secondary: 'bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10',
    danger: 'bg-red-500 text-white shadow-lg shadow-red-500/20',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-400',
    outline: 'bg-transparent text-primary-600 dark:text-primary-400 border-2 border-primary-600/30 dark:border-primary-500/30 hover:border-primary-600 dark:hover:border-primary-500'
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: mouseXSpring,
        y: mouseYSpring,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={twMerge(
        'px-6 py-2.5 rounded-2xl font-bold transition-shadow duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
