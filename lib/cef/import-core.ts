// =============================================================
// CFOup · Núcleo da importação de extrato CEF (CP#04)
// =============================================================
// runCefImport — toda a lógica de ingestão de extrato CEF, isolada do
// runtime do Next (sem "use server", sem cookies/auth). Recebe um
// SupabaseClient já autenticado. Consumido por:
//   - lib/cef/import-action.ts (server action — wrapper com auth/gate);
//   - scripts/smoke-cef-import.mts (smoke isolado).
//
// Aceita lote misto TXT/PDF — o formato é detectado pelo CONTEÚDO do
// arquivo (assinatura %PDF-), nunca pela extensão/nome. A UI usa
// single-file; o array fica pronto para o lote real do CP#04c. Por
// arquivo: import_runs
// (idempotente por file_hash), bank_accounts, transactions e
// eventos_caixa via upsert. Saldo de abertura → bank_accounts; saldo
// final e cobertura → retorno (sem persistência, decisão CP#04).
//
// Resolução de conta — o TXT traz o número da conta; o PDF não. A conta
// de cada arquivo é resolvida por: bankAccountId informado / extraída do
// arquivo / única conta CEF da empresa. Ver resolveContaArquivo.
// =============================================================

import { createHash } from "node:crypto"
import * as path from "node:path"
import { pathToFileURL } from "node:url"

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
import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database, TablesInsert } from "../database.types"

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
const BANK_CEF = "CEF"

type SupabaseServerClient = SupabaseClient<Database>

export type CefFileResult = {
  fileName: string
  source: "cef-txt" | "cef-pdf"
  status: "imported" | "skipped" | "failed"
  rowsImported: number
  rowsSkipped: number
  /** Avisos não-bloqueantes (ex.: conflito de conta TXT vs bankAccountId). */
  warnings?: string[]
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
  /** Todos os snapshots de saldo agregados — usados para o fechamento. */
  balances: BalanceSnapshot[]
  /** Abertura derivada do(s) PDF(s) do lote; null se não há PDF. O TXT
   *  só traz SALDO DIA (fim de dia) e não ancora a abertura do período. */
  derivedOpening: { amount: number; date: Date } | null
}

type ProcessCtx = {
  supabase: SupabaseServerClient
  companyId: string
  userId: string
  holder: string
  /** UUID de bank_accounts informado no upload; sobrescreve a conta do arquivo. */
  bankAccountId: string | undefined
  accounts: Map<string, AccountAccumulator>
}

