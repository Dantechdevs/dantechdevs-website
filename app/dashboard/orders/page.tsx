"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const A = {
    blue: "#2563EB", blueLt: "#3B82F6", cyan: "#0891B2",
    emerald: "#10B981", rose: "#F43F5E", amber: "#F59E0B",
    violet: "#7C3AED",
};

interface Order {
    id: string;
    product_id: string;
    amount: number;
    status: string;
    payment_method: string | null;
    mpesa_ref: string | null;
    created_at: string;
    product?: { name: string; category: string };
}

const STATUS_COLOR: Record<string, string> = {
    pending: A.amber,
    completed: A.emerald,
    paid: A.emerald,
    failed: A.rose,
    cancelled: A.rose,
    processing: A.blue,
};

function Badge({ label, color }: { label: string; color: string }) {
    return (
        <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
            background: `${color}15`, color, border: `1px solid ${color}25`,
            textTransform: "capitalize",
        }}>{label}</span>
    );
}

function StatCard({ icon, label, value, sub, color }: {
    icon: string; label: string; value: string | number; sub?: string; color: string;
}) {
    return (
        <div style={{
            background: "var(--panel)", border: `1px solid ${color}18`,
            borderRadius: 16, padding: "18px 20px",
            boxShadow: "var(--shadow-sm)",
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 26, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>{value}</div>
            {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>}
        </div>
    );
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) { router.push("/auth/login"); return; }
            setUserId(data.user.id);
        });
    }, [router]);

    useEffect(() => {
        if (!userId) return;
        const fetchOrders = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("orders")
                .select(`*, product:products(name, category)`)
                .eq("buyer_id", userId)
                .order("created_at", { ascending: false });
            if (!error && data) setOrders(data as Order[]);
            setLoading(false);
        };
        fetchOrders();

        const sub = supabase
            .channel("orders-page")
            .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `buyer_id=eq.${userId}` }, fetchOrders)
            .subscribe();
        return () => { supabase.removeChannel(sub); };
    }, [userId]);

    const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
    const totalSpent = orders.filter(o => ["completed", "paid"].includes(o.status)).reduce((s, o) => s + o.amount, 0);
    const pending = orders.filter(o => o.status === "pending").length;
    const completed = orders.filter(o => ["completed", "paid"].includes(o.status)).length;

    return (
        <div className="op-root">
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <button onClick={() => router.back()} style={{ fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            ← Back to Dashboard
                        </button>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: 0 }}>
                            My Orders
                        </h1>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
                            Track and manage all your purchases
                        </p>
                    </div>
                </div>

                {/* Stat cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <StatCard icon="🛒" label="Total Orders" value={orders.length} sub="All time" color={A.blue} />
                    <StatCard icon="⏳" label="Pending" value={pending} sub="Awaiting payment" color={A.amber} />
                    <StatCard icon="✅" label="Completed" value={completed} sub="Successfully paid" color={A.emerald} />
                    <StatCard icon="💰" label="Total Spent" value={`KES ${totalSpent.toLocaleString()}`} sub="Completed orders" color={A.cyan} />
                </div>

                {/* Filter tabs */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["all", "pending", "completed", "paid", "failed", "cancelled"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
                            fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all 0.2s",
                            border: `1px solid ${filter === f ? A.blue : "var(--border)"}`,
                            background: filter === f ? `${A.blue}12` : "transparent",
                            color: filter === f ? A.blue : "var(--text-muted)",
                            textTransform: "capitalize",
                        }}>{f === "all" ? `All (${orders.length})` : f}</button>
                    ))}
                </div>

                {/* Table */}
                <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                            Orders {filter !== "all" && `· ${filter}`} ({filtered.length})
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                            <div style={{ fontSize: 32, marginBottom: 12, animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
                            <div>Loading orders…</div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: "60px 20px", textAlign: "center" }}>
                            <div style={{ fontSize: 48, marginBottom: 14 }}>🛒</div>
                            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 6 }}>
                                {filter === "all" ? "No orders yet" : `No ${filter} orders`}
                            </div>
                            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                                {filter === "all" ? "Browse our products and make your first purchase." : `You have no orders with status "${filter}".`}
                            </div>
                            <button onClick={() => router.push("/products")} style={{
                                padding: "10px 22px", borderRadius: 10, background: `linear-gradient(135deg, ${A.blue}, ${A.cyan})`,
                                color: "#fff", border: "none", fontWeight: 700, fontSize: 14,
                                fontFamily: "'Plus Jakarta Sans',sans-serif", cursor: "pointer",
                            }}>Browse Products →</button>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: "var(--bg-muted)" }}>
                                        {["Order ID", "Product", "Amount", "Method", "Ref", "Status", "Date"].map(h => (
                                            <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((order, i) => {
                                        const statusColor = STATUS_COLOR[order.status] ?? A.blue;
                                        return (
                                            <tr key={order.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                                                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--row-hover)"}
                                                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                                                <td style={{ padding: "13px 16px", color: "var(--text-dim)", fontSize: 11, fontFamily: "monospace" }}>
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </td>
                                                <td style={{ padding: "13px 16px" }}>
                                                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                                                        {order.product?.name ?? "Unknown Product"}
                                                    </div>
                                                    {order.product?.category && (
                                                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{order.product.category}</div>
                                                    )}
                                                </td>
                                                <td style={{ padding: "13px 16px", fontWeight: 700, color: A.emerald, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                                                    KES {order.amount.toLocaleString()}
                                                </td>
                                                <td style={{ padding: "13px 16px", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                                                    {order.payment_method ?? "—"}
                                                </td>
                                                <td style={{ padding: "13px 16px", color: "var(--text-dim)", fontSize: 11, fontFamily: "monospace" }}>
                                                    {order.mpesa_ref ?? "—"}
                                                </td>
                                                <td style={{ padding: "13px 16px" }}>
                                                    <Badge label={order.status} color={statusColor} />
                                                </td>
                                                <td style={{ padding: "13px 16px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                                                    {new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .op-root {
          --panel:#FFFFFF; --border:#E2E8F0; --border-hi:#CBD5E1;
          --text-primary:#0F172A; --text-secondary:#334155; --text-muted:#64748B; --text-dim:#94A3B8;
          --bg-muted:#F1F5F9; --row-hover:#F8FAFC;
          --shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
          min-height: 100vh;
          background: var(--bg, #F8FAFC);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}