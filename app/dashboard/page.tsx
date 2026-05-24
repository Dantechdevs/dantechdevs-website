"use client";

import { useState } from "react";

/* ── Constants ── */
const RED = "#e8325a";
const DARK = "#0f0f13";
const CARD = "#1a1a22";
const BORDER = "rgba(255,255,255,0.07)";

/* ── Types ── */
type DashView = "admin" | "seller" | "buyer";

/* ══════════════════════════════════════════
   SHARED STAT CARD
══════════════════════════════════════════ */
function StatCard({ icon, label, value, sub, color = RED }: {
    icon: string; label: string; value: string; sub?: string; color?: string;
}) {
    return (
        <div className="db-stat">
            <div className="db-stat__icon" style={{ background: `${color}18`, color }}>{icon}</div>
            <div>
                <div className="db-stat__value">{value}</div>
                <div className="db-stat__label">{label}</div>
                {sub && <div className="db-stat__sub">{sub}</div>}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   MINI BAR CHART
══════════════════════════════════════════ */
function MiniChart({ data, color = RED }: { data: number[]; color?: string }) {
    const max = Math.max(...data);
    return (
        <div className="db-chart">
            {data.map((v, i) => (
                <div key={i} className="db-chart__bar-wrap">
                    <div
                        className="db-chart__bar"
                        style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.7 + (i / data.length) * 0.3 }}
                    />
                </div>
            ))}
        </div>
    );
}

/* ══════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════ */
const adminOrders = [
    { id: "#DN-001", customer: "Alice Wanjiku", product: "Brand Identity Kit", amount: "KES 4,800", status: "Completed", date: "23 May" },
    { id: "#DN-002", customer: "Brian Otieno", product: "UI Component Kit", amount: "KES 1,500", status: "Pending", date: "23 May" },
    { id: "#DN-003", customer: "Carol Njeri", product: "Startup Pitch Deck", amount: "KES 4,900", status: "Completed", date: "22 May" },
    { id: "#DN-004", customer: "David Kamau", product: "Dare to Lead", amount: "KES 2,300", status: "Refunded", date: "22 May" },
    { id: "#DN-005", customer: "Esther Moraa", product: "Geo Shapes Bundle", amount: "KES 1,900", status: "Completed", date: "21 May" },
];
const adminUsers = [
    { name: "Alice Wanjiku", role: "Buyer", joined: "Jan 2025", orders: 12, spent: "KES 48,200" },
    { name: "John Mwangi", role: "Seller", joined: "Mar 2025", orders: 34, spent: "KES 142,000" },
    { name: "Sarah Achieng", role: "Seller", joined: "Feb 2025", orders: 21, spent: "KES 89,500" },
];

