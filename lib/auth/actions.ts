// =============================================================
// CFOup · Server Actions de Auth
// =============================================================
// Actions usadas pelas pages /entrar e /onboarding.
// Padrão: form action → Server Action → supabase.auth → redirect.
//
// Erros voltam como string serializável via prevState (useActionState).
// Sucesso dispara redirect server-side (lança NEXT_REDIRECT).
// =============================================================
"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type AuthState = {
  ok: boolean
  error?: string
}

const EMPTY_OK: AuthState = { ok: true }

// ----- signIn -------------------------------------------------
export async function signInAction(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const next = String(formData.get("next") ?? "/visao-geral")

  if (!email || !password) {
    return { ok: false, error: "Preencha e-mail e senha." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { ok: false, error: traduzErroAuth(error.message) }
  }

  revalidatePath("/", "layout")
  redirect(next || "/visao-geral")
}

// ----- signUp -------------------------------------------------
export async function signUpAction(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const fullName = String(formData.get("full_name") ?? "").trim() || null

  if (!email || !password) {
    return { ok: false, error: "Preencha e-mail e senha." }
  }
  if (password.length < 8) {
    return { ok: false, error: "Senha precisa ter pelo menos 8 caracteres." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    return { ok: false, error: traduzErroAuth(error.message) }
  }

  // Confirm email está DESLIGADO no projeto (dívida técnica do CP#03).
  // Logo, o signUp já cria a sessão. Middleware redireciona para /onboarding.
  revalidatePath("/", "layout")
  redirect("/onboarding")
}

// ----- signOut ------------------------------------------------
export async function signOutAction(): Promise<AuthState> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/entrar")
}

// ----- resetPassword (envia magic link de recuperação) --------
export async function resetPasswordAction(
  _prev: AuthState | undefined,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) return { ok: false, error: "Preencha o e-mail." }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) return { ok: false, error: traduzErroAuth(error.message) }
  return EMPTY_OK
}

// ----- helper: tradução de mensagens comuns -------------------
function traduzErroAuth(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos."
  if (m.includes("email not confirmed")) return "Confirme o e-mail antes de entrar."
  if (m.includes("user already registered")) return "Já existe conta com este e-mail."
  if (m.includes("password should be at least")) return "Senha precisa ter pelo menos 8 caracteres."
  if (m.includes("rate limit")) return "Muitas tentativas. Aguarde alguns minutos."
  return msg
}
