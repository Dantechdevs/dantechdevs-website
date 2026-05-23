"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   EMAILJS CONFIG  ←  fill these in once
   1. Sign up free at https://emailjs.com
   2. Create a service (Gmail works great)
   3. Create an email template with variables:
      {{from_name}}, {{from_contact}}, {{message}}
   4. Paste your IDs below
───────────────────────────────────────── */
const EJS_SERVICE_ID = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz789"
const EJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";   // e.g. "user_XXXXXXXXXXXXXXX"

/* ── Constants ── */
const RED = "#e8325a";
const STATS = [
    { icon: "🚀", label: "50+ Projects" },
    { icon: "⚡", label: "Fast Delivery" },
    { icon: "🕐", label: "24/7 Support" },
    { icon: "🎨", label: "Modern UI/UX" },
];
const SERVICES = [
    { icon: "🌐", title: "Web Development", desc: "Modern responsive websites and web apps." },
    { icon: "📱", title: "Mobile Apps", desc: "Android and iOS applications." },
    { icon: "🎨", title: "UI/UX Design", desc: "Beautiful interfaces and user experiences." },
    { icon: "⚙️", title: "Custom Software", desc: "Tailored systems for businesses." },
];
const FAQS = [
    { q: "How long does a website take?", a: "Most websites take 1–3 weeks depending on complexity." },
    { q: "Do you build mobile apps?", a: "Yes. We develop Android and cross-platform applications." },
    { q: "Can you redesign old websites?", a: "Absolutely. We modernize and improve existing websites." },
    { q: "What are your payment options?", a: "We accept M-Pesa, bank transfer, and card payments via Pesapal." },
];
const SOCIALS = [
    { icon: "🌐", href: "#", label: "Website" },
    { icon: "💼", href: "#", label: "LinkedIn" },
    { icon: "💻", href: "#", label: "GitHub" },
    { icon: "📘", href: "#", label: "Facebook" },
];

/* ── Validation helpers ── */
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidKEPhone = (v: string) => /^(\+254|0)[17]\d{8}$/.test(v.replace(/\s/g, ""));
const isValidContact = (v: string) => isValidEmail(v) || isValidKEPhone(v);

type FormFields = { name: string; contact: string; message: string };
type FormErrors = { name: string; contact: string; message: string };

const EMPTY_FORM: FormFields = { name: "", contact: "", message: "" };
const EMPTY_ERRS: FormErrors = { name: "", contact: "", message: "" };

