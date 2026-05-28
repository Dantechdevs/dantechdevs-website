"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

/* ─── SUPABASE CLIENT ─── */
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── PALETTE ─── */
const A = {
    blue: "#2563EB", blueLt: "#3B82F6", bluePale: "#EFF6FF",
    cyan: "#0891B2", emerald: "#059669", rose: "#E11D48",
    amber: "#D97706", violet: "#7C3AED", orange: "#EA580C",
};

/* ══════════════════════════════════════════
   ANIMATED NUMBER
══════════════════════════════════════════ */
function AnimatedNum({ value, duration = 1200 }: { value: number; duration?: number }) {
    const [d, setD] = useState(0);
    useEffect(() => {
        let s: number | null = null;
        const step = (ts: number) => {
            if (!s) s = ts;
            const p = Math.min((ts - s) / duration, 1), e = 1 - Math.pow(1 - p, 3);
            setD(e * value);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value, duration]);
    return <>{d >= 1000 ? `${(d / 1000).toFixed(1)}K` : Math.round(d)}</>;
}

/* ══════════════════════════════════════════
   SPARKLINE
══════════════════════════════════════════ */
function SparkLine({ data, color }: { data: number[]; color: string }) {
    const w = 80, h = 36, min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
    const id = `sg${color.replace(/[^a-z0-9]/gi, "")}`;
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ══════════════════════════════════════════
   DONUT CHART
══════════════════════════════════════════ */
interface DonutSegment { value: number; color: string; }
function DonutChart({ segments, size = 120 }: { segments: DonutSegment[]; size?: number }) {
    const r = 42, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
    let cum = 0;
    const total = segments.reduce((a, s) => a + s.value, 0);
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => {
                const pct = seg.value / total, dash = pct * circ, gap = circ - dash, rot = cum * 360 - 90;
                cum += pct;
                return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="13"
                    strokeDasharray={`${dash} ${gap}`} strokeDashoffset="0"
                    transform={`rotate(${rot} ${cx} ${cy})`} strokeLinecap="round"
                    style={{ transition: "all 1s ease" }} />;
            })}
            <circle cx={cx} cy={cy} r={34} fill="var(--panel)" />
        </svg>
    );
}

/* ══════════════════════════════════════════
   BAR CHART
══════════════════════════════════════════ */
function BarChart({ data, colors, labels }: { data: number[]; colors: string[]; labels: string[] }) {
    const max = Math.max(...data);
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110, paddingTop: 20 }}>
            {data.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div style={{
                            width: "100%", borderRadius: "5px 5px 0 0", height: `${(v / max) * 100}%`,
                            background: colors[i % colors.length], minHeight: 4,
                            transition: "height 1s cubic-bezier(0.34,1.56,0.64,1)", position: "relative"
                        }}>
                            <div style={{
                                position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
                                fontSize: 9, fontWeight: 700, color: "var(--text-muted)", whiteSpace: "nowrap"
                            }}>
                                {v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600 }}>{labels[i]}</div>
                </div>
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════ */
interface StatCardProps {
    icon: string; label: string; value: number;
    prefix?: string; suffix?: string; sub?: string; subUp?: boolean;
    color: string; spark?: number[];
}
function StatCard({ icon, label, value, prefix = "", suffix = "", sub, subUp, color, spark }: StatCardProps) {
    const [hov, setHov] = useState(false);
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: "var(--panel)", border: `1px solid ${hov ? "var(--border-hi)" : "var(--border)"}`,
                borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden",
                transition: "all 0.25s", transform: hov ? "translateY(-2px)" : "none",
                boxShadow: hov ? "var(--shadow-md)" : "var(--shadow-sm)", cursor: "default"
            }}>
            <div style={{
                position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%",
                background: color, opacity: hov ? 0.08 : 0.04, filter: "blur(24px)",
                transition: "opacity 0.3s", pointerEvents: "none"
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 12, background: `${color}15`,
                    border: `1px solid ${color}25`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 20
                }}>{icon}</div>
                {spark && <SparkLine data={spark} color={color} />}
            </div>
            <div style={{
                fontWeight: 800, fontSize: 26, color: "var(--text-primary)", letterSpacing: "-0.5px",
                lineHeight: 1, fontFamily: "'Plus Jakarta Sans',sans-serif"
            }}>
                {prefix}<AnimatedNum value={value} duration={1400} />{suffix}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 5, fontWeight: 500 }}>{label}</div>
            {sub && (
                <div style={{ marginTop: 8 }}>
                    <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
                        background: subUp ? `${A.emerald}15` : `${A.rose}15`,
                        color: subUp ? A.emerald : A.rose
                    }}>{subUp ? "↑" : "↓"} {sub}</span>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   PANEL
══════════════════════════════════════════ */
function Panel({ title, action, children, style: sx = {} }: {
    title?: string; action?: React.ReactNode;
    children: React.ReactNode; style?: React.CSSProperties;
}) {
    return (
        <div style={{
            background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 16,
            padding: "22px 24px", boxShadow: "var(--shadow-sm)", ...sx
        }}>
            {(title || action) && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    {title && <div style={{
                        fontWeight: 700, fontSize: 15, color: "var(--text-primary)",
                        fontFamily: "'Plus Jakarta Sans',sans-serif"
                    }}>{title}</div>}
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
function Badge({ label, type = "neutral" }: { label: string; type?: string }) {
    const map: Record<string, { bg: string; color: string; border: string }> = {
        active: { bg: `${A.emerald}15`, color: A.emerald, border: `${A.emerald}30` },
        trial: { bg: `${A.amber}15`, color: A.amber, border: `${A.amber}30` },
        expired: { bg: `${A.rose}15`, color: A.rose, border: `${A.rose}30` },
        inactive: { bg: "var(--bg-muted)", color: "var(--text-muted)", border: "var(--border)" },
        open: { bg: `${A.rose}15`, color: A.rose, border: `${A.rose}30` },
        pending: { bg: `${A.amber}15`, color: A.amber, border: `${A.amber}30` },
        resolved: { bg: `${A.emerald}15`, color: A.emerald, border: `${A.emerald}30` },
        high: { bg: `${A.rose}15`, color: A.rose, border: `${A.rose}30` },
        medium: { bg: `${A.amber}15`, color: A.amber, border: `${A.amber}30` },
        low: { bg: `${A.emerald}15`, color: A.emerald, border: `${A.emerald}30` },
        neutral: { bg: `${A.blue}12`, color: A.blue, border: `${A.blue}25` },
    };
    const s = map[type.toLowerCase()] || map.neutral;
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 8,
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            fontFamily: "'Plus Jakarta Sans',sans-serif"
        }}>{label}</span>
    );
}

/* ══════════════════════════════════════════
   BUTTON
══════════════════════════════════════════ */
function Btn({ children, onClick, variant = "primary", sm = false }: {
    children: React.ReactNode; onClick?: () => void;
    variant?: "primary" | "outline" | "ghost"; sm?: boolean;
}) {
    const [hov, setHov] = useState(false);
    const v: Record<string, React.CSSProperties & { background: string; color: string; border: string }> = {
        primary: {
            background: `linear-gradient(135deg,${A.blue},${A.blueLt})`, color: "#fff",
            border: "transparent", boxShadow: hov ? `0 4px 14px ${A.blue}40` : "none"
        },
        outline: {
            background: hov ? "var(--bg-muted)" : "transparent",
            color: "var(--text-secondary)", border: "var(--border-hi)"
        },
        ghost: { background: "transparent", color: "var(--text-muted)", border: "transparent" },
    };
    const s = v[variant] || v.primary;
    return (
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                padding: sm ? "5px 12px" : "9px 18px", borderRadius: sm ? 8 : 10,
                fontSize: sm ? 11 : 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all 0.2s",
                transform: hov ? "translateY(-1px)" : "none",
                ...s, border: `1px solid ${s.border}`, whiteSpace: "nowrap"
            }}>{children}</button>
    );
}

