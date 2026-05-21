'use client';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import Image from 'next/image';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('dtd-theme') as 'dark' | 'light') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dtd-theme', next);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'var(--nav-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 5%',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Image
            src="/logo.png"
            alt="Dantechdevs Logo"
            width={44}
            height={44}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text)', lineHeight: 1 }}>
              Dantechdevs
            </div>
            <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
              Code the future
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
          {['About', 'Pricing', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: 'var(--text2)', textDecoration: 'none',
              padding: '8px 16px', borderRadius: 8, fontSize: 14,
              transition: 'color 0.2s, background 0.2s', fontWeight: 500,
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'transparent'; }}>
              {item}
            </a>
          ))}

          {/* Products Dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--text2)', background: 'none', border: 'none',
              padding: '8px 16px', borderRadius: 8, fontSize: 14,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}>
              Products <ChevronDown size={14} />
            </button>
            {dropOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
                padding: 12, minWidth: 240, marginTop: 8,
                boxShadow: '0 20px 60px var(--shadow)',
              }}>
                {products.map(p => (
                  <a key={p.name} href="#products" style={{
                    display: 'block', padding: '10px 14px', borderRadius: 10,
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{p.desc}</div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme" style={{ marginLeft: 4 }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <a href="#contact" className="btn-primary" style={{ marginLeft: 8, padding: '10px 24px', fontSize: 14, borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>
            Get Started
          </a>
        </div>

        {/* Mobile */}
        <div style={{ display: 'none', alignItems: 'center', gap: 8 }} className="mobile-btns">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          padding: '20px 5%', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {['About', 'Products', 'Pricing', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              style={{ color: 'var(--text)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 15 }}>
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
          .mobile-btns { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}