'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import { loveConfig } from '@/data/love-config';
import HeartParticles from '@/components/effects/HeartParticles';

interface FinalMessageProps {
  onRestartToIntro: () => void;
}

export default function FinalMessage({ onRestartToIntro }: FinalMessageProps) {
  const [hugSent, setHugSent] = useState(false);
  const [hugBurstKey, setHugBurstKey] = useState(0);

  const handleSendHug = () => {
    setHugSent(true);
    setHugBurstKey((prev) => prev + 1);
  };

  return (
    <section
      id="final-message"
      aria-label="Pesan Penutup dan Pelukan Virtual"
      className="relative z-10 px-6 lg:px-12 py-20 lg:py-28 max-w-4xl mx-auto"
    >
      <motion.div
        animate={{ scale: hugSent ? 1.015 : 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl bg-gradient-to-b from-[#251529] to-[#160D1E] border border-[#E6C99A]/35 p-8 sm:p-14 text-center overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
      >
        {/* Heart Particles Burst on Virtual Hug */}
        <div key={hugBurstKey}>
          <HeartParticles active={hugSent} count={10} variant="warm" />
        </div>

        {/* Center Glowing Heart Emblem */}
        <div className="relative z-10 flex justify-center mb-6">
          <motion.div
            animate={
              hugSent
                ? { scale: [1, 1.2, 1.08] }
                : { scale: 1 }
            }
            transition={{ duration: 0.6 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center border transition-colors ${
              hugSent
                ? 'bg-[#722F47] border-[#E6C99A] shadow-[0_0_40px_rgba(242,167,184,0.55)]'
                : 'bg-[#181022] border-[#E6C99A]/30'
            }`}
          >
            <Heart
              className={`w-7 h-7 transition-colors ${
                hugSent
                  ? 'text-[#FFF5EF] fill-[#F2A7B8]'
                  : 'text-[#F2A7B8]'
              }`}
            />
          </motion.div>
        </div>

        <h2 className="relative z-10 font-serif text-3xl sm:text-5xl text-[#FFF5EF] tracking-wide mb-3">
          {loveConfig.finalMessage.heading}
        </h2>

        <p className="relative z-10 text-base sm:text-lg text-[#FFF5EF]/80 max-w-xl mx-auto mb-8 leading-relaxed">
          {loveConfig.finalMessage.subheading}
        </p>

        {/* Interactive Virtual Hug Feedback */}
        <AnimatePresence mode="wait">
          {hugSent && (
            <motion.div
              key={hugBurstKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 mb-8 p-6 rounded-xl bg-[#100C18]/75 border border-[#F2A7B8]/35 max-w-lg mx-auto"
            >
              <p className="font-serif italic text-2xl sm:text-3xl text-[#E6C99A] mb-2">
                &ldquo;{loveConfig.finalMessage.hugActiveText}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#FFF5EF]/85">
                {loveConfig.finalMessage.hugActiveSubtext}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary & Secondary Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleSendHug}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#722F47] hover:bg-[#8B3A57] text-[#FFF5EF] border border-[#E6C99A]/45 shadow-[0_10px_30px_rgba(114,47,71,0.45)] hover:-translate-y-0.5 transition-all text-sm sm:text-base font-medium cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#E6C99A]" />
            <span>
              {hugSent
                ? loveConfig.finalMessage.replayHugText
                : loveConfig.finalMessage.hugButtonText}
            </span>
          </button>

          <button
            type="button"
            onClick={onRestartToIntro}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#181022] hover:bg-[#251529] text-[#FFF5EF]/85 hover:text-[#FFF5EF] border border-[#E6C99A]/25 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-[#F2A7B8]" />
            <span>{loveConfig.finalMessage.restartButtonText}</span>
          </button>
        </div>
      </motion.div>

      {/* Quiet Editorial Footer with SANN404 FORUM GROUP Credit */}
      <footer className="mt-14 text-center text-xs text-[#FFF5EF]/55 flex flex-wrap items-center justify-center gap-2">
        <span>{loveConfig.siteTitle}</span>
        <span aria-hidden="true">·</span>
        <span>
          Dibuat dengan tulus oleh {loveConfig.senderName} untuk{' '}
          {loveConfig.recipientName}
        </span>
        <span aria-hidden="true">·</span>
        <span className="text-[#E6C99A] font-medium tracking-wider">
          Credit: {loveConfig.creditGroup}
        </span>
      </footer>
    </section>
  );
}