type ContaResolvida = {
  bankAccountId: string
  accountNumber: string
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * Detecta o formato pelo CONTEÚDO do arquivo: a assinatura "%PDF-" no
 * início identifica um PDF; qualquer outro conteúdo é tratado como TXT.
 * A extensão/nome do arquivo nunca participa — o nome é só metadata.
 *
 * TODO [CP futuro]: detectar tipos binários não suportados (PNG, JPEG,
 * ZIP, DOC — via magic bytes) e devolver "arquivo binário não
 * suportado" antes de cair no parser TXT. Hoje um PNG vira "conteúdo
 * não reconhecido como extrato CEF", o que confunde o usuário.
 */
function hasPdfSignature(bytes: Uint8Array): boolean {
  // "%PDF-" = 0x25 0x50 0x44 0x46 0x2D
  const sig = [0x25, 0x50, 0x44, 0x46, 0x2d]
  if (bytes.length < sig.length) return false
  return sig.every((b, i) => bytes[i] === b)
}

/**
 * Deriva o saldo de abertura de um extrato CEF a partir do parse. O PDF
 * intercala cada transação com o saldo logo após ela — o primeiro saldo
 * do documento é o estado PÓS-1ª-transação, não a abertura. Descontamos
 * a 1ª transação assinada para chegar à abertura real.
 *
 * TODO [validação]: o ramo "1º saldo datado antes da 1ª transação"
 * (extrato PDF com linha SALDO ANTERIOR explícita) não tem fixture de
 * teste — o PDF do piloto Gregorutt não traz SALDO ANTERIOR. Revalidar
 * quando aparecer um PDF nesse formato.
 */
function deriveOpening(
  ok: readonly Transaction[],
  balances: readonly BalanceSnapshot[],
): { amount: number; date: Date } | null {
  const firstTx = ok[0]
  const firstBal = balances[0]
  if (firstTx === undefined || firstBal === undefined) return null
  if (firstBal.date.getTime() < firstTx.date.getTime()) {
    // SALDO ANTERIOR explícito — o próprio saldo já é a abertura.
    return { amount: firstBal.amount, date: firstBal.date }
  }
  // 1º saldo é pós-1ª-transação — desconta a transação assinada.
  const signed =
    firstTx.direction === "credit" ? firstTx.amount : -firstTx.amount
  return { amount: firstBal.amount - signed, date: firstTx.date }
}

// ----- runCefImport -------------------------------------------

/**
 * Ingere um lote de extratos CEF para a empresa indicada. O caller é
 * responsável por autenticar e autorizar (gate de admin) antes de chamar.
 *
 * `bankAccountId` (opcional): UUID de uma bank_accounts CEF da empresa.
 * Quando informado, todos os arquivos do lote são associados a essa
 * conta — e divergência vs. a conta extraída de um TXT vira warning.
 */
export async function runCefImport(
  supabase: SupabaseServerClient,
  companyId: string,
  userId: string,
  files: File[],
  bankAccountId?: string,
): Promise<ImportCefState> {
  if (files.length === 0) {
    return { ok: false, error: "Nenhum arquivo enviado." }
  }
  if (files.length > MAX_FILES) {
    return { ok: false, error: `Máximo de ${MAX_FILES} arquivos por lote.` }
  }

  // Nome da empresa — vira holder da bank_accounts auto-criada.
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("id", companyId)
    .maybeSingle()
  const holder = company?.name ?? "Titular não informado"

  const accounts = new Map<string, AccountAccumulator>()
  const ctx: ProcessCtx = {
    supabase,
    companyId,
    userId,
    holder,
    bankAccountId,
    accounts,
  }

  const arquivos: CefFileResult[] = []
  for (const file of files) {
    arquivos.push(await processFile(file, ctx))
  }

  // Agrega saldos por conta. O opening vai para bank_accounts; closing e
  // cobertura ficam só no retorno (decisão CP#04 — sem migration).
  const contas: CefAccountResult[] = []
  for (const [accountNumber, acc] of accounts) {
    // closing = último saldo conhecido (maior data).
    const sorted = [...acc.balances].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    )
    const closing = sorted[sorted.length - 1]
    // opening = abertura derivada do PDF (descontada a 1ª transação).
    // Sem PDF não há abertura confiável — o caixa não fecha.
    const opening = acc.derivedOpening

    let driftOk: boolean | null = null
    if (opening !== null && closing !== undefined) {
      const esperado = closing.amount - opening.amount
      driftOk = Math.abs(acc.signedSum - esperado) < 0.01
    }

    if (opening !== null) {
      await supabase
        .from("bank_accounts")
        .update({
          opening_balance_date: toISODate(opening.date),
          opening_balance_amount: opening.amount,
        })
        .eq("id", acc.bankAccountId)
    }

    contas.push({
      accountNumber,
      movimentacoes: acc.movimentacoes,
      openingBalance: opening !== null ? opening.amount : null,
      openingBalanceDate: opening !== null ? toISODate(opening.date) : null,
      closingBalance:
        opening !== null && closing !== undefined ? closing.amount : null,
      closingBalanceDate:
        opening !== null && closing !== undefined
          ? toISODate(closing.date)
          : null,
      driftOk,
      coberturaSaldo: opening !== null ? "completa" : "insuficiente",
    })
  }

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
  const warnings: string[] = []
  // O formato é decidido pelo conteúdo (ver hasPdfSignature); até a
  // leitura dos bytes, source é só um rótulo provisório para os erros
  // de tamanho.
  let source: "cef-txt" | "cef-pdf" = "cef-txt"
  const fail = (error: string): CefFileResult => ({
    fileName: file.name,
    source,
    status: "failed",
    rowsImported: 0,
    rowsSkipped: 0,
    ...(warnings.length > 0 ? { warnings } : {}),
    error,
  })

  if (file.size === 0) return fail("Arquivo vazio.")
  if (file.size > MAX_FILE_BYTES) return fail("Arquivo excede 15 MB.")

  const bytes = new Uint8Array(await file.arrayBuffer())
  const isPdf = hasPdfSignature(bytes)
  source = isPdf ? "cef-pdf" : "cef-txt"
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
        // file_name é só metadata/auditoria — não participa de validação
        // nem de roteamento de parser (o formato vem do conteúdo).
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
      // Erro de CONTEÚDO: o arquivo não casa o layout de extrato CEF.
      // Hoje só CEF é suportado; outros formatos virão. A mensagem
      // nunca menciona nome/extensão do arquivo.
      const reason =
        "Por enquanto só extratos CEF (Caixa Econômica Federal). Outros tipos de arquivo virão."
      await failRun(ctx.supabase, runId, reason)
      return fail(reason)
    }

    // Prefixa o id do parser com o hash do arquivo: o id do core
    // ("cef-txt:42") só é único dentro de um arquivo, e extratos distintos
    // colidiriam em source_ref e na chave de idempotência do evento.
    const shortHash = fileHash.slice(0, 12)
    const txs: Transaction[] = parsed.ok.map((tx) => ({
      ...tx,
      id: `${shortHash}:${tx.id}`,
    }))

    // Resolve a conta-alvo do arquivo (bankAccountId / extraída / única CEF).
    const conta = await resolveContaArquivo(ctx, txs, warnings)
    if (typeof conta === "string") {
      await failRun(ctx.supabase, runId, conta)
      return fail(conta)
    }

    // Uniformiza accountId: o PDF vem vazio; o TXT pode ser sobrescrito
    // por bankAccountId. Tudo passa a referir a conta resolvida.
    const txsConta: Transaction[] = txs.map((t) => ({
      ...t,
      accountId: conta.accountNumber,
    }))
    const balancesConta: BalanceSnapshot[] = parsed.balances.map((b) => ({
      ...b,
      accountId: conta.accountNumber,
    }))

    // valor 0 é rejeitado pelo CHECK de transactions e pelo cefAdapter.
    const validTxs = txsConta.filter((t) => t.amount > 0)

    // transactions.
    const txRows: TablesInsert<"transactions">[] = validTxs.map((tx) => ({
      company_id: ctx.companyId,
      bank_account_id: conta.bankAccountId,
      tx_date: toISODate(tx.date),
      doc_number: tx.docNumber.trim() === "" ? null : tx.docNumber,
      history: tx.history,
      amount: tx.amount,
      direction: tx.direction,
      running_balance: tx.balance ?? null,
      source,
      source_ref: tx.id,
      import_run_id: runId,
    }))

    let rowsImported = 0
    if (txRows.length > 0) {
      // O UNIQUE de transactions é (company_id, source, source_ref) e
      // inclui `source` — logo cef-txt e cef-pdf do mesmo período não
      // conflitam entre si: importar o mesmo mês em TXT e em PDF duplica
      // as movimentações. Dedup cross-formato fica para o CP#04c.
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
    const rowsSkipped = txsConta.length - rowsImported

    // eventos_caixa via cefAdapter (cfoup-core).
    const adapterCtx: AdapterContext = {
      cliente_id: ctx.companyId,
      legal_entity_id: ctx.companyId,
      calendar: new BrazilCalendarPolicy(),
      conta_bancaria_id: conta.accountNumber,
    }
    let eventos: EventoCaixa[]
    try {
      eventos = cefAdapter(
        { ok: validTxs, balances: balancesConta },
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
        .upsert(eventoRows, {
          onConflict: "company_id,origem,origem_ref",
          ignoreDuplicates: true,
        })
      if (evErr) {
        await failRun(ctx.supabase, runId, evErr.message)
        return fail(evErr.message)
      }
    }

    // Acumula na conta para o relatório de saldo do lote.
    const acc = ensureAccount(
      ctx.accounts,
      conta.accountNumber,
      conta.bankAccountId,
    )
    acc.movimentacoes += validTxs.length
    for (const t of validTxs) {
      acc.signedSum += t.direction === "credit" ? t.amount : -t.amount
    }
    acc.balances.push(...balancesConta)
    // A abertura confiável vem do PDF (saldos intercalados pós-transação);
    // guarda a de menor data entre os PDFs do lote.
    if (isPdf) {
      const abertura = deriveOpening(txsConta, balancesConta)
      if (
        abertura !== null &&
        (acc.derivedOpening === null ||
          abertura.date.getTime() < acc.derivedOpening.date.getTime())
      ) {
        acc.derivedOpening = abertura
      }
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
      ...(warnings.length > 0 ? { warnings } : {}),
    }
  } catch (e) {
    const reason = e instanceof Error ? e.message : "erro inesperado na importação"
    await failRun(ctx.supabase, runId, reason)
    return fail(reason)
  }
}

