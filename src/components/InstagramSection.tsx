'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

// ── Instagram icon ────────────────────────────────────────────────────────────

function InstagramIcon({ opacity }: { opacity: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C6A55C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity, transition: 'opacity 0.3s ease' }}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// ── Placeholder cell ──────────────────────────────────────────────────────────

function PlaceholderCell() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: '1 / 1',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: hovered ? '#222222' : '#1a1a1a',
        border: `1px solid ${hovered ? 'rgba(198,165,92,0.4)' : 'rgba(198,165,92,0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
      }}
    >
      <InstagramIcon opacity={hovered ? 0.6 : 0.3} />
    </div>
  );
}

// ── InstagramSection ──────────────────────────────────────────────────────────

export default function InstagramSection() {
  const t = useTranslations('Instagram');
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const fallback = setTimeout(() => setVisible(true), 3000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          clearTimeout(fallback);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const headerAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    transitionDelay: '0s',
  };

  const gridAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.8s ease',
    transitionDelay: '0.1s',
  };

  return (
    <section
      ref={sectionRef}
      aria-label={t('heading')}
      className="bg-[#0f0f0f] py-[80px] lg:py-[120px]"
    >
      <div className="container mx-auto px-6 lg:px-8 xl:px-14">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div
            aria-hidden="true"
            style={{
              width: '40px',
              height: '1px',
              backgroundColor: '#C6A55C',
              margin: '0 auto 20px',
              ...headerAnim,
            }}
          />
          <p
            className="font-inter text-[10px] tracking-[0.42em] uppercase text-gold mb-5 select-none"
            style={headerAnim}
          >
            {t('label')}
          </p>
          <h2
            className="font-playfair font-normal text-white leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', ...headerAnim }}
          >
            {t('heading')}
          </h2>
          <p
            className="font-inter text-[13px] text-gold/50 tracking-[0.15em]"
            style={headerAnim}
          >
            {t('subtext')}
          </p>
        </div>

        {/* ── Placeholder grid ─────────────────────────────────────────── */}
        <div
          className="grid grid-cols-3 gap-1 lg:gap-2"
          style={gridAnim}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaceholderCell key={i} />
          ))}
        </div>

        {/* ── CTA button ───────────────────────────────────────────────── */}
        <div className="text-center mt-12" style={gridAnim}>
          <a
            href="https://instagram.com/karatasantik"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-gold/65 text-gold font-inter text-[11px] tracking-[0.3em] uppercase px-7 py-3 min-w-[200px] hover:bg-gold/[0.08] active:bg-gold/[0.13] transition-colors duration-300"
          >
            {t('cta')}
          </a>
        </div>

      </div>
    </section>
  );
}
