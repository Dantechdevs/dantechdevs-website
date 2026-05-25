"use client";
import { useState, useEffect, useRef } from "react";

/* ── DESIGN TOKENS ── */
const T = {
    bg: "#080C14",
    panel: "#0D1525",
    panel2: "#111B30",
    glass: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.06)",
    borderHi: "rgba(255,255,255,0.12)",
    violet: "#7C3AED",
    violetLt: "#A78BFA",
    cyan: "#06B6D4",
    cyanLt: "#67E8F9",
    emerald: "#10B981",
    rose: "#F43F5E",
    amber: "#F59E0B",
    text: "#F1F5F9",
    textMuted: "#64748B",
    textDim: "#334155",
};

/* ── GRADIENT PRESETS ── */
const G = {
    violet: `linear-gradient(135deg, #7C3AED, #A855F7)`,
    cyan: `linear-gradient(135deg, #0891B2, #06B6D4)`,
    emerald: `linear-gradient(135deg, #059669, #10B981)`,
    rose: `linear-gradient(135deg, #E11D48, #F43F5E)`,
    amber: `linear-gradient(135deg, #D97706, #F59E0B)`,
    multi: `linear-gradient(135deg, #7C3AED 0%, #06B6D4 50%, #10B981 100%)`,
    panel: `linear-gradient(160deg, #0D1525 0%, #0a1020 100%)`,
};

/* ══════════════════════════════════════════
   ANIMATED NUMBER
══════════════════════════════════════════ */
function AnimatedNum({ value, prefix = "", suffix = "", duration = 1200 }) {
    const [display, setDisplay] = useState(0);
    const numVal = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
    useEffect(() => {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const prog = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - prog, 3);
            setDisplay(eased * numVal);
            if (prog < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [numVal, duration]);
    const fmt = display >= 1000 ? `${(display / 1000).toFixed(1)}K` : display.toFixed(display < 100 ? 0 : 0);
    return <span>{prefix}{fmt}{suffix}</span>;
}

/* ══════════════════════════════════════════
   SPARK LINE
══════════════════════════════════════════ */
function SparkLine({ data, color, height = 36 }) {
    const w = 80, h = height;
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
    const fillPts = `0,${h} ${pts} ${w},${h}`;
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={fillPts} fill={`url(#sg-${color.replace("#", "")})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ══════════════════════════════════════════
   DONUT CHART
══════════════════════════════════════════ */
function DonutChart({ segments, size = 120 }) {
    const r = 42, cx = size / 2, cy = size / 2, circumference = 2 * Math.PI * r;
    let cumulative = 0;
    const total = segments.reduce((a, s) => a + s.value, 0);
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => {
                const pct = seg.value / total;
                const dash = pct * circumference;
                const gap = circumference - dash;
                const rot = cumulative * 360 - 90;
                cumulative += pct;
                return (
                    <circle key={i} cx={cx} cy={cy} r={r}
                        fill="none" stroke={seg.color} strokeWidth="14"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset="0"
                        transform={`rotate(${rot} ${cx} ${cy})`}
                        strokeLinecap="round"
                        style={{ transition: "all 1s ease" }}
                    />
                );
            })}
            <circle cx={cx} cy={cy} r={35} fill={T.panel} />
        </svg>
    );
}

/* ══════════════════════════════════════════
   BAR CHART
══════════════════════════════════════════ */
function BarChart({ data, colors, labels }) {
    const max = Math.max(...data);
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, paddingTop: 8 }}>
            {data.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                            width: "100%", borderRadius: "6px 6px 0 0",
                            height: `${(v / max) * 100}%`,
                            background: colors[i % colors.length],
                            minHeight: 4,
                            transition: "height 1s cubic-bezier(0.34,1.56,0.64,1)",
                            position: "relative",
                        }}>
                            <div style={{
                                position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                                fontSize: 9, fontWeight: 700, color: T.textMuted, whiteSpace: "nowrap",
                            }}>{v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}</div>
                        </div>
                    </div>
                    <div style={{ fontSize: 9, color: T.textMuted, fontWeight: 600 }}>{labels[i]}</div>
                </div>
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════ */
function StatCard({ icon, label, value, prefix = "", suffix = "", sub, subUp, color, gradient, spark }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: G.panel,
                border: `1px solid ${hov ? T.borderHi : T.border}`,
                borderRadius: 20,
                padding: "22px 24px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                transform: hov ? "translateY(-3px)" : "translateY(0)",
                cursor: "default",
            }}
        >
            {/* glow */}
            <div style={{
                position: "absolute", top: -40, right: -40,
                width: 120, height: 120, borderRadius: "50%",
                background: color, opacity: hov ? 0.12 : 0.06,
                filter: "blur(30px)", transition: "opacity 0.3s",
                pointerEvents: "none",
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: gradient || `${color}18`,
                    border: `1px solid ${color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                }}>{icon}</div>
                {spark && <SparkLine data={spark} color={color} />}
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 28, color: T.text, letterSpacing: "-0.5px", lineHeight: 1 }}>
                {prefix}<AnimatedNum value={parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0} duration={1400} />{suffix}
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 6, fontWeight: 500 }}>{label}</div>
            {sub && (
                <div style={{ fontSize: 11, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{
                        padding: "2px 7px", borderRadius: 6,
                        background: subUp ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)",
                        color: subUp ? T.emerald : T.rose,
                        fontWeight: 700, fontSize: 10,
                    }}>{subUp ? "↑" : "↓"} {sub}</span>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   PANEL
══════════════════════════════════════════ */
function Panel({ title, action, children, style = {} }) {
    return (
        <div style={{
            background: G.panel,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: "24px",
            ...style,
        }}>
            {(title || action) && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    {title && <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: T.text }}>{title}</div>}
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}

/* ══════════════════════════════════════════
   BADGE
══════════════════════════════════════════ */
function Badge({ label, type = "neutral" }) {
    const map = {
        active: { bg: "rgba(16,185,129,0.12)", color: "#10B981", border: "rgba(16,185,129,0.2)" },
        trial: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
        expired: { bg: "rgba(244,63,94,0.12)", color: "#F43F5E", border: "rgba(244,63,94,0.2)" },
        inactive: { bg: "rgba(100,116,139,0.12)", color: "#64748B", border: "rgba(100,116,139,0.2)" },
        open: { bg: "rgba(244,63,94,0.12)", color: "#F43F5E", border: "rgba(244,63,94,0.2)" },
        pending: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
        resolved: { bg: "rgba(16,185,129,0.12)", color: "#10B981", border: "rgba(16,185,129,0.2)" },
        high: { bg: "rgba(244,63,94,0.12)", color: "#F43F5E", border: "rgba(244,63,94,0.2)" },
        medium: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "rgba(245,158,11,0.2)" },
        low: { bg: "rgba(16,185,129,0.12)", color: "#10B981", border: "rgba(16,185,129,0.2)" },
        neutral: { bg: "rgba(124,58,237,0.12)", color: "#A78BFA", border: "rgba(124,58,237,0.2)" },
    };
    const s = map[type.toLowerCase()] || map.neutral;
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.3px",
        }}>{label}</span>
    );
}