function AdminDash() {
    const [tab, setTab] = useState<"orders" | "users" | "products">("orders");
    return (
        <div className="db-content">
            <div className="db-welcome">
                <div>
                    <h2 className="db-welcome__title">Admin Overview 👑</h2>
                    <p className="db-welcome__sub">Full platform control — Dantechdevs Marketplace</p>
                </div>
                <button className="db-btn">+ Add Product</button>
            </div>

            {/* Stats */}
            <div className="db-stats-grid">
                <StatCard icon="💰" label="Total Revenue" value="KES 284,500" sub="+18% this month" color="#22c55e" />
                <StatCard icon="📦" label="Total Orders" value="1,284" sub="47 this week" color="#3b82f6" />
                <StatCard icon="🛍️" label="Products" value="342" sub="12 pending review" />
                <StatCard icon="👥" label="Total Users" value="2,841" sub="+124 this week" color="#f59e0b" />
            </div>

            {/* Chart */}
            <div className="db-panel">
                <div className="db-panel__head">
                    <span className="db-panel__title">Revenue — Last 7 Days</span>
                    <span className="db-panel__badge" style={{ color: "#22c55e" }}>↑ 18%</span>
                </div>
                <MiniChart data={[42, 58, 35, 71, 63, 89, 95]} color="#22c55e" />
                <div className="db-chart__labels">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
                </div>
            </div>

            {/* Tabs */}
            <div className="db-tabs">
                {(["orders", "users", "products"] as const).map(t => (
                    <button key={t} className={`db-tab${tab === t ? " db-tab--active" : ""}`} onClick={() => setTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {tab === "orders" && (
                <div className="db-panel">
                    <div className="db-panel__head"><span className="db-panel__title">Recent Orders</span></div>
                    <div className="db-table-wrap">
                        <table className="db-table">
                            <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                            <tbody>
                                {adminOrders.map(o => (
                                    <tr key={o.id}>
                                        <td className="db-table__id">{o.id}</td>
                                        <td>{o.customer}</td>
                                        <td className="db-table__muted">{o.product}</td>
                                        <td className="db-table__amount">{o.amount}</td>
                                        <td><span className={`db-status db-status--${o.status.toLowerCase()}`}>{o.status}</span></td>
                                        <td className="db-table__muted">{o.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === "users" && (
                <div className="db-panel">
                    <div className="db-panel__head"><span className="db-panel__title">Registered Users</span></div>
                    <div className="db-table-wrap">
                        <table className="db-table">
                            <thead><tr><th>Name</th><th>Role</th><th>Joined</th><th>Orders</th><th>Total Spent</th><th>Action</th></tr></thead>
                            <tbody>
                                {adminUsers.map(u => (
                                    <tr key={u.name}>
                                        <td>{u.name}</td>
                                        <td><span className={`db-role db-role--${u.role.toLowerCase()}`}>{u.role}</span></td>
                                        <td className="db-table__muted">{u.joined}</td>
                                        <td>{u.orders}</td>
                                        <td className="db-table__amount">{u.spent}</td>
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
                    <div className="db-panel__head"><span className="db-panel__title">Product Management</span></div>
                    <div className="db-empty">
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                        <p>Connect to your product database to manage listings.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   SELLER DASHBOARD
══════════════════════════════════════════ */
const sellerProducts = [
    { name: "Brand Identity Kit", category: "Graphic", price: "KES 4,800", sales: 34, status: "Active" },
    { name: "UI Component Kit", category: "Code", price: "KES 1,500", sales: 21, status: "Active" },
    { name: "Startup Pitch Deck", category: "Code", price: "KES 4,900", sales: 18, status: "Draft" },
    { name: "Geo Shapes Bundle", category: "Graphic", price: "KES 1,900", sales: 41, status: "Active" },
];

function SellerDash() {
    const [withdraw, setWithdraw] = useState(false);
    return (
        <div className="db-content">
            <div className="db-welcome">
                <div>
                    <h2 className="db-welcome__title">My Store 🛍️</h2>
                    <p className="db-welcome__sub">Manage your products & earnings</p>
                </div>
                <button className="db-btn">+ New Product</button>
            </div>

            <div className="db-stats-grid">
                <StatCard icon="💵" label="Total Earnings" value="KES 142,000" sub="This month: KES 28,400" color="#22c55e" />
                <StatCard icon="📈" label="Total Sales" value="114" sub="+8 this week" color="#3b82f6" />
                <StatCard icon="📦" label="My Products" value="4" sub="3 active, 1 draft" />
                <StatCard icon="⭐" label="Avg Rating" value="4.7 / 5" sub="Based on 89 reviews" color="#f59e0b" />
            </div>

            {/* Earnings chart */}
            <div className="db-panel">
                <div className="db-panel__head">
                    <span className="db-panel__title">Sales — Last 7 Days</span>
                    <button className="db-btn db-btn--sm db-btn--green" onClick={() => setWithdraw(true)}>
                        💸 Withdraw via M-Pesa
                    </button>
                </div>
                <MiniChart data={[8, 14, 6, 19, 11, 22, 34]} color="#22c55e" />
                <div className="db-chart__labels">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
                </div>
            </div>

            {/* Withdraw modal */}
            {withdraw && (
                <div className="db-modal-bg" onClick={() => setWithdraw(false)}>
                    <div className="db-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="db-modal__title">Withdraw via M-Pesa 💸</h3>
                        <p className="db-modal__sub">Available balance: <strong style={{ color: "#22c55e" }}>KES 28,400</strong></p>
                        <label className="db-label">M-Pesa Number</label>
                        <input className="db-input" placeholder="+254 7XX XXX XXX" type="tel" />
                        <label className="db-label">Amount (KES)</label>
                        <input className="db-input" placeholder="e.g. 5000" type="number" />
                        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                            <button className="db-btn db-btn--green" style={{ flex: 1 }}>Confirm Withdrawal</button>
                            <button className="db-btn db-btn--outline" onClick={() => setWithdraw(false)} style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Products */}
            <div className="db-panel">
                <div className="db-panel__head"><span className="db-panel__title">My Products</span></div>
                <div className="db-table-wrap">
                    <table className="db-table">
                        <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Sales</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {sellerProducts.map(p => (
                                <tr key={p.name}>
                                    <td>{p.name}</td>
                                    <td className="db-table__muted">{p.category}</td>
                                    <td className="db-table__amount">{p.price}</td>
                                    <td>{p.sales}</td>
                                    <td><span className={`db-status db-status--${p.status.toLowerCase()}`}>{p.status}</span></td>
                                    <td style={{ display: "flex", gap: 6 }}>
                                        <button className="db-btn db-btn--sm">Edit</button>
                                        <button className="db-btn db-btn--sm db-btn--danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   BUYER DASHBOARD
══════════════════════════════════════════ */
const buyerOrders = [
    { id: "#DN-041", product: "The Silent Patient", category: "PDF Book", amount: "KES 750", status: "Completed", date: "23 May", download: true },
    { id: "#DN-038", product: "Evening Landscape", category: "Photos", amount: "KES 0", status: "Completed", date: "20 May", download: true },
    { id: "#DN-031", product: "Dare to Lead", category: "PDF Book", amount: "KES 2,300", status: "Completed", date: "15 May", download: true },
    { id: "#DN-029", product: "Startup Pitch Deck", category: "Code", amount: "KES 4,900", status: "Pending", date: "14 May", download: false },
];
const wishlist = [
    { name: "UI Component Kit", price: "KES 1,500", category: "Code" },
    { name: "Geo Shapes Bundle", price: "KES 1,900", category: "Graphic" },
];

function BuyerDash() {
    const [tab, setTab] = useState<"orders" | "downloads" | "wishlist">("orders");
    return (
        <div className="db-content">
            <div className="db-welcome">
                <div>
                    <h2 className="db-welcome__title">My Account 👤</h2>
                    <p className="db-welcome__sub">Track orders, downloads & wishlist</p>
                </div>
                <div className="db-avatar">DK</div>
            </div>

            <div className="db-stats-grid">
                <StatCard icon="🛒" label="Total Orders" value="4" sub="3 completed" color="#3b82f6" />
                <StatCard icon="⬇️" label="Downloads" value="3" sub="Ready to download" color="#22c55e" />
                <StatCard icon="❤️" label="Wishlist" value="2" sub="Items saved" />
                <StatCard icon="💰" label="Total Spent" value="KES 8,750" sub="All time" color="#f59e0b" />
            </div>

            {/* Profile card */}
            <div className="db-panel db-profile">
                <div className="db-avatar db-avatar--lg">DK</div>
                <div>
                    <div className="db-profile__name">Daniel Kamau</div>
                    <div className="db-profile__info">dantechdevs@gmail.com · +254 712 328 150</div>
                    <div className="db-profile__info" style={{ marginTop: 4 }}>Member since January 2025 · Nairobi, Kenya</div>
                </div>
                <button className="db-btn db-btn--sm db-btn--outline" style={{ marginLeft: "auto" }}>Edit Profile</button>
            </div>

            <div className="db-tabs">
                {(["orders", "downloads", "wishlist"] as const).map(t => (
                    <button key={t} className={`db-tab${tab === t ? " db-tab--active" : ""}`} onClick={() => setTab(t)}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {tab === "orders" && (
                <div className="db-panel">
                    <div className="db-panel__head"><span className="db-panel__title">Order History</span></div>
                    <div className="db-table-wrap">
                        <table className="db-table">
                            <thead><tr><th>ID</th><th>Product</th><th>Category</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                            <tbody>
                                {buyerOrders.map(o => (
                                    <tr key={o.id}>
                                        <td className="db-table__id">{o.id}</td>
                                        <td>{o.product}</td>
                                        <td className="db-table__muted">{o.category}</td>
                                        <td className="db-table__amount">{o.amount}</td>
                                        <td><span className={`db-status db-status--${o.status.toLowerCase()}`}>{o.status}</span></td>
                                        <td className="db-table__muted">{o.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === "downloads" && (
                <div className="db-panel">
                    <div className="db-panel__head"><span className="db-panel__title">My Downloads</span></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {buyerOrders.filter(o => o.download).map(o => (
                            <div key={o.id} className="db-download-row">
                                <div className="db-download-row__icon">📄</div>
                                <div style={{ flex: 1 }}>
                                    <div className="db-download-row__name">{o.product}</div>
                                    <div className="db-download-row__meta">{o.category} · Purchased {o.date}</div>
                                </div>
                                <button className="db-btn db-btn--sm db-btn--green">⬇ Download</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === "wishlist" && (
                <div className="db-panel">
                    <div className="db-panel__head"><span className="db-panel__title">My Wishlist</span></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {wishlist.map(w => (
                            <div key={w.name} className="db-download-row">
                                <div className="db-download-row__icon">❤️</div>
                                <div style={{ flex: 1 }}>
                                    <div className="db-download-row__name">{w.name}</div>
                                    <div className="db-download-row__meta">{w.category}</div>
                                </div>
                                <div className="db-table__amount" style={{ marginRight: 12 }}>{w.price}</div>
                                <button className="db-btn db-btn--sm">Add to Cart</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD PAGE
══════════════════════════════════════════ */
export default function DashboardPage() {
    const [view, setView] = useState<DashView>("admin");

    const VIEWS: { key: DashView; icon: string; label: string }[] = [
        { key: "admin", icon: "👑", label: "Admin" },
        { key: "seller", icon: "🛍️", label: "Seller" },
        { key: "buyer", icon: "👤", label: "Buyer" },
    ];

    return (
        <div className="db-root">

            {/* ── Sidebar ── */}
            <aside className="db-sidebar">
                <div className="db-sidebar__brand">
                    <span className="db-sidebar__brand-name">Dantechdevs</span>
                    <span className="db-sidebar__brand-tag">Dashboard</span>
                </div>

                <nav className="db-sidebar__nav">
                    <div className="db-sidebar__section">Switch View</div>
                    {VIEWS.map(v => (
                        <button
                            key={v.key}
                            className={`db-sidebar__item${view === v.key ? " db-sidebar__item--active" : ""}`}
                            onClick={() => setView(v.key)}
                        >
                            <span>{v.icon}</span>
                            <span>{v.label}</span>
                        </button>
                    ))}

                    <div className="db-sidebar__section" style={{ marginTop: 24 }}>Navigation</div>
                    {[
                        { icon: "🏠", label: "Home", href: "/" },
                        { icon: "📦", label: "Products", href: "/products" },
                        { icon: "📞", label: "Contact", href: "/contact" },
                        { icon: "⚙️", label: "Settings", href: "#" },
                    ].map(item => (
                        <a key={item.label} href={item.href} className="db-sidebar__item">
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>

                <div className="db-sidebar__footer">
                    <div className="db-avatar">DK</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Daniel Kamau</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Admin</div>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="db-main">
                {/* View toggle chips on mobile */}
                <div className="db-view-toggle">
                    {VIEWS.map(v => (
                        <button
                            key={v.key}
                            className={`db-view-chip${view === v.key ? " db-view-chip--active" : ""}`}
                            onClick={() => setView(v.key)}
                        >
                            {v.icon} {v.label}
                        </button>
                    ))}
                </div>

                {view === "admin" && <AdminDash />}
                {view === "seller" && <SellerDash />}
                {view === "buyer" && <BuyerDash />}
            </main>

            {/* ══════════════════════════════════
          STYLES
      ══════════════════════════════════ */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Root layout ── */
        .db-root {
          display: flex; min-height: 100vh;
          background: ${DARK}; color: #e8e8f0;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Sidebar ── */
        .db-sidebar {
          width: 220px; flex-shrink: 0;
          background: ${CARD};
          border-right: 1px solid ${BORDER};
          display: flex; flex-direction: column;
          padding: 24px 16px;
          position: sticky; top: 0; height: 100vh;
          overflow-y: auto;
        }
        .db-sidebar__brand { margin-bottom: 32px; padding: 0 8px; }
        .db-sidebar__brand-name {
          display: block; font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 18px; color: ${RED};
        }
        .db-sidebar__brand-tag {
          display: block; font-size: 10px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-top: 2px;
        }
        .db-sidebar__section {
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
          padding: 0 8px; margin-bottom: 6px;
        }
        .db-sidebar__item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.55);
          background: none; border: none; cursor: pointer;
          text-decoration: none; width: 100%; text-align: left;
          transition: all 0.2s; margin-bottom: 2px;
        }
        .db-sidebar__item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .db-sidebar__item--active {
          background: rgba(232,50,90,0.15) !important;
          color: ${RED} !important;
        }
        .db-sidebar__footer {
          margin-top: auto; padding-top: 20px;
          border-top: 1px solid ${BORDER};
          display: flex; align-items: center; gap: 10px;
        }

        /* ── Main area ── */
        .db-main { flex: 1; overflow-y: auto; min-width: 0; }
        .db-content { padding: 32px; max-width: 1000px; }

        /* ── View toggle (mobile) ── */
        .db-view-toggle {
          display: none; gap: 8px; padding: 16px 20px;
          border-bottom: 1px solid ${BORDER};
          background: ${CARD};
        }
        .db-view-chip {
          padding: 8px 16px; border-radius: 999px;
          border: 1px solid ${BORDER}; background: none;
          color: rgba(255,255,255,0.5); font-size: 13px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .db-view-chip--active { background: ${RED}; color: #fff; border-color: ${RED}; }

        /* ── Welcome bar ── */
        .db-welcome {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 28px;
          flex-wrap: wrap; gap: 12px;
        }
        .db-welcome__title {
          font-family: 'Syne', sans-serif;
          font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 4px;
        }
        .db-welcome__sub { font-size: 14px; color: rgba(255,255,255,0.4); }

        /* ── Stat cards ── */
        .db-stats-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px; margin-bottom: 24px;
        }
        .db-stat {
          background: ${CARD}; border: 1px solid ${BORDER};
          border-radius: 16px; padding: 20px;
          display: flex; align-items: center; gap: 16px;
          transition: border-color 0.2s;
        }
        .db-stat:hover { border-color: rgba(232,50,90,0.3); }
        .db-stat__icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .db-stat__value {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800; color: #fff; line-height: 1;
        }
        .db-stat__label { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; }
        .db-stat__sub   { font-size: 11px; color: #22c55e; margin-top: 3px; }

        /* ── Panel ── */
        .db-panel {
          background: ${CARD}; border: 1px solid ${BORDER};
          border-radius: 16px; padding: 20px; margin-bottom: 20px;
        }
        .db-panel__head {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 20px;
        }
        .db-panel__title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #fff; }
        .db-panel__badge { font-size: 13px; font-weight: 700; }

        /* ── Mini chart ── */
        .db-chart {
          display: flex; align-items: flex-end; gap: 6px;
          height: 80px; padding: 0 4px;
        }
        .db-chart__bar-wrap { flex: 1; height: 100%; display: flex; align-items: flex-end; }
        .db-chart__bar { width: 100%; border-radius: 4px 4px 0 0; transition: opacity 0.2s; min-height: 4px; }
        .db-chart__labels {
          display: flex; justify-content: space-between;
          padding: 6px 4px 0; font-size: 11px; color: rgba(255,255,255,0.3);
        }

        /* ── Tabs ── */
        .db-tabs {
          display: flex; gap: 6px; margin-bottom: 16px;
          border-bottom: 1px solid ${BORDER}; padding-bottom: 12px;
        }
        .db-tab {
          padding: 8px 18px; border-radius: 8px; border: none;
          background: none; color: rgba(255,255,255,0.4);
          font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .db-tab:hover { color: #fff; }
        .db-tab--active { background: rgba(232,50,90,0.15); color: ${RED}; }

        /* ── Table ── */
        .db-table-wrap { overflow-x: auto; }
        .db-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .db-table th {
          text-align: left; padding: 10px 12px;
          color: rgba(255,255,255,0.3); font-weight: 600;
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 1px solid ${BORDER};
        }
        .db-table td {
          padding: 12px 12px; border-bottom: 1px solid rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.75); vertical-align: middle;
        }
        .db-table tr:last-child td { border-bottom: none; }
        .db-table tr:hover td { background: rgba(255,255,255,0.02); }
        .db-table__id     { color: rgba(255,255,255,0.35); font-size: 12px; }
        .db-table__muted  { color: rgba(255,255,255,0.35); }
        .db-table__amount { color: #22c55e; font-weight: 600; }

        /* ── Status badges ── */
        .db-status {
          display: inline-flex; padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 700; text-transform: capitalize;
        }
        .db-status--completed { background: rgba(34,197,94,0.15);  color: #22c55e; }
        .db-status--pending   { background: rgba(245,158,11,0.15); color: #f59e0b; }
        .db-status--refunded  { background: rgba(232,50,90,0.15);  color: ${RED};  }
        .db-status--active    { background: rgba(34,197,94,0.15);  color: #22c55e; }
        .db-status--draft     { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); }

        /* ── Role badges ── */
        .db-role { display: inline-flex; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
        .db-role--admin  { background: rgba(232,50,90,0.15); color: ${RED}; }
        .db-role--seller { background: rgba(59,130,246,0.15); color: #3b82f6; }
        .db-role--buyer  { background: rgba(245,158,11,0.15); color: #f59e0b; }

        /* ── Buttons ── */
        .db-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 20px; border-radius: 10px;
          background: ${RED}; color: #fff; border: none;
          font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
        }
        .db-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .db-btn--sm      { padding: 6px 14px; font-size: 12px; border-radius: 8px; }
        .db-btn--green   { background: #22c55e; }
        .db-btn--danger  { background: rgba(232,50,90,0.15); color: ${RED}; }
        .db-btn--outline { background: transparent; border: 1px solid ${BORDER}; color: rgba(255,255,255,0.6); }

        /* ── Avatar ── */
        .db-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, ${RED}, #ff6b8a);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 13px; color: #fff; flex-shrink: 0;
        }
        .db-avatar--lg { width: 52px; height: 52px; font-size: 18px; }

        /* ── Profile card ── */
        .db-profile { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .db-profile__name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 17px; color: #fff; }
        .db-profile__info { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 2px; }

        /* ── Download row ── */
        .db-download-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px; border-radius: 12px;
          border: 1px solid ${BORDER}; background: rgba(255,255,255,0.02);
          transition: border-color 0.2s;
        }
        .db-download-row:hover { border-color: rgba(232,50,90,0.3); }
        .db-download-row__icon { font-size: 28px; }
        .db-download-row__name { font-weight: 600; font-size: 14px; color: #fff; }
        .db-download-row__meta { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }

        /* ── Modal ── */
        .db-modal-bg {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 999; backdrop-filter: blur(4px);
          animation: dbFadeIn 0.2s ease;
        }
        .db-modal {
          background: #1e1e28; border: 1px solid ${BORDER};
          border-radius: 20px; padding: 28px; width: 100%; max-width: 380px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .db-modal__title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; }
        .db-modal__sub   { font-size: 14px; color: rgba(255,255,255,0.5); }
        .db-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); }
        .db-input {
          width: 100%; padding: 12px 16px; border-radius: 10px;
          border: 1px solid ${BORDER}; background: rgba(255,255,255,0.05);
          color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; box-sizing: border-box; transition: border-color 0.2s;
        }
        .db-input:focus { border-color: ${RED}; }

        /* ── Empty state ── */
        .db-empty {
          text-align: center; padding: 48px 24px;
          color: rgba(255,255,255,0.3); font-size: 14px;
        }

        /* ── Animations ── */
        @keyframes dbFadeIn { from { opacity:0; } to { opacity:1; } }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .db-sidebar { display: none; }
          .db-view-toggle { display: flex; }
          .db-content { padding: 20px 16px; }
          .db-stats-grid { grid-template-columns: 1fr 1fr; }
          .db-welcome { flex-direction: column; align-items: flex-start; }
          .db-profile { flex-wrap: wrap; }
        }
        @media (max-width: 480px) {
          .db-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}