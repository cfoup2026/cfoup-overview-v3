// =============================================================
// CFOup · middleware Next.js (raiz)
// =============================================================
// Roda em TODA requisição (exceto assets/Next internals via matcher).
// Funções:
//   1. Refresh de sessão Supabase via updateSession (cookies)
//   2. Route protection:
//      - não autenticado em rota /(app)/* ou /onboarding → redirect /entrar
//      - autenticado em /entrar → redirect /visao-geral (ou /onboarding se sem empresa)
//      - autenticado sem empresa em /(app)/* → redirect /onboarding
//      - autenticado com empresa em /onboarding → redirect /visao-geral
//
// "Tem empresa" = existe linha em public.companies_users com user_id=auth.uid().
// Check feito 1x por request via supabase.from('companies_users').
// =============================================================
import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Rotas públicas (não exigem auth)
const PUBLIC_PATHS = new Set(["/entrar"])
const AUTH_CALLBACK_PREFIX = "/auth/" // future-proof para magic link / oauth

// Rotas que o usuário autenticado pode acessar mesmo sem empresa
const ALLOWED_WITHOUT_COMPANY = new Set(["/onboarding"])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { response, supabase, user } = await updateSession(request)

  const isPublic = PUBLIC_PATHS.has(pathname) || pathname.startsWith(AUTH_CALLBACK_PREFIX)
  const isOnboarding = pathname === "/onboarding"

  // --- Não autenticado em rota privada → /entrar -----------
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/entrar"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // --- Autenticado: checar se tem empresa ------------------
  if (user) {
    // Busca rápida e barata: existe alguma membership?
    const { data: memberships, error } = await supabase
      .from("companies_users")
      .select("company_id")
      .eq("user_id", user.id)
      .limit(1)

    const hasCompany = !error && (memberships?.length ?? 0) > 0

    // Logado sem empresa, fora de /onboarding → /onboarding
    if (!hasCompany && !isOnboarding && !isPublic) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      return NextResponse.redirect(url)
    }

    // Logado com empresa, em /entrar → /visao-geral
    if (hasCompany && pathname === "/entrar") {
      const url = request.nextUrl.clone()
      url.pathname = "/visao-geral"
      return NextResponse.redirect(url)
    }

    // Logado com empresa, em /onboarding → /visao-geral
    if (hasCompany && isOnboarding) {
      const url = request.nextUrl.clone()
      url.pathname = "/visao-geral"
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  // Roda em tudo, exceto assets estáticos e arquivos internos do Next
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
