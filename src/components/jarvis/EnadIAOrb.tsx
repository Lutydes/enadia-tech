'use client';

import { motion } from 'framer-motion';

interface EnadIAOrbProps {
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: { container: 32, outerRing: 14, midRing: 11, innerRing: 8, core: 4, strokeWidth: 0.75 },
  md: { container: 48, outerRing: 21, midRing: 17, innerRing: 12, core: 6, strokeWidth: 1 },
  lg: { container: 72, outerRing: 32, midRing: 26, innerRing: 19, core: 9, strokeWidth: 1.25 },
  xl: { container: 120, outerRing: 54, midRing: 43, innerRing: 32, core: 14, strokeWidth: 1.75 },
};

export function EnadIAOrb({ isThinking = false, size = 'md' }: EnadIAOrbProps) {
  const s = sizes[size];
  const cx = s.container / 2;
  const cy = s.container / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.svg
        width={s.container}
        height={s.container}
        viewBox={`0 0 ${s.container} ${s.container}`}
        className={isThinking ? 'orb-glow-thinking' : 'orb-glow'}
        animate={isThinking ? { scale: [1, 1.08, 1] } : { scale: [1, 1.02, 1] }}
        transition={
          isThinking
            ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Outermost ring - dashed, slow rotation */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={s.outerRing}
          fill="none"
          stroke="rgba(0, 240, 255, 0.12)"
          strokeWidth={s.strokeWidth}
          strokeDasharray="3 8"
          animate={{ rotate: 360 }}
          transition={{ duration: isThinking ? 15 : 30, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Second ring - medium dash, medium rotation */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={s.outerRing - s.container * 0.06}
          fill="none"
          stroke="rgba(0, 240, 255, 0.2)"
          strokeWidth={s.strokeWidth}
          strokeDasharray="6 4"
          animate={{ rotate: -360 }}
          transition={{ duration: isThinking ? 10 : 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Middle ring - solid but thin, varied dash */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={s.midRing}
          fill="none"
          stroke="rgba(0, 240, 255, 0.25)"
          strokeWidth={s.strokeWidth * 0.75}
          strokeDasharray="12 3 3 3"
          animate={{ rotate: 360 }}
          transition={{ duration: isThinking ? 8 : 15, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Inner ring - solid thin */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={s.innerRing}
          fill="none"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth={s.strokeWidth * 0.75}
          animate={{ rotate: -360 }}
          transition={{ duration: isThinking ? 6 : 10, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Core glow background */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={s.core + 4}
          fill="none"
          stroke="rgba(0, 240, 255, 0.1)"
          strokeWidth={s.strokeWidth * 2}
          animate={{
            opacity: isThinking ? [0.3, 0.8, 0.3] : [0.3, 0.5, 0.3],
            scale: isThinking ? [1, 1.2, 1] : [1, 1.05, 1],
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          transition={{ duration: isThinking ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Core gradient circle */}
        <defs>
          <radialGradient id={`core-gradient-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 240, 255, 0.8)" />
            <stop offset="50%" stopColor="rgba(0, 240, 255, 0.5)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
          </radialGradient>
          <radialGradient id={`core-gradient-thinking-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 240, 255, 1)" />
            <stop offset="50%" stopColor="rgba(0, 240, 255, 0.7)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.4)" />
          </radialGradient>
        </defs>

        <motion.circle
          cx={cx}
          cy={cy}
          r={s.core}
          fill={`url(#core-gradient-${size})`}
          animate={isThinking ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          transition={{ duration: isThinking ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Core inner bright spot */}
        <circle cx={cx} cy={cy} r={s.core * 0.5} fill="rgba(0, 240, 255, 0.6)" />

        {/* Core highlight */}
        <circle
          cx={cx - s.core * 0.2}
          cy={cy - s.core * 0.2}
          r={s.core * 0.25}
          fill="rgba(255, 255, 255, 0.4)"
        />

        {/* Orbiting dot 1 - outer ring, clockwise */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{
            duration: isThinking ? 6 : 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle
            cx={cx + s.outerRing}
            cy={cy}
            r={size === 'xl' ? 2.5 : size === 'lg' ? 2 : 1.5}
            fill="rgba(0, 240, 255, 0.8)"
          />
        </motion.g>

        {/* Orbiting dot 2 - mid ring, counter-clockwise */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{
            duration: isThinking ? 8 : 14,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <circle
            cx={cx + s.midRing}
            cy={cy}
            r={size === 'xl' ? 2 : size === 'lg' ? 1.5 : 1}
            fill="rgba(59, 130, 246, 0.8)"
          />
        </motion.g>

        {/* Orbiting dot 3 - outer ring opposite side, slower */}
        {(size === 'lg' || size === 'xl') && (
          <motion.g
            animate={{ rotate: -360 }}
            transition={{
              duration: isThinking ? 12 : 18,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            <circle
              cx={cx + s.outerRing}
              cy={cy}
              r={size === 'xl' ? 1.8 : 1.2}
              fill="rgba(0, 240, 255, 0.5)"
            />
          </motion.g>
        )}

        {/* Orbiting dot 4 - inner ring, fast */}
        {(size === 'xl') && (
          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              duration: isThinking ? 4 : 7,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            <circle
              cx={cx + s.innerRing}
              cy={cy}
              r={1.5}
              fill="rgba(139, 92, 246, 0.7)"
            />
          </motion.g>
        )}

        {/* Scanning line when thinking */}
        {isThinking && (
          <motion.line
            x1={cx}
            y1={cy - s.outerRing}
            x2={cx}
            y2={cy + s.outerRing}
            stroke="rgba(0, 240, 255, 0.15)"
            strokeWidth={1}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        )}
      </motion.svg>

      {/* Extra glow overlay for thinking state */}
      {isThinking && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(0,240,255,0.1) 0%, transparent 70%)',
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}
