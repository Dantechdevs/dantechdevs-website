"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

/* ─── TYPES ─── */
type Badge = "new" | "hot" | "free" | null;
type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

interface Product {
    id: number;
    title: string;
    cat: Category;
    price: number;
    rating: number;
    sales: number;
    badge: Badge;
    description: string;
}

type Category =
    | "All"
    | "PDF Books"
    | "Software"
    | "WordPress Items"
    | "Fonts"
    | "Photos"
    | "Graphic"
    | "Audios"
    | "Code"
    | "Videos";

/* ─── PALETTE ─── */
const CAT_META: Record<
    Exclude<Category, "All">,
    { emoji: string; color: string; bg: string; lightText: string }
> = {
    "PDF Books": { emoji: "📗", color: "#2563EB", bg: "#EFF6FF", lightText: "#1D4ED8" },
    Software: { emoji: "💻", color: "#7C3AED", bg: "#EDE9FE", lightText: "#6D28D9" },
    "WordPress Items": { emoji: "🌐", color: "#059669", bg: "#D1FAE5", lightText: "#047857" },
    Fonts: { emoji: "🔤", color: "#D97706", bg: "#FEF3C7", lightText: "#B45309" },
    Photos: { emoji: "📷", color: "#DC2626", bg: "#FEE2E2", lightText: "#B91C1C" },
    Graphic: { emoji: "🎨", color: "#DB2777", bg: "#FCE7F3", lightText: "#BE185D" },
    Audios: { emoji: "🎵", color: "#0891B2", bg: "#CFFAFE", lightText: "#0E7490" },
    Code: { emoji: "⌨️", color: "#4F46E5", bg: "#E0E7FF", lightText: "#4338CA" },
    Videos: { emoji: "🎬", color: "#EA580C", bg: "#FFEDD5", lightText: "#C2410C" },
};

const CATEGORIES: Category[] = [
    "All", "PDF Books", "Software", "WordPress Items",
    "Fonts", "Photos", "Graphic", "Audios", "Code", "Videos",
];

