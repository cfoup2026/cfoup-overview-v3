/**
 * useCompanyProfile — perfil completo da empresa ativa, do DB.
 *
 * Usado pela página /configuracoes (bloco "Perfil da empresa") para
 * substituir o fixture estática do useConfiguracoesData. Os outros 4
 * blocos (metas/alertas/relatórios/segurança) continuam usando o
 * useConfiguracoesData como antes — decisão D3 do CP#03.5.
 *
 * Reage a onAuthStateChange para refletir login/logout.
 */

"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Tables } from "@/lib/database.types"

export type CompanyProfile = Tables<"companies">

export type UseCompanyProfileReturn = {
  /** Empresa ativa ou null se ainda carregando/inexistente. */
  company: CompanyProfile | null
  /** True na primeira carga e durante refresh. */
  loading: boolean
  /** Erro, se houver. */
  error: string | null
  /** Re-fetch manual após mutação (ex.: depois de Salvar). */
  refresh: () => Promise<void>
}

export function useCompanyProfile(): UseCompanyProfileReturn {
  const supabase = useMemo(() => createClient(), [])
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setCompany(null)
        return
      }

      // Primeira empresa do user (regra do useActiveCompany).
      const { data: membership, error: memErr } = await supabase
        .from("companies_users")
        .select("company_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()

      if (memErr || !membership) {
        setCompany(null)
        return
      }

      const { data: companyRow, error: companyErr } = await supabase
        .from("companies")
        .select("*")
        .eq("id", membership.company_id)
        .single()

      if (companyErr) {
        setError(companyErr.message)
        setCompany(null)
        return
      }

      setCompany(companyRow as CompanyProfile)
    } catch (e) {
      setError((e as Error).message)
      setCompany(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    let cancelled = false
    load()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      if (!cancelled) load()
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [supabase, load])

  return { company, loading, error, refresh: load }
}
