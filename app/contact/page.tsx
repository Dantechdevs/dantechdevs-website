"use client";

import { useState, useEffect, useRef } from "react";

const EJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const ACCENT = "#e8a020";

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

/* ── Real branded SVG social icons ── */
const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);
const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
);

const SOCIALS = [
    { label: "WhatsApp", href: "https://wa.me/254712328150", bg: "#25D366", Icon: WhatsAppIcon },
    { label: "YouTube", href: "https://youtube.com/@dantechdevs", bg: "#FF0000", Icon: YouTubeIcon },
    { label: "Facebook", href: "https://facebook.com/dantechdevs", bg: "#1877F2", Icon: FacebookIcon },
    { label: "TikTok", href: "https://tiktok.com/@dantechdevs", bg: "#000000", Icon: TikTokIcon },
];

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidKEPhone = (v: string) => /^(\+254|0)[17]\d{8}$/.test(v.replace(/\s/g, ""));
const isValidContact = (v: string) => isValidEmail(v) || isValidKEPhone(v);

type FormFields = { name: string; contact: string; message: string };
type FormErrors = { name: string; contact: string; message: string };
interface ChatMessage { role: "user" | "assistant"; content: string; }

const EMPTY_FORM: FormFields = { name: "", contact: "", message: "" };
const EMPTY_ERRS: FormErrors = { name: "", contact: "", message: "" };

function Field({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>{label}</label>
            {children}
            {error && <span style={{ fontSize: "12px", color: ACCENT, display: "flex", alignItems: "center", gap: "4px" }}>⚠ {error}</span>}
        </div>
    );
}

