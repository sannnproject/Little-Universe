'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, RotateCw } from 'lucide-react';
import { loveConfig } from '@/data/love-config';
import { toggleNoteCardState } from '@/lib/love-logic';

export default function LoveNotes() {
  const notes = loveConfig.loveNotes;
  const [flippedIds, setFlippedIds] = useState<string[]>([notes[0]?.id || '']);

  const handleToggleCard = (id: string) => {
    setFlippedIds((prev) => toggleNoteCardState(prev, id));
  };

  const allFlipped = flippedIds.length === notes.length;
  const handleToggleAll = () => {
    if (allFlipped) {
      setFlippedIds([]);
    } else {
      setFlippedIds(notes.map((n) => n.id));
    }
  };

  return (
    <section
      id="love-notes"
      aria-label="Catatan Kecil Tentang Kamu"
      className="relative z-10 px-6 lg:px-12 py-20 lg:py-28 max-w-6xl mx-auto"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <p className="text-xs tracking-[0.24em] text-[#E6C99A] uppercase mb-3">
            {loveConfig.loveNotesSection.kicker}
          </p>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#FFF5EF] tracking-wide mb-3">
            {loveConfig.loveNotesSection.title}
          </h2>
          <p className="text-sm sm:text-base text-[#FFF5EF]/75 leading-relaxed">
            {loveConfig.loveNotesSection.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleAll}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#251529] hover:bg-[#722F47] text-xs font-medium text-[#FFF5EF] border border-[#E6C99A]/25 transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#E6C99A]" />
          <span>{allFlipped ? 'Tutup Semua Kartu' : 'Buka Semua Kartu'}</span>
        </button>
      </div>

      {/* 3-Column Interactive Note Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, idx) => {
          const isFlipped = flippedIds.includes(note.id);
          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="h-full"
            >
              <button
                type="button"
                onClick={() => handleToggleCard(note.id)}
                aria-expanded={isFlipped}
                aria-label={`Kartu catatan ${note.title}. ${
                  isFlipped ? note.message : 'Klik untuk membalik dan membaca pesan.'
                }`}
                className={`w-full min-h-[230px] rounded-2xl p-7 text-left transition-all duration-300 flex flex-col justify-between cursor-pointer border ${
                  isFlipped
                    ? 'bg-gradient-to-br from-[#722F47] via-[#4C1D31] to-[#251529] border-[#E6C99A]/55 shadow-[0_16px_40px_rgba(114,47,71,0.35)]'
                    : 'bg-[#181022]/90 hover:bg-[#21152E] border-[#E6C99A]/20 hover:border-[#E6C99A]/45'
                }`}
              >
                {/* Top Index & Flip Indicator */}
                <div className="w-full flex items-center justify-between text-xs">
                  <span className="font-mono tabular-nums text-[#E6C99A]">
                    {note.numberLabel} · Hal Kecil
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#F2A7B8]">
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isFlipped ? 'fill-[#F2A7B8] scale-110' : ''
                      }`}
                    />
                    <span>{isFlipped ? 'Terbuka' : 'Balik'}</span>
                  </span>
                </div>

                {/* Card Body: Front Title vs Back Revealed Personal Note */}
                <div className="my-4">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF5EF] mb-2">
                    {note.title}
                  </h3>
                  {isFlipped ? (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm sm:text-base text-[#FFF5EF]/95 leading-relaxed"
                    >
                      &ldquo;{note.message}&rdquo;
                    </motion.p>
                  ) : (
                    <p className="font-serif italic text-base text-[#E6C99A]/75">
                      {note.shortHint}
                    </p>
                  )}
                </div>

                {/* Bottom Subtle Divider */}
                <div className="w-full pt-3 border-t border-[#FFF5EF]/10 flex items-center justify-between text-[11px] text-[#FFF5EF]/60">
                  <span>Untuk {loveConfig.recipientName}</span>
                  <span>{isFlipped ? 'Klik untuk menutup' : 'Klik untuk membuka'}</span>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
