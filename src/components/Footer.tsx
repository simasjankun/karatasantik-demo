'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { contact } from '@/data/contact';
import { navigation } from '@/data/navigation';

// ── Icons ─────────────────────────────────────────────────────────────────────

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C6A55C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '3px' }}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C6A55C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C6A55C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '3px' }}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
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
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const jewelleryLinks = navigation[0].children ?? [];

  const quickLinks = [
    { labelKey: 'antikvariatas', href: '/antikvariatas' },
    { labelKey: 'akcijos', href: '/akcijos-ir-nuolaidos' },
    { labelKey: 'dovanuKuponai', href: '/dovanu-kuponai' },
    { labelKey: 'apieMus', href: '/apie-mus' },
    { labelKey: 'kontaktai', href: '/kontaktai' },
  ];

  const footerAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    transitionDelay: '0s',
  };

  const linkClass = 'font-inter text-[14px] text-white/45 hover:text-gold transition-colors duration-200';

  return (
    <footer
      ref={footerRef}
      aria-label="Footer"
      className="bg-[#0f0f0f]"
      style={footerAnim}
    >
      <div className="container mx-auto px-6 lg:px-8 xl:px-14 pt-[60px] lg:pt-[80px]">

        {/* ── 4-column grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 lg:pb-16">

          {/* ── Col 1: Brand ─────────────────────────────────────────── */}
          <div>
            <p
              className="font-playfair text-gold uppercase mb-2"
              style={{ fontSize: '18px', letterSpacing: '0.2em' }}
            >
              KARATAS ANTIK
            </p>
            <p className="font-inter text-white/30 text-[12px] tracking-[0.2em] uppercase mb-4">
              {t('tagline')}
            </p>
            <p className="font-inter text-white/45 text-[14px] leading-relaxed mb-6">
              {t('description')}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href={contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gold/40 hover:text-gold transition-colors duration-300"
              >
                <FacebookIcon />
              </a>
              <a
                href={contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gold/40 hover:text-gold transition-colors duration-300"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* ── Col 2: Juvelyrika ────────────────────────────────────── */}
          <nav aria-label={t('colJewellery')}>
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-5">
              {t('colJewellery')}
            </p>
            <ul className="space-y-3">
              {jewelleryLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Col 3: Nuorodos ──────────────────────────────────────── */}
          <nav aria-label={t('colLinks')}>
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-5">
              {t('colLinks')}
            </p>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Col 4: Kontaktai ─────────────────────────────────────── */}
          <div>
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-5">
              {t('colContact')}
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <MapPinIcon />
                <span className="font-inter text-[14px] text-white/45 leading-relaxed">
                  {contact.address}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneIcon />
                <span className="font-inter text-[14px] text-white/45">
                  {contact.phone}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MailIcon />
                <a
                  href={`mailto:${contact.email}`}
                  className="font-inter text-[14px] text-white/45 hover:text-gold transition-colors duration-200"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
            {/* Working hours */}
            <p className="font-inter text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
              {t('hours')}
            </p>
            <ul className="space-y-1">
              <li className="font-inter text-[14px] text-white/45">I–V: 10:00–18:00</li>
              <li className="font-inter text-[14px] text-white/45">VI: 10:00–15:00</li>
              <li className="font-inter text-[14px] text-white/45">
                VII: {t('closed')}
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div
          className="flex flex-col lg:flex-row items-center justify-between gap-3 py-6"
          style={{ borderTop: '1px solid rgba(198,165,92,0.15)' }}
        >
          <p className="font-inter text-[12px] text-white/30 order-2 lg:order-1">
            {t('copyright')}
          </p>

          {/* Language switcher */}
          <div className="flex items-center gap-2 order-1 lg:order-2">
            {(['lt', 'en'] as const).map((lang, i) => (
              <span key={lang} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="font-inter text-[11px] text-white/15">|</span>
                )}
                <button
                  type="button"
                  onClick={() => switchLocale(lang)}
                  className={`font-inter text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                    locale === lang ? 'text-gold' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