/* ══════════════════════════════════════════
   BTN
══════════════════════════════════════════ */
function Btn({ children, onClick, variant = "primary", sm = false }) {
    const [hov, setHov] = useState(false);
    const base = {
        primary: { bg: G.violet, color: "#fff", border: "transparent" },
        outline: { bg: hov ? T.glass : "transparent", color: T.textMuted, border: T.borderHi },
        ghost: { bg: "transparent", color: T.textMuted, border: "transparent" },
        danger: { bg: "rgba(244,63,94,0.15)", color: T.rose, border: "rgba(244,63,94,0.3)" },
    };
    const v = base[variant] || base.primary;
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: sm ? "5px 12px" : "9px 18px",
                borderRadius: sm ? 8 : 12,
                background: v.bg,
                color: v.color,
                border: `1px solid ${v.border}`,
                fontSize: sm ? 11 : 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "all 0.2s",
                opacity: hov && variant === "primary" ? 0.9 : 1,
                transform: hov ? "translateY(-1px)" : "none",
                whiteSpace: "nowrap",
            }}
        >{children}</button>
    );
}

/* ══════════════════════════════════════════
   MODAL
══════════════════════════════════════════ */
function Modal({ title, sub, children, onClose }) {
    return (
        <div style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, animation: "fadeIn 0.2s ease",
        }} onClick={onClose}>
            <div style={{
                background: "#0D1525",
                border: `1px solid ${T.borderHi}`,
                borderRadius: 24,
                padding: 32,
                width: "100%", maxWidth: 420,
                display: "flex", flexDirection: "column", gap: 16,
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, color: T.text }}>{title}</div>
                        {sub && <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{sub}</div>}
                    </div>
                    <button onClick={onClose} style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: 10, width: 32, height: 32, color: T.textMuted, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
                {children}
                <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   FORM INPUT
══════════════════════════════════════════ */
function Input({ label, ...props }) {
    return (
        <div>
            {label && <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>}
            <input style={{
                width: "100%", padding: "11px 14px", borderRadius: 12,
                border: `1px solid ${T.borderHi}`,
                background: "rgba(255,255,255,0.03)",
                color: T.text, fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
            }} {...props} />
        </div>
    );
}

