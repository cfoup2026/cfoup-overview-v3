// =============================================================
// CFOup · Server Action de importação de extrato CEF (CP#04)
// =============================================================
// Recebe um lote (1+ arquivos) de extrato bancário CEF, .txt e/ou .pdf:
//   - .txt → parseCEFTxt — fonte das movimentações.
//   - .pdf → parseCEFPdf — fonte de saldos (SALDO ANTERIOR/DIA) e datas;
//     lançamentos do PDF também são gravados, conforme o core extrair.
//
// Persiste, por arquivo: import_runs (idempotente por file_hash),
// bank_accounts (auto-criada, holder = nome da empresa), transactions e
// eventos_caixa. Saldo de abertura vai para bank_accounts; saldo final e
// cobertura voltam apenas no retorno da action (sem persistência — CP#04).
//
// Gate de admin. cfoup-core é a fonte única de parsing/adaptação CEF.
// =============================================================
"use server"

import { createHash } from "node:crypto"
import * as path from "node:path"
import { pathToFileURL } from "node:url"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"
import {
  BrazilCalendarPolicy,
  cefAdapter,
  parseCEFPdf,
  parseCEFTxt,
} from "cfoup-core"
import type {
  AdapterContext,
  BalanceSnapshot,
  EventoCaixa,
  Transaction,
} from "cfoup-core"

import { resolveActiveCompany } from "@/lib/auth/active-company"
import type { TablesInsert } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/server"

// -------------------------------------------------------------
// Worker pdfjs para runtime Node/Next server. parseCEFPdf (cfoup-core)
// chama getDocument sem configurar workerSrc; configuramos aqui, com a
// mesma abordagem de lib/cnpj-card/parser.ts (path absoluto literal →
// file:// URL, não interceptável pelo Turbopack). A eficácia depende de
// este pdfjs ser a mesma instância de módulo que o core resolve.
// -------------------------------------------------------------
try {
  const workerPath = path.join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.mjs",
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(pdfjs as any).GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href
} catch {
  // ambiente sem process.cwd / edge — deixa o default do pdfjs.
}

const MAX_FILE_BYTES = 15 * 1024 * 1024 // 15 MB por arquivo
const MAX_FILES = 30

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

export type CefFileResult = {
  fileName: string
  source: "cef-txt" | "cef-pdf"
  status: "imported" | "skipped" | "failed"
  rowsImported: number
  rowsSkipped: number
  error?: string
}

export type CefAccountResult = {
  accountNumber: string
  movimentacoes: number
  openingBalance: number | null
  openingBalanceDate: string | null
  closingBalance: number | null
  closingBalanceDate: string | null
  /** null quando não há saldos suficientes para calcular o drift. */
  driftOk: boolean | null
  coberturaSaldo: "completa" | "insuficiente"
}

export type ImportCefState = {
  ok: boolean
  error?: string
  arquivos?: CefFileResult[]
  contas?: CefAccountResult[]
  importedAt?: string
}

type AccountAccumulator = {
  bankAccountId: string
  movimentacoes: number
  /** Σ do valor com sinal (credit +, debit −). */
  signedSum: number
  balances: BalanceSnapshot[]
  /** Saldo veio de ao menos um PDF — sem isso, a abertura é não-confiável. */
  hasPdfBalances: boolean
}