/* ── Field component ── */
function Field({
    label, error, children,
}: { label: string; error: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>{label}</label>
            {children}
            {error && (
                <span style={{ fontSize: "12px", color: RED, display: "flex", alignItems: "center", gap: "4px" }}>
                    ⚠ {error}
                </span>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function ContactPage() {
    const [form, setForm] = useState<FormFields>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRS);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const ejsLoaded = useRef(false);

    /* ── Load EmailJS SDK once ── */
    useEffect(() => {
        if (ejsLoaded.current) return;
        ejsLoaded.current = true;
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        script.async = true;
        script.onload = () => {
            (window as any).emailjs.init(EJS_PUBLIC_KEY);
        };
        document.head.appendChild(script);
    }, []);

    /* ── Live validation (only for touched fields) ── */
    useEffect(() => {
        const e: FormErrors = { name: "", contact: "", message: "" };
        if (touched.name) {
            if (!form.name.trim()) e.name = "Name is required.";
            else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
        }
        if (touched.contact) {
            if (!form.contact.trim()) e.contact = "Email or phone is required.";
            else if (!isValidContact(form.contact))
                e.contact = "Enter a valid email or Kenyan phone (+254… / 07…).";
        }
        if (touched.message) {
            if (!form.message.trim()) e.message = "Message is required.";
            else if (form.message.trim().length < 10)
                e.message = "Message must be at least 10 characters.";
        }
        setErrors(e);
    }, [form, touched]);

    /* ── Validate all fields before submit ── */
    const validate = (): boolean => {
        setTouched({ name: true, contact: true, message: true });
        const e: FormErrors = { name: "", contact: "", message: "" };
        if (!form.name.trim() || form.name.trim().length < 2)
            e.name = !form.name.trim() ? "Name is required." : "Name must be at least 2 characters.";
        if (!form.contact.trim())
            e.contact = "Email or phone is required.";
        else if (!isValidContact(form.contact))
            e.contact = "Enter a valid email or Kenyan phone (+254… / 07…).";
        if (!form.message.trim() || form.message.trim().length < 10)
            e.message = !form.message.trim() ? "Message is required." : "Message must be at least 10 characters.";
        setErrors(e);
        return !e.name && !e.contact && !e.message;
    };

    /* ── Submit via EmailJS ── */
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus("sending");
        try {
            await (window as any).emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, {
                from_name: form.name.trim(),
                from_contact: form.contact.trim(),
                message: form.message.trim(),
            });
            setStatus("sent");
        } catch (err) {
            console.error("EmailJS error:", err);
            setStatus("error");
        }
    };

    /* ── Copy to clipboard helper ── */
    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    /* ── Input shared styles ── */
    const inputStyle = (hasError: boolean): React.CSSProperties => ({
        width: "100%", padding: "14px 18px",
        border: `1.5px solid ${hasError ? RED : "#e0e0e0"}`,
        borderRadius: "12px", fontSize: "15px", outline: "none",
        fontFamily: "inherit", transition: "border-color 0.2s",
        boxSizing: "border-box", background: "#fff",
    });

    const charCount = form.message.length;

    /* ════════════════════════════════════════
       RENDER
    ════════════════════════════════════════ */
    return (
        <main className="cp-root">

            {/* ── PAGE HEADER ── */}
            <section className="cp-hero">
                <div className="cp-hero__inner">
                    <p className="cp-eyebrow">Get In Touch</p>
                    <h1 className="cp-hero__title">
                        Contact <span style={{ color: RED }}>Us</span>
                    </h1>
                    <p className="cp-hero__sub">
                        Have a project in mind? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <div className="cp-stats">
                {STATS.map((s, i) => (
                    <div key={s.label} className="cp-stat" style={{ borderRight: i < STATS.length - 1 ? "1px solid #eee" : "none" }}>
                        <span className="cp-stat__icon">{s.icon}</span>
                        {s.label}
                    </div>
                ))}
            </div>

            {/* ── MAIN GRID ── */}
            <div className="cp-grid container">

                {/* LEFT — Contact Details */}
                <div className="cp-details">
                    <h2 className="cp-section-title">Contact <span style={{ color: RED }}>Details</span></h2>
                    <p className="cp-section-sub">Reach us through any of the channels below.</p>

                    {/* Info Cards */}
                    {[
                        { icon: "📍", label: "Location", value: "Nairobi, Kenya", key: "location", href: null, copyable: false },
                        { icon: "✉️", label: "Email", value: "dantechdevs@gmail.com", key: "email", href: "mailto:dantechdevs@gmail.com", copyable: true },
                        { icon: "📞", label: "Phone", value: "+254 712 328 150", key: "phone", href: "tel:+254712328150", copyable: true },
                    ].map((item) => (
                        <div key={item.label} className="cp-info-card">
                            <div className="cp-info-card__icon">{item.icon}</div>
                            <div className="cp-info-card__body">
                                <div className="cp-info-card__label">{item.label}</div>
                                {item.href ? (
                                    <a href={item.href} className="cp-info-card__value cp-link">{item.value}</a>
                                ) : (
                                    <span className="cp-info-card__value">{item.value}</span>
                                )}
                            </div>
                            {item.copyable && (
                                <button
                                    className="cp-copy-btn"
                                    onClick={() => copyToClipboard(item.value, item.key)}
                                    aria-label={`Copy ${item.label}`}
                                    title="Copy to clipboard"
                                >
                                    {copied === item.key ? "✅" : "📋"}
                                </button>
                            )}
                        </div>
                    ))}

                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/254712328150"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cp-whatsapp"
                    >
                        <span style={{ fontSize: "20px" }}>💬</span>
                        Chat on WhatsApp
                    </a>

                    {/* Business hours */}
                    <div className="cp-hours">
                        <span className="cp-hours__dot" aria-hidden="true" />
                        <span>Mon – Fri &nbsp;8 am – 6 pm <strong>EAT</strong> &nbsp;·&nbsp; Usually replies within <strong>2 hrs</strong></span>
                    </div>

                    {/* Socials */}
                    <div className="cp-socials">
                        {SOCIALS.map((s) => (
                            <a key={s.label} href={s.href} title={s.label} className="cp-social-btn" aria-label={s.label}>
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* RIGHT — Form */}
                <div className="cp-form-wrap">
                    <h2 className="cp-section-title">Send Us a <span style={{ color: RED }}>Message</span></h2>
                    <p className="cp-section-sub">Fill the form and we&apos;ll get back to you within 24 hours.</p>

                    {status === "sent" ? (
                        /* ── Success state ── */
                        <div className="cp-success">
                            <div className="cp-success__icon">✅</div>
                            <h3 className="cp-success__title">Message Sent!</h3>
                            <p className="cp-success__body">
                                Thanks <strong>{form.name}</strong>! We&apos;ll reach out to you soon.
                            </p>
                            <button
                                className="cp-btn"
                                onClick={() => { setStatus("idle"); setForm(EMPTY_FORM); setTouched({}); setErrors(EMPTY_ERRS); }}
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        /* ── Form ── */
                        <div className="cp-form">

                            <Field label="Your Name *" error={errors.name}>
                                <input
                                    type="text"
                                    placeholder="e.g. Daniel Kamau"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                                    style={inputStyle(!!errors.name)}
                                    onFocus={(e) => { if (!errors.name) e.target.style.borderColor = RED; }}
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? "err-name" : undefined}
                                    autoComplete="name"
                                />
                            </Field>

                            <Field label="Email or Phone *" error={errors.contact}>
                                <input
                                    type="text"
                                    placeholder="you@email.com  or  +254 7XX XXX XXX"
                                    value={form.contact}
                                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                                    onBlur={() => setTouched((t) => ({ ...t, contact: true }))}
                                    style={inputStyle(!!errors.contact)}
                                    onFocus={(e) => { if (!errors.contact) e.target.style.borderColor = RED; }}
                                    aria-invalid={!!errors.contact}
                                    autoComplete="email"
                                />
                            </Field>

                            <Field label="Message *" error={errors.message}>
                                <>
                                    <textarea
                                        placeholder="Tell us about your project..."
                                        value={form.message}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 500)
                                                setForm({ ...form, message: e.target.value });
                                        }}
                                        onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                                        rows={5}
                                        style={{ ...inputStyle(!!errors.message), resize: "vertical" }}
                                        onFocus={(e) => { if (!errors.message) e.target.style.borderColor = RED; }}
                                        aria-invalid={!!errors.message}
                                    />
                                    <div style={{
                                        textAlign: "right", fontSize: "12px",
                                        color: charCount >= 450 ? RED : "#aaa", marginTop: "2px",
                                    }}>
                                        {charCount}/500
                                    </div>
                                </>
                            </Field>

                            {/* Error banner */}
                            {status === "error" && (
                                <div className="cp-error-banner" role="alert">
                                    ❌ Something went wrong. Please try WhatsApp or email us directly.
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                className={`cp-btn cp-btn--full${status === "sending" ? " cp-btn--loading" : ""}`}
                                onClick={handleSubmit}
                                disabled={status === "sending"}
                                aria-busy={status === "sending"}
                            >
                                {status === "sending" ? (
                                    <><span className="cp-spinner" aria-hidden="true" /> Sending…</>
                                ) : (
                                    <>Send Message 🚀</>
                                )}
                            </button>

                            <p className="cp-form__note">
                                🔒 Your info is never shared with third parties.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── WHAT WE BUILD ── */}
            <section className="cp-services">
                <div className="container">
                    <p className="cp-eyebrow">Our Services</p>
                    <h2 className="cp-section-title">What We <span style={{ color: RED }}>Build</span></h2>
                    <p className="cp-section-sub" style={{ maxWidth: 500, margin: "0 auto 48px" }}>
                        Modern digital solutions designed for startups, businesses, and growing brands.
                    </p>
                    <div className="cp-services__grid">
                        {SERVICES.map((s) => (
                            <div key={s.title} className="cp-service-card">
                                <div className="cp-service-card__icon">{s.icon}</div>
                                <h3 className="cp-service-card__title">{s.title}</h3>
                                <p className="cp-service-card__desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="cp-faq container">
                <p className="cp-eyebrow" style={{ textAlign: "center" }}>FAQ</p>
                <h2 className="cp-section-title" style={{ textAlign: "center" }}>
                    Frequently Asked <span style={{ color: RED }}>Questions</span>
                </h2>
                <p className="cp-section-sub" style={{ textAlign: "center", marginBottom: 40 }}>
                    Common questions clients ask us.
                </p>
                <div className="cp-faq__list">
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            className="cp-faq__item"
                            style={{ borderColor: openFaq === i ? RED : "#eee" }}
                        >
                            <button
                                className="cp-faq__btn"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                aria-expanded={openFaq === i}
                            >
                                <span style={{ color: openFaq === i ? RED : "#111" }}>{faq.q}</span>
                                <span
                                    className="cp-faq__plus"
                                    style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}
                                    aria-hidden="true"
                                >+</span>
                            </button>
                            {openFaq === i && (
                                <div className="cp-faq__answer" role="region">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <div className="cp-cta">
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🤖</div>
                <h3 className="cp-cta__title">Still have questions?</h3>
                <p className="cp-cta__sub">Chat with us on WhatsApp for instant answers.</p>
                <a
                    href="https://wa.me/254712328150"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cp-btn"
                >
                    💬 Start a Conversation
                </a>
            </div>

            {/* ══════════════════════════════════
          SCOPED CSS — all cp-* classes
      ══════════════════════════════════ */}
            <style>{`
        /* ── Reset & Base ── */
        .cp-root {
          min-height: 100vh;
          background: #fff;
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: #111;
        }
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Hero ── */
        .cp-hero {
          background:
            linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.68)),
            url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80')
            center/cover no-repeat;
          padding: 80px 24px;
          text-align: center;
          color: #fff;
        }
        .cp-eyebrow {
          color: ${RED};
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .cp-hero__title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          margin-bottom: 14px;
          line-height: 1.15;
          color: #fff;
        }
        .cp-hero__sub {
          color: rgba(255,255,255,0.75);
          font-size: 16px;
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── Stats ── */
        .cp-stats {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          border-bottom: 1px solid #eee;
          border-top: 1px solid #eee;
          background: #fafafa;
        }
        .cp-stat {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 32px;
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }
        .cp-stat__icon { font-size: 20px; }

        /* ── Section typography ── */
        .cp-section-title {
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 8px;
          color: #111;
        }
        .cp-section-sub {
          color: #888;
          font-size: 14px;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        /* ── Main Grid ── */
        .cp-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 60px;
          padding-top: 70px;
          padding-bottom: 70px;
        }

        /* ── Contact Details ── */
        .cp-info-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 14px;
          border: 1px solid #eee;
          margin-bottom: 14px;
          background: #fff;
          transition: box-shadow 0.2s, border-color 0.2s;
          cursor: default;
        }
        .cp-info-card:hover {
          box-shadow: 0 6px 24px rgba(232,50,90,0.1);
          border-color: ${RED};
        }
        .cp-info-card__icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          background: rgba(232,50,90,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .cp-info-card__body { flex: 1; min-width: 0; }
        .cp-info-card__label {
          font-size: 11px; color: #999; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px;
        }
        .cp-info-card__value { font-weight: 600; font-size: 15px; color: #111; }
        .cp-link {
          text-decoration: none; color: #111;
          transition: color 0.15s;
        }
        .cp-link:hover { color: ${RED}; }
        .cp-copy-btn {
          background: none; border: none; cursor: pointer;
          font-size: 18px; padding: 4px; border-radius: 8px;
          transition: background 0.15s; flex-shrink: 0;
        }
        .cp-copy-btn:hover { background: rgba(232,50,90,0.08); }

        /* WhatsApp */
        .cp-whatsapp {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; width: 100%; padding: 14px; border-radius: 14px;
          background: #25D366; color: #fff; text-decoration: none;
          font-weight: 700; font-size: 15px; margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(37,211,102,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cp-whatsapp:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37,211,102,0.4);
        }

        /* Business hours */
        .cp-hours {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #666; margin-bottom: 20px;
          padding: 10px 14px; background: #f8f8f8; border-radius: 10px;
        }
        .cp-hours__dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #25D366; flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(37,211,102,0.2);
        }

        /* Socials */
        .cp-socials { display: flex; gap: 10px; }
        .cp-social-btn {
          width: 44px; height: 44px; border-radius: 12px;
          border: 1px solid #eee; display: flex;
          align-items: center; justify-content: center;
          font-size: 20px; text-decoration: none;
          transition: all 0.2s; background: #fff;
        }
        .cp-social-btn:hover {
          border-color: ${RED};
          background: rgba(232,50,90,0.06);
          transform: translateY(-2px);
        }

        /* ── Form ── */
        .cp-form-wrap { display: flex; flex-direction: column; }
        .cp-form { display: flex; flex-direction: column; gap: 18px; }

        /* Success */
        .cp-success {
          text-align: center; padding: 60px 30px;
          border: 1px solid #eee; border-radius: 20px;
          background: rgba(232,50,90,0.02);
          animation: cp-fadeIn 0.35s ease;
        }
        .cp-success__icon { font-size: 56px; margin-bottom: 16px; }
        .cp-success__title { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
        .cp-success__body  { color: #888; font-size: 15px; margin-bottom: 24px; }

        /* Error banner */
        .cp-error-banner {
          background: rgba(232,50,90,0.06);
          border: 1px solid rgba(232,50,90,0.25);
          border-radius: 10px; padding: 12px 16px;
          font-size: 14px; color: ${RED};
        }

        /* Buttons */
        .cp-btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; background: ${RED}; color: #fff; border: none;
          padding: 14px 28px; border-radius: 999px;
          font-weight: 700; font-size: 15px; cursor: pointer;
          text-decoration: none; font-family: inherit;
          box-shadow: 0 4px 16px rgba(232,50,90,0.3);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .cp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(232,50,90,0.4);
        }
        .cp-btn--full { width: 100%; border-radius: 12px; padding: 16px; font-size: 16px; }
        .cp-btn--loading { opacity: 0.75; cursor: not-allowed; }
        .cp-btn:disabled { pointer-events: none; }

        /* Spinner */
        .cp-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cp-spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes cp-spin { to { transform: rotate(360deg); } }

        .cp-form__note {
          text-align: center; font-size: 12px; color: #aaa; margin-top: -6px;
        }

        /* ── Services ── */
        .cp-services {
          background: #fafafa; padding: 70px 0;
          border-top: 1px solid #eee; text-align: center;
        }
        .cp-services__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          text-align: left;
        }
        .cp-service-card {
          background: #fff; border: 1px solid #eee;
          border-radius: 16px; padding: 36px 24px;
          cursor: pointer; transition: all 0.25s;
        }
        .cp-service-card:hover {
          box-shadow: 0 8px 30px rgba(232,50,90,0.1);
          border-color: ${RED};
          transform: translateY(-4px);
        }
        .cp-service-card__icon  { font-size: 40px; margin-bottom: 16px; }
        .cp-service-card__title { font-weight: 700; font-size: 17px; margin-bottom: 8px; color: #111; }
        .cp-service-card__desc  { color: #888; font-size: 14px; line-height: 1.6; }

        /* ── FAQ ── */
        .cp-faq {
          max-width: 700px !important;
          padding-top: 70px; padding-bottom: 70px;
        }
        .cp-faq__list { display: flex; flex-direction: column; gap: 12px; }
        .cp-faq__item {
          border: 1px solid #eee; border-radius: 14px;
          overflow: hidden; transition: border-color 0.2s;
        }
        .cp-faq__btn {
          width: 100%; background: none; border: none; cursor: pointer;
          padding: 20px 24px; display: flex;
          justify-content: space-between; align-items: center;
          font-family: inherit; text-align: left;
        }
        .cp-faq__btn span:first-child { font-weight: 600; font-size: 15px; }
        .cp-faq__plus {
          font-size: 22px; color: ${RED}; flex-shrink: 0;
          margin-left: 12px; transition: transform 0.25s;
          display: inline-block;
        }
        .cp-faq__answer {
          padding: 0 24px 20px; color: #666;
          font-size: 14px; line-height: 1.7;
          animation: cp-fadeIn 0.2s ease;
        }

        /* ── CTA ── */
        .cp-cta {
          text-align: center;
          padding: 50px 24px 70px;
          border-top: 1px solid #eee;
        }
        .cp-cta__title { font-weight: 700; font-size: 20px; margin-bottom: 8px; }
        .cp-cta__sub   { color: #888; font-size: 14px; margin-bottom: 20px; }

        /* ── Animations ── */
        @keyframes cp-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .cp-grid {
            grid-template-columns: 1fr;
            gap: 48px;
            padding-top: 48px;
            padding-bottom: 48px;
          }
          .cp-stat {
            padding: 14px 20px;
            font-size: 14px;
          }
          /* Remove right border on mobile wrap */
          .cp-stat { border-right: none !important; border-bottom: 1px solid #eee; }
          .cp-stat:last-child { border-bottom: none; }
          .cp-stats { flex-direction: column; align-items: stretch; }
          .cp-services__grid { grid-template-columns: 1fr 1fr; }
          .cp-faq { padding-left: 16px; padding-right: 16px; }
        }
        @media (max-width: 480px) {
          .cp-hero { padding: 60px 16px; }
          .cp-services__grid { grid-template-columns: 1fr; }
          .cp-grid { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>
        </main>
    );
}