function Select({ label, children, ...props }) {
    return (
        <div>
            {label && <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>}
            <select style={{
                width: "100%", padding: "11px 14px", borderRadius: 12,
                border: `1px solid ${T.borderHi}`,
                background: "#0D1525",
                color: T.text, fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                outline: "none", cursor: "pointer",
            }} {...props}>{children}</select>
        </div>
    );
}

/* ══════════════════════════════════════════
   PROGRESS BAR
══════════════════════════════════════════ */
function Progress({ pct, color, label, value }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.textMuted }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                    height: "100%", width: `${pct}%`,
                    background: color, borderRadius: 3,
                    transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: `0 0 8px ${color}60`,
                }} />
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const PRODUCTS = [
    { emoji: "💆", name: "BeautyPro", tag: "Spa & Salon", clients: 842, mrr: 84200, growth: 12, color: T.rose, grad: G.rose },
    { emoji: "🛒", name: "ShopFlow", tag: "Retail & Stock", clients: 634, mrr: 63400, growth: 8, color: T.amber, grad: G.amber },
    { emoji: "⛪", name: "ChurchDesk", tag: "Church Mgmt", clients: 521, mrr: 52100, growth: 22, color: T.violetLt, grad: G.violet },
    { emoji: "🏫", name: "EduCore", tag: "Education", clients: 312, mrr: 46800, growth: 5, color: T.emerald, grad: G.emerald },
    { emoji: "🏥", name: "MediTrack", tag: "Healthcare", clients: 298, mrr: 52150, growth: 15, color: T.cyan, grad: G.cyan },
    { emoji: "🤝", name: "SaccoSmart", tag: "SACCO/Finance", clients: 234, mrr: 46800, growth: 31, color: "#FB923C", grad: `linear-gradient(135deg,#EA580C,#FB923C)` },
];

const RECENT_CLIENTS = [
    { name: "Sunshine Salon", product: "BeautyPro", plan: "Monthly", amount: 2500, status: "Active", date: "May 23" },
    { name: "Bethel Church", product: "ChurchDesk", plan: "One-Time", amount: 25000, status: "Active", date: "May 22" },
    { name: "St. Mary School", product: "EduCore", plan: "Monthly", amount: 3000, status: "Trial", date: "May 21" },
    { name: "Nairobi Clinic", product: "MediTrack", plan: "Monthly", amount: 3500, status: "Active", date: "May 20" },
    { name: "Kamau Traders", product: "ShopFlow", plan: "Monthly", amount: 2000, status: "Inactive", date: "May 18" },
    { name: "Jitihada SACCO", product: "SaccoSmart", plan: "Monthly", amount: 2000, status: "Active", date: "May 16" },
];

const TICKETS = [
    { id: "#TK-001", title: "M-Pesa payment not reflecting", product: "BeautyPro", priority: "High", status: "Open", date: "May 22", client: "Daniel Ngwasi" },
    { id: "#TK-002", title: "SMS notifications not sending", product: "ChurchDesk", priority: "Medium", status: "Pending", date: "May 20", client: "Bethel Church" },
    { id: "#TK-003", title: "EduCore fee report error", product: "EduCore", priority: "Low", status: "Resolved", date: "May 18", client: "St. Mary School" },
    { id: "#TK-004", title: "Loan interest miscalculation", product: "SaccoSmart", priority: "High", status: "Open", date: "May 17", client: "Jitihada SACCO" },
    { id: "#TK-005", title: "Barcode scanner not working", product: "ShopFlow", priority: "Medium", status: "Resolved", date: "May 15", client: "Kamau Traders" },
];

