'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { loveConfig } from '@/data/love-config';
import HeartParticles from '@/components/effects/HeartParticles';

interface OpeningScreenProps {
  onOpenComplete: () => void;
  onStartMusicOptional?: () => void;
}

export default function OpeningScreen({
  onOpenComplete,
  onStartMusicOptional,
}: OpeningScreenProps) {
  const [isOpening, setIsOpening] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);
    if (onStartMusicOptional) {
      onStartMusicOptional();
    }
    const delayMs = prefersReducedMotion ? 150 : 850;
    window.setTimeout(() => {
      onOpenComplete();
    }, delayMs);
  };

  return (
    <motion.section
      aria-label="Halaman Pembuka Surat Rahasia"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between px-6 py-8 min-h-[100svh] bg-[#100C18] overflow-hidden select-none"
    >
      {/* Ambient Radial Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 46%, rgba(114, 47, 71, 0.45) 0%, rgba(37, 21, 41, 0.68) 45%, rgba(16, 12, 24, 0.98) 100%)',
        }}
      />

      {/* Expanding Warm Light when Envelope Opens */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.9, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl z-10"
            style={{
              background:
                'radial-gradient(circle, rgba(255,245,239,0.85) 0%, rgba(230,201,154,0.55) 45%, rgba(242,167,184,0) 75%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Heart Particles on Open */}
      <HeartParticles active={isOpening} count={10} variant="gold" />

      {/* Top Skip Action */}
      <div className="relative z-20 w-full max-w-5xl flex items-center justify-between">
        <span className="text-xs tracking-[0.22em] text-[#E6C99A]/80 uppercase">
          A Secret Just for You
        </span>
        <button
          type="button"
          onClick={onOpenComplete}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#FFF5EF]/80 hover:text-[#FFF5EF] bg-[#251529]/80 border border-[#E6C99A]/25 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>{loveConfig.opening.skipText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Interactive Burgundy Envelope & Greeting */}
      <div className="relative z-20 flex flex-col items-center max-w-lg w-full text-center my-auto py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-9 pt-6"
        >
          {/* 3D Burgundy Envelope Container */}
          <div
            onClick={handleOpenEnvelope}
            role="presentation"
            className="relative w-72 sm:w-84 h-48 sm:h-54 rounded-2xl bg-[#3D1526] border border-[#E6C99A]/40 shadow-[0_24px_65px_rgba(0,0,0,0.75)] cursor-pointer overflow-visible group"
            style={{ perspective: '900px' }}
          >
            {/* Inner Warm Ivory Letter Card (Tucked inside until envelope opens) */}
            <motion.div
              animate={
                isOpening
                  ? { y: -54, scale: 1.02 }
                  : { y: 8, scale: 0.96 }
              }
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-5 top-5 bottom-5 z-10 rounded-xl bg-[#FFF5EF] border border-[#E6C99A] px-5 py-4 shadow-md flex flex-col items-center justify-center text-center"
            >
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#722F47] mb-1 font-medium">
                Khusus Untuk {loveConfig.recipientName}
              </p>
              <p className="font-serif italic text-lg sm:text-xl text-[#251529]">
                &ldquo;Sebuah semesta kecil dariku…&rdquo;
              </p>
            </motion.div>

            {/* Envelope Front Side & Bottom Pocket Folds (Opaque Burgundy covering the card when closed) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden z-20"
            >
              {/* Left and Right Diagonal Flaps */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, #65263D 0%, #4E1B2E 100%)',
                  clipPath: 'polygon(0 0, 52% 55%, 0 100%)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(225deg, #65263D 0%, #4E1B2E 100%)',
                  clipPath: 'polygon(100% 0, 48% 55%, 100% 100%)',
                }}
              />
              {/* Bottom Pocket Triangle */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, #7A2F4B 0%, #4A192C 100%)',
                  clipPath: 'polygon(0 100%, 50% 46%, 100% 100%)',
                }}
              />
              {/* Subtle Gold Diagonal Seam Lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 336 216"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="216"
                  x2="168"
                  y2="102"
                  stroke="#E6C99A"
                  strokeOpacity="0.28"
                  strokeWidth="1"
                />
                <line
                  x1="336"
                  y1="216"
                  x2="168"
                  y2="102"
                  stroke="#E6C99A"
                  strokeOpacity="0.28"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Top Envelope Flap with 3D Depth Illusion */}
            <motion.div
              aria-hidden="true"
              animate={
                isOpening
                  ? { rotateX: 165, opacity: 0.7 }
                  : { rotateX: 0, opacity: 1 }
              }
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                transformOrigin: 'top center',
                clipPath: 'polygon(0 0, 100% 0, 50% 58%)',
              }}
              className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-b from-[#8C3B58] via-[#722F47] to-[#592035] rounded-t-2xl shadow-lg"
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 336 216"
                preserveAspectRatio="none"
              >
                <polyline
                  points="0,0 168,125 336,0"
                  fill="none"
                  stroke="#E6C99A"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>

            {/* Centered Wax Heart Seal at Flap Apex */}
            <motion.div
              animate={
                isOpening
                  ? { scale: 0.4, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#E6C99A] via-[#D4AF7A] to-[#9E7B4F] p-0.5 shadow-[0_8px_24px_rgba(0,0,0,0.55)] flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-[#722F47] border border-[#FFF5EF]/35 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#F2A7B8] fill-[#F2A7B8]" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Greeting Text */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="font-serif italic text-4xl sm:text-5xl text-[#FFF5EF] tracking-wide mb-3"
        >
          {loveConfig.opening.greeting}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="text-base sm:text-lg text-[#FFF5EF]/80 max-w-md mb-8 leading-relaxed"
        >
          {loveConfig.opening.subtitle}
        </motion.p>

        {/* Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
        >
          <button
            type="button"
            onClick={handleOpenEnvelope}
            disabled={isOpening}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#722F47] via-[#8B3A57] to-[#722F47] text-[#FFF5EF] border border-[#E6C99A]/50 shadow-[0_10px_30px_rgba(114,47,71,0.5)] hover:border-[#E6C99A] hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base font-medium cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#E6C99A]" />
            <span>
              {isOpening ? 'Membuka untukmu…' : loveConfig.opening.buttonText}
            </span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Footer Attribution */}
      <div className="relative z-20 text-xs text-[#FFF5EF]/55 tracking-wider">
        <span>Dari {loveConfig.senderName}</span>
        <span aria-hidden="true" className="mx-2">
          ·
        </span>
        <span>Untuk {loveConfig.recipientName}</span>
      </div>
    </motion.section>
  );
}
