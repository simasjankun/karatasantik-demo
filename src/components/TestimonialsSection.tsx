'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

// ── Types ─────────────────────────────────────────────────────────────────────

interface LocalizedString {
  lt: string;
  en: string;
}

interface Testimonial {
  id: number;
  text: LocalizedString;
  author: string;
}

// ── Testimonials data ─────────────────────────────────────────────────────────

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: {
      lt: 'Tobula apsipirkimo patirtis, o apie papuošalų grožį net neverta kalbėti — gyvai jie visi tiesiog užburiantys! Puiki parduotuvė, tobuloje vietoje, su nepaprastai maloniu aptarnavimu. Labai, labai rekomenduoju!',
      en: 'A perfect shopping experience, and the beauty of the jewellery speaks for itself — in person they are simply enchanting! A wonderful store, in a perfect location, with exceptionally pleasant service. Highly, highly recommended!',
    },
    author: 'Andrius Plindinas',
  },
  {
    id: 2,
    text: {
      lt: 'Malonus ir greitas siuntimas. Papuošalai supakuoti labai tvarkingai ir elegantiškai — tikras malonumas gauti tokį paketą.',
      en: 'Pleasant and fast delivery. The jewellery was packed very neatly and elegantly — a real pleasure to receive such a package.',
    },
    author: 'Vilma Šešelgienė',
  },
  {
    id: 3,
    text: {
      lt: 'Malonus bendravimas! Pasakiško grožio papuošalai. Rekomenduoju 100%.',
      en: 'Pleasant communication! Jewellery of fairy-tale beauty. 100% recommended.',
    },
    author: 'Tomaševskaja Veronika',
  },
  {
    id: 4,
    text: {
      lt: 'Labai operatyviai ir greitai. Žiedas tiesiog tobulas, visiškai atitiko aprašymą. Ačiū už puikų aptarnavimą!',
      en: 'Very prompt and fast. The ring is simply perfect, exactly as described. Thank you for the excellent service!',
    },
    author: 'Erika Deimante',
  },
  {
    id: 5,
    text: {
      lt: 'Pirkau dovanai — gavėja buvo tiesiog sužavėta. Pakuotė prabanga, papuošalas nuostabus. Tikrai grįšiu dar kartą!',
      en: 'Bought as a gift — the recipient was simply enchanted. Luxurious packaging, stunning jewellery. I will definitely return!',
    },
    author: 'Rūta Kazlauskienė',
  },
  {
    id: 6,
    text: {
      lt: 'Antikvariatas tikrai išskirtinis — radau dirbinį, kurio ieškojau daugelį metų. Labai kompetentingi ir pagalbūs žmonės.',
      en: 'A truly exceptional antique collection — I found a piece I had been searching for for many years. Very knowledgeable and helpful staff.',
    },
    author: 'Tomas Grigaitis',
  },
];

const GAP = 24;

