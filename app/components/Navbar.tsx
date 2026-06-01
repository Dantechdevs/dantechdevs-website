"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "All Products",
    href: "/products",
    children: [
      { label: "PDF Books", href: "/products/pdf-books" },
      { label: "Software", href: "/products/software" },
      { label: "WordPress Items", href: "/products/wordpress" },
      { label: "Fonts", href: "/products/fonts" },
      { label: "Photos", href: "/products/photos" },
      { label: "Graphic", href: "/products/graphic" },
      { label: "Audios", href: "/products/audios" },
      { label: "Code", href: "/products/code" },
      { label: "Videos", href: "/products/videos" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
];

const RED = "#e8325a";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // ── Live counts ──
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch counts whenever userId changes
  useEffect(() => {
    if (!userId) {
      setWishlistCount(0);
      setOrdersCount(0);
      return;
    }

    const fetchCounts = async () => {
      const [{ count: wc }, { count: oc }] = await Promise.all([
        supabase
          .from("wishlist")
          .select("*", { count: "exact", head: true })
          .eq("buyer_id", userId),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("buyer_id", userId)
          .eq("status", "pending"),
      ]);
      setWishlistCount(wc ?? 0);
      setOrdersCount(oc ?? 0);
    };

    fetchCounts();

    // Realtime: wishlist changes
    const wishlistSub = supabase
      .channel("wishlist-count")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "wishlist",
        filter: `buyer_id=eq.${userId}`,
      }, fetchCounts)
      .subscribe();

    // Realtime: orders changes
    const ordersSub = supabase
      .channel("orders-count")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "orders",
        filter: `buyer_id=eq.${userId}`,
      }, fetchCounts)
      .subscribe();

    return () => {
      supabase.removeChannel(wishlistSub);
      supabase.removeChannel(ordersSub);
    };
  }, [userId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleUserClick = () => {
    if (userId) router.push("/dashboard");
    else router.push("/auth/login");
  };

  return (
    <header className={`dn-nav${scrolled ? " dn-nav--scrolled" : ""}`} role="banner">
      <div className="dn-nav__inner">

        {/* ── Brand ── */}
        <Link href="/" className="dn-nav__logo" aria-label="Dantechdevs home">
          <div className="dn-brand">
            <span className="dn-brand__name">Dantechdevs</span>
            <span className="dn-brand__tag">Code The Future</span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="dn-nav__links" aria-label="Primary navigation" ref={dropRef}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="dn-nav__item"
              onMouseEnter={() => item.children && setDropOpen(item.label)}
              onMouseLeave={() => setDropOpen(null)}
            >
              <Link
                href={item.href}
                className="dn-nav__link"
                aria-haspopup={!!item.children}
                aria-expanded={dropOpen === item.label}
              >
                {item.label}
                {item.children && (
                  <svg
                    className={`dn-chevron${dropOpen === item.label ? " dn-chevron--open" : ""}`}
                    viewBox="0 0 16 16" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                )}
              </Link>

              {item.children && dropOpen === item.label && (
                <div className="dn-dropdown" role="menu">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="dn-dropdown__item"
                      role="menuitem"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div className="dn-nav__actions">
          {/* Search */}
          <button className="dn-icon-btn" aria-label="Search">
            <SearchIcon />
          </button>

          {/* Wishlist */}
          <Link href="/dashboard/wishlist" className="dn-icon-btn dn-icon-btn--badge" aria-label={`Wishlist (${wishlistCount})`}>
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="dn-badge">{wishlistCount > 99 ? "99+" : wishlistCount}</span>
            )}
          </Link>

          {/* Account */}
          <button className="dn-icon-btn" aria-label={userId ? "My account" : "Sign in"} onClick={handleUserClick}>
            <UserIcon />
            {userId && <span className="dn-online-dot" />}
          </button>

          {/* Orders */}
          <Link href="/dashboard/orders" className="dn-icon-btn dn-icon-btn--badge" aria-label={`Orders (${ordersCount})`}>
            <CartIcon />
            {ordersCount > 0 && (
              <span className="dn-badge">{ordersCount > 99 ? "99+" : ordersCount}</span>
            )}
          </Link>
        </div>

        {/* ── Burger ── */}
        <button
          className={`dn-burger${mobileOpen ? " dn-burger--open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="dn-mobile" role="dialog" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <Link href={item.href} className="dn-mobile__link" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
              {item.children && (
                <div className="dn-mobile__sub">
                  {item.children.map((child) => (
                    <Link key={child.label} href={child.href} className="dn-mobile__sublink" onClick={() => setMobileOpen(false)}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="dn-mobile__actions">
            <button className="dn-icon-btn" aria-label="Search"><SearchIcon /></button>
            <Link href="/dashboard/wishlist" className="dn-icon-btn dn-icon-btn--badge" aria-label="Wishlist" onClick={() => setMobileOpen(false)}>
              <HeartIcon />
              {wishlistCount > 0 && <span className="dn-badge">{wishlistCount > 99 ? "99+" : wishlistCount}</span>}
            </Link>
            <button className="dn-icon-btn" aria-label="Account" onClick={() => { handleUserClick(); setMobileOpen(false); }}>
              <UserIcon />
              {userId && <span className="dn-online-dot" />}
            </button>
            <Link href="/dashboard/orders" className="dn-icon-btn dn-icon-btn--badge" aria-label="Orders" onClick={() => setMobileOpen(false)}>
              <CartIcon />
              {ordersCount > 0 && <span className="dn-badge">{ordersCount > 99 ? "99+" : ordersCount}</span>}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .dn-nav {
          position: sticky; top: 0; z-index: 1000;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid transparent;
          transition: box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .dn-nav--scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-bottom-color: #eee;
        }
        .dn-nav__inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; height: 68px; gap: 12px;
        }

        /* Brand */
        .dn-nav__logo { display: flex; align-items: center; flex-shrink: 0; text-decoration: none; }
        .dn-brand { display: flex; flex-direction: column; line-height: 1; }
        .dn-brand__name { font-weight: 800; font-size: 20px; color: ${RED}; letter-spacing: -0.02em; }
        .dn-brand__tag  { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-top: 3px; }

        /* Nav links */
        .dn-nav__links { display: flex; align-items: center; gap: 2px; margin-left: auto; }
        .dn-nav__item  { position: relative; }
        .dn-nav__link  {
          display: flex; align-items: center; gap: 4px;
          padding: 8px 14px; border-radius: 8px;
          font-size: 0.9375rem; font-weight: 500; color: #444;
          text-decoration: none; white-space: nowrap;
          transition: color 0.2s, background 0.2s;
        }
        .dn-nav__link:hover,
        .dn-nav__item:hover > .dn-nav__link { color: ${RED}; background: rgba(232,50,90,0.05); }
        .dn-chevron { width: 14px; height: 14px; opacity: 0.5; transition: transform 0.2s; }
        .dn-chevron--open { transform: rotate(180deg); opacity: 1; }

        /* Dropdown */
        .dn-dropdown {
          position: absolute; top: calc(100% + 8px); left: 50%;
          transform: translateX(-50%); min-width: 200px;
          background: #fff; border: 1px solid #eee; border-radius: 14px;
          padding: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.10);
          z-index: 100; animation: dnFadeUp 0.18s ease both;
        }
        @keyframes dnFadeUp {
          from { opacity:0; transform: translateX(-50%) translateY(8px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0);   }
        }
        .dn-dropdown__item {
          display: block; padding: 9px 14px; border-radius: 8px;
          font-size: 0.875rem; font-weight: 500; color: #555;
          text-decoration: none; transition: color 0.15s, background 0.15s;
        }
        .dn-dropdown__item:hover { color: ${RED}; background: rgba(232,50,90,0.06); }

        /* Actions */
        .dn-nav__actions { display: flex; align-items: center; gap: 2px; margin-left: 12px; }
        .dn-icon-btn {
          position: relative; width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px; border: none; background: transparent;
          color: #555; cursor: pointer; transition: color 0.2s, background 0.2s;
          text-decoration: none;
        }
        .dn-icon-btn:hover { color: ${RED}; background: rgba(232,50,90,0.06); }
        .dn-icon-btn svg { width: 20px; height: 20px; }

        /* Badge */
        .dn-badge {
          position: absolute; top: 4px; right: 4px;
          min-width: 16px; height: 16px; padding: 0 4px;
          background: ${RED}; color: #fff; border-radius: 999px;
          font-size: 0.625rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          animation: badgePop 0.25s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* Online dot for logged-in user */
        .dn-online-dot {
          position: absolute; bottom: 6px; right: 6px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e;
          border: 1.5px solid #fff;
        }

        /* Burger */
        .dn-burger {
          display: none; flex-direction: column; justify-content: space-between;
          width: 28px; height: 20px; background: transparent;
          border: none; cursor: pointer; padding: 0; margin-left: auto;
        }
        .dn-burger span { display: block; width: 100%; height: 2px; background: #333; border-radius: 2px; transition: all 0.25s ease; }
        .dn-burger--open span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
        .dn-burger--open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .dn-burger--open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

        /* Mobile */
        .dn-mobile {
          background: #fff; border-top: 1px solid #eee;
          padding: 12px 20px 20px; display: flex; flex-direction: column; gap: 2px;
          animation: dnFadeIn 0.2s ease both;
        }
        @keyframes dnFadeIn { from { opacity:0; } to { opacity:1; } }
        .dn-mobile__link {
          display: block; padding: 11px 14px; border-radius: 10px;
          font-weight: 600; font-size: 1rem; color: #222;
          text-decoration: none; transition: background 0.15s, color 0.15s;
        }
        .dn-mobile__link:hover { background: rgba(232,50,90,0.05); color: ${RED}; }
        .dn-mobile__sub { display: flex; flex-wrap: wrap; gap: 4px; padding: 4px 14px 8px; }
        .dn-mobile__sublink {
          padding: 6px 12px; border-radius: 8px; background: #f8f8f8;
          font-size: 0.8125rem; font-weight: 500; color: #555;
          text-decoration: none; transition: background 0.15s, color 0.15s;
        }
        .dn-mobile__sublink:hover { background: rgba(232,50,90,0.08); color: ${RED}; }
        .dn-mobile__actions { display: flex; gap: 4px; margin-top: 8px; padding-top: 14px; border-top: 1px solid #eee; }

        /* Responsive */
        @media (max-width: 1024px) {
          .dn-nav__links   { display: none; }
          .dn-nav__actions { display: none; }
          .dn-burger       { display: flex; }
        }
        @media (min-width: 1025px) {
          .dn-mobile { display: none; }
        }
      `}</style>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
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