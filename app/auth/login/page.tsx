/**
 * ─────────────────────────────────────────────
 * STAGE 4 — Login Page (Professional Redesign)
 * File: app/auth/login/page.tsx
 * ─────────────────────────────────────────────
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const R = "#e8325a";
const RD = "#c41e45";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 6,
  dur: Math.random() * 4 + 4,
}));

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(), password: form.password,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <main className="lr-root">
      {/* ── Left panel ── */}
      <div className="lr-left">
        <div className="lr-left__inner">
          {/* Floating particles */}
          {mounted && PARTICLES.map(p => (
            <div key={p.id} className="lr-particle" style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }} />
          ))}

          {/* Grid overlay */}
          <div className="lr-grid" />

          {/* Content */}
          <div className="lr-left__content">
            <div className="lr-logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="12" fill="rgba(255,255,255,0.12)" />
                <rect x="1" y="1" width="38" height="38" rx="11" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <path d="M10 13h10a8 8 0 010 14H10V13z" fill="#fff" opacity="0.95" />
                <rect x="23" y="20" width="7" height="7" rx="3" fill="#fff" opacity="0.5" />
              </svg>
            </div>

            <div className="lr-left__text">
              <h2 className="lr-left__heading">
                The Kenyan<br />
                <span className="lr-left__accent">Digital Marketplace</span>
              </h2>
              <p className="lr-left__desc">
                One platform for software, themes, code, graphics and more — built for African businesses.
              </p>
            </div>

            {/* Feature list */}
            <ul className="lr-features">
              {[
                { icon: "⚡", text: "Instant M-Pesa payments" },
                { icon: "🛡️", text: "Secure, verified products" },
                { icon: "📦", text: "6 software products & growing" },
                { icon: "🤝", text: "Dedicated support team" },
              ].map((f, i) => (
                <li key={i} className="lr-feature" style={{ animationDelay: `${0.1 * i + 0.4}s` }}>
                  <span className="lr-feature__icon">{f.icon}</span>
                  <span className="lr-feature__text">{f.text}</span>
                </li>
              ))}
            </ul>

            {/* Testimonial */}
            <div className="lr-testimonial">
              <div className="lr-testimonial__avatar">DN</div>
              <div>
                <p className="lr-testimonial__quote">"Built for Kenya, trusted by thousands."</p>
                <p className="lr-testimonial__author">Daniel Ngwasi · Founder, Dantechdevs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="lr-right">
        <div className="lr-form-wrap">
          {/* Mobile brand */}
          <div className="lr-mobile-brand">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill={R} />
              <path d="M10 13h10a8 8 0 010 14H10V13z" fill="#fff" opacity="0.95" />
              <rect x="23" y="20" width="7" height="7" rx="3" fill="#fff" opacity="0.5" />
            </svg>
            <span className="lr-mobile-brand__name">Dantechdevs</span>
          </div>

          <div className="lr-form-header">
            <div className="lr-fingerprint">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                <path d="M2 12a10 10 0 0 1 18-6" />
                <path d="M2 16h.01" />
                <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
              </svg>
            </div>
            <h1 className="lr-title">Welcome back</h1>
            <p className="lr-subtitle">Sign in to access your dashboard</p>
          </div>

          {/* Google */}
          <button className="lr-google" onClick={handleGoogle} type="button">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" />
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" />
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z" />
            </svg>
            Continue with Google
          </button>

          <div className="lr-divider"><span>or continue with email</span></div>

          {/* Form */}
          <form onSubmit={handleLogin} className="lr-form">
            {/* Email */}
            <div className={`lr-field ${focused === "email" ? "lr-field--on" : ""}`}>
              <label className="lr-label" htmlFor="lr-email">Email address</label>
              <div className="lr-input-wrap">
                <span className="lr-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="lr-email" type="email" className="lr-input"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className={`lr-field ${focused === "password" ? "lr-field--on" : ""}`}>
              <div className="lr-label-row">
                <label className="lr-label" htmlFor="lr-pass">Password</label>
                <Link href="/auth/forgot-password" className="lr-forgot">Forgot password?</Link>
              </div>
              <div className="lr-input-wrap">
                <span className="lr-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  id="lr-pass" type={showPass ? "text" : "password"}
                  className="lr-input lr-input--pass"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required autoComplete="current-password"
                />
                <button type="button" className="lr-eye"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1} aria-label="Toggle password">
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="lr-error" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="lr-btn" disabled={loading}>
              {loading ? (
                <><span className="lr-spinner" />Signing in…</>
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Security badge */}
          <div className="lr-secure">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            256-bit SSL encryption · Your data is safe
          </div>

          <p className="lr-footer">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="lr-link">Create one free →</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Layout ── */
        .lr-root {
          min-height: 100vh; display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #07070d;
        }

        /* ── Left ── */
        .lr-left {
          width: 44%; flex-shrink: 0;
          background: linear-gradient(145deg, #0f0f1a 0%, #150a1a 50%, #0a0f1a 100%);
          position: relative; overflow: hidden;
          display: none;
        }
        @media (min-width: 900px) { .lr-left { display: flex; } }

        .lr-left__inner {
          width: 100%; display: flex; align-items: center; justify-content: center;
          padding: 60px 50px; position: relative;
        }

        /* Grid */
        .lr-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(232,50,90,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,50,90,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* Particles */
        .lr-particle {
          position: absolute; border-radius: 50%;
          background: ${R}; opacity: 0.35;
          animation: particleFloat linear infinite;
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0)   scale(1);   opacity: 0.35; }
          50%  { transform: translateY(-30px) scale(1.2); opacity: 0.6; }
          100% { transform: translateY(0)   scale(1);   opacity: 0.35; }
        }

        /* Left accent glow */
        .lr-left::after {
          content:''; position:absolute;
          width: 350px; height: 350px; border-radius: 50%;
          background: radial-gradient(circle, ${R}30 0%, transparent 70%);
          top: -80px; right: -80px; pointer-events: none;
        }
        .lr-left::before {
          content:''; position:absolute;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, #3b4de820 0%, transparent 70%);
          bottom: -60px; left: -60px; pointer-events: none;
        }

        .lr-left__content { position: relative; z-index: 1; max-width: 360px; }

        .lr-logo {
          margin-bottom: 40px;
          filter: drop-shadow(0 8px 24px rgba(232,50,90,0.3));
        }
        .lr-left__heading {
          font-family: 'Syne', sans-serif; font-size: 34px;
          font-weight: 800; color: #fff; line-height: 1.15;
          letter-spacing: -0.5px; margin-bottom: 16px;
        }
        .lr-left__accent {
          background: linear-gradient(135deg, ${R}, #ff6b8a);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lr-left__desc {
          font-size: 14px; color: rgba(255,255,255,0.45);
          line-height: 1.65; margin-bottom: 36px;
        }

        .lr-features { list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
        .lr-feature {
          display: flex; align-items: center; gap: 12px;
          animation: featureIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes featureIn {
          from { opacity:0; transform: translateX(-12px); }
          to   { opacity:1; transform: translateX(0); }
        }
        .lr-feature__icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: rgba(232,50,90,0.12); border: 1px solid rgba(232,50,90,0.2);
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .lr-feature__text { font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 500; }

        .lr-testimonial {
          display: flex; gap: 12px; align-items: flex-start;
          padding: 16px; border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .lr-testimonial__avatar {
          width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, ${R}, #ff6b8a);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 12px; color: #fff;
          font-family: 'Syne', sans-serif;
        }
        .lr-testimonial__quote { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.5; font-style: italic; margin-bottom: 4px; }
        .lr-testimonial__author { font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 600; }

        /* ── Right ── */
        .lr-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 40px 24px;
          background: #07070d;
          position: relative;
        }
        .lr-right::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,50,90,0.06) 0%, transparent 60%);
        }

        .lr-form-wrap {
          width: 100%; max-width: 400px; position: relative; z-index: 1;
          animation: formIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes formIn {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* Mobile brand */
        .lr-mobile-brand {
          display: flex; align-items: center; gap: 10px; margin-bottom: 32px;
        }
        .lr-mobile-brand__name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 18px; color: ${R};
        }
        @media (min-width: 900px) { .lr-mobile-brand { display: none; } }

        .lr-form-header { margin-bottom: 28px; }
        .lr-fingerprint {
          width: 64px; height: 64px; border-radius: 18px;
          background: rgba(232,50,90,0.1);
          border: 1px solid rgba(232,50,90,0.2);
          display: flex; align-items: center; justify-content: center;
          color: ${R}; margin-bottom: 20px;
          animation: fpPulse 3s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(232,50,90,0.3);
        }
        @keyframes fpPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(232,50,90,0.25); }
          50%      { box-shadow: 0 0 0 10px rgba(232,50,90,0); }
        }
        .lr-title {
          font-family: 'Syne', sans-serif; font-size: 28px;
          font-weight: 800; color: #fff; letter-spacing: -0.5px; margin-bottom: 6px;
        }
        .lr-subtitle { font-size: 14px; color: rgba(255,255,255,0.38); }

        /* Google */
        .lr-google {
          width: 100%; padding: 13px 16px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.8); font-size: 14px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 10px;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
          margin-bottom: 20px;
        }
        .lr-google:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        /* Divider */
        .lr-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 22px; color: rgba(255,255,255,0.18); font-size: 12px;
        }
        .lr-divider::before, .lr-divider::after {
          content:''; flex:1; height:1px; background: rgba(255,255,255,0.07);
        }

        /* Fields */
        .lr-form  { display: flex; flex-direction: column; gap: 18px; }
        .lr-field { display: flex; flex-direction: column; gap: 7px; }
        .lr-label-row { display: flex; align-items: center; justify-content: space-between; }
        .lr-label {
          font-size: 12px; font-weight: 600; letter-spacing: 0.6px;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          transition: color 0.2s;
        }
        .lr-field--on .lr-label { color: ${R}; }
        .lr-forgot { font-size: 12px; color: rgba(255,255,255,0.3); text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .lr-forgot:hover { color: ${R}; }

        .lr-input-wrap { position: relative; }
        .lr-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.25); display: flex; pointer-events: none;
          transition: color 0.2s;
        }
        .lr-field--on .lr-input-icon { color: ${R}; }

        .lr-input {
          width: 100%; padding: 13px 16px 13px 42px; border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #fff; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .lr-input--pass { padding-right: 48px; }
        .lr-input:focus {
          border-color: ${R};
          background: rgba(232,50,90,0.06);
          box-shadow: 0 0 0 4px rgba(232,50,90,0.1);
        }
        .lr-input::placeholder { color: rgba(255,255,255,0.15); }

        .lr-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.25); padding: 4px;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .lr-eye:hover { color: rgba(255,255,255,0.6); }

        /* Error */
        .lr-error {
          background: rgba(232,50,90,0.1); border: 1px solid rgba(232,50,90,0.25);
          border-radius: 10px; padding: 11px 14px; font-size: 13px; color: ${R};
          display: flex; align-items: center; gap: 8px;
        }

        /* Button */
        .lr-btn {
          padding: 14px 20px; border-radius: 12px; margin-top: 4px;
          background: linear-gradient(135deg, ${R} 0%, ${RD} 100%);
          color: #fff; border: none; font-size: 15px; font-weight: 700;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s; letter-spacing: 0.2px;
          box-shadow: 0 4px 24px rgba(232,50,90,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          position: relative; overflow: hidden;
        }
        .lr-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .lr-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 36px rgba(232,50,90,0.55);
        }
        .lr-btn:active:not(:disabled) { transform: translateY(0); }
        .lr-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .lr-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Security */
        .lr-secure {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 18px; font-size: 11px; color: rgba(255,255,255,0.2);
          font-weight: 500;
        }

        /* Footer */
        .lr-footer { text-align: center; font-size: 14px; color: rgba(255,255,255,0.35); margin-top: 24px; }
        .lr-link { color: ${R}; font-weight: 600; text-decoration: none; }
        .lr-link:hover { text-decoration: underline; }

        @media (max-width: 480px) {
          .lr-right { padding: 32px 20px; }
          .lr-title { font-size: 24px; }
        }
      `}</style>
    </main>
  );
}