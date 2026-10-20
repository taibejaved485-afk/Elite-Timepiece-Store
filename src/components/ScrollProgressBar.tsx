import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-gold z-[101] origin-left"
      style={{ scaleX }}
    />
  );
};
