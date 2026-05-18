/**
 * useActiveCompany — empresa ativa do usuário logado.
 *
 * HOJE (CP#03): retorna a PRIMEIRA empresa do usuário (companies_users JOIN
 * companies, order by created_at ascending). Suficiente para 1 piloto.
 * AMANHÃ: cookie httpOnly "cfoup_active_company" que o usuário troca via
 * switcher na sidebar. Server actions já leem desse cookie quando for criado.
 *
 * Devolve role da membership também — UI condicional por perfil.
 */

"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type CompanyRow = Database["public"]["Tables"]["companies"]["Row"]
type Role = "admin" | "operacional" | "contador" | "leitura"

export type ActiveCompany = {
  id: string
  name: string
  shortName: string
  cnpj: string
  regime: string | null
  role: Role | null
  loading: boolean
  empty: boolean
}

const EMPTY: ActiveCompany = {
  id: "",
  name: "—",
  shortName: "—",
  cnpj: "",
  regime: null,
  role: null,
  loading: true,
  empty: true,
}

export function useActiveCompany(): ActiveCompany {
  const supabase = useMemo(() => createClient(), [])
  const [state, setState] = useState<ActiveCompany>(EMPTY)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData.user?.id
      if (!userId) {
        if (!cancelled) setState({ ...EMPTY, loading: false })
        return
      }

      // companies_users → companies (join via FK). Primeiro registro do user.
      // Nota: dependendo da versão do supabase-js, a relação FK m:1 pode vir
      // inferida como objeto OU como array. Tratamos os dois.
      const { data, error } = await supabase
        .from("companies_users")
        .select(
          `role,
           companies (
             id,
             name,
             short_name,
             cnpj,
             regime,
             created_at
           )`,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()

      if (cancelled) return

      if (error || !data) {
        setState({ ...EMPTY, loading: false })
        return
      }

      const companyRaw = data.companies as CompanyRow | CompanyRow[] | null
      const company: CompanyRow | null = Array.isArray(companyRaw)
        ? (companyRaw[0] ?? null)
        : companyRaw

      if (!company) {
        setState({ ...EMPTY, loading: false })
        return
      }

      setState({
        id: company.id,
        name: company.name,
        shortName: company.short_name ?? company.name,
        cnpj: company.cnpj,
        regime: company.regime,
        role: data.role as Role,
        loading: false,
        empty: false,
      })
    }

    load()

    const { data: sub } = supabase.auth.onAuthStateChange(() => load())
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  return state
}
