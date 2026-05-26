"use client";
import { useState, useEffect, useRef } from "react";

/* ─── Brand palette ─── */
const C = {
    red: "#E11D48",
    redLt: "#FB7185",
    blue: "#2563EB",
    blueLt: "#3B82F6",
    navy: "#0F172A",
    slate: "#1E293B",
    muted: "#64748B",
    dim: "#94A3B8",
    border: "#E2E8F0",
    bg: "#F8FAFC",
    white: "#FFFFFF",
};

/* ─── Counter animation ─── */
function CountUp({ end, suffix = "", duration = 2000 }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let start = null;
                const step = (ts) => {
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
function FadeIn({ children, delay = 0, direction = "up" }) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVis(true); obs.disconnect(); }
        }, { threshold: 0.12 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    const transforms = { up: "translateY(36px)", down: "translateY(-36px)", left: "translateX(-36px)", right: "translateX(36px)" };
    return (
        <div ref={ref} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : transforms[direction],
            transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        }}>
            {children}
        </div>
    );
}

/* ─── Animated skill bar ─── */
function SkillBar({ label, pct, color }) {
    const ref = useRef(null);
    const [w, setW] = useState(0);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setTimeout(() => setW(pct), 200); obs.disconnect(); }
        }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [pct]);
    return (
        <div ref={ref} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{pct}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 4, background: `${color}18`, overflow: "hidden" }}>
                <div style={{
                    height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    width: `${w}%`, transition: "width 1.2s cubic-bezier(.16,1,.3,1)"
                }} />
            </div>
        </div>
    );
}

