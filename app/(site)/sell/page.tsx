"use client";
import { useState } from "react";
import Link from "next/link";

const R = "#E11D48";

const STEPS = [
    { icon: "📝", title: "Create Seller Account", desc: "Register with your name, email & M-Pesa number. Takes 2 minutes." },
    { icon: "📦", title: "List Your Product", desc: "Upload your file, set a price in KES, add a description and go live." },
    { icon: "💳", title: "Get Paid via M-Pesa", desc: "Every sale triggers an instant M-Pesa payout to your number. No waiting." },
];

const PERKS = [
    { icon: "💰", title: "Keep 80% Revenue", desc: "We only take 20% — one of the lowest cuts in any African marketplace." },
    { icon: "📱", title: "M-Pesa Payouts", desc: "Get paid directly to your phone. No bank account needed." },
    { icon: "🌍", title: "Reach 2,800+ Buyers", desc: "Your product is instantly visible to thousands of Kenyan businesses." },
    { icon: "🛡️", title: "Secure & Trusted", desc: "All transactions protected. Buyers trust the Dantechdevs brand." },
    { icon: "📊", title: "Sales Dashboard", desc: "Track revenue, downloads, and ratings in real time." },
    { icon: "🚀", title: "Free to List", desc: "No upfront fees. You only pay when you earn." },
];

const CATEGORIES = [
    { emoji: "💻", label: "Software & Apps" },
    { emoji: "⌨️", label: "Code & Scripts" },
    { emoji: "🌐", label: "WordPress Themes" },
    { emoji: "📗", label: "PDF Books & Guides" },
    { emoji: "🎨", label: "Graphics & Templates" },
    { emoji: "🔤", label: "Fonts" },
    { emoji: "📷", label: "Photos & Media" },
    { emoji: "🎵", label: "Audio & Music" },
    { emoji: "🎬", label: "Video Templates" },
];

const FAQS = [
    { q: "How much does it cost to list a product?", a: "Completely free. You only pay a 20% commission when a sale is made. No upfront fees, no monthly charges." },
    { q: "How do I receive payments?", a: "All payouts are via M-Pesa directly to the number you registered with. Payouts are processed within 24 hours of a sale." },
    { q: "What types of products can I sell?", a: "Any digital product: software, code, themes, PDFs, graphics, fonts, photos, audio, or video files. Physical products are not supported." },
    { q: "How long does it take to get approved?", a: "Product listings are reviewed within 24 hours. Once approved, your product goes live immediately." },
    { q: "Can I sell if I'm not in Kenya?", a: "Yes! Any African developer or creator can list products. Payouts outside Kenya are via bank transfer." },
];

function FAQ({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            onClick={() => setOpen(o => !o)}
            style={{
                border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden",
                cursor: "pointer", transition: "border-color 0.2s",
                borderColor: open ? `${R}40` : "#E2E8F0",
            }}
        >
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", gap: 16,
                background: open ? "#FFF1F2" : "#fff",
                transition: "background 0.2s",
            }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{q}</span>
                <span style={{
                    fontSize: 18, color: R, fontWeight: 700, flexShrink: 0,
                    transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s",
                }}>+</span>
            </div>
            {open && (
                <div style={{ padding: "0 20px 16px", fontSize: 13, color: "#475569", lineHeight: 1.7, background: "#fff" }}>
                    {a}
                </div>
            )}
        </div>
    );
}

