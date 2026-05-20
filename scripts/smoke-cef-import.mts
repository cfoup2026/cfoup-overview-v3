/**
 * Smoke isolado do Passo 2 (CP#04) — importação de extrato CEF.
 *
 * Uso: pnpm tsx scripts/smoke-cef-import.mts
 *
 * Roda runCefImport (núcleo de importCefAction) autenticado como um user
 * admin real, com RLS ativo. Sequência: TXT → PDF → TXT de novo, para
 * validar ingestão e idempotência.
 *
 * Lê do .env.local (raiz do projeto): NEXT_PUBLIC_SUPABASE_URL,
 * NEXT_PUBLIC_SUPABASE_ANON_KEY, CFOUP_TEST_USER_EMAIL,
 * CFOUP_TEST_USER_PASSWORD. Nenhuma credencial é hardcoded no script.
 */
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import { runCefImport } from "../lib/cef/import-core"
import type { Database } from "../lib/database.types"

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, "..")

// Extratos CEF reais do cliente Gregorutt — fora do repositório.
const TXT_PATH =
  "C:\\CFOup_Organizado\\03_Dados_Cliente\\01_Gregorutt\\01_Bancos_CEF\\CEF_Mar25.txt"
const PDF_PATH =
  "C:\\CFOup_Organizado\\03_Dados_Cliente\\01_Gregorutt\\01_Bancos_CEF\\CEF Mar25 com Saldo.pdf"

function loadEnvLocal(): Record<string, string> {
  const raw = readFileSync(resolve(ROOT, ".env.local"), "utf-8")
  const env: Record<string, string> = {}
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (t === "" || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
  return env
}

function fileFromDisk(p: string): File {
  const bytes = new Uint8Array(readFileSync(p))
  const name = p.split(/[\\/]/).pop() ?? "arquivo"
  return new File([bytes], name)
}

function fmt(n: number | null): string {
  if (n === null) return "—"
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

async function runCenario(
  supabase: SupabaseClient<Database>,
  companyId: string,
  userId: string,
  label: string,
  files: File[],
): Promise<void> {
  console.log(`\n=== Cenário ${label} ===`)
  const result = await runCefImport(supabase, companyId, userId, files)
  console.log(`ok=${result.ok}${result.error ? ` · erro=${result.error}` : ""}`)
  for (const a of result.arquivos ?? []) {
    console.log(
      `  arquivo: ${a.fileName} [${a.source}] status=${a.status} ` +
        `rowsImported=${a.rowsImported} rowsSkipped=${a.rowsSkipped}` +
        (a.error ? ` · erro=${a.error}` : ""),
    )
    for (const w of a.warnings ?? []) {
      console.log(`    warning: ${w}`)
    }
  }
  for (const c of result.contas ?? []) {
    console.log(
      `  conta: ${c.accountNumber} · movimentações=${c.movimentacoes} · ` +
        `opening=${fmt(c.openingBalance)} closing=${fmt(c.closingBalance)} · ` +
        `drift=${c.driftOk === null ? "—" : c.driftOk} · ` +
        `cobertura=${c.coberturaSaldo}`,
    )
  }
}

async function printEstadoFinal(
  supabase: SupabaseClient<Database>,
): Promise<void> {
  console.log("\n=== Estado final do banco ===")
  const { data: runs } = await supabase
    .from("import_runs")
    .select("file_name, source, status, rows_imported, rows_skipped")
    .order("started_at", { ascending: true })
  for (const r of runs ?? []) {
    console.log(
      `  import_run: ${r.file_name} [${r.source}] ${r.status} ` +
        `rows_imported=${r.rows_imported} rows_skipped=${r.rows_skipped}`,
    )
  }
  const tabelas = [
    "import_runs",
    "transactions",
    "eventos_caixa",
    "bank_accounts",
  ] as const
  for (const tabela of tabelas) {
    const { count } = await supabase
      .from(tabela)
      .select("*", { count: "exact", head: true })
    console.log(`  ${tabela}: ${count ?? "?"} linhas`)
  }
}

async function main(): Promise<void> {
  const env = loadEnvLocal()
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const email = env.CFOUP_TEST_USER_EMAIL
  const password = env.CFOUP_TEST_USER_PASSWORD
  if (!url || !anonKey || !email || !password) {
    throw new Error(
      "Faltam variáveis no .env.local: NEXT_PUBLIC_SUPABASE_URL, " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY, CFOUP_TEST_USER_EMAIL, " +
        "CFOUP_TEST_USER_PASSWORD",
    )
  }

  // autoRefreshToken/persistSession off: script Node sem storage e sem
  // timer pendente — o processo encerra limpo após o smoke.
  const supabase = createClient<Database>(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: auth, error: authErr } =
    await supabase.auth.signInWithPassword({ email, password })
  if (authErr || !auth.user) {
    throw new Error(`Falha no login: ${authErr?.message ?? "usuário nulo"}`)
  }
  console.log(`Autenticado: ${email}`)

  // Resolve a empresa ativa (mesma regra de lib/auth/active-company.ts).
  const { data: membership } = await supabase
    .from("companies_users")
    .select("company_id, role")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (!membership) {
    throw new Error("Empresa ativa não encontrada para o usuário.")
  }
  console.log(
    `Empresa ativa: ${membership.company_id} (role=${membership.role})`,
  )
  const companyId = membership.company_id
  const userId = auth.user.id

  // Smoke completo: TXT → PDF (auto-resolução de conta) → idempotência.
  await runCenario(supabase, companyId, userId, "1 · TXT", [
    fileFromDisk(TXT_PATH),
  ])
  await runCenario(supabase, companyId, userId, "2 · PDF (auto-resolução)", [
    fileFromDisk(PDF_PATH),
  ])
  await runCenario(
    supabase,
    companyId,
    userId,
    "3 · TXT de novo (idempotência)",
    [fileFromDisk(TXT_PATH)],
  )
  await runCenario(
    supabase,
    companyId,
    userId,
    "4 · PDF de novo (idempotência)",
    [fileFromDisk(PDF_PATH)],
  )

  await printEstadoFinal(supabase)
}

main()
  .then(() => {
    process.exitCode = 0
  })
  .catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : err)
    process.exitCode = 1
  })
