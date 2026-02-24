'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { contact } from '@/data/contact';

// ── NewsletterSection ─────────────────────────────────────────────────────────

export default function NewsletterSection() {
  const t = useTranslations('Newsletter');
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

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
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleSubmit = () => {
    if (email.trim()) setSubmitted(true);
  };

  // Left column: slides in from left
  const leftAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : 'translateX(-30px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    transitionDelay: '0.1s',
  };

  // Right column: slides in from right
  const rightAnim: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateX(0)' : 'translateX(30px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    transitionDelay: '0.2s',
  };

  const goldLine: React.CSSProperties = {
    width: '40px',
    height: '1px',
    backgroundColor: '#C6A55C',
    marginBottom: '20px',
  };

  const headingSize = isMobile ? '26px' : '32px';

  return (
    <section
      ref={sectionRef}
      aria-label={t('customHeading')}
      style={{ backgroundColor: '#111111' }}
      className="py-[80px] lg:py-[120px]"
    >
      <div className="container mx-auto px-6 lg:px-8 xl:px-14">
        <div
          style={
            isMobile
              ? undefined
              : { display: 'flex', alignItems: 'flex-start', gap: '0' }
          }
        >

          {/* ── Left column — Custom Orders ──────────────────────────── */}
          <div
            style={{
              ...(isMobile ? {} : { flex: 1, paddingRight: '40px' }),
              ...leftAnim,
            }}
          >
            <div aria-hidden="true" style={goldLine} />
            <p className="font-inter text-[10px] tracking-[0.42em] uppercase text-gold mb-5 select-none">
              {t('customLabel')}
            </p>
            <h2
              className="font-playfair font-normal text-white leading-[1.1] mb-5"
              style={{ fontSize: headingSize }}
            >
              {t('customHeading')}
            </h2>
            <p
              className="font-inter text-white/55 mb-8"
              style={{ fontSize: '15px', lineHeight: 1.8 }}
            >
              {t('customText')}
            </p>
            <a
              href={`mailto:${contact.email}`}
              className={`inline-flex items-center justify-center bg-gold text-[#111111] font-inter text-[11px] tracking-[0.3em] uppercase px-7 py-3 font-medium hover:bg-gold/90 active:bg-gold/80 transition-colors duration-300 ${isMobile ? 'w-full' : ''}`}
            >
              {t('customCta')}
            </a>
          </div>

          {/* ── Divider ──────────────────────────────────────────────── */}
          {isMobile ? (
            <div
              aria-hidden="true"
              style={{
                height: '1px',
                backgroundColor: 'rgba(198,165,92,0.2)',
                margin: '48px 0',
              }}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                width: '1px',
                alignSelf: 'stretch',
                backgroundColor: 'rgba(198,165,92,0.2)',
                flexShrink: 0,
              }}
            />
          )}

          {/* ── Right column — Newsletter ────────────────────────────── */}
          <div
            style={{
              ...(isMobile ? {} : { flex: 1, paddingLeft: '40px' }),
              ...rightAnim,
            }}
          >
            <div aria-hidden="true" style={goldLine} />
            <p className="font-inter text-[10px] tracking-[0.42em] uppercase text-gold mb-5 select-none">
              {t('signupLabel')}
            </p>
            <h2
              className="font-playfair font-normal text-white leading-[1.1] mb-5"
              style={{ fontSize: headingSize }}
            >
              {t('signupHeading')}
            </h2>
            <p
              className="font-inter text-white/55 mb-8"
              style={{ fontSize: '15px', lineHeight: 1.8 }}
            >
              {t('signupText')}
            </p>

            {/* Email input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder={t('placeholder')}
              className="font-inter w-full bg-transparent text-white placeholder-white/30 outline-none mb-4"
              style={{
                fontSize: '15px',
                padding: '10px 0',
                borderBottom: `1px solid ${inputFocused ? '#C6A55C' : 'rgba(198,165,92,0.4)'}`,
                transition: 'border-color 0.3s ease',
              }}
            />

            {/* Submit button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex items-center justify-center bg-gold text-[#111111] font-inter text-[11px] tracking-[0.3em] uppercase px-7 py-3 font-medium hover:bg-gold/90 active:bg-gold/80 transition-colors duration-300"
            >
              {t('submit')}
            </button>

            {/* Success message */}
            {submitted && (
              <p
                className="font-inter text-gold/80 mt-4"
                style={{ fontSize: '13px', fontStyle: 'italic' }}
              >
                {t('success')}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
