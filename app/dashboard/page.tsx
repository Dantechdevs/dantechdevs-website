"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Brand Colors ── */
const NAVY = "#07111F";
const CARD = "#0C1A2E";
const CARD2 = "#102238";
const BORDER = "rgba(245,158,11,0.12)";
const GOLD = "#F59E0B";
const GOLD2 = "#D97706";
const GREEN = "#22C55E";
const BLUE = "#3B82F6";
const RED = "#E11D48";

/* ── Types ── */
type DashView = "admin" | "client" | "support";

/* ══════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════ */
function StatCard({ icon, label, value, sub, color = GOLD, trend }: {
    icon: string; label: string; value: string; sub?: string; color?: string; trend?: "up" | "down" | "neutral";
}) {
    return (
        <div className="db-stat">
            <div className="db-stat__icon" style={{ background: `${color}18`, color }}>{icon}</div>
            <div style={{ flex: 1 }}>
                <div className="db-stat__value" style={{ color }}>{value}</div>
                <div className="db-stat__label">{label}</div>
                {sub && (
                    <div className="db-stat__sub" style={{
                        color: trend === "up" ? GREEN : trend === "down" ? RED : "rgba(255,255,255,0.35)"
                    }}>
                        {trend === "up" ? "↑ " : trend === "down" ? "↓ " : ""}{sub}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   BAR CHART
══════════════════════════════════════════ */
function MiniChart({ data, color = GOLD, labels }: { data: number[]; color?: string; labels: string[] }) {
    const max = Math.max(...data);
    return (
        <div>
            <div className="db-chart">
                {data.map((v, i) => (
                    <div key={i} className="db-chart__bar-wrap" title={`${labels[i]}: ${v}`}>
                        <div className="db-chart__bar" style={{
                            height: `${(v / max) * 100}%`,
                            background: `linear-gradient(to top, ${color}99, ${color})`,
                        }} />
                    </div>
                ))}
            </div>
            <div className="db-chart__labels">
                {labels.map(d => <span key={d}>{d}</span>)}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   PRODUCT BADGE
══════════════════════════════════════════ */
function ProductBadge({ name, status }: { name: string; status: string }) {
    const colors: Record<string, string> = {
        Active: GREEN, Trial: GOLD, Expired: RED, Inactive: "rgba(255,255,255,0.3)"
    };
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
            background: `${colors[status]}18`, color: colors[status],
            border: `1px solid ${colors[status]}33`,
        }}>{status}</span>
    );
}

/* ══════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════ */
const adminStats = [
    { icon: "💰", label: "Total Revenue", value: "KES 284,500", sub: "+18% this month", color: GREEN, trend: "up" },
    { icon: "📦", label: "Active Products", value: "6", sub: "All products live", color: BLUE, trend: "neutral" },
    { icon: "👥", label: "Total Clients", value: "2,841", sub: "+124 this week", color: GOLD, trend: "up" },
    { icon: "🎫", label: "Open Tickets", value: "14", sub: "5 urgent", color: RED, trend: "down" },
] as const;

const recentClients = [
    { name: "Sunshine Salon", product: "BeautyPro", plan: "Monthly", amount: "KES 2,500", status: "Active", date: "May 23" },
    { name: "Bethel Church", product: "ChurchDesk", plan: "One-Time", amount: "KES 25,000", status: "Active", date: "May 22" },
    { name: "St. Mary School", product: "EduCore", plan: "Monthly", amount: "KES 3,000", status: "Trial", date: "May 21" },
    { name: "Nairobi Clinic", product: "MediTrack", plan: "Monthly", amount: "KES 3,500", status: "Active", date: "May 20" },
    { name: "Kamau Traders", product: "ShopFlow", plan: "Monthly", amount: "KES 2,000", status: "Inactive", date: "May 18" },
];

const productStats = [
    { emoji: "💆", name: "BeautyPro", clients: 842, mrr: "KES 84,200", growth: "+12%", color: RED },
    { emoji: "🛒", name: "ShopFlow", clients: 634, mrr: "KES 63,400", growth: "+8%", color: GOLD },
    { emoji: "⛪", name: "ChurchDesk", clients: 521, mrr: "KES 52,100", growth: "+22%", color: "#A78BFA" },
    { emoji: "🏫", name: "EduCore", clients: 312, mrr: "KES 46,800", growth: "+5%", color: GREEN },
    { emoji: "🏥", name: "MediTrack", clients: 298, mrr: "KES 52,150", growth: "+15%", color: BLUE },
    { emoji: "🤝", name: "SaccoSmart", clients: 234, mrr: "KES 46,800", growth: "+31%", color: "#FB923C" },
];

function AdminDash() {
    const [tab, setTab] = useState<"clients" | "products" | "revenue">("clients");
    const [showAddProduct, setShowAddProduct] = useState(false);

    return (
        <div className="db-content">
            {/* Header */}
            <div className="db-welcome">
                <div>
                    <h2 className="db-welcome__title">Admin Overview 👑</h2>
                    <p className="db-welcome__sub">Full platform control · Dantechdevs IT & Consultancy</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="db-btn db-btn--outline" onClick={() => setShowAddProduct(true)}>📦 Add Product</button>
                    <button className="db-btn">+ New Client</button>
                </div>
            </div>

            {/* Stats */}
            <div className="db-stats-grid">
                {adminStats.map((s, i) => (
                    <StatCard key={i} icon={s.icon} label={s.label} value={s.value} sub={s.sub} color={s.color} trend={s.trend} />
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="db-panel">
                <div className="db-panel__head">
                    <span className="db-panel__title">Monthly Revenue — 2026</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>↑ KES 284,500 YTD</span>
                </div>
                <MiniChart
                    data={[42000, 58000, 71000, 63000, 89000, 95000, 284500]}
                    color={GOLD}
                    labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Total"]}
                />
            </div>

            {/* Product Performance */}
            <div className="db-panel" style={{ marginBottom: 20 }}>
                <div className="db-panel__head">
                    <span className="db-panel__title">Product Performance</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>All 6 products</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                    {productStats.map((p, i) => (
                        <div key={i} style={{
                            background: CARD2, border: `1px solid ${p.color}22`,
                            borderRadius: 14, padding: "16px 14px", textAlign: "center",
                        }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{p.emoji}</div>
                            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: p.color, marginBottom: 4 }}>{p.name}</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif" }}>{p.clients}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>clients</div>
                            <div style={{ fontSize: 12, color: p.color, fontWeight: 700 }}>{p.mrr}</div>
                            <div style={{ fontSize: 11, color: GREEN, marginTop: 4 }}>{p.growth} ↑</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="db-tabs">
                {(["clients", "products", "revenue"] as const).map(t => (
                    <button key={t} className={`db-tab${tab === t ? " db-tab--active" : ""}`} onClick={() => setTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {tab === "clients" && (
                <div className="db-panel">
                    <div className="db-panel__head">
                        <span className="db-panel__title">Recent Clients</span>
                        <button className="db-btn db-btn--sm">View All →</button>
                    </div>
                    <div className="db-table-wrap">
                        <table className="db-table">
                            <thead><tr><th>Business</th><th>Product</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                            <tbody>
                                {recentClients.map((c, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600, color: "#fff" }}>{c.name}</td>
                                        <td className="db-table__muted">{c.product}</td>
                                        <td className="db-table__muted">{c.plan}</td>
                                        <td className="db-table__amount">{c.amount}</td>
                                        <td><ProductBadge name={c.product} status={c.status} /></td>
                                        <td className="db-table__muted">{c.date}</td>
                                        <td><button className="db-btn db-btn--sm">View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === "products" && (
                <div className="db-panel">
                    <div className="db-panel__head"><span className="db-panel__title">All Products Status</span></div>
                    <div className="db-table-wrap">
                        <table className="db-table">
                            <thead><tr><th>Product</th><th>Clients</th><th>MRR</th><th>Growth</th><th>Status</th><th>Action</th></tr></thead>
                            <tbody>
                                {productStats.map((p, i) => (
                                    <tr key={i}>
                                        <td><span style={{ marginRight: 8 }}>{p.emoji}</span><span style={{ fontWeight: 700, color: p.color }}>{p.name}</span></td>
                                        <td style={{ color: "#fff", fontWeight: 600 }}>{p.clients}</td>
                                        <td className="db-table__amount">{p.mrr}</td>
                                        <td style={{ color: GREEN, fontWeight: 700 }}>{p.growth}</td>
                                        <td><ProductBadge name={p.name} status="Active" /></td>
                                        <td><button className="db-btn db-btn--sm">Manage</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === "revenue" && (
                <div className="db-panel">
                    <div className="db-panel__head"><span className="db-panel__title">Revenue Breakdown</span></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {[
                            { label: "Monthly Subscriptions", value: "KES 198,500", pct: 70, color: GOLD },
                            { label: "One-Time Licenses", value: "KES 86,000", pct: 30, color: BLUE },
                            { label: "M-Pesa Payments", value: "KES 241,200", pct: 85, color: GREEN },
                            { label: "Bank Transfers", value: "KES 43,300", pct: 15, color: "#A78BFA" },
                        ].map((r, i) => (
                            <div key={i} style={{ background: CARD2, borderRadius: 14, padding: 20, border: `1px solid ${BORDER}` }}>
                                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{r.label}</div>
                                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: r.color, marginBottom: 10 }}>{r.value}</div>
                                <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${r.pct}%`, background: r.color, borderRadius: 3 }} />
                                </div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>{r.pct}% of total</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddProduct && (
                <div className="db-modal-bg" onClick={() => setShowAddProduct(false)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="db-modal__title">Add New Product 📦</h3>
                        <p className="db-modal__sub">Register a new software product on the platform.</p>
                        <label className="db-label">Product Name</label>
                        <input className="db-input" placeholder="e.g. HotelPro" />
                        <label className="db-label">Category</label>
                        <input className="db-input" placeholder="e.g. Hotel Management" />
                        <label className="db-label">Monthly Price (KES)</label>
                        <input className="db-input" placeholder="e.g. 3000" type="number" />
                        <label className="db-label">One-Time Price (KES)</label>
                        <input className="db-input" placeholder="e.g. 50000" type="number" />
                        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                            <button className="db-btn" style={{ flex: 1 }}>Save Product</button>
                            <button className="db-btn db-btn--outline" onClick={() => setShowAddProduct(false)} style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   CLIENT DASHBOARD
══════════════════════════════════════════ */
const myProducts = [
    { emoji: "💆", name: "BeautyPro", tagline: "Spa & Salon", plan: "Monthly", price: "KES 2,500", status: "Active", renewal: "Jun 1, 2026", color: RED },
    { emoji: "⛪", name: "ChurchDesk", tagline: "Church Mgmt", plan: "Monthly", price: "KES 1,500", status: "Active", renewal: "Jun 1, 2026", color: "#A78BFA" },
    { emoji: "🛒", name: "ShopFlow", tagline: "Retail & Stock", plan: "—", price: "—", status: "Inactive", renewal: "—", color: GOLD },
];

const billingHistory = [
    { product: "BeautyPro", month: "May 2026", amount: "KES 2,500", method: "M-Pesa", paid: true },
    { product: "ChurchDesk", month: "May 2026", amount: "KES 1,500", method: "M-Pesa", paid: true },
    { product: "BeautyPro", month: "Apr 2026", amount: "KES 2,500", method: "M-Pesa", paid: true },
    { product: "ChurchDesk", month: "Apr 2026", amount: "KES 1,500", method: "M-Pesa", paid: true },
    { product: "BeautyPro", month: "Mar 2026", amount: "KES 2,500", method: "M-Pesa", paid: true },
];

function ClientDash() {
    const [tab, setTab] = useState<"products" | "billing" | "profile">("products");
    const [payModal, setPayModal] = useState(false);

    return (
        <div className="db-content">
            <div className="db-welcome">
                <div>
                    <h2 className="db-welcome__title">Welcome back, Daniel 👋</h2>
                    <p className="db-welcome__sub">Manage your software subscriptions · Dantechdevs platform</p>
                </div>
                <button className="db-btn" onClick={() => setPayModal(true)}>💳 Pay via M-Pesa</button>
            </div>

            {/* Stats */}
            <div className="db-stats-grid">
                <StatCard icon="📦" label="Active Products" value="2" sub="of 6 available" color={BLUE} trend="neutral" />
                <StatCard icon="💳" label="Monthly Spend" value="KES 4,000" sub="Next due Jun 1" color={GOLD} trend="neutral" />
                <StatCard icon="📅" label="Days to Renewal" value="8 days" sub="Auto-renew on Jun 1" color={GREEN} trend="neutral" />
                <StatCard icon="🎫" label="Open Tickets" value="1" sub="Awaiting reply" color={RED} trend="neutral" />
            </div>

            {/* Welcome Banner */}
            <div style={{
                background: `linear-gradient(135deg, #1A3050, ${CARD2})`,
                border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: "24px 28px", marginBottom: 20,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: `${GOLD}08` }} />
                <div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 6 }}>
                        🚀 Your software is running smoothly!
                    </div>
                    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                        BeautyPro & ChurchDesk are active. Next billing: June 1, 2026 · KES 4,000
                    </div>
                </div>
                <Link href="/products" style={{
                    padding: "10px 20px", borderRadius: 10, background: `${GOLD}18`,
                    border: `1px solid ${GOLD}33`, color: GOLD,
                    textDecoration: "none", fontSize: 13, fontWeight: 700,
                    fontFamily: "Syne, sans-serif", whiteSpace: "nowrap",
                }}>
                    Browse More →
                </Link>
            </div>

            {/* Tabs */}
            <div className="db-tabs">
                {(["products", "billing", "profile"] as const).map(t => (
                    <button key={t} className={`db-tab${tab === t ? " db-tab--active" : ""}`} onClick={() => setTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {tab === "products" && (
                <div className="db-panel">
                    <div className="db-panel__head">
                        <span className="db-panel__title">My Products</span>
                        <Link href="/products" style={{ fontSize: 12, color: GOLD, textDecoration: "none", fontWeight: 700 }}>+ Add Product →</Link>
                    </div>
                    {myProducts.map((p, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 16,
                            padding: "16px 0", borderBottom: i < myProducts.length - 1 ? `1px solid ${BORDER}` : "none",
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                background: `${p.color}12`, border: `1px solid ${p.color}25`,
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                            }}>{p.emoji}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 15, color: p.color }}>{p.name}</div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{p.tagline} · {p.plan} · {p.price}</div>
                                {p.renewal !== "—" && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>Renews: {p.renewal}</div>}
                            </div>
                            <ProductBadge name={p.name} status={p.status} />
                            {p.status === "Active" ? (
                                <button className="db-btn db-btn--sm">Open App</button>
                            ) : (
                                <button className="db-btn db-btn--sm" style={{ background: `${GOLD}18`, color: GOLD }}>Subscribe</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === "billing" && (
                <div className="db-panel">
                    <div className="db-panel__head">
                        <span className="db-panel__title">Billing History</span>
                        <button className="db-btn db-btn--sm" onClick={() => setPayModal(true)}>💳 Pay Now</button>
                    </div>
                    <div className="db-table-wrap">
                        <table className="db-table">
                            <thead><tr><th>Product</th><th>Period</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                            <tbody>
                                {billingHistory.map((b, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600, color: "#fff" }}>{b.product}</td>
                                        <td className="db-table__muted">{b.month}</td>
                                        <td className="db-table__amount">{b.amount}</td>
                                        <td className="db-table__muted">{b.method}</td>
                                        <td><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}33` }}>✓ Paid</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === "profile" && (
                <div className="db-panel">
                    <div className="db-panel__head"><span className="db-panel__title">My Profile</span></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-grid">
                        {[
                            { label: "Full Name", val: "Daniel Ngwasi" },
                            { label: "Business Name", val: "Dantechdevs IT & Consultancy" },
                            { label: "Email", val: "info@dantechdevs.com" },
                            { label: "Phone/WhatsApp", val: "+254 700 000 000" },
                            { label: "Location", val: "Nairobi, Kenya" },
                            { label: "Member Since", val: "January 2025" },
                        ].map((f, i) => (
                            <div key={i}>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{f.label}</div>
                                <input className="db-input" defaultValue={f.val} />
                            </div>
                        ))}
                    </div>
                    <button className="db-btn" style={{ marginTop: 20 }}>Save Changes</button>
                </div>
            )}

            {/* M-Pesa Modal */}
            {payModal && (
                <div className="db-modal-bg" onClick={() => setPayModal(false)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="db-modal__title">Pay via M-Pesa 💳</h3>
                        <p className="db-modal__sub">Next payment: <strong style={{ color: GOLD }}>KES 4,000</strong> due June 1, 2026</p>
                        <div style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25`, borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                            📱 An STK push will be sent to your M-Pesa number. Enter your PIN to complete payment.
                        </div>
                        <label className="db-label">M-Pesa Number</label>
                        <input className="db-input" placeholder="+254 7XX XXX XXX" type="tel" defaultValue="+254 700 000 000" />
                        <label className="db-label">Product</label>
                        <select className="db-input" style={{ cursor: "pointer" }}>
                            <option>BeautyPro — KES 2,500</option>
                            <option>ChurchDesk — KES 1,500</option>
                            <option>Both — KES 4,000</option>
                        </select>
                        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                            <button className="db-btn" style={{ flex: 1, background: `linear-gradient(135deg, ${GOLD2}, ${GOLD})` }}>
                                Send STK Push
                            </button>
                            <button className="db-btn db-btn--outline" onClick={() => setPayModal(false)} style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   SUPPORT DASHBOARD
══════════════════════════════════════════ */
const tickets = [
    { id: "#TK-001", title: "M-Pesa payment not reflecting in BeautyPro", product: "BeautyPro", priority: "High", status: "Open", date: "May 22", client: "Daniel Ngwasi" },
    { id: "#TK-002", title: "ChurchDesk SMS not sending to members", product: "ChurchDesk", priority: "Medium", status: "Pending", date: "May 20", client: "Bethel Church" },
    { id: "#TK-003", title: "EduCore fee collection report error", product: "EduCore", priority: "Low", status: "Resolved", date: "May 18", client: "St. Mary School" },
    { id: "#TK-004", title: "SaccoSmart loan interest miscalculation", product: "SaccoSmart", priority: "High", status: "Open", date: "May 17", client: "Jitihada SACCO" },
    { id: "#TK-005", title: "ShopFlow barcode scanner not working", product: "ShopFlow", priority: "Medium", status: "Resolved", date: "May 15", client: "Kamau Traders" },
];

function SupportDash() {
    const [newTicket, setNewTicket] = useState(false);
    const [filter, setFilter] = useState<"All" | "Open" | "Pending" | "Resolved">("All");

    const filtered = filter === "All" ? tickets : tickets.filter(t => t.status === filter);
    const prioColor = (p: string) => p === "High" ? RED : p === "Medium" ? GOLD : GREEN;

    return (
        <div className="db-content">
            <div className="db-welcome">
                <div>
                    <h2 className="db-welcome__title">Support Center 🎫</h2>
                    <p className="db-welcome__sub">Manage client support tickets across all products</p>
                </div>
                <button className="db-btn" onClick={() => setNewTicket(true)}>+ New Ticket</button>
            </div>

            <div className="db-stats-grid">
                <StatCard icon="🎫" label="Total Tickets" value="14" sub="All time" color={BLUE} trend="neutral" />
                <StatCard icon="🔴" label="Open" value="4" sub="Needs attention" color={RED} trend="down" />
                <StatCard icon="🟡" label="Pending" value="3" sub="Awaiting reply" color={GOLD} trend="neutral" />
                <StatCard icon="🟢" label="Resolved" value="7" sub="This month" color={GREEN} trend="up" />
            </div>

            {/* Filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {(["All", "Open", "Pending", "Resolved"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: "7px 16px", borderRadius: 999, border: "1px solid",
                        borderColor: filter === f ? GOLD : BORDER,
                        background: filter === f ? `${GOLD}12` : "transparent",
                        color: filter === f ? GOLD : "rgba(255,255,255,0.4)",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        fontFamily: "DM Sans, sans-serif",
                    }}>{f}</button>
                ))}
            </div>

            <div className="db-panel">
                <div className="db-panel__head">
                    <span className="db-panel__title">Tickets ({filtered.length})</span>
                </div>
                <div className="db-table-wrap">
                    <table className="db-table">
                        <thead><tr><th>ID</th><th>Issue</th><th>Product</th><th>Priority</th><th>Status</th><th>Client</th><th>Date</th><th>Action</th></tr></thead>
                        <tbody>
                            {filtered.map((t, i) => (
                                <tr key={i}>
                                    <td className="db-table__id">{t.id}</td>
                                    <td style={{ maxWidth: 220, color: "#fff", fontWeight: 500 }}>{t.title}</td>
                                    <td className="db-table__muted">{t.product}</td>
                                    <td><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: `${prioColor(t.priority)}18`, color: prioColor(t.priority) }}>{t.priority}</span></td>
                                    <td><span className={`db-status db-status--${t.status.toLowerCase()}`}>{t.status}</span></td>
                                    <td className="db-table__muted">{t.client}</td>
                                    <td className="db-table__muted">{t.date}</td>
                                    <td><button className="db-btn db-btn--sm">Reply</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {newTicket && (
                <div className="db-modal-bg" onClick={() => setNewTicket(false)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="db-modal__title">Open New Ticket 🎫</h3>
                        <label className="db-label">Product</label>
                        <select className="db-input" style={{ cursor: "pointer" }}>
                            {["BeautyPro", "ShopFlow", "ChurchDesk", "EduCore", "MediTrack", "SaccoSmart"].map(p => <option key={p}>{p}</option>)}
                        </select>
                        <label className="db-label">Issue Title</label>
                        <input className="db-input" placeholder="Brief description of the issue" />
                        <label className="db-label">Priority</label>
                        <select className="db-input" style={{ cursor: "pointer" }}>
                            <option>Low</option><option>Medium</option><option>High</option>
                        </select>
                        <label className="db-label">Details</label>
                        <textarea className="db-input" rows={4} placeholder="Describe the issue in detail..." style={{ resize: "vertical" }} />
                        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                            <button className="db-btn" style={{ flex: 1 }}>Submit Ticket</button>
                            <button className="db-btn db-btn--outline" onClick={() => setNewTicket(false)} style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function DashboardPage() {
    const [view, setView] = useState<DashView>("admin");

    const VIEWS = [
        { key: "admin" as DashView, icon: "👑", label: "Admin" },
        { key: "client" as DashView, icon: "👤", label: "Client" },
        { key: "support" as DashView, icon: "🎫", label: "Support" },
    ];

    const navItems = [
        { icon: "🏠", label: "Home", href: "/" },
        { icon: "📦", label: "Products", href: "/#products" },
        { icon: "💰", label: "Pricing", href: "/#pricing" },
        { icon: "📞", label: "Contact", href: "/contact" },
        { icon: "⚙️", label: "Settings", href: "#" },
    ];

    return (
        <div className="db-root">

            {/* ── Sidebar ── */}
            <aside className="db-sidebar">
                <div className="db-sidebar__brand">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${GOLD2}, ${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
                        <div>
                            <div className="db-sidebar__brand-name">Dantechdevs</div>
                            <div className="db-sidebar__brand-tag">IT & Consultancy</div>
                        </div>
                    </div>
                </div>

                <nav className="db-sidebar__nav">
                    <div className="db-sidebar__section">Dashboard View</div>
                    {VIEWS.map(v => (
                        <button key={v.key} className={`db-sidebar__item${view === v.key ? " db-sidebar__item--active" : ""}`} onClick={() => setView(v.key)}>
                            <span>{v.icon}</span><span>{v.label}</span>
                        </button>
                    ))}

                    <div className="db-sidebar__section" style={{ marginTop: 20 }}>Navigation</div>
                    {navItems.map(item => (
                        <Link key={item.label} href={item.href} className="db-sidebar__item" style={{ textDecoration: "none" }}>
                            <span>{item.icon}</span><span>{item.label}</span>
                        </Link>
                    ))}

                    <div className="db-sidebar__section" style={{ marginTop: 20 }}>Products</div>
                    {[
                        { emoji: "💆", name: "BeautyPro", active: true },
                        { emoji: "⛪", name: "ChurchDesk", active: true },
                        { emoji: "🛒", name: "ShopFlow", active: false },
                    ].map(p => (
                        <div key={p.name} className="db-sidebar__item" style={{ cursor: p.active ? "pointer" : "default", opacity: p.active ? 1 : 0.4 }}>
                            <span>{p.emoji}</span>
                            <span>{p.name}</span>
                            {p.active && <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />}
                        </div>
                    ))}
                </nav>

                <div className="db-sidebar__footer">
                    <div className="db-avatar">DN</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Daniel Ngwasi</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Admin · Business Plan</div>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="db-main">
                <div className="db-view-toggle">
                    {VIEWS.map(v => (
                        <button key={v.key} className={`db-view-chip${view === v.key ? " db-view-chip--active" : ""}`} onClick={() => setView(v.key)}>
                            {v.icon} {v.label}
                        </button>
                    ))}
                </div>
                {view === "admin" && <AdminDash />}
                {view === "client" && <ClientDash />}
                {view === "support" && <SupportDash />}
            </main>

            {/* ══ STYLES ══ */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .db-root { display:flex; min-height:100vh; background:${NAVY}; color:#E8EDF5; font-family:'DM Sans',sans-serif; }

        /* Sidebar */
        .db-sidebar { width:230px; flex-shrink:0; background:${CARD}; border-right:1px solid ${BORDER}; display:flex; flex-direction:column; padding:24px 14px; position:sticky; top:0; height:100vh; overflow-y:auto; }
        .db-sidebar__brand { margin-bottom:28px; padding:0 6px; }
        .db-sidebar__brand-name { font-family:'Syne',sans-serif; font-weight:800; font-size:16px; color:#fff; }
        .db-sidebar__brand-tag  { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${GOLD}; margin-top:1px; }
        .db-sidebar__nav { flex:1; }
        .db-sidebar__section { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,0.2); padding:0 8px; margin:16px 0 6px; }
        .db-sidebar__item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px; font-size:13px; font-weight:500; color:rgba(255,255,255,0.5); background:none; border:none; cursor:pointer; text-decoration:none; width:100%; text-align:left; transition:all 0.2s; margin-bottom:2px; }
        .db-sidebar__item:hover { background:rgba(245,158,11,0.06); color:#fff; }
        .db-sidebar__item--active { background:rgba(245,158,11,0.12) !important; color:${GOLD} !important; }
        .db-sidebar__footer { margin-top:auto; padding-top:20px; border-top:1px solid ${BORDER}; display:flex; align-items:center; gap:10px; }

        /* Main */
        .db-main { flex:1; overflow-y:auto; min-width:0; }
        .db-content { padding:32px; max-width:1050px; }

        /* View toggle */
        .db-view-toggle { display:none; gap:8px; padding:16px 20px; border-bottom:1px solid ${BORDER}; background:${CARD}; flex-wrap:wrap; }
        .db-view-chip { padding:8px 16px; border-radius:999px; border:1px solid ${BORDER}; background:none; color:rgba(255,255,255,0.45); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; font-family:'DM Sans',sans-serif; }
        .db-view-chip--active { background:${GOLD}; color:#07111F; border-color:${GOLD}; }

        /* Welcome */
        .db-welcome { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
        .db-welcome__title { font-family:'Syne',sans-serif; font-size:24px; font-weight:800; color:#fff; margin-bottom:4px; }
        .db-welcome__sub { font-size:14px; color:rgba(255,255,255,0.35); }

        /* Stats */
        .db-stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; margin-bottom:20px; }
        .db-stat { background:${CARD}; border:1px solid ${BORDER}; border-radius:14px; padding:18px; display:flex; align-items:center; gap:14px; transition:border-color 0.2s; }
        .db-stat:hover { border-color:rgba(245,158,11,0.3); }
        .db-stat__icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
        .db-stat__value { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; line-height:1; }
        .db-stat__label { font-size:12px; color:rgba(255,255,255,0.35); margin-top:4px; }
        .db-stat__sub   { font-size:11px; margin-top:3px; }

        /* Panel */
        .db-panel { background:${CARD}; border:1px solid ${BORDER}; border-radius:16px; padding:22px; margin-bottom:18px; }
        .db-panel__head { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
        .db-panel__title { font-family:'Syne',sans-serif; font-weight:700; font-size:16px; color:#fff; }

        /* Chart */
        .db-chart { display:flex; align-items:flex-end; gap:8px; height:90px; padding:0 4px; }
        .db-chart__bar-wrap { flex:1; height:100%; display:flex; align-items:flex-end; }
        .db-chart__bar { width:100%; border-radius:6px 6px 0 0; min-height:4px; transition:opacity 0.2s; }
        .db-chart__labels { display:flex; justify-content:space-between; padding:8px 4px 0; font-size:11px; color:rgba(255,255,255,0.25); }

        /* Tabs */
        .db-tabs { display:flex; gap:6px; margin-bottom:16px; border-bottom:1px solid ${BORDER}; padding-bottom:12px; }
        .db-tab { padding:8px 18px; border-radius:8px; border:none; background:none; color:rgba(255,255,255,0.4); font-size:14px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
        .db-tab:hover { color:#fff; }
        .db-tab--active { background:rgba(245,158,11,0.12); color:${GOLD}; }

        /* Table */
        .db-table-wrap { overflow-x:auto; }
        .db-table { width:100%; border-collapse:collapse; font-size:13px; }
        .db-table th { text-align:left; padding:10px 12px; color:rgba(255,255,255,0.25); font-weight:700; font-size:10px; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid ${BORDER}; }
        .db-table td { padding:13px 12px; border-bottom:1px solid rgba(245,158,11,0.05); color:rgba(255,255,255,0.7); vertical-align:middle; }
        .db-table tr:last-child td { border-bottom:none; }
        .db-table tr:hover td { background:rgba(245,158,11,0.02); }
        .db-table__id     { color:rgba(255,255,255,0.25); font-size:12px; }
        .db-table__muted  { color:rgba(255,255,255,0.35); }
        .db-table__amount { color:${GREEN}; font-weight:700; }

        /* Status */
        .db-status { display:inline-flex; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:700; }
        .db-status--open     { background:rgba(225,29,72,0.12);  color:${RED};   border:1px solid rgba(225,29,72,0.25);  }
        .db-status--pending  { background:rgba(245,158,11,0.12); color:${GOLD};  border:1px solid rgba(245,158,11,0.25); }
        .db-status--resolved { background:rgba(34,197,94,0.12);  color:${GREEN}; border:1px solid rgba(34,197,94,0.25);  }
        .db-status--active   { background:rgba(34,197,94,0.12);  color:${GREEN}; border:1px solid rgba(34,197,94,0.25);  }
        .db-status--draft    { background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.35); }

        /* Buttons */
        .db-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:10px 20px; border-radius:10px; background:linear-gradient(135deg,${GOLD2},${GOLD}); color:#07111F; border:none; font-size:14px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
        .db-btn:hover { opacity:0.88; transform:translateY(-1px); }
        .db-btn--sm      { padding:6px 14px; font-size:12px; border-radius:8px; }
        .db-btn--outline { background:transparent; border:1px solid ${BORDER}; color:rgba(255,255,255,0.6); }
        .db-btn--outline:hover { border-color:${GOLD}; color:${GOLD}; }

        /* Avatar */
        .db-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,${GOLD2},${GOLD}); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; color:#07111F; flex-shrink:0; }

        /* Form grid */
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

        /* Modal */
        .db-modal-bg { position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:999; backdrop-filter:blur(6px); animation:dbFade 0.2s ease; }
        .db-modal { background:#0C1A2E; border:1px solid ${BORDER}; border-radius:20px; padding:28px; width:100%; max-width:400px; display:flex; flex-direction:column; gap:12px; }
        .db-modal__title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#fff; }
        .db-modal__sub   { font-size:14px; color:rgba(255,255,255,0.4); }
        .db-label { font-size:12px; font-weight:600; color:rgba(255,255,255,0.4); }
        .db-input { width:100%; padding:11px 14px; border-radius:10px; border:1px solid rgba(245,158,11,0.15); background:rgba(255,255,255,0.04); color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; box-sizing:border-box; transition:border-color 0.2s; }
        .db-input:focus { border-color:${GOLD}; box-shadow:0 0 0 3px rgba(245,158,11,0.08); }
        option { background:#0C1A2E; }

        @keyframes dbFade { from{opacity:0} to{opacity:1} }

        /* Responsive */
        @media(max-width:768px){
          .db-sidebar { display:none; }
          .db-view-toggle { display:flex; }
          .db-content { padding:20px 16px; }
          .db-stats-grid { grid-template-columns:1fr 1fr; }
          .form-grid { grid-template-columns:1fr; }
        }
        @media(max-width:480px){
          .db-stats-grid { grid-template-columns:1fr; }
        }
      `}</style>
        </div>
    );
}