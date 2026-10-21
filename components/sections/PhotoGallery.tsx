'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { loveConfig, GalleryItem } from '@/data/love-config';
import { getNextGalleryIndex } from '@/lib/love-logic';
import RomanticPhoto from '@/components/ui/RomanticPhoto';

export default function PhotoGallery() {
  const items = loveConfig.gallery;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction: 'next' | 'prev') => {
      setSelectedIndex((prev) => {
        if (prev === null) return null;
        return getNextGalleryIndex(prev, items.length, direction);
      });
    },
    [items.length]
  );

  // Keyboard navigation for Lightbox (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, navigateLightbox]);

  const activeItem: GalleryItem | null =
    selectedIndex !== null && items[selectedIndex] ? items[selectedIndex] : null;

  return (
    <section
      id="photo-gallery"
      aria-label="Galeri Foto Kenangan"
      className="relative z-10 px-6 lg:px-12 py-20 lg:py-28 max-w-6xl mx-auto"
    >
      {/* Section Header */}
      <div className="max-w-2xl mb-12">
        <p className="text-xs tracking-[0.24em] text-[#E6C99A] uppercase mb-3">
          {loveConfig.gallerySection.kicker}
        </p>
        <h2
          className="font-serif text-3xl sm:text-5xl text-[#FFF5EF] tracking-wide mb-4"
          style={{ textWrap: 'balance' }}
        >
          {loveConfig.gallerySection.title}
        </h2>
        <p className="text-sm sm:text-base text-[#FFF5EF]/75 leading-relaxed">
          {loveConfig.gallerySection.subtitle}
        </p>
      </div>

      {/* Asymmetric Editorial Bento Grid */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: (idx % 3) * 0.08 }}
            className={`${item.gridSpanClass} flex flex-col`}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Buka foto ${item.momentLabel}: ${item.caption}`}
              className="group relative w-full h-[300px] sm:h-[360px] rounded-2xl overflow-hidden text-left cursor-pointer border border-[#E6C99A]/20 hover:border-[#E6C99A]/50 transition-colors flex flex-col justify-end"
            >
              <RomanticPhoto
                src={item.src}
                fallbackSrc={item.fallbackSrc}
                alt={item.alt}
                momentLabel={item.momentLabel}
                captionOverlay={item.caption}
                className="absolute inset-0 w-full h-full border-0"
                imgClassName="group-hover:scale-105"
              />

              {/* Measured Scrim Overlay for Caption Legibility */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#100C18]/90 via-[#100C18]/35 to-transparent"
              />

              {/* Top-Right Expand Affordance Icon */}
              <div
                aria-hidden="true"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#100C18]/70 border border-[#E6C99A]/30 flex items-center justify-center text-[#FFF5EF]/80 group-hover:text-[#E6C99A] transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption & Unboxed Metadata */}
              <div className="relative z-10 p-6 sm:p-7">
                <div className="flex items-center gap-2 text-xs text-[#E6C99A] mb-2">
                  <span>{item.momentLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.locationOrTime}</span>
                </div>
                <p className="font-serif italic text-lg sm:text-xl text-[#FFF5EF] leading-snug">
                  &ldquo;{item.caption}&rdquo;
                </p>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Accessible Lightbox Modal */}
      <AnimatePresence>
        {activeItem && selectedIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Pratinjau Foto: ${activeItem.momentLabel}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#100C18]/95 p-4 sm:p-8"
            onClick={closeLightbox}
          >
            <div
              className="relative max-w-4xl w-full rounded-2xl bg-[#181022] border border-[#E6C99A]/35 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Top Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E6C99A]/15">
                <div className="flex items-center gap-2 text-xs text-[#E6C99A]">
                  <span className="font-mono tabular-nums">
                    {selectedIndex + 1} / {items.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeItem.momentLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeItem.locationOrTime}</span>
                </div>
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Tutup galeri foto"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251529] hover:bg-[#722F47] text-xs font-medium text-[#FFF5EF] transition-colors cursor-pointer"
                >
                  <span>Tutup</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lightbox Image Viewport */}
              <div className="relative w-full aspect-[16/10] max-h-[62svh] bg-[#100C18]">
                <RomanticPhoto
                  src={activeItem.src}
                  fallbackSrc={activeItem.fallbackSrc}
                  alt={activeItem.alt}
                  priority
                  className="w-full h-full border-0"
                />
              </div>

              {/* Lightbox Caption & Prev/Next Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-[#181022]">
                <p className="font-serif italic text-xl sm:text-2xl text-[#FFF5EF] max-w-2xl">
                  &ldquo;{activeItem.caption}&rdquo;
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigateLightbox('prev')}
                    aria-label="Foto sebelumnya"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#251529] hover:bg-[#722F47] text-xs font-medium text-[#FFF5EF] border border-[#E6C99A]/25 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateLightbox('next')}
                    aria-label="Foto berikutnya"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#722F47] hover:bg-[#8A3B58] text-xs font-medium text-[#FFF5EF] border border-[#E6C99A]/35 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
