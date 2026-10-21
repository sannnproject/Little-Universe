'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Type } from 'lucide-react';
import { loveConfig } from '@/data/love-config';
import {
  getLetterTypographySpec,
  LetterFontScale,
} from '@/lib/love-logic';

const FONT_SCALES: LetterFontScale[] = ['normal', 'large', 'xlarge'];

export default function LoveLetter() {
  const [fontScale, setFontScale] = useState<LetterFontScale>('normal');
  const [replayCount, setReplayCount] = useState(0);
  const letterTopRef = useRef<HTMLDivElement | null>(null);

  const typoSpec = getLetterTypographySpec(fontScale);

  const handleReplayLetter = () => {
    setReplayCount((prev) => prev + 1);
    if (letterTopRef.current) {
      letterTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="love-letter"
      aria-label="Surat Cinta"
      className="relative z-10 px-6 lg:px-12 py-20 lg:py-28 max-w-5xl mx-auto"
    >
      <div ref={letterTopRef} className="text-center mb-10">
        <p className="text-xs tracking-[0.24em] text-[#E6C99A] uppercase mb-3">
          {loveConfig.loveLetter.sectionKicker}
        </p>
        <h2 className="font-serif italic text-3xl sm:text-5xl text-[#FFF5EF] tracking-wide">
          {loveConfig.loveLetter.title}
        </h2>
      </div>

      {/* Editorial Journal Page Container (Warm Ivory surface for visual contrast) */}
      <motion.article
        key={replayCount}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl bg-[#FFF5EF] text-[#251529] border border-[#E6C99A] shadow-[0_24px_70px_rgba(0,0,0,0.55)] p-7 sm:p-12 lg:p-16"
      >
        {/* Top Reader Toolbar: Botanical Ornament + Font Size Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#722F47]/15">
          {/* Minimalist Botanical Rose & Heart Line Flourish */}
          <div className="flex items-center gap-3 text-[#722F47]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M12 21s-6.5-4.35-9-8.5C1.2 9.5 3.2 5.5 7 5.5c2.1 0 3.8 1.2 5 2.8 1.2-1.6 2.9-2.8 5-2.8 3.8 0 5.8 4 4 7-2.5 4.15-9 8.5-9 8.5z" />
            </svg>
            <span className="text-xs tracking-[0.18em] uppercase text-[#722F47]/80 font-medium">
              Jurnal Pribadi · Untuk {loveConfig.recipientName}
            </span>
          </div>

          {/* Reader Font Scale Selector */}
          <div
            role="group"
            aria-label="Pengaturan Ukuran Tulisan Surat"
            className="flex items-center gap-1.5 bg-[#F3E5DC] p-1 rounded-lg"
          >
            <span className="inline-flex items-center gap-1 px-2 text-xs text-[#722F47]">
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ukuran:</span>
            </span>
            {FONT_SCALES.map((scaleOption) => {
              const spec = getLetterTypographySpec(scaleOption);
              const isSelected = fontScale === scaleOption;
              return (
                <button
                  key={scaleOption}
                  type="button"
                  onClick={() => setFontScale(scaleOption)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#722F47] text-[#FFF5EF]'
                      : 'text-[#251529]/75 hover:text-[#251529]'
                  }`}
                >
                  {spec.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Salutation */}
        <p
          className={`font-serif italic text-[#722F47] mb-6 ${typoSpec.leadClass}`}
        >
          {loveConfig.loveLetter.salutation}
        </p>

        {/* Letter Paragraphs with Gentle Viewport Reveal */}
        <div className="space-y-5 text-[#251529]/90">
          {loveConfig.loveLetter.paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: 'easeOut',
              }}
              className={`${typoSpec.bodyClass} max-w-[68ch]`}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Handwritten-Style Divider & Signature Closing */}
        <div className="mt-10 pt-8 border-t border-[#722F47]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="font-serif italic text-xl sm:text-2xl text-[#722F47] mb-1">
              {loveConfig.loveLetter.closing}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#251529]">
              — {loveConfig.senderName}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReplayLetter}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#251529] hover:bg-[#722F47] text-[#FFF5EF] text-xs sm:text-sm font-medium transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#E6C99A]" />
            <span>{loveConfig.loveLetter.replayButtonText}</span>
          </button>
        </div>
      </motion.article>
    </section>
  );
}
