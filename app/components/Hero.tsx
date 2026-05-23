"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Quick-link chips shown under the search bar ── */
const QUICK_LINKS = [
  { label: "PDF Books", icon: "📄", href: "/products/pdf-books" },
  { label: "Software", icon: "⚙️", href: "/products/software" },
  { label: "WordPress Items", icon: "🌐", href: "/products/wordpress" },
];

/* ── Floating stat badges ── */
const STATS = [
  { value: "12K+", label: "Products", color: "#E8294C" },
  { value: "4.9★", label: "Avg Rating", color: "#F5A623" },
  { value: "98%", label: "Satisfied", color: "#7C5CFC" },
];

export default function Hero() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <section className="hero" aria-label="Hero section">
      {/* ── Background layer ── */}
      <div className="hero__bg" aria-hidden="true">
        {/* Dark-tinted overlay sits on top of a background image in production.
            Here we approximate with a gradient + noise mesh. */}
        <div className="hero__overlay" />
        <div className="hero__mesh" />
      </div>

      {/* ── Floating stat chips ── */}
      <div className="hero__stats" aria-label="Marketplace statistics">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="hero__stat"
            style={{ "--accent": s.color } as React.CSSProperties}
          >
            <span className="hero__stat-value">{s.value}</span>
            <span className="hero__stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="hero__content container">
        {/* Badge */}
        <div className="hero__eyebrow animate-fade-up" style={{ animationDelay: "0ms" }}>
          <span className="hero__eyebrow-dot" aria-hidden="true" />
          The #1 Digital Marketplace
        </div>

        {/* Headline */}
        <h1 className="hero__headline animate-fade-up" style={{ animationDelay: "80ms" }}>
          The Best Digital<br />
          <span className="hero__headline-accent">WooCommerce</span>
          <br />Marketplace
        </h1>

        {/* Sub-copy */}
        <p className="hero__subtext animate-fade-up" style={{ animationDelay: "160ms" }}>
          Dizital is the most powerful, &amp; customizable theme for eCommerce Products
        </p>

        {/* Search */}
        <form
          className="hero__search animate-fade-up"
          onSubmit={handleSearch}
          role="search"
          aria-label="Product search"
          style={{ animationDelay: "240ms" }}
        >
          <input
            className="hero__search-input"
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="hero__search-btn" aria-label="Submit search">
            <SearchIcon />
          </button>
        </form>

        {/* Quick links */}
        <div className="hero__quick animate-fade-up" style={{ animationDelay: "320ms" }}>
          {QUICK_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="hero__quick-chip">
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Scoped Styles ── */}
      <style>{`
        /* ── Container ── */
        .hero {
          position: relative;
          min-height: calc(100vh - 72px);
          display: flex;
          align-items: center;
          overflow: hidden;
          color: #fff;
        }

        /* ── Background ── */
        .hero__bg {
          position: absolute;
          inset: 0;
          background:
            /* In production: replace with url('/hero-bg.jpg') center/cover no-repeat */
            linear-gradient(135deg, #0d0a1a 0%, #1a0f2e 40%, #241232 70%, #1a0820 100%);
          z-index: 0;
        }
        .hero__overlay {
          position: absolute;
          inset: 0;
          background: rgba(10,6,24,0.55);
        }
        .hero__mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 30%, rgba(232,41,76,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 20% 80%, rgba(124,92,252,0.15) 0%, transparent 60%);
        }

        /* ── Stats ── */
        .hero__stats {
          position: absolute;
          top: 32px;
          right: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 2;
        }
        .hero__stat {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 12px 20px;
          text-align: center;
          animation: fadeUp 0.5s ease both;
        }
        .hero__stat:nth-child(2) { animation-delay: 0.1s; }
        .hero__stat:nth-child(3) { animation-delay: 0.2s; }
        .hero__stat-value {
          display: block;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.375rem;
          color: var(--accent, #E8294C);
          line-height: 1.1;
        }
        .hero__stat-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Content ── */
        .hero__content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-top: 48px;
          padding-bottom: 64px;
          gap: 0;
        }

        /* Eyebrow */
        .hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(232,41,76,0.15);
          border: 1px solid rgba(232,41,76,0.35);
          border-radius: 999px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #FF8AA0;
          letter-spacing: 0.04em;
          margin-bottom: 24px;
        }
        .hero__eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #E8294C;
          position: relative;
        }
        .hero__eyebrow-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(232,41,76,0.3);
          animation: pulse-ring 1.8s ease infinite;
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.5; }
          70%  { transform: scale(1.8); opacity: 0;   }
          100% { transform: scale(1.8); opacity: 0;   }
        }

        /* Headline */
        .hero__headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin-bottom: 20px;
        }
        .hero__headline-accent {
          color: #E8294C;
          position: relative;
        }
        .hero__headline-accent::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #E8294C, #FF6B8A);
          border-radius: 2px;
          opacity: 0.6;
        }

        /* Subtext */
        .hero__subtext {
          font-size: clamp(0.9375rem, 1.5vw, 1.0625rem);
          font-weight: 400;
          color: #F5A623;
          max-width: 540px;
          line-height: 1.7;
          margin-bottom: 36px;
        }

        /* Search */
        .hero__search {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 560px;
          background: rgba(255,255,255,0.95);
          border-radius: 999px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.2);
          overflow: hidden;
          margin-bottom: 28px;
          backdrop-filter: blur(8px);
          transition: box-shadow 0.25s ease;
        }
        .hero__search:focus-within {
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 3px rgba(232,41,76,0.35);
        }
        .hero__search-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 16px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9375rem;
          color: #1A1530;
          outline: none;
        }
        .hero__search-input::placeholder { color: #9B96B4; }
        .hero__search-btn {
          width: 48px;
          height: 48px;
          margin: 6px;
          border-radius: 999px;
          background: #E8294C;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s ease, transform 0.15s ease;
          box-shadow: 0 4px 12px rgba(232,41,76,0.4);
        }
        .hero__search-btn:hover {
          background: #cf1f3f;
          transform: scale(1.06);
        }
        .hero__search-btn svg { width: 18px; height: 18px; }

        /* Quick chips */
        .hero__quick {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        .hero__quick-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.88);
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .hero__quick-chip:hover {
          background: rgba(232,41,76,0.25);
          border-color: rgba(232,41,76,0.5);
          color: #fff;
          transform: translateY(-2px);
        }

        /* Animations */
        .animate-fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(22px); }
          to   { opacity:1; transform: translateY(0);    }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero { min-height: 80vh; }
          .hero__stats { display: none; }
          .hero__headline { font-size: 2.2rem; }
          .hero__search { max-width: 100%; }
        }
        @media (max-width: 480px) {
          .hero__headline { font-size: 1.85rem; }
          .hero__quick-chip span:first-child { font-size: 1rem; }
        }
      `}</style>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}