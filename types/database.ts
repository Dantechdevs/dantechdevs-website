/**
 * ─────────────────────────────────────────────
 * STAGE 2 — TypeScript Database Types
 * ─────────────────────────────────────────────
 * These types match your Supabase tables exactly.
 * They give you autocomplete and type safety
 * when querying your database.
 *
 * UPDATE THESE if you add/change columns in
 * your Supabase tables.
 * ─────────────────────────────────────────────
 */

export type UserRole = "buyer" | "seller" | "admin";
export type ProductStatus = "active" | "draft" | "suspended";
export type OrderStatus = "pending" | "completed" | "refunded" | "failed";
export type PaymentMethod = "mpesa" | "card" | "bank";

/* ── Row types (what you GET from the database) ── */

export interface UserRow {
  id:           string;
  email:        string;
  name:         string;
  phone:        string | null;
  mpesa_number: string | null;
  role:         UserRole;
  avatar_url:   string | null;
  created_at:   string;
}

export interface ProductRow {
  id:          string;
  title:       string;
  slug:        string;
  description: string | null;
  price:       number;
  category:    string;
  image_url:   string | null;
  file_url:    string | null;
  seller_id:   string;
  status:      ProductStatus;
  sales_count: number;
  rating:      number;
  created_at:  string;
}

export interface OrderRow {
  id:             string;
  buyer_id:       string;
  product_id:     string;
  amount:         number;
  status:         OrderStatus;
  payment_method: PaymentMethod;
  mpesa_ref:      string | null;
  created_at:     string;
}

export interface DownloadRow {
  id:            string;
  order_id:      string;
  buyer_id:      string;
  product_id:    string;
  downloaded_at: string;
}

export interface WishlistRow {
  id:         string;
  buyer_id:   string;
  product_id: string;
  created_at: string;
}

export interface ReviewRow {
  id:         string;
  product_id: string;
  buyer_id:   string;
  rating:     number;
  comment:    string | null;
  created_at: string;
}

/* ── Insert types (what you SEND to the database) ── */

export type InsertProduct = Omit<ProductRow, "id" | "sales_count" | "rating" | "created_at">;
export type InsertOrder   = Omit<OrderRow,   "id" | "created_at">;
export type InsertReview  = Omit<ReviewRow,  "id" | "created_at">;

/* ── Database type (used by the Supabase client) ── */

export interface Database {
  public: {
    Tables: {
      users:     { Row: UserRow;     Insert: Partial<UserRow>;    Update: Partial<UserRow>;    };
      products:  { Row: ProductRow;  Insert: InsertProduct;       Update: Partial<ProductRow>; };
      orders:    { Row: OrderRow;    Insert: InsertOrder;         Update: Partial<OrderRow>;   };
      downloads: { Row: DownloadRow; Insert: Omit<DownloadRow,"id">; Update: Partial<DownloadRow>; };
      wishlist:  { Row: WishlistRow; Insert: Omit<WishlistRow,"id"|"created_at">; Update: Partial<WishlistRow>; };
      reviews:   { Row: ReviewRow;   Insert: InsertReview;        Update: Partial<ReviewRow>;  };
    };
  };
}
