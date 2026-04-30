import { parseCef, type ParseCefResult } from "../parsers/cef-parser"
import { reconcileCef } from "./reconcile-cef"
import type {
  APRecord,
  ARRecord,
  BankHistBucket,
  BankIngestOutput,
  BankReconciliationStats,
  BankTransaction,
  ISODate,
  ReconciliationTolerances,
} from "../parsers/types"

export interface IngestCefInput {
  files: Array<{ name: string; content: string }>
  account?: string
  openingBalance?: { date: ISODate; balance: number }
  /** Quando presente (ou junto com `arRecords`), o pipeline reconcilia
   *  AP/AR contra as transações bancárias antes de retornar. */
  apRecords?: APRecord[]
  arRecords?: ARRecord[]
  reconcileTolerances?: ReconciliationTolerances
}

const ALL_BUCKETS: readonly BankHistBucket[] = [
  "PIX_OUT",
  "PIX_IN",
  "TED_OUT",
  "TED_IN",
  "BOLETO_OUT",
  "BANK_COLLECTION_IN",
  "CARD_ACQUIRER_IN",
  "CHECK_OUT",
  "CHECK_IN",
  "PAYROLL_OUT",
  "WITHDRAW",
  "FEE",
  "PURCHASE",
  "GOV_OUT",
  "UTILITY_OUT",
  "INSURANCE_OUT",
  "LOAN_OUT",
  "INVESTMENT",
  "OTHER",
] as const

/**
 * Pipeline de ingestão CEF — Fase A.
 *
 * Não classifica via cfoup-core. Não reconcilia com FKN. Apenas parseia,
 * concatena, ordena, calcula running balance a partir do openingBalance,
 * e devolve `BankIngestOutput`. Os campos de reconciliação ficam
 * preenchidos como "vazios" (`reconciled=false`, demais null/[]) para
 * que o tipo seja válido — Fase B vai popular.
 */
export async function ingestCef(
  input: IngestCefInput,
): Promise<BankIngestOutput> {
  type ParsedRec = ParseCefResult["records"][number]
  const tagged: Array<{ rec: ParsedRec; fileIndex: number; idx: number }> = []
  const warnings: string[] = []

  for (let f = 0; f < input.files.length; f += 1) {
    const file = input.files[f]
    if (file === undefined) continue
    const result = parseCef(file.content)
    for (let i = 0; i < result.records.length; i += 1) {
      const rec = result.records[i]
      if (rec === undefined) continue
      tagged.push({ rec, fileIndex: f, idx: i })
    }
    for (const w of result.warnings) {
      warnings.push(`[${file.name}] ${w}`)
    }
  }

  let filtered = tagged
  if (input.account !== undefined) {
    const wanted = input.account
    filtered = filtered.filter((x) => x.rec.account === wanted)
  }

  filtered.sort((a, b) => {
    if (a.rec.postingDate !== b.rec.postingDate) {
      return a.rec.postingDate < b.rec.postingDate ? -1 : 1
    }
    if (a.fileIndex !== b.fileIndex) return a.fileIndex - b.fileIndex
    return a.idx - b.idx
  })

  const ob = input.openingBalance
  let running: number | null = null
  let started = false

  let transactions: BankTransaction[] = filtered.map((x) => {
    const rec = x.rec
    let runningBalance: number | null = null

    if (ob !== undefined) {
      if (!started && rec.postingDate >= ob.date) {
        started = true
        running = ob.balance + rec.amount
        runningBalance = running
      } else if (started && running !== null) {
        running = running + rec.amount
        runningBalance = running
      }
    }

    return {
      ...rec,
      runningBalance,
      reconciled: false,
      reconciledTo: null,
      reconciliationConfidence: null,
      reconciliationCandidates: [],
    }
  })

  let closingBalance: number | null = null
  for (let i = transactions.length - 1; i >= 0; i -= 1) {
    const t = transactions[i]
    if (t === undefined) continue
    if (t.runningBalance !== null) {
      closingBalance = t.runningBalance
      break
    }
  }

  const periodStart = transactions[0]?.postingDate ?? ""
  const periodEnd =
    transactions[transactions.length - 1]?.postingDate ?? ""

  const bucketCoverage = Object.fromEntries(
    ALL_BUCKETS.map((b) => [b, 0]),
  ) as Record<BankHistBucket, number>
  for (const t of transactions) {
    bucketCoverage[t.histBucket] += 1
  }

  const account = input.account ?? transactions[0]?.account ?? ""

  // Fase B: reconciliação opcional contra AP/AR.
  // Comportamento sem ap/arRecords: idêntico à Fase A (sem `reconciliation`).
  let reconciliation: BankReconciliationStats | undefined
  if (input.apRecords !== undefined || input.arRecords !== undefined) {
    const result = reconcileCef(
      transactions,
      input.apRecords ?? [],
      input.arRecords ?? [],
      input.reconcileTolerances,
    )
    transactions = result.transactions
    reconciliation = result.stats
  }

  const output: BankIngestOutput = {
    account,
    openingBalance: ob?.balance ?? null,
    closingBalance,
    periodStart,
    periodEnd,
    transactions,
    bucketCoverage,
    warnings,
  }
  if (reconciliation !== undefined) output.reconciliation = reconciliation
  return output
}