/* ─── Floating orb canvas ─── */
function OrbCanvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let raf;
        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener("resize", resize);

        const orbs = Array.from({ length: 6 }, (_, i) => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 80 + Math.random() * 160,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            color: i % 2 === 0 ? "#2563EB" : "#E11D48",
            alpha: 0.06 + Math.random() * 0.08,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            orbs.forEach(o => {
                const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
                g.addColorStop(0, o.color + Math.round(o.alpha * 255).toString(16).padStart(2, "0"));
                g.addColorStop(1, "transparent");
                ctx.beginPath();
                ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
                o.x += o.vx; o.y += o.vy;
                if (o.x < -o.r) o.x = canvas.width + o.r;
                if (o.x > canvas.width + o.r) o.x = -o.r;
                if (o.y < -o.r) o.y = canvas.height + o.r;
                if (o.y > canvas.height + o.r) o.y = -o.r;
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

/* ─── Section nav dots ─── */
const SECTIONS = ["Hero", "Mission", "Values", "Journey", "Team", "Testimonials", "CTA"];
function NavDots({ active }) {
    return (
        <div style={{
            position: "fixed", right: 24, top: "50%", transform: "translateY(-50%)", zIndex: 50,
            display: "flex", flexDirection: "column", gap: 10
        }}>
            {SECTIONS.map((s, i) => (
                <div key={i} title={s} onClick={() => document.querySelectorAll("[data-section]")[i]?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                        width: active === i ? 10 : 6, height: active === i ? 10 : 6, borderRadius: "50%",
                        background: active === i ? C.blue : C.dim, cursor: "pointer",
                        transition: "all 0.3s", boxShadow: active === i ? `0 0 0 3px ${C.blue}30` : "none"
                    }} />
            ))}
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
        social: { linkedin: "#", twitter: "#", github: "#" },
        quote: "\"Every product we ship closes a gap that's held African businesses back.\"",
    },
    {
        initials: "AK", name: "Amina Kariuki", role: "Lead Developer",
        desc: "Specialist in mobile-first SaaS platforms and M-Pesa payment integrations.",
        color: C.red,
        skills: [{ label: "React Native", pct: 94 }, { label: "Node.js / APIs", pct: 90 }, { label: "M-Pesa Integration", pct: 97 }],
        social: { linkedin: "#", twitter: "#", github: "#" },
        quote: "\"M-Pesa isn't a feature — it's the foundation. Everything else builds on trust.\"",
    },
    {
        initials: "JO", name: "James Odhiambo", role: "Product Designer",
        desc: "Creates intuitive UX for clients ranging from SMEs to healthcare providers.",
        color: "#7C3AED",
        skills: [{ label: "Figma / Prototyping", pct: 95 }, { label: "User Research", pct: 87 }, { label: "Design Systems", pct: 89 }],
        social: { linkedin: "#", twitter: "#", github: "#" },
        quote: "\"If your grandmother can't use it, the design isn't done.\"",
    },
    {
        initials: "FW", name: "Faith Wanjiku", role: "Support & Onboarding",
        desc: "Ensures every client gets up and running smoothly with dedicated training.",
        color: "#059669",
        skills: [{ label: "Client Training", pct: 98 }, { label: "Documentation", pct: 92 }, { label: "CRM & Support", pct: 90 }],
        social: { linkedin: "#", twitter: "#", github: "#" },
        quote: "\"A client who understands the product is a client who stays for life.\"",
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
    { year: "2020", title: "Founded", desc: "Dantechdevs started as a freelance web studio in Nairobi, building custom sites for local businesses.", icon: "🌱" },
    { year: "2021", title: "First SaaS Product", desc: "Launched BeautyPro, our first vertical SaaS — serving 50 salons in year one.", icon: "💆" },
    { year: "2022", title: "Expanding the Suite", desc: "ShopFlow and ChurchDesk launched. Crossed 500 active clients across Kenya.", icon: "🚀" },
    { year: "2023", title: "Healthcare & Finance", desc: "MediTrack and SaccoSmart entered the market, serving clinics and cooperatives.", icon: "🏥" },
    { year: "2024", title: "EduCore & Scale", desc: "Education sector launch. Team grew to 12. Surpassed 2,000 active businesses.", icon: "🎓" },
    { year: "2025–26", title: "Platform Unification", desc: "Unified all products under one dashboard. 2,841 clients. Still growing.", icon: "🌐" },
];

const STATS = [
    { value: 2841, suffix: "+", label: "Businesses Served" },
    { value: 6, suffix: "", label: "Software Products" },
    { value: 5, suffix: "+", label: "Years Experience" },
    { value: 99, suffix: "%", label: "Uptime SLA" },
];

const TESTIMONIALS = [
    {
        text: "BeautyPro changed how I run my salon. I used to lose track of appointments every week — now everything runs itself.",
        name: "Grace Muthoni",
        biz: "Salon Owner · Westlands, Nairobi",
        rating: 5,
        color: C.red,
        initials: "GM",
    },
    {
        text: "ShopFlow's M-Pesa integration is flawless. My customers pay instantly and I see it on my dashboard in real time.",
        name: "Patrick Omondi",
        biz: "Retailer · Kisumu CBD",
        rating: 5,
        color: C.blue,
        initials: "PO",
    },
    {
        text: "Our church contributions are now fully digital. SaccoSmart made reconciliation what used to take a day now takes 10 minutes.",
        name: "Rev. Esther Kamau",
        biz: "Church Administrator · Thika",
        rating: 5,
        color: "#7C3AED",
        initials: "EK",
    },
    {
        text: "EduCore's parent portal has transformed communication. Parents love seeing their child's progress in real time.",
        name: "David Njoroge",
        biz: "School Principal · Karen",
        rating: 5,
        color: "#059669",
        initials: "DN",
    },
    {
        text: "MediTrack reduced our patient queue time by 40%. The appointment system alone was worth every shilling.",
        name: "Dr. Aisha Hassan",
        biz: "Clinic Director · Mombasa",
        rating: 5,
        color: "#D97706",
        initials: "AH",
    },
    {
        text: "ChurchDesk is the only tool that actually understands how African churches operate. The tithe tracking is a blessing.",
        name: "Pastor John Waweru",
        biz: "Lead Pastor · Eldoret",
        rating: 5,
        color: C.blue,
        initials: "JW",
    },
];

const PRODUCTS = [
    { emoji: "💆", name: "BeautyPro", clients: "820+", sector: "Salons & Spas" },
    { emoji: "🛒", name: "ShopFlow", clients: "610+", sector: "Retail" },
    { emoji: "⛪", name: "ChurchDesk", clients: "430+", sector: "Churches" },
    { emoji: "🏫", name: "EduCore", clients: "290+", sector: "Schools" },
    { emoji: "🏥", name: "MediTrack", clients: "380+", sector: "Healthcare" },
    { emoji: "🤝", name: "SaccoSmart", clients: "310+", sector: "Finance" },
];

export default function AboutPage() {
    const [activeVal, setActiveVal] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const [flippedCard, setFlippedCard] = useState(null);
    const [testimonialIdx, setTestimonialIdx] = useState(0);

    /* Section observer for nav dots */
    useEffect(() => {
        const sections = document.querySelectorAll("[data-section]");
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) setActiveSection(Number(e.target.dataset.section));
            });
        }, { threshold: 0.4 });
        sections.forEach(s => obs.observe(s));
        return () => obs.disconnect();
    }, []);

    /* Auto-advance testimonials */
    useEffect(() => {
        const t = setInterval(() => setTestimonialIdx(i => (i + 2) % TESTIMONIALS.length), 5000);
        return () => clearInterval(t);
    }, []);

    const visibleTestimonials = [
        TESTIMONIALS[testimonialIdx % TESTIMONIALS.length],
        TESTIMONIALS[(testimonialIdx + 1) % TESTIMONIALS.length],
        TESTIMONIALS[(testimonialIdx + 2) % TESTIMONIALS.length],
    ];

    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.bg, color: C.navy, overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: ${C.blue}40; border-radius: 3px; }

        /* ── Hero ── */
        .about-hero { position: relative; min-height: 95vh; display: flex; align-items: center; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, ${C.navy} 0%, ${C.slate} 60%, #100a24 100%); }
        .hero-grid { position: absolute; inset: 0;
          background-image:
            linear-gradient(${C.blue}08 1px, transparent 1px),
            linear-gradient(90deg, ${C.blue}08 1px, transparent 1px);
          background-size: 72px 72px; }

        /* ── Marquee ── */
        .marquee-track { display: flex; gap: 0; width: max-content; animation: marquee 30s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track:hover { animation-play-state: paused; }

        /* ── Tags & chips ── */
        .tag-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px;
          background: ${C.blue}18; border: 1px solid ${C.blue}35; color: #93C5FD;
          font-size: 12px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 24px; }
        .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(40px, 6vw, 82px); font-weight: 800;
          line-height: 1.04; color: #fff; letter-spacing: -2px; }
        .hero-title span { background: linear-gradient(90deg, ${C.red}, ${C.redLt}, #F97316);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-sub { font-size: 17px; color: rgba(255,255,255,0.52); line-height: 1.75; max-width: 540px; margin-top: 20px; }

        .hero-cta { display: inline-flex; align-items: center; gap: 10px; padding: 15px 30px; border-radius: 12px;
          background: linear-gradient(135deg, ${C.blue}, ${C.blueLt}); color: #fff; font-weight: 700; font-size: 15px;
          border: none; cursor: pointer; transition: all 0.22s; text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif; }
        .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 36px ${C.blue}55; }
        .hero-cta-outline { display: inline-flex; align-items: center; gap: 10px; padding: 15px 30px; border-radius: 12px;
          background: transparent; color: rgba(255,255,255,0.72); font-weight: 700; font-size: 15px;
          border: 1px solid rgba(255,255,255,0.18); cursor: pointer; transition: all 0.22s;
          font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none; }
        .hero-cta-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.38); }

        /* ── Stat cards ── */
        .stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px; padding: 26px 20px; text-align: center; backdrop-filter: blur(12px); transition: all 0.28s; }
        .stat-card:hover { background: rgba(255,255,255,0.09); border-color: ${C.blue}50; transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(37,99,235,0.2); }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; color: #fff; line-height: 1; }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 6px; font-weight: 600; letter-spacing: 0.5px; }

        /* ── Sections ── */
        .section { padding: 110px 0; }
        .section-alt { background: ${C.white}; }
        .section-dark { background: ${C.navy}; }
        .container { max-width: 1160px; margin: 0 auto; padding: 0 32px; }
        .section-tag { font-size: 11px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: ${C.blue}; margin-bottom: 12px; }
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 46px); font-weight: 800;
          color: ${C.navy}; letter-spacing: -1px; line-height: 1.12; }
        .section-title span { color: ${C.red}; }
        .section-sub { font-size: 17px; color: ${C.muted}; line-height: 1.75; max-width: 580px; margin-top: 14px; }

        /* ── Value cards ── */
        .value-card { background: ${C.bg}; border: 1px solid ${C.border}; border-radius: 20px; padding: 30px 26px;
          cursor: pointer; transition: all 0.28s; position: relative; overflow: hidden; }
        .value-card::before { content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, ${C.blue}06, transparent); opacity: 0; transition: opacity 0.3s; }
        .value-card:hover { border-color: ${C.blue}45; transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(37,99,235,0.1); }
        .value-card:hover::before { opacity: 1; }
        .value-card.active { border-color: ${C.blue}; background: ${C.white}; box-shadow: 0 20px 48px rgba(37,99,235,0.15); }
        .value-icon { width: 54px; height: 54px; border-radius: 16px; background: ${C.blue}12; border: 1px solid ${C.blue}22;
          display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 18px; transition: all 0.28s; }
        .value-card:hover .value-icon, .value-card.active .value-icon { background: ${C.blue}; transform: scale(1.08) rotate(-3deg); }

        /* ── Team flip cards ── */
        .team-flip-outer { perspective: 1000px; height: 340px; cursor: pointer; }
        .team-flip-inner { position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(.16,1,.3,1); }
        .team-flip-outer.flipped .team-flip-inner { transform: rotateY(180deg); }
        .team-face { position: absolute; inset: 0; border-radius: 22px; backface-visibility: hidden;
          -webkit-backface-visibility: hidden; overflow: hidden; }
        .team-front { background: ${C.white}; border: 1px solid ${C.border}; padding: 28px 24px; }
        .team-back { background: linear-gradient(135deg, ${C.navy}, ${C.slate}); transform: rotateY(180deg);
          padding: 32px 26px; display: flex; flex-direction: column; justify-content: space-between; border: none; }
        .team-avatar { width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-weight: 800; font-size: 22px; color: #fff; margin-bottom: 16px; }
        .skill-tag { display: inline-flex; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin: 2px; }
        .social-link { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px;
          border-radius: 10px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.6); font-size: 14px; transition: all 0.2s; cursor: pointer; text-decoration: none; }
        .social-link:hover { background: rgba(255,255,255,0.16); color: #fff; }

        /* ── Timeline ── */
        .tl-item { display: grid; grid-template-columns: 1fr 40px 1fr; gap: 20px; align-items: flex-start; }
        .tl-center { display: flex; flex-direction: column; align-items: center; gap: 0; padding-top: 20px; }
        .tl-dot { width: 16px; height: 16px; border-radius: 50%; background: ${C.blue}; border: 3px solid ${C.white};
          box-shadow: 0 0 0 3px ${C.blue}35; flex-shrink: 0; z-index: 1; }
        .tl-line-seg { flex: 1; width: 2px; background: linear-gradient(to bottom, ${C.blue}40, ${C.blue}15); min-height: 60px; }
        .tl-card { background: ${C.white}; border: 1px solid ${C.border}; border-radius: 18px; padding: 24px 22px;
          transition: all 0.25s; }
        .tl-card:hover { border-color: ${C.blue}45; box-shadow: 0 12px 32px rgba(37,99,235,0.1); transform: translateY(-2px); }

        /* ── Testimonials ── */
        .testi-card { background: ${C.white}; border: 1px solid ${C.border}; border-radius: 22px; padding: 32px 28px;
          transition: all 0.35s; position: relative; overflow: hidden; }
        .testi-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .testi-card:hover { box-shadow: 0 20px 50px rgba(0,0,0,0.09); transform: translateY(-4px); border-color: transparent; }
        .testi-quote { font-size: 42px; line-height: 1; color: ${C.border}; font-family: Georgia, serif; margin-bottom: 8px; }

        /* ── Mission block ── */
        .mission-block { background: linear-gradient(135deg, ${C.navy} 0%, ${C.slate} 100%);
          border-radius: 28px; padding: 64px; position: relative; overflow: hidden; }
        .mission-block::before { content: ''; position: absolute; top: -120px; right: -120px; width: 450px; height: 450px;
          border-radius: 50%; background: radial-gradient(circle, ${C.blue}22 0%, transparent 70%); pointer-events: none; }
        .mission-block::after { content: ''; position: absolute; bottom: -100px; left: -100px; width: 350px; height: 350px;
          border-radius: 50%; background: radial-gradient(circle, ${C.red}18 0%, transparent 70%); pointer-events: none; }
        .product-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 12px;
          background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.78); transition: all 0.2s; cursor: pointer; }
        .product-pill:hover { background: rgba(255,255,255,0.13); border-color: ${C.blue}60; color: #fff; transform: translateY(-1px); }

        /* ── CTA ── */
        .cta-section { background: linear-gradient(135deg, ${C.blue} 0%, #1D4ED8 50%, #1E40AF 100%);
          padding: 110px 0; position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 52px 52px; }

        /* ── Marquee strip ── */
        .marquee-strip { background: ${C.slate}; border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06); padding: 20px 0; overflow: hidden; }

        /* ── Testi dot nav ── */
        .testi-dot { width: 8px; height: 8px; border-radius: 50%; cursor: pointer; transition: all 0.25s; }

        @keyframes scrollDot { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(12px); opacity: 0; } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 ${C.blue}60; } 70% { box-shadow: 0 0 0 10px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }

        @media(max-width: 900px) {
          .hero-2col { grid-template-columns: 1fr !important; }
          .mission-2col { grid-template-columns: 1fr !important; }
          .tl-item { grid-template-columns: 1fr !important; }
          .tl-center { display: none; }
          .tl-right { display: none; }
          .val-2col { grid-template-columns: 1fr 1fr !important; }
          .section { padding: 72px 0; }
          .mission-block { padding: 36px 24px; }
        }
        @media(max-width: 600px) {
          .hero-title { font-size: 36px; letter-spacing: -1px; }
          .stat-num { font-size: 32px; }
          .val-2col { grid-template-columns: 1fr !important; }
          .testi-3col { grid-template-columns: 1fr !important; }
          .team-4col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

            <NavDots active={activeSection} />

            {/* ══════════ HERO ══════════ */}
            <section className="about-hero" data-section="0">
                <div className="hero-bg" />
                <div className="hero-grid" />
                <OrbCanvas />

                <div className="container" style={{ position: "relative", zIndex: 1, padding: "130px 32px 90px" }}>
                    <div className="hero-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
                        {/* Left */}
                        <FadeIn direction="left">
                            <div className="tag-chip">
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399", animation: "pulse-ring 2s infinite" }} />
                                EST. 2020 · NAIROBI, KENYA
                            </div>
                            <h1 className="hero-title">
                                We build software<br />
                                <span>Africa runs on.</span>
                            </h1>
                            <p className="hero-sub">
                                Dantechdevs creates vertical SaaS products for salons, churches, schools, clinics, retailers, and SACCOs — purpose-built for how Kenyan businesses actually work.
                            </p>
                            <div style={{ display: "flex", gap: 14, marginTop: 38, flexWrap: "wrap" }}>
                                <a href="/products" className="hero-cta">Explore Our Products →</a>
                                <a href="/contact" className="hero-cta-outline">Get in Touch</a>
                            </div>

                            {/* Trust signals */}
                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40 }}>
                                <div style={{ display: "flex" }}>
                                    {["GM", "PO", "EK", "DN", "AH"].map((i, idx) => (
                                        <div key={i} style={{
                                            width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)",
                                            background: [C.red, C.blue, "#7C3AED", "#059669", "#D97706"][idx],
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 10, fontWeight: 700, color: "#fff", marginLeft: idx > 0 ? -10 : 0, zIndex: 5 - idx
                                        }}>
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div style={{ display: "flex", gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 12, color: "#FBBF24" }}>★</span>)}</div>
                                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Trusted by 2,841+ businesses</div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Right: Stats */}
                        <FadeIn direction="right" delay={180}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {STATS.map((s, i) => (
                                    <div key={i} className="stat-card">
                                        <div className="stat-num"><CountUp end={s.value} suffix={s.suffix} /></div>
                                        <div className="stat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Scroll to explore</span>
                                    <div style={{
                                        width: 24, height: 40, borderRadius: 12, border: "2px solid rgba(255,255,255,0.18)",
                                        display: "flex", justifyContent: "center", paddingTop: 6
                                    }}>
                                        <div style={{ width: 4, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.45)", animation: "scrollDot 1.8s infinite" }} />
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ══════════ MARQUEE STRIP ══════════ */}
            <div className="marquee-strip">
                <div style={{ display: "flex", overflow: "hidden" }}>
                    <div className="marquee-track">
                        {[...PRODUCTS, ...PRODUCTS].map((p, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "0 40px",
                                borderRight: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap"
                            }}>
                                <span style={{ fontSize: 20 }}>{p.emoji}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.name}</span>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{p.clients} clients</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════ MISSION ══════════ */}
            <section className="section section-alt" data-section="1">
                <div className="container">
                    <FadeIn>
                        <div className="mission-block">
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <div className="mission-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#93C5FD", marginBottom: 16 }}>Our Mission</div>
                                        <h2 style={{
                                            fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800,
                                            color: "#fff", lineHeight: 1.15, letterSpacing: "-0.5px"
                                        }}>
                                            Close the gap between world-class software and local needs.
                                        </h2>
                                        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.48)", lineHeight: 1.8, marginTop: 18 }}>
                                            Too many African businesses use generic tools that don't understand their context — no M-Pesa support, no Swahili, no offline mode. We exist to change that, one vertical at a time.
                                        </p>
                                        {/* Metric pills */}
                                        <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                                            {[["🚀", "6 products live"], ["🌍", "8 counties served"], ["⚡", "99% uptime"]].map(([e, t]) => (
                                                <div key={t} style={{
                                                    display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px",
                                                    borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                                                    fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)"
                                                }}>
                                                    <span>{e}</span>{t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#93C5FD", marginBottom: 20 }}>Products we've built</div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                            {PRODUCTS.map(p => (
                                                <div key={p.name} className="product-pill">
                                                    <span>{p.emoji}</span>
                                                    <div>
                                                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                                                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{p.sector}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{
                                            marginTop: 24, padding: "18px 20px", background: "rgba(255,255,255,0.05)",
                                            borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)"
                                        }}>
                                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginBottom: 8 }}>Average client rating</div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ display: "flex", gap: 3 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 20, color: "#FBBF24" }}>★</span>)}</div>
                                                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: "#fff" }}>4.9</span>
                                                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.32)" }}>from 2,841 clients</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ══════════ VALUES ══════════ */}
            <section className="section" data-section="2">
                <div className="container">
                    <FadeIn>
                        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 72, alignItems: "flex-start" }}>
                            <div style={{ position: "sticky", top: 120 }}>
                                <div className="section-tag">What we stand for</div>
                                <h2 className="section-title">Our core <span>values</span></h2>
                                <p className="section-sub" style={{ fontSize: 15 }}>These aren't just words on a wall — they're reflected in every line of code we ship.</p>
                                <div style={{
                                    marginTop: 28, padding: "18px 20px", background: `${C.blue}08`,
                                    border: `1px solid ${C.blue}20`, borderRadius: 16
                                }}>
                                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Active value</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>
                                        {activeVal !== null ? `↗ ${VALUES[activeVal].title}` : "Click a card to explore"}
                                    </div>
                                    {activeVal !== null && (
                                        <div style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
                                            {VALUES[activeVal].desc}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="val-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                {VALUES.map((v, i) => (
                                    <FadeIn key={i} delay={i * 70} direction="up">
                                        <div className={`value-card${activeVal === i ? " active" : ""}`}
                                            onClick={() => setActiveVal(activeVal === i ? null : i)}>
                                            <div className="value-icon">{v.icon}</div>
                                            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: C.navy, marginBottom: 8 }}>{v.title}</div>
                                            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{v.desc}</div>
                                            {activeVal === i && (
                                                <div style={{
                                                    marginTop: 14, display: "flex", alignItems: "center", gap: 6,
                                                    fontSize: 12, fontWeight: 700, color: C.blue
                                                }}>
                                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue }} />
                                                    Selected
                                                </div>
                                            )}
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ══════════ TIMELINE ══════════ */}
            <section className="section section-alt" data-section="3">
                <div className="container">
                    <FadeIn>
                        <div style={{ textAlign: "center", marginBottom: 70 }}>
                            <div className="section-tag" style={{ display: "flex", justifyContent: "center" }}>Our journey</div>
                            <h2 className="section-title" style={{ textAlign: "center" }}>From idea to <span>impact</span></h2>
                            <p className="section-sub" style={{ textAlign: "center", margin: "14px auto 0" }}>
                                Six years of building, learning, and growing with our clients across Kenya and East Africa.
                            </p>
                        </div>
                    </FadeIn>

                    <div style={{ maxWidth: 860, margin: "0 auto" }}>
                        {TIMELINE.map((item, i) => (
                            <FadeIn key={i} delay={i * 90} direction={i % 2 === 0 ? "left" : "right"}>
                                <div className="tl-item" style={{ marginBottom: 16 }}>
                                    {/* Left slot */}
                                    {i % 2 === 0 ? (
                                        <div className="tl-card">
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                                <span style={{ fontSize: 22 }}>{item.icon}</span>
                                                <span style={{
                                                    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13,
                                                    color: C.white, background: C.blue, borderRadius: 8, padding: "3px 10px"
                                                }}>{item.year}</span>
                                                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: C.navy }}>{item.title}</span>
                                            </div>
                                            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{item.desc}</p>
                                        </div>
                                    ) : <div />}
                                    {/* Center */}
                                    <div className="tl-center">
                                        <div className="tl-line-seg" />
                                        <div className="tl-dot" />
                                        <div className="tl-line-seg" />
                                    </div>
                                    {/* Right slot */}
                                    {i % 2 !== 0 ? (
                                        <div className="tl-card tl-right">
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                                <span style={{ fontSize: 22 }}>{item.icon}</span>
                                                <span style={{
                                                    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13,
                                                    color: C.white, background: C.red, borderRadius: 8, padding: "3px 10px"
                                                }}>{item.year}</span>
                                                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: C.navy }}>{item.title}</span>
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

            {/* ══════════ TEAM (flip cards) ══════════ */}
            <section className="section" data-section="4">
                <div className="container">
                    <FadeIn>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 20 }}>
                            <div>
                                <div className="section-tag">The people behind it</div>
                                <h2 className="section-title">Meet the <span>team</span></h2>
                                <p className="section-sub">Hover a card to see skills. Click to flip and read their story.</p>
                            </div>
                            <a href="/contact" style={{
                                display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px",
                                borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, color: C.navy,
                                fontWeight: 700, fontSize: 13, textDecoration: "none", transition: "all 0.22s",
                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy; }}>
                                We're hiring →
                            </a>
                        </div>
                    </FadeIn>

                    <div className="team-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                        {TEAM.map((member, i) => (
                            <FadeIn key={i} delay={i * 100} direction="up">
                                <div className={`team-flip-outer${flippedCard === i ? " flipped" : ""}`}
                                    onClick={() => setFlippedCard(flippedCard === i ? null : i)}>
                                    <div className="team-flip-inner">
                                        {/* Front */}
                                        <div className="team-face team-front">
                                            <div style={{
                                                position: "absolute", top: 0, left: 0, right: 0, height: 4,
                                                background: `linear-gradient(90deg, ${member.color}, ${member.color}70)`,
                                                borderRadius: "22px 22px 0 0"
                                            }} />
                                            <div className="team-avatar" style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)` }}>
                                                {member.initials}
                                            </div>
                                            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: C.navy, marginBottom: 3 }}>{member.name}</div>
                                            <div style={{
                                                fontSize: 11, fontWeight: 700, color: member.color, marginBottom: 12,
                                                textTransform: "uppercase", letterSpacing: "0.5px"
                                            }}>{member.role}</div>
                                            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, marginBottom: 18 }}>{member.desc}</p>
                                            {/* Skill bars */}
                                            <div>
                                                {member.skills.map(s => (
                                                    <SkillBar key={s.label} label={s.label} pct={s.pct} color={member.color} />
                                                ))}
                                            </div>
                                            <div style={{ position: "absolute", bottom: 16, right: 18, fontSize: 11, color: C.dim }}>Tap to flip →</div>
                                        </div>
                                        {/* Back */}
                                        <div className="team-face team-back">
                                            <div>
                                                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 6 }}>{member.name}</div>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: member.color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 20 }}>{member.role}</div>
                                                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontStyle: "italic", lineHeight: 1.7, marginBottom: 24 }}>
                                                    {member.quote}
                                                </div>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
                                                    {member.skills.map(s => (
                                                        <span key={s.label} className="skill-tag" style={{ background: `${member.color}22`, color: member.color, border: `1px solid ${member.color}35` }}>
                                                            {s.label.split("/")[0].trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>Connect</div>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    {[["in", "LinkedIn"], ["𝕏", "Twitter"], ["⌥", "GitHub"]].map(([icon, label]) => (
                                                        <a key={label} href="#" className="social-link" title={label}>{icon}</a>
                                                    ))}
                                                </div>
                                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 16 }}>← Tap to flip back</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ TESTIMONIALS ══════════ */}
            <section className="section section-alt" data-section="5">
                <div className="container">
                    <FadeIn>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 20 }}>
                            <div>
                                <div className="section-tag">Real clients, real results</div>
                                <h2 className="section-title">What our clients <span>say</span></h2>
                                <p className="section-sub">Hear from the 2,841+ businesses that trust Dantechdevs every day.</p>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                {[0, 2, 4].map(idx => (
                                    <div key={idx} className="testi-dot"
                                        style={{
                                            background: testimonialIdx === idx ? C.blue : C.border,
                                            width: testimonialIdx === idx ? 24 : 8, borderRadius: 4
                                        }}
                                        onClick={() => setTestimonialIdx(idx)} />
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    <div className="testi-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                        {visibleTestimonials.map((t, i) => (
                            <FadeIn key={`${testimonialIdx}-${i}`} delay={i * 80} direction="up">
                                <div className="testi-card">
                                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.color, borderRadius: "22px 22px 0 0" }} />
                                    <div className="testi-quote">"</div>
                                    <p style={{ fontSize: 14, color: C.slate, lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>
                                        {t.text}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 42, height: 42, borderRadius: "50%",
                                            background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0
                                        }}>
                                            {t.initials}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 14, color: C.navy }}>{t.name}</div>
                                            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{t.biz}</div>
                                        </div>
                                        <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                                            {[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 13, color: "#FBBF24" }}>★</span>)}
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    {/* Overall rating bar */}
                    <FadeIn delay={300}>
                        <div style={{
                            marginTop: 52, background: C.white, border: `1px solid ${C.border}`, borderRadius: 20,
                            padding: "32px 36px", display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap"
                        }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 52, color: C.navy, lineHeight: 1 }}>4.9</div>
                                <div style={{ display: "flex", gap: 3, justifyContent: "center", margin: "8px 0 4px" }}>
                                    {[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 18, color: "#FBBF24" }}>★</span>)}
                                </div>
                                <div style={{ fontSize: 12, color: C.muted }}>Overall Rating</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 200 }}>
                                {[[5, "88%"], [4, "10%"], [3, "1.5%"], [2, "0.3%"], [1, "0.2%"]].map(([stars, pct]) => (
                                    <div key={stars} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 7 }}>
                                        <span style={{ fontSize: 12, color: C.muted, width: 12 }}>{stars}</span>
                                        <span style={{ fontSize: 12, color: "#FBBF24" }}>★</span>
                                        <div style={{ flex: 1, height: 6, borderRadius: 4, background: C.bg, overflow: "hidden" }}>
                                            <div style={{ height: "100%", borderRadius: 4, background: "#FBBF24", width: pct, transition: "width 1.5s" }} />
                                        </div>
                                        <span style={{ fontSize: 12, color: C.muted, width: 36 }}>{pct}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                {[["Response Time", "< 2 hrs"], ["Resolution Rate", "97%"], ["NPS Score", "72"], ["Renewals", "94%"]].map(([k, v]) => (
                                    <div key={k} style={{ textAlign: "center", padding: "14px 16px", background: C.bg, borderRadius: 12 }}>
                                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: C.navy }}>{v}</div>
                                        <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{k}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ══════════ CTA ══════════ */}
            <section className="cta-section" data-section="6">
                <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <FadeIn>
                        <div style={{
                            fontSize: 11, fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase",
                            color: "rgba(255,255,255,0.45)", marginBottom: 16
                        }}>Ready to get started?</div>
                        <h2 style={{
                            fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800,
                            color: "#fff", letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: 20
                        }}>
                            Your business deserves<br />better software.
                        </h2>
                        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.56)", maxWidth: 500, margin: "0 auto 44px", lineHeight: 1.75 }}>
                            Join 2,841+ businesses already using Dantechdevs products to run more efficiently.
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="/products" style={{
                                display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 34px",
                                borderRadius: 12, background: "#fff", color: C.blue, fontWeight: 800, fontSize: 15,
                                textDecoration: "none", transition: "all 0.22s", fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,0.22)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                                Browse Products →
                            </a>
                            <a href="/contact" style={{
                                display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 34px",
                                borderRadius: 12, background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: 15,
                                border: "1px solid rgba(255,255,255,0.22)", textDecoration: "none", transition: "all 0.22s",
                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}>
                                Contact Us
                            </a>
                        </div>

                        {/* Bottom social proof row */}
                        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 56, flexWrap: "wrap" }}>
                            {[["✓", "No contracts"], ["✓", "Free onboarding"], ["✓", "M-Pesa ready"], ["✓", "24/7 support"]].map(([c, t]) => (
                                <div key={t} style={{
                                    display: "flex", alignItems: "center", gap: 8, fontSize: 13,
                                    color: "rgba(255,255,255,0.6)", fontWeight: 600
                                }}>
                                    <span style={{ color: "#34D399", fontWeight: 800 }}>{c}</span>{t}
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}