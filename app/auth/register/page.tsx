/**
 * ─────────────────────────────────────────────
 * STAGE 4b — Register Page (Professional Redesign)
 * File: app/auth/register/page.tsx
 * ─────────────────────────────────────────────
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const R = "#e8325a";
const RD = "#c41e45";

type Role = "buyer" | "seller";

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role;
  mpesa_number: string;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 6,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

  if (!password) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i <= score ? colors[score] : "rgba(255,255,255,0.08)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[score], fontWeight: 600 }}>
        {labels[score]}
      </span>
    </div>
  );
}

function Field({
  label, icon, hint, children,
}: {
  label: string;
  icon: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rg-field">
      <label className="rg-label">
        <span className="rg-label__icon">{icon}</span>
        {label}
        {hint && <span className="rg-label__hint">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", password: "",
    confirmPassword: "", role: "buyer", mpesa_number: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1 = account info, 2 = security

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(), password: form.password,
      options: { data: { name: form.name.trim() } },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Registration failed.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("users")
      // @ts-ignore
      .update({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        role: form.role,
        mpesa_number: form.role === "seller" ? form.mpesa_number.trim() : null,
      })
      .eq("id", data.user.id);

    if (profileError) { setError(profileError.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  const iconEmail = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </svg>
  );
  const iconUser = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
  const iconPhone = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.86-.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
  const iconLock = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
  const iconMpesa = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  );
  const eyeOn = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
  const eyeOff = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  return (
    <main className="rg-root">
      <div className="rg-blob rg-blob--1" />
      <div className="rg-blob rg-blob--2" />

      <div className="rg-card">
        {/* Brand */}
        <div className="rg-brand">
          <div className="rg-brand__logo">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="11" fill={R} />
              <path d="M10 13h10a8 8 0 010 14H10V13z" fill="#fff" opacity="0.95" />
              <rect x="23" y="20" width="7" height="7" rx="3" fill="#fff" opacity="0.5" />
            </svg>
          </div>
          <div>
            <span className="rg-brand__name">Dantechdevs</span>
            <span className="rg-brand__tag">CODE THE FUTURE</span>
          </div>
        </div>

        {/* Fingerprint + heading */}
        <div className="rg-fingerprint">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
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

        <h1 className="rg-title">Create account</h1>
        <p className="rg-sub">Join the Kenyan digital marketplace</p>

        {/* Progress steps */}
        <div className="rg-steps">
          {["Account Info", "Security"].map((s, i) => (
            <div key={i} className={`rg-step ${step === i + 1 ? "rg-step--active" : step > i + 1 ? "rg-step--done" : ""}`}>
              <div className="rg-step__num">
                {step > i + 1 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : i + 1}
              </div>
              <span className="rg-step__label">{s}</span>
              {i < 1 && <div className="rg-step__line" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleRegister} className="rg-form">

          {step === 1 && (
            <>
              {/* Role toggle */}
              <div className="rg-role-wrap">
                <p className="rg-role-label">I am joining as a</p>
                <div className="rg-role-toggle">
                  {(["buyer", "seller"] as Role[]).map(r => (
                    <button key={r} type="button"
                      className={`rg-role-btn ${form.role === r ? "rg-role-btn--active" : ""}`}
                      onClick={() => setForm(f => ({ ...f, role: r }))}>
                      <span className="rg-role-btn__icon">{r === "buyer" ? "👤" : "🛍️"}</span>
                      <span className="rg-role-btn__label">
                        {r === "buyer" ? "Buyer" : "Seller"}
                      </span>
                      <span className="rg-role-btn__desc">
                        {r === "buyer" ? "Browse & purchase" : "List & earn"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Full Name" icon={iconUser}>
                <div className={`rg-input-wrap ${focused === "name" ? "rg-input-wrap--on" : ""}`}>
                  <span className="rg-input-icon">{iconUser}</span>
                  <input className="rg-input" type="text" placeholder="Daniel Kamau"
                    value={form.name} onChange={set("name")}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    required autoComplete="name" />
                </div>
              </Field>

              <Field label="Email Address" icon={iconEmail}>
                <div className={`rg-input-wrap ${focused === "email" ? "rg-input-wrap--on" : ""}`}>
                  <span className="rg-input-icon">{iconEmail}</span>
                  <input className="rg-input" type="email" placeholder="you@email.com"
                    value={form.email} onChange={set("email")}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    required autoComplete="email" />
                </div>
              </Field>

              <Field label="Phone" icon={iconPhone} hint="optional">
                <div className={`rg-input-wrap ${focused === "phone" ? "rg-input-wrap--on" : ""}`}>
                  <span className="rg-input-icon">{iconPhone}</span>
                  <input className="rg-input" type="tel" placeholder="+254 7XX XXX XXX"
                    value={form.phone} onChange={set("phone")}
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                    autoComplete="tel" />
                </div>
              </Field>

              {form.role === "seller" && (
                <Field label="M-Pesa Number" icon={iconMpesa} hint="for withdrawals">
                  <div className={`rg-input-wrap ${focused === "mpesa" ? "rg-input-wrap--on" : ""}`}>
                    <span className="rg-input-icon">{iconMpesa}</span>
                    <input className="rg-input" type="tel" placeholder="+254 7XX XXX XXX"
                      value={form.mpesa_number} onChange={set("mpesa_number")}
                      onFocus={() => setFocused("mpesa")} onBlur={() => setFocused(null)}
                      required />
                  </div>
                  <p className="rg-field-note">💚 Withdrawals processed via M-Pesa within 24hrs</p>
                </Field>
              )}

              <button type="button" className="rg-btn"
                onClick={() => {
                  if (!form.name || !form.email) { setError("Please fill in your name and email."); return; }
                  setError(""); setStep(2);
                }}>
                Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Password" icon={iconLock}>
                <div className={`rg-input-wrap ${focused === "pass" ? "rg-input-wrap--on" : ""}`}>
                  <span className="rg-input-icon">{iconLock}</span>
                  <input className="rg-input rg-input--pass"
                    type={showPass ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={form.password} onChange={set("password")}
                    onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)}
                    required autoComplete="new-password" />
                  <button type="button" className="rg-eye" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                    {showPass ? eyeOff : eyeOn}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </Field>

              <Field label="Confirm Password" icon={iconLock}>
                <div className={`rg-input-wrap ${focused === "conf" ? "rg-input-wrap--on" : ""}`}>
                  <span className="rg-input-icon">{iconLock}</span>
                  <input className="rg-input rg-input--pass"
                    type={showConf ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword} onChange={set("confirmPassword")}
                    onFocus={() => setFocused("conf")} onBlur={() => setFocused(null)}
                    required autoComplete="new-password" />
                  <button type="button" className="rg-eye" onClick={() => setShowConf(p => !p)} tabIndex={-1}>
                    {showConf ? eyeOff : eyeOn}
                  </button>
                </div>
                {form.confirmPassword && (
                  <p style={{
                    fontSize: 11, marginTop: 5, fontWeight: 600,
                    color: form.password === form.confirmPassword ? "#22c55e" : "#ef4444"
                  }}>
                    {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </Field>

              {error && (
                <div className="rg-error" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="rg-terms">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="rg-link">Terms</Link> and{" "}
                <Link href="/privacy" className="rg-link">Privacy Policy</Link>.
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="rg-back-btn" onClick={() => setStep(1)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button type="submit" className="rg-btn" disabled={loading} style={{ flex: 1 }}>
                  {loading
                    ? <><span className="rg-spinner" />Creating account…</>
                    : <>Create Account 🚀</>
                  }
                </button>
              </div>

              <div className="rg-secure">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                256-bit SSL · Your data is encrypted and safe
              </div>
            </>
          )}
        </form>

        {error && step === 1 && (
          <div className="rg-error" style={{ marginTop: 12 }} role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <p className="rg-footer">
          Already have an account?{" "}
          <Link href="/auth/login" className="rg-link">Sign in →</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rg-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #07070d; font-family: 'DM Sans', sans-serif;
          padding: 32px 20px; position: relative; overflow: hidden;
        }
        .rg-blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none; opacity: 0.15;
        }
        .rg-blob--1 { width: 480px; height: 480px; background: ${R}; top: -140px; right: -120px; animation: blob 9s ease-in-out infinite; }
        .rg-blob--2 { width: 380px; height: 380px; background: #3b4de8; bottom: -100px; left: -100px; animation: blob 11s ease-in-out infinite reverse; }
        @keyframes blob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(20px,-20px)scale(1.06)} }

        .rg-card {
          width: 100%; max-width: 460px;
          background: rgba(18,18,28,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 38px 36px;
          position: relative; z-index: 1;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7);
          animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        /* Brand */
        .rg-brand { display: flex; align-items: center; gap: 11px; margin-bottom: 24px; }
        .rg-brand__logo { filter: drop-shadow(0 4px 12px rgba(232,50,90,0.35)); flex-shrink: 0; }
        .rg-brand__name { display: block; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: ${R}; }
        .rg-brand__tag  { display: block; font-size: 9px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-top: 1px; }

        /* Fingerprint */
        .rg-fingerprint {
          width: 58px; height: 58px; border-radius: 16px;
          background: rgba(232,50,90,0.1); border: 1px solid rgba(232,50,90,0.2);
          display: flex; align-items: center; justify-content: center;
          color: ${R}; margin-bottom: 16px;
          animation: fpPulse 3s ease-in-out infinite;
        }
        @keyframes fpPulse {
          0%,100%{box-shadow:0 0 0 0 rgba(232,50,90,0.25)}
          50%{box-shadow:0 0 0 10px rgba(232,50,90,0)}
        }

        .rg-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#fff; letter-spacing:-0.4px; margin-bottom:5px; }
        .rg-sub   { font-size:13px; color:rgba(255,255,255,0.35); margin-bottom:22px; }

        /* Steps */
        .rg-steps { display:flex; align-items:center; gap:0; margin-bottom:24px; }
        .rg-step  { display:flex; align-items:center; gap:8px; flex:1; }
        .rg-step__num {
          width:26px; height:26px; border-radius:50%; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:11px; font-weight:800; transition:all 0.3s;
          border:1.5px solid rgba(255,255,255,0.1);
          color:rgba(255,255,255,0.3); background:transparent;
        }
        .rg-step--active .rg-step__num { border-color:${R}; color:${R}; background:rgba(232,50,90,0.1); }
        .rg-step--done   .rg-step__num { border-color:${R}; color:#fff; background:${R}; }
        .rg-step__label { font-size:12px; font-weight:600; color:rgba(255,255,255,0.25); transition:color 0.3s; white-space:nowrap; }
        .rg-step--active .rg-step__label,
        .rg-step--done   .rg-step__label { color:rgba(255,255,255,0.7); }
        .rg-step__line { flex:1; height:1px; background:rgba(255,255,255,0.08); margin:0 8px; }
        .rg-step--done .rg-step__line { background:rgba(232,50,90,0.3); }

        /* Form */
        .rg-form  { display:flex; flex-direction:column; gap:14px; }
        .rg-field { display:flex; flex-direction:column; gap:6px; }
        .rg-label {
          font-size:11px; font-weight:700; letter-spacing:0.7px;
          text-transform:uppercase; color:rgba(255,255,255,0.35);
          display:flex; align-items:center; gap:6px;
        }
        .rg-label__icon { opacity:0.5; display:flex; }
        .rg-label__hint {
          font-size:10px; font-weight:500; text-transform:none; letter-spacing:0;
          color:rgba(255,255,255,0.2); margin-left:2px;
        }

        /* Role toggle */
        .rg-role-wrap   { margin-bottom:2px; }
        .rg-role-label  { font-size:12px; color:rgba(255,255,255,0.35); margin-bottom:8px; font-weight:500; }
        .rg-role-toggle { display:flex; gap:10px; }
        .rg-role-btn {
          flex:1; padding:12px 10px; border-radius:12px;
          border:1.5px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.03);
          cursor:pointer; font-family:'DM Sans',sans-serif;
          transition:all 0.2s; text-align:center;
          display:flex; flex-direction:column; align-items:center; gap:4px;
        }
        .rg-role-btn:hover { border-color:rgba(255,255,255,0.15); background:rgba(255,255,255,0.05); }
        .rg-role-btn--active { background:rgba(232,50,90,0.1); border-color:rgba(232,50,90,0.4); }
        .rg-role-btn__icon  { font-size:20px; }
        .rg-role-btn__label { font-size:13px; font-weight:700; color:rgba(255,255,255,0.5); transition:color 0.2s; }
        .rg-role-btn--active .rg-role-btn__label { color:${R}; }
        .rg-role-btn__desc  { font-size:10px; color:rgba(255,255,255,0.25); }

        /* Input */
        .rg-input-wrap {
          position:relative; display:flex; align-items:center;
          border:1.5px solid rgba(255,255,255,0.08); border-radius:12px;
          background:rgba(255,255,255,0.04); transition:all 0.2s;
        }
        .rg-input-wrap--on {
          border-color:${R}; background:rgba(232,50,90,0.06);
          box-shadow:0 0 0 4px rgba(232,50,90,0.1);
        }
        .rg-input-icon {
          position:absolute; left:14px; color:rgba(255,255,255,0.25);
          display:flex; pointer-events:none; transition:color 0.2s;
          flex-shrink:0;
        }
        .rg-input-wrap--on .rg-input-icon { color:${R}; }
        .rg-input {
          width:100%; padding:12px 16px 12px 42px; border-radius:12px;
          border:none; background:transparent;
          color:#fff; font-size:14px;
          font-family:'DM Sans',sans-serif; outline:none;
        }
        .rg-input--pass { padding-right:44px; }
        .rg-input::placeholder { color:rgba(255,255,255,0.15); }
        .rg-eye {
          position:absolute; right:13px; background:none; border:none; cursor:pointer;
          color:rgba(255,255,255,0.25); padding:4px; display:flex; align-items:center;
          transition:color 0.2s;
        }
        .rg-eye:hover { color:rgba(255,255,255,0.6); }

        .rg-field-note { font-size:11px; color:rgba(255,255,255,0.3); margin-top:5px; }

        /* Error */
        .rg-error {
          background:rgba(232,50,90,0.1); border:1px solid rgba(232,50,90,0.25);
          border-radius:10px; padding:11px 14px; font-size:13px; color:${R};
          display:flex; align-items:center; gap:8px;
        }

        /* Terms */
        .rg-terms { font-size:12px; color:rgba(255,255,255,0.25); line-height:1.6; text-align:center; }

        /* Buttons */
        .rg-btn {
          padding:13px 20px; border-radius:12px;
          background:linear-gradient(135deg,${R} 0%,${RD} 100%);
          color:#fff; border:none; font-size:14px; font-weight:700;
          cursor:pointer; font-family:'DM Sans',sans-serif;
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition:all 0.2s; letter-spacing:0.2px;
          box-shadow:0 4px 24px rgba(232,50,90,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          position:relative; overflow:hidden;
        }
        .rg-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 60%); pointer-events:none; }
        .rg-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 32px rgba(232,50,90,0.5); }
        .rg-btn:disabled { opacity:0.55; cursor:not-allowed; }

        .rg-back-btn {
          padding:13px 16px; border-radius:12px;
          border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04);
          color:rgba(255,255,255,0.5); font-size:14px; font-weight:600;
          cursor:pointer; font-family:'DM Sans',sans-serif;
          display:flex; align-items:center; gap:6px; transition:all 0.2s;
          flex-shrink:0;
        }
        .rg-back-btn:hover { background:rgba(255,255,255,0.08); color:#fff; }

        .rg-spinner {
          width:15px; height:15px; border-radius:50%;
          border:2px solid rgba(255,255,255,0.3); border-top-color:#fff;
          animation:spin 0.7s linear infinite; display:inline-block;
        }
        @keyframes spin { to{transform:rotate(360deg)} }

        .rg-secure {
          display:flex; align-items:center; justify-content:center; gap:6px;
          font-size:11px; color:rgba(255,255,255,0.18); font-weight:500; margin-top:2px;
        }

        .rg-footer { text-align:center; font-size:14px; color:rgba(255,255,255,0.3); margin-top:20px; }
        .rg-link   { color:${R}; font-weight:600; text-decoration:none; }
        .rg-link:hover { text-decoration:underline; }

        @media(max-width:480px){
          .rg-card{padding:28px 20px;}
          .rg-title{font-size:22px;}
        }
      `}</style>
    </main>
  );
}