'use client';
import { useState, useEffect } from 'react';
import { Menu, X, Code2, ChevronDown } from 'lucide-react';

const products = [
  { name: 'BeautyPro', desc: 'Spa & Salon Management' },
  { name: 'ShopFlow', desc: 'Retail & Inventory' },
  { name: 'ChurchDesk', desc: 'Church Management' },
  { name: 'EduCore', desc: 'School Management' },
  { name: 'MediTrack', desc: 'Clinic Management' },
  { name: 'SaccoSmart', desc: 'SACCO & Chama' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(8,12,20,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(30,42,66,0.8)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 5%',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #0066FF, #00D4FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Code2 size={20} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: '#E8EDF5', lineHeight: 1 }}>
              Dantechdevs
            </div>
            <div style={{ fontSize: 10, color: '#6B7A99', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              IT & Consultancy
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
          <a href="#about" style={{ color: '#6B7A99', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 14, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E8EDF5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7A99')}>
            About
          </a>

          {/* Products Dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: '#6B7A99', background: 'none', border: 'none',
              padding: '8px 16px', borderRadius: 8, fontSize: 14, cursor: 'pointer',
              transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8EDF5')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7A99')}>
              Products <ChevronDown size={14} />
            </button>
            {dropOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                background: '#0E1420', border: '1px solid #1E2A42', borderRadius: 16,
                padding: 12, minWidth: 240, marginTop: 8,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                {products.map(p => (
                  <a key={p.name} href={`#products`} style={{
                    display: 'block', padding: '10px 14px', borderRadius: 10,
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#141B2D')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#E8EDF5', fontFamily: 'Syne, sans-serif' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#6B7A99', marginTop: 2 }}>{p.desc}</div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#pricing" style={{ color: '#6B7A99', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 14, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E8EDF5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7A99')}>
            Pricing
          </a>
          <a href="#contact" style={{ color: '#6B7A99', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 14, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E8EDF5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B7A99')}>
            Contact
          </a>

          <a href="#contact" className="btn-primary" style={{ marginLeft: 8, padding: '10px 24px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#E8EDF5', cursor: 'pointer', display: 'none' }} className="mobile-btn">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: '#0E1420', borderTop: '1px solid #1E2A42',
          padding: '20px 5%', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {['About', 'Products', 'Pricing', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{ color: '#E8EDF5', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #1E2A42', fontSize: 15 }}>
              {item}
            </a>
          ))}
          <a href="#contact" className="btn-primary" style={{ marginTop: 16, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
            Get Started
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