/* ══════════════════════════════════════════
   MODAL
══════════════════════════════════════════ */
function Modal({ title, sub, children, onClose }: {
    title: string; sub?: string; children: React.ReactNode; onClose: () => void;
}) {
    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: "var(--panel)", border: "1px solid var(--border-hi)",
                borderRadius: 20, padding: 28, width: "100%", maxWidth: 460,
                maxHeight: "90vh", overflowY: "auto",
                display: "flex", flexDirection: "column", gap: 14,
                boxShadow: "var(--shadow-xl)"
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div style={{
                            fontWeight: 800, fontSize: 19, color: "var(--text-primary)",
                            fontFamily: "'Plus Jakarta Sans',sans-serif"
                        }}>{title}</div>
                        {sub && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>}
                    </div>
                    <button onClick={onClose} style={{
                        background: "var(--bg-muted)", border: "1px solid var(--border)",
                        borderRadius: 8, width: 30, height: 30, color: "var(--text-muted)", cursor: "pointer", fontSize: 14
                    }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

function Input({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            {label && <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase",
                letterSpacing: "0.06em", marginBottom: 5
            }}>{label}</div>}
            <input style={{
                width: "100%", padding: "10px 13px", borderRadius: 10,
                border: "1px solid var(--border-hi)", background: "var(--input-bg)",
                color: "var(--text-primary)", fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif",
                outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
            }} {...props} />
        </div>
    );
}

function Textarea({ label, ...props }: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            {label && <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase",
                letterSpacing: "0.06em", marginBottom: 5
            }}>{label}</div>}
            <textarea style={{
                width: "100%", padding: "10px 13px", borderRadius: 10,
                border: "1px solid var(--border-hi)", background: "var(--input-bg)",
                color: "var(--text-primary)", fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif",
                outline: "none", resize: "vertical", boxSizing: "border-box"
            }} {...props} />
        </div>
    );
}

function FSelect({ label, children, ...props }: { label?: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div>
            {label && <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase",
                letterSpacing: "0.06em", marginBottom: 5
            }}>{label}</div>}
            <select style={{
                width: "100%", padding: "10px 13px", borderRadius: 10,
                border: "1px solid var(--border-hi)", background: "var(--input-bg)",
                color: "var(--text-primary)", fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif",
                outline: "none", cursor: "pointer"
            }} {...props}>{children}</select>
        </div>
    );
}

/* ── File Upload Field ── */
function FileField({ label, accept, file, onChange }: {
    label: string; accept: string; file: File | null;
    onChange: (f: File | null) => void;
}) {
    return (
        <div>
            <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase",
                letterSpacing: "0.06em", marginBottom: 5
            }}>{label}</div>
            <label style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 13px",
                borderRadius: 10, border: `1px dashed ${file ? A.emerald : "var(--border-hi)"}`,
                background: file ? `${A.emerald}08` : "var(--input-bg)", cursor: "pointer",
                transition: "all 0.2s"
            }}>
                <input type="file" accept={accept} style={{ display: "none" }}
                    onChange={e => onChange(e.target.files?.[0] || null)} />
                <span style={{ fontSize: 16 }}>{file ? "✅" : "📁"}</span>
                <span style={{
                    fontSize: 12, color: file ? A.emerald : "var(--text-muted)",
                    fontWeight: file ? 700 : 400, flex: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                    {file ? file.name : "Click to choose file…"}
                </span>
                {file && (
                    <span onClick={e => { e.preventDefault(); onChange(null); }}
                        style={{ fontSize: 12, color: A.rose, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>✕</span>
                )}
            </label>
            {file && (
                <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 4 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
            )}
        </div>
    );
}

function TH({ children }: { children?: React.ReactNode }) {
    return <th style={{
        textAlign: "left", padding: "8px 12px", color: "var(--text-dim)", fontWeight: 700,
        fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid var(--border)"
    }}>{children}</th>;
}
function TR({ children }: { children: React.ReactNode }) {
    const [hov, setHov] = useState(false);
    return <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
            borderBottom: "1px solid var(--border)", background: hov ? "var(--row-hover)" : "transparent",
            transition: "background 0.15s"
        }}>{children}</tr>;
}
function TD({ children, bold, amount }: { children: React.ReactNode; bold?: boolean; amount?: boolean }) {
    return <td style={{
        padding: "12px 12px", color: amount ? A.emerald : bold ? "var(--text-primary)" : "var(--text-secondary)",
        fontWeight: bold || amount ? 700 : 400, verticalAlign: "middle"
    }}>{children}</td>;
}

