'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

// ── Props ─────────────────────────────────────────────────────────────────────

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

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

function CartEmptyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

// ── CartSidebar ───────────────────────────────────────────────────────────────

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Cart');

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

      if (e.key === 'Tab') {
        const sidebar = sidebarRef.current;
        if (!sidebar) return;

        const focusable = Array.from(
          sidebar.querySelectorAll<HTMLElement>(
            'button, a[href], [tabindex]:not([tabindex="-1"])'
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

        {/* ── Empty state — centered in remaining space ───────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 pb-10 gap-0">

          {/* Cart icon */}
          <div className="text-gold opacity-[0.38] mb-8">
            <CartEmptyIcon />
          </div>

          {/* Heading */}
          <h3 className="font-playfair font-normal text-[1.15rem] tracking-[0.12em] text-white/60 uppercase text-center mb-4">
            {t('empty')}
          </h3>

          {/* Subtext */}
          <p className="font-inter text-[12px] text-white/28 tracking-[0.02em] text-center leading-relaxed max-w-[260px] mb-12">
            {t('emptySubtext')}
          </p>

          {/* CTA — start shopping */}
          <button
            onClick={onClose}
            className="w-full bg-gold text-[#111111] font-inter text-[11px] tracking-[0.3em] uppercase py-[15px] font-medium hover:bg-gold/90 active:bg-gold/80 transition-colors duration-300"
          >
            {t('startShopping')}
          </button>

        </div>
      </div>
    </>,
    document.body
  );
}