export default function SellPage() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; margin: 0; }
                .sell-cta-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 16px 36px; border-radius: 14px; font-size: 16px; font-weight: 700;
                    background: linear-gradient(135deg, ${R}, #F43F5E);
                    color: #fff; border: none; cursor: pointer;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    box-shadow: 0 6px 24px rgba(225,29,72,0.35);
                    text-decoration: none; transition: all 0.2s;
                }
                .sell-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(225,29,72,0.45); }
                .sell-secondary-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 15px 28px; border-radius: 14px; font-size: 15px; font-weight: 600;
                    background: transparent; color: #fff;
                    border: 1.5px solid rgba(255,255,255,0.25); cursor: pointer;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    text-decoration: none; transition: all 0.2s;
                }
                .sell-secondary-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.5); }
                @media (max-width: 640px) {
                    .sell-hero-title { font-size: 28px !important; }
                    .sell-perks-grid { grid-template-columns: 1fr !important; }
                    .sell-steps { flex-direction: column !important; }
                    .sell-step-arrow { display: none !important; }
                    .sell-hero-btns { flex-direction: column !important; align-items: stretch !important; }
                    .sell-hero-btns a, .sell-hero-btns button { justify-content: center; }
                }
            `}</style>

            <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>

                {/* ══ HERO ══ */}
                <div style={{
                    background: "linear-gradient(135deg, #0F172A 0%, #1E1035 50%, #0F172A 100%)",
                    padding: "80px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden",
                }}>
                    {/* Decorative glows */}
                    <div style={{ position: "absolute", top: -80, left: "20%", width: 400, height: 400, borderRadius: "50%", background: R, opacity: 0.08, filter: "blur(80px)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: -60, right: "15%", width: 300, height: 300, borderRadius: "50%", background: "#7C3AED", opacity: 0.08, filter: "blur(70px)", pointerEvents: "none" }} />

                    <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "1.5px", color: R,
                            background: "rgba(225,29,72,0.12)", border: "1px solid rgba(225,29,72,0.25)",
                            borderRadius: 999, padding: "5px 14px", marginBottom: 24,
                        }}>
                            🚀 For Developers & Creators
                        </div>

                        <h1 className="sell-hero-title" style={{
                            fontSize: 44, fontWeight: 800, color: "#fff",
                            letterSpacing: "-1.5px", lineHeight: 1.1,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            margin: "0 0 20px",
                        }}>
                            Sell Your Digital Products<br />
                            <span style={{ color: R }}>Earn via M-Pesa</span>
                        </h1>

                        <p style={{ fontSize: 17, color: "#94A3B8", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
                            List your software, themes, code, or digital products on the
                            Dantechdevs marketplace. Reach thousands of Kenyan businesses
                            and get paid instantly.
                        </p>

                        {/* Trust stats */}
                        <div style={{
                            display: "flex", justifyContent: "center", gap: 32,
                            marginBottom: 40, flexWrap: "wrap",
                        }}>
                            {[["2,800+", "Active Buyers"], ["80%", "Revenue to You"], ["24hr", "Payout Speed"], ["Free", "To List"]].map(([v, l], i) => (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{v}</div>
                                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2, fontWeight: 600 }}>{l}</div>
                                </div>
                            ))}
                        </div>

                        <div className="sell-hero-btns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/auth/register?role=seller" className="sell-cta-btn">
                                🛍️ Start Selling Free
                            </Link>
                            <a href="#how-it-works" className="sell-secondary-btn">
                                How it works ↓
                            </a>
                        </div>
                    </div>
                </div>

                {/* ══ HOW IT WORKS ══ */}
                <div id="how-it-works" style={{ padding: "72px 24px", background: "#fff" }}>
                    <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: R, marginBottom: 12 }}>
                            Simple Process
                        </div>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-1px", margin: "0 0 12px" }}>
                            Start earning in 3 steps
                        </h2>
                        <p style={{ fontSize: 15, color: "#64748B", margin: "0 auto 48px", maxWidth: 480, lineHeight: 1.6 }}>
                            No technical setup needed. List your product and start making money today.
                        </p>
                        <div className="sell-steps" style={{ display: "flex", alignItems: "flex-start", gap: 8, justifyContent: "center" }}>
                            {STEPS.map((s, i) => (
                                <>
                                    <div key={i} style={{
                                        flex: 1, maxWidth: 240, textAlign: "center",
                                        background: "#F8FAFC", border: "1px solid #E2E8F0",
                                        borderRadius: 20, padding: "28px 20px",
                                    }}>
                                        <div style={{
                                            width: 56, height: 56, borderRadius: 16,
                                            background: `${R}12`, border: `1px solid ${R}25`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 26, margin: "0 auto 16px",
                                        }}>{s.icon}</div>
                                        <div style={{
                                            display: "inline-block", fontSize: 10, fontWeight: 800,
                                            color: R, background: `${R}12`, borderRadius: 999,
                                            padding: "2px 10px", marginBottom: 10, letterSpacing: "0.5px",
                                        }}>STEP {i + 1}</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8 }}>{s.title}</div>
                                        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{s.desc}</div>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="sell-step-arrow" style={{ fontSize: 20, color: "#CBD5E1", paddingTop: 40, flexShrink: 0 }}>→</div>
                                    )}
                                </>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ PERKS ══ */}
                <div style={{ padding: "72px 24px", background: "#F8FAFC" }}>
                    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: 48 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: R, marginBottom: 12 }}>Why Dantechdevs</div>
                            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-1px", margin: 0 }}>
                                Everything you need to earn online
                            </h2>
                        </div>
                        <div className="sell-perks-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                            {PERKS.map((p, i) => (
                                <div key={i} style={{
                                    background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16,
                                    padding: "24px", display: "flex", gap: 16, alignItems: "flex-start",
                                    transition: "all 0.2s",
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${R}40`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 16px ${R}10`; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                                >
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                                        background: `${R}10`, border: `1px solid ${R}20`,
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                                    }}>{p.icon}</div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 5 }}>{p.title}</div>
                                        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{p.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ WHAT CAN YOU SELL ══ */}
                <div style={{ padding: "72px 24px", background: "#fff" }}>
                    <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: R, marginBottom: 12 }}>Categories</div>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-1px", margin: "0 0 12px" }}>
                            What can you sell?
                        </h2>
                        <p style={{ fontSize: 15, color: "#64748B", margin: "0 auto 40px", maxWidth: 440, lineHeight: 1.6 }}>
                            Any digital product that helps businesses. Here's what sells best:
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                            {CATEGORIES.map((c, i) => (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "10px 20px", borderRadius: 999,
                                    background: "#F8FAFC", border: "1px solid #E2E8F0",
                                    fontSize: 14, fontWeight: 600, color: "#334155",
                                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                                }}>
                                    <span>{c.emoji}</span> {c.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ FAQ ══ */}
                <div style={{ padding: "72px 24px", background: "#F8FAFC" }}>
                    <div style={{ maxWidth: 680, margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: 40 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: R, marginBottom: 12 }}>FAQ</div>
                            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-1px", margin: 0 }}>
                                Common questions
                            </h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {FAQS.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
                        </div>
                    </div>
                </div>

                {/* ══ BOTTOM CTA ══ */}
                <div style={{
                    background: "linear-gradient(135deg, #0F172A, #1E1035)",
                    padding: "72px 24px", textAlign: "center", position: "relative", overflow: "hidden",
                }}>
                    <div style={{ position: "absolute", top: -60, left: "30%", width: 300, height: 300, borderRadius: "50%", background: R, opacity: 0.07, filter: "blur(70px)", pointerEvents: "none" }} />
                    <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
                        <h2 style={{ fontSize: 34, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-1px", margin: "0 0 14px", lineHeight: 1.15 }}>
                            Ready to start earning?
                        </h2>
                        <p style={{ fontSize: 15, color: "#64748B", margin: "0 auto 36px", lineHeight: 1.7 }}>
                            Join hundreds of Kenyan developers already earning on Dantechdevs. It's free and takes 2 minutes.
                        </p>
                        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/auth/register?role=seller" className="sell-cta-btn">
                                🛍️ Create Seller Account
                            </Link>
                            <Link href="/auth/login" className="sell-secondary-btn">
                                Already have an account →
                            </Link>
                        </div>
                        <p style={{ fontSize: 12, color: "#334155", marginTop: 20 }}>
                            💚 Free to join · M-Pesa payouts · 80% revenue share
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}