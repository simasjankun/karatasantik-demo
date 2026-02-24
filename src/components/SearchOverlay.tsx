'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

// ── Props ─────────────────────────────────────────────────────────────────────

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Close icon (matches Header.tsx style) ─────────────────────────────────────

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

// ── SearchOverlay ─────────────────────────────────────────────────────────────

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('Search');

  // SSR safety — portal requires document to exist
  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape key + focus trap
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap: Tab cycles between input ↔ close button
      if (e.key === 'Tab') {
        const focusable = [inputRef.current, closeButtonRef.current].filter(
          (el): el is HTMLElement => el !== null
        );
        if (focusable.length < 2) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-focus input after overlay animates in
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Close when clicking the backdrop (not the content)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('label')}
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(15, 15, 15, 0.97)',
        animation: 'searchOverlayFadeIn 0.3s ease forwards',
      }}
      onClick={handleBackdropClick}
    >
      {/* ── Close button — top-right ──────────────────────────────── */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label={t('close')}
        className="absolute top-6 right-6 md:top-8 md:right-10 p-1.5 text-white/30 hover:text-gold transition-colors duration-300"
      >
        <CloseIcon />
      </button>

      {/* ── Centered content ──────────────────────────────────────── */}
      <div
        className="w-full max-w-2xl px-8 md:px-12"
        style={{ animation: 'searchContentSlideUp 0.4s ease 0.08s both' }}
      >
        {/* Decorative label above input */}
        <p className="text-center text-[10px] tracking-[0.42em] uppercase text-gold/45 font-inter mb-8 select-none">
          {t('label')}
        </p>

        {/* Input with animated gold underline */}
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            className={[
              'peer w-full bg-transparent text-center text-white',
              'font-playfair text-4xl md:text-5xl leading-none',
              'border-b border-gold/20',
              'focus:outline-none focus:border-gold/20',
              'pb-5 transition-colors duration-300',
              'placeholder:text-white/15',
              // Suppress browser native cancel/search decorations
              '[&::-webkit-search-cancel-button]:hidden',
              '[&::-webkit-search-decoration]:hidden',
            ].join(' ')}
            placeholder={t('placeholder')}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Gold animated underline — expands from center on focus */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold scale-x-0 peer-focus:scale-x-100 transition-transform duration-500 ease-out origin-center"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
