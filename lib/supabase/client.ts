/**
 * Browser / Client Components only.
 * Import this in any "use client" file.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnon) {
    throw new Error(
        "Missing Supabase env vars.\n" +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
}

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnon);