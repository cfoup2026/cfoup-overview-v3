// =============================================================
// CFOup · Supabase middleware helper (Edge runtime)
// =============================================================
// Chamado pelo middleware.ts da raiz a cada requisição.
// Refresha a sessão (se expirada e refresh token válido) e devolve
// a response com cookies atualizados + o usuário corrente (ou null).
// =============================================================
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type CookieToSet = { name: string; value: string; options: CookieOptions }

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  ) as unknown as SupabaseClient<Database>

  // Importante: getUser() força revalidação da JWT contra o servidor Auth.
  // getSession() não — confiaria no cookie cego. Para route protection use SEMPRE getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { response, supabase, user }
}
