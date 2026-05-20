'use client';
import { Check, Zap } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    monthlyKES: 1500,
    oneTimeKES: 25000,
    desc: 'Perfect for small churches, groups, and startups',
    features: ['1 Software Product', 'Up to 5 users', 'M-Pesa integration', 'Email support', 'Mobile app access', 'Monthly updates'],
    highlight: false,
    color: '#6B7A99',
  },
  {
    name: 'Business',
    monthlyKES: 3000,
    oneTimeKES: 45000,
    desc: 'For growing businesses that need more power',
    features: ['2 Software Products', 'Up to 20 users', 'M-Pesa integration', 'WhatsApp notifications', 'Priority support', 'SMS alerts', 'Custom branding', 'Monthly reports'],
    highlight: true,
    color: '#00D4FF',
  },
  {
    name: 'Enterprise',
    monthlyKES: null,
    oneTimeKES: null,
    desc: 'Full platform access for large organizations',
    features: ['All 6 Products', 'Unlimited users', 'M-Pesa + bank integration', 'Dedicated support line', 'Custom features', 'Staff training', 'SLA guarantee', 'On-site setup'],
    highlight: false,
    color: '#00FF88',
  },
];

export default function Pricing() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section id="pricing" style={{ padding: '120px 5%', background: '#0A0F1A', position: 'relative' }}>

      {/* Background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,102,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="pill" style={{ marginBottom: 20, display: 'inline-flex' }}>
            Simple Pricing
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Priced for{' '}
            <span style={{ background: 'linear-gradient(90deg, #00FF88, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Kenyan businesses
            </span>
          </h2>
          <p style={{ color: '#6B7A99', fontSize: 17, marginBottom: 36 }}>Pay monthly or once. No hidden fees. Cancel anytime.</p>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex', background: '#0E1420', border: '1px solid #1E2A42',
            borderRadius: 100, padding: 4, gap: 4,
          }}>
            {['Monthly', 'One-Time'].map((t, i) => (
              <button key={t} onClick={() => setIsMonthly(i === 0)} style={{
                padding: '8px 24px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontSize: 14, fontFamily: 'Syne, sans-serif', fontWeight: 600,
                background: (i === 0) === isMonthly ? 'linear-gradient(135deg, #0066FF, #00D4FF)' : 'transparent',
                color: (i === 0) === isMonthly ? 'white' : '#6B7A99',
                transition: 'all 0.3s',
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: plan.highlight ? 'rgba(0,102,255,0.06)' : '#0E1420',
              border: `1px solid ${plan.highlight ? 'rgba(0,212,255,0.4)' : '#1E2A42'}`,
              borderRadius: 20, padding: 36,
              transform: plan.highlight ? 'scale(1.03)' : 'none',
              position: 'relative', overflow: 'hidden',
            }}>

              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'linear-gradient(135deg, #0066FF, #00D4FF)',
                  borderRadius: 100, padding: '4px 12px',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, color: 'white', fontWeight: 700, fontFamily: 'Syne, sans-serif',
                }}>
                  <Zap size={10} /> POPULAR
                </div>
              )}

              <h3 style={{ fontSize: 20, fontWeight: 800, color: plan.color, marginBottom: 8 }}>{plan.name}</h3>
              <p style={{ color: '#6B7A99', fontSize: 13, marginBottom: 28, lineHeight: 1.5 }}>{plan.desc}</p>

              {/* Price */}
              <div style={{ marginBottom: 32 }}>
                {plan.monthlyKES ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 14, color: '#6B7A99', fontFamily: 'Syne, sans-serif' }}>KES</span>
                      <span style={{ fontSize: 44, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#E8EDF5' }}>
                        {isMonthly ? plan.monthlyKES?.toLocaleString() : plan.oneTimeKES?.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#6B7A99', marginTop: 4 }}>
                      {isMonthly ? 'per month' : 'one-time license'}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#E8EDF5' }}>
                    Custom
                  </div>
                )}
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: `rgba(${plan.color === '#00D4FF' ? '0,212,255' : plan.color === '#00FF88' ? '0,255,136' : '107,122,153'},0.15)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Check size={10} color={plan.color} />
                    </div>
                    <span style={{ fontSize: 13, color: '#A0AEC0' }}>{f}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" style={{
                display: 'block', textAlign: 'center', textDecoration: 'none',
                padding: '13px 24px', borderRadius: 10, fontSize: 14,
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                background: plan.highlight ? 'linear-gradient(135deg, #0066FF, #00D4FF)' : 'transparent',
                color: plan.highlight ? 'white' : plan.color,
                border: plan.highlight ? 'none' : `1px solid ${plan.color}`,
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => !plan.highlight && (e.currentTarget.style.background = `rgba(${plan.color === '#00FF88' ? '0,255,136' : '107,122,153'},0.1)`)}
                onMouseLeave={e => !plan.highlight && (e.currentTarget.style.background = 'transparent')}>
                {plan.monthlyKES ? 'Get Started' : 'Contact Us'}
              </a>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p style={{ textAlign: 'center', color: '#6B7A99', fontSize: 13, marginTop: 48 }}>
          All plans include M-Pesa integration • Prices in Kenyan Shillings (KES) • VAT applicable
        </p>
      </div>
    </section>
  );
}
