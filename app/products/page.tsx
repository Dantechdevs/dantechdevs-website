"use client";
import { useState, useMemo } from "react";

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

/* ─── HELPERS ─── */
function Stars({ rating }: { rating: number }) {
    return (
        <span style={{ color: "#F59E0B", fontSize: 11, letterSpacing: 1 }}>
            {"★".repeat(Math.round(rating))}
            <span style={{ opacity: 0.3 }}>{"★".repeat(5 - Math.round(rating))}</span>
        </span>
    );
}

function Badge({ badge }: { badge: Badge }) {
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
        }}>
            {badge}
        </span>
    );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ product }: { product: Product }) {
    const [hov, setHov] = useState(false);
    const meta = CAT_META[product.cat as Exclude<Category, "All">];

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "#fff",
                border: `1px solid ${hov ? meta.color + "50" : "#E2E8F0"}`,
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s",
                transform: hov ? "translateY(-3px)" : "none",
                boxShadow: hov ? `0 8px 24px ${meta.color}20` : "0 1px 3px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Thumbnail */}
            <div style={{
                height: 120, background: meta.bg, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 42, position: "relative",
            }}>
                {product.emoji ?? meta.emoji}
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <Badge badge={product.badge} />
                </div>
                {hov && (
                    <div style={{
                        position: "absolute", inset: 0, background: meta.color + "10",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "opacity 0.2s",
                    }} />
                )}
            </div>

            {/* Body */}
            <div style={{ padding: "14px 14px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.6px", color: meta.lightText, marginBottom: 5,
                }}>
                    {product.cat}
                </div>
                <div style={{
                    fontSize: 13, fontWeight: 700, color: "#0F172A",
                    lineHeight: 1.35, marginBottom: 6, flex: 1,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                    {product.title}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10, lineHeight: 1.4 }}>
                    {product.description}
                </div>
                <div style={{
                    display: "flex", alignItems: "center", gap: 4, marginBottom: 10,
                }}>
                    <Stars rating={product.rating} />
                    <span style={{ fontSize: 11, color: "#64748B" }}>
                        {product.rating} · {product.sales.toLocaleString()} sales
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                        fontSize: 15, fontWeight: 800,
                        color: product.price === 0 ? "#059669" : "#0F172A",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
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

/* ─── CATEGORY PILL ─── */
function CatPill({
    cat, active, onClick,
}: {
    cat: Category; active: boolean; onClick: () => void;
}) {
    const [hov, setHov] = useState(false);
    const meta = cat !== "All" ? CAT_META[cat as Exclude<Category, "All">] : null;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: "7px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                border: active
                    ? `1.5px solid ${meta?.color ?? "#E11D48"}`
                    : `1px solid ${hov ? "#CBD5E1" : "#E2E8F0"}`,
                background: active
                    ? (meta?.bg ?? "#FEE2E2")
                    : hov ? "#F8FAFC" : "#fff",
                color: active
                    ? (meta?.lightText ?? "#9F1239")
                    : hov ? "#334155" : "#64748B",
            }}
        >
            {cat !== "All" && meta ? `${meta.emoji} ${cat}` : cat}
        </button>
    );
}

