/**
 * ─────────────────────────────────────────────
 * STAGE 4b — Register Page
 * File: app/auth/register/page.tsx
 * ─────────────────────────────────────────────
 * Features:
 * - Name, email, phone, password
 * - Role selection: buyer or seller
 * - M-Pesa number field for sellers
 * - Redirects to dashboard on success
 * ─────────────────────────────────────────────
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const RED = "#e8325a";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    role: "buyer" as "buyer" | "seller", mpesa_number: "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // 1. Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email:    form.email.trim(),
      password: form.password,
      options:  { data: { name: form.name.trim() } },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Registration failed.");
      setLoading(false);
      return;
    }

    // 2. Update profile with extra fields
    const { error: profileError } = await supabase
      .from("users")
      .update({
        name:         form.name.trim(),
        phone:        form.phone.trim() || null,
        role:         form.role,
        mpesa_number: form.role === "seller" ? form.mpesa_number.trim() : null,
      })
      .eq("id", data.user.id);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="auth-root">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand__name">Dantechdevs</span>
          <span className="auth-brand__tag">Code The Future</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join the Kenyan digital marketplace</p>

        <form onSubmit={handleRegister} className="auth-form">

          {/* Role toggle */}
          <div className="auth-role-toggle">
            <button
              type="button"
              className={`auth-role-btn${form.role === "buyer" ? " auth-role-btn--active" : ""}`}
              onClick={() => setForm({ ...form, role: "buyer" })}
            >
              👤 I&apos;m a Buyer
            </button>
            <button
              type="button"
              className={`auth-role-btn${form.role === "seller" ? " auth-role-btn--active" : ""}`}
              onClick={() => setForm({ ...form, role: "seller" })}
            >
              🛍️ I&apos;m a Seller
            </button>
          </div>

          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              type="text" className="auth-input" placeholder="Daniel Kamau"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              required autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email" className="auth-input" placeholder="you@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              required autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Phone (optional)</label>
            <input
              type="tel" className="auth-input" placeholder="+254 7XX XXX XXX"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              autoComplete="tel"
            />
          </div>

          {/* M-Pesa number — only for sellers */}
          {form.role === "seller" && (
            <div className="auth-field">
              <label className="auth-label">M-Pesa Number (for withdrawals)</label>
              <input
                type="tel" className="auth-input" placeholder="+254 7XX XXX XXX"
                value={form.mpesa_number}
                onChange={e => setForm({ ...form, mpesa_number: e.target.value })}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password" className="auth-input" placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              required autoComplete="new-password"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input
              type="password" className="auth-input" placeholder="••••••••"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required autoComplete="new-password"
            />
          </div>

          {error && <div className="auth-error" role="alert">⚠ {error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? <><span className="auth-spinner" /> Creating account…</>
              : "Create Account 🚀"
            }
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/auth/login" className="auth-link">Sign in</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .auth-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #0f0f13; font-family: 'DM Sans', sans-serif; padding: 24px;
        }
        .auth-card {
          width: 100%; max-width: 440px; background: #1a1a22;
          border: 1px solid rgba(255,255,255,0.07); border-radius: 24px;
          padding: 40px 36px; animation: authFadeUp 0.4s ease both;
        }
        @keyframes authFadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .auth-brand { margin-bottom: 24px; }
        .auth-brand__name { display: block; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: ${RED}; }
        .auth-brand__tag  { display: block; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .auth-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 6px; }
        .auth-sub   { font-size: 14px; color: rgba(255,255,255,0.4); margin-bottom: 24px; }

        .auth-role-toggle { display: flex; gap: 8px; margin-bottom: 4px; }
        .auth-role-btn {
          flex: 1; padding: 10px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .auth-role-btn--active { background: rgba(232,50,90,0.15); color: ${RED}; border-color: rgba(232,50,90,0.4); }

        .auth-form  { display: flex; flex-direction: column; gap: 14px; }
        .auth-field { display: flex; flex-direction: column; gap: 6px; }
        .auth-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); }
        .auth-input {
          padding: 12px 16px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04); color: #fff;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .auth-input:focus { border-color: ${RED}; }
        .auth-input::placeholder { color: rgba(255,255,255,0.2); }
        .auth-error {
          background: rgba(232,50,90,0.1); border: 1px solid rgba(232,50,90,0.3);
          border-radius: 10px; padding: 11px 14px; font-size: 13px; color: ${RED};
        }
        .auth-btn {
          padding: 14px; border-radius: 12px; background: ${RED};
          color: #fff; border: none; font-size: 15px; font-weight: 700;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(232,50,90,0.35); margin-top: 4px;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-footer { text-align: center; font-size: 14px; color: rgba(255,255,255,0.4); margin-top: 24px; }
        .auth-link   { color: ${RED}; font-weight: 600; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }

        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px; }
        }
      `}</style>
    </main>
  );
}
