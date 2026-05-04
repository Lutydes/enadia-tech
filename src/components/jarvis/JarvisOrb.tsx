'use client';

import { motion } from 'framer-motion';

interface JarvisOrbProps {
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { container: 32, ring: 28, core: 10, stroke: 1.5 },
  md: { container: 48, ring: 42, core: 14, stroke: 2 },
  lg: { container: 64, ring: 56, core: 18, stroke: 2 },
};

export function JarvisOrb({ isThinking = false, size = 'md' }: JarvisOrbProps) {
  const s = sizes[size];

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.svg
        width={s.container}
        height={s.container}
        viewBox={`0 0 ${s.container} ${s.container}`}
        className={isThinking ? 'orb-glow-thinking' : 'orb-glow'}
        animate={isThinking ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Outer ring */}
        <motion.circle
          cx={s.container / 2}
          cy={s.container / 2}
          r={s.ring / 2 + s.ring / 2}
          fill="none"
          stroke="rgba(0, 240, 255, 0.15)"
          strokeWidth={s.stroke}
          strokeDasharray="4 6"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Middle ring */}
        <motion.circle
          cx={s.container / 2}
          cy={s.container / 2}
          r={s.ring}
          fill="none"
          stroke="rgba(0, 240, 255, 0.3)"
          strokeWidth={s.stroke}
          strokeDasharray="8 4"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Inner ring */}
        <motion.circle
          cx={s.container / 2}
          cy={s.container / 2}
          r={s.core + 6}
          fill="none"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth={s.stroke * 0.75}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Core */}
        <circle
          cx={s.container / 2}
          cy={s.container / 2}
          r={s.core}
          fill={isThinking ? 'rgba(0, 240, 255, 0.6)' : 'rgba(0, 240, 255, 0.4)'}
          className="transition-all duration-500"
        />

        {/* Core highlight */}
        <circle
          cx={s.container / 2 - s.core * 0.2}
          cy={s.container / 2 - s.core * 0.2}
          r={s.core * 0.35}
          fill="rgba(255, 255, 255, 0.3)"
        />
      </motion.svg>
    </div>
  );
}
