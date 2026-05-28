/**
 * ─────────────────────────────────────────────
 * Supabase Data Hooks
 * File: lib/hooks.ts
 * ─────────────────────────────────────────────
 * Ready-made functions to query your database.
 * Import and use these in any page or component.
 *
 * CLIENT COMPONENTS  → import { supabase } and call these directly
 * SERVER COMPONENTS  → call createServerSupabaseClient() first,
 *                      then pass it in (or call supabase inside)
 * ─────────────────────────────────────────────
 */

import { supabase } from "./supabase/client";
import type { ProductRow, OrderRow, UserRow, WishlistRow } from "@/types/database";

/* ══════════════════════════════════════════
   AUTH
══════════════════════════════════════════ */

/** Get the currently logged-in user's full profile */
export async function getCurrentUser(): Promise<UserRow | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data ?? null;
}

/** Sign out */
export async function signOut() {
  await supabase.auth.signOut();
}

/* ══════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════ */

/** Get all active products (homepage, shop) */
export async function getProducts(category?: string): Promise<ProductRow[]> {
  let query = supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) { console.error("getProducts:", error); return []; }
  return data ?? [];
}

/** Get a single product by slug */
export async function getProduct(slug: string): Promise<ProductRow | null> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

/** Get products owned by a seller (seller dashboard) */
export async function getMyProducts(sellerId: string): Promise<ProductRow[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** Create a new product */
export async function createProduct(
  product: Omit<ProductRow, "id" | "sales_count" | "rating" | "created_at">
) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();
  return { data, error };
}

/** Update a product */
export async function updateProduct(id: string, updates: Partial<ProductRow>) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

/** Delete a product */
export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  return { error };
}

/* ══════════════════════════════════════════
   ORDERS
══════════════════════════════════════════ */

/** Get buyer's own orders */
export async function getMyOrders(buyerId: string): Promise<OrderRow[]> {
  const { data } = await supabase
    .from("orders")
    .select("*, products(*)")
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** Get all orders for a seller's products */
export async function getSellerOrders(sellerId: string): Promise<OrderRow[]> {
  const { data } = await supabase
    .from("orders")
    .select("*, products!inner(seller_id, title)")
    .eq("products.seller_id", sellerId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

/**
 * Get ALL orders — admin only.
 * Relies on the "Admins can view all orders" RLS policy in schema.sql.
 * Non-admins will get an empty array (RLS blocks the rows silently).
 */
export async function getAllOrders(): Promise<OrderRow[]> {
  // Extra client-side guard: bail early if not admin
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    console.warn("getAllOrders: caller is not an admin.");
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, products(*), users(*)")
    .order("created_at", { ascending: false });

  if (error) { console.error("getAllOrders:", error); return []; }
  return data ?? [];
}

/**
 * Create an order after a successful payment.
 * Also records a download entry and increments the product's sales count.
 */
export async function createOrder(order: Omit<OrderRow, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (data && !error) {
    // Record download access
    await supabase.from("downloads").insert({
      order_id:   data.id,
      buyer_id:   order.buyer_id,
      product_id: order.product_id,
    });

    // Increment product sales counter via RPC defined in schema.sql
    await supabase.rpc("increment_sales", { product_id: order.product_id });
  }

  return { data, error };
}

/* ══════════════════════════════════════════
   DOWNLOADS — secure signed URLs
══════════════════════════════════════════ */

/**
 * Generate a short-lived signed URL for a purchased product file.
 * Never expose the raw file_url — always use this for downloads.
 *
 * @param storagePath  The path inside the 'products' bucket (e.g. "abc123/file.zip")
 * @param expiresIn    Seconds until the link expires (default: 60)
 */
export async function getSignedDownloadUrl(
  storagePath: string,
  expiresIn = 60
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("products")
    .createSignedUrl(storagePath, expiresIn);

  if (error) { console.error("getSignedDownloadUrl:", error); return null; }
  return data?.signedUrl ?? null;
}

/* ══════════════════════════════════════════
   WISHLIST
══════════════════════════════════════════ */

export async function getWishlist(buyerId: string): Promise<WishlistRow[]> {
  const { data } = await supabase
    .from("wishlist")
    .select("*, products(*)")
    .eq("buyer_id", buyerId);
  return data ?? [];
}

export async function addToWishlist(buyerId: string, productId: string) {
  const { error } = await supabase
    .from("wishlist")
    .insert({ buyer_id: buyerId, product_id: productId });
  return { error };
}

export async function removeFromWishlist(buyerId: string, productId: string) {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("buyer_id", buyerId)
    .eq("product_id", productId);
  return { error };
}

/* ══════════════════════════════════════════
   STATS (Admin / Seller dashboards)
══════════════════════════════════════════ */

/** Total revenue for a single seller (completed orders only) */
export async function getSellerRevenue(sellerId: string): Promise<number> {
  const { data } = await supabase
    .from("orders")
    .select("amount, products!inner(seller_id)")
    .eq("products.seller_id", sellerId)
    .eq("status", "completed");

  return data?.reduce((sum, o) => sum + Number(o.amount), 0) ?? 0;
}

/**
 * Platform-wide stats — admin only.
 * Returns zeroes for non-admins (RLS blocks the data).
 */
export async function getAdminStats() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    console.warn("getAdminStats: caller is not an admin.");
    return { totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 };
  }

  const [products, orders, users] = await Promise.all([
    supabase.from("products").select("id",    { count: "exact" }),
    supabase.from("orders").select("amount",  { count: "exact" }),
    supabase.from("users").select("id",       { count: "exact" }),
  ]);

  const totalRevenue = orders.data?.reduce((sum, o) => sum + Number(o.amount), 0) ?? 0;

  return {
    totalProducts: products.count ?? 0,
    totalOrders:   orders.count   ?? 0,
    totalUsers:    users.count    ?? 0,
    totalRevenue,
  };
}