/* ─── MAIN PAGE ─── */
export default function ProductsPage() {
    const [activeCat, setActiveCat] = useState<Category>("All");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("featured");
    const [wishlist, setWishlist] = useState<Set<number>>(new Set());

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
        setWishlist((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; }
        .products-search:focus { border-color: #E11D48 !important; box-shadow: 0 0 0 3px rgba(225,29,72,0.12) !important; outline: none; }
        .products-select:focus { outline: none; }
        @media (max-width: 640px) {
          .products-hero-title { font-size: 24px !important; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important; }
        }
      `}</style>

            <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
                {/* Hero */}
                <div style={{
                    background: "#fff", borderBottom: "1px solid #E2E8F0",
                    padding: "52px 24px 36px",
                }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
                        <div style={{
                            display: "inline-block", fontSize: 12, fontWeight: 700,
                            textTransform: "uppercase", letterSpacing: "1.5px",
                            color: "#E11D48", background: "#FFF1F2", border: "1px solid #FECDD3",
                            borderRadius: 999, padding: "4px 14px", marginBottom: 16,
                        }}>
                            Dantechdevs Marketplace
                        </div>
                        <h1
                            className="products-hero-title"
                            style={{
                                fontSize: 38, fontWeight: 800, color: "#0F172A",
                                letterSpacing: "-1px", lineHeight: 1.15,
                                fontFamily: "'Plus Jakarta Sans', sans-serif", margin: "0 0 12px",
                            }}
                        >
                            All Products
                        </h1>
                        <p style={{
                            fontSize: 15, color: "#64748B", maxWidth: 520,
                            margin: "0 auto 28px", lineHeight: 1.6,
                        }}>
                            Software, themes, code, books, graphics and more — built for African businesses.
                        </p>

                        {/* Search */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 10,
                            background: "#F8FAFC", border: "1.5px solid #E2E8F0",
                            borderRadius: 12, padding: "10px 16px",
                            maxWidth: 460, margin: "0 auto",
                            transition: "border-color 0.2s",
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                className="products-search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products…"
                                style={{
                                    border: "none", background: "none", flex: 1,
                                    fontSize: 14, color: "#0F172A",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        color: "#94A3B8", fontSize: 16, lineHeight: 1, padding: 0,
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
                    {/* Category pills */}
                    <div style={{
                        display: "flex", gap: 8, flexWrap: "wrap",
                        marginBottom: 24, overflowX: "auto", paddingBottom: 4,
                    }}>
                        {CATEGORIES.map((cat) => (
                            <CatPill
                                key={cat}
                                cat={cat}
                                active={activeCat === cat}
                                onClick={() => setActiveCat(cat)}
                            />
                        ))}
                    </div>

                    {/* Sort + count bar */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10,
                    }}>
                        <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                            <strong style={{ color: "#0F172A" }}>{filtered.length}</strong> product{filtered.length !== 1 ? "s" : ""} found
                            {activeCat !== "All" && (
                                <> in <strong style={{ color: "#0F172A" }}>{activeCat}</strong></>
                            )}
                        </p>
                        <select
                            className="products-select"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortOption)}
                            style={{
                                fontSize: 13, fontWeight: 600, padding: "7px 12px",
                                border: "1px solid #E2E8F0", borderRadius: 8,
                                background: "#fff", color: "#0F172A", cursor: "pointer",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                        >
                            <option value="featured">Featured</option>
                            <option value="newest">Newest first</option>
                            <option value="price-asc">Price: low to high</option>
                            <option value="price-desc">Price: high to low</option>
                            <option value="rating">Top rated</option>
                        </select>
                    </div>

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <div style={{
                            textAlign: "center", padding: "80px 24px",
                            color: "#64748B", fontSize: 15,
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                            <p style={{ fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>No products found</p>
                            <p>Try a different search or category.</p>
                            <button
                                onClick={() => { setSearch(""); setActiveCat("All"); }}
                                style={{
                                    marginTop: 16, padding: "8px 20px", borderRadius: 8,
                                    border: "1px solid #E2E8F0", background: "#fff",
                                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div
                            className="products-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: 16,
                            }}
                        >
                            {filtered.map((product) => (
                                <div key={product.id} style={{ position: "relative" }}>
                                    <button
                                        onClick={() => toggleWishlist(product.id)}
                                        style={{
                                            position: "absolute", top: 10, right: 10, zIndex: 10,
                                            width: 30, height: 30, borderRadius: "50%",
                                            background: "#fff", border: "1px solid #E2E8F0",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 15, cursor: "pointer", transition: "all 0.15s",
                                        }}
                                        title={wishlist.has(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        {wishlist.has(product.id) ? "❤️" : "🤍"}
                                    </button>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}