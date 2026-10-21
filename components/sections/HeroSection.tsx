'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, BookOpen, Images } from 'lucide-react';
import { loveConfig } from '@/data/love-config';
import { calculateRelationshipDuration } from '@/lib/love-logic';
import RomanticPhoto from '@/components/ui/RomanticPhoto';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const durationInfo = calculateRelationshipDuration(loveConfig.anniversaryDate);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Bagian Utama"
      className="relative min-h-[92svh] w-full flex flex-col justify-between overflow-hidden px-6 lg:px-12 py-16 lg:py-24"
    >
      {/* Background Golden Hour Photography with Subtle Slow Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.8,
            ease: 'easeOut',
          }}
          className="w-full h-full"
        >
          <RomanticPhoto
            src={loveConfig.hero.heroImage}
            fallbackSrc="/images/couple-sunset.svg"
            alt={loveConfig.hero.heroImageAlt}
            priority
            className="w-full h-full border-0"
            imgClassName="object-center"
          />
        </motion.div>

        {/* Measured Contrast Scrim for Guaranteed Legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#100C18] via-[#100C18]/70 to-[#100C18]/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#100C18]/85 via-[#100C18]/40 to-transparent"
        />
      </div>

      {/* Main Editorial Content Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto my-auto pt-6 pb-10">
        <div className="max-w-3xl">
          {/* Quiet Kicker Label */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm tracking-[0.24em] text-[#E6C99A] uppercase mb-5"
          >
            {loveConfig.hero.kicker}
          </motion.p>

          {/* Staggered Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#FFF5EF] leading-[1.12] tracking-wide mb-6"
            style={{ textWrap: 'balance' }}
          >
            <span className="block">{loveConfig.hero.titleLine1}</span>
            <span className="block italic text-[#F2A7B8] mt-1">
              {loveConfig.hero.titleLine2}
            </span>
          </motion.h1>

          {/* Emotional Lead Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="text-base sm:text-lg text-[#FFF5EF]/85 leading-relaxed max-w-2xl mb-9"
          >
            {loveConfig.hero.description}
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <button
              type="button"
              onClick={() => scrollTo('love-letter')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#722F47] hover:bg-[#8A3B58] text-[#FFF5EF] border border-[#E6C99A]/45 shadow-[0_8px_28px_rgba(114,47,71,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base font-medium cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4 text-[#E6C99A]" />
              <span>{loveConfig.hero.primaryCta}</span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo('photo-gallery')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#251529]/80 hover:bg-[#251529] text-[#FFF5EF] border border-[#E6C99A]/30 hover:border-[#E6C99A]/60 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base font-medium cursor-pointer whitespace-nowrap shrink-0"
            >
              <Images className="w-4 h-4 text-[#F2A7B8]" />
              <span>{loveConfig.hero.secondaryCta}</span>
            </button>
          </motion.div>

          {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.48 }}
            className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#E6C99A]/80 border-t border-[#E6C99A]/15 pt-5"
          >
            <span>Untuk {loveConfig.recipientName}</span>
            <span aria-hidden="true">·</span>
            <span>Dari {loveConfig.senderName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{durationInfo.formattedLabel}</span>
          </motion.div>
        </div>
      </div>

      {/* Minimalist Scroll Indicator (with bottom clearance for mobile music dock) */}
      <div className="relative z-10 max-w-6xl w-full mx-auto pb-10 sm:pb-0 flex items-center justify-between text-xs text-[#FFF5EF]/65">
        <button
          type="button"
          onClick={() => scrollTo('love-letter')}
          className="inline-flex items-center gap-2 hover:text-[#E6C99A] transition-colors cursor-pointer"
        >
          <span>Gulir perlahan untuk membaca</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
        <span className="hidden sm:inline font-serif italic text-sm text-[#F2A7B8]/80">
          A Little Universe, Just for You
        </span>
      </div>
    </section>
  );
}