// ── Icons ─────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C6A55C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C6A55C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ── TestimonialsSection ───────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const t = useTranslations('Testimonials');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsPerView = isMobile ? 1 : 3;
  const maxIndex = testimonials.length - cardsPerView;
  // Card width derived from container: subtract total gap between visible cards
  const cardWidth = containerWidth > 0
    ? (containerWidth - GAP * (cardsPerView - 1)) / cardsPerView
    : 0;
  const trackOffset = currentIndex * (cardWidth + GAP);

  // Scroll-triggered visibility
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
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, []);

  // isMobile detection
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // containerWidth via ResizeObserver — fires after layout, always accurate
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Clamp currentIndex when cardsPerView changes (e.g. on resize)
  useEffect(() => {
    setCurrentIndex(prev => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goPrev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex(i => Math.min(maxIndex, i + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
  };

  const loc = (field: LocalizedString) => locale === 'lt' ? field.lt : field.en;

  // Animation styles
  const headerAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    transitionDelay: '0s',
  };

  const carouselAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.8s ease',
    transitionDelay: '0.1s',
  };

  const dotCount = maxIndex + 1;

  return (
    <section
      ref={sectionRef}
      aria-label={t('heading')}
      style={{ backgroundColor: '#111111' }}
      className="py-[80px] lg:py-[120px]"
    >
      <div className="container mx-auto px-6 lg:px-8 xl:px-14">

        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="text-center" style={{ marginBottom: '64px' }}>
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
            className="font-playfair font-normal text-white leading-[1.1]"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', ...headerAnim }}
          >
            {t('heading')}
          </h2>
        </div>

        {/* ── Carousel ─────────────────────────────────────────────────── */}
        <div style={carouselAnim}>

          {/* ── Arrow row — desktop only, right-aligned, above carousel ─── */}
          <div className="hidden lg:flex" style={{ justifyContent: 'flex-end', gap: '12px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonials"
              className="hover:bg-gold/[0.08] transition-colors duration-300"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid rgba(198,165,92,0.4)',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex === 0 ? 'default' : 'pointer',
                opacity: currentIndex === 0 ? 0.3 : 1,
                pointerEvents: currentIndex === 0 ? 'none' : 'auto',
                transition: 'opacity 0.3s ease',
              }}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonials"
              className="hover:bg-gold/[0.08] transition-colors duration-300"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid rgba(198,165,92,0.4)',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex >= maxIndex ? 'default' : 'pointer',
                opacity: currentIndex >= maxIndex ? 0.3 : 1,
                pointerEvents: currentIndex >= maxIndex ? 'none' : 'auto',
                transition: 'opacity 0.3s ease',
              }}
            >
              <ChevronRight />
            </button>
          </div>

          {/* Overflow container — ResizeObserver target, full section width */}
          <div ref={containerRef} style={{ overflow: 'hidden' }}>
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
                style={{
                  display: 'flex',
                  gap: `${GAP}px`,
                  transform: `translateX(-${trackOffset}px)`,
                  transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              >
                {testimonials.map((item) => (
                  <blockquote
                    key={item.id}
                    style={{
                      flexShrink: 0,
                      width: cardWidth > 0 ? `${cardWidth}px` : undefined,
                      border: '1px solid rgba(198, 165, 92, 0.15)',
                      padding: isMobile ? '32px' : '48px',
                      backgroundColor: 'transparent',
                    }}
                  >
                    {/* Stars */}
                    <p
                      aria-label="5 out of 5 stars"
                      style={{
                        color: '#C6A55C',
                        fontSize: '14px',
                        letterSpacing: '4px',
                        opacity: 0.8,
                        marginBottom: '20px',
                      }}
                    >
                      ★★★★★
                    </p>

                    {/* Decorative opening quote */}
                    <span
                      aria-hidden="true"
                      className="font-playfair"
                      style={{
                        display: 'block',
                        fontSize: '80px',
                        lineHeight: 0.8,
                        color: 'rgba(198, 165, 92, 0.12)',
                        marginBottom: '8px',
                      }}
                    >
                      &ldquo;
                    </span>

                    {/* Testimonial text */}
                    <p
                      className="font-inter"
                      style={{
                        fontSize: '16px',
                        lineHeight: 1.8,
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontStyle: 'italic',
                      }}
                    >
                      {loc(item.text)}
                    </p>

                    {/* Thin gold divider */}
                    <div
                      aria-hidden="true"
                      style={{
                        width: '32px',
                        height: '1px',
                        backgroundColor: 'rgba(198, 165, 92, 0.5)',
                        margin: '28px 0',
                      }}
                    />

                    {/* Author */}
                    <footer>
                      <cite
                        className="font-inter not-italic"
                        style={{
                          color: '#C6A55C',
                          fontSize: '12px',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.author}
                      </cite>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>

          {/* ── Dot indicators ─────────────────────────────────────────── */}
          <div
            role="tablist"
            aria-label="Carousel position"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px',
            }}
          >
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setCurrentIndex(i)}
                style={{
                  height: '6px',
                  width: i === currentIndex ? '20px' : '6px',
                  borderRadius: '3px',
                  backgroundColor: i === currentIndex
                    ? '#C6A55C'
                    : 'rgba(198, 165, 92, 0.3)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* ── Leave a review ─────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button
              type="button"
              onClick={() => {}}
              className="inline-flex items-center justify-center border border-gold/65 text-gold font-inter text-[11px] tracking-[0.3em] uppercase px-7 py-3 min-w-[180px] hover:bg-gold/[0.08] active:bg-gold/[0.13] transition-colors duration-300 bg-transparent"
            >
              {t('leaveReview')}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
