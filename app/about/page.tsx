"use client";
import { useState, useEffect, useRef } from "react";

const C = {
    red: "#E11D48",
    blue: "#1D4ED8",
    navy: "#0F172A",
    slate: "#1E293B",
    muted: "#64748B",
    dim: "#94A3B8",
    border: "#E2E8F0",
    bg: "#F8FAFC",
    white: "#FFFFFF",
};

/* ─── Counter animation ─── */
function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let start: number | null = null;
                const step = (ts: number) => {
                    if (!start) start = ts;
                    const p = Math.min((ts - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    setVal(Math.round(ease * end));
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                obs.disconnect();
            }
        }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [end, duration]);
    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Fade-in on scroll ─── */
function FadeIn({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVis(true); obs.disconnect(); }
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    const transforms: Record<string, string> = { up: "translateY(28px)", down: "translateY(-28px)", left: "translateX(-28px)", right: "translateX(28px)" };
    return (
        <div ref={ref} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : transforms[direction],
            transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        }}>
            {children}
        </div>
    );
}

/* ─── Skill bar ─── */
function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [w, setW] = useState(0);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setTimeout(() => setW(pct), 200); obs.disconnect(); }
        }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [pct]);
    return (
        <div ref={ref} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
            </div>
            <div style={{ height: 3, borderRadius: 4, background: `${color}20`, overflow: "hidden" }}>
                <div style={{
                    height: "100%", borderRadius: 4, background: color,
                    width: `${w}%`, transition: "width 1.2s cubic-bezier(.16,1,.3,1)"
                }} />
            </div>
        </div>
    );
}

/* ─── Data ─── */
const TEAM = [
    {
        initials: "DN", name: "Daniel Ngwasi", role: "Founder & CEO",
        desc: "Full-stack developer with 8+ years building enterprise software for African businesses.",
        color: C.blue,
        skills: [{ label: "Next.js / React", pct: 96 }, { label: "Laravel / PHP", pct: 91 }, { label: "System Architecture", pct: 88 }],
        quote: "Every product we ship closes a gap that's held African businesses back.",
    },
    {
        initials: "AK", name: "Amina Kariuki", role: "Lead Developer",
        desc: "Specialist in mobile-first SaaS platforms and M-Pesa payment integrations.",
        color: C.red,
        skills: [{ label: "React Native", pct: 94 }, { label: "Node.js / APIs", pct: 90 }, { label: "M-Pesa Integration", pct: 97 }],
        quote: "M-Pesa isn't a feature — it's the foundation.",
    },
    {
        initials: "JO", name: "James Odhiambo", role: "Product Designer",
        desc: "Creates intuitive UX for clients ranging from SMEs to healthcare providers.",
        color: "#7C3AED",
        skills: [{ label: "Figma / Prototyping", pct: 95 }, { label: "User Research", pct: 87 }, { label: "Design Systems", pct: 89 }],
        quote: "If your grandmother can't use it, the design isn't done.",
    },
    {
        initials: "FW", name: "Faith Wanjiku", role: "Support & Onboarding",
        desc: "Ensures every client gets up and running smoothly with dedicated training.",
        color: "#059669",
        skills: [{ label: "Client Training", pct: 98 }, { label: "Documentation", pct: 92 }, { label: "CRM & Support", pct: 90 }],
        quote: "A client who understands the product stays for life.",
    },
];

const VALUES = [
    { icon: "🎯", title: "Client-First", desc: "Every feature we build solves a real problem for Kenyan and African businesses." },
    { icon: "⚡", title: "Speed & Reliability", desc: "Uptime matters. Our products are built to run 24/7 with minimal downtime." },
    { icon: "🤝", title: "Long-Term Partnership", desc: "We don't just sell software — we grow alongside your business." },
    { icon: "🌍", title: "Built for Africa", desc: "M-Pesa integration, offline-ready, and optimised for local infrastructure." },
    { icon: "🔒", title: "Data Security", desc: "Your clients' data is protected with industry-standard encryption and backups." },
    { icon: "📈", title: "Continuous Innovation", desc: "We ship updates regularly, always improving based on your feedback." },
];

