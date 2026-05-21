'use client';
import { ArrowRight, Sparkles, Globe, Shield, Zap } from 'lucide-react';

const stats = [
  { value: '6+', label: 'Software Products' },
  { value: '100%', label: 'M-Pesa Ready' },
  { value: 'KE', label: 'Built for Kenya' },
  { value: '24/7', label: 'Local Support' },
];

const floatingCards = [
  { icon: '💆', label: 'BeautyPro', sub: 'Available Now', top: '22%', right: '6%', left: undefined, delay: '0s' },
  { icon: '🛒', label: 'ShopFlow', sub: 'Coming Soon', top: '55%', right: '2%', left: undefined, delay: '1.5s' },
  { icon: '⛪', label: 'ChurchDesk', sub: 'Coming Soon', top: '75%', right: undefined, left: '4%', delay: '0.8s' },
];

export default function Hero() {
  return (
    <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 72 }} className="grid-bg">

      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--orb1) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} className="animate-pulse-glow" />
      <div style={{
        position: 'absolute', bottom: '5%', right: '5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--orb2) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} className="animate-pulse-glow delay-300" />

      {/* Floating cards */}
      {floatingCards.map((card, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: card.top, right: card.right, left: card.left,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14, padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          animationDelay: card.delay, zIndex: 5,
          boxShadow: '0 8px 32px var(--shadow)',
        }} className="animate-float">
          <span style={{ fontSize: 22 }}>{card.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>{card.label}</div>
            <div style={{ fontSize: 11, color: card.sub === 'Available Now' ? '#22C55E' : 'var(--muted)' }}>{card.sub}</div>
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', marginLeft: 4,
            background: card.sub === 'Available Now' ? '#22C55E' : 'var(--muted)',
            boxShadow: card.sub === 'Available Now' ? '0 0 8px #22C55E' : 'none',
          }} />
        </div>
      ))}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 5%', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 760 }}>

          {/* Badge */}
          <div className="pill animate-fade-in" style={{ marginBottom: 32 }}>
            <Sparkles size={13} />
            Kenya&apos;s First Software Product Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 78px)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', marginBottom: 28, opacity: 0,
          }} className="animate-slide-up delay-100">
            <span style={{ color: 'var(--text)' }}>Software that</span>
            <br />
            <span style={{
              background: 'linear-gradient(90deg, var(--accent2), var(--accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }} className="text-glow">
              works for Kenya.
            </span>
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: 18, color: 'var(--text2)', lineHeight: 1.75,
            maxWidth: 560, marginBottom: 44, opacity: 0,
          }} className="animate-slide-up delay-200">
            Ready-made business software built for Kenyan businesses.
            M-Pesa integrated, locally supported, and priced for the Kenyan market.
            No custom development needed — just plug in and grow.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56, opacity: 0 }} className="animate-slide-up delay-300">
            <a href="#products" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Explore Products <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Book a Demo
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 60, opacity: 0 }} className="animate-slide-up delay-400">
            {[
              { icon: <Globe size={14} />, text: 'Web & Mobile' },
              { icon: <Shield size={14} />, text: 'Secure & Reliable' },
              { icon: <Zap size={14} />, text: 'M-Pesa Ready' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)', fontSize: 13 }}>
                <span style={{ color: 'var(--accent)' }}>{t.icon}</span>
                {t.text}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid var(--border)', opacity: 0,
          }} className="animate-slide-up delay-500">
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'var(--surface)', padding: '22px 20px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--accent)', marginBottom: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.04em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) { .animate-float { display: none; } }
        @media (max-width: 500px) {
          div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}