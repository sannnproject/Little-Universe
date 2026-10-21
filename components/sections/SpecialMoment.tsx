'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { loveConfig } from '@/data/love-config';
import RomanticPhoto from '@/components/ui/RomanticPhoto';
import HeartParticles from '@/components/effects/HeartParticles';

export default function SpecialMoment() {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section
      id="special-moment"
      aria-label="Momen Spesial"
      className="relative z-10 w-full min-h-[82svh] flex items-center justify-center overflow-hidden px-6 lg:px-12 py-24 border-t border-[#E6C99A]/15"
    >
      {/* Starry Night Backdrop with Slow Zoom */}
      <div className="absolute inset-0 z-0">
        <RomanticPhoto
          src={loveConfig.specialMoment.backdropImage}
          fallbackSrc="/images/starry-night.svg"
          alt="Langit malam penuh bintang"
          className="w-full h-full border-0 opacity-65"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#100C18] via-[#100C18]/75 to-[#100C18]"
        />
        {/* Soft Center Spotlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(242,167,184,0.18) 0%, rgba(114,47,71,0.12) 40%, transparent 72%)',
          }}
        />
      </div>

      <HeartParticles active={isRevealed} count={10} variant="rose" />

      <div className="relative z-10 max-w-3xl w-full mx-auto text-center">
        {/* Glowing Heart Centerpiece */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#722F47]/50 border border-[#E6C99A]/40 shadow-[0_0_35px_rgba(242,167,184,0.35)] mb-8">
          <Heart className="w-7 h-7 text-[#F2A7B8] fill-[#F2A7B8]" />
        </div>

        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="prompt-state"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center"
            >
              <p className="font-serif italic text-3xl sm:text-5xl text-[#FFF5EF] tracking-wide mb-8">
                {loveConfig.specialMoment.initialPrompt}
              </p>

              <button
                type="button"
                onClick={() => setIsRevealed(true)}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#722F47] via-[#8F3C5A] to-[#722F47] text-[#FFF5EF] border border-[#E6C99A]/50 shadow-[0_12px_35px_rgba(114,47,71,0.5)] hover:-translate-y-0.5 transition-all text-sm sm:text-base font-medium cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#E6C99A]" />
                <span>{loveConfig.specialMoment.buttonText}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="revealed-state"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="space-y-4 max-w-2xl mx-auto">
                {loveConfig.specialMoment.paragraphs.map((para, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.25 }}
                    className="text-base sm:text-lg text-[#FFF5EF]/85 leading-relaxed"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.85 }}
                className="pt-8 mt-8 border-t border-[#E6C99A]/25"
              >
                <h2
                  className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FFF5EF] leading-tight mb-3"
                  style={{ textWrap: 'balance' }}
                >
                  {loveConfig.specialMoment.climaxLine1}
                </h2>
                <p className="font-serif italic text-3xl sm:text-5xl lg:text-6xl text-[#E6C99A] drop-shadow-[0_2px_20px_rgba(230,201,154,0.35)]">
                  {loveConfig.specialMoment.climaxLine2}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