// ----- resolução de conta -------------------------------------

/**
 * Resolve a conta-alvo de um arquivo. Retorna `ContaResolvida` ou, em
 * caso de erro, uma string com o motivo (para o caller falhar o arquivo).
 *
 * Ordem: bankAccountId informado > conta extraída do arquivo (TXT) >
 * única conta CEF da empresa (PDF sem conta). Conflito entre a conta do
 * TXT e o bankAccountId vira warning — o dado do extrato nunca é
 * sobrescrito em silêncio.
 */
async function resolveContaArquivo(
  ctx: ProcessCtx,
  txs: readonly Transaction[],
  warnings: string[],
): Promise<ContaResolvida | string> {
  const extraidas = [...new Set(txs.map((t) => t.accountId).filter((a) => a !== ""))]

  if (ctx.bankAccountId !== undefined) {
    const acc = await getCefBankAccount(ctx.supabase, ctx.companyId, ctx.bankAccountId)
    if (acc === null) {
      return "conta bancária informada não encontrada para esta empresa, ou não é CEF"
    }
    if (extraidas.length === 1 && extraidas[0] !== acc.accountNumber) {
      warnings.push(
        `TXT informa conta ${extraidas[0]}, mas bankAccountId aponta para conta ` +
          `${acc.accountNumber} — usando bankAccountId`,
      )
    }
    return acc
  }

  if (extraidas.length === 1) {
    const accountNumber = extraidas[0] as string
    const bankAccountId = await resolveBankAccount(
      ctx.supabase,
      ctx.companyId,
      accountNumber,
      ctx.holder,
    )
    return { bankAccountId, accountNumber }
  }

  if (extraidas.length === 0) {
    const cefAccounts = await listCefBankAccounts(ctx.supabase, ctx.companyId)
    if (cefAccounts.length === 1) {
      return cefAccounts[0] as ContaResolvida
    }
    return cefAccounts.length === 0
      ? "o arquivo não traz o número da conta e não há conta CEF cadastrada — " +
          "importe um extrato TXT primeiro ou informe a conta no upload"
      : "o arquivo não traz o número da conta e a empresa tem mais de uma conta " +
          "CEF — informe qual conta no upload"
  }

  return "o arquivo contém transações de mais de uma conta — não suportado"
}

