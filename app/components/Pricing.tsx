'use client';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const products = [
  {
    emoji: '💆',
    name: 'BeautyPro',
    tagline: 'Spa & Salon Management',
    color: '#E11D48',
    bg: 'rgba(225,29,72,0.06)',
    border: 'rgba(225,29,72,0.2)',
    monthlyKES: 2500,
    oneTimeKES: 35000,
    popular: true,
    status: 'Available Now',
    features: [
      'Appointment booking',
      'M-Pesa POS system',
      'Staff management',
      'Inventory tracking',
      'WhatsApp notifications',
      'Sales reports',
      'Customer records',
      'Multi-branch support',
    ],
  },
  {
    emoji: '🛒',
    name: 'ShopFlow',
    tagline: 'Retail & Inventory',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.2)',
    monthlyKES: 2000,
    oneTimeKES: 30000,
    popular: false,
    status: 'Coming Soon',
    features: [
      'Stock management',
      'Sales & receipts',
      'Supplier records',
      'Cash & M-Pesa POS',
      'Low stock alerts',
      'Sales reports',
      'Multiple outlets',
      'Barcode support',
    ],
  },
  {
    emoji: '⛪',
    name: 'ChurchDesk',
    tagline: 'Church & Community',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.06)',
    border: 'rgba(167,139,250,0.2)',
    monthlyKES: 1500,
    oneTimeKES: 25000,
    popular: false,
    status: 'Coming Soon',
    features: [
      'Member registry',
      'Tithes & offerings',
      'Event management',
      'SMS/WhatsApp blast',
      'Financial reports',
      'Attendance tracking',
      'Committee management',
      'M-Pesa integration',
    ],
  },
  {
    emoji: '🏫',
    name: 'EduCore',
    tagline: 'School Management',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.06)',
    border: 'rgba(34,197,94,0.2)',
    monthlyKES: 3000,
    oneTimeKES: 50000,
    popular: false,
    status: 'Coming Soon',
    features: [
      'Student enrollment',
      'Fee collection & M-Pesa',
      'Exam results & reports',
      'Attendance tracking',
      'Parent portal/SMS',
      'Teacher management',
      'Class timetables',
      'KRA receipting',
    ],
  },
  {
    emoji: '🏥',
    name: 'MediTrack',
    tagline: 'Clinic Management',
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.06)',
    border: 'rgba(56,189,248,0.2)',
    monthlyKES: 3500,
    oneTimeKES: 55000,
    popular: false,
    status: 'Coming Soon',
    features: [
      'Patient records',
      'Appointment booking',
      'Prescription management',
      'Billing & M-Pesa',
      'Lab results',
      'Doctor scheduling',
      'Drug inventory',
      'Insurance support',
    ],
  },
  {
    emoji: '🤝',
    name: 'SaccoSmart',
    tagline: 'SACCO & Chama',
    color: '#FB923C',
    bg: 'rgba(251,146,60,0.06)',
    border: 'rgba(251,146,60,0.2)',
    monthlyKES: 4000,
    oneTimeKES: 60000,
    popular: false,
    status: 'Coming Soon',
    features: [
      'Member contributions',
      'Loan management',
      'Interest calculation',
      'M-Pesa deposits',
      'Member statements',
      'Dividend calculation',
      'SMS notifications',
      'Audit trail',
    ],
  },
];

