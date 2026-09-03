'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000 ease-out"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        aria-hidden="true"
      />

      {/* Dark forest green overlay */}
      <div className="absolute inset-0 hero-overlay" aria-hidden="true" />

      {/* Subtle texture grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-16 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2.5 bg-[#12382A]/80 backdrop-blur-md border border-[#63D6A2]/30 rounded-full px-4 py-1.5 mb-8 animate-fade-in shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#63D6A2] animate-pulse" aria-hidden="true" />
          <span className="text-[#F3F0E8] text-xs font-mono font-medium tracking-wide uppercase">
            Environmental Claim Verification
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-[#F3F0E8] mb-6 animate-fade-in-up"
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
          }}
        >
          Can You Trust What a Product
          <br />
          <em className="not-italic text-[#63D6A2]">Says About the Planet?</em>
        </h1>

        {/* Subheading */}
        <p
          className="text-[#F3F0E8]/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200"
          style={{ fontWeight: 300 }}
        >
          Verify environmental claims with evidence — not marketing.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <Link
            href="/verify"
            className="group flex items-center gap-2 bg-[#63D6A2] text-[#0B241A] px-8 py-3.5 rounded-lg font-semibold text-[15px] hover:bg-[#7eedb8] transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Verify a Claim
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 bg-[#0B241A]/60 backdrop-blur-sm border border-white/20 text-[#F3F0E8] px-8 py-3.5 rounded-lg font-medium text-[15px] hover:bg-[#12382A] hover:border-[#63D6A2]/50 transition-all"
          >
            Explore Verified Products
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center justify-center gap-2 text-white/50 text-xs font-mono">
          <ChevronDown className="animate-bounce text-[#63D6A2]" size={20} />
        </div>
      </div>
    </section>
  );
}
