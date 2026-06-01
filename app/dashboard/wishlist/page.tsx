"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const A = {
    blue: "#2563EB", blueLt: "#3B82F6", cyan: "#0891B2",
    emerald: "#10B981", rose: "#F43F5E", amber: "#F59E0B",
    violet: "#7C3AED",
};

interface WishlistItem {
    id: string;
    product_id: string;
    created_at: string;
    product?: {
        name: string;
        category: string;
        monthly_price: number | null;
        one_time_price: number | null;
        image_url: string | null;
    };
}

function StatCard({ icon, label, value, sub, color }: {
    icon: string; label: string; value: string | number; sub?: string; color: string;
}) {
    return (
        <div style={{
            background: "var(--panel)", border: `1px solid ${color}18`,
            borderRadius: 16, padding: "18px 20px", boxShadow: "var(--shadow-sm)",
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

export default function WishlistPage() {
    const router = useRouter();
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) { router.push("/auth/login"); return; }
            setUserId(data.user.id);
        });
    }, [router]);

    useEffect(() => {
        if (!userId) return;
        const fetchWishlist = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("wishlist")
                .select(`*, product:products(name, category, monthly_price, one_time_price, image_url)`)
                .eq("buyer_id", userId)
                .order("created_at", { ascending: false });
            if (!error && data) setItems(data as WishlistItem[]);
            setLoading(false);
        };
        fetchWishlist();

        const sub = supabase
            .channel("wishlist-page")
            .on("postgres_changes", { event: "*", schema: "public", table: "wishlist", filter: `buyer_id=eq.${userId}` }, fetchWishlist)
            .subscribe();
        return () => { supabase.removeChannel(sub); };
    }, [userId]);

    const removeItem = async (id: string) => {
        setRemoving(id);
        await supabase.from("wishlist").delete().eq("id", id);
        setItems(prev => prev.filter(i => i.id !== id));
        setRemoving(null);
    };

    const totalValue = items.reduce((sum, item) => {
        const price = item.product?.monthly_price ?? item.product?.one_time_price ?? 0;
        return sum + price;
    }, 0);

    return (
        <div className="wp-root">
            <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <button onClick={() => router.back()} style={{ fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            ← Back to Dashboard
                        </button>
                        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--text-primary)", letterSpacing: "-0.5px", margin: 0 }}>
                            My Wishlist
                        </h1>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0" }}>
                            Products you've saved for later
                        </p>
                    </div>
                    {items.length > 0 && (
                        <button onClick={() => router.push("/products")} style={{
                            padding: "10px 20px", borderRadius: 10,
                            background: `linear-gradient(135deg, ${A.rose}, #c41e45)`,
                            color: "#fff", border: "none", fontWeight: 700, fontSize: 14,
                            fontFamily: "'Plus Jakarta Sans',sans-serif", cursor: "pointer",
                            boxShadow: `0 4px 16px ${A.rose}30`,
                        }}>
                            + Browse More
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <StatCard icon="❤️" label="Saved Items" value={items.length} sub="In your wishlist" color={A.rose} />
                    <StatCard icon="💰" label="Total Value" value={`KES ${totalValue.toLocaleString()}`} sub="Combined price" color={A.emerald} />
                    <StatCard icon="📦" label="Categories" value={new Set(items.map(i => i.product?.category).filter(Boolean)).size} sub="Unique categories" color={A.blue} />
                </div>

                {/* Items */}
                {loading ? (
                    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 16, padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                        <div style={{ fontSize: 32, marginBottom: 12, animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</div>
                        <div>Loading wishlist…</div>
                    </div>
                ) : items.length === 0 ? (
                    <div style={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 16, padding: "60px 20px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ fontSize: 52, marginBottom: 14 }}>🤍</div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 6 }}>
                            Your wishlist is empty
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                            Save products you love by clicking the heart icon.
                        </div>
                        <button onClick={() => router.push("/products")} style={{
                            padding: "10px 22px", borderRadius: 10,
                            background: `linear-gradient(135deg, ${A.rose}, #c41e45)`,
                            color: "#fff", border: "none", fontWeight: 700, fontSize: 14,
                            fontFamily: "'Plus Jakarta Sans',sans-serif", cursor: "pointer",
                        }}>Browse Products →</button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                        {items.map((item) => {
                            const p = item.product;
                            const price = p?.monthly_price ?? p?.one_time_price;
                            const priceLabel = p?.monthly_price ? "/mo" : p?.one_time_price ? " one-time" : "";
                            return (
                                <div key={item.id} style={{
                                    background: "var(--panel)", border: "1px solid var(--border)",
                                    borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)",
                                    transition: "all 0.22s",
                                }}
                                    onMouseEnter={e => { const t = e.currentTarget as HTMLDivElement; t.style.transform = "translateY(-2px)"; t.style.boxShadow = "var(--shadow-md)"; t.style.borderColor = `${A.rose}30`; }}
                                    onMouseLeave={e => { const t = e.currentTarget as HTMLDivElement; t.style.transform = "none"; t.style.boxShadow = "var(--shadow-sm)"; t.style.borderColor = "var(--border)"; }}>

                                    {/* Product image / placeholder */}
                                    <div style={{
                                        height: 140, background: p?.image_url ? `url(${p.image_url}) center/cover` : `linear-gradient(135deg, ${A.rose}15, ${A.violet}15)`,
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48,
                                        position: "relative",
                                    }}>
                                        {!p?.image_url && "📦"}
                                        {/* Remove button */}
                                        <button onClick={() => removeItem(item.id)} disabled={removing === item.id}
                                            title="Remove from wishlist"
                                            style={{
                                                position: "absolute", top: 10, right: 10,
                                                width: 30, height: 30, borderRadius: 8,
                                                background: "rgba(255,255,255,0.9)", border: "none",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                cursor: "pointer", fontSize: 14, transition: "all 0.15s",
                                                opacity: removing === item.id ? 0.5 : 1,
                                            }}>
                                            {removing === item.id ? "⏳" : "✕"}
                                        </button>
                                    </div>

                                    <div style={{ padding: "16px" }}>
                                        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>
                                            {p?.name ?? "Unknown Product"}
                                        </div>
                                        {p?.category && (
                                            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>{p.category}</div>
                                        )}

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                            {price ? (
                                                <div>
                                                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 18, color: A.emerald }}>
                                                        KES {price.toLocaleString()}
                                                    </span>
                                                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{priceLabel}</span>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Price on request</span>
                                            )}
                                            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
                                                {new Date(item.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button onClick={() => router.push(`/products/${item.product_id}`)}
                                                style={{
                                                    flex: 1, padding: "9px 14px", borderRadius: 10,
                                                    background: `linear-gradient(135deg, ${A.blue}, ${A.cyan})`,
                                                    color: "#fff", border: "none", fontWeight: 700, fontSize: 13,
                                                    fontFamily: "'Plus Jakarta Sans',sans-serif", cursor: "pointer",
                                                    transition: "opacity 0.15s",
                                                }}
                                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"}
                                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}>
                                                View Product
                                            </button>
                                            <button onClick={() => removeItem(item.id)} disabled={removing === item.id}
                                                style={{
                                                    padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                                                    border: `1px solid ${A.rose}30`, background: `${A.rose}08`,
                                                    color: A.rose, fontWeight: 700, fontSize: 13,
                                                    fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all 0.15s",
                                                    opacity: removing === item.id ? 0.5 : 1,
                                                }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${A.rose}15`; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${A.rose}08`; }}>
                                                ❤️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .wp-root {
          --panel:#FFFFFF; --border:#E2E8F0; --border-hi:#CBD5E1;
          --text-primary:#0F172A; --text-secondary:#334155; --text-muted:#64748B; --text-dim:#94A3B8;
          --bg-muted:#F1F5F9; --row-hover:#F8FAFC;
          --shadow-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
          --shadow-md:0 4px 12px rgba(0,0,0,0.08),0 2px 4px rgba(0,0,0,0.04);
          min-height: 100vh;
          background: var(--bg, #F8FAFC);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}