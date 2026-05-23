"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── Types ── */
export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

/* ── Component ── */
export default function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // ✅ FIX: Guard against undefined product prop
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const isFree = product.price === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted((v) => !v);
  };

  if (variant === "list") {
    return (
      <Link href={`/products/${product.slug}`} className="product-card-list" aria-label={product.title}>
        <div className="product-card-list__image-wrap">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="product-card-list__image"
          />
          {discount && (
            <span className="product-badge product-badge--sale">-{discount}%</span>
          )}
        </div>
        <div className="product-card-list__body">
          {product.category && (
            <span className="product-category">{product.category}</span>
          )}
          <h3 className="product-card-list__title">{product.title}</h3>
          {product.rating != null && (
            <div className="product-rating" aria-label={`${product.rating} stars`}>
              <StarIcon filled />
              <span>{product.rating.toFixed(1)}</span>
              {product.reviewCount != null && (
                <span className="product-rating__count">({product.reviewCount})</span>
              )}
            </div>
          )}
          <div className="product-price">
            <span className="product-price__current">
              {isFree ? "Free" : `$${product.price.toFixed(2)}`}
            </span>
            {product.originalPrice && (
              <span className="product-price__original">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <button
          className={`product-btn-cart${addedToCart ? " product-btn-cart--added" : ""}`}
          onClick={handleAddToCart}
          aria-label={addedToCart ? "Added to cart" : "Add to cart"}
        >
          {addedToCart ? <CheckIcon /> : <CartIcon />}
          {addedToCart ? "Added" : "Add to Cart"}
        </button>

        <ProductCardStyles />
      </Link>
    );
  }

  /* ── Grid variant (default) ── */
  return (
    <Link href={`/products/${product.slug}`} className="product-card" aria-label={product.title}>
      {/* Image */}
      <div className="product-card__image-wrap">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="product-card__image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        {discount && (
          <span className="product-badge product-badge--sale">-{discount}%</span>
        )}
        {product.isNew && !discount && (
          <span className="product-badge product-badge--new">New</span>
        )}

        {/* Wishlist */}
        <button
          className={`product-card__wishlist${wishlisted ? " product-card__wishlist--active" : ""}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* Hover overlay */}
        <div className="product-card__overlay" aria-hidden="true">
          <button
            className={`product-card__add-btn${addedToCart ? " product-card__add-btn--added" : ""}`}
            onClick={handleAddToCart}
            aria-label={addedToCart ? "Added to cart" : "Add to cart"}
          >
            {addedToCart ? (
              <>
                <CheckIcon /> Added
              </>
            ) : (
              <>
                <CartIcon /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="product-card__body">
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        <h3 className="product-card__title">{product.title}</h3>

        <div className="product-card__footer">
          {product.rating != null && (
            <div className="product-rating" aria-label={`${product.rating} stars`}>
              <StarIcon filled />
              <span>{product.rating.toFixed(1)}</span>
              {product.reviewCount != null && (
                <span className="product-rating__count">({product.reviewCount})</span>
              )}
            </div>
          )}

          <div className="product-price">
            <span className="product-price__current">
              {isFree ? "Free" : `$${product.price.toFixed(2)}`}
            </span>
            {product.originalPrice && (
              <span className="product-price__original">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <ProductCardStyles />
    </Link>
  );
}

/* ── Styles ── */
function ProductCardStyles() {
  return (
    <style>{`
      .product-card {
        display: flex;
        flex-direction: column;
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(26,21,48,0.06);
        border: 1px solid #F0EEF8;
        text-decoration: none;
        color: inherit;
        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
                    box-shadow 0.25s ease;
        position: relative;
      }
      .product-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 40px rgba(26,21,48,0.12);
      }
      .product-card__image-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: #F8F7FF;
      }
      .product-card__image {
        object-fit: cover;
        transition: transform 0.4s ease;
      }
      .product-card:hover .product-card__image {
        transform: scale(1.06);
      }
      .product-badge {
        position: absolute;
        z-index: 3;
        border-radius: 999px;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 4px 10px;
        line-height: 1;
      }
      .product-badge--sale {
        top: 12px;
        left: 12px;
        background: #E8294C;
        color: #fff;
      }
      .product-badge--new {
        top: 12px;
        left: 12px;
        background: #7C5CFC;
        color: #fff;
      }
      .product-card__wishlist {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 3;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(6px);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        color: #9B96B4;
      }
      .product-card__wishlist:hover,
      .product-card__wishlist--active {
        background: #fff;
        transform: scale(1.15);
        color: #E8294C;
      }
      .product-card__wishlist svg { width: 16px; height: 16px; }
      .product-card__overlay {
        position: absolute;
        inset: 0;
        background: rgba(26,21,48,0.45);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 20px;
        opacity: 0;
        transition: opacity 0.25s ease;
        z-index: 2;
      }
      .product-card:hover .product-card__overlay { opacity: 1; }
      .product-card__add-btn {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 10px 22px;
        border-radius: 999px;
        background: #E8294C;
        color: #fff;
        border: none;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.875rem;
        font-weight: 600;
        box-shadow: 0 4px 16px rgba(232,41,76,0.4);
        transform: translateY(12px);
        transition: background 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      }
      .product-card:hover .product-card__add-btn { transform: translateY(0); }
      .product-card__add-btn:hover { background: #cf1f3f; }
      .product-card__add-btn--added { background: #22C55E; box-shadow: 0 4px 16px rgba(34,197,94,0.4); }
      .product-card__add-btn svg { width: 16px; height: 16px; }
      .product-card__body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      }
      .product-category {
        font-size: 0.7188rem;
        font-weight: 600;
        color: #9B96B4;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .product-card__title {
        font-family: 'Syne', sans-serif;
        font-size: 0.9375rem;
        font-weight: 700;
        color: #1A1530;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .product-card__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 8px;
        flex-wrap: wrap;
        gap: 6px;
      }
      .product-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8125rem;
        font-weight: 600;
        color: #F5A623;
      }
      .product-rating svg { width: 13px; height: 13px; }
      .product-rating__count { color: #9B96B4; font-weight: 400; }
      .product-price {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .product-price__current {
        font-family: 'Syne', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        color: #E8294C;
      }
      .product-price__original {
        font-size: 0.8125rem;
        color: #9B96B4;
        text-decoration: line-through;
      }
      .product-card-list {
        display: flex;
        align-items: center;
        gap: 16px;
        background: #fff;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(26,21,48,0.06);
        border: 1px solid #F0EEF8;
        text-decoration: none;
        color: inherit;
        padding: 14px;
        transition: box-shadow 0.25s ease, transform 0.25s ease;
        position: relative;
      }
      .product-card-list:hover {
        transform: translateX(4px);
        box-shadow: 0 8px 24px rgba(26,21,48,0.1);
      }
      .product-card-list__image-wrap {
        position: relative;
        width: 100px;
        height: 80px;
        border-radius: 10px;
        overflow: hidden;
        flex-shrink: 0;
        background: #F8F7FF;
      }
      .product-card-list__image { object-fit: cover; }
      .product-card-list__body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .product-card-list__title {
        font-family: 'Syne', sans-serif;
        font-size: 0.9375rem;
        font-weight: 700;
        color: #1A1530;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .product-btn-cart {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 9px 18px;
        border-radius: 999px;
        background: rgba(232,41,76,0.08);
        color: #E8294C;
        border: 1.5px solid rgba(232,41,76,0.2);
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.8125rem;
        font-weight: 600;
        white-space: nowrap;
        flex-shrink: 0;
        transition: all 0.2s ease;
      }
      .product-btn-cart:hover { background: #E8294C; color: #fff; }
      .product-btn-cart--added { background: #22C55E; color: #fff; border-color: #22C55E; }
      .product-btn-cart svg { width: 15px; height: 15px; }
    `}</style>
  );
}

/* ── Icons ── */
function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "#E8294C" : "none"} stroke={filled ? "#E8294C" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "#F5A623" : "none"} stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}