'use client';
import { MapPin, Mail, Phone, MessageCircle, Globe, Code2, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export function About() {
  const values = [
    { icon: '🇰🇪', title: 'Built for Kenya', desc: 'Every product is designed around Kenyan business realities — M-Pesa, local taxes, and Swahili support.' },
    { icon: '⚡', title: 'Ready to Deploy', desc: 'No months of custom development. Buy, configure, and go live within days, not months.' },
    { icon: '🛡️', title: 'Locally Supported', desc: 'We are based in Kenya. Real support from someone who understands your business and context.' },
    { icon: '📈', title: 'Grows With You', desc: 'Start with one product, add more as your business expands. One account, one platform.' },
  ];

  return (
    <section id="about" style={{ padding: '120px 5%', background: 'var(--surface2)' }} className="grid-bg">
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }} className="about-grid">

        <div>
          <div className="pill" style={{ marginBottom: 24, display: 'inline-flex' }}>About Dantechdevs</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 24, lineHeight: 1.15 }}>
            Kenya&apos;s software gap{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--accent2), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ends here.
            </span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.8, marginBottom: 18 }}>
            Most Kenyan businesses are stuck hiring developers for custom software that costs hundreds of thousands and takes months to build. We said — enough.
          </p>
          <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
            Dantechdevs IT & Consultancy builds ready-made, affordable software products designed specifically for the Kenyan market. Whether you run a salon, school, church, or SACCO — we have software for you, available today.
          </p>

          {/* Logo + tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, padding: '16px 20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 14 }}>
            <Image src="/logo.png" alt="Dantechdevs" width={52} height={52} style={{ borderRadius: '50%' }} />
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>Dantechdevs Developers</div>
              <div style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.05em' }}>Code the future · Since 2023</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <a href="https://ngwasidaniel.vercel.app/#contact" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
              <Globe size={14} /> Developer Portfolio
            </a>
            <a href="https://github.com/Dantechdevs" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text2)', textDecoration: 'none', fontSize: 13, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
              <ExternalLink size={14} /> GitHub
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {values.map((v, i) => (
            <div key={i} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 24,
              transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px var(--shadow)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{v.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" style={{ padding: '120px 5%', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Get in Touch</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Ready to{' '}
            <span style={{ background: 'linear-gradient(90deg, var(--accent2), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              get started?
            </span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17 }}>Reach out and we&apos;ll get your business running on the right software.</p>
          <div className="section-divider" style={{ margin: '16px auto 0' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="contact-grid">
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32 }}>Contact Details</h3>
            {[
              { icon: <MapPin size={18} color="var(--accent)" />, label: 'Location', value: 'Nairobi, Kenya' },
              { icon: <Mail size={18} color="var(--accent)" />, label: 'Email', value: 'info@dantechdevs.com' },
              { icon: <Phone size={18} color="var(--accent)" />, label: 'Phone/WhatsApp', value: '+254 700 000 000' },
              { icon: <Globe size={18} color="var(--accent)" />, label: 'Website', value: 'dantechdevelopers.com' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 15, color: 'var(--text)', fontWeight: 500 }}>{c.value}</div>
                </div>
              </div>
            ))}

            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)',
                borderRadius: 10, padding: '12px 24px', textDecoration: 'none',
                color: '#25D166', fontSize: 14, fontWeight: 700, fontFamily: 'Syne, sans-serif',
                marginTop: 8, transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.08)'; }}>
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 36 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}>Send us a message</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Your Name', placeholder: 'Daniel Kamau' },
                { label: 'Email or Phone', placeholder: 'example@email.com or 07XX...' },
                { label: 'Business Type', placeholder: 'Salon, School, Church...' },
              ].map((field, i) => (
                <div key={i}>
                  <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 8, fontWeight: 500 }}>{field.label}</label>
                  <input type="text" placeholder={field.placeholder} style={{
                    width: '100%', borderRadius: 10, padding: '12px 16px',
                    fontSize: 14, boxSizing: 'border-box',
                  }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 8, fontWeight: 500 }}>Message</label>
                <textarea placeholder="Tell us about your business and what software you need..." rows={4} style={{
                  width: '100%', borderRadius: 10, padding: '12px 16px',
                  fontSize: 14, resize: 'vertical', boxSizing: 'border-box',
                }} />
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--surface2)', borderTop: '1px solid var(--border)', padding: '44px 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/logo.png" alt="Dantechdevs" width={38} height={38} style={{ borderRadius: '50%' }} />
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>Dantechdevs</div>
            <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Code the future</div>
          </div>
        </div>

        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
          © 2025 Dantechdevs IT & Consultancy. Built in Kenya 🇰🇪
        </div>

        <a href="https://ngwasidaniel.vercel.app/#contact" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 12, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
          Developed by Daniel Ngwasi
        </a>
      </div>
    </footer>
  );
}