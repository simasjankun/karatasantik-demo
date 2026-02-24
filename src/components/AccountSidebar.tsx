'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

// ── Props ─────────────────────────────────────────────────────────────────────

interface AccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Close icon (matches Header.tsx / SearchOverlay.tsx style) ─────────────────

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// ── AccountSidebar ────────────────────────────────────────────────────────────

export default function AccountSidebar({ isOpen, onClose }: AccountSidebarProps) {
  const [mounted, setMounted] = useState(false);
  // visible controls portal rendering; animatingOut triggers the exit animation
  const [visible, setVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Account');

  // SSR safety — portal requires document to exist
  useEffect(() => {
    setMounted(true);
  }, []);

  // Drive visibility + exit animation from isOpen changes
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimatingOut(false);
    } else {
      // Start exit animation, then unmount after it completes
      setAnimatingOut(true);
      const timer = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key + focus trap
  useEffect(() => {
    if (!visible) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap: Tab cycles through all focusable elements inside sidebar
      if (e.key === 'Tab') {
        const sidebar = sidebarRef.current;
        if (!sidebar) return;

        const focusable = Array.from(
          sidebar.querySelectorAll<HTMLElement>(
            'button, input, a[href], [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'));

        if (focusable.length < 2) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  // Auto-focus email field after sidebar slides in
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => emailRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!mounted || !visible) return null;

  return createPortal(
    <>
      {/* ── Backdrop ───────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[70]"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          animation: animatingOut
            ? 'sidebarFadeBackdropOut 0.3s ease forwards'
            : 'sidebarFadeBackdrop 0.3s ease forwards',
        }}
        onClick={onClose}
      />

      {/* ── Sidebar panel ──────────────────────────────────────────────── */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        className="fixed top-0 right-0 bottom-0 z-[71] w-full md:w-[420px] flex flex-col"
        style={{
          backgroundColor: '#111111',
          animation: animatingOut
            ? 'sidebarSlideOut 0.35s ease forwards'
            : 'sidebarSlideIn 0.35s ease forwards',
        }}
      >
        {/* ── Header row ─────────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-8 py-[22px] border-b border-white/[0.07]">
          <h2 className="font-playfair font-normal text-[1.1rem] tracking-[0.26em] text-white/75 uppercase">
            {t('title')}
          </h2>
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="p-1.5 text-white/30 hover:text-gold transition-colors duration-300"
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Scrollable content ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-8 py-10">

          {/* Decorative section label */}
          <p className="text-[9.5px] tracking-[0.38em] uppercase text-gold/38 font-inter mb-9 select-none">
            {t('signIn')}
          </p>

          {/* ── Email field ──────────────────────────────────────────── */}
          <div className="mb-8">
            <label
              htmlFor="account-email"
              className="block text-[9px] tracking-[0.28em] uppercase text-gold/32 font-inter mb-3"
            >
              {t('email')}
            </label>
            <div className="relative">
              <input
                ref={emailRef}
                id="account-email"
                type="email"
                autoComplete="email"
                className="peer w-full bg-transparent text-white font-inter text-[14px] border-b border-gold/18 focus:outline-none pb-3 placeholder:text-white/12 transition-colors duration-300"
              />
              {/* Gold underline — expands from left on focus */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 ease-out origin-left"
              />
            </div>
          </div>

          {/* ── Password field ───────────────────────────────────────── */}
          <div className="mb-10">
            <label
              htmlFor="account-password"
              className="block text-[9px] tracking-[0.28em] uppercase text-gold/32 font-inter mb-3"
            >
              {t('password')}
            </label>
            <div className="relative">
              <input
                id="account-password"
                type="password"
                autoComplete="current-password"
                className="peer w-full bg-transparent text-white font-inter text-[14px] border-b border-gold/18 focus:outline-none pb-3 placeholder:text-white/12 transition-colors duration-300"
              />
              {/* Gold underline — expands from left on focus */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 ease-out origin-left"
              />
            </div>
          </div>

          {/* ── Sign in button ───────────────────────────────────────── */}
          <button className="w-full bg-gold text-[#111111] font-inter text-[11px] tracking-[0.3em] uppercase py-[15px] font-medium hover:bg-gold/90 active:bg-gold/80 transition-colors duration-300">
            {t('signIn')}
          </button>

          {/* Forgot password */}
          <p className="mt-5 text-center">
            <a
              href="#"
              className="text-[11px] tracking-[0.06em] text-white/25 font-inter hover:text-gold transition-colors duration-300"
            >
              {t('forgotPassword')}
            </a>
          </p>

          {/* ── Divider ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-5 my-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/18" />
            <span className="text-[10px] tracking-[0.32em] uppercase text-white/18 font-inter select-none">
              {t('or')}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/18" />
          </div>

          {/* ── Register section ─────────────────────────────────────── */}
          <p className="text-center text-[12px] font-inter text-white/28 tracking-[0.02em] leading-relaxed mb-8">
            {t('noAccount')}
          </p>

          <button className="w-full border border-gold/40 text-gold font-inter text-[11px] tracking-[0.3em] uppercase py-[15px] hover:bg-gold/[0.06] active:bg-gold/[0.1] transition-colors duration-300">
            {t('register')}
          </button>

        </div>
      </div>
    </>,
    document.body
  );
}
