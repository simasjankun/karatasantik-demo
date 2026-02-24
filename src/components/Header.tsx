'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { navigation } from '@/data/navigation';
import { contact } from '@/data/contact';

// ── SVG Icons — thin, elegant strokes ────────────────────────────────────────

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2.75h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.62v-.7z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// ── SVG noise grain (CSS-only texture for dropdowns) ─────────────────────────
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`;

// ── Header Component ──────────────────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tNav = useTranslations('Navigation');
  const tHeader = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Shrink on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close everything on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); setActiveDropdown(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Dropdown hover helpers — small delay prevents flicker when crossing the gap
  const openDropdown = (name: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setActiveDropdown(name);
  };
  const closeDropdown = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 110);
  };
  const clearDropdown = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setActiveDropdown(null);
  };

  const toggleAccordion = (href: string) =>
    setOpenAccordion(prev => (prev === href ? null : href));

  const switchLocale = (next: string) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  const juvelyrikaItem = navigation.find(item => item.href === '/juvelyrika');
  const antikvariatasItem = navigation.find(item => item.href === '/antikvariatas');

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════════ */}
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-[box-shadow] duration-500 ${
          scrolled ? 'shadow-[0_8px_60px_rgba(0,0,0,0.8)]' : ''
        }`}
      >
        {/* ── Thin gold accent line — very top ─────────────────────── */}
        <div
          aria-hidden="true"
          className={`h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent transition-all duration-500 ${
            scrolled ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* ── Top Bar ──────────────────────────────────────────────── */}
        <div
          className={`hidden md:block bg-[#111111] overflow-hidden transition-all duration-500 ${
            scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
          }`}
        >
          <div className="container mx-auto px-8 xl:px-14 flex items-center justify-between py-[7px]">
            <div className="flex items-center gap-6">
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-white/55 hover:text-gold transition-colors duration-300"
              >
                <PhoneIcon />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-white/55 hover:text-gold transition-colors duration-300"
              >
                <MailIcon />
                {contact.email}
              </a>
            </div>
            <div className="flex items-center text-[11px] tracking-[0.18em] uppercase text-white/35">
              <button
                onClick={() => switchLocale('lt')}
                className={`px-1.5 py-0.5 hover:text-gold transition-colors duration-300 ${
                  locale === 'lt' ? 'text-white/65' : ''
                }`}
              >
                LT
              </button>
              <span aria-hidden="true" className="text-white/20 mx-0.5">|</span>
              <button
                onClick={() => switchLocale('en')}
                className={`px-1.5 py-0.5 hover:text-gold transition-colors duration-300 ${
                  locale === 'en' ? 'text-white/65' : ''
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Header ──────────────────────────────────────────── */}
        <div className={`bg-[#1a1a1a] transition-all duration-500 ${scrolled ? 'py-3' : 'py-5 md:py-7'}`}>
          <div className="container mx-auto px-8 xl:px-14">

            {/* ── MOBILE layout: hamburger | logo | cart ──────────── */}
            <div className="grid grid-cols-3 items-center md:hidden">

              {/* Hamburger — gold thin lines */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={tHeader(mobileOpen ? 'closeMenu' : 'openMenu')}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="justify-self-start flex flex-col justify-center gap-[5px] w-8 h-7"
              >
                <span className={`block h-px bg-gold rounded-full transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                <span className={`block h-px bg-gold rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-px bg-gold rounded-full transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
              </button>

              {/* Logo — centered, stacked mark */}
              <Link
                href="/"
                aria-label="Karatas Antik – pagrindinis puslapis"
                className="justify-self-center flex flex-col items-center gap-[5px]"
              >
                <span className="block font-playfair font-normal text-[0.88rem] tracking-[0.22em] text-gold uppercase leading-none">
                  Karatas
                </span>
                <span className="block font-inter font-light text-[0.44rem] tracking-[0.55em] text-gold/50 uppercase leading-none">
                  Antik
                </span>
              </Link>

              {/* Cart */}
              <button
                aria-label={tHeader('cartLabel')}
                className="justify-self-end relative text-white/40 hover:text-gold transition-colors duration-300"
              >
                <CartIcon />
                <span aria-hidden="true"
                  className="absolute -top-1.5 -right-1.5 w-[13px] h-[13px] rounded-full bg-gold text-[#1a1a1a] text-[8px] font-bold font-inter flex items-center justify-center leading-none">
                  0
                </span>
              </button>
            </div>

            {/* ── DESKTOP layout: logo block | icons ──────────────── */}
            <div className="hidden md:flex items-center justify-between">

              {/* Logo + tagline */}
              <div className="flex flex-col gap-0">
                <Link
                  href="/"
                  aria-label="Karatas Antik – pagrindinis puslapis"
                  className={`font-playfair font-normal tracking-[0.34em] text-gold uppercase transition-all duration-500 leading-none ${
                    scrolled ? 'text-xl' : 'text-2xl md:text-[1.75rem]'
                  }`}
                >
                  Karatas Antik
                </Link>
                <p
                  aria-hidden="true"
                  className={`font-inter text-[9.5px] tracking-[0.32em] text-white/22 uppercase transition-all duration-500 overflow-hidden ${
                    scrolled ? 'max-h-0 opacity-0 mt-0' : 'max-h-6 opacity-100 mt-[7px]'
                  }`}
                >
                  {tHeader('tagline')}
                </p>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-7" role="toolbar" aria-label={tHeader('actionsToolbar')}>
                <button aria-label={tHeader('search')}
                  className="text-white/35 hover:text-gold transition-colors duration-300">
                  <SearchIcon />
                </button>
                <button aria-label={tHeader('account')}
                  className="text-white/35 hover:text-gold transition-colors duration-300">
                  <UserIcon />
                </button>
                <button aria-label={tHeader('cartLabel')}
                  className="relative text-white/35 hover:text-gold transition-colors duration-300">
                  <CartIcon />
                  <span aria-hidden="true"
                    className="absolute -top-2 -right-2 w-[14px] h-[14px] rounded-full bg-gold text-[#1a1a1a] text-[8.5px] font-bold font-inter flex items-center justify-center leading-none">
                    0
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gold gradient separator: main header → nav */}
        <div aria-hidden="true"
          className="hidden md:block h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* ── Desktop Navigation ───────────────────────────────────── */}
        <nav
          className="relative hidden md:block bg-[#141414]"
          aria-label={tHeader('mainNav')}
          onMouseLeave={closeDropdown}
        >
          <div className="container mx-auto px-8 xl:px-14">
            <ul className="flex items-center justify-center" role="menubar">
              {navigation.map((item) => (
                <li
                  key={item.href}
                  role="none"
                  className={item.href === '/antikvariatas' ? 'relative' : ''}
                  onMouseEnter={() =>
                    item.children ? openDropdown(item.href) : clearDropdown()
                  }
                >
                  <Link
                    href={item.href}
                    role="menuitem"
                    aria-haspopup={item.children ? 'true' : undefined}
                    aria-expanded={item.children ? activeDropdown === item.href : undefined}
                    className={`relative flex items-center gap-1.5 px-5 py-[14px] text-[11.5px] uppercase tracking-[0.2em] font-inter font-medium transition-colors duration-300 ${
                      activeDropdown === item.href
                        ? 'text-gold'
                        : 'text-white/45 hover:text-white/80'
                    }`}
                  >
                    {tNav(item.labelKey)}
                    {item.children && (
                      <ChevronDownIcon
                        className={`transition-transform duration-300 ${
                          activeDropdown === item.href ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                    {/* Underline: fades in (opacity), not scales */}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-5 right-5 h-px bg-gold transition-opacity duration-300 ${
                        activeDropdown === item.href ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </Link>

                  {/* ── Antikvariatas — narrow dropdown (inside <li>) ─── */}
                  {item.href === '/antikvariatas' && antikvariatasItem?.children && (
                    <div
                      className="absolute left-0 top-full z-20 w-[280px]"
                      onMouseEnter={() => openDropdown('/antikvariatas')}
                      onMouseLeave={closeDropdown}
                    >
                      <div className={`dropdown-grid-wrapper ${activeDropdown === '/antikvariatas' ? 'is-open' : ''}`}>
                        <div className="dropdown-grid-inner">
                          {/* Top gold line */}
                          <div aria-hidden="true"
                            className="h-[2px] bg-gradient-to-r from-gold/80 via-gold/40 to-transparent" />
                          {/* Panel */}
                          <div
                            className="relative overflow-hidden"
                            style={{ backgroundColor: '#161616' }}
                          >
                            {/* Grain */}
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                backgroundImage: GRAIN_SVG,
                                backgroundSize: '200px 200px',
                                opacity: 0.04,
                              }}
                            />
                            {/* Content */}
                            <div className="relative py-6 px-2">
                              <p className="px-5 mb-4 text-[9.5px] tracking-[0.28em] uppercase text-gold/35 font-inter">
                                {tNav('antikvariatas')}
                              </p>
                              <ul role="none">
                                {antikvariatasItem.children.map((child, idx) => (
                                  <li key={child.href} role="none">
                                    <Link
                                      href={child.href}
                                      role="menuitem"
                                      style={{
                                        animation: activeDropdown === '/antikvariatas'
                                          ? `dropdownItemIn 0.3s ease both`
                                          : 'none',
                                        animationDelay: activeDropdown === '/antikvariatas'
                                          ? `${140 + idx * 45}ms`
                                          : '0ms',
                                      }}
                                      className="group/item flex items-center gap-3 px-5 py-2.5 text-[12.5px] font-inter text-white/45 hover:text-gold hover:bg-gold/[0.04] transition-all duration-200"
                                    >
                                      <span className="text-gold/30 font-light text-sm leading-none transition-colors duration-200 group-hover/item:text-gold/60">
                                        —
                                      </span>
                                      <span className="transition-transform duration-200 group-hover/item:translate-x-0.5">
                                        {tNav(child.labelKey)}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Gold gradient bottom border */}
          <div aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

          {/* ── Juvelyrika — full-viewport-width mega dropdown ─────── */}
          {/* Positioned absolute left-0 right-0 relative to <nav> (which is full-width in fixed header) */}
          <div
            className="absolute left-0 right-0 top-full z-20"
            onMouseEnter={() => openDropdown('/juvelyrika')}
            onMouseLeave={closeDropdown}
          >
            <div className={`dropdown-grid-wrapper ${activeDropdown === '/juvelyrika' ? 'is-open' : ''}`}>
              <div className="dropdown-grid-inner">
                {/* Top gold line */}
                <div aria-hidden="true"
                  className="h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

                {/* Mega panel */}
                <div
                  className="relative overflow-hidden"
                  style={{ backgroundColor: '#161616' }}
                >
                  {/* Grain texture */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: GRAIN_SVG,
                      backgroundSize: '200px 200px',
                      opacity: 0.045,
                    }}
                  />
                  {/* Subtle warm glow */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(198,165,92,0.04) 0%, transparent 70%)',
                    }}
                  />

                  {/* Content */}
                  <div
                    className={`relative container mx-auto px-12 xl:px-16 flex gap-0 transition-opacity duration-300 ${
                      activeDropdown === '/juvelyrika' ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transitionDelay: activeDropdown === '/juvelyrika' ? '80ms' : '0ms',
                      paddingTop: '2.5rem',
                      paddingBottom: '2.5rem',
                    }}
                  >
                    {/* Left — categories (60%) */}
                    <div className="flex-[3] pr-14 border-r border-white/[0.06]">
                      <p className="text-[9.5px] tracking-[0.32em] uppercase text-gold/40 font-inter mb-7">
                        {tHeader('categories')}
                      </p>
                      {juvelyrikaItem?.children && (
                        <ul className="grid grid-cols-2 gap-x-10 gap-y-0.5">
                          {juvelyrikaItem.children.map((child, idx) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setActiveDropdown(null)}
                                role="menuitem"
                                style={{
                                  animation:
                                    activeDropdown === '/juvelyrika'
                                      ? `dropdownItemIn 0.35s ease both`
                                      : 'none',
                                  animationDelay:
                                    activeDropdown === '/juvelyrika'
                                      ? `${160 + idx * 40}ms`
                                      : '0ms',
                                }}
                                className="group/cat flex items-center gap-3 py-3 text-[13px] font-inter text-white/45 hover:text-gold transition-colors duration-200"
                              >
                                <span className="shrink-0 text-gold/35 font-light text-sm leading-none transition-colors duration-200 group-hover/cat:text-gold/70">
                                  —
                                </span>
                                <span className="transition-transform duration-200 group-hover/cat:translate-x-1">
                                  {tNav(child.labelKey)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Footer link */}
                      <Link
                        href="/juvelyrika"
                        onClick={() => setActiveDropdown(null)}
                        className="mt-7 inline-flex items-center gap-2 text-[10.5px] tracking-[0.22em] uppercase text-gold/40 hover:text-gold transition-colors duration-300 border-b border-transparent hover:border-gold/40 pb-px"
                      >
                        {tHeader('viewAll')}
                        <span aria-hidden="true" className="text-xs">→</span>
                      </Link>
                    </div>

                    {/* Right — featured image (40%) */}
                    <div className="flex-[2] pl-14 flex flex-col justify-center">
                      <p className="text-[9.5px] tracking-[0.32em] uppercase text-gold/40 font-inter mb-6">
                        {tHeader('newCollection')}
                      </p>
                      {/* Image placeholder with corner frame */}
                      <div className="relative p-2.5">
                        {/* Corner accents */}
                        <div aria-hidden="true" className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/45" />
                        <div aria-hidden="true" className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/45" />
                        <div aria-hidden="true" className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold/45" />
                        <div aria-hidden="true" className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/45" />
                        {/* Placeholder */}
                        <div className="w-full aspect-[16/10] bg-[#111111] flex items-center justify-center">
                          <span className="text-[9px] tracking-[0.25em] text-white/12 uppercase font-inter">
                            {tHeader('imagePlaceholder')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE MENU — full-screen overlay slides from right
      ════════════════════════════════════════════════════════════════ */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={tHeader('mobileMenuDialog')}
        className={`fixed inset-0 z-[60] flex flex-col md:hidden transition-transform duration-[340ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: 'rgba(10, 10, 10, 0.98)' }}
      >
        {/* Overlay header: logo + close */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.07] shrink-0">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            aria-label="Karatas Antik – pagrindinis puslapis"
            className="font-playfair font-normal text-[1.1rem] tracking-[0.28em] text-gold uppercase"
          >
            Karatas Antik
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label={tHeader('closeMenu')}
            className="p-1.5 text-white/30 hover:text-gold transition-colors duration-300"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav items — scrollable, stagger in */}
        <nav className="flex-1 overflow-y-auto px-7 pt-2 pb-4" aria-label={tHeader('mobileNav')}>
          <ul>
            {navigation.map((item, index) => (
              <li
                key={item.href}
                className="border-b border-white/[0.06]"
                style={{
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  transitionDelay: mobileOpen ? `${160 + index * 55}ms` : '0ms',
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateX(0)' : 'translateX(28px)',
                }}
              >
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleAccordion(item.href)}
                      aria-expanded={openAccordion === item.href}
                      className="flex items-center justify-between w-full py-[18px] text-left font-playfair font-normal text-[1.35rem] uppercase tracking-[0.1em] text-white/60 hover:text-gold transition-colors duration-200"
                    >
                      <span>{tNav(item.labelKey)}</span>
                      <ChevronDownIcon
                        className={`text-gold/40 transition-transform duration-300 ${
                          openAccordion === item.href ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className={`dropdown-grid-wrapper ${openAccordion === item.href ? 'is-open' : ''}`}>
                      <div className="dropdown-grid-inner">
                        <ul className="pb-4 space-y-0.5">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="group/sub flex items-center gap-3 pl-3 pr-2 py-3 text-[13px] font-inter text-white/35 hover:text-gold border-l-2 border-transparent hover:border-gold/50 transition-all duration-200"
                              >
                                <span className="text-gold/25 font-light leading-none transition-colors duration-200 group-hover/sub:text-gold/50">
                                  —
                                </span>
                                {tNav(child.labelKey)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-[18px] font-playfair font-normal text-[1.35rem] uppercase tracking-[0.1em] text-white/60 hover:text-gold transition-colors duration-200"
                  >
                    {tNav(item.labelKey)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom bar — fixed to bottom, does not scroll */}
        <div className="shrink-0 border-t border-gold/10 px-7 pt-4 pb-7 space-y-4">

          {/* Language switcher — centered */}
          <div className="flex items-center justify-center gap-1 text-[10.5px] tracking-[0.2em] uppercase font-inter">
            <button
              onClick={() => switchLocale('lt')}
              className={`px-2 py-1 hover:text-gold transition-colors duration-300 ${
                locale === 'lt' ? 'text-white/65' : 'text-white/28'
              }`}
            >
              LT
            </button>
            <span aria-hidden="true" className="text-white/18">|</span>
            <button
              onClick={() => switchLocale('en')}
              className={`px-2 py-1 hover:text-gold transition-colors duration-300 ${
                locale === 'en' ? 'text-white/65' : 'text-white/28'
              }`}
            >
              EN
            </button>
          </div>

          {/* Icon row — search placeholder + account + social, evenly spaced */}
          <div className="flex items-center justify-around">
            <button
              aria-label={tHeader('search')}
              className="text-gold/50 hover:text-gold transition-colors duration-300 p-1"
            >
              <SearchIcon />
            </button>
            <button
              aria-label={tHeader('account')}
              className="text-gold/50 hover:text-gold transition-colors duration-300 p-1"
            >
              <UserIcon />
            </button>
            <a
              href={contact.social.facebook}
              aria-label="Facebook"
              className="text-gold/50 hover:text-gold transition-colors duration-300 p-1"
            >
              <FacebookIcon />
            </a>
            <a
              href={contact.social.instagram}
              aria-label="Instagram"
              className="text-gold/50 hover:text-gold transition-colors duration-300 p-1"
            >
              <InstagramIcon />
            </a>
          </div>

          {/* Contact — centered, muted */}
          <div className="flex flex-col items-center gap-1.5">
            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="text-[10px] tracking-[0.12em] uppercase text-white/25 hover:text-gold transition-colors duration-300"
            >
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-[10px] tracking-[0.08em] text-white/25 hover:text-gold transition-colors duration-300"
            >
              {contact.email}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
