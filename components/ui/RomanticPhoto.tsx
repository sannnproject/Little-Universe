'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface RomanticPhotoProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  captionOverlay?: string;
  momentLabel?: string;
}

/**
 * Resilient romantic photo frame with referrerPolicy="no-referrer",
 * graceful error fallback to curated SVG artwork, and styled placeholder state.
 */
export default function RomanticPhoto({
  src,
  fallbackSrc = '/images/couple-sunset.svg',
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  captionOverlay,
  momentLabel,
}: RomanticPhotoProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasFailedAll(true);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#181021] border border-[#E6C99A]/15 ${className}`}
    >
      {!hasFailedAll ? (
        <img
          src={imgSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          onError={handleError}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${imgClassName}`}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#251529] via-[#722F47]/40 to-[#100C18]"
        >
          <Heart className="w-8 h-8 text-[#F2A7B8]/70 mb-3" />
          <p className="font-serif italic text-lg text-[#FFF5EF]/90">
            {momentLabel || alt}
          </p>
          {captionOverlay && (
            <p className="text-xs text-[#E6C99A]/75 mt-1 max-w-xs">{captionOverlay}</p>
          )}
        </div>
      )}
    </div>
  );
}
