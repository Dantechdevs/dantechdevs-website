"use client";

import { useState } from "react";

const RED = "#e8325a";

const stats = [
    { icon: "🚀", label: "50+ Projects" },
    { icon: "⚡", label: "Fast Delivery" },
    { icon: "🕐", label: "24/7 Support" },
    { icon: "🎨", label: "Modern UI/UX" },
];

const services = [
    { icon: "🌐", title: "Web Development", desc: "Modern responsive websites and web apps." },
    { icon: "📱", title: "Mobile Apps", desc: "Android and iOS applications." },
    { icon: "🎨", title: "UI/UX Design", desc: "Beautiful interfaces and user experiences." },
    { icon: "⚙️", title: "Custom Software", desc: "Tailored systems for businesses." },
];

const faqs = [
    { q: "How long does a website take?", a: "Most websites take 1–3 weeks depending on complexity." },
    { q: "Do you build mobile apps?", a: "Yes. We develop Android and cross-platform applications." },
    { q: "Can you redesign old websites?", a: "Absolutely. We modernize and improve existing websites." },
];

const socials = [
    { icon: "🌐", href: "#", label: "Website" },
    { icon: "💼", href: "#", label: "LinkedIn" },
    { icon: "💻", href: "#", label: "GitHub" },
    { icon: "📘", href: "#", label: "Facebook" },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", contact: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const charCount = form.message.length;

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (form.name && form.contact && form.message) {
            setSubmitted(true);
        }
    };

    return (
        <main style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Segoe UI', sans-serif", color: "#111" }}>

            {/* ── PAGE HEADER ── */}
            <section style={{
                background: `linear-gradient(rgba(0,0,0,0.68), rgba(0,0,0,0.68)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80') center/cover no-repeat`,
                padding: "80px 24px",
                textAlign: "center",
                color: "#fff",
            }}>
                <p style={{ color: RED, fontWeight: 600, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
                    Get In Touch
                </p>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, marginBottom: "14px", lineHeight: 1.15 }}>
                    Contact <span style={{ color: RED }}>Us</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", maxWidth: "480px", margin: "0 auto" }}>
                    Have a project in mind? We&apos;d love to hear from you.
                </p>
            </section>

            {/* ── STATS STRIP ── */}
            <div style={{
                display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0",
                borderBottom: "1px solid #eee", borderTop: "1px solid #eee",
                background: "#fafafa",
            }}>
                {stats.map((s, i) => (
                    <div key={s.label} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "18px 36px",
                        borderRight: i < stats.length - 1 ? "1px solid #eee" : "none",
                        fontSize: "15px", fontWeight: 600, color: "#333",
                    }}>
                        <span style={{ fontSize: "20px" }}>{s.icon}</span>
                        {s.label}
                    </div>
                ))}
            </div>

            {/* ── MAIN CONTENT ── */}
            <div style={{
                maxWidth: "1100px", margin: "0 auto",
                padding: "70px 24px", display: "grid",
                gridTemplateColumns: "1fr 1.4fr", gap: "60px",
            }}>

                {/* ── LEFT: Contact Details ── */}
                <div>
                    <h2 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "8px" }}>
                        Contact <span style={{ color: RED }}>Details</span>
                    </h2>
                    <p style={{ color: "#888", fontSize: "14px", marginBottom: "36px" }}>
                        Reach us through any of the channels below.
                    </p>

                    {/* Info Cards */}
                    {[
                        { icon: "📍", label: "Location", value: "Nairobi, Kenya", href: null },
                        { icon: "✉️", label: "Email", value: "dantechdevs@gmail.com", href: "mailto:dantechdevs@gmail.com" },
                        { icon: "📞", label: "Phone", value: "+254 712 328 150", href: "tel:+254712328150" },
                    ].map((item) => (
                        <div key={item.label} style={{
                            display: "flex", alignItems: "flex-start", gap: "16px",
                            padding: "20px", borderRadius: "14px", border: "1px solid #eee",
                            marginBottom: "16px", background: "#fff",
                            transition: "box-shadow 0.2s",
                        }}
                            onMouseOver={(e) => { e.currentTarget.style.boxShadow = `0 6px 24px rgba(232,50,90,0.12)`; e.currentTarget.style.borderColor = RED; }}
                            onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#eee"; }}
                        >
                            <div style={{
                                width: "46px", height: "46px", borderRadius: "12px",
                                background: "rgba(232,50,90,0.08)", display: "flex",
                                alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0,
                            }}>{item.icon}</div>
                            <div>
                                <div style={{ fontSize: "12px", color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{item.label}</div>
                                {item.href ? (
                                    <a href={item.href} style={{ color: "#111", fontWeight: 600, fontSize: "15px", textDecoration: "none" }}
                                        onMouseOver={(e) => { (e.target as HTMLAnchorElement).style.color = RED; }}
                                        onMouseOut={(e) => { (e.target as HTMLAnchorElement).style.color = "#111"; }}
                                    >{item.value}</a>
                                ) : (
                                    <span style={{ color: "#111", fontWeight: 600, fontSize: "15px" }}>{item.value}</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* WhatsApp Button */}
                    <a href="https://wa.me/254712328150" target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                        width: "100%", padding: "14px", borderRadius: "14px",
                        background: "#25D366", color: "#fff", textDecoration: "none",
                        fontWeight: 700, fontSize: "15px", marginBottom: "28px",
                        boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(37,211,102,0.4)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,211,102,0.3)"; }}
                    >
                        <span style={{ fontSize: "20px" }}>💬</span>
                        Chat on WhatsApp
                    </a>

                    {/* Socials */}
                    <div style={{ display: "flex", gap: "12px" }}>
                        {socials.map((s) => (
                            <a key={s.label} href={s.href} title={s.label} style={{
                                width: "44px", height: "44px", borderRadius: "12px",
                                border: "1px solid #eee", display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "20px", textDecoration: "none",
                                transition: "all 0.2s", background: "#fff",
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.background = "rgba(232,50,90,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >{s.icon}</a>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT: Contact Form ── */}
                <div>
                    <h2 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "8px" }}>
                        Send Us a <span style={{ color: RED }}>Message</span>
                    </h2>
                    <p style={{ color: "#888", fontSize: "14px", marginBottom: "32px" }}>
                        Fill the form and we&apos;ll get back to you within 24 hours.
                    </p>

                    {submitted ? (
                        <div style={{
                            textAlign: "center", padding: "60px 30px",
                            border: "1px solid #eee", borderRadius: "20px",
                            background: "rgba(232,50,90,0.03)",
                        }}>
                            <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
                            <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Message Sent!</h3>
                            <p style={{ color: "#888", fontSize: "15px", marginBottom: "24px" }}>
                                Thanks {form.name}! We&apos;ll reach out to you soon.
                            </p>
                            <button onClick={() => { setSubmitted(false); setForm({ name: "", contact: "", message: "" }); }}
                                style={{
                                    background: RED, color: "#fff", border: "none",
                                    padding: "12px 28px", borderRadius: "999px",
                                    fontWeight: 700, fontSize: "14px", cursor: "pointer",
                                }}>
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {/* Name */}
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#555", display: "block", marginBottom: "6px" }}>Your Name</label>
                                <input
                                    type="text" placeholder="e.g. Daniel Kamau"
                                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    style={{
                                        width: "100%", padding: "14px 18px", border: "1px solid #e0e0e0",
                                        borderRadius: "12px", fontSize: "15px", outline: "none",
                                        fontFamily: "inherit", transition: "border-color 0.2s", boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = RED; }}
                                    onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; }}
                                />
                            </div>

                            {/* Email or Phone */}
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#555", display: "block", marginBottom: "6px" }}>Email or Phone</label>
                                <input
                                    type="text" placeholder="e.g. you@email.com or +254..."
                                    value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                                    style={{
                                        width: "100%", padding: "14px 18px", border: "1px solid #e0e0e0",
                                        borderRadius: "12px", fontSize: "15px", outline: "none",
                                        fontFamily: "inherit", transition: "border-color 0.2s", boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = RED; }}
                                    onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; }}
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label style={{ fontSize: "13px", fontWeight: 600, color: "#555", display: "block", marginBottom: "6px" }}>Message</label>
                                <textarea
                                    placeholder="Tell us about your project..."
                                    value={form.message}
                                    onChange={(e) => { if (e.target.value.length <= 500) setForm({ ...form, message: e.target.value }); }}
                                    rows={5}
                                    style={{
                                        width: "100%", padding: "14px 18px", border: "1px solid #e0e0e0",
                                        borderRadius: "12px", fontSize: "15px", outline: "none", resize: "vertical",
                                        fontFamily: "inherit", transition: "border-color 0.2s", boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = RED; }}
                                    onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; }}
                                />
                                <div style={{ textAlign: "right", fontSize: "12px", color: charCount >= 450 ? RED : "#aaa", marginTop: "4px" }}>
                                    {charCount}/500
                                </div>
                            </div>

                            {/* Submit */}
                            <button onClick={handleSubmit} style={{
                                background: RED, color: "#fff", border: "none",
                                padding: "16px", borderRadius: "12px", fontWeight: 700,
                                fontSize: "16px", cursor: "pointer", width: "100%",
                                boxShadow: `0 4px 20px rgba(232,50,90,0.3)`,
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(232,50,90,0.4)"; }}
                                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,50,90,0.3)"; }}
                            >
                                Send Message 🚀
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── WHAT WE BUILD ── */}
            <section style={{ background: "#fafafa", padding: "70px 24px", textAlign: "center", borderTop: "1px solid #eee" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <p style={{ color: RED, fontWeight: 600, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Our Services</p>
                    <h2 style={{ fontSize: "30px", fontWeight: 800, marginBottom: "8px" }}>
                        What We <span style={{ color: RED }}>Build</span>
                    </h2>
                    <p style={{ color: "#888", fontSize: "15px", maxWidth: "500px", margin: "0 auto 48px" }}>
                        Modern digital solutions designed for startups, businesses, and growing brands.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                        {services.map((s) => (
                            <div key={s.title} style={{
                                background: "#fff", border: "1px solid #eee", borderRadius: "16px",
                                padding: "36px 24px", cursor: "pointer", transition: "all 0.25s",
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.boxShadow = `0 8px 30px rgba(232,50,90,0.12)`; e.currentTarget.style.borderColor = RED; e.currentTarget.style.transform = "translateY(-4px)"; }}
                                onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{s.icon}</div>
                                <h3 style={{ fontWeight: 700, fontSize: "17px", marginBottom: "8px" }}>{s.title}</h3>
                                <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section style={{ maxWidth: "700px", margin: "0 auto", padding: "70px 24px" }}>
                <p style={{ color: RED, fontWeight: 600, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px", textAlign: "center" }}>FAQ</p>
                <h2 style={{ fontSize: "30px", fontWeight: 800, marginBottom: "8px", textAlign: "center" }}>
                    Frequently Asked <span style={{ color: RED }}>Questions</span>
                </h2>
                <p style={{ color: "#888", fontSize: "15px", textAlign: "center", marginBottom: "40px" }}>
                    Common questions clients ask us.
                </p>

                {faqs.map((faq, i) => (
                    <div key={i} style={{
                        border: "1px solid #eee", borderRadius: "14px", marginBottom: "12px",
                        overflow: "hidden", transition: "border-color 0.2s",
                        borderColor: openFaq === i ? RED : "#eee",
                    }}>
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                            width: "100%", background: "none", border: "none", cursor: "pointer",
                            padding: "20px 24px", display: "flex", justifyContent: "space-between",
                            alignItems: "center", fontFamily: "inherit", textAlign: "left",
                        }}>
                            <span style={{ fontWeight: 600, fontSize: "15px", color: openFaq === i ? RED : "#111" }}>{faq.q}</span>
                            <span style={{
                                fontSize: "20px", color: RED, transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                                transition: "transform 0.25s", flexShrink: 0, marginLeft: "12px",
                            }}>+</span>
                        </button>
                        {openFaq === i && (
                            <div style={{ padding: "0 24px 20px", color: "#666", fontSize: "14px", lineHeight: 1.7 }}>
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {/* ── AI CHAT HINT ── */}
            <div style={{
                textAlign: "center", padding: "40px 24px 70px",
                borderTop: "1px solid #eee",
            }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🤖</div>
                <h3 style={{ fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>Still have questions?</h3>
                <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>
                    Chat with our AI assistant for instant answers.
                </p>
                <a href="https://wa.me/254712328150" target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: RED, color: "#fff", textDecoration: "none",
                    padding: "12px 28px", borderRadius: "999px",
                    fontWeight: 700, fontSize: "14px",
                    boxShadow: "0 4px 16px rgba(232,50,90,0.3)",
                }}>
                    💬 Start a Conversation
                </a>
            </div>

            <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1.4fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </main>
    );
}