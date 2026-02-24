'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// ── AboutSection ──────────────────────────────────────────────────────────────

export default function AboutSection() {
  const t = useTranslations('About');
  const sectionRef = useRef<HTMLElement>(null);

  // isMobile drives image height — same pattern as CategoriesSection
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Scroll-triggered visibility
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
      { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  // Image: slides in from the left
  const imageAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : 'translateX(-40px)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
    transitionDelay: '0s',
  };

  // Text elements: slide in from the right, staggered by fixed delay
  const textAnim = (delay: string): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : 'translateX(40px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    transitionDelay: delay,
  });

  const imageHeight = isMobile ? 420 : 600;

  const stats = [
    { number: t('stat1.number'), label: t('stat1.label') },
    { number: t('stat2.number'), label: t('stat2.label') },
    { number: t('stat3.number'), label: t('stat3.label') },
  ];

  return (
    <section
      ref={sectionRef}
      aria-label={t('heading')}
      className="bg-[#0f0f0f] py-[80px] lg:py-[120px]"
    >
      <div className="container mx-auto px-6 lg:px-8 xl:px-14">

        {/* ── Two-column layout ───────────────────────────────────────── */}
        <div
          style={
            isMobile
              ? undefined
              : { display: 'flex', alignItems: 'center', gap: '80px' }
          }
        >

          {/* ── Image column ────────────────────────────────────────── */}
          <div style={isMobile ? undefined : { flex: 1 }}>
            <div
              style={{
                position: 'relative',
                height: `${imageHeight}px`,
                width: '100%',
                overflow: 'hidden',
                ...(isMobile
                  ? {}
                  : {
                      borderLeft: '2px solid rgba(198,165,92,0.2)',
                      borderBottom: '2px solid rgba(198,165,92,0.2)',
                    }),
                ...imageAnim,
              }}
            >
              <Image
                src="/images/about-store.png"
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              {/* Inner shadow overlay */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)',
                  zIndex: 1,
                }}
              />
            </div>
          </div>

          {/* ── Text column ─────────────────────────────────────────── */}
          <div
            style={
              isMobile
                ? { marginTop: '48px' }
                : { flex: 1 }
            }
          >

            {/* Gold decorative line */}
            <div
              aria-hidden="true"
              style={{
                width: '40px',
                height: '1px',
                backgroundColor: '#C6A55C',
                marginBottom: '20px',
                ...textAnim('0.1s'),
              }}
            />

            {/* Label */}
            <p
              className="font-inter text-[10px] tracking-[0.42em] uppercase text-gold mb-5"
              style={textAnim('0.1s')}
            >
              {t('label')}
            </p>

            {/* Heading */}
            <h2
              className="font-playfair font-normal text-white leading-[1.1] mb-6"
              style={{
                fontSize: isMobile ? '28px' : '38px',
                ...textAnim('0.2s'),
              }}
            >
              {t('heading')}
            </h2>

            {/* Paragraph 1 */}
            <p
              className="font-inter text-[15px] text-white/55 leading-relaxed mb-4"
              style={textAnim('0.3s')}
            >
              {t('p1')}
            </p>

            {/* Paragraph 2 */}
            <p
              className="font-inter text-[15px] text-white/55 leading-relaxed mb-10"
              style={textAnim('0.3s')}
            >
              {t('p2')}
            </p>

            {/* Stats */}
            <div
              className="flex gap-10 mb-10"
              style={textAnim('0.4s')}
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-playfair text-gold text-[32px] leading-none mb-1">
                    {stat.number}
                  </p>
                  <p className="font-inter text-[11px] tracking-[0.2em] uppercase text-white/35">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={textAnim('0.5s')}>
              <Link
                href="/apie-mus"
                className="inline-flex items-center justify-center border border-gold/65 text-gold font-inter text-[11px] tracking-[0.3em] uppercase px-7 py-3 min-w-[160px] hover:bg-gold/[0.08] active:bg-gold/[0.13] transition-colors duration-300"
              >
                {t('cta')}
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
