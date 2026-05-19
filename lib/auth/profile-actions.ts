// =============================================================
// CFOup · Server Actions do perfil da empresa (CP#03.5)
// =============================================================
// - updateCompanyProfileAction: UPDATE em companies da empresa ativa.
//   Apenas role admin pode persistir (RLS já garante; checagem
//   adicional aqui retorna mensagem mais clara em caso de denial).
//
// - importCnpjCardAction: recebe PDF do Cartão CNPJ, extrai campos
//   via parser, retorna shape para autofill do formulário.
//   NÃO PERSISTE — fluxo é autofill → user revisa → user clica Salvar
//   (decisão D2 do CP#03.5).
//
// Sem service_role, sem SECURITY DEFINER, sem RPC, sem bypass de RLS.
// =============================================================
"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { TablesUpdate } from "@/lib/database.types"
import { extractCnpjCardFields, type CnpjCardFields } from "@/lib/cnpj-card/parser"
import { resolveActiveCompany } from "@/lib/auth/active-company"

const REGIMES_VALIDOS = new Set([
  "simples_nacional",
  "lucro_presumido",
  "lucro_real",
  "mei",
])

const MAX_PDF_BYTES = 5 * 1024 * 1024 // 5 MB

export type ProfileSaveState = {
  ok: boolean
  error?: string
  savedAt?: string
}

export type ImportCnpjState = {
  ok: boolean
  error?: string
  fields?: CnpjCardFields
  fileName?: string
  importedAt?: string
}

// ----- helpers ------------------------------------------------

/**
 * Lê um campo do FormData e classifica:
 *   - undefined: chave não foi enviada (não atualizar)
 *   - null:      chave enviada vazia (setar NULL no DB)
 *   - string:    valor real (trim aplicado)
 */
function readField(formData: FormData, key: string): string | null | undefined {
  if (!formData.has(key)) return undefined
  const v = formData.get(key)
  if (typeof v !== "string") return undefined
  const trimmed = v.trim()
  return trimmed === "" ? null : trimmed
}

// ----- updateCompanyProfileAction -----------------------------

export async function updateCompanyProfileAction(
  _prev: ProfileSaveState | undefined,
  formData: FormData,
): Promise<ProfileSaveState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar")

  const membership = await resolveActiveCompany(supabase, user.id)
  if (!membership) {
    return { ok: false, error: "Empresa ativa não encontrada." }
  }
  if (membership.role !== "admin") {
    return {
      ok: false,
      error: "Apenas o administrador da empresa pode editar o perfil.",
    }
  }

  // Validação de regime (CHECK constraint do schema)
  const regime = readField(formData, "regime")
  if (regime !== undefined && regime !== null && !REGIMES_VALIDOS.has(regime)) {
    return { ok: false, error: "Regime tributário inválido." }
  }

  // Validação de name (NOT NULL no schema)
  const name = readField(formData, "name")
  if (name === null) {
    return { ok: false, error: "Razão social não pode ser vazia." }
  }

  // Validação básica de CNPJ se enviado
  const cnpj = readField(formData, "cnpj")
  if (typeof cnpj === "string") {
    const digits = cnpj.replace(/\D/g, "")
    if (digits.length !== 14) {
      return { ok: false, error: "CNPJ deve ter 14 dígitos." }
    }
  }

  // Construir payload — só inclui chaves que foram efetivamente enviadas.
  // undefined → omitido (não toca); null → SET NULL; string → SET valor.
  const payload: TablesUpdate<"companies"> = {}
  const EDITABLE_FIELDS = [
    "name",
    "short_name",
    "cnpj",
    "regime",
    "telefone",
    "email",
    "contato_responsavel",
    "endereco_completo",
    "cnae_principal_codigo",
    "cnae_principal_descricao",
    "porte",
    "situacao_cadastral",
    "data_situacao_cadastral",
    "data_abertura",
    "cartao_cnpj_imported_at",
    "cartao_cnpj_file_name",
  ] as const

  for (const key of EDITABLE_FIELDS) {
    const v = readField(formData, key)
    if (v !== undefined) {
      ;(payload as Record<string, string | null>)[key] = v
    }
  }

  const { error } = await supabase
    .from("companies")
    .update(payload)
    .eq("id", membership.companyId)

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Já existe outra empresa cadastrada com este CNPJ." }
    }
    return { ok: false, error: error.message }
  }

  revalidatePath("/", "layout")
  return { ok: true, savedAt: new Date().toISOString() }
}

// ----- importCnpjCardAction -----------------------------------

export async function importCnpjCardAction(
  _prev: ImportCnpjState | undefined,
  formData: FormData,
): Promise<ImportCnpjState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar")

  // Mesmo gate de admin (importação é parte do perfil)
  const membership = await resolveActiveCompany(supabase, user.id)
  if (!membership) return { ok: false, error: "Empresa ativa não encontrada." }
  if (membership.role !== "admin") {
    return { ok: false, error: "Apenas o administrador pode importar Cartão CNPJ." }
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return { ok: false, error: "Arquivo ausente." }
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, error: "Envie um PDF do Cartão CNPJ." }
  }
  if (file.size === 0) {
    return { ok: false, error: "PDF vazio." }
  }
  if (file.size > MAX_PDF_BYTES) {
    return { ok: false, error: "PDF excede 5 MB." }
  }

  let fields: CnpjCardFields
  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    fields = await extractCnpjCardFields(bytes)
  } catch {
    return { ok: false, error: "Não foi possível ler o PDF. Tente outro arquivo." }
  }

  // Sanity: se nem CNPJ nem nome empresarial saíram, provavelmente não é
  // um Cartão CNPJ da RFB.
  if (!fields.cnpj && !fields.nomeEmpresarial) {
    return {
      ok: false,
      error: "Este PDF não parece ser um Cartão CNPJ da Receita Federal.",
    }
  }

  return {
    ok: true,
    fields,
    fileName: file.name,
    importedAt: new Date().toISOString(),
  }
}
