import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#100C18',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'A Little Universe, Just for You',
  description:
    'Sebuah ruang kecil berisi kata-kata, kenangan, dan perasaan yang ingin kusampaikan kepadamu.',
  openGraph: {
    title: 'A Little Universe, Just for You',
    description:
      'Sebuah ruang kecil berisi kata-kata, kenangan, dan perasaan yang ingin kusampaikan kepadamu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A Little Universe, Just for You',
    description:
      'Sebuah ruang kecil berisi kata-kata, kenangan, dan perasaan yang ingin kusampaikan kepadamu.',
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path fill=%22%23F2A7B8%22 d=%22M50 88C50 88 12 62 12 34C12 19 24 10 37 10C45 10 50 16 50 16C50 16 55 10 63 10C76 10 88 19 88 34C88 62 50 88 50 88Z%22/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${dmSans.variable} scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="font-sans bg-[#100C18] text-[#FFF5EF] antialiased"
      >
        {children}
      </body>
    </html>
  );
}
