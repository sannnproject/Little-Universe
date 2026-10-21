'use client';

import React from 'react';

const STARS = [
  { id: 1, top: '8%', left: '12%', size: 2, opacity: 0.55 },
  { id: 2, top: '14%', left: '28%', size: 1.5, opacity: 0.4 },
  { id: 3, top: '6%', left: '54%', size: 2.5, opacity: 0.65 },
  { id: 4, top: '19%', left: '78%', size: 2, opacity: 0.5 },
  { id: 5, top: '24%', left: '91%', size: 1.5, opacity: 0.45 },
  { id: 6, top: '36%', left: '8%', size: 2, opacity: 0.4 },
  { id: 7, top: '42%', left: '66%', size: 1.5, opacity: 0.35 },
  { id: 8, top: '52%', left: '19%', size: 2.2, opacity: 0.5 },
  { id: 9, top: '64%', left: '84%', size: 2, opacity: 0.45 },
  { id: 10, top: '75%', left: '34%', size: 1.8, opacity: 0.4 },
  { id: 11, top: '83%', left: '72%', size: 2.2, opacity: 0.55 },
  { id: 12, top: '91%', left: '15%', size: 1.5, opacity: 0.38 },
];

/**
 * Lightweight cinematic ambient background with radial rose/plum glow,
 * delicate starlight, and soft vignette.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#100C18]"
    >
      {/* Top Rose & Plum Radial Glow */}
      <div
        className="absolute -top-32 left-1/4 w-[42rem] h-[42rem] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(114,47,71,0.55) 0%, rgba(37,21,41,0.2) 55%, transparent 75%)',
        }}
      />

      {/* Mid-Right Warm Champagne & Soft Rose Glow */}
      <div
        className="absolute top-1/3 -right-24 w-[36rem] h-[36rem] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(242,167,184,0.35) 0%, rgba(230,201,154,0.12) 50%, transparent 75%)',
        }}
      />

      {/* Bottom Deep Plum Glow */}
      <div
        className="absolute -bottom-32 left-1/3 w-[44rem] h-[44rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(37,21,41,0.85) 0%, rgba(114,47,71,0.25) 50%, transparent 75%)',
        }}
      />

      {/* Delicate Starlight Field */}
      {STARS.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-[#FFF5EF]"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Soft Screen Edge Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 52%, rgba(10, 7, 15, 0.72) 100%)',
        }}
      />
    </div>
  );
}
