'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface HeartParticlesProps {
  active: boolean;
  count?: number;
  variant?: 'warm' | 'rose' | 'gold';
}

const PARTICLE_SEEDS = [
  { id: 0, x: -120, delay: 0.0, scale: 0.75, duration: 2.8 },
  { id: 1, x: -85, delay: 0.15, scale: 0.95, duration: 3.1 },
  { id: 2, x: -45, delay: 0.28, scale: 0.65, duration: 2.6 },
  { id: 3, x: -15, delay: 0.08, scale: 1.1, duration: 3.3 },
  { id: 4, x: 18, delay: 0.22, scale: 0.85, duration: 2.9 },
  { id: 5, x: 52, delay: 0.12, scale: 1.0, duration: 3.2 },
  { id: 6, x: 88, delay: 0.32, scale: 0.7, duration: 2.7 },
  { id: 7, x: 125, delay: 0.18, scale: 0.9, duration: 3.0 },
  { id: 8, x: -65, delay: 0.4, scale: 0.8, duration: 3.4 },
  { id: 9, x: 65, delay: 0.36, scale: 0.85, duration: 3.1 },
];

/**
 * Lightweight, reduced-motion-aware floating heart particles triggered on special moments
 * (Envelope open, Special Moment climax, Virtual Hug).
 */
export default function HeartParticles({
  active,
  count = 8,
  variant = 'rose',
}: HeartParticlesProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!active || prefersReducedMotion) {
    return null;
  }

  const items = PARTICLE_SEEDS.slice(0, Math.min(count, PARTICLE_SEEDS.length));
  const fillClass =
    variant === 'gold'
      ? 'text-[#E6C99A]'
      : variant === 'warm'
      ? 'text-[#FFF5EF]'
      : 'text-[#F2A7B8]';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-20"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 24, x: item.x * 0.5, scale: 0.4 }}
          animate={{
            opacity: [0, 0.9, 0.75, 0],
            y: -170,
            x: item.x,
            scale: item.scale,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: 'easeOut',
          }}
          className={`absolute ${fillClass}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="drop-shadow-sm"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