export default function Pricing() {
  const [isMonthly, setIsMonthly] = useState(true);
  const [selected, setSelected] = useState(0);

  const plan = products[selected];

  return (
    <section id="pricing" style={{ padding: '120px 5%', background: 'var(--surface2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Pay for what{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--accent2), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              you need.
            </span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 36 }}>
            Each software has its own price. Pick the one your business needs.
          </p>
          <div className="section-divider" style={{ margin: '0 auto 36px' }} />

          {/* Monthly / One-Time Toggle */}
          <div style={{
            display: 'inline-flex', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 100, padding: 4, gap: 4,
          }}>
            {['Monthly', 'One-Time License'].map((t, i) => (
              <button key={t} onClick={() => setIsMonthly(i === 0)} style={{
                padding: '8px 24px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontSize: 14, fontFamily: 'Syne, sans-serif', fontWeight: 600,
                background: (i === 0) === isMonthly
                  ? 'linear-gradient(135deg, var(--accent2), var(--accent))'
                  : 'transparent',
                color: (i === 0) === isMonthly ? 'white' : 'var(--muted)',
                transition: 'all 0.3s',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Product Selector Tabs */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          justifyContent: 'center', marginBottom: 48,
        }}>
          {products.map((p, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 100, border: '1px solid',
              borderColor: selected === i ? p.color : 'var(--border)',
              background: selected === i ? p.bg : 'transparent',
              color: selected === i ? p.color : 'var(--text2)',
              cursor: 'pointer', fontFamily: 'Syne, sans-serif',
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
            }}>
              <span>{p.emoji}</span>
              {p.name}
              {p.status === 'Available Now' && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#22C55E', boxShadow: '0 0 6px #22C55E',
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Pricing Card */}
        <div style={{
          maxWidth: 860, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          background: 'var(--card-bg)', border: `1px solid ${plan.border}`,
          borderRadius: 24, overflow: 'hidden',
          boxShadow: `0 0 0 1px ${plan.border}, 0 24px 60px var(--shadow)`,
        }} className="pricing-card">

          {/* Left — Info */}
          <div style={{ padding: 40, borderRight: '1px solid var(--border)' }}>

            {/* Product header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16,
                background: plan.bg, border: `1px solid ${plan.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              }}>
                {plan.emoji}
              </div>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: plan.color }}>{plan.name}</h3>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{plan.tagline}</div>
              </div>
            </div>

            {/* Status */}
            <div style={{ marginBottom: 28 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                padding: '4px 14px', borderRadius: 100, textTransform: 'uppercase',
                background: plan.status === 'Available Now' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.08)',
                color: plan.status === 'Available Now' ? '#22C55E' : 'var(--accent)',
                border: `1px solid ${plan.status === 'Available Now' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.25)'}`,
              }}>
                {plan.status}
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>KES</span>
                <span style={{ fontSize: 52, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text)', lineHeight: 1 }}>
                  {isMonthly
                    ? plan.monthlyKES.toLocaleString()
                    : plan.oneTimeKES.toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>
                {isMonthly ? 'per month · cancel anytime' : 'one-time · yours forever'}
              </div>
            </div>

            {/* CTA */}
            <a href="#contact" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              textDecoration: 'none', padding: '14px 28px', borderRadius: 12,
              background: `linear-gradient(135deg, ${plan.color}CC, ${plan.color})`,
              color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: 15, transition: 'all 0.3s', marginBottom: 12,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${plan.color}44`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {plan.status === 'Available Now' ? 'Get Started' : 'Join Waitlist'}
              <ArrowRight size={16} />
            </a>

            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
              All prices in KES · VAT applicable · M-Pesa accepted
            </p>
          </div>

          {/* Right — Features */}
          <div style={{ padding: 40 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: 'var(--text)' }}>
              What&apos;s included
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: plan.bg, border: `1px solid ${plan.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check size={12} color={plan.color} />
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--text2)' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* All products note */}
            <div style={{
              marginTop: 32, padding: '16px 18px', borderRadius: 12,
              background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
            }}>
              <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>
                🎯 Need multiple products?
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                Get discounts when you subscribe to 2+ products. Contact us for a bundle deal.
              </div>
            </div>
          </div>
        </div>

        {/* All products summary */}
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {products.map((p, i) => (
            <div key={i} onClick={() => setSelected(i)} style={{
              padding: '16px 20px', borderRadius: 14,
              background: selected === i ? p.bg : 'var(--card-bg)',
              border: `1px solid ${selected === i ? p.border : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = selected === i ? p.border : 'var(--border)'; }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{p.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: selected === i ? p.color : 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                KES {isMonthly ? p.monthlyKES.toLocaleString() : p.oneTimeKES.toLocaleString()}
                {isMonthly ? '/mo' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .pricing-card { grid-template-columns: 1fr !important; }
          .pricing-card > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </section>
  );
}