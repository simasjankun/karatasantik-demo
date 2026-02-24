'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// ── Arrow icon ────────────────────────────────────────────────────────────────

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Card data type ────────────────────────────────────────────────────────────

interface CardData {
  image: string;
  href: string;
  label: string;
  title: string;
  marginClass: string;
  delay: string;
}

// ── CategoriesSection ─────────────────────────────────────────────────────────

export default function CategoriesSection() {
  const t = useTranslations('Categories');
  const sectionRef = useRef<HTMLElement>(null);

  // Per-card refs and visibility for mobile side-slide animations
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [cardVisible, setCardVisible] = useState([false, false, false]);

  // isMobile: true below 1024px. SSR default: true (mobile-first).
  // Flex layout is never applied on mobile — flex children ignore display:block
  // and height becomes unreliable. Mobile uses plain block stacking instead.
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Scroll-triggered visibility — same observer on both mobile and desktop.
  // Section must be 150px inside the viewport and 15% visible before triggering.
  // 3000ms fallback is last-resort only, not expected to fire on normal page load.
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
      { threshold: 0.15, rootMargin: '0px 0px -150px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  // Mobile: one observer per card — each slides in from left/right independently
  // as the user scrolls to it. Only active when isMobile === true.
  useEffect(() => {
    if (!isMobile) return;

    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCardVisible(prev => prev.map((v, j) => (j === i ? true : v)));
            observer.disconnect();
          }
        },
        { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [isMobile]);

  const cards: CardData[] = [
    {
      image: '/images/category-jewellery.png',
      href: '/juvelyrika',
      label: t('jewellery.label'),
      title: t('jewellery.title'),
      marginClass: '',
      delay: '0.1s',
    },
    {
      image: '/images/category-antiques.png',
      href: '/antikvariatas',
      label: t('antiques.label'),
      title: t('antiques.title'),
      marginClass: 'lg:mt-[40px]',
      delay: '0.2s',
    },
    {
      image: '/images/category-offers.png',
      href: '/akcijos-ir-nuolaidos',
      label: t('offers.label'),
      title: t('offers.title'),
      marginClass: 'lg:mt-[20px]',
      delay: '0.3s',
    },
  ];

  return (
    <section
      ref={sectionRef}
      aria-label={t('heading')}
      className="bg-[#0f0f0f] py-[60px] lg:py-[80px]"
    >
      <div className="container mx-auto px-8 xl:px-14">

        {/* ── Section title ───────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div
            aria-hidden="true"
            className="w-10 h-px bg-gold/55 mx-auto mb-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0s',
            }}
          />
          <p
            className="font-inter text-[10px] tracking-[0.42em] uppercase text-gold mb-5 select-none"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0s',
            }}
          >
            {t('label')}
          </p>
          <h2
            className="font-playfair font-normal text-white leading-[1.1]"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.625rem)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0s',
            }}
          >
            {t('heading')}
          </h2>
        </div>

        {/* ── Cards ───────────────────────────────────────────────────── */}
        {/* Mobile: plain block container — flex makes children ignore inline height.
            Desktop: flex row with staggered margin offsets. */}
        <div
          style={
            isMobile
              ? undefined
              : { display: 'flex', alignItems: 'flex-start', gap: '20px' }
          }
        >
          {cards.map((card, i) => (
            <article
              key={card.href}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={card.marginClass}
              style={
                isMobile
                  ? {
                      display: 'block',
                      height: '420px',
                      width: '100%',
                      marginBottom: i < cards.length - 1 ? '16px' : 0,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '2px',
                      opacity: cardVisible[i] ? 1 : 0,
                      transform: cardVisible[i]
                        ? 'translateX(0)'
                        : i === 1 ? 'translateX(40px)' : 'translateX(-40px)',
                      transition: 'opacity 0.6s ease, transform 0.6s ease',
                      transitionDelay: '0s',
                    }
                  : {
                      height: '580px',
                      flex: 1,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '2px',
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(24px)',
                      transition: 'opacity 0.6s ease, transform 0.6s ease',
                      transitionDelay: card.delay,
                    }
              }
            >
              <Link
                href={card.href}
                aria-label={`${card.label} — ${card.title}`}
                className="group absolute inset-0 flex flex-col justify-end"
              >
                {/* ── Image — zooms on card hover ─────────────────────── */}
                <div className="absolute inset-0 transition-transform duration-[600ms] ease-out group-hover:scale-105">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>

                {/* ── Base gradient — always visible ──────────────────── */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 transition-opacity duration-[600ms]"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 42%, transparent 68%)',
                  }}
                />

                {/* ── Hover darkening overlay ──────────────────────────── */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-[600ms]"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.52) 50%, rgba(0,0,0,0.08) 100%)',
                  }}
                />

                {/* ── Card content ─────────────────────────────────────── */}
                <div className="relative z-20 p-7">
                  <p className="font-inter text-[10px] tracking-[0.36em] uppercase text-gold/70 mb-2">
                    {card.label}
                  </p>
                  <h3 className="font-playfair font-normal text-white leading-snug mb-[18px] text-[24px] lg:text-[28px]">
                    {card.title}
                  </h3>
                  <span className="inline-flex items-center gap-[9px] font-inter text-[10.5px] tracking-[0.24em] uppercase text-gold/65">
                    {t('viewCollection')}
                    <ArrowIcon className="transition-transform duration-300 ease-out group-hover:translate-x-[6px]" />
                  </span>
                </div>

              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