function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
    return (
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)" }}>
            {tabs.map(t => (
                <button key={t} onClick={() => onChange(t)} style={{
                    padding: "10px 18px", background: "none", border: "none",
                    borderBottom: active === t ? `2px solid ${A.blue}` : "2px solid transparent",
                    color: active === t ? A.blue : "var(--text-muted)", fontWeight: 700, fontSize: 13,
                    cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "color 0.2s", marginBottom: -1
                }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const PRODUCTS = [
    { emoji: "💆", name: "BeautyPro", tag: "Spa & Salon", clients: 842, mrr: 84200, growth: 12, color: A.rose },
    { emoji: "🛒", name: "ShopFlow", tag: "Retail & Stock", clients: 634, mrr: 63400, growth: 8, color: A.amber },
    { emoji: "⛪", name: "ChurchDesk", tag: "Church Mgmt", clients: 521, mrr: 52100, growth: 22, color: A.violet },
    { emoji: "🏫", name: "EduCore", tag: "Education", clients: 312, mrr: 46800, growth: 5, color: A.emerald },
    { emoji: "🏥", name: "MediTrack", tag: "Healthcare", clients: 298, mrr: 52150, growth: 15, color: A.cyan },
    { emoji: "🤝", name: "SaccoSmart", tag: "SACCO/Finance", clients: 234, mrr: 46800, growth: 31, color: A.orange },
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
const MY_PRODUCTS = [
    { emoji: "💆", name: "BeautyPro", tag: "Spa & Salon", plan: "Monthly", price: "KES 2,500", status: "Active", renewal: "Jun 1, 2026", color: A.rose },
    { emoji: "⛪", name: "ChurchDesk", tag: "Church Mgmt", plan: "Monthly", price: "KES 1,500", status: "Active", renewal: "Jun 1, 2026", color: A.violet },
    { emoji: "🛒", name: "ShopFlow", tag: "Retail & Stock", plan: "—", price: "—", status: "Inactive", renewal: "—", color: A.amber },
];
const BILLING = [
    { product: "BeautyPro", month: "May 2026", amount: "KES 2,500", method: "M-Pesa" },
    { product: "ChurchDesk", month: "May 2026", amount: "KES 1,500", method: "M-Pesa" },
    { product: "BeautyPro", month: "Apr 2026", amount: "KES 2,500", method: "M-Pesa" },
    { product: "ChurchDesk", month: "Apr 2026", amount: "KES 1,500", method: "M-Pesa" },
    { product: "BeautyPro", month: "Mar 2026", amount: "KES 2,500", method: "M-Pesa" },
];

/* ══════════════════════════════════════════
   ADMIN DASH  ← Supabase-wired
══════════════════════════════════════════ */
interface ProductForm {
    name: string; category: string; monthly_price: string; one_time_price: string;
    image: File | null; video: File | null; pdf: File | null; software: File | null;
}
interface ClientForm {
    business_name: string; email: string; phone: string; product: string; plan: string;
}

function AdminDash() {
    const [tab, setTab] = useState("clients");

    /* ── Add Product state ── */
    const [productModal, setProductModal] = useState(false);
    const [productForm, setProductForm] = useState<ProductForm>({
        name: "", category: "", monthly_price: "", one_time_price: "",
        image: null, video: null, pdf: null, software: null,
    });
    const [productSaving, setProductSaving] = useState(false);
    const [productError, setProductError] = useState("");
    const [productSuccess, setProductSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");

    /* ── New Client state ── */
    const [clientModal, setClientModal] = useState(false);
    const [clientForm, setClientForm] = useState<ClientForm>({ business_name: "", email: "", phone: "", product: "BeautyPro", plan: "Monthly" });
    const [clientSaving, setClientSaving] = useState(false);
    const [clientError, setClientError] = useState("");
    const [clientSuccess, setClientSuccess] = useState(false);

    /* ── helpers: field change handlers ── */
    const pf = (k: keyof Pick<ProductForm, "name" | "category" | "monthly_price" | "one_time_price">) =>
        (e: React.ChangeEvent<HTMLInputElement>) => setProductForm(f => ({ ...f, [k]: e.target.value }));
    const pfile = (k: keyof Pick<ProductForm, "image" | "video" | "pdf" | "software">) =>
        (file: File | null) => setProductForm(f => ({ ...f, [k]: file }));
    const cf = (k: keyof ClientForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setClientForm(f => ({ ...f, [k]: e.target.value }));

    /* ── open modals cleanly ── */
    function openProductModal() {
        setProductForm({ name: "", category: "", monthly_price: "", one_time_price: "", image: null, video: null, pdf: null, software: null });
        setProductError(""); setProductSuccess(false); setUploadProgress(""); setProductModal(true);
    }
    function openClientModal() {
        setClientForm({ business_name: "", email: "", phone: "", product: "BeautyPro", plan: "Monthly" });
        setClientError(""); setClientSuccess(false); setClientModal(true);
    }

    /* ── Upload helper ── */
    async function uploadFile(bucket: string, file: File, name: string): Promise<string> {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${name.replace(/\s+/g, "-")}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file);
        if (error) throw new Error(`${bucket} upload failed: ${error.message}`);
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    }

    /* ── Supabase: upload files + insert into `platform_products` ── */
    async function saveProduct() {
        setProductError("");
        if (!productForm.name.trim()) { setProductError("Product name is required."); return; }
        if (!productForm.category.trim()) { setProductError("Category is required."); return; }
        if (!productForm.image) { setProductError("Product image is required."); return; }
        setProductSaving(true);

        try {
            setUploadProgress("📸 Uploading image…");
            const image_url = await uploadFile("product-images", productForm.image, productForm.name);

            let video_url: string | null = null;
            if (productForm.video) {
                setUploadProgress("🎥 Uploading video…");
                video_url = await uploadFile("product-videos", productForm.video, productForm.name);
            }

            let pdf_url: string | null = null;
            if (productForm.pdf) {
                setUploadProgress("📄 Uploading PDF…");
                pdf_url = await uploadFile("product-pdfs", productForm.pdf, productForm.name);
            }

            let software_url: string | null = null;
            if (productForm.software) {
                setUploadProgress("💾 Uploading software…");
                software_url = await uploadFile("product-software", productForm.software, productForm.name);
            }

            setUploadProgress("💽 Saving to database…");
            const { error } = await supabase.from("platform_products").insert({
                name: productForm.name.trim(),
                category: productForm.category.trim(),
                monthly_price: productForm.monthly_price ? Number(productForm.monthly_price) : null,
                one_time_price: productForm.one_time_price ? Number(productForm.one_time_price) : null,
                image_url,
                video_url,
                pdf_url,
                software_url,
                created_at: new Date().toISOString(),
            });
            if (error) throw new Error(error.message);

            setProductSuccess(true);
            setTimeout(() => { setProductModal(false); setProductSuccess(false); setUploadProgress(""); }, 1400);
        } catch (err: any) {
            setProductError(err.message);
            setUploadProgress("");
        } finally {
            setProductSaving(false);
        }
    }

    /* ── Supabase: insert into `users` ── */
    async function saveClient() {
        setClientError("");
        if (!clientForm.business_name.trim()) { setClientError("Business name is required."); return; }
        if (!clientForm.email.trim()) { setClientError("Email is required."); return; }
        setClientSaving(true);
        const { error } = await supabase.from("clients").insert({
            business_name: clientForm.business_name.trim(),
            email: clientForm.email.trim(),
            phone: clientForm.phone.trim() || null,
            product: clientForm.product,
            plan: clientForm.plan,
            status: "Active",
            created_at: new Date().toISOString(),
        });
        setClientSaving(false);
        if (error) { setClientError(error.message); return; }
        setClientSuccess(true);
        setTimeout(() => { setClientModal(false); setClientSuccess(false); }, 1400);
    }

    /* ── Inline alert ── */
    function InlineAlert({ msg, color }: { msg: string; color: string }) {
        return (
            <div style={{
                fontSize: 12, color, background: `${color}10`, border: `1px solid ${color}28`,
                borderRadius: 8, padding: "9px 13px", lineHeight: 1.5
            }}>{msg}</div>
        );
    }

    /* ── Success splash ── */
    function SuccessSplash({ icon, label }: { icon: string; label: string }) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "28px 0", textAlign: "center" }}>
                <div style={{ fontSize: 44, animation: "sbPulse 0.6s ease" }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: A.emerald, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Closing…</div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── Page header ── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: 0 }}>
                        Platform Overview
                    </h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
                        Dantechdevs IT & Consultancy · Admin View
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="outline" onClick={openProductModal}>📦 Add Product</Btn>
                    <Btn onClick={openClientModal}>+ New Client</Btn>
                </div>
            </div>

            {/* ── Stat cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                <StatCard icon="💰" label="Total Revenue" value={284500} prefix="KES " sub="18% this month" subUp={true} color={A.emerald} spark={[40, 55, 48, 70, 65, 85, 95]} />
                <StatCard icon="👥" label="Total Clients" value={2841} sub="124 new this week" subUp={true} color={A.blue} spark={[2600, 2650, 2700, 2720, 2760, 2810, 2841]} />
                <StatCard icon="📦" label="Active Products" value={6} sub="All products live" subUp={true} color={A.cyan} spark={[4, 4, 5, 5, 6, 6, 6]} />
                <StatCard icon="🎫" label="Open Tickets" value={14} sub="5 urgent" subUp={false} color={A.rose} spark={[8, 12, 10, 15, 11, 14, 14]} />
            </div>

            {/* ── Charts row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
                <Panel title="Monthly Revenue · 2026" action={<span style={{ fontSize: 12, color: A.emerald, fontWeight: 700 }}>↑ KES 528K YTD</span>}>
                    <BarChart
                        data={[42000, 58000, 71000, 63000, 89000, 95000, 110000]}
                        labels={["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"]}
                        colors={[`${A.blue}50`, `${A.blue}65`, `${A.blue}80`, `${A.blue}95`, A.blue, A.blueLt, A.cyan]}
                    />
                </Panel>
                <Panel title="Revenue Mix">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                        <div style={{ position: "relative", overflowY: "auto" }}>
                            <DonutChart size={124} segments={[{ value: 70, color: A.blue }, { value: 15, color: A.cyan }, { value: 10, color: A.emerald }, { value: 5, color: A.amber }]} />
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>KES</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>284.5K</div>
                            </div>
                        </div>
                        {([["Subscriptions", "70%", A.blue], ["One-Time", "15%", A.cyan], ["Renewal", "10%", A.emerald], ["Other", "5%", A.amber]] as [string, string, string][]).map(([l, p, c], i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontSize: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                                    <span style={{ color: "var(--text-secondary)" }}>{l}</span>
                                </div>
                                <span style={{ fontWeight: 700, color: c }}>{p}</span>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            {/* ── Product grid ── */}
            <Panel title="Product Performance" action={<Badge label="6 Products" />}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))", gap: 12 }}>
                    {PRODUCTS.map((p, i) => (
                        <div key={i}
                            style={{ background: "var(--card-inner)", border: `1px solid ${p.color}20`, borderRadius: 14, padding: "16px 14px", textAlign: "center", transition: "all 0.22s", cursor: "pointer" }}
                            onMouseEnter={e => { const t = e.currentTarget; t.style.borderColor = `${p.color}50`; t.style.transform = "translateY(-2px)"; t.style.boxShadow = "var(--shadow-md)"; }}
                            onMouseLeave={e => { const t = e.currentTarget; t.style.borderColor = `${p.color}20`; t.style.transform = "none"; t.style.boxShadow = "none"; }}>
                            <div style={{ fontSize: 26, marginBottom: 8 }}>{p.emoji}</div>
                            <div style={{ fontWeight: 800, fontSize: 13, color: p.color, fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 6 }}>{p.name}</div>
                            <div style={{ fontWeight: 800, fontSize: 21, color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{p.clients}</div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>clients</div>
                            <div style={{ fontSize: 11, color: p.color, fontWeight: 700 }}>KES {(p.mrr / 1000).toFixed(1)}K</div>
                            <div style={{ fontSize: 10, color: A.emerald, marginTop: 4 }}>+{p.growth}% ↑</div>
                        </div>
                    ))}
                </div>
            </Panel>

            {/* ── Tabs + tables ── */}
            <Tabs tabs={["clients", "products", "revenue"]} active={tab} onChange={setTab} />

            {tab === "clients" && (
                <Panel title="Recent Clients" action={<Btn sm variant="outline">View All →</Btn>}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead><tr><TH>Business</TH><TH>Product</TH><TH>Plan</TH><TH>Amount</TH><TH>Status</TH><TH>Date</TH><TH></TH></tr></thead>
                            <tbody>{RECENT_CLIENTS.map((c, i) => (
                                <TR key={i}>
                                    <TD bold>{c.name}</TD><TD>{c.product}</TD><TD>{c.plan}</TD>
                                    <TD amount>KES {c.amount.toLocaleString()}</TD>
                                    <TD><Badge label={c.status} type={c.status.toLowerCase()} /></TD>
                                    <TD>{c.date}</TD>
                                    <TD><Btn sm variant="outline">View</Btn></TD>
                                </TR>
                            ))}</tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === "products" && (
                <Panel title="All Products">
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead><tr><TH>Product</TH><TH>Clients</TH><TH>MRR</TH><TH>Growth</TH><TH>Status</TH><TH></TH></tr></thead>
                            <tbody>{PRODUCTS.map((p, i) => (
                                <TR key={i}>
                                    <TD>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{p.emoji}</div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>{p.name}</div>
                                                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.tag}</div>
                                            </div>
                                        </div>
                                    </TD>
                                    <TD bold>{p.clients.toLocaleString()}</TD>
                                    <TD amount>KES {(p.mrr / 1000).toFixed(1)}K</TD>
                                    <TD><span style={{ color: A.emerald, fontWeight: 700 }}>+{p.growth}%</span></TD>
                                    <TD><Badge label="Active" type="active" /></TD>
                                    <TD><Btn sm variant="outline">Manage</Btn></TD>
                                </TR>
                            ))}</tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === "revenue" && (
                <Panel title="Revenue Breakdown">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                        {([
                            { label: "Monthly Subscriptions", value: "KES 198,500", pct: 70, color: A.blue },
                            { label: "One-Time Licenses", value: "KES 86,000", pct: 30, color: A.cyan },
                            { label: "M-Pesa Payments", value: "KES 241,200", pct: 85, color: A.emerald },
                            { label: "Bank Transfers", value: "KES 43,300", pct: 15, color: A.violet },
                        ]).map((r, i) => (
                            <div key={i} style={{ background: "var(--card-inner)", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{r.label}</div>
                                <div style={{ fontWeight: 800, fontSize: 20, color: r.color, fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 12 }}>{r.value}</div>
                                <div style={{ height: 5, background: "var(--progress-track)", borderRadius: 3, overflow: "hidden", marginBottom: 5 }}>
                                    <div style={{ height: "100%", width: `${r.pct}%`, background: r.color, borderRadius: 3 }} />
                                </div>
                                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{r.pct}% of total</div>
                            </div>
                        ))}
                    </div>
                </Panel>
            )}

            {/* ════════════════════════════════
          ADD PRODUCT MODAL
          → uploads files to Storage
          → inserts into `platform_products`
      ════════════════════════════════ */}
            {productModal && (
                <Modal title="📦 Add New Product" sub="Register a new product on the platform" onClose={() => !productSaving && setProductModal(false)}>
                    {productSuccess ? (
                        <SuccessSplash icon="✅" label="Product saved successfully!" />
                    ) : (
                        <>
                            <Input label="Product Name *" placeholder="e.g. HotelPro" value={productForm.name} onChange={pf("name")} />
                            <Input label="Category *" placeholder="e.g. Hotel Management" value={productForm.category} onChange={pf("category")} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <Input label="Monthly Price (KES)" placeholder="3000" type="number" min="0" value={productForm.monthly_price} onChange={pf("monthly_price")} />
                                <Input label="One-Time Price (KES)" placeholder="50000" type="number" min="0" value={productForm.one_time_price} onChange={pf("one_time_price")} />
                            </div>

                            {/* Divider */}
                            <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "1px" }}>Files & Media</div>

                            <FileField
                                label="🖼️ Product Image *"
                                accept="image/*"
                                file={productForm.image}
                                onChange={pfile("image")}
                            />
                            <FileField
                                label="🎥 Demo Video (optional)"
                                accept="video/*"
                                file={productForm.video}
                                onChange={pfile("video")}
                            />
                            <FileField
                                label="📄 PDF Brochure (optional)"
                                accept=".pdf"
                                file={productForm.pdf}
                                onChange={pfile("pdf")}
                            />
                            <FileField
                                label="💾 Software / Installer (optional)"
                                accept=".exe,.apk,.zip,.dmg,.msi"
                                file={productForm.software}
                                onChange={pfile("software")}
                            />

                            {/* Upload progress */}
                            {uploadProgress && (
                                <div style={{
                                    fontSize: 12, color: A.blue, background: `${A.blue}10`,
                                    border: `1px solid ${A.blue}25`, borderRadius: 8, padding: "9px 13px",
                                    display: "flex", alignItems: "center", gap: 8
                                }}>
                                    <span style={{ animation: "sbPulse 1s infinite" }}>⏳</span> {uploadProgress}
                                </div>
                            )}

                            {productError && <InlineAlert msg={productError} color={A.rose} />}

                            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                                <Btn onClick={saveProduct}>
                                    {productSaving ? "⏳ Uploading…" : "💾 Save Product"}
                                </Btn>
                                <Btn variant="outline" onClick={() => !productSaving && setProductModal(false)}>Cancel</Btn>
                            </div>
                        </>
                    )}
                </Modal>
            )}

            {/* ════════════════════════════════
          NEW CLIENT MODAL
          → inserts into `users` table
      ════════════════════════════════ */}
            {clientModal && (
                <Modal title="👥 New Client" sub="Onboard a new client to the platform" onClose={() => setClientModal(false)}>
                    {clientSuccess ? (
                        <SuccessSplash icon="🎉" label="Client added successfully!" />
                    ) : (
                        <>
                            <Input label="Business Name *" placeholder="e.g. Apex Pharmacy" value={clientForm.business_name} onChange={cf("business_name")} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <Input label="Email *" placeholder="info@business.co.ke" type="email" value={clientForm.email} onChange={cf("email")} />
                                <Input label="Phone" placeholder="+254 7XX XXX XXX" type="tel" value={clientForm.phone} onChange={cf("phone")} />
                            </div>
                            <FSelect label="Product" value={clientForm.product} onChange={cf("product")}>
                                {["BeautyPro", "ShopFlow", "ChurchDesk", "EduCore", "MediTrack", "SaccoSmart"].map(p =>
                                    <option key={p}>{p}</option>
                                )}
                            </FSelect>
                            <FSelect label="Plan" value={clientForm.plan} onChange={cf("plan")}>
                                <option>Monthly</option>
                                <option>Annual</option>
                                <option>One-Time</option>
                                <option>Trial</option>
                            </FSelect>

                            {clientError && <InlineAlert msg={clientError} color={A.rose} />}

                            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                                <Btn onClick={saveClient}>{clientSaving ? "⏳ Saving…" : "✅ Add Client"}</Btn>
                                <Btn variant="outline" onClick={() => setClientModal(false)}>Cancel</Btn>
                            </div>
                        </>
                    )}
                </Modal>
            )}

        </div>
    );
}

/* ══════════════════════════════════════════
   CLIENT DASH
══════════════════════════════════════════ */
function ClientDash() {
    const [tab, setTab] = useState("products");
    const [payModal, setPayModal] = useState(false);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: 0 }}>Welcome back, Daniel 👋</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>Manage your subscriptions · Dantechdevs platform</p>
                </div>
                <Btn onClick={() => setPayModal(true)}>💳 Pay via M-Pesa</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                <StatCard icon="📦" label="Active Products" value={2} sub="of 6 available" subUp={true} color={A.blue} spark={[1, 1, 2, 2, 2, 2, 2]} />
                <StatCard icon="💳" label="Monthly Spend" value={4000} prefix="KES " sub="Next due Jun 1" subUp={false} color={A.amber} spark={[3500, 3500, 4000, 4000, 4000, 4000, 4000]} />
                <StatCard icon="📅" label="Days to Renewal" value={8} suffix=" days" sub="Auto-renew Jun 1" subUp={true} color={A.emerald} spark={[28, 21, 16, 11, 8, 8, 8]} />
                <StatCard icon="🎫" label="Open Tickets" value={1} sub="Awaiting reply" subUp={false} color={A.rose} spark={[0, 1, 0, 0, 1, 1, 1]} />
            </div>
            <div style={{ background: `linear-gradient(135deg,${A.bluePale},#F0F9FF)`, border: `1px solid ${A.blue}20`, borderRadius: 16, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 16, color: A.blue, marginBottom: 4 }}>🚀 Your software is running smoothly!</div>
                    <div style={{ fontSize: 13, color: `${A.blue}AA` }}>BeautyPro & ChurchDesk active · Next billing: June 1, 2026 · <strong style={{ color: A.blue }}>KES 4,000</strong></div>
                </div>
                <Btn variant="outline">Browse More →</Btn>
            </div>
            <Tabs tabs={["products", "billing", "profile"]} active={tab} onChange={setTab} />
            {tab === "products" && (
                <Panel title="My Products" action={<Btn sm variant="outline">+ Add Product</Btn>}>
                    {MY_PRODUCTS.map((p, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: i < MY_PRODUCTS.length - 1 ? "1px solid var(--border)" : "none" }}>
                            <div style={{ width: 48, height: 48, borderRadius: 13, flexShrink: 0, background: `${p.color}12`, border: `1px solid ${p.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{p.emoji}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 800, fontSize: 14, color: p.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{p.name}</div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{p.tag} · {p.plan} · {p.price}</div>
                                {p.renewal !== "—" && <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>Renews: {p.renewal}</div>}
                            </div>
                            <Badge label={p.status} type={p.status.toLowerCase()} />
                            {p.status === "Active" ? <Btn sm>Open App</Btn> : <Btn sm variant="outline">Subscribe</Btn>}
                        </div>
                    ))}
                </Panel>
            )}
            {tab === "billing" && (
                <Panel title="Billing History" action={<Btn sm onClick={() => setPayModal(true)}>💳 Pay Now</Btn>}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead><tr><TH>Product</TH><TH>Period</TH><TH>Amount</TH><TH>Method</TH><TH>Status</TH></tr></thead>
                            <tbody>{BILLING.map((b, i) => <TR key={i}><TD bold>{b.product}</TD><TD>{b.month}</TD><TD amount>{b.amount}</TD><TD>{b.method}</TD><TD><Badge label="✓ Paid" type="active" /></TD></TR>)}</tbody>
                        </table>
                    </div>
                </Panel>
            )}
            {tab === "profile" && (
                <Panel title="My Profile">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                        {([["Full Name", "Daniel Ngwasi"], ["Business Name", "Dantechdevs IT & Consultancy"], ["Email", "info@dantechdevs.com"], ["Phone", "+254 700 000 000"], ["Location", "Nairobi, Kenya"], ["Member Since", "January 2025"]] as [string, string][]).map(([l, v], i) => (
                            <Input key={i} label={l} defaultValue={v} />
                        ))}
                    </div>
                    <div style={{ marginTop: 18 }}><Btn>Save Changes</Btn></div>
                </Panel>
            )}
            {payModal && (
                <Modal title="Pay via M-Pesa 💳" sub="KES 4,000 due June 1, 2026" onClose={() => setPayModal(false)}>
                    <div style={{ background: `${A.emerald}10`, border: `1px solid ${A.emerald}25`, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        📱 An STK push will be sent to your M-Pesa number. Enter your PIN to complete.
                    </div>
                    <Input label="M-Pesa Number" placeholder="+254 7XX XXX XXX" type="tel" defaultValue="+254 700 000 000" />
                    <FSelect label="Product">
                        <option>BeautyPro — KES 2,500</option>
                        <option>ChurchDesk — KES 1,500</option>
                        <option>Both — KES 4,000</option>
                    </FSelect>
                    <div style={{ display: "flex", gap: 10 }}><Btn onClick={() => setPayModal(false)}>Send STK Push</Btn><Btn variant="outline" onClick={() => setPayModal(false)}>Cancel</Btn></div>
                </Modal>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   SUPPORT DASH
══════════════════════════════════════════ */
function SupportDash() {
    const [newTicket, setNewTicket] = useState(false);
    const [filter, setFilter] = useState("All");
    const filtered = filter === "All" ? TICKETS : TICKETS.filter(t => t.status === filter);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: 0 }}>Support Center</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>Manage client tickets across all products</p>
                </div>
                <Btn onClick={() => setNewTicket(true)}>+ New Ticket</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
                <StatCard icon="🎫" label="Total Tickets" value={14} color={A.blue} spark={[8, 9, 11, 12, 13, 13, 14]} />
                <StatCard icon="🔴" label="Open" value={4} color={A.rose} spark={[2, 3, 4, 4, 4, 4, 4]} sub="Needs attention" subUp={false} />
                <StatCard icon="🟡" label="Pending" value={3} color={A.amber} spark={[1, 2, 2, 3, 3, 3, 3]} sub="Awaiting reply" subUp={false} />
                <StatCard icon="✅" label="Resolved" value={7} color={A.emerald} spark={[2, 3, 4, 4, 5, 6, 7]} sub="This month" subUp={true} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["All", "Open", "Pending", "Resolved"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${filter === f ? A.blue : "var(--border)"}`, background: filter === f ? `${A.blue}12` : "transparent", color: filter === f ? A.blue : "var(--text-muted)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all 0.2s" }}>{f}</button>
                ))}
            </div>
            <Panel title={`Tickets (${filtered.length})`}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead><tr><TH>ID</TH><TH>Issue</TH><TH>Product</TH><TH>Priority</TH><TH>Status</TH><TH>Client</TH><TH>Date</TH><TH></TH></tr></thead>
                        <tbody>{filtered.map((t, i) => (
                            <TR key={i}>
                                <td style={{ padding: "12px", color: "var(--text-dim)", fontSize: 12 }}>{t.id}</td>
                                <TD>{t.title}</TD><TD>{t.product}</TD>
                                <TD><Badge label={t.priority} type={t.priority.toLowerCase()} /></TD>
                                <TD><Badge label={t.status} type={t.status.toLowerCase()} /></TD>
                                <TD>{t.client}</TD><TD>{t.date}</TD>
                                <TD><Btn sm variant="outline">Reply</Btn></TD>
                            </TR>
                        ))}</tbody>
                    </table>
                </div>
            </Panel>
            {newTicket && (
                <Modal title="Open New Ticket" sub="Report a client issue" onClose={() => setNewTicket(false)}>
                    <FSelect label="Product">{["BeautyPro", "ShopFlow", "ChurchDesk", "EduCore", "MediTrack", "SaccoSmart"].map(p => <option key={p}>{p}</option>)}</FSelect>
                    <Input label="Issue Title" placeholder="Brief description of the issue" />
                    <FSelect label="Priority"><option>Low</option><option>Medium</option><option>High</option></FSelect>
                    <Textarea label="Details" rows={4} placeholder="Describe the issue in detail…" />
                    <div style={{ display: "flex", gap: 10 }}><Btn onClick={() => setNewTicket(false)}>Submit Ticket</Btn><Btn variant="outline" onClick={() => setNewTicket(false)}>Cancel</Btn></div>
                </Modal>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   NOTIFICATIONS DATA
══════════════════════════════════════════ */
const NOTIFS = [
    { id: 1, icon: "💳", title: "Payment received", msg: "Bethel Church — KES 1,500", time: "2m", unread: true, color: A.emerald },
    { id: 2, icon: "🎫", title: "New ticket #TK-006", msg: "Nairobi Clinic — High", time: "14m", unread: true, color: A.rose },
    { id: 3, icon: "📦", title: "Trial expiring", msg: "St. Mary School — 3 days", time: "1h", unread: true, color: A.amber },
    { id: 4, icon: "👥", title: "New client", msg: "Apex Pharmacy onboarded", time: "3h", unread: false, color: A.blue },
];

/* ── Collapsible sidebar section ── */
function SidebarSection({ label, children, defaultOpen = true, badge }: {
    label: string; children: React.ReactNode; defaultOpen?: boolean; badge?: number;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{ marginBottom: 4 }}>
            <button onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "5px 10px", background: "none", border: "none", cursor: "pointer", marginBottom: open ? 4 : 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--sidebar-section)" }}>{label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {badge !== undefined && (
                        <span style={{ fontSize: 10, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 999, background: `${A.blue}18`, color: A.blue, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{badge}</span>
                    )}
                    <span style={{ fontSize: 10, color: "var(--sidebar-section)", transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}>▾</span>
                </div>
            </button>
            <div style={{ overflow: "hidden", maxHeight: open ? 800 : 0, transition: "max-height 0.3s cubic-bezier(.4,0,.2,1)", opacity: open ? 1 : 0 }}>
                {children}
            </div>
        </div>
    );
}

/* ── Sidebar item ── */
function SidebarItem({ icon, label, active, onClick, badge, badgeColor, dot, dotColor, sub, indent = false }: {
    icon: string; label: string; active?: boolean; onClick?: () => void;
    badge?: number | string; badgeColor?: string; dot?: boolean; dotColor?: string; sub?: string | number; indent?: boolean;
}) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} title={label}
            style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: indent ? "7px 12px 7px 32px" : "8px 12px",
                borderRadius: 10, width: "100%", textAlign: "left", border: "none", cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                background: active ? `linear-gradient(90deg,${A.blue}16 0%,${A.blue}06 100%)` : hov ? "var(--sidebar-item-hover)" : "transparent",
                borderLeft: active ? `2px solid ${A.blue}` : "2px solid transparent",
                color: active ? A.blue : hov ? "var(--sidebar-brand)" : "var(--sidebar-text)",
                fontSize: indent ? 12 : 13, fontWeight: active ? 700 : 500,
                transition: "all 0.18s", marginBottom: 1, position: "relative",
            }}>
            <span style={{ fontSize: indent ? 14 : 16, flexShrink: 0, opacity: active ? 1 : hov ? 1 : 0.75 }}>{icon}</span>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
            {sub !== undefined && <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600 }}>{sub}</span>}
            {badge !== undefined && (
                <span style={{ fontSize: 10, fontWeight: 800, minWidth: 20, height: 18, borderRadius: 999, flexShrink: 0, background: badgeColor ? `${badgeColor}20` : `${A.blue}18`, color: badgeColor || A.blue, border: `1px solid ${badgeColor ? `${badgeColor}30` : `${A.blue}25`}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{badge}</span>
            )}
            {dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor || A.emerald, flexShrink: 0, boxShadow: `0 0 6px ${dotColor || A.emerald}80` }} />}
            {active && !dot && !badge && <span style={{ width: 5, height: 5, borderRadius: "50%", background: A.blue, flexShrink: 0 }} />}
        </button>
    );
}

/* ── Notification flyout ── */
function NotifFlyout({ notifs, onClose, dark }: { notifs: typeof NOTIFS; onClose: () => void; dark: boolean }) {
    const [items, setItems] = useState(notifs);
    const unreadCount = items.filter(n => n.unread).length;
    return (
        <div style={{ position: "absolute", top: 0, left: "calc(100% + 10px)", width: 300, zIndex: 200, background: "var(--panel)", border: "1px solid var(--border-hi)", borderRadius: 16, boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "sbSlideIn 0.22s cubic-bezier(.4,0,.2,1)" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    Notifications {unreadCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, marginLeft: 6, padding: "2px 7px", borderRadius: 999, background: `${A.blue}15`, color: A.blue }}>{unreadCount} new</span>}
                </div>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 14, padding: 2 }}>✕</button>
            </div>
            {items.map((n, i) => (
                <div key={n.id}
                    onClick={() => setItems(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                    style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none", background: n.unread ? (dark ? "rgba(37,99,235,0.05)" : `${A.blue}04`) : "transparent", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = dark ? "rgba(255,255,255,0.03)" : "var(--bg-muted)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = n.unread ? (dark ? "rgba(37,99,235,0.05)" : `${A.blue}04`) : "transparent"}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: `${n.color}12`, border: `1px solid ${n.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{n.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{n.title}</span>
                            {n.unread && <div style={{ width: 6, height: 6, borderRadius: "50%", background: A.blue, flexShrink: 0, marginTop: 3 }} />}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{n.msg}</div>
                        <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 3 }}>{n.time} ago</div>
                    </div>
                </div>
            ))}
            <div style={{ padding: "10px 16px", textAlign: "center" }}>
                <button style={{ fontSize: 12, color: A.blue, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>View all notifications →</button>
            </div>
        </div>
    );
}

/* ── Search overlay ── */
function SearchOverlay({ onClose, onView }: { onClose: () => void; onView: (v: string) => void }) {
    const [q, setQ] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { setTimeout(() => inputRef.current?.focus(), 60); }, []);
    const CMDS = [
        { icon: "👑", label: "Switch to Admin view", action: () => { onView("admin"); onClose(); } },
        { icon: "👤", label: "Switch to Client view", action: () => { onView("client"); onClose(); } },
        { icon: "🎫", label: "Switch to Support view", action: () => { onView("support"); onClose(); } },
        { icon: "📦", label: "Add new product", action: onClose },
        { icon: "👥", label: "Add new client", action: onClose },
        { icon: "💳", label: "Pay via M-Pesa", action: onClose },
        { icon: "📊", label: "Export revenue report", action: onClose },
        { icon: "⚙️", label: "Settings", action: onClose },
    ];
    const filtered = CMDS.filter(c => !q || c.label.toLowerCase().includes(q.toLowerCase()));
    return (
        <div style={{ position: "absolute", top: 0, left: "calc(100% + 10px)", width: 320, zIndex: 200, background: "var(--panel)", border: "1px solid var(--border-hi)", borderRadius: 16, boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "sbSlideIn 0.22s cubic-bezier(.4,0,.2,1)" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 15, opacity: 0.5 }}>🔍</span>
                <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search or run a command…"
                    style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
                <kbd style={{ fontSize: 10, padding: "2px 6px", borderRadius: 5, background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>ESC</kbd>
            </div>
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
                <div style={{ padding: "6px 14px", fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-dim)", marginTop: 6 }}>Commands</div>
                {filtered.map((item, i) => (
                    <button key={i} onClick={item.action}
                        style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "background 0.12s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-muted)"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "none"}>
                        <span style={{ fontSize: 16 }}>{item.icon}</span>
                        <span style={{ fontSize: 13, color: "var(--text-primary)", flex: 1 }}>{item.label}</span>
                        <span style={{ fontSize: 11, color: "var(--text-dim)" }}>↵</span>
                    </button>
                ))}
                {filtered.length === 0 && <div style={{ padding: "24px 14px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No results</div>}
            </div>
        </div>
    );
}

/* ── User menu ── */
function UserMenu({ dark, setDark, onClose }: { dark: boolean; setDark: React.Dispatch<React.SetStateAction<boolean>>; onClose: () => void }) {
    return (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, zIndex: 200, background: "var(--panel)", border: "1px solid var(--border-hi)", borderRadius: 14, boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "sbSlideUp 0.22s cubic-bezier(.4,0,.2,1)" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${A.blue},${A.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff", flexShrink: 0, position: "relative", overflowY: "auto" }}>
                    DN
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: A.emerald, border: "2px solid var(--panel)" }} />
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Daniel Ngwasi</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>info@dantechdevs.com</div>
                </div>
            </div>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: `${A.blue}08`, border: `1px solid ${A.blue}20`, borderRadius: 10, padding: "8px 12px" }}>
                    <div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Current Plan</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: A.blue, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Business Plan</div>
                    </div>
                    <button style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 7, background: A.blue, color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Upgrade</button>
                </div>
            </div>
            {([
                { icon: "👤", label: "My Profile", shortcut: "" },
                { icon: "⚙️", label: "Settings", shortcut: "⌘," },
                { icon: "🔔", label: "Notifications", shortcut: "" },
                { icon: "📄", label: "Billing", shortcut: "" },
                { icon: "🌙", label: dark ? "Light Mode" : "Dark Mode", shortcut: "", action: () => { setDark(d => !d); onClose(); } },
                { icon: "🚪", label: "Sign Out", shortcut: "", danger: true },
            ] as Array<{ icon: string; label: string; shortcut: string; action?: () => void; danger?: boolean }>).map((item, i) => (
                <button key={i} onClick={item.action || onClose}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "background 0.12s", borderTop: i === 5 ? "1px solid var(--border)" : "none" }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = item.danger ? `${A.rose}08` : "var(--bg-muted)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "none"}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, flex: 1, textAlign: "left", color: item.danger ? A.rose : "var(--text-primary)", fontWeight: 500 }}>{item.label}</span>
                    {item.shortcut && <kbd style={{ fontSize: 10, padding: "2px 6px", borderRadius: 5, background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>{item.shortcut}</kbd>}
                </button>
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */
function Sidebar({ view, setView, dark, setDark }: {
    view: string; setView: (v: string) => void;
    dark: boolean; setDark: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [notifOpen, setNotifOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const unreadCount = NOTIFS.filter(n => n.unread).length;
    const sidebarRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setNotifOpen(false); setSearchOpen(false); setUserOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(p => !p); setNotifOpen(false); setUserOpen(false); }
            if (e.key === "Escape") { setSearchOpen(false); setNotifOpen(false); setUserOpen(false); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const toggleFlyout = (name: string) => {
        setNotifOpen(name === "notif" ? p => !p : false);
        setSearchOpen(name === "search" ? p => !p : false);
        setUserOpen(name === "user" ? p => !p : false);
    };

    const VIEWS = [
        { key: "admin", icon: "👑", label: "Admin", badge: null as number | null },
        { key: "client", icon: "👤", label: "Client", badge: null as number | null },
        { key: "support", icon: "🎫", label: "Support", badge: 4, badgeColor: A.rose },
    ];
    const NAV_LINKS = [
        { icon: "🏠", label: "Home" },
        { icon: "📦", label: "Products", sub: "6" },
        { icon: "💰", label: "Pricing" },
        { icon: "📊", label: "Reports", sub: "New" },
        { icon: "📞", label: "Contact" },
        { icon: "⚙️", label: "Settings" },
    ];
    const SIDEBAR_PRODUCTS = [
        { emoji: "💆", name: "BeautyPro", tag: "Spa & Salon", active: true, color: A.rose, clients: 842, growth: "+12%" },
        { emoji: "⛪", name: "ChurchDesk", tag: "Church Mgmt", active: true, color: A.violet, clients: 521, growth: "+22%" },
        { emoji: "🛒", name: "ShopFlow", tag: "Retail & Stock", active: false, color: A.amber, clients: 634, growth: "+8%" },
        { emoji: "🏫", name: "EduCore", tag: "Education", active: false, color: A.emerald, clients: 312, growth: "+5%" },
    ];

    return (
        <aside ref={sidebarRef} className="db-sidebar" style={{ position: "relative", overflowY: "auto" }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--sidebar-border)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#0891B2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff", flexShrink: 0 }}>D</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--sidebar-brand)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Dantechdevs</div>
                <div style={{ fontSize: 10, color: "var(--sidebar-tag)" }}>Code the Future</div>
              </div>
            </div>
            {/* Search bar */}
            <div style={{ position: "relative", marginBottom: 18 }}>
                <button onClick={() => toggleFlyout("search")}
                    style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 12px", borderRadius: 10, background: searchOpen ? "var(--bg-muted)" : "var(--sidebar-item-hover)", border: `1px solid ${searchOpen ? "var(--border-hi)" : "var(--sidebar-border)"}`, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all 0.18s" }}>
                    <span style={{ fontSize: 14, opacity: 0.6 }}>🔍</span>
                    <span style={{ flex: 1, textAlign: "left", fontSize: 12, color: "var(--sidebar-text)", opacity: 0.7 }}>Search…</span>
                    <kbd style={{ fontSize: 9, padding: "2px 5px", borderRadius: 5, background: "var(--bg-muted)", border: "1px solid var(--border)", color: "var(--text-dim)", letterSpacing: "0.5px" }}>⌘K</kbd>
                </button>
                {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onView={setView} />}
            </div>

            {/* Dashboard views */}
            <SidebarSection label="Dashboard" badge={unreadCount > 0 ? unreadCount : undefined}>
                {VIEWS.map(v => (
                    <SidebarItem key={v.key} icon={v.icon} label={v.label} active={view === v.key} onClick={() => setView(v.key)}
                        badge={v.badge ?? undefined} badgeColor={"badgeColor" in v ? v.badgeColor : undefined} />
                ))}
            </SidebarSection>

            {/* Navigation */}
            <div style={{ marginTop: 8 }}>
                <SidebarSection label="Navigate">
                    {NAV_LINKS.map(n => <SidebarItem key={n.label} icon={n.icon} label={n.label} sub={n.sub} />)}
                </SidebarSection>
            </div>

            {/* My Products */}
            <div style={{ marginTop: 8 }}>
                <SidebarSection label="My Products" badge={SIDEBAR_PRODUCTS.filter(p => p.active).length}>
                    {SIDEBAR_PRODUCTS.map(p => (
                        <div key={p.name}>
                            <button style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "7px 10px", borderRadius: 10, background: "none", border: "none", cursor: p.active ? "pointer" : "default", opacity: p.active ? 1 : 0.38, transition: "all 0.18s", marginBottom: 1 }}
                                onMouseEnter={e => p.active && ((e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-item-hover)")}
                                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "none")}>
                                <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: `${p.color}14`, border: `1px solid ${p.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{p.emoji}</div>
                                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: p.active ? p.color : "var(--sidebar-text)", fontFamily: "'Plus Jakarta Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                                    <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 1 }}>{p.tag}</div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    {p.active && <div style={{ fontSize: 10, color: A.emerald, fontWeight: 700 }}>{p.growth}</div>}
                                    {p.active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: A.emerald, marginLeft: "auto", marginTop: 3 }} />}
                                </div>
                            </button>
                        </div>
                    ))}
                    <button style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 12px", borderRadius: 10, background: "none", border: "1px dashed var(--sidebar-border)", cursor: "pointer", marginTop: 4, transition: "all 0.18s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-item-hover)"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "none"}>
                        <span style={{ fontSize: 14, color: "var(--sidebar-tag)" }}>＋</span>
                        <span style={{ fontSize: 12, color: "var(--sidebar-tag)", fontWeight: 600, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Browse all products</span>
                    </button>
                </SidebarSection>
            </div>

            {/* Quick Stats */}
            <div style={{ margin: "14px 0 8px", padding: "12px 10px", background: "var(--sidebar-item-hover)", borderRadius: 12, border: "1px solid var(--sidebar-border)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--sidebar-section)", marginBottom: 10 }}>Quick Stats</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {([
                        { label: "Revenue", value: "KES 284K", color: A.emerald },
                        { label: "Clients", value: "2,841", color: A.blue },
                        { label: "Tickets", value: "14 open", color: A.rose },
                        { label: "Products", value: "6 live", color: A.cyan },
                    ] as Array<{ label: string; value: string; color: string }>).map((s, i) => (
                        <div key={i} style={{ background: "var(--panel)", borderRadius: 8, padding: "8px 10px", border: `1px solid ${s.color}18` }}>
                            <div style={{ fontSize: 13, fontWeight: 800, color: s.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.value}</div>
                            <div style={{ fontSize: 10, color: "var(--text-dim)", marginTop: 1 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Bottom bar */}
            <div style={{ paddingTop: 12, borderTop: "1px solid var(--sidebar-border)", display: "flex", alignItems: "center", gap: 6, position: "relative", overflowY: "auto" }}>
                <button onClick={() => toggleFlyout("user")} style={{ display: "flex", alignItems: "center", gap: 9, flex: 1, background: "none", border: "none", cursor: "pointer", borderRadius: 10, padding: "6px 8px", transition: "background 0.18s", position: "relative", textAlign: "left" }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-item-hover)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "none"}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${A.blue},${A.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>DN</div>
                        <div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: A.emerald, border: "2px solid var(--sidebar-bg)" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--sidebar-brand)", fontFamily: "'Plus Jakarta Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Daniel Ngwasi</div>
                        <div style={{ fontSize: 10, color: "var(--sidebar-tag)" }}>Admin · Business</div>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--sidebar-section)", transition: "transform 0.2s", transform: userOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </button>

                <div style={{ position: "relative", overflowY: "auto" }}>
                    <button onClick={() => toggleFlyout("notif")} style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: notifOpen ? "var(--bg-muted)" : "none", border: `1px solid ${notifOpen ? "var(--border-hi)" : "transparent"}`, cursor: "pointer", transition: "all 0.18s", flexShrink: 0, position: "relative", overflowY: "auto" }}>
                        🔔
                        {unreadCount > 0 && (
                            <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: A.rose, fontSize: 9, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--sidebar-bg)" }}>{unreadCount}</span>
                        )}
                    </button>
                </div>

                <button onClick={() => setDark(d => !d)} title={dark ? "Light mode" : "Dark mode"}
                    style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: "none", border: "1px solid transparent", cursor: "pointer", transition: "all 0.18s", flexShrink: 0, color: "var(--sidebar-brand)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-item-hover)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--sidebar-border)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent"; }}>
                    {dark ? "☀️" : "🌙"}
                </button>

                {notifOpen && <NotifFlyout notifs={NOTIFS} onClose={() => setNotifOpen(false)} dark={dark} />}
                {userOpen && <UserMenu dark={dark} setDark={setDark} onClose={() => setUserOpen(false)} />}
            </div>
        </aside>
    );
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
const VIEWS_LIST = [
    { key: "admin", icon: "👑", label: "Admin" },
    { key: "client", icon: "👤", label: "Client" },
    { key: "support", icon: "🎫", label: "Support" },
];

export default function Dashboard() {
    const [view, setView] = useState("admin");
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        setDark(mq.matches);
        const h = (e: MediaQueryListEvent) => setDark(e.matches);
        mq.addEventListener("change", h);
        return () => mq.removeEventListener("change", h);
    }, []);

    const cv = VIEWS_LIST.find(v => v.key === view)!;

    return (
        <div className={dark ? "db-root db-dark" : "db-root"}>
            <Sidebar view={view} setView={setView} dark={dark} setDark={setDark} />

            <main style={{ flex: 1, overflowY: "auto", minWidth: 0, marginLeft: "248px" }}>
                {/* Topbar */}
                <div className="db-topbar">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Dashboard</span>
                        <span style={{ color: "var(--text-dim)", fontSize: 14 }}>›</span>
                        <span style={{ fontSize: 13, color: A.blue, fontWeight: 700 }}>{cv.icon} {cv.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: A.emerald, animation: "sbPulse 2s infinite" }} />
                            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Live · May 28, 2026</span>
                        </div>
                    </div>
                </div>

                {/* Mobile view tabs */}
                <div className="db-mobile-nav">
                    {VIEWS_LIST.map(v => (
                        <button key={v.key} onClick={() => setView(v.key)} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${view === v.key ? A.blue : "var(--border)"}`, background: view === v.key ? `${A.blue}12` : "transparent", color: view === v.key ? A.blue : "var(--text-muted)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                            {v.icon} {v.label}
                        </button>
                    ))}
                </div>

                <div style={{ padding: "24px 20px", maxWidth: "100%" }}>
                    {view === "admin" && <AdminDash />}
                    {view === "client" && <ClientDash />}
                    {view === "support" && <SupportDash />}
                </div>
            </main>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .db-root {
          --bg:#F8FAFC; --panel:#FFFFFF; --card-inner:#F8FAFC;
          --border:#E2E8F0; --border-hi:#CBD5E1;
          --text-primary:#0F172A; --text-secondary:#334155; --text-muted:#64748B; --text-dim:#94A3B8;
          --bg-muted:#F1F5F9; --input-bg:#FFFFFF; --row-hover:#F8FAFC; --progress-track:#E2E8F0;
          --shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
          --shadow-md:0 4px 12px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);
          --shadow-xl:0 20px 60px rgba(0,0,0,0.14),0 4px 16px rgba(0,0,0,0.06);
          --sidebar-bg:#EFF6FF; --sidebar-border:#BFDBFE;
          --sidebar-brand:#1E3A5F; --sidebar-tag:#3B82F6;
          --sidebar-text:#1E40AF; --sidebar-section:#93C5FD;
          --sidebar-item-hover:rgba(59,130,246,0.08);
        }
        .db-dark {
          --bg:#080C14; --panel:#0D1525; --card-inner:#111B2E;
          --border:rgba(255,255,255,0.07); --border-hi:rgba(255,255,255,0.13);
          --text-primary:#F1F5F9; --text-secondary:#CBD5E1; --text-muted:#64748B; --text-dim:#334155;
          --bg-muted:rgba(255,255,255,0.04); --input-bg:rgba(255,255,255,0.04);
          --row-hover:rgba(255,255,255,0.025); --progress-track:rgba(255,255,255,0.06);
          --shadow-sm:0 1px 4px rgba(0,0,0,0.4); --shadow-md:0 4px 16px rgba(0,0,0,0.5);
          --shadow-xl:0 24px 70px rgba(0,0,0,0.75),0 4px 20px rgba(0,0,0,0.4);
          --sidebar-bg:#080E1C; --sidebar-border:rgba(59,130,246,0.18);
          --sidebar-brand:#E2E8F0; --sidebar-tag:#60A5FA;
          --sidebar-text:#93C5FD; --sidebar-section:#1E3A5F;
          --sidebar-item-hover:rgba(59,130,246,0.1);
        }
        *{box-sizing:border-box;margin:0;padding:0;}
        .db-root{display:flex;min-height:100vh;background:var(--bg);color:var(--text-primary);font-family:'Plus Jakarta Sans',sans-serif;position:relative;}
        .db-sidebar{width:248px;flex-shrink:0;background:var(--sidebar-bg);border-right:1px solid var(--sidebar-border);display:flex;flex-direction:column;padding:22px 12px 18px;position:fixed;top:0;left:0;height:100vh;margin-left:0;overflow-y:auto;overflow-x:visible;z-index:100;}
        .db-topbar{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--panel);position:sticky;top:0;z-index:50;box-shadow:var(--shadow-sm);}
        .db-mobile-nav{display:none;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.2);border-radius:2px;}
        input:focus,select:focus,textarea:focus{border-color:#2563EB!important;box-shadow:0 0 0 3px rgba(37,99,235,0.12);}
        .db-dark option{background:#0D1525;}
        .db-root:not(.db-dark) option{background:#fff;color:#0F172A;}
        @keyframes sbSlideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes sbSlideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sbPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.85)}}
        @media(max-width:768px){
          .db-sidebar{display:none!important;}
          .db-mobile-nav{display:flex!important;gap:8px;padding:12px 16px;border-bottom:1px solid var(--border);flex-wrap:wrap;background:var(--panel);}
          .db-topbar{padding:12px 16px;}
          main>div:last-child{padding:20px 16px!important;}
        }
      `}</style>
        </div>
    );
}