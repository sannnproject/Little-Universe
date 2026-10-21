'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, SlidersHorizontal } from 'lucide-react';
import { loveConfig } from '@/data/love-config';

interface MusicPlayerProps {
  externalTriggerPlay?: boolean;
}

// Romantic Nocturne chord notes in Hz (Db Major -> Bbm7 -> GbMaj7 -> Ab7)
const ROMANTIC_CHORDS: number[][] = [
  [277.18, 349.23, 415.3, 554.37], // Db4, F4, Ab4, Db5
  [233.08, 277.18, 349.23, 466.16], // Bb3, Db4, F4, Bb4
  [185.0, 277.18, 349.23, 415.3], // Gb3, Db4, F4, Ab4
  [207.65, 261.63, 311.13, 415.3], // Ab3, C4, Eb4, Ab4
];

export default function MusicPlayer({ externalTriggerPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [showDetails, setShowDetails] = useState(false);
  const [usingSynthFallback, setUsingSynthFallback] = useState(!loveConfig.musicUrl);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const schedulerTimerRef = useRef<number | null>(null);
  const stepIndexRef = useRef<number>(0);

  // Stop Web Audio synth loop cleanly
  const stopSynthLoop = useCallback(() => {
    if (schedulerTimerRef.current !== null) {
      window.clearInterval(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
  }, []);

  // Play a gentle romantic piano + warm pad note using Web Audio API
  const triggerRomanticNote = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        const ctx = new AudioContextClass();
        const master = ctx.createGain();
        master.gain.value = isMuted ? 0 : volume * 0.28;
        master.connect(ctx.destination);
        audioCtxRef.current = ctx;
        masterGainRef.current = master;
      }

      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (!ctx || !master) return;

      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const step = stepIndexRef.current;
      const chordIdx = Math.floor(step / 4) % ROMANTIC_CHORDS.length;
      const noteIdx = step % 4;
      const freq = ROMANTIC_CHORDS[chordIdx][noteIdx];

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now);

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.32, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.06, now);

      osc.connect(noteGain);
      overtone.connect(overtoneGain);
      overtoneGain.connect(noteGain);
      noteGain.connect(master);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 1.95);
      overtone.stop(now + 1.95);

      stepIndexRef.current = step + 1;
    } catch {
      // Safe fallback if browser blocks or lacks Web Audio API
    }
  }, [isMuted, volume]);

  const startPlayback = useCallback(() => {
    if (loveConfig.musicUrl && !usingSynthFallback && audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : volume;
      audioElementRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Fallback to Web Audio romantic nocturne if custom audio URL fails
          setUsingSynthFallback(true);
          stopSynthLoop();
          triggerRomanticNote();
          schedulerTimerRef.current = window.setInterval(triggerRomanticNote, 720);
          setIsPlaying(true);
        });
    } else {
      stopSynthLoop();
      triggerRomanticNote();
      schedulerTimerRef.current = window.setInterval(triggerRomanticNote, 720);
      setIsPlaying(true);
    }
  }, [isMuted, stopSynthLoop, triggerRomanticNote, usingSynthFallback, volume]);

  const pausePlayback = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    stopSynthLoop();
    setIsPlaying(false);
  }, [stopSynthLoop]);

  const togglePlay = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  // Start playback when user clicks "Buka pesan kecil ini" on Opening Screen
  useEffect(() => {
    if (externalTriggerPlay && !isPlaying) {
      startPlayback();
    }
  }, [externalTriggerPlay, isPlaying, startPlayback]);

  // Sync volume & mute state
  useEffect(() => {
    const effectiveGain = isMuted ? 0 : volume;
    if (audioElementRef.current) {
      audioElementRef.current.volume = effectiveGain;
      audioElementRef.current.muted = isMuted;
    }
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        effectiveGain * 0.28,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      stopSynthLoop();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopSynthLoop]);

  return (
    <aside
      aria-label="Pemutar Musik Latar"
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2"
    >
      {loveConfig.musicUrl && (
        <audio
          ref={audioElementRef}
          src={loveConfig.musicUrl}
          loop
          preload="none"
          onError={() => setUsingSynthFallback(true)}
        />
      )}

      {/* Expandable Volume & Song Details Panel */}
      {showDetails && (
        <div className="w-64 rounded-2xl bg-[#160E20]/95 border border-[#E6C99A]/30 p-4 shadow-2xl text-[#FFF5EF]">
          <div className="flex items-start gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#722F47]/60 border border-[#F2A7B8]/30 flex items-center justify-center shrink-0">
              <Music className="w-4 h-4 text-[#F2A7B8]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#FFF5EF] truncate">
                {loveConfig.musicTitle}
              </p>
              <p className="text-[11px] text-[#E6C99A]/75 truncate">
                {loveConfig.musicArtist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              aria-label={isMuted ? 'Nyalakan suara musik' : 'Bisukan musik'}
              className="p-1.5 rounded-lg bg-[#251529] text-[#FFF5EF]/80 hover:text-[#FFF5EF] cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#F2A7B8]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#E6C99A]" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVolume(val);
                if (val > 0 && isMuted) setIsMuted(false);
              }}
              aria-label="Volume Musik"
              className="w-full accent-[#F2A7B8] h-1.5 bg-[#251529] rounded-lg cursor-pointer"
            />
            <span className="text-[11px] font-mono tabular-nums text-[#FFF5EF]/75 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Compact Floating Control Bar */}
      <div className="flex items-center gap-2 rounded-full bg-[#160E20]/95 border border-[#E6C99A]/35 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Jeda musik latar' : 'Putar musik latar'}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#722F47] hover:bg-[#893855] text-[#FFF5EF] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-[#E6C99A]" />
              <span>Jeda Musik</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[#E6C99A]" />
              <span>Putar Musik</span>
            </>
          )}
        </button>

        {/* Simple Audio Equalizer Bars */}
        <div
          aria-hidden="true"
          className="hidden sm:flex items-end gap-0.5 h-3.5 px-1"
        >
          <span
            className={`w-0.5 bg-[#F2A7B8] rounded-full transition-all duration-300 ${
              isPlaying && !isMuted ? 'h-3.5' : 'h-1'
            }`}
          />
          <span
            className={`w-0.5 bg-[#E6C99A] rounded-full transition-all duration-300 ${
              isPlaying && !isMuted ? 'h-2.5' : 'h-1.5'
            }`}
          />
          <span
            className={`w-0.5 bg-[#F2A7B8] rounded-full transition-all duration-300 ${
              isPlaying && !isMuted ? 'h-3' : 'h-1'
            }`}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          aria-label={isMuted ? 'Suarakan musik' : 'Bisukan musik'}
          className="p-1.5 rounded-full text-[#FFF5EF]/80 hover:text-[#E6C99A] transition-colors cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-[#F2A7B8]" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          aria-label="Pengaturan volume dan info lagu"
          aria-expanded={showDetails}
          className="p-1.5 rounded-full text-[#FFF5EF]/80 hover:text-[#E6C99A] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
