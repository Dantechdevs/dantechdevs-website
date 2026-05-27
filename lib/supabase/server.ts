/**
 * Server Components, Route Handlers & Server Actions only.
 * Never import this in a "use client" file.
 */

import { createClient }        from "@supabase/supabase-js";
import { createServerClient }  from "@supabase/ssr";
import { cookies }             from "next/headers";
import type { Database }       from "@/types/database";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/* ── Server Components & Route Handlers ─────────────────────
   Usage:
     import { createServerSupabaseClient } from "@/lib/supabase/server"
     const supabase = await createServerSupabaseClient()
     const { data: { user } } = await supabase.auth.getUser()
────────────────────────────────────────────────────────── */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnon, {
    cookies: {
      getAll()        { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — cookies can't be set there.
          // Safe to ignore; middleware handles session refresh.
        }
      },
    },
  });
}

/* ── Service-role client (server-only, never ship to browser) ──
   Only for API routes that need to bypass RLS.
   Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
   (never prefix with NEXT_PUBLIC_).
────────────────────────────────────────────────────────── */
export function createServiceRoleClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");

  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}