"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const R = "#e8325a";
const RD = "#c41e45";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Supabase automatically handles the token from the URL hash
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setValidSession(true);
      }
      setChecking(false);
    });
  }, []);

  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  };

  if (checking) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07070d" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(232,50,90,0.2)", borderTopColor: R, animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    );
  }

  return (
    <main className="rp-root">
      <div className="rp-blob rp-blob--1" />
      <div className="rp-blob rp-blob--2" />

      <div className="rp-card">
        {/* Brand */}
        <div className="rp-brand">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="11" fill={R} />
            <path d="M10 13h10a8 8 0 010 14H10V13z" fill="#fff" opacity="0.95" />
            <rect x="23" y="20" width="7" height="7" rx="3" fill="#fff" opacity="0.5" />
          </svg>
          <div>
            <span className="rp-brand__name">Dantechdevs</span>
            <span className="rp-brand__tag">CODE THE FUTURE</span>
          </div>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 className="rp-title">Password updated!</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
              Redirecting you to the dashboard…
            </p>
          </div>
        ) : !validSession ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 className="rp-title">Link expired</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 8, marginBottom: 24 }}>
              This reset link has expired or already been used.
            </p>
            <Link href="/auth/forgot-password" className="rp-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              Request a new link →
            </Link>
          </div>
        ) : (
          <>
            <div className="rp-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="rp-title">Set new password</h1>
            <p className="rp-sub">Choose a strong password for your account.</p>

            <form onSubmit={handleSubmit} className="rp-form">
              {/* New password */}
              <div className={`rp-field ${focused === "pass" ? "rp-field--on" : ""}`}>
                <label className="rp-label">New Password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPass ? "text" : "password"}
                    className="rp-input rp-input--pass"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    required autoComplete="new-password"
                  />
                  <button type="button" className="rp-eye" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                    {showPass
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
                {/* Strength meter */}
                {password && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= score ? strengthColors[score] : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: strengthColors[score], fontWeight: 600 }}>{strengthLabels[score]}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className={`rp-field ${focused === "conf" ? "rp-field--on" : ""}`}>
                <label className="rp-label">Confirm Password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showConf ? "text" : "password"}
                    className="rp-input rp-input--pass"
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onFocus={() => setFocused("conf")}
                    onBlur={() => setFocused(null)}
                    required autoComplete="new-password"
                  />
                  <button type="button" className="rp-eye" onClick={() => setShowConf(p => !p)} tabIndex={-1}>
                    {showConf
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
                {confirm && (
                  <p style={{ fontSize: 11, marginTop: 5, fontWeight: 600, color: password === confirm ? "#22c55e" : "#ef4444" }}>
                    {password === confirm ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {error && (
                <div className="rp-error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="rp-btn" disabled={loading}>
                {loading ? <><span className="rp-spinner" />Updating password…</> : <>Update Password 🔐</>}
              </button>
            </form>

            <div className="rp-secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              256-bit SSL · Your data is encrypted and safe
            </div>
          </>
        )}

        <p className="rp-footer">
          <Link href="/auth/login" className="rp-link">← Back to Sign In</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .rp-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #07070d; font-family: 'DM Sans', sans-serif; padding: 32px 20px; position: relative; overflow: hidden; }
        .rp-blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; opacity: 0.15; }
        .rp-blob--1 { width: 480px; height: 480px; background: ${R}; top: -140px; right: -120px; animation: blob 9s ease-in-out infinite; }
        .rp-blob--2 { width: 380px; height: 380px; background: #3b4de8; bottom: -100px; left: -100px; animation: blob 11s ease-in-out infinite reverse; }
        @keyframes blob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(20px,-20px)scale(1.06)} }
        .rp-card { width: 100%; max-width: 420px; background: rgba(18,18,28,0.9); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 38px 36px; position: relative; z-index: 1; backdrop-filter: blur(20px); box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7); animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .rp-brand { display: flex; align-items: center; gap: 11px; margin-bottom: 28px; }
        .rp-brand__name { display: block; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: ${R}; }
        .rp-brand__tag  { display: block; font-size: 9px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-top: 1px; }
        .rp-icon-wrap { width: 58px; height: 58px; border-radius: 16px; background: rgba(232,50,90,0.1); border: 1px solid rgba(232,50,90,0.2); display: flex; align-items: center; justify-content: center; color: ${R}; margin-bottom: 20px; animation: fpPulse 3s ease-in-out infinite; }
        @keyframes fpPulse { 0%,100%{box-shadow:0 0 0 0 rgba(232,50,90,0.25)} 50%{box-shadow:0 0 0 10px rgba(232,50,90,0)} }
        .rp-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#fff; letter-spacing:-0.4px; margin-bottom:8px; }
        .rp-sub   { font-size:13px; color:rgba(255,255,255,0.35); margin-bottom:26px; line-height:1.6; }
        .rp-form  { display:flex; flex-direction:column; gap:16px; }
        .rp-field { display:flex; flex-direction:column; gap:6px; }
        .rp-label { font-size:11px; font-weight:700; letter-spacing:0.7px; text-transform:uppercase; color:rgba(255,255,255,0.35); transition:color 0.2s; }
        .rp-field--on .rp-label { color:${R}; }
        .rp-input-wrap { position:relative; display:flex; align-items:center; border:1.5px solid rgba(255,255,255,0.08); border-radius:12px; background:rgba(255,255,255,0.04); transition:all 0.2s; }
        .rp-field--on .rp-input-wrap { border-color:${R}; background:rgba(232,50,90,0.06); box-shadow:0 0 0 4px rgba(232,50,90,0.1); }
        .rp-input-icon { position:absolute; left:14px; color:rgba(255,255,255,0.25); display:flex; pointer-events:none; }
        .rp-input { width:100%; padding:12px 16px 12px 42px; border-radius:12px; border:none; background:transparent; color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; }
        .rp-input--pass { padding-right:44px; }
        .rp-input::placeholder { color:rgba(255,255,255,0.15); }
        .rp-eye { position:absolute; right:13px; background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.25); padding:4px; display:flex; align-items:center; transition:color 0.2s; }
        .rp-eye:hover { color:rgba(255,255,255,0.6); }
        .rp-error { background:rgba(232,50,90,0.1); border:1px solid rgba(232,50,90,0.25); border-radius:10px; padding:11px 14px; font-size:13px; color:${R}; display:flex; align-items:center; gap:8px; }
        .rp-btn { padding:13px 20px; border-radius:12px; margin-top:4px; background:linear-gradient(135deg,${R} 0%,${RD} 100%); color:#fff; border:none; font-size:14px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s; box-shadow:0 4px 24px rgba(232,50,90,0.4), inset 0 1px 0 rgba(255,255,255,0.15); }
        .rp-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(232,50,90,0.5); }
        .rp-btn:disabled { opacity:0.55; cursor:not-allowed; }
        .rp-spinner { width:15px; height:15px; border-radius:50%; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; animation:spin 0.7s linear infinite; display:inline-block; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .rp-secure { display:flex; align-items:center; justify-content:center; gap:6px; font-size:11px; color:rgba(255,255,255,0.18); font-weight:500; margin-top:20px; }
        .rp-footer { text-align:center; font-size:14px; color:rgba(255,255,255,0.3); margin-top:24px; }
        .rp-link   { color:${R}; font-weight:600; text-decoration:none; }
        .rp-link:hover { text-decoration:underline; }
        @media(max-width:480px){ .rp-card{padding:28px 20px;} .rp-title{font-size:22px;} }
      `}</style>
    </main>
  );
}