export default function ContactPage() {
    const [form, setForm] = useState<FormFields>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRS);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "assistant", content: "Hi! I'm the Dantechdevs AI. Ask me about our services, pricing, or anything!" },
    ]);
    const [userInput, setUserInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const ejsLoaded = useRef(false);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    useEffect(() => {
        if (ejsLoaded.current) return;
        ejsLoaded.current = true;
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.async = true;
        s.onload = () => (window as any).emailjs.init(EJS_PUBLIC_KEY);
        document.head.appendChild(s);
    }, []);

    useEffect(() => {
        const e: FormErrors = { name: "", contact: "", message: "" };
        if (touched.name) {
            if (!form.name.trim()) e.name = "Name is required.";
            else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
        }
        if (touched.contact) {
            if (!form.contact.trim()) e.contact = "Email or phone is required.";
            else if (!isValidContact(form.contact)) e.contact = "Enter a valid email or Kenyan phone (+254… / 07…).";
        }
        if (touched.message) {
            if (!form.message.trim()) e.message = "Message is required.";
            else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
        }
        setErrors(e);
    }, [form, touched]);

    const validate = (): boolean => {
        setTouched({ name: true, contact: true, message: true });
        const e: FormErrors = { name: "", contact: "", message: "" };
        if (!form.name.trim() || form.name.trim().length < 2)
            e.name = !form.name.trim() ? "Name is required." : "At least 2 characters.";
        if (!form.contact.trim()) e.contact = "Email or phone is required.";
        else if (!isValidContact(form.contact)) e.contact = "Enter a valid email or Kenyan phone.";
        if (!form.message.trim() || form.message.trim().length < 10)
            e.message = !form.message.trim() ? "Message is required." : "At least 10 characters.";
        setErrors(e);
        return !e.name && !e.contact && !e.message;
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus("sending");
        try {
            await (window as any).emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, {
                from_name: form.name.trim(), from_contact: form.contact.trim(), message: form.message.trim(),
            });
            setStatus("sent");
        } catch (err) { console.error(err); setStatus("error"); }
    };

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key); setTimeout(() => setCopied(null), 2000);
        });
    };

    const sendChat = async () => {
        if (!userInput.trim() || chatLoading) return;
        const next: ChatMessage[] = [...messages, { role: "user", content: userInput }];
        setMessages(next); setUserInput(""); setChatLoading(true);
        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514", max_tokens: 1000,
                    system: "You are a helpful assistant for Dantechdevs, a software company in Nairobi, Kenya. Services: web dev, mobile apps, custom software, UI/UX. Contact: 0712328150, dantechdevs@gmail.com. Be friendly and concise.",
                    messages: next.map(m => ({ role: m.role, content: m.content })),
                }),
            });
            const data = await res.json();
            setMessages([...next, { role: "assistant", content: data.content?.[0]?.text ?? "Sorry, something went wrong." }]);
        } catch {
            setMessages([...next, { role: "assistant", content: "Sorry, I couldn't connect. Reach us on WhatsApp!" }]);
        } finally { setChatLoading(false); }
    };

    const inputStyle = (hasError: boolean): React.CSSProperties => ({
        width: "100%", padding: "14px 18px",
        border: `1.5px solid ${hasError ? ACCENT : "#e0e0e0"}`,
        borderRadius: "12px", fontSize: "15px", outline: "none",
        fontFamily: "inherit", transition: "border-color 0.2s",
        boxSizing: "border-box", background: "#fff",
    });

    return (
        <main className="cp-root">

            {/* HERO */}
            <section className="cp-hero">
                <p className="cp-eyebrow">Get In Touch</p>
                <h1 className="cp-hero__title">Contact <span style={{ color: ACCENT }}>Us</span></h1>
                <p className="cp-hero__sub">Have a project in mind? We&apos;d love to hear from you.</p>
            </section>

            {/* STATS */}
            <div className="cp-stats">
                {STATS.map((s, i) => (
                    <div key={s.label} className="cp-stat" style={{ borderRight: i < STATS.length - 1 ? "1px solid #eee" : "none" }}>
                        <span className="cp-stat__icon">{s.icon}</span>{s.label}
                    </div>
                ))}
            </div>

            {/* GRID */}
            <div className="cp-grid container">

                {/* LEFT — details */}
                <div className="cp-details">
                    <h2 className="cp-section-title">Contact <span style={{ color: ACCENT }}>Details</span></h2>
                    <p className="cp-section-sub">Reach us through any of the channels below.</p>

                    {[
                        { icon: "📍", label: "Location", value: "Nairobi, Kenya", key: "loc", href: null, copyable: false },
                        { icon: "✉️", label: "Email", value: "dantechdevs@gmail.com", key: "email", href: "mailto:dantechdevs@gmail.com", copyable: true },
                        { icon: "📞", label: "Phone", value: "+254 712 328 150", key: "phone", href: "tel:+254712328150", copyable: true },
                    ].map(item => (
                        <div key={item.label} className="cp-info-card">
                            <div className="cp-info-card__icon">{item.icon}</div>
                            <div className="cp-info-card__body">
                                <div className="cp-info-card__label">{item.label}</div>
                                {item.href
                                    ? <a href={item.href} className="cp-info-card__value cp-link">{item.value}</a>
                                    : <span className="cp-info-card__value">{item.value}</span>}
                            </div>
                            {item.copyable && (
                                <button className="cp-copy-btn" onClick={() => copyToClipboard(item.value, item.key)} title="Copy">
                                    {copied === item.key ? "✅" : "📋"}
                                </button>
                            )}
                        </div>
                    ))}

                    {/* WhatsApp CTA button */}
                    <a href="https://wa.me/254712328150?text=Hi%20Dantechdevs%2C%20I%27d%20like%20to%20inquire%20about%20your%20services."
                        target="_blank" rel="noopener noreferrer" className="cp-whatsapp-btn">
                        <WhatsAppIcon />
                        Chat on WhatsApp
                    </a>

                    {/* Hours */}
                    <div className="cp-hours">
                        <span className="cp-hours__dot" />
                        <span>Mon – Fri &nbsp;8 am – 6 pm <strong>EAT</strong> &nbsp;·&nbsp; Replies within <strong>2 hrs</strong></span>
                    </div>

                    {/* Social Icons */}
                    <p className="cp-follow-label">Follow Us</p>
                    <div className="cp-socials">
                        {SOCIALS.map(({ label, href, bg, Icon }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                className="cp-social-btn" aria-label={label} title={label}
                                style={{ background: bg }}>
                                <Icon />
                            </a>
                        ))}
                    </div>
                </div>

                {/* RIGHT — form */}
                <div className="cp-form-wrap">
                    <h2 className="cp-section-title">Send Us a <span style={{ color: ACCENT }}>Message</span></h2>
                    <p className="cp-section-sub">Fill the form and we&apos;ll get back to you within 24 hours.</p>

                    {status === "sent" ? (
                        <div className="cp-success">
                            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Message Sent!</h3>
                            <p style={{ color: "#888", fontSize: 15, marginBottom: 24 }}>Thanks <strong>{form.name}</strong>! We&apos;ll reach out soon.</p>
                            <button className="cp-btn" onClick={() => { setStatus("idle"); setForm(EMPTY_FORM); setTouched({}); setErrors(EMPTY_ERRS); }}>
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <div className="cp-form">
                            <Field label="Your Name *" error={errors.name}>
                                <input type="text" placeholder="e.g. Daniel Kamau" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    onBlur={() => setTouched(t => ({ ...t, name: true }))}
                                    style={inputStyle(!!errors.name)} autoComplete="name" />
                            </Field>
                            <Field label="Email or Phone *" error={errors.contact}>
                                <input type="text" placeholder="you@email.com  or  +254 7XX XXX XXX" value={form.contact}
                                    onChange={e => setForm({ ...form, contact: e.target.value })}
                                    onBlur={() => setTouched(t => ({ ...t, contact: true }))}
                                    style={inputStyle(!!errors.contact)} autoComplete="email" />
                            </Field>
                            <Field label="Message *" error={errors.message}>
                                <>
                                    <textarea placeholder="Tell us about your project..." value={form.message}
                                        onChange={e => { if (e.target.value.length <= 500) setForm({ ...form, message: e.target.value }); }}
                                        onBlur={() => setTouched(t => ({ ...t, message: true }))}
                                        rows={5} style={{ ...inputStyle(!!errors.message), resize: "vertical" }} />
                                    <div style={{ textAlign: "right", fontSize: 12, color: form.message.length >= 450 ? ACCENT : "#aaa", marginTop: 2 }}>
                                        {form.message.length}/500
                                    </div>
                                </>
                            </Field>
                            {status === "error" && (
                                <div className="cp-error-banner" role="alert">
                                    ❌ Something went wrong. Try WhatsApp or email us directly.
                                </div>
                            )}
                            <button className={`cp-btn cp-btn--full${status === "sending" ? " cp-btn--loading" : ""}`}
                                onClick={handleSubmit} disabled={status === "sending"}>
                                {status === "sending" ? <><span className="cp-spinner" /> Sending…</> : <>Send Message 🚀</>}
                            </button>
                            <p className="cp-form__note">🔒 Your info is never shared with third parties.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* SERVICES */}
            <section className="cp-services">
                <div className="container">
                    <p className="cp-eyebrow">Our Services</p>
                    <h2 className="cp-section-title">What We <span style={{ color: ACCENT }}>Build</span></h2>
                    <p className="cp-section-sub" style={{ maxWidth: 500, margin: "0 auto 48px" }}>
                        Modern digital solutions for startups, businesses, and growing brands.
                    </p>
                    <div className="cp-services__grid">
                        {SERVICES.map(s => (
                            <div key={s.title} className="cp-service-card">
                                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: "#111" }}>{s.title}</h3>
                                <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="cp-faq container">
                <p className="cp-eyebrow" style={{ textAlign: "center" }}>FAQ</p>
                <h2 className="cp-section-title" style={{ textAlign: "center" }}>Frequently Asked <span style={{ color: ACCENT }}>Questions</span></h2>
                <p className="cp-section-sub" style={{ textAlign: "center", marginBottom: 40 }}>Common questions clients ask us.</p>
                <div className="cp-faq__list">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="cp-faq__item" style={{ borderColor: openFaq === i ? ACCENT : "#eee" }}>
                            <button className="cp-faq__btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                <span style={{ color: openFaq === i ? ACCENT : "#111" }}>{faq.q}</span>
                                <span className="cp-faq__plus" style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                            </button>
                            {openFaq === i && <div className="cp-faq__answer">{faq.a}</div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <div className="cp-cta">
                <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                <h3 className="cp-cta__title">Still have questions?</h3>
                <p className="cp-cta__sub">Chat with us on WhatsApp for instant answers.</p>
                <a href="https://wa.me/254712328150" target="_blank" rel="noopener noreferrer" className="cp-btn">
                    Start a Conversation
                </a>
            </div>

            {/* AI CHATBOT */}
            <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 1000 }}>
                {chatOpen && (
                    <div className="cp-chat-box">
                        <div className="cp-chat-header">
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 36, height: 36, background: "rgba(0,0,0,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, color: "#0d1117", fontSize: 14 }}>Dantechdevs AI</p>
                                    <p style={{ margin: 0, fontSize: 11, color: "rgba(13,17,23,0.6)" }}>Online · Replies instantly</p>
                                </div>
                            </div>
                            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "#0d1117", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
                        </div>
                        <div className="cp-chat-messages">
                            {messages.map((msg, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                                    <div className={msg.role === "user" ? "cp-bubble cp-bubble--user" : "cp-bubble cp-bubble--bot"}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {chatLoading && (
                                <div style={{ display: "flex", gap: 4, padding: "8px 12px" }}>
                                    {[0, 1, 2].map(i => <div key={i} className="cp-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="cp-chat-input">
                            <input value={userInput} onChange={e => setUserInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && sendChat()}
                                placeholder="Ask a question…"
                                style={{ flex: 1, background: "#0d1117", border: "1px solid #1e2530", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
                            <button onClick={sendChat} disabled={chatLoading}
                                style={{ background: ACCENT, border: "none", borderRadius: 8, width: 40, cursor: chatLoading ? "not-allowed" : "pointer", fontSize: 16, opacity: chatLoading ? 0.5 : 1, color: "#000" }}>
                                ➤
                            </button>
                        </div>
                    </div>
                )}
                <button onClick={() => setChatOpen(!chatOpen)} className="cp-chat-toggle" title="Chat with AI">
                    {chatOpen ? "×" : "🤖"}
                </button>
            </div>

            <style>{`
        .cp-root{min-height:100vh;background:#fff;font-family:'Segoe UI',system-ui,sans-serif;color:#111;}
        .container{max-width:1100px;margin:0 auto;padding:0 24px;}
        .cp-hero{background:linear-gradient(rgba(0,0,0,.68),rgba(0,0,0,.68)),url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80') center/cover no-repeat;padding:80px 24px;text-align:center;color:#fff;}
        .cp-eyebrow{color:${ACCENT};font-weight:600;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;}
        .cp-hero__title{font-size:clamp(2rem,5vw,3.2rem);font-weight:800;margin-bottom:14px;line-height:1.15;color:#fff;}
        .cp-hero__sub{color:rgba(255,255,255,.75);font-size:16px;max-width:480px;margin:0 auto;}
        .cp-stats{display:flex;justify-content:center;flex-wrap:wrap;border-bottom:1px solid #eee;border-top:1px solid #eee;background:#fafafa;}
        .cp-stat{display:flex;align-items:center;gap:10px;padding:18px 32px;font-size:15px;font-weight:600;color:#333;}
        .cp-stat__icon{font-size:20px;}
        .cp-section-title{font-size:26px;font-weight:800;margin-bottom:8px;color:#111;}
        .cp-section-sub{color:#888;font-size:14px;margin-bottom:32px;line-height:1.6;}
        .cp-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:60px;padding-top:70px;padding-bottom:70px;}
        .cp-info-card{display:flex;align-items:center;gap:16px;padding:18px 20px;border-radius:14px;border:1px solid #eee;margin-bottom:14px;background:#fff;transition:box-shadow .2s,border-color .2s;}
        .cp-info-card:hover{box-shadow:0 6px 24px rgba(232,160,32,.12);border-color:${ACCENT};}
        .cp-info-card__icon{width:46px;height:46px;border-radius:12px;background:rgba(232,160,32,.08);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
        .cp-info-card__body{flex:1;min-width:0;}
        .cp-info-card__label{font-size:11px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px;}
        .cp-info-card__value{font-weight:600;font-size:15px;color:#111;}
        .cp-link{text-decoration:none;color:#111;transition:color .15s;}
        .cp-link:hover{color:${ACCENT};}
        .cp-copy-btn{background:none;border:none;cursor:pointer;font-size:18px;padding:4px;border-radius:8px;transition:background .15s;flex-shrink:0;}
        .cp-copy-btn:hover{background:rgba(232,160,32,.1);}
        .cp-whatsapp-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px;border-radius:14px;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:15px;margin-bottom:16px;box-shadow:0 4px 16px rgba(37,211,102,.3);transition:transform .2s,box-shadow .2s;}
        .cp-whatsapp-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,211,102,.4);}
        .cp-hours{display:flex;align-items:center;gap:8px;font-size:13px;color:#666;margin-bottom:20px;padding:10px 14px;background:#f8f8f8;border-radius:10px;}
        .cp-hours__dot{width:8px;height:8px;border-radius:50%;background:#25D366;flex-shrink:0;box-shadow:0 0 0 3px rgba(37,211,102,.2);}
        .cp-follow-label{font-size:12px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;}
        .cp-socials{display:flex;gap:10px;margin-bottom:8px;}
        .cp-social-btn{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;text-decoration:none;color:#fff;transition:transform .2s,box-shadow .2s;box-shadow:0 2px 8px rgba(0,0,0,.2);}
        .cp-social-btn:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,.3);}
        .cp-form-wrap{display:flex;flex-direction:column;}
        .cp-form{display:flex;flex-direction:column;gap:18px;}
        .cp-success{text-align:center;padding:60px 30px;border:1px solid #eee;border-radius:20px;background:rgba(232,160,32,.02);animation:cp-fadeIn .35s ease;}
        .cp-error-banner{background:rgba(232,160,32,.06);border:1px solid rgba(232,160,32,.25);border-radius:10px;padding:12px 16px;font-size:14px;color:${ACCENT};}
        .cp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:${ACCENT};color:#fff;border:none;padding:14px 28px;border-radius:999px;font-weight:700;font-size:15px;cursor:pointer;text-decoration:none;font-family:inherit;box-shadow:0 4px 16px rgba(232,160,32,.3);transition:transform .2s,box-shadow .2s;}
        .cp-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(232,160,32,.4);}
        .cp-btn--full{width:100%;border-radius:12px;padding:16px;font-size:16px;}
        .cp-btn--loading{opacity:.75;cursor:not-allowed;}
        .cp-btn:disabled{pointer-events:none;}
        .cp-spinner{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:cp-spin .7s linear infinite;display:inline-block;}
        @keyframes cp-spin{to{transform:rotate(360deg);}}
        .cp-form__note{text-align:center;font-size:12px;color:#aaa;margin-top:-6px;}
        .cp-services{background:#fafafa;padding:70px 0;border-top:1px solid #eee;text-align:center;}
        .cp-services__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;text-align:left;}
        .cp-service-card{background:#fff;border:1px solid #eee;border-radius:16px;padding:36px 24px;cursor:pointer;transition:all .25s;}
        .cp-service-card:hover{box-shadow:0 8px 30px rgba(232,160,32,.12);border-color:${ACCENT};transform:translateY(-4px);}
        .cp-faq{max-width:700px !important;padding-top:70px;padding-bottom:70px;}
        .cp-faq__list{display:flex;flex-direction:column;gap:12px;}
        .cp-faq__item{border:1px solid #eee;border-radius:14px;overflow:hidden;transition:border-color .2s;}
        .cp-faq__btn{width:100%;background:none;border:none;cursor:pointer;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;font-family:inherit;text-align:left;}
        .cp-faq__btn span:first-child{font-weight:600;font-size:15px;}
        .cp-faq__plus{font-size:22px;color:${ACCENT};flex-shrink:0;margin-left:12px;transition:transform .25s;display:inline-block;}
        .cp-faq__answer{padding:0 24px 20px;color:#666;font-size:14px;line-height:1.7;animation:cp-fadeIn .2s ease;}
        .cp-cta{text-align:center;padding:50px 24px 70px;border-top:1px solid #eee;}
        .cp-cta__title{font-weight:700;font-size:20px;margin-bottom:8px;}
        .cp-cta__sub{color:#888;font-size:14px;margin-bottom:20px;}
        .cp-chat-box{width:340px;height:460px;background:#161b22;border:1px solid #1e2530;border-radius:16px;display:flex;flex-direction:column;margin-bottom:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5);}
        .cp-chat-header{background:${ACCENT};padding:14px 18px;display:flex;align-items:center;justify-content:space-between;}
        .cp-chat-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}
        .cp-bubble{max-width:80%;padding:10px 14px;font-size:14px;line-height:1.5;}
        .cp-bubble--user{background:${ACCENT};color:#0d1117;border-radius:16px 16px 4px 16px;}
        .cp-bubble--bot{background:#1e2530;color:#fff;border-radius:16px 16px 16px 4px;}
        .cp-chat-input{padding:10px 14px;border-top:1px solid #1e2530;display:flex;gap:8px;}
        .cp-chat-toggle{width:58px;height:58px;border-radius:50%;background:${ACCENT};border:none;font-size:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(232,160,32,.4);transition:transform .2s;}
        .cp-chat-toggle:hover{transform:scale(1.1);}
        .cp-dot{width:8px;height:8px;border-radius:50%;background:${ACCENT};animation:cp-bounce 1s infinite;}
        @keyframes cp-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        @keyframes cp-fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){
          .cp-grid{grid-template-columns:1fr;gap:48px;padding-top:48px;padding-bottom:48px;}
          .cp-stat{padding:14px 20px;font-size:14px;border-right:none !important;border-bottom:1px solid #eee;}
          .cp-stat:last-child{border-bottom:none;}
          .cp-stats{flex-direction:column;align-items:stretch;}
          .cp-services__grid{grid-template-columns:1fr 1fr;}
          .cp-faq{padding-left:16px;padding-right:16px;}
          .cp-chat-box{width:300px;}
        }
        @media(max-width:480px){
          .cp-hero{padding:60px 16px;}
          .cp-services__grid{grid-template-columns:1fr;}
          .cp-grid{padding-left:16px;padding-right:16px;}
        }
      `}</style>
        </main>
    );
}