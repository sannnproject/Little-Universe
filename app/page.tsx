import React from 'react';
import RomanticExperienceClient from '@/components/RomanticExperienceClient';

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const autostart = resolvedParams?.autostart === '1';

  return <RomanticExperienceClient initialAutostart={autostart} />;
}
