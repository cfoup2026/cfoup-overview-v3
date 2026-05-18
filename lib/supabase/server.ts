// =============================================================
// CFOup · Supabase client (server · RSC, Server Actions, Route Handlers)
// =============================================================
// Use em Server Components, Server Actions e Route Handlers.
// Cookies vivem nos headers HTTP e são lidos/escritos via next/headers.
//
// Importante: cookies() do Next 15+ retorna Promise — sempre `await`.
// Em Server Components puros (read-only), o set/remove são no-ops; isso
// é OK porque é o middleware que vai persistir cookies refreshados.
// =============================================================
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type CookieToSet = { name: string; value: string; options: CookieOptions }

/**
 * Server client tipado com Database. Cast explícito — ver nota em client.ts.
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // `set` em Server Component puro é no-op. Middleware faz o trabalho real.
          }
        },
      },
    },
  ) as unknown as SupabaseClient<Database>
}