/* ─── DATA ─── */
const PRODUCTS: Product[] = [
    { id: 1, title: "Church Management System", cat: "Software", price: 4500, rating: 4.8, sales: 312, badge: "hot", description: "Full church management with attendance, tithes & SMS" },
    { id: 2, title: "BeautyPro Salon App", cat: "Software", price: 3500, rating: 4.9, sales: 842, badge: "hot", description: "Appointments, inventory & M-Pesa for salons & spas" },
    { id: 3, title: "SaccoSmart Finance", cat: "Software", price: 5000, rating: 4.7, sales: 234, badge: null, description: "Loans, savings & member management for SACCOs" },
    { id: 4, title: "EduCore School System", cat: "Software", price: 4000, rating: 4.6, sales: 521, badge: null, description: "Fee collection, timetables & student portals" },
    { id: 5, title: "ShopFlow Retail POS", cat: "Software", price: 3000, rating: 4.5, sales: 634, badge: null, description: "Point of sale with stock management & receipts" },
    { id: 6, title: "MediTrack Clinic App", cat: "Software", price: 4500, rating: 4.8, sales: 298, badge: null, description: "Patient records, prescriptions & billing" },
    { id: 7, title: "Business Plan Starter", cat: "PDF Books", price: 0, rating: 4.3, sales: 180, badge: "free", description: "Structured business plan template for Kenyan startups" },
    { id: 8, title: "Web Dev Roadmap 2026", cat: "PDF Books", price: 500, rating: 4.5, sales: 420, badge: "new", description: "Step-by-step guide from HTML to full-stack" },
    { id: 9, title: "Startup Finances Guide", cat: "PDF Books", price: 750, rating: 4.2, sales: 95, badge: null, description: "KRA, VAT, payroll basics for new founders" },
    { id: 10, title: "Dantechdevs Blog Theme", cat: "WordPress Items", price: 2500, rating: 4.7, sales: 167, badge: "new", description: "Clean, fast WordPress theme for tech blogs" },
    { id: 11, title: "Portfolio Pro Theme", cat: "WordPress Items", price: 3000, rating: 4.6, sales: 89, badge: null, description: "Showcase your work with this minimal portfolio theme" },
    { id: 12, title: "Church Website Theme", cat: "WordPress Items", price: 2000, rating: 4.8, sales: 203, badge: "hot", description: "Events, sermons & giving integrated out of the box" },
    { id: 13, title: "Nairobi Display Font", cat: "Fonts", price: 800, rating: 4.4, sales: 312, badge: "new", description: "Bold African-inspired display typeface" },
    { id: 14, title: "Code Sans Typeface", cat: "Fonts", price: 600, rating: 4.3, sales: 145, badge: null, description: "Clean monospaced font for developer tools" },
    { id: 15, title: "Kenyan Streets Pack", cat: "Photos", price: 1200, rating: 4.5, sales: 78, badge: null, description: "50 high-res street photography shots from Nairobi" },
    { id: 16, title: "Business Headshots", cat: "Photos", price: 0, rating: 4.1, sales: 540, badge: "free", description: "Professional headshot mockup templates" },
    { id: 17, title: "Tech Workspace Photos", cat: "Photos", price: 900, rating: 4.4, sales: 231, badge: null, description: "Clean desk setups for blogs & presentations" },
    { id: 18, title: "Logo Template Pack", cat: "Graphic", price: 1500, rating: 4.6, sales: 402, badge: "hot", description: "20 editable logo templates in AI & PSD" },
    { id: 19, title: "Social Media Kit", cat: "Graphic", price: 1200, rating: 4.5, sales: 687, badge: null, description: "Instagram, X & Facebook post templates" },
    { id: 20, title: "Flyer Templates Bundle", cat: "Graphic", price: 800, rating: 4.3, sales: 345, badge: null, description: "30 print-ready flyer designs for events & promos" },
    { id: 21, title: "Gospel Beats Pack", cat: "Audios", price: 2000, rating: 4.7, sales: 124, badge: null, description: "10 royalty-free gospel backing tracks" },
    { id: 22, title: "Corporate Jingle Kit", cat: "Audios", price: 1500, rating: 4.4, sales: 89, badge: "new", description: "Short branded audio idents for businesses" },
    { id: 23, title: "Next.js Starter Kit", cat: "Code", price: 3500, rating: 4.9, sales: 412, badge: "hot", description: "Full-stack Next.js 15 + TypeScript + Tailwind boilerplate" },
    { id: 24, title: "React Dashboard UI", cat: "Code", price: 2500, rating: 4.8, sales: 567, badge: "hot", description: "50+ components, dark mode, charts included" },
    { id: 25, title: "M-Pesa STK Integration", cat: "Code", price: 2000, rating: 4.7, sales: 834, badge: null, description: "Node.js + TypeScript M-Pesa Daraja API wrapper" },
    { id: 26, title: "WhatsApp Bot Template", cat: "Code", price: 1500, rating: 4.6, sales: 291, badge: null, description: "Baileys-based WhatsApp bot with session handling" },
    { id: 27, title: "AfricaCoder Intro Video", cat: "Videos", price: 0, rating: 4.2, sales: 1200, badge: "free", description: "Branded intro animation for African tech creators" },
    { id: 28, title: "Tech Explainer Pack", cat: "Videos", price: 1800, rating: 4.5, sales: 67, badge: "new", description: "5 animated explainer video templates" },
];

const FEATURED_IDS = [2, 23, 18, 25, 1, 24];

/* ─── HELPERS ─── */
function Stars({ rating }: { rating: number }) {
    return (
        <span style={{ color: "#F59E0B", fontSize: 11, letterSpacing: 1 }}>
            {"★".repeat(Math.round(rating))}
            <span style={{ opacity: 0.3 }}>{"★".repeat(5 - Math.round(rating))}</span>
        </span>
    );
}