const TIMELINE = [
    { year: "2020", title: "Founded", desc: "Started as a freelance web studio in Nairobi, building custom sites for local businesses.", color: C.blue },
    { year: "2021", title: "First SaaS Product", desc: "Launched BeautyPro, our first vertical SaaS — serving 50 salons in year one.", color: C.red },
    { year: "2022", title: "Expanding the Suite", desc: "ShopFlow and ChurchDesk launched. Crossed 500 active clients across Kenya.", color: "#7C3AED" },
    { year: "2023", title: "Healthcare & Finance", desc: "MediTrack and SaccoSmart entered the market, serving clinics and cooperatives.", color: "#059669" },
    { year: "2024", title: "EduCore & Scale", desc: "Education sector launch. Team grew to 12. Surpassed 2,000 active businesses.", color: "#D97706" },
    { year: "2025–26", title: "Platform Unification", desc: "Unified all products under one dashboard. 2,841 clients. Still growing.", color: C.blue },
];

const STATS = [
    { value: 2841, suffix: "+", label: "Businesses Served" },
    { value: 6, suffix: "", label: "Software Products" },
    { value: 5, suffix: "+", label: "Years Experience" },
    { value: 99, suffix: "%", label: "Uptime SLA" },
];

const TESTIMONIALS = [
    { text: "BeautyPro changed how I run my salon. I used to lose track of appointments every week — now everything runs itself.", name: "Grace Muthoni", biz: "Salon Owner · Westlands", color: C.red, initials: "GM" },
    { text: "ShopFlow's M-Pesa integration is flawless. My customers pay instantly and I see it on my dashboard in real time.", name: "Patrick Omondi", biz: "Retailer · Kisumu CBD", color: C.blue, initials: "PO" },
    { text: "Our church contributions are now fully digital. What used to take a day now takes 10 minutes.", name: "Rev. Esther Kamau", biz: "Church Admin · Thika", color: "#7C3AED", initials: "EK" },
    { text: "EduCore's parent portal has transformed communication. Parents love seeing their child's progress in real time.", name: "David Njoroge", biz: "School Principal · Karen", color: "#059669", initials: "DN" },
    { text: "MediTrack reduced our patient queue time by 40%. The appointment system alone was worth every shilling.", name: "Dr. Aisha Hassan", biz: "Clinic Director · Mombasa", color: "#D97706", initials: "AH" },
    { text: "ChurchDesk is the only tool that actually understands how African churches operate.", name: "Pastor John Waweru", biz: "Lead Pastor · Eldoret", color: C.blue, initials: "JW" },
];

const PRODUCTS = [
    { emoji: "💆", name: "BeautyPro", sector: "Salons & Spas", clients: "820+" },
    { emoji: "🛒", name: "ShopFlow", sector: "Retail", clients: "610+" },
    { emoji: "⛪", name: "ChurchDesk", sector: "Churches", clients: "430+" },
    { emoji: "🏫", name: "EduCore", sector: "Schools", clients: "290+" },
    { emoji: "🏥", name: "MediTrack", sector: "Healthcare", clients: "380+" },
    { emoji: "🤝", name: "SaccoSmart", sector: "Finance", clients: "310+" },
];

