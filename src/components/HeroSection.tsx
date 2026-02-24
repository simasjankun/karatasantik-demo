'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// ── Scroll chevron ─────────────────────────────────────────────────────────────

function ScrollChevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ── HeroSection ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [showScroll, setShowScroll] = useState(true);
  const t = useTranslations('Hero');

  // Trigger entrance animations after hydration — prevents SSR flash
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fade out scroll indicator after 100px of scroll
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY < 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Returns inline style for staggered heroFadeUp animation
  const fadeUp = (delay: string): React.CSSProperties => ({
    animation: mounted ? `heroFadeUp 0.8s ease both` : 'none',
    opacity: mounted ? undefined : 0,
    animationDelay: mounted ? delay : undefined,
  });

  return (
    <section
      aria-label={t('label')}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* ── Background image ───────────────────────────────────────────── */}
      <Image
        src="/images/hero-ring.png"
        alt=""
        fill
        priority
        className="object-cover object-center lg:object-right"
        sizes="100vw"
      />

      {/* ── Gradient overlay — mobile: bottom-to-top ───────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,0.93) 0%, rgba(10,10,10,0.6) 48%, rgba(10,10,10,0.15) 80%, transparent 100%)',
        }}
      />

      {/* ── Gradient overlay — desktop: left-to-right ─────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.65) 38%, rgba(10,10,10,0.2) 60%, transparent 72%)',
        }}
      />

      {/* ── Text content ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-center">
        <div className="container mx-auto px-6 lg:px-8 xl:px-14">
          <div className="max-w-[540px] mt-[8vh] lg:mt-0">

          {/* Label */}
          <p
            className="font-inter text-[11px] tracking-[0.42em] uppercase text-gold mb-5"
            style={fadeUp('0.2s')}
          >
            {t('label')}
          </p>

          {/* Heading */}
          <h1
            className="font-playfair font-normal text-white leading-[1.1] mb-6"
            style={{
              ...fadeUp('0.4s'),
              fontSize: 'clamp(1.9rem, 5vw, 3.85rem)',
            }}
          >
            {t('heading')}
          </h1>

          {/* Subtext */}
          <p
            className="font-inter text-[15px] text-white/62 leading-relaxed mb-10 max-w-[400px]"
            style={fadeUp('0.6s')}
          >
            {t('subtext')}
          </p>

          {/* Buttons */}
          <div
            className="flex flex-row flex-wrap gap-3 justify-center lg:justify-start"
            style={fadeUp('0.8s')}
          >
            <Link
              href="/juvelyrika"
              className="inline-flex items-center justify-center bg-gold text-[#111111] font-inter text-[11px] tracking-[0.3em] uppercase px-7 py-3 min-w-[160px] font-medium hover:bg-gold/90 active:bg-gold/80 transition-colors duration-300"
            >
              {t('primary')}
            </Link>
            <Link
              href="/apie-mus"
              className="inline-flex items-center justify-center border border-gold/65 text-gold font-inter text-[11px] tracking-[0.3em] uppercase px-7 py-3 min-w-[160px] hover:bg-gold/[0.08] active:bg-gold/[0.13] transition-colors duration-300"
            >
              {t('secondary')}
            </Link>
          </div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[7px] pointer-events-none transition-opacity duration-500"
        style={{ opacity: showScroll ? 1 : 0 }}
      >
        <span className="font-inter text-[9px] tracking-[0.38em] uppercase text-gold/38">
          {t('scroll')}
        </span>
        <span className="text-gold/45">
          <ScrollChevron />
        </span>
      </div>
    </section>
  );
}