/* ══════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════ */
function AdminDash() {
    const [tab, setTab] = useState("clients");
    const [modal, setModal] = useState(false);
    const revenueData = [42000, 58000, 71000, 63000, 89000, 95000, 110000];
    const revLabels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 26, color: T.text, letterSpacing: "-0.5px" }}>Platform Overview</div>
                    <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Dantechdevs IT & Consultancy · Admin View</div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="outline" onClick={() => setModal(true)}>📦 Add Product</Btn>
                    <Btn>+ New Client</Btn>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
                <StatCard icon="💰" label="Total Revenue" value={284500} prefix="KES " sub="18% this month" subUp={true} color={T.emerald} spark={[40, 55, 48, 70, 65, 85, 95]} />
                <StatCard icon="👥" label="Total Clients" value={2841} sub="124 new this week" subUp={true} color={T.violetLt} spark={[2600, 2650, 2700, 2720, 2760, 2810, 2841]} />
                <StatCard icon="📦" label="Active Products" value={6} sub="All products live" subUp={true} color={T.cyan} spark={[4, 4, 5, 5, 6, 6, 6]} />
                <StatCard icon="🎫" label="Open Tickets" value={14} sub="5 urgent" subUp={false} color={T.rose} spark={[8, 12, 10, 15, 11, 14, 14]} />
            </div>

            {/* Chart + Donut row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>
                <Panel title="Monthly Revenue · 2026" action={<span style={{ fontSize: 12, color: T.emerald, fontWeight: 700 }}>↑ KES 528K YTD</span>}>
                    <BarChart
                        data={revenueData}
                        labels={revLabels}
                        colors={[T.violet, T.violetLt, T.cyan, T.cyanLt, T.emerald, "#34D399", "#6EE7B7"]}
                    />
                </Panel>
                <Panel title="Revenue Mix">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                        <div style={{ position: "relative" }}>
                            <DonutChart size={130} segments={[
                                { value: 70, color: T.violet },
                                { value: 15, color: T.cyan },
                                { value: 10, color: T.emerald },
                                { value: 5, color: T.amber },
                            ]} />
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: T.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>KES</div>
                                <div style={{ fontSize: 11, color: T.textMuted }}>284.5K</div>
                            </div>
                        </div>
                        {[
                            { label: "Subscriptions", pct: "70%", color: T.violet },
                            { label: "One-Time", pct: "15%", color: T.cyan },
                            { label: "Renewal Fees", pct: "10%", color: T.emerald },
                            { label: "Other", pct: "5%", color: T.amber },
                        ].map((i, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontSize: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: i.color }} />
                                    <span style={{ color: T.textMuted }}>{i.label}</span>
                                </div>
                                <span style={{ fontWeight: 700, color: i.color }}>{i.pct}</span>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            {/* Product performance */}
            <Panel title="Product Performance" action={<Badge label="6 Products" type="neutral" />}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
                    {PRODUCTS.map((p, i) => (
                        <div key={i} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: `1px solid ${p.color}20`,
                            borderRadius: 16,
                            padding: "18px 16px",
                            textAlign: "center",
                            transition: "all 0.25s",
                            cursor: "pointer",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}50`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = `${p.color}20`; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <div style={{ fontSize: 28, marginBottom: 10 }}>{p.emoji}</div>
                            <div style={{ fontWeight: 800, fontSize: 13, color: p.color, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>{p.name}</div>
                            <div style={{ fontWeight: 800, fontSize: 22, color: T.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.clients}</div>
                            <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 6 }}>clients</div>
                            <div style={{ fontSize: 11, color: p.color, fontWeight: 700 }}>KES {(p.mrr / 1000).toFixed(1)}K</div>
                            <div style={{ fontSize: 10, color: T.emerald, marginTop: 4 }}>+{p.growth}% ↑</div>
                        </div>
                    ))}
                </div>
            </Panel>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${T.border}`, paddingBottom: 0 }}>
                {["clients", "products", "revenue"].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        padding: "10px 20px",
                        background: "none", border: "none",
                        borderBottom: tab === t ? `2px solid ${T.violet}` : "2px solid transparent",
                        color: tab === t ? T.violetLt : T.textMuted,
                        fontWeight: 700, fontSize: 13, cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        transition: "color 0.2s",
                        marginBottom: -1,
                    }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
            </div>

            {tab === "clients" && (
                <Panel title="Recent Clients" action={<Btn sm variant="outline">View All →</Btn>}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr>{["Business", "Product", "Plan", "Amount", "Status", "Date", ""].map((h, i) => (
                                    <th key={i} style={{ textAlign: "left", padding: "8px 12px", color: T.textDim, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: `1px solid ${T.border}` }}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {RECENT_CLIENTS.map((c, i) => (
                                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={{ padding: "13px 12px", fontWeight: 700, color: T.text }}>{c.name}</td>
                                        <td style={{ padding: "13px 12px", color: T.textMuted }}>{c.product}</td>
                                        <td style={{ padding: "13px 12px", color: T.textMuted }}>{c.plan}</td>
                                        <td style={{ padding: "13px 12px", color: T.emerald, fontWeight: 700 }}>KES {c.amount.toLocaleString()}</td>
                                        <td style={{ padding: "13px 12px" }}><Badge label={c.status} type={c.status.toLowerCase()} /></td>
                                        <td style={{ padding: "13px 12px", color: T.textMuted }}>{c.date}</td>
                                        <td style={{ padding: "13px 12px" }}><Btn sm variant="outline">View</Btn></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === "products" && (
                <Panel title="All Products">
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr>{["Product", "Clients", "MRR", "Growth", "Status", ""].map((h, i) => (
                                    <th key={i} style={{ textAlign: "left", padding: "8px 12px", color: T.textDim, fontWeight: 700, fontSize: 10, textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {PRODUCTS.map((p, i) => (
                                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={{ padding: "13px 12px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 10, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{p.emoji}</div>
                                                <div><div style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>{p.name}</div><div style={{ fontSize: 11, color: T.textMuted }}>{p.tag}</div></div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "13px 12px", color: T.text, fontWeight: 700 }}>{p.clients.toLocaleString()}</td>
                                        <td style={{ padding: "13px 12px", color: T.emerald, fontWeight: 700 }}>KES {(p.mrr / 1000).toFixed(1)}K</td>
                                        <td style={{ padding: "13px 12px", color: T.emerald, fontWeight: 700 }}>+{p.growth}%</td>
                                        <td style={{ padding: "13px 12px" }}><Badge label="Active" type="active" /></td>
                                        <td style={{ padding: "13px 12px" }}><Btn sm variant="outline">Manage</Btn></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === "revenue" && (
                <Panel title="Revenue Breakdown">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                        {[
                            { label: "Monthly Subscriptions", value: "KES 198,500", pct: 70, color: T.violet },
                            { label: "One-Time Licenses", value: "KES 86,000", pct: 30, color: T.cyan },
                            { label: "M-Pesa Payments", value: "KES 241,200", pct: 85, color: T.emerald },
                            { label: "Bank Transfers", value: "KES 43,300", pct: 15, color: T.violetLt },
                        ].map((r, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`, borderRadius: 16, padding: 20 }}>
                                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>{r.label}</div>
                                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 22, color: r.color, marginBottom: 14 }}>{r.value}</div>
                                <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                                    <div style={{ height: "100%", width: `${r.pct}%`, background: r.color, borderRadius: 3, boxShadow: `0 0 8px ${r.color}80` }} />
                                </div>
                                <div style={{ fontSize: 10, color: T.textMuted }}>{r.pct}% of total</div>
                            </div>
                        ))}
                    </div>
                </Panel>
            )}

            {modal && (
                <Modal title="Add New Product" sub="Register a product on the platform" onClose={() => setModal(false)}>
                    <Input label="Product Name" placeholder="e.g. HotelPro" />
                    <Input label="Category" placeholder="e.g. Hotel Management" />
                    <Input label="Monthly Price (KES)" placeholder="e.g. 3000" type="number" />
                    <Input label="One-Time Price (KES)" placeholder="e.g. 50000" type="number" />
                    <div style={{ display: "flex", gap: 10 }}>
                        <Btn onClick={() => setModal(false)} style={{ flex: 1 }}>Save Product</Btn>
                        <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   CLIENT DASHBOARD
══════════════════════════════════════════ */
const MY_PRODUCTS = [
    { emoji: "💆", name: "BeautyPro", tag: "Spa & Salon", plan: "Monthly", price: "KES 2,500", status: "Active", renewal: "Jun 1, 2026", color: T.rose },
    { emoji: "⛪", name: "ChurchDesk", tag: "Church Mgmt", plan: "Monthly", price: "KES 1,500", status: "Active", renewal: "Jun 1, 2026", color: T.violetLt },
    { emoji: "🛒", name: "ShopFlow", tag: "Retail & Stock", plan: "—", price: "—", status: "Inactive", renewal: "—", color: T.amber },
];
const BILLING = [
    { product: "BeautyPro", month: "May 2026", amount: "KES 2,500", method: "M-Pesa", paid: true },
    { product: "ChurchDesk", month: "May 2026", amount: "KES 1,500", method: "M-Pesa", paid: true },
    { product: "BeautyPro", month: "Apr 2026", amount: "KES 2,500", method: "M-Pesa", paid: true },
    { product: "ChurchDesk", month: "Apr 2026", amount: "KES 1,500", method: "M-Pesa", paid: true },
    { product: "BeautyPro", month: "Mar 2026", amount: "KES 2,500", method: "M-Pesa", paid: true },
];

function ClientDash() {
    const [tab, setTab] = useState("products");
    const [payModal, setPayModal] = useState(false);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 26, color: T.text, letterSpacing: "-0.5px" }}>Welcome back, Daniel 👋</div>
                    <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Manage your subscriptions · Dantechdevs platform</div>
                </div>
                <Btn onClick={() => setPayModal(true)}>💳 Pay via M-Pesa</Btn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                <StatCard icon="📦" label="Active Products" value={2} sub="of 6 available" subUp={true} color={T.cyan} spark={[1, 1, 2, 2, 2, 2, 2]} />
                <StatCard icon="💳" label="Monthly Spend" value={4000} prefix="KES " sub="Next due Jun 1" subUp={false} color={T.amber} spark={[3500, 3500, 4000, 4000, 4000, 4000, 4000]} />
                <StatCard icon="📅" label="Days to Renewal" value={8} suffix=" days" sub="Auto-renew Jun 1" subUp={true} color={T.emerald} spark={[28, 21, 16, 11, 8, 8, 8]} />
                <StatCard icon="🎫" label="Open Tickets" value={1} sub="Awaiting reply" subUp={false} color={T.rose} spark={[0, 1, 0, 0, 1, 1, 1]} />
            </div>

            {/* Hero banner */}
            <div style={{
                background: `linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.1) 100%)`,
                border: `1px solid rgba(124,58,237,0.25)`,
                borderRadius: 20, padding: "24px 28px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", right: -60, top: -60, width: 200, height: 200, borderRadius: "50%", background: T.violet, opacity: 0.08, filter: "blur(40px)" }} />
                <div style={{ position: "absolute", left: "40%", bottom: -40, width: 160, height: 160, borderRadius: "50%", background: T.cyan, opacity: 0.06, filter: "blur(40px)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 17, color: T.text, marginBottom: 6 }}>
                        🚀 Your software is running smoothly!
                    </div>
                    <div style={{ fontSize: 13, color: T.textMuted }}>
                        BeautyPro & ChurchDesk active · Next billing: June 1, 2026 · <span style={{ color: T.amber, fontWeight: 700 }}>KES 4,000</span>
                    </div>
                </div>
                <Btn variant="outline">Browse More →</Btn>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${T.border}`, paddingBottom: 0 }}>
                {["products", "billing", "profile"].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        padding: "10px 20px", background: "none", border: "none",
                        borderBottom: tab === t ? `2px solid ${T.violet}` : "2px solid transparent",
                        color: tab === t ? T.violetLt : T.textMuted,
                        fontWeight: 700, fontSize: 13, cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        transition: "color 0.2s", marginBottom: -1,
                    }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
            </div>

            {tab === "products" && (
                <Panel title="My Products" action={<Btn sm variant="outline">+ Add Product</Btn>}>
                    {MY_PRODUCTS.map((p, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 16,
                            padding: "18px 0",
                            borderBottom: i < MY_PRODUCTS.length - 1 ? `1px solid ${T.border}` : "none",
                            transition: "all 0.2s",
                        }}>
                            <div style={{
                                width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                                background: `${p.color}12`, border: `1px solid ${p.color}25`,
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                            }}>{p.emoji}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 15, color: p.color }}>{p.name}</div>
                                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{p.tag} · {p.plan} · {p.price}</div>
                                {p.renewal !== "—" && <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>Renews: {p.renewal}</div>}
                            </div>
                            <Badge label={p.status} type={p.status.toLowerCase()} />
                            {p.status === "Active"
                                ? <Btn sm>Open App</Btn>
                                : <Btn sm variant="outline">Subscribe</Btn>
                            }
                        </div>
                    ))}
                </Panel>
            )}

            {tab === "billing" && (
                <Panel title="Billing History" action={<Btn sm onClick={() => setPayModal(true)}>💳 Pay Now</Btn>}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr>{["Product", "Period", "Amount", "Method", "Status"].map((h, i) => (
                                    <th key={i} style={{ textAlign: "left", padding: "8px 12px", color: T.textDim, fontWeight: 700, fontSize: 10, textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {BILLING.map((b, i) => (
                                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                                        <td style={{ padding: "13px 12px", fontWeight: 700, color: T.text }}>{b.product}</td>
                                        <td style={{ padding: "13px 12px", color: T.textMuted }}>{b.month}</td>
                                        <td style={{ padding: "13px 12px", color: T.emerald, fontWeight: 700 }}>{b.amount}</td>
                                        <td style={{ padding: "13px 12px", color: T.textMuted }}>{b.method}</td>
                                        <td style={{ padding: "13px 12px" }}><Badge label="✓ Paid" type="active" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === "profile" && (
                <Panel title="My Profile">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                        {[
                            ["Full Name", "Daniel Ngwasi"],
                            ["Business Name", "Dantechdevs IT & Consultancy"],
                            ["Email", "info@dantechdevs.com"],
                            ["Phone/WhatsApp", "+254 700 000 000"],
                            ["Location", "Nairobi, Kenya"],
                            ["Member Since", "January 2025"],
                        ].map(([label, val], i) => (
                            <Input key={i} label={label} defaultValue={val} />
                        ))}
                    </div>
                    <div style={{ marginTop: 20 }}><Btn>Save Changes</Btn></div>
                </Panel>
            )}

            {payModal && (
                <Modal title="Pay via M-Pesa 💳" sub="KES 4,000 due June 1, 2026" onClose={() => setPayModal(false)}>
                    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>
                        📱 An STK push will be sent to your M-Pesa number. Enter your PIN to complete payment.
                    </div>
                    <Input label="M-Pesa Number" placeholder="+254 7XX XXX XXX" type="tel" defaultValue="+254 700 000 000" />
                    <Select label="Product">
                        <option>BeautyPro — KES 2,500</option>
                        <option>ChurchDesk — KES 1,500</option>
                        <option>Both — KES 4,000</option>
                    </Select>
                    <div style={{ display: "flex", gap: 10 }}>
                        <Btn onClick={() => setPayModal(false)}>Send STK Push</Btn>
                        <Btn variant="outline" onClick={() => setPayModal(false)}>Cancel</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   SUPPORT DASHBOARD
══════════════════════════════════════════ */
function SupportDash() {
    const [newTicket, setNewTicket] = useState(false);
    const [filter, setFilter] = useState("All");
    const filtered = filter === "All" ? TICKETS : TICKETS.filter(t => t.status === filter);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 26, color: T.text, letterSpacing: "-0.5px" }}>Support Center</div>
                    <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Manage client tickets across all products</div>
                </div>
                <Btn onClick={() => setNewTicket(true)}>+ New Ticket</Btn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                <StatCard icon="🎫" label="Total Tickets" value={14} color={T.cyan} spark={[8, 9, 11, 12, 13, 13, 14]} />
                <StatCard icon="🔴" label="Open" value={4} color={T.rose} spark={[2, 3, 4, 4, 4, 4, 4]} sub="Needs attention" subUp={false} />
                <StatCard icon="🟡" label="Pending" value={3} color={T.amber} spark={[1, 2, 2, 3, 3, 3, 3]} sub="Awaiting reply" subUp={false} />
                <StatCard icon="✅" label="Resolved" value={7} color={T.emerald} spark={[2, 3, 4, 4, 5, 6, 7]} sub="This month" subUp={true} />
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 8 }}>
                {["All", "Open", "Pending", "Resolved"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: "7px 16px", borderRadius: 10, border: "1px solid",
                        borderColor: filter === f ? T.violet : T.border,
                        background: filter === f ? "rgba(124,58,237,0.15)" : "transparent",
                        color: filter === f ? T.violetLt : T.textMuted,
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        transition: "all 0.2s",
                    }}>{f}</button>
                ))}
            </div>

            <Panel title={`Tickets (${filtered.length})`}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr>{["ID", "Issue", "Product", "Priority", "Status", "Client", "Date", ""].map((h, i) => (
                                <th key={i} style={{ textAlign: "left", padding: "8px 12px", color: T.textDim, fontWeight: 700, fontSize: 10, textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {filtered.map((t, i) => (
                                <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <td style={{ padding: "13px 12px", color: T.textDim, fontSize: 12 }}>{t.id}</td>
                                    <td style={{ padding: "13px 12px", color: T.text, fontWeight: 500, maxWidth: 200 }}>{t.title}</td>
                                    <td style={{ padding: "13px 12px", color: T.textMuted }}>{t.product}</td>
                                    <td style={{ padding: "13px 12px" }}><Badge label={t.priority} type={t.priority.toLowerCase()} /></td>
                                    <td style={{ padding: "13px 12px" }}><Badge label={t.status} type={t.status.toLowerCase()} /></td>
                                    <td style={{ padding: "13px 12px", color: T.textMuted }}>{t.client}</td>
                                    <td style={{ padding: "13px 12px", color: T.textMuted }}>{t.date}</td>
                                    <td style={{ padding: "13px 12px" }}><Btn sm variant="outline">Reply</Btn></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>

            {newTicket && (
                <Modal title="Open New Ticket" sub="Report a client issue" onClose={() => setNewTicket(false)}>
                    <Select label="Product">{["BeautyPro", "ShopFlow", "ChurchDesk", "EduCore", "MediTrack", "SaccoSmart"].map(p => <option key={p}>{p}</option>)}</Select>
                    <Input label="Issue Title" placeholder="Brief description of the issue" />
                    <Select label="Priority"><option>Low</option><option>Medium</option><option>High</option></Select>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Details</div>
                        <textarea style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: `1px solid ${T.borderHi}`, background: "rgba(255,255,255,0.03)", color: T.text, fontSize: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} rows={4} placeholder="Describe the issue in detail..." />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <Btn onClick={() => setNewTicket(false)}>Submit Ticket</Btn>
                        <Btn variant="outline" onClick={() => setNewTicket(false)}>Cancel</Btn>
                    </div>
                </Modal>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
const VIEWS = [
    { key: "admin", icon: "👑", label: "Admin" },
    { key: "client", icon: "👤", label: "Client" },
    { key: "support", icon: "🎫", label: "Support" },
];
const NAV = [
    { icon: "🏠", label: "Home" },
    { icon: "📦", label: "Products" },
    { icon: "💰", label: "Pricing" },
    { icon: "📞", label: "Contact" },
    { icon: "⚙️", label: "Settings" },
];
const SIDEBAR_PRODUCTS = [
    { emoji: "💆", name: "BeautyPro", active: true, color: T.rose },
    { emoji: "⛪", name: "ChurchDesk", active: true, color: T.violetLt },
    { emoji: "🛒", name: "ShopFlow", active: false, color: T.amber },
];

export default function Dashboard() {
    const [view, setView] = useState("admin");

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

            {/* ── SIDEBAR ── */}
            <aside style={{
                width: 240, flexShrink: 0,
                background: `linear-gradient(180deg, #0A1220 0%, #080C14 100%)`,
                borderRight: `1px solid ${T.border}`,
                display: "flex", flexDirection: "column",
                padding: "24px 14px",
                position: "sticky", top: 0, height: "100vh", overflowY: "auto",
            }}>
                {/* Brand */}
                <div style={{ padding: "0 8px", marginBottom: 32 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 12,
                            background: G.violet,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                        }}>⚡</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 15, color: T.text, letterSpacing: "-0.3px" }}>Dantechdevs</div>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: T.violetLt, marginTop: 1 }}>IT & Consultancy</div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Views */}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: T.textDim, padding: "0 10px", marginBottom: 8 }}>Dashboard</div>
                {VIEWS.map(v => (
                    <SidebarItem key={v.key} icon={v.icon} label={v.label} active={view === v.key} onClick={() => setView(v.key)} />
                ))}

                {/* Navigation */}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: T.textDim, padding: "0 10px", margin: "24px 0 8px" }}>Navigate</div>
                {NAV.map(n => <SidebarItem key={n.label} icon={n.icon} label={n.label} />)}

                {/* Products */}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: T.textDim, padding: "0 10px", margin: "24px 0 8px" }}>My Products</div>
                {SIDEBAR_PRODUCTS.map(p => (
                    <div key={p.name} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 12px", borderRadius: 12,
                        opacity: p.active ? 1 : 0.35,
                        cursor: p.active ? "pointer" : "default",
                        marginBottom: 2,
                    }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: `1px solid ${p.color}25` }}>{p.emoji}</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: p.active ? T.text : T.textMuted, flex: 1 }}>{p.name}</span>
                        {p.active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, boxShadow: `0 0 6px ${T.emerald}` }} />}
                    </div>
                ))}

                {/* Footer */}
                <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: "50%",
                        background: G.violet,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: 13, color: "#fff", flexShrink: 0,
                        boxShadow: "0 0 12px rgba(124,58,237,0.3)",
                    }}>DN</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Daniel Ngwasi</div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>Admin · Business Plan</div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
                {/* Top bar */}
                <div style={{
                    padding: "16px 36px",
                    borderBottom: `1px solid ${T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "rgba(8,12,20,0.85)",
                    backdropFilter: "blur(12px)",
                    position: "sticky", top: 0, zIndex: 50,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Dashboard</span>
                        <span style={{ color: T.textDim, fontSize: 13 }}>›</span>
                        <span style={{ fontSize: 13, color: T.violetLt, fontWeight: 700 }}>
                            {VIEWS.find(v => v.key === view)?.icon} {VIEWS.find(v => v.key === view)?.label}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.emerald, boxShadow: `0 0 8px ${T.emerald}`, animation: "pulse 2s infinite" }} />
                        <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>Live · May 25, 2026</span>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: "36px", maxWidth: 1100 }}>
                    {view === "admin" && <AdminDash />}
                    {view === "client" && <ClientDash />}
                    {view === "support" && <SupportDash />}
                </div>
            </main>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.5); }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 6px #10B981;opacity:1} 50%{box-shadow:0 0 14px #10B981;opacity:0.7} }
        input:focus, select:focus, textarea:focus { border-color: #7C3AED !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }
        option { background: #0D1525; }
        @media(max-width:768px){
          aside { display: none !important; }
          main > div:nth-child(2) { padding: 20px 16px !important; }
        }
      `}</style>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 12,
                background: active ? "rgba(124,58,237,0.15)" : hov ? "rgba(255,255,255,0.03)" : "transparent",
                border: active ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent",
                color: active ? T.violetLt : hov ? T.text : T.textMuted,
                fontSize: 13, fontWeight: active ? 700 : 500,
                cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif",
                transition: "all 0.2s", width: "100%", textAlign: "left",
                marginBottom: 2,
            }}
        >
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span>{label}</span>
            {active && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: T.violetLt }} />}
        </button>
    );
}