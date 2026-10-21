'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { loveConfig } from '@/data/love-config';
import RomanticPhoto from '@/components/ui/RomanticPhoto';

export default function LoveTimeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 25%'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section
      id="love-timeline"
      aria-label="Perjalanan Cerita Kita"
      className="relative z-10 px-6 lg:px-12 py-20 lg:py-28 max-w-6xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs tracking-[0.24em] text-[#E6C99A] uppercase mb-3">
          {loveConfig.timelineSection.kicker}
        </p>
        <h2
          className="font-serif text-3xl sm:text-5xl text-[#FFF5EF] tracking-wide mb-4"
          style={{ textWrap: 'balance' }}
        >
          {loveConfig.timelineSection.title}
        </h2>
        <p className="text-sm sm:text-base text-[#FFF5EF]/75 leading-relaxed">
          {loveConfig.timelineSection.subtitle}
        </p>
      </div>

      {/* Timeline Container with Animated Scroll Progress Line */}
      <div ref={containerRef} className="relative">
        {/* Background Static Track Line */}
        <div
          aria-hidden="true"
          className="absolute left-4 lg:left-1/2 top-2 bottom-2 w-px bg-[#E6C99A]/20 -translate-x-1/2"
        />

        {/* Animated Scroll Progress Fill Line */}
        <motion.div
          aria-hidden="true"
          style={{ scaleY, transformOrigin: 'top' }}
          className="absolute left-4 lg:left-1/2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#E6C99A] via-[#F2A7B8] to-[#722F47] -translate-x-1/2"
        />

        <div className="space-y-12 lg:space-y-16">
          {loveConfig.timeline.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center pl-12 lg:pl-0"
              >
                {/* Timeline Chapter Marker Node */}
                <div
                  aria-hidden="true"
                  className="absolute left-4 lg:left-1/2 top-6 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#181022] border border-[#E6C99A] flex items-center justify-center shadow-[0_0_20px_rgba(230,201,154,0.25)]"
                >
                  <span className="font-mono tabular-nums text-[11px] text-[#E6C99A]">
                    {item.chapterNumber}
                  </span>
                </div>

                {/* Left Column on Desktop */}
                <div
                  className={`lg:col-span-5 ${
                    isEven
                      ? 'lg:text-right lg:pr-6 order-1'
                      : 'lg:col-start-8 lg:pl-6 order-1 lg:order-2'
                  }`}
                >
                  <div className="rounded-2xl bg-[#181022]/90 border border-[#E6C99A]/20 p-6 sm:p-8 shadow-xl">
                    {/* Unboxed Date & Chapter Metadata */}
                    <p className="text-xs text-[#E6C99A] tracking-wide mb-2 font-mono tabular-nums">
                      {item.dateLabel}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF5EF] mb-1.5">
                      {item.chapterNumber}. {item.title}
                    </h3>
                    <p className="font-serif italic text-base sm:text-lg text-[#F2A7B8] mb-3">
                      {item.subtitle}
                    </p>
                    <p className="text-sm sm:text-base text-[#FFF5EF]/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center Spacer for Line on Desktop */}
                <div className="hidden lg:block lg:col-span-2 order-2" />

                {/* Right / Opposite Column Visual Thumbnail */}
                <div
                  className={`lg:col-span-5 ${
                    isEven
                      ? 'lg:col-start-8 lg:pl-6 order-2'
                      : 'lg:col-start-1 lg:row-start-1 lg:pr-6 order-2 lg:order-1'
                  }`}
                >
                  {item.imageSrc && (
                    <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-[#E6C99A]/20">
                      <RomanticPhoto
                        src={item.imageSrc}
                        alt={item.imageAlt || item.title}
                        momentLabel={item.title}
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
