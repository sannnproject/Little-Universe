'use client';

import React from 'react';
import { loveConfig } from '@/data/love-config';

/**
 * Clean 3-Zone Top Bar following the Universal Frontend Design Constitution:
 * [Brand title, one line] — [5 single-line nav links] — [1 primary action]
 */
export default function TopBar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 lg:px-12 py-3.5 bg-[#100C18]/90 backdrop-blur-md border-b border-[#E6C99A]/15">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('hero');
        }}
        className="font-serif italic text-xl sm:text-2xl text-[#FFF5EF] tracking-wide whitespace-nowrap shrink-0 hover:text-[#E6C99A] transition-colors"
      >
        {loveConfig.siteTitle}
      </a>

      {/* Zone 2: 5 concise single-line text navigation links */}
      <nav
        aria-label="Navigasi Utama"
        className="hidden md:flex items-center gap-6 text-sm font-medium text-[#FFF5EF]/75"
      >
        <a
          href="#love-letter"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('love-letter');
          }}
          className="hover:text-[#FFF5EF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Surat Cinta
        </a>
        <a
          href="#universe-3d"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('universe-3d');
          }}
          className="hover:text-[#FFF5EF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Semesta 3D
        </a>
        <a
          href="#photo-gallery"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('photo-gallery');
          }}
          className="hover:text-[#FFF5EF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Galeri Kenangan
        </a>
        <a
          href="#love-timeline"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('love-timeline');
          }}
          className="hover:text-[#FFF5EF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Cerita Kita
        </a>
        <a
          href="#love-notes"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('love-notes');
          }}
          className="hover:text-[#FFF5EF] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
        >
          Hal Kecil
        </a>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={() => scrollToSection('final-message')}
          className="px-4 py-2 text-xs font-medium text-[#FFF5EF] bg-[#722F47] hover:bg-[#893855] border border-[#E6C99A]/35 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Peluk Virtual
        </button>
      </div>
    </header>
  );
}
