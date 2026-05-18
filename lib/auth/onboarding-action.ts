// =============================================================
// CFOup · Server Action de Onboarding
// =============================================================
// Cria a primeira empresa do usuário e o vincula como admin.
// Disparado pelo form de /onboarding.
//
// Race-condition consideração: as policies do CP#02 permitem o INSERT
// em companies_users quando ainda não há admin para aquela company.
// Como acabamos de criar a company, isso é seguro mesmo com 2 abas.
// =============================================================
"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert } from "@/lib/database.types"

export type OnboardingState = {
  ok: boolean
  error?: string
}

const REGIMES = new Set(["simples_nacional", "lucro_presumido", "lucro_real", "mei"])

export async function createCompanyAction(
  _prev: OnboardingState | undefined,
  formData: FormData,
): Promise<OnboardingState> {
  const name = String(formData.get("name") ?? "").trim()
  const shortName = String(formData.get("short_name") ?? "").trim() || null
  const cnpjRaw = String(formData.get("cnpj") ?? "").replace(/\D/g, "")
  const regime = String(formData.get("regime") ?? "").trim()

  if (!name) return { ok: false, error: "Informe o nome da empresa." }
  if (cnpjRaw.length !== 14) return { ok: false, error: "CNPJ inválido (14 dígitos)." }
  if (regime && !REGIMES.has(regime)) return { ok: false, error: "Regime inválido." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/entrar")
  }

  // CNPJ formatado padrão: 00.000.000/0001-00
  const cnpj = `${cnpjRaw.slice(0, 2)}.${cnpjRaw.slice(2, 5)}.${cnpjRaw.slice(5, 8)}/${cnpjRaw.slice(8, 12)}-${cnpjRaw.slice(12, 14)}`

  // 1. INSERT companies — policy companies_insert_authenticated permite com created_by = auth.uid()
  const companyInsert: TablesInsert<"companies"> = {
    name,
    short_name: shortName,
    cnpj,
    regime: regime || null,
    created_by: user.id,
  }
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert(companyInsert)
    .select("id")
    .single()

  if (companyError || !company) {
    if (companyError?.code === "23505") {
      return { ok: false, error: "Já existe uma empresa cadastrada com este CNPJ." }
    }
    return { ok: false, error: companyError?.message ?? "Falha ao criar empresa." }
  }

  // 2. INSERT companies_users como admin — policy permite porque tabela ainda
  //    não tem nenhum admin para essa company (cláusula "first user").
  const membershipInsert: TablesInsert<"companies_users"> = {
    company_id: company.id,
    user_id: user.id,
    role: "admin",
  }
  const { error: membershipError } = await supabase
    .from("companies_users")
    .insert(membershipInsert)

  if (membershipError) {
    // Empresa criada mas membership falhou — estado inconsistente.
    // Por enquanto retorna erro e deixa o admin do CFOup limpar manualmente.
    // CP futuro: transação RPC server-side para atomicidade.
    return {
      ok: false,
      error: "Empresa criada mas vínculo de admin falhou. Avise o suporte.",
    }
  }

  revalidatePath("/", "layout")
  redirect("/visao-geral")
}
