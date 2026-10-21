export interface RelationshipDurationResult {
  isPlaceholder: boolean;
  totalDays: number;
  years: number;
  months: number;
  days: number;
  formattedLabel: string;
}

/**
 * Calculates relationship duration from an ISO date string (YYYY-MM-DD).
 * Never fabricates a date: if empty or invalid, returns a clear placeholder state.
 */
export function calculateRelationshipDuration(
  anniversaryDate: string,
  referenceDateIso = '2026-10-20'
): RelationshipDurationResult {
  const trimmed = (anniversaryDate || '').trim();
  if (!trimmed) {
    return {
      isPlaceholder: true,
      totalDays: 0,
      years: 0,
      months: 0,
      days: 0,
      formattedLabel: 'Tanggal Spesial Kita · Dapat disesuaikan di love-config.ts',
    };
  }

  const start = new Date(`${trimmed}T00:00:00Z`);
  const end = new Date(`${referenceDateIso}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return {
      isPlaceholder: true,
      totalDays: 0,
      years: 0,
      months: 0,
      days: 0,
      formattedLabel: trimmed,
    };
  }

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} tahun`);
  if (months > 0) parts.push(`${months} bulan`);
  if (days > 0 || parts.length === 0) parts.push(`${days} hari`);

  return {
    isPlaceholder: false,
    totalDays,
    years,
    months,
    days,
    formattedLabel: `${parts.join(', ')} (${totalDays} hari bersama)`,
  };
}

/**
 * Pure circular navigation for the Photo Gallery Lightbox.
 */
export function getNextGalleryIndex(
  currentIndex: number,
  totalItems: number,
  direction: 'next' | 'prev'
): number {
  if (totalItems <= 0) return 0;
  const normalized = ((currentIndex % totalItems) + totalItems) % totalItems;
  if (direction === 'next') {
    return (normalized + 1) % totalItems;
  }
  return (normalized - 1 + totalItems) % totalItems;
}

/**
 * Pure immutable toggle for Interactive Love Notes flip cards.
 */
export function toggleNoteCardState(flippedIds: string[], cardId: string): string[] {
  if (!cardId) return flippedIds;
  if (flippedIds.includes(cardId)) {
    return flippedIds.filter((id) => id !== cardId);
  }
  return [...flippedIds, cardId];
}

/**
 * Frame-rate independent exponential damping helper used for 3D camera & exploded view transitions.
 */
export function dampValue(
  current: number,
  target: number,
  lambda: number,
  dt: number
): number {
  if (dt <= 0 || lambda <= 0) return current;
  const factor = 1 - Math.exp(-lambda * dt);
  return current + (target - current) * factor;
}

export type LetterFontScale = 'normal' | 'large' | 'xlarge';

export interface LetterTypographySpec {
  scale: LetterFontScale;
  label: string;
  bodyClass: string;
  leadClass: string;
}

/**
 * Maps the Love Letter reader size control to accessible typography classes.
 */
export function getLetterTypographySpec(scale: LetterFontScale): LetterTypographySpec {
  switch (scale) {
    case 'large':
      return {
        scale: 'large',
        label: 'Besar',
        bodyClass: 'text-lg md:text-xl leading-relaxed',
        leadClass: 'text-2xl md:text-3xl',
      };
    case 'xlarge':
      return {
        scale: 'xlarge',
        label: 'Sangat Besar',
        bodyClass: 'text-xl md:text-2xl leading-relaxed',
        leadClass: 'text-3xl md:text-4xl',
      };
    case 'normal':
    default:
      return {
        scale: 'normal',
        label: 'Normal',
        bodyClass: 'text-base md:text-lg leading-relaxed',
        leadClass: 'text-xl md:text-2xl',
      };
  }
}
