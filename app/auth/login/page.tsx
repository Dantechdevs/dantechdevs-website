/**
 * ─────────────────────────────────────────────
 * STAGE 4 — Login Page (Improved)
 * File: app/auth/login/page.tsx
 * ─────────────────────────────────────────────
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const RED = "#e8325a";
const RED_DK = "#c41e45";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <main className="auth-root">
      {/* Background glow blobs */}
      <div className="auth-blob auth-blob--1" />
      <div className="auth-blob auth-blob--2" />

      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand__logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill={RED} />
              <path d="M7 9h6a6 6 0 010 10H7V9z" fill="#fff" opacity="0.9" />
              <rect x="16" y="14" width="5" height="5" rx="2" fill="#fff" opacity="0.6" />
            </svg>
          </div>
          <div>
            <span className="auth-brand__name">Dantechdevs</span>
            <span className="auth-brand__tag">CODE THE FUTURE</span>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your account to continue</p>
        </div>

        {/* Google */}
        <button className="auth-google" onClick={handleGoogle} type="button">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" />
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" />
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z" />
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or sign in with email</span></div>

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
          {/* Email */}
          <div className={`auth-field ${focused === "email" ? "auth-field--focused" : ""}`}>
            <label className="auth-label" htmlFor="email">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
              </svg>
              Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className={`auth-field ${focused === "password" ? "auth-field--focused" : ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="auth-label" htmlFor="password">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Password
              </label>
              <Link href="/auth/forgot-password" className="auth-forgot">Forgot password?</Link>
            </div>
            <div className="auth-input-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="auth-input auth-input--pass"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPass(p => !p)}
                tabIndex={-1}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <><span className="auth-spinner" /> Signing in…</>
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

        {/* Stats strip */}
        <div className="auth-stats">
          {[["2,841", "Active users"], ["6", "Products"], ["KES 284K", "Revenue"]].map(([v, l]) => (
            <div key={l} className="auth-stat">
              <span className="auth-stat__val">{v}</span>
              <span className="auth-stat__lbl">{l}</span>
            </div>
          ))}
        </div>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="auth-link">Create one free →</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #0a0a10;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Glow blobs */
        .auth-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none; opacity: 0.18;
        }
        .auth-blob--1 {
          width: 500px; height: 500px;
          background: ${RED};
          top: -120px; right: -100px;
          animation: blobFloat 8s ease-in-out infinite;
        }
        .auth-blob--2 {
          width: 400px; height: 400px;
          background: #3b4de8;
          bottom: -100px; left: -80px;
          animation: blobFloat 10s ease-in-out infinite reverse;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(20px,-20px) scale(1.05); }
        }

        /* Card */
        .auth-card {
          width: 100%; max-width: 440px;
          background: rgba(20,20,30,0.85);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px 38px;
          position: relative; z-index: 1;
          backdrop-filter: blur(20px);
          animation: authFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.6);
        }
        @keyframes authFadeUp {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* Brand */
        .auth-brand {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 32px;
        }
        .auth-brand__logo {
          flex-shrink: 0;
          filter: drop-shadow(0 4px 12px rgba(232,50,90,0.4));
        }
        .auth-brand__name {
          display: block;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 18px; color: ${RED};
          letter-spacing: -0.3px;
        }
        .auth-brand__tag {
          display: block; font-size: 9px; font-weight: 600;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.25); margin-top: 1px;
        }

        /* Heading */
        .auth-heading { margin-bottom: 28px; }
        .auth-title {
          font-family: 'Syne', sans-serif; font-size: 30px;
          font-weight: 800; color: #fff; letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .auth-sub { font-size: 14px; color: rgba(255,255,255,0.38); line-height: 1.5; }

        /* Google */
        .auth-google {
          width: 100%; padding: 13px 16px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.82);
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          margin-bottom: 20px;
        }
        .auth-google:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }

        /* Divider */
        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
          color: rgba(255,255,255,0.18); font-size: 12px;
          letter-spacing: 0.3px;
        }
        .auth-divider::before, .auth-divider::after {
          content:''; flex:1; height:1px;
          background: rgba(255,255,255,0.07);
        }

        /* Fields */
        .auth-form  { display:flex; flex-direction:column; gap:16px; }
        .auth-field { display:flex; flex-direction:column; gap:7px; }

        .auth-label {
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.8px;
          display: flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .auth-field--focused .auth-label { color: ${RED}; }

        .auth-input-wrap { position: relative; }
        .auth-input {
          width: 100%; padding: 13px 16px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #fff; font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .auth-input--pass { padding-right: 46px; }
        .auth-input:focus {
          border-color: ${RED};
          background: rgba(232,50,90,0.05);
          box-shadow: 0 0 0 3px rgba(232,50,90,0.12);
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.18); }

        .auth-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3); padding: 4px;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .auth-eye:hover { color: rgba(255,255,255,0.7); }

        .auth-forgot {
          font-size: 12px; color: rgba(255,255,255,0.3);
          text-decoration: none; font-weight: 500;
          transition: color 0.2s;
        }
        .auth-forgot:hover { color: ${RED}; }

        /* Error */
        .auth-error {
          background: rgba(232,50,90,0.1);
          border: 1px solid rgba(232,50,90,0.25);
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; color: ${RED};
          display: flex; align-items: center; gap: 8px;
        }

        /* Button */
        .auth-btn {
          padding: 14px 20px; border-radius: 12px;
          background: linear-gradient(135deg, ${RED} 0%, ${RED_DK} 100%);
          color: #fff; border: none;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 24px rgba(232,50,90,0.4), 0 1px 0 rgba(255,255,255,0.1) inset;
          margin-top: 4px; letter-spacing: 0.2px;
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(232,50,90,0.5);
        }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .auth-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Stats strip */
        .auth-stats {
          display: flex; gap: 0;
          margin: 24px 0 0;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; overflow: hidden;
        }
        .auth-stat {
          flex: 1; padding: 12px 10px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .auth-stat:last-child { border-right: none; }
        .auth-stat__val {
          display: block; font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 800; color: ${RED};
          margin-bottom: 2px;
        }
        .auth-stat__lbl {
          display: block; font-size: 10px;
          color: rgba(255,255,255,0.25); letter-spacing: 0.3px;
        }

        /* Footer */
        .auth-footer {
          text-align: center; font-size: 14px;
          color: rgba(255,255,255,0.35); margin-top: 20px;
        }
        .auth-link { color: ${RED}; font-weight: 600; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }

        @media (max-width: 480px) {
          .auth-card { padding: 32px 24px; }
          .auth-title { font-size: 26px; }
        }
      `}</style>
    </main>
  );
}