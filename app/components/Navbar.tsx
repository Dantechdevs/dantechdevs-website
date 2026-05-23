"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ── Types ── */
interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "All Products",
    href: "/products",
    children: [
      { label: "PDF Books", href: "/products/pdf-books" },
      { label: "Software", href: "/products/software" },
      { label: "WordPress Items", href: "/products/wordpress" },
      { label: "Fonts", href: "/products/fonts" },
      { label: "Photos", href: "/products/photos" },
      { label: "Graphic", href: "/products/graphic" },
      { label: "Audios", href: "/products/audios" },
      { label: "Code", href: "/products/code" },
      { label: "Videos", href: "/products/videos" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
];

/* ── Navbar Component ── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
      role="banner"
    >
      <div className="navbar__inner container">
        {/* ── Logo ── */}
        <Link href="/" className="navbar__logo" aria-label="Tijarah home">
          <span className="navbar__logo-icon">T</span>
          <span className="navbar__logo-text">
            Ti<span>jar</span>ah
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="navbar__nav" aria-label="Primary navigation" ref={dropRef}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="navbar__item"
              onMouseEnter={() => item.children && setDropOpen(item.label)}
              onMouseLeave={() => setDropOpen(null)}
            >
              <Link
                href={item.href}
                className="navbar__link"
                aria-haspopup={!!item.children}
                aria-expanded={dropOpen === item.label}
              >
                {item.label}
                {item.children && (
                  <ChevronIcon
                    className={`navbar__chevron${dropOpen === item.label ? " navbar__chevron--open" : ""}`}
                  />
                )}
              </Link>

              {item.children && dropOpen === item.label && (
                <div className="navbar__dropdown" role="menu">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="navbar__dropdown-item"
                      role="menuitem"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="navbar__actions">
          <button className="navbar__icon-btn" aria-label="Search">
            <SearchIcon />
          </button>

          <button className="navbar__icon-btn navbar__icon-btn--badge" aria-label="Wishlist (0)">
            <HeartIcon />
            <span className="navbar__badge">0</span>
          </button>

          <button className="navbar__icon-btn" aria-label="Account">
            <UserIcon />
          </button>

          <button className="navbar__icon-btn navbar__icon-btn--badge" aria-label="Cart (0)">
            <CartIcon />
            <span className="navbar__badge">0</span>
          </button>
        </div>

        {/* ── Mobile Burger ── */}
        <button
          className={`navbar__burger${mobileOpen ? " navbar__burger--open" : ""}`}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="navbar__mobile" role="dialog" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="navbar__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="navbar__mobile-sub">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="navbar__mobile-sublink"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="navbar__mobile-actions">
            <button className="navbar__icon-btn" aria-label="Search"><SearchIcon /></button>
            <button className="navbar__icon-btn" aria-label="Wishlist"><HeartIcon /></button>
            <button className="navbar__icon-btn" aria-label="Account"><UserIcon /></button>
            <button className="navbar__icon-btn" aria-label="Cart"><CartIcon /></button>
          </div>
        </div>
      )}

      {/* ── Scoped Styles ── */}
      <style>{`
        /* Base */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid transparent;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .navbar--scrolled {
          box-shadow: 0 4px 20px rgba(124,92,252,0.10);
          border-bottom-color: #F0EEF8;
        }
        .navbar__inner {
          display: flex;
          align-items: center;
          height: 72px;
          gap: 12px;
        }

        /* Logo */
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar__logo-icon {
          width: 36px;
          height: 36px;
          background: #E8294C;
          color: #fff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.125rem;
          box-shadow: 0 4px 12px rgba(232,41,76,0.3);
        }
        .navbar__logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.375rem;
          color: #1A1530;
          letter-spacing: -0.02em;
        }
        .navbar__logo-text span {
          color: #E8294C;
        }

        /* Nav */
        .navbar__nav {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
        }
        .navbar__item {
          position: relative;
        }
        .navbar__link {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 14px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #5B5478;
          text-decoration: none;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .navbar__link:hover,
        .navbar__item:hover > .navbar__link {
          color: #E8294C;
          background: rgba(232,41,76,0.05);
        }
        .navbar__chevron {
          width: 14px;
          height: 14px;
          opacity: 0.6;
          transition: transform 0.2s ease;
        }
        .navbar__chevron--open {
          transform: rotate(180deg);
          opacity: 1;
        }

        /* Dropdown */
        .navbar__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 200px;
          background: #fff;
          border: 1px solid #F0EEF8;
          border-radius: 14px;
          padding: 8px;
          box-shadow: 0 16px 40px rgba(26,21,48,0.12);
          animation: fadeUp 0.18s ease both;
          z-index: 100;
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateX(-50%) translateY(8px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0);   }
        }
        .navbar__dropdown-item {
          display: block;
          padding: 9px 14px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: #5B5478;
          text-decoration: none;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .navbar__dropdown-item:hover {
          color: #E8294C;
          background: rgba(232,41,76,0.06);
        }

        /* Actions */
        .navbar__actions {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 12px;
        }
        .navbar__icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #5B5478;
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .navbar__icon-btn:hover {
          color: #E8294C;
          background: rgba(232,41,76,0.06);
        }
        .navbar__icon-btn svg {
          width: 20px;
          height: 20px;
        }
        .navbar__icon-btn--badge .navbar__badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          background: #E8294C;
          color: #fff;
          border-radius: 999px;
          font-size: 0.625rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* Burger */
        .navbar__burger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 32px;
          height: 22px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: auto;
        }
        .navbar__burger span {
          display: block;
          width: 100%;
          height: 2.5px;
          background: #1A1530;
          border-radius: 2px;
          transition: all 0.25s ease;
        }
        .navbar__burger--open span:nth-child(1) {
          transform: translateY(9.75px) rotate(45deg);
        }
        .navbar__burger--open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .navbar__burger--open span:nth-child(3) {
          transform: translateY(-9.75px) rotate(-45deg);
        }

        /* Mobile menu */
        .navbar__mobile {
          background: #fff;
          border-top: 1px solid #F0EEF8;
          padding: 16px 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: fadeIn 0.2s ease both;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .navbar__mobile-link {
          display: block;
          padding: 11px 14px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          color: #1A1530;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .navbar__mobile-link:hover { background: rgba(232,41,76,0.05); color: #E8294C; }
        .navbar__mobile-sub {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 4px 14px 8px;
        }
        .navbar__mobile-sublink {
          padding: 6px 12px;
          border-radius: 8px;
          background: #F8F7FF;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #5B5478;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .navbar__mobile-sublink:hover { background: rgba(232,41,76,0.08); color: #E8294C; }
        .navbar__mobile-actions {
          display: flex;
          gap: 4px;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid #F0EEF8;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .navbar__nav { display: none; }
          .navbar__actions { display: none; }
          .navbar__burger { display: flex; }
        }
        @media (min-width: 1025px) {
          .navbar__mobile { display: none; }
        }
      `}</style>
    </header>
  );
}

/* ── Icon Components ── */
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}