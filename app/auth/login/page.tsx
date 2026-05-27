/**
 * ─────────────────────────────────────────────
 * STAGE 4 — Login Page
 * File: app/auth/login/page.tsx
 * ─────────────────────────────────────────────
 * Features:
 * - Email + password login
 * - Google OAuth login
 * - Redirects to dashboard on success
 * - Shows errors inline
 * - Link to register page
 * ─────────────────────────────────────────────
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const RED = "#e8325a";

export default function LoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email:    form.email.trim(),
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
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand__name">Dantechdevs</span>
          <span className="auth-brand__tag">Code The Future</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>

        {/* Google */}
        <button className="auth-google" onClick={handleGoogle} type="button">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">⚠ {error}</div>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? <><span className="auth-spinner" /> Signing in…</> : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="auth-link">Create one</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .auth-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #0f0f13;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }
        .auth-card {
          width: 100%; max-width: 420px;
          background: #1a1a22;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 40px 36px;
          animation: authFadeUp 0.4s ease both;
        }
        @keyframes authFadeUp {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .auth-brand { margin-bottom: 28px; }
        .auth-brand__name { display: block; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: ${RED}; }
        .auth-brand__tag  { display: block; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .auth-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 6px; }
        .auth-sub   { font-size: 14px; color: rgba(255,255,255,0.4); margin-bottom: 28px; }

        .auth-google {
          width: 100%; padding: 12px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8);
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, border-color 0.2s;
        }
        .auth-google:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0; color: rgba(255,255,255,0.2); font-size: 13px;
        }
        .auth-divider::before, .auth-divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
        }

        .auth-form  { display: flex; flex-direction: column; gap: 16px; }
        .auth-field { display: flex; flex-direction: column; gap: 6px; }
        .auth-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5); }
        .auth-input {
          padding: 13px 16px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #fff; font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .auth-input:focus { border-color: ${RED}; }
        .auth-input::placeholder { color: rgba(255,255,255,0.2); }

        .auth-error {
          background: rgba(232,50,90,0.1); border: 1px solid rgba(232,50,90,0.3);
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; color: ${RED};
        }
        .auth-btn {
          padding: 14px; border-radius: 12px;
          background: ${RED}; color: #fff; border: none;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(232,50,90,0.35);
          margin-top: 4px;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-footer { text-align: center; font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 24px; }
        .auth-link   { color: ${RED}; font-weight: 600; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </main>
  );
}