export default function AboutPage() {
    const [flippedCard, setFlippedCard] = useState<number | null>(null);
    const [testimonialIdx, setTestimonialIdx] = useState(0);
    const [activeVal, setActiveVal] = useState<number | null>(null);

    useEffect(() => {
        const t = setInterval(() => setTestimonialIdx(i => (i + 3) % TESTIMONIALS.length), 5500);
        return () => clearInterval(t);
    }, []);

    const visibleTestimonials = [
        TESTIMONIALS[testimonialIdx % TESTIMONIALS.length],
        TESTIMONIALS[(testimonialIdx + 1) % TESTIMONIALS.length],
        TESTIMONIALS[(testimonialIdx + 2) % TESTIMONIALS.length],
    ];

    return (
        <div style={{ fontFamily: "'DM Sans', 'Instrument Sans', system-ui, -apple-system, sans-serif", background: C.bg, color: C.navy, overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.blue}30; border-radius: 4px; }

        .about-hero {
          position: relative; min-height: 92vh;
          display: flex; align-items: center;
          background: ${C.navy};
          overflow: hidden;
        }
        .hero-pattern {
          position: absolute; inset: 0; opacity: 0.035;
          background-image: radial-gradient(circle, #fff 1px, transparent 1px);
          background-size: 36px 36px;
        }
        .hero-glow {
          position: absolute; top: -200px; right: -100px;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, ${C.blue}28 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-glow-2 {
          position: absolute; bottom: -200px; left: -100px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, ${C.red}18 0%, transparent 65%);
          pointer-events: none;
        }

        .container { max-width: 1120px; margin: 0 auto; padding: 0 28px; }
        .section { padding: 96px 0; }
        .section-alt { background: ${C.white}; }

        .eyebrow {
          display: inline-block; font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase; color: ${C.blue};
          margin-bottom: 14px;
        }
        .section-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 400; color: ${C.navy};
          letter-spacing: -0.5px; line-height: 1.12;
        }
        .section-title em { color: ${C.red}; font-style: italic; }
        .section-sub {
          font-size: 16px; color: ${C.muted};
          line-height: 1.8; max-width: 540px; margin-top: 14px;
        }

        /* Hero typography */
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(255,255,255,0.45);
          margin-bottom: 24px;
        }
        .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #34D399; }
        .hero-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(42px, 6vw, 78px);
          font-weight: 400; color: #fff;
          line-height: 1.06; letter-spacing: -1px;
          margin-bottom: 22px;
        }
        .hero-title em {
          font-style: italic; color: ${C.red};
        }
        .hero-sub-text {
          font-size: 16px; color: rgba(255,255,255,0.48);
          line-height: 1.8; max-width: 500px; margin-bottom: 36px;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 10px;
          background: ${C.blue}; color: #fff;
          font-weight: 600; font-size: 14px; border: none;
          cursor: pointer; text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 10px;
          background: transparent; color: rgba(255,255,255,0.65);
          font-weight: 600; font-size: 14px;
          border: 1px solid rgba(255,255,255,0.18);
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.35); }

        /* Stat cards */
        .stat-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 28px 22px;
          text-align: center; transition: border-color 0.25s, background 0.25s;
        }
        .stat-card:hover {
          border-color: ${C.blue}45;
          background: rgba(255,255,255,0.08);
        }
        .stat-num {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 44px; color: #fff; line-height: 1;
        }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 8px; font-weight: 500; letter-spacing: 0.3px; }

        /* Marquee */
        .marquee-wrap { background: ${C.slate}; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 18px 0; overflow: hidden; }
        .marquee-track { display: flex; width: max-content; animation: marquee 28s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* Value cards */
        .value-card {
          background: ${C.bg}; border: 1px solid ${C.border};
          border-radius: 16px; padding: 28px 24px; cursor: pointer;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .value-card:hover { border-color: ${C.blue}40; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(29,78,216,0.08); }
        .value-card.active { border-color: ${C.blue}; background: ${C.white}; box-shadow: 0 16px 40px rgba(29,78,216,0.12); }
        .value-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: ${C.blue}10; border: 1px solid ${C.blue}18;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 16px; transition: all 0.25s;
        }
        .value-card.active .value-icon { background: ${C.blue}; }
        .value-title { font-size: 15px; font-weight: 600; color: ${C.navy}; margin-bottom: 8px; }
        .value-desc { font-size: 13px; color: ${C.muted}; line-height: 1.7; }

        /* Timeline */
        .tl-line { width: 2px; background: ${C.border}; position: absolute; left: 50%; top: 0; bottom: 0; transform: translateX(-50%); }
        .tl-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid ${C.white}; box-shadow: 0 0 0 3px ${C.blue}35; flex-shrink: 0; }
        .tl-card { background: ${C.white}; border: 1px solid ${C.border}; border-radius: 14px; padding: 22px 20px; transition: border-color 0.22s, box-shadow 0.22s; }
        .tl-card:hover { border-color: ${C.blue}40; box-shadow: 0 8px 24px rgba(29,78,216,0.08); }

        /* Team flip */
        .team-flip-outer { perspective: 1000px; height: 360px; cursor: pointer; }
        .team-flip-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.55s cubic-bezier(.16,1,.3,1); }
        .team-flip-outer.flipped .team-flip-inner { transform: rotateY(180deg); }
        .team-face { position: absolute; inset: 0; border-radius: 18px; backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden; }
        .team-front { background: ${C.white}; border: 1px solid ${C.border}; padding: 26px 22px; }
        .team-back { background: ${C.navy}; transform: rotateY(180deg); padding: 28px 24px; display: flex; flex-direction: column; justify-content: space-between; }
        .team-avatar { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; color: #fff; margin-bottom: 14px; }

        /* Testimonials */
        .testi-card { background: ${C.white}; border: 1px solid ${C.border}; border-radius: 18px; padding: 28px 24px; position: relative; overflow: hidden; transition: box-shadow 0.25s, transform 0.25s; }
        .testi-card:hover { box-shadow: 0 16px 40px rgba(0,0,0,0.07); transform: translateY(-3px); }

        /* Mission block */
        .mission-block { background: ${C.navy}; border-radius: 24px; padding: 60px 56px; position: relative; overflow: hidden; }
        .mission-glow { position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, ${C.blue}22 0%, transparent 70%); pointer-events: none; }

        /* CTA */
        .cta-section { background: ${C.blue}; padding: 96px 0; }
        .cta-section::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 40px 40px; }

        /* Social link */
        .social-link { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); font-size: 13px; transition: all 0.2s; cursor: pointer; text-decoration: none; }
        .social-link:hover { background: rgba(255,255,255,0.14); color: #fff; }

        @media(max-width: 900px) {
          .hero-2col { grid-template-columns: 1fr !important; }
          .mission-2col { grid-template-columns: 1fr !important; }
          .team-4col { grid-template-columns: 1fr 1fr !important; }
          .val-grid { grid-template-columns: 1fr 1fr !important; }
          .val-layout { grid-template-columns: 1fr !important; }
          .tl-container { padding-left: 0 !important; }
          .tl-side-left { display: none; }
          .mission-block { padding: 36px 28px; }
          .section { padding: 64px 0; }
        }
        @media(max-width: 600px) {
          .hero-title { font-size: 40px; }
          .stat-num { font-size: 34px; }
          .val-grid { grid-template-columns: 1fr !important; }
          .testi-3col { grid-template-columns: 1fr !important; }
          .team-4col { grid-template-columns: 1fr !important; }
        }
      `}</style>

            {/* ══ HERO ══ */}
            <section className="about-hero">
                <div className="hero-pattern" />
                <div className="hero-glow" />
                <div className="hero-glow-2" />
                <div className="container" style={{ position: "relative", zIndex: 1, padding: "120px 28px 80px" }}>
                    <div className="hero-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
                        {/* Left */}
                        <FadeIn direction="left">
                            <div className="hero-eyebrow">
                                <span className="hero-dot" />
                                Est. 2020 · Nairobi, Kenya
                            </div>
                            <h1 className="hero-title">
                                We build software<br />
                                <em>Africa runs on.</em>
                            </h1>
                            <p className="hero-sub-text">
                                Dantechdevs creates vertical SaaS products for salons, churches, schools, clinics, retailers, and SACCOs — purpose-built for how Kenyan businesses actually work.
                            </p>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <a href="/products" className="btn-primary">Explore Products →</a>
                                <a href="/contact" className="btn-outline">Get in Touch</a>
                            </div>

                            {/* Trust signals */}
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 36 }}>
                                <div style={{ display: "flex" }}>
                                    {["GM", "PO", "EK", "DN", "AH"].map((init, idx) => (
                                        <div key={init} style={{
                                            width: 30, height: 30, borderRadius: "50%",
                                            border: "2px solid rgba(255,255,255,0.15)",
                                            background: [C.red, C.blue, "#7C3AED", "#059669", "#D97706"][idx],
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 9, fontWeight: 700, color: "#fff",
                                            marginLeft: idx > 0 ? -8 : 0, zIndex: 5 - idx
                                        }}>{init}</div>
                                    ))}
                                </div>
                                <div>
                                    <div style={{ display: "flex", gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 11, color: "#FBBF24" }}>★</span>)}</div>
                                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Trusted by 2,841+ businesses</div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Right: Stats */}
                        <FadeIn direction="right" delay={160}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                {STATS.map((s, i) => (
                                    <div key={i} className="stat-card">
                                        <div className="stat-num"><CountUp end={s.value} suffix={s.suffix} /></div>
                                        <div className="stat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ══ MARQUEE ══ */}
            <div className="marquee-wrap">
                <div style={{ display: "flex", overflow: "hidden" }}>
                    <div className="marquee-track">
                        {[...PRODUCTS, ...PRODUCTS].map((p, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "0 36px",
                                borderRight: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap"
                            }}>
                                <span style={{ fontSize: 18 }}>{p.emoji}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.name}</span>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{p.clients} clients</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ MISSION ══ */}
            <section className="section section-alt">
                <div className="container">
                    <FadeIn>
                        <div className="mission-block">
                            <div className="mission-glow" />
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <div className="mission-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 52, alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(147,197,253,0.8)", marginBottom: 18 }}>Our Mission</div>
                                        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 400, color: "#fff", lineHeight: 1.18, letterSpacing: "-0.3px" }}>
                                            Close the gap between world-class software and local needs.
                                        </h2>
                                        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.8, marginTop: 18 }}>
                                            Too many African businesses use generic tools that don't understand their context — no M-Pesa support, no Swahili, no offline mode. We exist to change that, one vertical at a time.
                                        </p>
                                        <div style={{ display: "flex", gap: 10, marginTop: 26, flexWrap: "wrap" }}>
                                            {[["🚀", "6 products live"], ["🌍", "8 counties served"], ["⚡", "99% uptime"]].map(([e, t]) => (
                                                <div key={t} style={{
                                                    display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px",
                                                    borderRadius: 9, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
                                                    fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.62)"
                                                }}><span>{e}</span>{t}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(147,197,253,0.8)", marginBottom: 18 }}>Our products</div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                            {PRODUCTS.map(p => (
                                                <div key={p.name} style={{
                                                    display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px",
                                                    borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)",
                                                    fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.72)",
                                                    transition: "background 0.18s", cursor: "pointer"
                                                }}>
                                                    <span>{p.emoji}</span>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", marginTop: 1 }}>{p.sector}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ marginTop: 20, padding: "16px 18px", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
                                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginBottom: 8 }}>Average client rating</div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ display: "flex", gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 18, color: "#FBBF24" }}>★</span>)}</div>
                                                <span style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 26, color: "#fff" }}>4.9</span>
                                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>from 2,841 clients</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ══ VALUES ══ */}
            <section className="section">
                <div className="container">
                    <FadeIn>
                        <div className="val-layout" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 64, alignItems: "flex-start" }}>
                            <div style={{ position: "sticky", top: 110 }}>
                                <div className="eyebrow">What we stand for</div>
                                <h2 className="section-title">Our core <em>values</em></h2>
                                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginTop: 14 }}>
                                    These aren't just words on a wall — they're reflected in every line of code we ship.
                                </p>
                                {activeVal !== null && (
                                    <div style={{ marginTop: 24, padding: "16px 18px", background: `${C.blue}08`, border: `1px solid ${C.blue}18`, borderRadius: 12 }}>
                                        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Selected</div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: C.blue }}>{VALUES[activeVal].title}</div>
                                        <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.65 }}>{VALUES[activeVal].desc}</div>
                                    </div>
                                )}
                            </div>
                            <div className="val-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {VALUES.map((v, i) => (
                                    <FadeIn key={i} delay={i * 60}>
                                        <div className={`value-card${activeVal === i ? " active" : ""}`} onClick={() => setActiveVal(activeVal === i ? null : i)}>
                                            <div className="value-icon">{v.icon}</div>
                                            <div className="value-title">{v.title}</div>
                                            <div className="value-desc">{v.desc}</div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ══ TIMELINE ══ */}
            <section className="section section-alt">
                <div className="container">
                    <FadeIn>
                        <div style={{ textAlign: "center", marginBottom: 64 }}>
                            <div className="eyebrow" style={{ display: "flex", justifyContent: "center" }}>Our journey</div>
                            <h2 className="section-title" style={{ textAlign: "center" }}>From idea to <em>impact</em></h2>
                            <p className="section-sub" style={{ textAlign: "center", margin: "14px auto 0" }}>
                                Six years of building, learning, and growing with our clients across Kenya and East Africa.
                            </p>
                        </div>
                    </FadeIn>

                    <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
                        <div className="tl-line" />
                        {TIMELINE.map((item, i) => (
                            <FadeIn key={i} delay={i * 80} direction={i % 2 === 0 ? "left" : "right"}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 20, marginBottom: 20, alignItems: "flex-start" }}>
                                    {i % 2 === 0 ? (
                                        <div className="tl-card">
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 11, fontWeight: 400, color: C.white, background: item.color, borderRadius: 6, padding: "2px 9px" }}>{item.year}</span>
                                                <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{item.title}</span>
                                            </div>
                                            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{item.desc}</p>
                                        </div>
                                    ) : <div />}
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16 }}>
                                        <div className="tl-dot" style={{ background: item.color }} />
                                    </div>
                                    {i % 2 !== 0 ? (
                                        <div className="tl-card tl-side-left">
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 11, fontWeight: 400, color: C.white, background: item.color, borderRadius: 6, padding: "2px 9px" }}>{item.year}</span>
                                                <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{item.title}</span>
                                            </div>
                                            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{item.desc}</p>
                                        </div>
                                    ) : <div />}
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TEAM ══ */}
            <section className="section">
                <div className="container">
                    <FadeIn>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 20 }}>
                            <div>
                                <div className="eyebrow">The people behind it</div>
                                <h2 className="section-title">Meet the <em>team</em></h2>
                                <p className="section-sub" style={{ fontSize: 14, marginTop: 10 }}>Click a card to flip it and read their story.</p>
                            </div>
                            <a href="/contact" style={{
                                display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px",
                                borderRadius: 9, border: `1px solid ${C.border}`, background: C.white,
                                color: C.navy, fontWeight: 600, fontSize: 13, textDecoration: "none",
                                transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif"
                            }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = C.blue)}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                                We're hiring →
                            </a>
                        </div>
                    </FadeIn>

                    <div className="team-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
                        {TEAM.map((member, i) => (
                            <FadeIn key={i} delay={i * 80} direction="up">
                                <div className={`team-flip-outer${flippedCard === i ? " flipped" : ""}`} onClick={() => setFlippedCard(flippedCard === i ? null : i)}>
                                    <div className="team-flip-inner">
                                        {/* Front */}
                                        <div className="team-face team-front">
                                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: member.color, borderRadius: "18px 18px 0 0" }} />
                                            <div className="team-avatar" style={{ background: member.color }}>{member.initials}</div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 2 }}>{member.name}</div>
                                            <div style={{ fontSize: 11, fontWeight: 600, color: member.color, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>{member.role}</div>
                                            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, marginBottom: 18 }}>{member.desc}</p>
                                            <div>
                                                {member.skills.map(s => (
                                                    <SkillBar key={s.label} label={s.label} pct={s.pct} color={member.color} />
                                                ))}
                                            </div>
                                            <div style={{ position: "absolute", bottom: 14, right: 16, fontSize: 10, color: C.dim }}>Tap to flip →</div>
                                        </div>
                                        {/* Back */}
                                        <div className="team-face team-back">
                                            <div>
                                                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{member.name}</div>
                                                <div style={{ fontSize: 11, fontWeight: 600, color: member.color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 18 }}>{member.role}</div>
                                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", fontStyle: "italic", lineHeight: 1.7, marginBottom: 22 }}>"{member.quote}"</p>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                                    {member.skills.map(s => (
                                                        <span key={s.label} style={{ padding: "4px 9px", borderRadius: 6, background: `${member.color}22`, color: member.color, border: `1px solid ${member.color}30`, fontSize: 11, fontWeight: 500 }}>
                                                            {s.label.split("/")[0].trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 8 }}>Connect</div>
                                                <div style={{ display: "flex", gap: 7 }}>
                                                    {[["in", "LinkedIn"], ["𝕏", "Twitter"], ["gh", "GitHub"]].map(([icon, label]) => (
                                                        <a key={label} href="#" className="social-link" title={label}>{icon}</a>
                                                    ))}
                                                </div>
                                                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 14 }}>← Tap to flip back</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIALS ══ */}
            <section className="section section-alt">
                <div className="container">
                    <FadeIn>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 20 }}>
                            <div>
                                <div className="eyebrow">Real clients, real results</div>
                                <h2 className="section-title">What our clients <em>say</em></h2>
                                <p className="section-sub" style={{ fontSize: 14, marginTop: 10 }}>Hear from the 2,841+ businesses that trust Dantechdevs every day.</p>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {[0, 3].map(idx => (
                                    <button key={idx} onClick={() => setTestimonialIdx(idx)} style={{
                                        width: testimonialIdx === idx ? 28 : 8, height: 8, borderRadius: 4,
                                        background: testimonialIdx === idx ? C.blue : C.border,
                                        border: "none", cursor: "pointer", transition: "all 0.25s"
                                    }} />
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    <div className="testi-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                        {visibleTestimonials.map((t, i) => (
                            <FadeIn key={`${testimonialIdx}-${i}`} delay={i * 70} direction="up">
                                <div className="testi-card">
                                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color, borderRadius: "18px 18px 0 0" }} />
                                    <div style={{ fontFamily: "Georgia, serif", fontSize: 38, lineHeight: 1, color: C.border, marginBottom: 4 }}>"</div>
                                    <p style={{ fontSize: 14, color: C.slate, lineHeight: 1.75, marginBottom: 22 }}>{t.text}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{
                                            width: 38, height: 38, borderRadius: "50%",
                                            background: t.color, display: "flex", alignItems: "center",
                                            justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0
                                        }}>{t.initials}</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13, color: C.navy }}>{t.name}</div>
                                            <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{t.biz}</div>
                                        </div>
                                        <div style={{ marginLeft: "auto", display: "flex", gap: 1 }}>
                                            {[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 11, color: "#FBBF24" }}>★</span>)}
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    {/* Rating summary */}
                    <FadeIn delay={280}>
                        <div style={{ marginTop: 48, background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: "28px 32px", display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 52, color: C.navy, lineHeight: 1 }}>4.9</div>
                                <div style={{ display: "flex", gap: 2, justifyContent: "center", margin: "7px 0 4px" }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 16, color: "#FBBF24" }}>★</span>)}</div>
                                <div style={{ fontSize: 11, color: C.muted }}>Overall Rating</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 180 }}>
                                {[[5, "88%"], [4, "10%"], [3, "1.5%"], [2, "0.3%"], [1, "0.2%"]].map(([stars, pct]) => (
                                    <div key={stars} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                        <span style={{ fontSize: 11, color: C.muted, width: 10 }}>{stars}</span>
                                        <span style={{ fontSize: 11, color: "#FBBF24" }}>★</span>
                                        <div style={{ flex: 1, height: 5, borderRadius: 4, background: C.bg, overflow: "hidden" }}>
                                            <div style={{ height: "100%", borderRadius: 4, background: "#FBBF24", width: String(pct) }} />
                                        </div>
                                        <span style={{ fontSize: 11, color: C.muted, width: 34 }}>{pct}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {[["< 2 hrs", "Response Time"], ["97%", "Resolution Rate"], ["72", "NPS Score"], ["94%", "Renewals"]].map(([v, k]) => (
                                    <div key={k} style={{ textAlign: "center", padding: "12px 14px", background: C.bg, borderRadius: 10 }}>
                                        <div style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 20, color: C.navy }}>{v}</div>
                                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{k}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ══ CTA ══ */}
            <section className="cta-section" style={{ position: "relative" }}>
                <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <FadeIn>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: 18 }}>Ready to get started?</div>
                        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 400, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 18 }}>
                            Your business deserves<br />better software.
                        </h2>
                        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.52)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.8 }}>
                            Join 2,841+ businesses already using Dantechdevs to run more efficiently.
                        </p>
                        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="/products" style={{
                                display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px",
                                borderRadius: 10, background: "#fff", color: C.blue, fontWeight: 700, fontSize: 14,
                                textDecoration: "none", transition: "opacity 0.2s", fontFamily: "'DM Sans', sans-serif"
                            }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                                Browse Products →
                            </a>
                            <a href="/contact" style={{
                                display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px",
                                borderRadius: 10, background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 600, fontSize: 14,
                                border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", transition: "background 0.2s",
                                fontFamily: "'DM Sans', sans-serif"
                            }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}>
                                Contact Us
                            </a>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 48, flexWrap: "wrap" }}>
                            {[["✓", "No contracts"], ["✓", "Free onboarding"], ["✓", "M-Pesa ready"], ["✓", "24/7 support"]].map(([c, t]) => (
                                <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                                    <span style={{ color: "#34D399", fontWeight: 700 }}>{c}</span>{t}
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}