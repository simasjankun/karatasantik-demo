'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────

interface LocalizedString {
  lt: string;
  en: string;
}

interface Product {
  id: number;
  image: string;
  category: LocalizedString;
  name: LocalizedString;
  price: string;
}

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

// ── Product data ──────────────────────────────────────────────────────────────

const products: Product[] = [
  {
    id: 1,
    image: '/images/product-1.png',
    category: { lt: 'Juvelyrika', en: 'Jewellery' },
    name: { lt: 'Auksinis pakabukas su tamsiai mėlynu safyru', en: 'Gold pendant with deep blue sapphire' },
    price: '290,00 €',
  },
  {
    id: 2,
    image: '/images/product-2.png',
    category: { lt: 'Antikvariatas', en: 'Antiques' },
    name: { lt: 'Sidabrinis vintažinis žiedas su citrinu ir markazitais', en: 'Silver vintage ring with citrine and marcasites' },
    price: '230,00 €',
  },
  {
    id: 3,
    image: '/images/product-3.png',
    category: { lt: 'Juvelyrika', en: 'Jewellery' },
    name: { lt: 'Sidabrinė apyrankė su safyrais', en: 'Silver bracelet with sapphires' },
    price: '350,00 €',
  },
  {
    id: 4,
    image: '/images/product-4.png',
    category: { lt: 'Antikvariatas', en: 'Antiques' },
    name: { lt: 'Sidabrinis laikrodis su berilais smaragdais', en: 'Silver watch with beryl emeralds' },
    price: '550,00 €',
  },
];

const CARD_DELAYS = ['0.1s', '0.2s', '0.3s', '0.4s'];

// ── FeaturedProducts ──────────────────────────────────────────────────────────

export default function FeaturedProducts() {
  const t = useTranslations('Featured');
  const locale = useLocale();
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
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  // Resolves the correct locale field from a LocalizedString
  const loc = (field: LocalizedString) => locale === 'lt' ? field.lt : field.en;

  // Section header elements — fade + slide up, no delay
  const headerAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    transitionDelay: '0s',
  };

  // Cards — fade + slide up with fixed stagger delay
  const cardAnim = (delay: string): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    transitionDelay: delay,
  });

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
            className="font-playfair font-normal text-white leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', ...headerAnim }}
          >
            {t('heading')}
          </h2>
          <Link
            href="/juvelyrika"
            className="inline-flex items-center gap-2 font-inter text-[11px] tracking-[0.3em] uppercase text-gold/65 hover:text-gold transition-colors duration-300"
            style={headerAnim}
          >
            {t('viewAll')}
            <ArrowIcon className="transition-transform duration-300 ease-out group-hover:translate-x-[4px]" />
          </Link>
        </div>

        {/* ── Product grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, i) => (
            <article
              key={product.id}
              className="group"
              style={cardAnim(CARD_DELAYS[i])}
            >
              <Link href="/juvelyrika" className="block">

                {/* ── Product image — square ratio, zooms on hover ─────── */}
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <Image
                    src={product.image}
                    alt={loc(product.name)}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.06]"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                </div>

                {/* ── Card info ─────────────────────────────────────────── */}
                <div className="pt-4">
                  <p className="font-inter text-[9.5px] tracking-[0.3em] uppercase text-gold/70 mb-2">
                    {loc(product.category)}
                  </p>
                  <p className="font-inter text-[15px] text-white leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-gold">
                    {loc(product.name)}
                  </p>
                  <p className="font-playfair text-gold text-[18px] mt-2">
                    {product.price}
                  </p>
                </div>

              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
