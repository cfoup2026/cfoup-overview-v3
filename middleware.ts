// =============================================================
// CFOup · middleware Next.js (raiz)
// =============================================================
// Roda em TODA requisição (exceto assets/Next internals via matcher).
// Funções:
//   1. Refresh de sessão Supabase via updateSession (cookies)
//   2. Route protection com 4 estados de mundo:
//      a. !user em rota privada → /entrar
//      b. user + sem company + COM marker signup pending → /onboarding (legítimo)
//      c. user + sem company + SEM marker → signOut + /entrar?reason=session_expired
//         (sessão zumbi: signup anterior abandonado ou company deletada)
//      d. user + com company em /entrar ou /onboarding → /visao-geral
//
// "Marker signup pending" = cookie httpOnly `cfoup_signup_pending` posto
// pelo signUpAction e limpo por createCompanyAction/signOutAction.
// "Tem empresa" = existe linha em public.companies_users com user_id=auth.uid().
// =============================================================
import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Rotas públicas (não exigem auth)
const PUBLIC_PATHS = new Set(["/entrar"])
const AUTH_CALLBACK_PREFIX = "/auth/" // future-proof para magic link / oauth

const SIGNUP_PENDING_COOKIE = "cfoup_signup_pending"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { response, supabase, user } = await updateSession(request)

  const isPublic = PUBLIC_PATHS.has(pathname) || pathname.startsWith(AUTH_CALLBACK_PREFIX)
  const isOnboarding = pathname === "/onboarding"
  const signupPending = request.cookies.get(SIGNUP_PENDING_COOKIE)?.value === "1"

  // --- (a) Não autenticado em rota privada → /entrar ----------
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/entrar"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // --- Autenticado: checar se tem empresa --------------------
  if (user) {
    const { data: memberships, error } = await supabase
      .from("companies_users")
      .select("company_id")
      .eq("user_id", user.id)
      .limit(1)

    const hasCompany = !error && (memberships?.length ?? 0) > 0

    if (!hasCompany) {
      if (signupPending) {
        // (b) Signup novo e legítimo, em fluxo de onboarding.
        // Se já está em /onboarding (ou em rota pública), deixa passar.
        // Senão, manda para /onboarding.
        if (!isOnboarding && !isPublic) {
          const url = request.nextUrl.clone()
          url.pathname = "/onboarding"
          return NextResponse.redirect(url)
        }
        // Em /entrar com signup pending: deixa passar (caso raro de back/forward).
      } else {
        // (c) Sessão zumbi: autenticado mas sem company e sem marker.
        // Cenários típicos: signup anterior abandonado, company deletada,
        // ou cookie antigo de outra sessão de teste.
        // Forçamos signOut e mandamos para /entrar com aviso.
        if (!isPublic) {
          await supabase.auth.signOut()
          const url = request.nextUrl.clone()
          url.pathname = "/entrar"
          url.searchParams.set("reason", "session_expired")
          return NextResponse.redirect(url)
        }
        // Em /entrar sem company e sem marker: deixa passar normalmente
        // (login vai criar nova sessão; se o user ainda não tem company
        // após login, o redirect (b)/(c) será reavaliado).
      }
    } else {
      // (d) Autenticado e com company.
      if (pathname === "/entrar" || isOnboarding) {
        const url = request.nextUrl.clone()
        url.pathname = "/visao-geral"
        return NextResponse.redirect(url)
      }
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
