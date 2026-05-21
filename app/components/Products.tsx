'use client';
import { ArrowRight, CheckCircle } from 'lucide-react';

const products = [
  {
    emoji: '💆', name: 'BeautyPro', tagline: 'Spa & Salon Management',
    desc: 'Full-featured management for salons, spas, and barbershops. Appointments, POS, inventory, staff, and M-Pesa payments in one place.',
    features: ['Appointment booking', 'M-Pesa POS', 'Staff management', 'Inventory tracking', 'WhatsApp notifications'],
    color: '#E11D48', bg: 'rgba(225,29,72,0.07)', border: 'rgba(225,29,72,0.18)', status: 'Available Now',
  },
  {
    emoji: '🛒', name: 'ShopFlow', tagline: 'Retail & Inventory',
    desc: 'Smart retail management for shops, supermarkets, and wholesalers. Track stock, sales, suppliers, and cash flow effortlessly.',
    features: ['Stock management', 'Sales tracking', 'Supplier records', 'Cash & M-Pesa POS', 'Sales reports'],
    color: '#F59E0B', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.18)', status: 'Coming Soon',
  },
  {
    emoji: '⛪', name: 'ChurchDesk', tagline: 'Church & Community',
    desc: 'Member registry, tithes & offerings tracking, event management, and WhatsApp/SMS blasts for churches and community groups.',
    features: ['Member registry', 'Contributions tracking', 'Event management', 'SMS/WhatsApp blast', 'Financial reports'],
    color: '#A78BFA', bg: 'rgba(167,139,250,0.07)', border: 'rgba(167,139,250,0.18)', status: 'Coming Soon',
  },
  {
    emoji: '🏫', name: 'EduCore', tagline: 'School Management',
    desc: 'Complete school management system. Student enrollment, fee collection, exam results, attendance, and parent communication.',
    features: ['Student enrollment', 'Fee collection', 'Exam results', 'Attendance tracking', 'Parent portal'],
    color: '#22C55E', bg: 'rgba(34,197,94,0.07)', border: 'rgba(34,197,94,0.18)', status: 'Coming Soon',
  },
  {
    emoji: '🏥', name: 'MediTrack', tagline: 'Clinic Management',
    desc: 'Patient records, appointment scheduling, prescription management, and billing for clinics, chemists, and dental offices.',
    features: ['Patient records', 'Appointments', 'Prescriptions', 'Billing & invoicing', 'Lab results'],
    color: '#38BDF8', bg: 'rgba(56,189,248,0.07)', border: 'rgba(56,189,248,0.18)', status: 'Coming Soon',
  },
  {
    emoji: '🤝', name: 'SaccoSmart', tagline: 'SACCO & Chama',
    desc: 'Built for Kenyan SACCOs and chamas. Member contributions, loan management, interest calculation, and M-Pesa integration.',
    features: ['Member contributions', 'Loan management', 'Interest calculation', 'M-Pesa deposits', 'Member statements'],
    color: '#FB923C', bg: 'rgba(251,146,60,0.07)', border: 'rgba(251,146,60,0.18)', status: 'Coming Soon',
  },
];

export default function Products() {
  return (
    <section id="products" style={{ padding: '120px 5%', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Our Products</div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
            One platform.{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--accent2), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Every business.
            </span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
            Software products built specifically for Kenyan businesses. Each product is independent but powered by the same Dantechdevs platform.
          </p>
          <div className="section-divider" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {products.map((p, i) => (
            <div key={i} className="grad-border" style={{ padding: 32, cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 14,
                  background: p.bg, border: `1px solid ${p.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                }}>
                  {p.emoji}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  padding: '4px 12px', borderRadius: 100, textTransform: 'uppercase',
                  background: p.status === 'Available Now' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.08)',
                  color: p.status === 'Available Now' ? '#22C55E' : 'var(--accent)',
                  border: `1px solid ${p.status === 'Available Now' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.25)'}`,
                }}>
                  {p.status}
                </span>
              </div>

              <h3 style={{ fontSize: 21, fontWeight: 800, marginBottom: 4, color: p.color }}>{p.name}</h3>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, letterSpacing: '0.03em' }}>{p.tagline}</div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 22 }}>{p.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 26 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={14} color={p.color} />
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>{f}</span>
                  </div>
                ))}
              </div>

              <a href="#contact" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: p.color, textDecoration: 'none', fontSize: 13,
                fontWeight: 700, fontFamily: 'Syne, sans-serif', transition: 'gap 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.gap = '10px')}
                onMouseLeave={e => (e.currentTarget.style.gap = '6px')}>
                {p.status === 'Available Now' ? 'Get Started' : 'Join Waitlist'}
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}