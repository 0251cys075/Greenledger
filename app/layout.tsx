import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'GreenLedger — Environmental Claim Verification',
  description:
    'Verify environmental product claims with evidence, not marketing. GreenLedger transforms green claims into traceable, evidence-backed verification results.',
  keywords: 'greenwashing, environmental claims, sustainability verification, eco-friendly, ESG, climate-tech',
  openGraph: {
    title: 'GreenLedger — Environmental Claim Verification',
    description: 'Verify environmental claims with evidence, not marketing.',
    type: 'website',
  },
};

import { LanguageProvider } from '@/lib/i18n-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          backgroundColor: '#F3F0E8',
          color: '#102019',
          fontFamily: 'Inter, Manrope, system-ui, sans-serif',
        }}
        className="antialiased min-h-screen flex flex-col selection:bg-[#63D6A2] selection:text-[#0B241A]"
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
