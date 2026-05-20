'use client';
import { ArrowRight, Sparkles, Globe, Shield, Zap } from 'lucide-react';

const stats = [
  { value: '6+', label: 'Software Products' },
  { value: '100%', label: 'M-Pesa Ready' },
  { value: 'KE', label: 'Built for Kenya' },
  { value: '24/7', label: 'Local Support' },
];

const floatingCards = [
  { icon: '💆', label: 'BeautyPro', top: '20%', right: '8%', delay: '0s' },
  { icon: '🛒', label: 'ShopFlow', top: '55%', right: '3%', delay: '1.5s' },
  { icon: '⛪', label: 'ChurchDesk', top: '75%', left: '5%', delay: '0.8s' },
];

export default function Hero() {
  return (
    <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 72 }} className="grid-bg">

      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,102,255,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} className="animate-pulse-glow" />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} className="animate-pulse-glow delay-300" />

      {/* Floating product cards */}
      {floatingCards.map((card, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: card.top, right: card.right, left: card.left,
          background: 'rgba(14,20,32,0.9)',
          border: '1px solid rgba(30,42,66,0.8)',
          borderRadius: 14, padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          backdropFilter: 'blur(10px)',
          animationDelay: card.delay,
          zIndex: 5,
        }} className="animate-float">
          <span style={{ fontSize: 22 }}>{card.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#E8EDF5' }}>{card.label}</div>
            <div style={{ fontSize: 11, color: '#00D4FF' }}>Active</div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF88', marginLeft: 4, boxShadow: '0 0 8px #00FF88' }} />
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
            fontSize: 'clamp(42px, 6vw, 80px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 28,
            opacity: 0,
          }} className="animate-slide-up delay-100">
            <span style={{ color: '#E8EDF5' }}>Software that</span>
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #0066FF, #00D4FF, #00FF88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }} className="text-glow">
              works for Kenya.
            </span>
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: 18, color: '#6B7A99', lineHeight: 1.7,
            maxWidth: 560, marginBottom: 44,
            opacity: 0,
          }} className="animate-slide-up delay-200">
            Ready-made business software built for Kenyan businesses. 
            M-Pesa integrated, locally supported, and priced for the Kenyan market. 
            No developer needed — just plug in and grow.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 72, opacity: 0 }} className="animate-slide-up delay-300">
            <a href="#products" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Explore Products <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Book a Demo
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 60, opacity: 0 }} className="animate-slide-up delay-400">
            {[
              { icon: <Globe size={14} />, text: 'Web & Mobile' },
              { icon: <Shield size={14} />, text: 'Secure & Reliable' },
              { icon: <Zap size={14} />, text: 'M-Pesa Ready' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7A99', fontSize: 13 }}>
                <span style={{ color: '#00D4FF' }}>{t.icon}</span>
                {t.text}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1, background: '#1E2A42', borderRadius: 16,
            overflow: 'hidden', border: '1px solid #1E2A42',
            opacity: 0,
          }} className="animate-slide-up delay-500">
            {stats.map((s, i) => (
              <div key={i} style={{
                background: '#0E1420', padding: '24px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#00D4FF', marginBottom: 4 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: '#6B7A99', letterSpacing: '0.05em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
