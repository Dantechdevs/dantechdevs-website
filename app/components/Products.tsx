'use client';
import { Check, Zap } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter', monthlyKES: 1500, oneTimeKES: 25000,
    desc: 'Perfect for small churches, groups, and startups',
    features: ['1 Software Product', 'Up to 5 users', 'M-Pesa integration', 'Email support', 'Mobile app access', 'Monthly updates'],
    highlight: false, accentColor: 'var(--muted)',
  },
  {
    name: 'Business', monthlyKES: 3000, oneTimeKES: 45000,
    desc: 'For growing businesses that need more power',
    features: ['2 Software Products', 'Up to 20 users', 'M-Pesa integration', 'WhatsApp notifications', 'Priority support', 'SMS alerts', 'Custom branding', 'Monthly reports'],
    highlight: true, accentColor: 'var(--accent)',
  },
  {
    name: 'Enterprise', monthlyKES: null, oneTimeKES: null,
    desc: 'Full platform access for large organizations',
    features: ['All 6 Products', 'Unlimited users', 'M-Pesa + bank integration', 'Dedicated support line', 'Custom features', 'Staff training', 'SLA guarantee', 'On-site setup'],
    highlight: false, accentColor: 'var(--accent3)',
  },
];

export default function Pricing() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section id="pricing" style={{ padding: '120px 5%', background: 'var(--surface2)', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Simple Pricing</div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Priced for{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--accent3), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Kenyan businesses
            </span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 36 }}>Pay monthly or once. No hidden fees. Cancel anytime.</p>
          <div className="section-divider" style={{ margin: '0 auto 36px' }} />

          {/* Toggle */}
          <div style={{
            display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 100, padding: 4, gap: 4,
          }}>
            {['Monthly', 'One-Time'].map((t, i) => (
              <button key={t} onClick={() => setIsMonthly(i === 0)} style={{
                padding: '8px 24px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontSize: 14, fontFamily: 'Syne, sans-serif', fontWeight: 600,
                background: (i === 0) === isMonthly ? 'linear-gradient(135deg, var(--accent2), var(--accent))' : 'transparent',
                color: (i === 0) === isMonthly ? 'white' : 'var(--muted)',
                transition: 'all 0.3s',
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24, alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: plan.highlight ? 'var(--surface)' : 'var(--card-bg)',
              border: `1px solid ${plan.highlight ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 20, padding: 36,
              transform: plan.highlight ? 'scale(1.03)' : 'none',
              position: 'relative', overflow: 'hidden',
              boxShadow: plan.highlight ? '0 0 0 1px var(--accent), 0 20px 60px var(--shadow)' : 'none',
              transition: 'box-shadow 0.3s',
            }}>

              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
                  borderRadius: 100, padding: '4px 12px',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, color: 'white', fontWeight: 700, fontFamily: 'Syne, sans-serif',
                }}>
                  <Zap size={10} /> POPULAR
                </div>
              )}

              <h3 style={{ fontSize: 20, fontWeight: 800, color: plan.accentColor, marginBottom: 8 }}>{plan.name}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>{plan.desc}</p>

              <div style={{ marginBottom: 32 }}>
                {plan.monthlyKES ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>KES</span>
                      <span style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
                        {isMonthly ? plan.monthlyKES?.toLocaleString() : plan.oneTimeKES?.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                      {isMonthly ? 'per month' : 'one-time license'}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>Custom</div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      background: plan.highlight ? 'rgba(26,86,219,0.12)' : 'rgba(71,85,105,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={10} color={plan.highlight ? 'var(--accent)' : 'var(--muted)'} />
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>{f}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" style={{
                display: 'block', textAlign: 'center', textDecoration: 'none',
                padding: '13px 24px', borderRadius: 10, fontSize: 14,
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                background: plan.highlight ? 'linear-gradient(135deg, var(--accent2), var(--accent))' : 'transparent',
                color: plan.highlight ? 'white' : 'var(--text)',
                border: plan.highlight ? 'none' : '1px solid var(--border)',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => { if (!plan.highlight) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; } }}
                onMouseLeave={e => { if (!plan.highlight) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; } }}>
                {plan.monthlyKES ? 'Get Started' : 'Contact Us'}
              </a>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 48 }}>
          All plans include M-Pesa integration · Prices in Kenyan Shillings (KES) · VAT applicable
        </p>
      </div>
    </section>
  );
}