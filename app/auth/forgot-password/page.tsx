"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const R = "#e8325a";
const RD = "#c41e45";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  };

  return (
    <main className="fp-root">
      <div className="fp-blob fp-blob--1" />
      <div className="fp-blob fp-blob--2" />

      <div className="fp-card">
        {/* Brand */}
        <div className="fp-brand">
          <div className="fp-brand__logo">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="11" fill={R} />
              <path d="M10 13h10a8 8 0 010 14H10V13z" fill="#fff" opacity="0.95" />
              <rect x="23" y="20" width="7" height="7" rx="3" fill="#fff" opacity="0.5" />
            </svg>
          </div>
          <div>
            <span className="fp-brand__name">Dantechdevs</span>
            <span className="fp-brand__tag">CODE THE FUTURE</span>
          </div>
        </div>

        {sent ? (
          /* ── Success state ── */
          <div className="fp-success">
            <div className="fp-success__icon">📬</div>
            <h1 className="fp-title">Check your email</h1>
            <p className="fp-sub">
              We sent a password reset link to{" "}
              <strong style={{ color: R }}>{email}</strong>.
              Check your inbox and click the link to reset your password.
            </p>
            <div className="fp-success__note">
              Didn't receive it? Check your spam folder or{" "}
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                style={{ background: "none", border: "none", color: R, cursor: "pointer", fontWeight: 700, fontSize: "inherit", fontFamily: "inherit" }}
              >
                try again
              </button>.
            </div>
            <Link href="/auth/login" className="fp-btn" style={{ marginTop: 8, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              ← Back to Sign In
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="fp-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>

            <h1 className="fp-title">Forgot password?</h1>
            <p className="fp-sub">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="fp-form">
              <div className={`fp-field ${focused ? "fp-field--on" : ""}`}>
                <label className="fp-label" htmlFor="fp-email">Email address</label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="fp-email"
                    type="email"
                    className="fp-input"
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="fp-error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? (
                  <><span className="fp-spinner" />Sending reset link…</>
                ) : (
                  <>Send Reset Link →</>
                )}
              </button>
            </form>

            <div className="fp-secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              256-bit SSL · Your data is encrypted and safe
            </div>
          </>
        )}

        <p className="fp-footer">
          Remember your password?{" "}
          <Link href="/auth/login" className="fp-link">Sign in →</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .fp-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #07070d; font-family: 'DM Sans', sans-serif;
          padding: 32px 20px; position: relative; overflow: hidden;
        }
        .fp-blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; opacity: 0.15;
        }
        .fp-blob--1 { width: 480px; height: 480px; background: ${R}; top: -140px; right: -120px; animation: blob 9s ease-in-out infinite; }
        .fp-blob--2 { width: 380px; height: 380px; background: #3b4de8; bottom: -100px; left: -100px; animation: blob 11s ease-in-out infinite reverse; }
        @keyframes blob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(20px,-20px)scale(1.06)} }

        .fp-card {
          width: 100%; max-width: 420px;
          background: rgba(18,18,28,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 38px 36px;
          position: relative; z-index: 1;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7);
          animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .fp-brand { display: flex; align-items: center; gap: 11px; margin-bottom: 28px; }
        .fp-brand__logo { filter: drop-shadow(0 4px 12px rgba(232,50,90,0.35)); flex-shrink: 0; }
        .fp-brand__name { display: block; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: ${R}; }
        .fp-brand__tag  { display: block; font-size: 9px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-top: 1px; }

        .fp-icon-wrap {
          width: 58px; height: 58px; border-radius: 16px;
          background: rgba(232,50,90,0.1); border: 1px solid rgba(232,50,90,0.2);
          display: flex; align-items: center; justify-content: center;
          color: ${R}; margin-bottom: 20px;
          animation: fpPulse 3s ease-in-out infinite;
        }
        @keyframes fpPulse {
          0%,100%{box-shadow:0 0 0 0 rgba(232,50,90,0.25)}
          50%{box-shadow:0 0 0 10px rgba(232,50,90,0)}
        }

        .fp-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#fff; letter-spacing:-0.4px; margin-bottom:8px; }
        .fp-sub   { font-size:13px; color:rgba(255,255,255,0.35); margin-bottom:26px; line-height:1.6; }

        .fp-form  { display:flex; flex-direction:column; gap:16px; }
        .fp-field { display:flex; flex-direction:column; gap:6px; }
        .fp-label { font-size:11px; font-weight:700; letter-spacing:0.7px; text-transform:uppercase; color:rgba(255,255,255,0.35); transition:color 0.2s; }
        .fp-field--on .fp-label { color:${R}; }

        .fp-input-wrap { position:relative; display:flex; align-items:center; }
        .fp-input-icon { position:absolute; left:14px; color:rgba(255,255,255,0.25); display:flex; pointer-events:none; transition:color 0.2s; }
        .fp-field--on .fp-input-icon { color:${R}; }
        .fp-input {
          width:100%; padding:12px 16px 12px 42px; border-radius:12px;
          border:1.5px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04);
          color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.2s;
        }
        .fp-input::placeholder { color:rgba(255,255,255,0.15); }
        .fp-input:focus { border-color:${R}; background:rgba(232,50,90,0.06); box-shadow:0 0 0 4px rgba(232,50,90,0.1); }

        .fp-error {
          background:rgba(232,50,90,0.1); border:1px solid rgba(232,50,90,0.25);
          border-radius:10px; padding:11px 14px; font-size:13px; color:${R};
          display:flex; align-items:center; gap:8px;
        }

        .fp-btn {
          padding:13px 20px; border-radius:12px; margin-top:4px;
          background:linear-gradient(135deg,${R} 0%,${RD} 100%);
          color:#fff; border:none; font-size:14px; font-weight:700;
          cursor:pointer; font-family:'DM Sans',sans-serif;
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:all 0.2s; letter-spacing:0.2px;
          box-shadow:0 4px 24px rgba(232,50,90,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .fp-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(232,50,90,0.5); }
        .fp-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .fp-spinner {
          width:15px; height:15px; border-radius:50%;
          border:2px solid rgba(255,255,255,0.3); border-top-color:#fff;
          animation:spin 0.7s linear infinite; display:inline-block;
        }
        @keyframes spin { to{transform:rotate(360deg)} }

        .fp-secure {
          display:flex; align-items:center; justify-content:center; gap:6px;
          font-size:11px; color:rgba(255,255,255,0.18); font-weight:500; margin-top:20px;
        }

        /* Success state */
        .fp-success { display:flex; flex-direction:column; gap:12px; }
        .fp-success__icon { font-size:48px; margin-bottom:4px; animation:fadeUp 0.4s ease; }
        .fp-success__note { font-size:12px; color:rgba(255,255,255,0.25); line-height:1.6; margin-top:4px; }

        .fp-footer { text-align:center; font-size:14px; color:rgba(255,255,255,0.3); margin-top:24px; }
        .fp-link   { color:${R}; font-weight:600; text-decoration:none; }
        .fp-link:hover { text-decoration:underline; }

        @media(max-width:480px){
          .fp-card{padding:28px 20px;}
          .fp-title{font-size:22px;}
        }
      `}</style>
    </main>
  );
}
