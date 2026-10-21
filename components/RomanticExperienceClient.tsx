'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AmbientBackground from '@/components/effects/AmbientBackground';
import OpeningScreen from '@/components/intro/OpeningScreen';
import TopBar from '@/components/navigation/TopBar';
import HeroSection from '@/components/sections/HeroSection';
import LoveLetter from '@/components/sections/LoveLetter';
import RomanticUniverseScene from '@/components/three/RomanticUniverseScene';
import PhotoGallery from '@/components/sections/PhotoGallery';
import LoveTimeline from '@/components/sections/LoveTimeline';
import LoveNotes from '@/components/sections/LoveNotes';
import SpecialMoment from '@/components/sections/SpecialMoment';
import FinalMessage from '@/components/sections/FinalMessage';
import MusicPlayer from '@/components/music/MusicPlayer';

interface RomanticExperienceClientProps {
  initialAutostart?: boolean;
}

export default function RomanticExperienceClient({
  initialAutostart = false,
}: RomanticExperienceClientProps) {
  const [hasOpened, setHasOpened] = useState(initialAutostart);
  const [musicRequestedByOpen, setMusicRequestedByOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setHasOpened(true);
      }
    }
  }, []);

  const handleOpenComplete = () => {
    setHasOpened(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartToIntro = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setHasOpened(false);
  };

  return (
    <div
      data-state={hasOpened ? 'main-experience' : 'opening-envelope'}
      className="relative min-h-[100svh] w-full bg-[#100C18] text-[#FFF5EF] overflow-x-hidden selection:bg-[#722F47] selection:text-[#FFF5EF]"
    >
      <AmbientBackground />

      <AnimatePresence mode="wait">
        {!hasOpened ? (
          <OpeningScreen
            key="opening-screen"
            onOpenComplete={handleOpenComplete}
            onStartMusicOptional={() => setMusicRequestedByOpen(true)}
          />
        ) : (
          <motion.div
            key="main-experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10"
          >
            <TopBar />
            <main>
              <HeroSection />
              <LoveLetter />
              <RomanticUniverseScene />
              <PhotoGallery />
              <LoveTimeline />
              <LoveNotes />
              <SpecialMoment />
              <FinalMessage onRestartToIntro={handleRestartToIntro} />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consistent Floating Soundtrack Controller */}
      <MusicPlayer externalTriggerPlay={musicRequestedByOpen} />
    </div>
  );
}