type ProcessCtx = {
  supabase: SupabaseServerClient
  companyId: string
  userId: string
  holder: string
  accounts: Map<string, AccountAccumulator>
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// ----- importCefAction ----------------------------------------

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
  const companyId = membership.companyId

  // Nome da empresa — vira holder da bank_accounts auto-criada.
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("id", companyId)
    .maybeSingle()
  const holder = company?.name ?? "Titular não informado"

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File)
  if (files.length === 0) {
    return { ok: false, error: "Nenhum arquivo enviado." }
  }
  if (files.length > MAX_FILES) {
    return { ok: false, error: `Máximo de ${MAX_FILES} arquivos por lote.` }
  }

  const accounts = new Map<string, AccountAccumulator>()
  const ctx: ProcessCtx = { supabase, companyId, userId: user.id, holder, accounts }

  const arquivos: CefFileResult[] = []
  for (const file of files) {
    arquivos.push(await processFile(file, ctx))
  }

  // Agrega saldos por conta. O opening vai para bank_accounts; closing e
  // cobertura ficam só no retorno (decisão CP#04 — sem migration).
  const contas: CefAccountResult[] = []
  for (const [accountNumber, acc] of accounts) {
    const sorted = [...acc.balances].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    )
    const opening = sorted[0]
    const closing = sorted[sorted.length - 1]
    // Só PDF traz o SALDO ANTERIOR que ancora a abertura real do período;
    // um lote só de TXT não fecha caixa.
    const cobertura: "completa" | "insuficiente" = acc.hasPdfBalances
      ? "completa"
      : "insuficiente"

    let driftOk: boolean | null = null
    if (cobertura === "completa" && opening && closing && opening !== closing) {
      const esperado = closing.amount - opening.amount
      driftOk = Math.abs(acc.signedSum - esperado) < 0.01
    }

    if (cobertura === "completa" && opening) {
      await supabase
        .from("bank_accounts")
        .update({
          opening_balance_date: toISODate(opening.date),
          opening_balance_amount: opening.amount,
        })
        .eq("id", acc.bankAccountId)
    }

    const completa = cobertura === "completa"
    contas.push({
      accountNumber,
      movimentacoes: acc.movimentacoes,
      openingBalance: completa && opening ? opening.amount : null,
      openingBalanceDate: completa && opening ? toISODate(opening.date) : null,
      closingBalance: completa && closing ? closing.amount : null,
      closingBalanceDate: completa && closing ? toISODate(closing.date) : null,
      driftOk,
      coberturaSaldo: cobertura,
    })
  }

  revalidatePath("/", "layout")

  const ok = arquivos.some((a) => a.status !== "failed")
  return {
    ok,
    error: ok ? undefined : "Nenhum arquivo pôde ser importado.",
    arquivos,
    contas,
    importedAt: new Date().toISOString(),
  }
}

// ----- processamento por arquivo ------------------------------

