// =============================================================
// CFOup · Server Action de importação de extrato CEF (CP#04)
// =============================================================
// Wrapper "use server" sobre runCefImport (lib/cef/import-core.ts):
// resolve o client autenticado, faz o gate de admin e revalida o cache.
// A lógica de ingestão vive em import-core.ts — testável fora do Next.
// =============================================================
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { resolveActiveCompany } from "@/lib/auth/active-company"
import { runCefImport, type ImportCefState } from "@/lib/cef/import-core"
import { createClient } from "@/lib/supabase/server"

export async function importCefAction(
  _prev: ImportCefState | undefined,
  formData: FormData,
): Promise<ImportCefState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/entrar")

  const membership = await resolveActiveCompany(supabase, user.id)
  if (!membership) return { ok: false, error: "Empresa ativa não encontrada." }
  if (membership.role !== "admin") {
    return {
      ok: false,
      error: "Apenas o administrador da empresa pode importar extratos.",
    }
  }

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File)
  // bankAccountId (opcional): UUID de uma bank_accounts escolhida no upload.
  const bankAccountIdRaw = formData.get("bankAccountId")
  const bankAccountId =
    typeof bankAccountIdRaw === "string" && bankAccountIdRaw.trim() !== ""
      ? bankAccountIdRaw.trim()
      : undefined
  const result = await runCefImport(
    supabase,
    membership.companyId,
    user.id,
    files,
    bankAccountId,
  )
  revalidatePath("/", "layout")
  return result
}
