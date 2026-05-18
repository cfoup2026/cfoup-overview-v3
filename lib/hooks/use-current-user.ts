/**
 * useCurrentUser — identidade do usuário logado via Supabase Auth.
 *
 * HOJE (CP#03): lê de supabase.auth.getUser() + public.users (perfil).
 * ANTES (mock): lia de localStorage gravado pela tela /entrar.
 *
 * Único ponto de verdade para "quem está usando o app agora".
 * Usado pela saudação da Visão Geral, pelo rodapé da sidebar,
 * e por qualquer outro lugar que precise do nome/email.
 *
 * Renderiza GUEST até o primeiro fetch terminar — components que precisam
 * de loading state podem ver `loading: true`. Reage a onAuthStateChange.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type CurrentUser = {
  id: string
  name: string
  email: string
  initial: string
  role: string
  loading: boolean
}

const GUEST: CurrentUser = {
  id: "",
  name: "Convidado",
  email: "",
  initial: "—",
  role: "Visitante",
  loading: true,
}

function deriveName(email: string): string {
  if (!email) return GUEST.name
  const local = email.split("@")[0] || ""
  const first = local.split(/[._-]/)[0] || local
  if (!first) return GUEST.name
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

export function useCurrentUser(): CurrentUser {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<CurrentUser>(GUEST)

  useEffect(() => {
    let cancelled = false

    async function load(authUserId: string | null, authEmail: string | null) {
      if (!authUserId) {
        if (!cancelled) setUser({ ...GUEST, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from("users")
        .select("id, email, full_name")
        .eq("id", authUserId)
        .maybeSingle()

      if (cancelled) return

      const email = profile?.email ?? authEmail ?? ""
      const name = profile?.full_name?.trim() || deriveName(email)
      setUser({
        id: authUserId,
        email,
        name: name || GUEST.name,
        initial: (name || email || "—").charAt(0).toUpperCase(),
        // role real (admin/operacional/contador/leitura) vive em companies_users
        // e depende da empresa ativa — useActiveCompany devolve.
        role: "Membro",
        loading: false,
      })
    }

    supabase.auth.getUser().then(({ data }) => {
      load(data.user?.id ?? null, data.user?.email ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user?.id ?? null, session?.user?.email ?? null)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  return user
}