function BadgePill({ badge }: { badge: Badge }) {
    if (!badge) return null;
    const map: Record<NonNullable<Badge>, { bg: string; color: string }> = {
        new: { bg: "#DCFCE7", color: "#166534" },
        hot: { bg: "#FEE2E2", color: "#991B1B" },
        free: { bg: "#EDE9FE", color: "#5B21B6" },
    };
    const s = map[badge];
    return (
        <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
            background: s.bg, color: s.color, textTransform: "uppercase", letterSpacing: "0.5px",
        }}>{badge}</span>
    );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ product, wishlist, onWishlist }: {
    product: Product;
    wishlist: Set<number>;
    onWishlist: (id: number) => void;
}) {
    const [hov, setHov] = useState(false);
    const meta = CAT_META[product.cat as Exclude<Category, "All">];

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "#fff",
                border: `1px solid ${hov ? meta.color + "50" : "#E2E8F0"}`,
                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                transition: "all 0.2s",
                transform: hov ? "translateY(-3px)" : "none",
                boxShadow: hov ? `0 8px 24px ${meta.color}20` : "0 1px 3px rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column", position: "relative",
            }}
        >
            {/* Wishlist */}
            <button
                onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
                style={{
                    position: "absolute", top: 10, right: 10, zIndex: 10,
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#fff", border: "1px solid #E2E8F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, cursor: "pointer", transition: "all 0.15s",
                }}
            >
                {wishlist.has(product.id) ? "❤️" : "🤍"}
            </button>

            {/* Thumbnail */}
            <div style={{
                height: 120, background: meta.bg, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 42, position: "relative",
            }}>
                {meta.emoji}
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <BadgePill badge={product.badge} />
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: "14px 14px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: meta.lightText, marginBottom: 5 }}>
                    {product.cat}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.35, marginBottom: 6, flex: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {product.title}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10, lineHeight: 1.4 }}>
                    {product.description}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                    <Stars rating={product.rating} />
                    <span style={{ fontSize: 11, color: "#64748B" }}>{product.rating} · {product.sales.toLocaleString()} sales</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: product.price === 0 ? "#059669" : "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {product.price === 0 ? "Free" : `KES ${product.price.toLocaleString()}`}
                    </span>
                    <button style={{
                        fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 8,
                        border: `1px solid ${meta.color}`,
                        background: hov ? meta.color : "transparent",
                        color: hov ? "#fff" : meta.color,
                        cursor: "pointer", transition: "all 0.15s",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        {product.price === 0 ? "Download" : "Buy now"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── FEATURED CARD (larger) ─── */
function FeaturedCard({ product, wishlist, onWishlist }: {
    product: Product;
    wishlist: Set<number>;
    onWishlist: (id: number) => void;
}) {
    const [hov, setHov] = useState(false);
    const meta = CAT_META[product.cat as Exclude<Category, "All">];

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "#fff",
                border: `1px solid ${hov ? meta.color + "60" : "#E2E8F0"}`,
                borderRadius: 20, overflow: "hidden", cursor: "pointer",
                transition: "all 0.2s",
                transform: hov ? "translateY(-4px)" : "none",
                boxShadow: hov ? `0 12px 32px ${meta.color}25` : "0 2px 8px rgba(0,0,0,0.06)",
                display: "flex", flexDirection: "column", position: "relative",
            }}
        >
            {/* Featured ribbon */}
            <div style={{
                position: "absolute", top: 14, left: 14, zIndex: 10,
                background: "linear-gradient(135deg, #E11D48, #F43F5E)",
                color: "#fff", fontSize: 9, fontWeight: 800,
                padding: "3px 10px", borderRadius: 999, letterSpacing: "0.8px",
                textTransform: "uppercase",
            }}>⭐ Featured</div>

            {/* Wishlist */}
            <button
                onClick={(e) => { e.stopPropagation(); onWishlist(product.id); }}
                style={{
                    position: "absolute", top: 10, right: 10, zIndex: 10,
                    width: 32, height: 32, borderRadius: "50%",
                    background: "#fff", border: "1px solid #E2E8F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, cursor: "pointer",
                }}
            >
                {wishlist.has(product.id) ? "❤️" : "🤍"}
            </button>

            {/* Thumbnail */}
            <div style={{
                height: 150, background: `linear-gradient(135deg, ${meta.bg}, ${meta.color}15)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52,
            }}>
                {meta.emoji}
            </div>

            {/* Body */}
            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: meta.lightText, marginBottom: 5 }}>
                    {product.cat}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", lineHeight: 1.3, marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {product.title}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12, lineHeight: 1.4, flex: 1 }}>
                    {product.description}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
                    <Stars rating={product.rating} />
                    <span style={{ fontSize: 11, color: "#64748B" }}>{product.rating} · {product.sales.toLocaleString()} sales</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: product.price === 0 ? "#059669" : "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {product.price === 0 ? "Free" : `KES ${product.price.toLocaleString()}`}
                    </span>
                    <button style={{
                        fontSize: 12, fontWeight: 700, padding: "8px 18px", borderRadius: 10,
                        background: hov ? meta.color : `${meta.color}12`,
                        border: `1px solid ${meta.color}40`,
                        color: hov ? "#fff" : meta.color,
                        cursor: "pointer", transition: "all 0.15s",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        {product.price === 0 ? "Download" : "Buy now"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── CATEGORY PILL ─── */
function CatPill({ cat, active, onClick }: { cat: Category; active: boolean; onClick: () => void }) {
    const [hov, setHov] = useState(false);
    const meta = cat !== "All" ? CAT_META[cat as Exclude<Category, "All">] : null;
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0,
                border: active ? `1.5px solid ${meta?.color ?? "#E11D48"}` : `1px solid ${hov ? "#CBD5E1" : "#E2E8F0"}`,
                background: active ? (meta?.bg ?? "#FEE2E2") : hov ? "#F8FAFC" : "#fff",
                color: active ? (meta?.lightText ?? "#9F1239") : hov ? "#334155" : "#64748B",
            }}
        >
            {cat !== "All" && meta ? `${meta.emoji} ${cat}` : "🛍️ All"}
        </button>
    );
}

/* ─── STATS BAR ─── */
function StatsBar() {
    const stats = [
        { label: "Products", value: "28+" },
        { label: "Happy Clients", value: "2.8K+" },
        { label: "Categories", value: "9" },
        { label: "Free Items", value: "4" },
    ];
    return (
        <div style={{
            display: "flex", gap: 0,
            background: "#0F172A", borderRadius: 16,
            overflow: "hidden", margin: "0 auto 0",
            maxWidth: 600,
        }}>
            {stats.map((s, i) => (
                <div key={i} style={{
                    flex: 1, padding: "14px 8px", textAlign: "center",
                    borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: "#64748B", marginTop: 2, fontWeight: 500 }}>{s.label}</div>
                </div>
            ))}
        </div>
    );
}

/* ─── SELL CTA BANNER ─── */
function SellBanner() {
    const router = useRouter();
    return (
        <div style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
            borderRadius: 20, padding: "32px 36px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 24, flexWrap: "wrap",
            border: "1px solid rgba(255,255,255,0.06)",
            position: "relative", overflow: "hidden",
        }}>
            {/* Decorative glow */}
            <div style={{
                position: "absolute", top: -40, right: 80, width: 200, height: 200,
                borderRadius: "50%", background: "#E11D48", opacity: 0.08, filter: "blur(60px)",
                pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
                <div style={{
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "1.5px", color: "#E11D48", marginBottom: 10,
                }}>
                    🚀 For Developers & Creators
                </div>
                <h3 style={{
                    fontSize: 22, fontWeight: 800, color: "#fff",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: "-0.5px", margin: "0 0 8px", lineHeight: 1.2,
                }}>
                    Sell your work on Dantechdevs
                </h3>
                <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, lineHeight: 1.6, maxWidth: 420 }}>
                    List your software, themes, code, or digital products. Reach thousands of Kenyan businesses and get paid via M-Pesa instantly.
                </p>
                <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                    {["✅ M-Pesa payouts", "✅ Keep 80% revenue", "✅ Free to list"].map((item, i) => (
                        <span key={i} style={{ fontSize: 12, color: "#CBD5E1", fontWeight: 600 }}>{item}</span>
                    ))}
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
                {/* ✅ FIXED: now navigates to seller registration */}
                <button
                    onClick={() => router.push("/auth/register?role=seller")}
                    style={{
                        padding: "13px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                        background: "linear-gradient(135deg, #E11D48, #F43F5E)",
                        color: "#fff", border: "none", cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        boxShadow: "0 4px 16px rgba(225,29,72,0.35)",
                        whiteSpace: "nowrap", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "none"}
                >
                    Start Selling →
                </button>
                {/* ✅ FIXED: now navigates to /sell info page */}
                <button
                    onClick={() => router.push("/sell")}
                    style={{
                        padding: "10px 28px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                        background: "transparent", color: "#94A3B8",
                        border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        whiteSpace: "nowrap", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                >
                    Learn more
                </button>
            </div>
        </div>
    );
}

/* ─── MAIN PAGE ─── */
export default function ProductsPage() {
    const [activeCat, setActiveCat] = useState<Category>("All");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("featured");
    const [wishlist, setWishlist] = useState<Set<number>>(new Set());
    const [searchFocused, setSearchFocused] = useState(false);

    const featured = PRODUCTS.filter(p => FEATURED_IDS.includes(p.id));

    const filtered = useMemo(() => {
        let items = PRODUCTS.filter((p) => {
            const matchCat = activeCat === "All" || p.cat === activeCat;
            const q = search.toLowerCase();
            const matchQ = !q || p.title.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
            return matchCat && matchQ;
        });
        if (sort === "newest") items = [...items].sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
        if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
        if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
        if (sort === "rating") items = [...items].sort((a, b) => b.rating - a.rating);
        return items;
    }, [activeCat, search, sort]);

    const toggleWishlist = (id: number) => {
        setWishlist(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const showFeatured = activeCat === "All" && !search;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; }

                .p-search-wrap {
                    display: flex; align-items: center; gap: 12px;
                    background: #fff;
                    border: 2px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 14px 20px;
                    max-width: 600px;
                    margin: 0 auto;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .p-search-wrap.focused {
                    border-color: #E11D48 !important;
                    box-shadow: 0 0 0 4px rgba(225,29,72,0.10) !important;
                }
                .p-search-input {
                    border: none; background: none; flex: 1;
                    font-size: 16px; color: #0F172A; outline: none;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .p-search-input::placeholder { color: #94A3B8; }
                .p-search-btn {
                    padding: 9px 22px; border-radius: 10px; font-size: 14px;
                    font-weight: 700; background: #E11D48; color: #fff;
                    border: none; cursor: pointer;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    transition: background 0.15s;
                    white-space: nowrap;
                }
                .p-search-btn:hover { background: #BE123C; }

                .p-cats {
                    display: flex; gap: 8px;
                    overflow-x: auto; padding-bottom: 6px;
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                }
                .p-cats::-webkit-scrollbar { display: none; }

                .p-select:focus { outline: none; }

                @media (max-width: 640px) {
                    .p-hero-title  { font-size: 26px !important; }
                    .p-hero-sub    { font-size: 14px !important; }
                    .p-grid        { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important; }
                    .p-feat-grid   { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
                    .p-search-wrap { padding: 10px 14px !important; border-radius: 12px !important; }
                    .p-search-input { font-size: 14px !important; }
                }
            `}</style>

            <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>

                {/* ══ HERO ══ */}
                <div style={{
                    background: "linear-gradient(180deg, #fff 0%, #FFF1F2 60%, #F8FAFC 100%)",
                    borderBottom: "1px solid #E2E8F0",
                    padding: "60px 24px 48px",
                }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>

                        {/* Label */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "1.5px", color: "#E11D48",
                            background: "#FFF1F2", border: "1px solid #FECDD3",
                            borderRadius: 999, padding: "5px 14px", marginBottom: 20,
                        }}>
                            <span>🛍️</span> Dantechdevs Marketplace
                        </div>

                        {/* Title */}
                        <h1 className="p-hero-title" style={{
                            fontSize: 42, fontWeight: 800, color: "#0F172A",
                            letterSpacing: "-1.5px", lineHeight: 1.1,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            margin: "0 0 16px",
                        }}>
                            Discover Premium Digital<br />
                            <span style={{ color: "#E11D48" }}>Products for African Businesses</span>
                        </h1>

                        <p className="p-hero-sub" style={{
                            fontSize: 16, color: "#64748B", maxWidth: 500,
                            margin: "0 auto 32px", lineHeight: 1.7,
                        }}>
                            Software, themes, code, books, graphics and more —
                            built for Kenya & Africa. Pay with M-Pesa.
                        </p>

                        {/* ── BIG SEARCH ── */}
                        <div
                            className={`p-search-wrap${searchFocused ? " focused" : ""}`}
                            style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "2px solid #E2E8F0", borderRadius: 16, padding: "14px 20px", maxWidth: 600, margin: "0 auto 32px" }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                className="p-search-input"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Search software, code, themes, books…"
                                style={{ border: "none", background: "none", flex: 1, fontSize: 16, color: "#0F172A", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            />
                            {search && (
                                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}>✕</button>
                            )}
                            <button className="p-search-btn">🔍 Search</button>
                        </div>

                        {/* Quick search chips */}
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
                            {["M-Pesa", "Church System", "Next.js", "Logo Pack", "Free"].map(q => (
                                <button key={q} onClick={() => setSearch(q)} style={{
                                    padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                                    background: "#fff", border: "1px solid #E2E8F0", color: "#64748B",
                                    cursor: "pointer", transition: "all 0.15s",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E11D48"; (e.currentTarget as HTMLButtonElement).style.color = "#E11D48"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLButtonElement).style.color = "#64748B"; }}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Stats */}
                        <StatsBar />
                    </div>
                </div>

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>

                    {/* ══ FEATURED SECTION ══ */}
                    {showFeatured && (
                        <div style={{ marginBottom: 48 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                                <div>
                                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
                                        ⭐ Featured Products
                                    </h2>
                                    <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>Hand-picked top sellers this month</p>
                                </div>
                                <button
                                    onClick={() => setActiveCat("All")}
                                    style={{
                                        fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 8,
                                        border: "1px solid #E2E8F0", background: "#fff", color: "#64748B",
                                        cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    }}
                                >
                                    View all →
                                </button>
                            </div>
                            <div
                                className="p-feat-grid"
                                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}
                            >
                                {featured.map(p => (
                                    <FeaturedCard key={p.id} product={p} wishlist={wishlist} onWishlist={toggleWishlist} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ══ SELL ON DANTECHDEVS BANNER ══ */}
                    {showFeatured && (
                        <div style={{ marginBottom: 48 }}>
                            <SellBanner />
                        </div>
                    )}

                    {/* ══ ALL PRODUCTS ══ */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, letterSpacing: "-0.5px" }}>
                            {showFeatured ? "🛍️ All Products" : search ? `🔍 Results for "${search}"` : `${CAT_META[activeCat as Exclude<Category, "All">]?.emoji ?? "🛍️"} ${activeCat}`}
                        </h2>
                    </div>

                    {/* ── Category pills ── */}
                    <div className="p-cats" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 20 }}>
                        {CATEGORIES.map(cat => (
                            <CatPill key={cat} cat={cat} active={activeCat === cat} onClick={() => setActiveCat(cat)} />
                        ))}
                    </div>

                    {/* Sort + count bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                        <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                            <strong style={{ color: "#0F172A" }}>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""} found
                            {activeCat !== "All" && <> in <strong style={{ color: "#0F172A" }}>{activeCat}</strong></>}
                        </p>
                        <select
                            className="p-select"
                            value={sort}
                            onChange={e => setSort(e.target.value as SortOption)}
                            style={{ fontSize: 13, fontWeight: 600, padding: "7px 12px", border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff", color: "#0F172A", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            <option value="featured">Featured</option>
                            <option value="newest">Newest first</option>
                            <option value="price-asc">Price: low to high</option>
                            <option value="price-desc">Price: high to low</option>
                            <option value="rating">Top rated</option>
                        </select>
                    </div>

                    {/* ── Product Grid ── */}
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 24px", color: "#64748B", fontSize: 15 }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                            <p style={{ fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>No products found</p>
                            <p>Try a different search or category.</p>
                            <button
                                onClick={() => { setSearch(""); setActiveCat("All"); }}
                                style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div
                            className="p-grid"
                            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}
                        >
                            {filtered.map(product => (
                                <ProductCard key={product.id} product={product} wishlist={wishlist} onWishlist={toggleWishlist} />
                            ))}
                        </div>
                    )}

                    {/* ══ BOTTOM SELL CTA ══ */}
                    <div style={{ marginTop: 64 }}>
                        <SellBanner />
                    </div>
                </div>
            </div>
        </>
    );
}