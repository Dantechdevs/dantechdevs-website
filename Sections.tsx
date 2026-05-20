'use client';
import { MapPin, Mail, Phone, MessageCircle, Globe, Code2, ExternalLink } from 'lucide-react';

export function About() {
  const values = [
    { icon: '🇰🇪', title: 'Built for Kenya', desc: 'Every product is designed around Kenyan business realities — M-Pesa, local taxes, and Swahili support.' },
    { icon: '⚡', title: 'Ready to Deploy', desc: 'No months of custom development. Buy, configure, and go live within days, not months.' },
    { icon: '🛡️', title: 'Locally Supported', desc: 'We are based in Kenya. Real support from someone who understands your business and context.' },
    { icon: '📈', title: 'Grows With You', desc: 'Start with one product, add more as your business expands. One account, one platform.' },
  ];

  return (
    <section id="about" style={{ padding: '120px 5%' }} className="grid-bg">
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

        {/* Left */}
        <div>
          <div className="pill" style={{ marginBottom: 24, display: 'inline-flex' }}>About Dantechdevs</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 24, lineHeight: 1.15 }}>
            Kenya&apos;s software gap{' '}
            <span style={{ background: 'linear-gradient(90deg, #0066FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ends here.
            </span>
          </h2>
          <p style={{ color: '#6B7A99', fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>
            Most Kenyan businesses are stuck hiring developers for custom software that costs hundreds of thousands and takes months to build. We said — enough.
          </p>
          <p style={{ color: '#6B7A99', fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
            Dantechdevs IT & Consultancy builds ready-made, affordable software products designed specifically for the Kenyan market. Whether you run a salon, school, church, or SACCO — we have software for you, available today.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="https://ngwasidaniel.vercel.app/#contact" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00D4FF', textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
              <Globe size={14} /> Developer Portfolio
            </a>
            <a href="https://github.com/Dantechdevs" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7A99', textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
              <ExternalLink size={14} /> GitHub
            </a>
          </div>
        </div>

        {/* Right — Values */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {values.map((v, i) => (
            <div key={i} style={{
              background: '#0E1420', border: '1px solid #1E2A42', borderRadius: 16, padding: 24,
              transition: 'border-color 0.3s, transform 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0066FF'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E2A42'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#E8EDF5' }}>{v.title}</h4>
              <p style={{ fontSize: 13, color: '#6B7A99', lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" style={{ padding: '120px 5%', background: '#0A0F1A' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="pill" style={{ marginBottom: 20, display: 'inline-flex' }}>Get in Touch</div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Ready to{' '}
            <span style={{ background: 'linear-gradient(90deg, #0066FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              get started?
            </span>
          </h2>
          <p style={{ color: '#6B7A99', fontSize: 17 }}>Reach out and we&apos;ll get your business running on the right software.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32 }}>Contact Details</h3>
            {[
              { icon: <MapPin size={18} color="#00D4FF" />, label: 'Location', value: 'Nairobi, Kenya' },
              { icon: <Mail size={18} color="#00D4FF" />, label: 'Email', value: 'info@dantechdevs.com' },
              { icon: <Phone size={18} color="#00D4FF" />, label: 'Phone / WhatsApp', value: '+254 700 000 000' },
              { icon: <Globe size={18} color="#00D4FF" />, label: 'Website', value: 'dantechdevs.com' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#6B7A99', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 15, color: '#E8EDF5', fontWeight: 500 }}>{c.value}</div>
                </div>
              </div>
            ))}

            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
                borderRadius: 10, padding: '12px 24px', textDecoration: 'none',
                color: '#25D166', fontSize: 14, fontWeight: 600, fontFamily: 'Syne, sans-serif',
                marginTop: 8, transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; }}>
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div style={{ background: '#0E1420', border: '1px solid #1E2A42', borderRadius: 20, padding: 36 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}>Send us a message</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Your Name', type: 'text', placeholder: 'Daniel Kamau' },
                { label: 'Email or Phone', type: 'text', placeholder: 'example@email.com or 07XX...' },
                { label: 'Business Type', type: 'text', placeholder: 'Salon, School, Church...' },
              ].map((field, i) => (
                <div key={i}>
                  <label style={{ fontSize: 13, color: '#6B7A99', display: 'block', marginBottom: 8 }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder} style={{
                    width: '100%', background: '#141B2D', border: '1px solid #1E2A42',
                    borderRadius: 10, padding: '12px 16px', color: '#E8EDF5',
                    fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif',
                    transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#00D4FF')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#1E2A42')} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, color: '#6B7A99', display: 'block', marginBottom: 8 }}>Message</label>
                <textarea placeholder="Tell us about your business and what software you need..." rows={4} style={{
                  width: '100%', background: '#141B2D', border: '1px solid #1E2A42',
                  borderRadius: 10, padding: '12px 16px', color: '#E8EDF5',
                  fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif',
                  resize: 'vertical', transition: 'border-color 0.2s', boxSizing: 'border-box',
                }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#00D4FF')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#1E2A42')} />
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
          #contact > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ background: '#080C14', borderTop: '1px solid #1E2A42', padding: '48px 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #0066FF, #00D4FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Code2 size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: '#E8EDF5' }}>Dantechdevs</div>
            <div style={{ fontSize: 10, color: '#6B7A99', letterSpacing: '0.1em' }}>IT & CONSULTANCY</div>
          </div>
        </div>

        <div style={{ color: '#6B7A99', fontSize: 13 }}>
          © 2025 Dantechdevs IT & Consultancy. Built in Kenya 🇰🇪
        </div>

        <a href="https://ngwasidaniel.vercel.app/#contact" target="_blank" rel="noopener noreferrer"
          style={{ color: '#6B7A99', textDecoration: 'none', fontSize: 12, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#00D4FF')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B7A99')}>
          Developed by Daniel Ngwasi
        </a>
      </div>
    </footer>
  );
}