// ----- helpers de banco ---------------------------------------

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

/** Busca uma bank_accounts CEF da empresa pelo UUID. null se não existir
 *  (ou se não for da empresa / não for CEF). */
async function getCefBankAccount(
  supabase: SupabaseServerClient,
  companyId: string,
  bankAccountId: string,
): Promise<ContaResolvida | null> {
  const { data } = await supabase
    .from("bank_accounts")
    .select("id, account_number, bank")
    .eq("id", bankAccountId)
    .eq("company_id", companyId)
    .maybeSingle()
  if (data === null || data.bank !== BANK_CEF) return null
  return { bankAccountId: data.id, accountNumber: data.account_number }
}

/** Todas as contas CEF da empresa. */
async function listCefBankAccounts(
  supabase: SupabaseServerClient,
  companyId: string,
): Promise<ContaResolvida[]> {
  const { data } = await supabase
    .from("bank_accounts")
    .select("id, account_number")
    .eq("company_id", companyId)
    .eq("bank", BANK_CEF)
  return (data ?? []).map((r) => ({
    bankAccountId: r.id,
    accountNumber: r.account_number,
  }))
}

/**
 * Resolve a bank_accounts CEF pelo número da conta — busca e cria se não
 * existir. O extrato CEF não traz titular; usa-se o nome da empresa como
 * holder (placeholder editável depois).
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
    .eq("bank", BANK_CEF)
    .eq("account_number", accountNumber)
    .maybeSingle()
  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from("bank_accounts")
    .insert({
      company_id: companyId,
      bank: BANK_CEF,
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
      derivedOpening: null,
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
    // id é uuid autogerado pelo DB. O id determinístico do core (string
    // "cef_..._..._...") não cabe em uuid; a idempotência vem do UNIQUE
    // (company_id, origem, origem_ref).
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
