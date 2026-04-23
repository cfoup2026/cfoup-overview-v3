/**
 * useCurrentUser — identidade do usuário logado.
 *
 * HOJE: lê do localStorage (o que a tela /entrar gravou).
 * AMANHÃ: lerá do Supabase Auth (session.user).
 *
 * Único ponto de verdade para "quem está usando o app agora".
 * Usado pela saudação da Visão Geral, pelo rodapé da sidebar,
 * e por qualquer outro lugar que precise do nome/email.
 */

"use client"

import { useEffect, useState } from "react"

export type CurrentUser = {
  name: string
  email: string
  initial: string
  role: string
}

const GUEST: CurrentUser = {
  name: "Convidado",
  email: "",
  initial: "—",
  role: "Visitante",
}

function deriveName(email: string): string {
  if (!email) return GUEST.name
  // pega a parte antes do @ e transforma "ronaldo.santos" em "Ronaldo"
  const local = email.split("@")[0] || ""
  const first = local.split(/[._-]/)[0] || local
  if (!first) return GUEST.name
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>(GUEST)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem("cfoup.currentUser")
      if (!raw) return
      const parsed = JSON.parse(raw) as { email?: string; name?: string; role?: string }
      const email = parsed.email?.trim() ?? ""
      const name = (parsed.name?.trim() || deriveName(email)).trim()
      if (!email && !name) return
      setUser({
        name: name || GUEST.name,
        email,
        initial: (name || email || "—").charAt(0).toUpperCase(),
        role: parsed.role?.trim() || "Admin",
      })
    } catch {
      // ignora — mantém guest
    }
  }, [])

  return user
}
