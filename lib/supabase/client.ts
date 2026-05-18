// =============================================================
// CFOup · Supabase client (browser / Client Components)
// =============================================================
// Use em Client Components ("use client"). Cookies vivem em document.cookie
// e são lidos/escritos pelo @supabase/ssr automaticamente.
//
// NÃO importar em Server Components, Route Handlers ou Middleware —
// use lib/supabase/server.ts ou lib/supabase/middleware.ts.
// =============================================================
import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

/**
 * Browser client tipado com Database.
 *
 * Cast explícito para SupabaseClient<Database>: algumas combinações de
 * versão de @supabase/ssr × @supabase/supabase-js falham em propagar o
 * generic Database puramente via inferência, e .from() volta como never.
 * O cast força o tipo correto sem mudar runtime.
 */
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as unknown as SupabaseClient<Database>
}