async function processFile(
  file: File,
  ctx: ProcessCtx,
): Promise<CefFileResult> {
  const lower = file.name.toLowerCase()
  const isPdf = lower.endsWith(".pdf")
  const isTxt = lower.endsWith(".txt")
  const source: "cef-txt" | "cef-pdf" = isPdf ? "cef-pdf" : "cef-txt"
  const fail = (error: string): CefFileResult => ({
    fileName: file.name,
    source,
    status: "failed",
    rowsImported: 0,
    rowsSkipped: 0,
    error,
  })

  if (!isPdf && !isTxt) return fail("Extensão não suportada — use .txt ou .pdf.")
  if (file.size === 0) return fail("Arquivo vazio.")
  if (file.size > MAX_FILE_BYTES) return fail("Arquivo excede 15 MB.")

  const bytes = new Uint8Array(await file.arrayBuffer())
  const fileHash = createHash("sha256").update(bytes).digest("hex")

  // Guard de idempotência: run bem-sucedido com o mesmo hash → não reimporta.
  const { data: existingRun } = await ctx.supabase
    .from("import_runs")
    .select("id, status, rows_imported")
    .eq("company_id", ctx.companyId)
    .eq("source", source)
    .eq("file_hash", fileHash)
    .maybeSingle()

  if (existingRun?.status === "success") {
    return {
      fileName: file.name,
      source,
      status: "skipped",
      rowsImported: 0,
      rowsSkipped: existingRun.rows_imported,
    }
  }

  // Cria o run, ou reusa um anterior que falhou (o UNIQUE em
  // (company_id, source, file_hash) impede um segundo INSERT).
  let runId: string
  if (existingRun) {
    runId = existingRun.id
    await ctx.supabase
      .from("import_runs")
      .update({
        status: "running",
        error: null,
        started_at: new Date().toISOString(),
        finished_at: null,
      })
      .eq("id", existingRun.id)
  } else {
    const { data: run, error: runErr } = await ctx.supabase
      .from("import_runs")
      .insert({
        company_id: ctx.companyId,
        source,
        file_name: file.name,
        file_hash: fileHash,
        file_size: file.size,
        status: "running",
        created_by: ctx.userId,
      })
      .select("id")
      .single()
    if (runErr || !run) {
      return fail(runErr?.message ?? "Falha ao registrar a importação.")
    }
    runId = run.id
  }

  try {
    const parsed = isPdf
      ? await parseCEFPdf(bytes)
      : parseCEFTxt(new TextDecoder().decode(bytes))

    if (parsed.ok.length === 0) {
      const reason =
        parsed.errors[0]?.reason ?? "nenhuma movimentação reconhecida no arquivo"
      await failRun(ctx.supabase, runId, reason)
      return fail(reason)
    }

    // Prefixa o id do parser com o hash do arquivo: o id do core
    // ("cef-txt:42") só é único dentro de um arquivo, e extratos distintos
    // colidiriam em source_ref e no id determinístico do evento.
    const shortHash = fileHash.slice(0, 12)
    const txs: Transaction[] = parsed.ok.map((tx) => ({
      ...tx,
      id: `${shortHash}:${tx.id}`,
    }))

    if (txs.some((t) => t.accountId === "")) {
      const reason = "número da conta não identificado no extrato"
      await failRun(ctx.supabase, runId, reason)
      return fail(reason)
    }

    // valor 0 é rejeitado pelo CHECK de transactions e pelo cefAdapter.
    const validTxs = txs.filter((t) => t.amount > 0)
    const accountIds = [...new Set(validTxs.map((t) => t.accountId))]

    // Resolve (ou cria) a bank_accounts de cada conta presente no arquivo.
    const bankAccountIdByNumber = new Map<string, string>()
    for (const accId of accountIds) {
      bankAccountIdByNumber.set(
        accId,
        await resolveBankAccount(ctx.supabase, ctx.companyId, accId, ctx.holder),
      )
    }

    // transactions.
    const txRows: TablesInsert<"transactions">[] = []
    for (const tx of validTxs) {
      const bankAccountId = bankAccountIdByNumber.get(tx.accountId)
      if (bankAccountId === undefined) continue
      txRows.push({
        company_id: ctx.companyId,
        bank_account_id: bankAccountId,
        tx_date: toISODate(tx.date),
        doc_number: tx.docNumber.trim() === "" ? null : tx.docNumber,
        history: tx.history,
        amount: tx.amount,
        direction: tx.direction,
        running_balance: tx.balance ?? null,
        source,
        source_ref: tx.id,
        import_run_id: runId,
      })
    }

    let rowsImported = 0
    if (txRows.length > 0) {
      const { data: inserted, error: txErr } = await ctx.supabase
        .from("transactions")
        .upsert(txRows, {
          onConflict: "company_id,source,source_ref",
          ignoreDuplicates: true,
        })
        .select("id")
      if (txErr) {
        await failRun(ctx.supabase, runId, txErr.message)
        return fail(txErr.message)
      }
      rowsImported = inserted?.length ?? 0
    }
    const rowsSkipped = txs.length - rowsImported

    // eventos_caixa via cefAdapter (cfoup-core).
    const adapterCtx: AdapterContext = {
      cliente_id: ctx.companyId,
      legal_entity_id: ctx.companyId,
      calendar: new BrazilCalendarPolicy(),
    }
    if (accountIds[0] !== undefined) {
      adapterCtx.conta_bancaria_id = accountIds[0]
    }
    let eventos: EventoCaixa[]
    try {
      eventos = cefAdapter(
        { ok: validTxs, balances: parsed.balances },
        adapterCtx,
      ).eventos
    } catch (e) {
      const reason = e instanceof Error ? e.message : "falha ao adaptar eventos CEF"
      await failRun(ctx.supabase, runId, reason)
      return fail(reason)
    }

    const eventoRows = eventos.map((ev) =>
      eventoToRow(ev, ctx.companyId, ctx.userId),
    )
    if (eventoRows.length > 0) {
      const { error: evErr } = await ctx.supabase
        .from("eventos_caixa")
        .upsert(eventoRows, { onConflict: "id", ignoreDuplicates: true })
      if (evErr) {
        await failRun(ctx.supabase, runId, evErr.message)
        return fail(evErr.message)
      }
    }

    // Acumula por conta para o relatório de saldo do lote.
    for (const accId of accountIds) {
      const bankAccountId = bankAccountIdByNumber.get(accId)
      if (bankAccountId === undefined) continue
      const acc = ensureAccount(ctx.accounts, accId, bankAccountId)
      const daConta = validTxs.filter((t) => t.accountId === accId)
      acc.movimentacoes += daConta.length
      for (const t of daConta) {
        acc.signedSum += t.direction === "credit" ? t.amount : -t.amount
      }
      const saldosConta = parsed.balances.filter((b) => b.accountId === accId)
      acc.balances.push(...saldosConta)
      if (isPdf && saldosConta.length > 0) acc.hasPdfBalances = true
    }

    await ctx.supabase
      .from("import_runs")
      .update({
        status: "success",
        rows_imported: rowsImported,
        rows_skipped: rowsSkipped,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId)

    return {
      fileName: file.name,
      source,
      status: "imported",
      rowsImported,
      rowsSkipped,
    }
  } catch (e) {
    const reason = e instanceof Error ? e.message : "erro inesperado na importação"
    await failRun(ctx.supabase, runId, reason)
    return fail(reason)
  }
}

// ----- helpers ------------------------------------------------

async function failRun(
  supabase: SupabaseServerClient,
  runId: string,
  reason: string,
): Promise<void> {
  await supabase
    .from("import_runs")
    .update({
      status: "failed",
      error: reason,
      finished_at: new Date().toISOString(),
    })
    .eq("id", runId)
}

/**
 * Resolve a bank_accounts da conta CEF — busca por (company, bank, número)
 * e cria se não existir. O extrato CEF não traz titular; usa-se o nome da
 * empresa como holder (placeholder editável depois).
 */
async function resolveBankAccount(
  supabase: SupabaseServerClient,
  companyId: string,
  accountNumber: string,
  holder: string,
): Promise<string> {
  const { data: existing } = await supabase
    .from("bank_accounts")
    .select("id")
    .eq("company_id", companyId)
    .eq("bank", "CEF")
    .eq("account_number", accountNumber)
    .maybeSingle()
  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from("bank_accounts")
    .insert({
      company_id: companyId,
      bank: "CEF",
      account_number: accountNumber,
      account_type: "checking",
      holder,
    })
    .select("id")
    .single()
  if (error || !created) {
    throw new Error(
      `Falha ao criar a conta bancária ${accountNumber}: ${error?.message ?? "desconhecido"}`,
    )
  }
  return created.id
}

function ensureAccount(
  accounts: Map<string, AccountAccumulator>,
  accountNumber: string,
  bankAccountId: string,
): AccountAccumulator {
  let acc = accounts.get(accountNumber)
  if (acc === undefined) {
    acc = {
      bankAccountId,
      movimentacoes: 0,
      signedSum: 0,
      balances: [],
      hasPdfBalances: false,
    }
    accounts.set(accountNumber, acc)
  }
  return acc
}

/** Converte o EventoCaixa do cfoup-core numa linha de eventos_caixa. */
function eventoToRow(
  ev: EventoCaixa,
  companyId: string,
  userId: string,
): TablesInsert<"eventos_caixa"> {
  const row: TablesInsert<"eventos_caixa"> = {
    id: ev.id,
    company_id: companyId,
    legal_entity_id: ev.legal_entity_id,
    status: ev.status,
    valor: ev.valor,
    direcao: ev.direcao,
    data_esperada: toISODate(ev.data_esperada),
    bucket_id: ev.bucket_id,
    bucket_nome: ev.bucket_nome,
    origem: ev.origem,
    criticidade: ev.criticidade,
    confianca: ev.confianca,
    confianca_origem: ev.confianca_origem,
    is_transferencia: ev.is_transferencia,
    criado_em: ev.criado_em.toISOString(),
    // O EventoCaixa do core traz criado_por='sistema'; a coluna é FK para
    // users, então gravamos o usuário que fez o upload.
    criado_por: userId,
  }
  if (ev.status === "realizado") {
    row.data_realizada = toISODate(ev.data_realizada)
  }
  if (ev.origem_ref !== undefined) row.origem_ref = ev.origem_ref
  if (ev.documento_ref !== undefined) row.documento_ref = ev.documento_ref
  if (ev.descricao_origem !== undefined) {
    row.descricao_origem = ev.descricao_origem
  }
  return row
}
