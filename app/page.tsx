"use client";

import { useState } from "react";
import ProductCard, { type Product } from "@/app/components/Products";

/* ── Data ── */
const categories = [
  { icon: "✏️", label: "Fonts" },
  { icon: "🖼️", label: "Photos" },
  { icon: "✒️", label: "Graphic" },
  { icon: "🎵", label: "Audios" },
  { icon: "</>", label: "Code" },
  { icon: "▶️", label: "Videos" },
];

const featuredProducts: Product[] = [
  {
    id: "1",
    title: "Evening Landscape Pack",
    slug: "evening-landscape-pack",
    price: 0,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    category: "Photos",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
  },
  {
    id: "2",
    title: "Dare to Lead",
    slug: "dare-to-lead",
    price: 230,
    originalPrice: 300,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    category: "PDF Books",
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: "3",
    title: "The Silent Patient",
    slug: "the-silent-patient",
    price: 75,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    category: "PDF Books",
    rating: 4.9,
    reviewCount: 312,
    isNew: true,
  },
  {
    id: "4",
    title: "Then She Was Gone",
    slug: "then-she-was-gone",
    price: 33,
    originalPrice: 50,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    category: "PDF Books",
    rating: 4.4,
    reviewCount: 57,
  },
  {
    id: "5",
    title: "Brand Identity Kit",
    slug: "brand-identity-kit",
    price: 0,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80",
    category: "Graphic",
    rating: 4.7,
    reviewCount: 203,
    isNew: true,
  },
  {
    id: "6",
    title: "Startup Pitch Deck",
    slug: "startup-pitch-deck",
    price: 49,
    originalPrice: 89,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    category: "Code",
    rating: 4.5,
    reviewCount: 78,
  },
  {
    id: "7",
    title: "Geo Shapes Bundle",
    slug: "geo-shapes-bundle",
    price: 19,
    originalPrice: 95,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
    category: "Graphic",
    rating: 4.3,
    reviewCount: 41,
  },
  {
    id: "8",
    title: "UI Component Kit",
    slug: "ui-component-kit",
    price: 15,
    originalPrice: 48,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    category: "Code",
    rating: 4.8,
    reviewCount: 156,
  },
];

/* ── Page ── */
export default function HomePage() {
  const [search, setSearch] = useState("");

  const visibleProducts = search.trim()
    ? featuredProducts.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    )
    : featuredProducts;

  return (
    <main style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Segoe UI', sans-serif", color: "#111" }}>

      {/* ── HERO ── */}
      <section style={{
        position: "relative",
        background: "linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.62)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80') center/cover no-repeat",
        padding: "110px 24px 100px", textAlign: "center", color: "#fff",
      }}>
        <h1 style={{
          fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 800,
          lineHeight: 1.15, margin: "0 auto 18px", maxWidth: "800px",
        }}>
          The Best Digital Software<br />Marketplace for Kenya
        </h1>

        <p style={{ color: "#e8325a", fontSize: "17px", marginBottom: "36px", fontWeight: 500 }}>
          M-Pesa integrated, locally supported, and priced for the Kenyan market
        </p>

        {/* Search Bar */}
        <div style={{
          display: "flex", alignItems: "center", maxWidth: "560px",
          margin: "0 auto 40px", background: "rgba(255,255,255,0.97)",
          borderRadius: "40px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1, border: "none", outline: "none",
              padding: "18px 24px", fontSize: "16px",
              background: "transparent", color: "#111",
            }}
          />
          <button style={{
            background: "#e8325a", border: "none",
            padding: "18px 22px", cursor: "pointer", fontSize: "18px", color: "#fff",
          }}>🔍</button>
        </div>

        {/* Quick pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
          {[
            { icon: "📄", label: "PDF Books" },
            { icon: "💾", label: "Software" },
            { icon: "🎨", label: "Graphics" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: "8px",
              color: "#fff", fontSize: "16px", cursor: "pointer", fontWeight: 500,
            }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <h2 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "8px" }}>
          Browse By <span style={{ color: "#e8325a" }}>Category</span>
        </h2>
        <p style={{ color: "#888", marginBottom: "48px", fontSize: "15px" }}>
          Our Categories are Extraordinary
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "20px" }}>
          {categories.map((cat) => (
            <div
              key={cat.label}
              style={{
                border: "1px solid #eee", borderRadius: "16px",
                padding: "36px 20px", cursor: "pointer",
                transition: "all 0.25s ease", background: "#fff",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(232,50,90,0.15)";
                e.currentTarget.style.borderColor = "#e8325a";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#eee";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "14px" }}>{cat.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "16px" }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ITEMS ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 100px", textAlign: "center" }}>
        <h2 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "8px" }}>
          Featured <span style={{ color: "#e8325a" }}>Items</span>
        </h2>
        <p style={{ color: "#888", marginBottom: "48px", fontSize: "15px" }}>
          These Items are Extraordinary
        </p>

        {visibleProducts.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: "16px", padding: "40px 0" }}>
            No products match &ldquo;{search}&rdquo;
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "24px", textAlign: "left",
          }}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}