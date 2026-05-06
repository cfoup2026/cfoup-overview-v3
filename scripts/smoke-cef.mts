/**
 * Smoke do extrato CEF Gregorutt — Fase A.
 *
 * Uso: `pnpm tsx scripts/smoke-cef.mts`
 *
 * Lê todos os arquivos `data/gregorutt/cef/CEF_*.txt`, roda `ingestCef`
 * com OPENING/ACCOUNT hardcoded, imprime relatório de cobertura por
 * bucket e checks de sanity. Salva o `BankIngestOutput` em
 * `data/gregorutt/output/cef-run-{ISO}.json`.
 *
 * Se o sanity falhar (drift > R$ 0,01 ou OTHER ≥ 2%), exit code ≠ 0
 * para que o caller (commit script externo) abortere a sequência.
 *
 * Ver `scripts/smoke-gregorutt.mts` para a nota sobre a extensão `.mts`.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import iconv from "iconv-lite"

import { parseFknCp } from "../parsers/fkn-cp-parser"
import { parseFknCr } from "../parsers/fkn-cr-parser"
import { ingestCef } from "../pipeline/ingest-cef"
import type {
  APRecord,
  ARRecord,
  BankHistBucket,
  BankIngestOutput,
  GroupMap,
  ISODate,
} from "../parsers/types"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, "..")
const CEF_DIR = resolve(REPO_ROOT, "data/gregorutt/cef")
const CSV_DIR = resolve(REPO_ROOT, "data/gregorutt/csv")
const OUTPUT_DIR = resolve(REPO_ROOT, "data/gregorutt/output")

const CP_FILE = resolve(CSV_DIR, "Gregorutt_CP_2023_ate_20Abr2026.csv")
const CR_FILE = resolve(CSV_DIR, "Gregorutt_CR_2023__ate_20Abr2026.csv")

const OPENING = { date: "2025-03-05" as const, balance: 20244.31 }
const ACCOUNT = "0423012920005778782426"

// FKN tem período diferente do CEF (FKN até 20/04/2026, CEF até 31/03/2026).
// Fixar uma data de referência para o parse FKN: data estável, posterior
// ao último lançamento, suficiente para o cálculo de aging do CR.
const FKN_REFERENCE_DATE: ISODate = "2026-04-30"
const EMPTY_GROUP_MAP: GroupMap = { customers: [], suppliers: [] }

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

function pad(n: number, width: number): string {
  return String(n).padStart(width, " ")
}

function fmtBrl(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  })
}

async function main(): Promise<void> {
  if (!existsSync(CEF_DIR)) {
    console.error(`Pasta ausente: ${CEF_DIR}`)
    console.error("Copie os 13 arquivos CEF_*.txt e rode novamente.")
    process.exit(1)
  }
  const files = readdirSync(CEF_DIR)
    .filter((f) => /^CEF_.*\.txt$/i.test(f))
    .sort()
  if (files.length === 0) {
    console.error(`Nenhum arquivo CEF_*.txt em ${CEF_DIR}.`)
    console.error("Copie os 13 TXTs CEF e rode novamente.")
    process.exit(1)
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

  const inputFiles = files.map((name) => ({
    name,
    content: readFileSync(resolve(CEF_DIR, name), "utf-8"),
  }))

  // Fase B: tenta carregar os CSVs FKN. Se ambos existirem, parseia (cp1252)
  // com referenceDate FIXO 2026-04-30 (FKN cobre período distinto do CEF —
  // FKN até 20/04, CEF até 31/03). Sem os CSVs, smoke roda igual à Fase A.
  let apRecords: APRecord[] | undefined
  let arRecords: ARRecord[] | undefined
  const fknAvailable = existsSync(CP_FILE) && existsSync(CR_FILE)
  if (fknAvailable) {
    const cpCsv = iconv.decode(readFileSync(CP_FILE), "cp1252")
    const crCsv = iconv.decode(readFileSync(CR_FILE), "cp1252")
    const cp = parseFknCp(cpCsv, EMPTY_GROUP_MAP, FKN_REFERENCE_DATE)
    const cr = parseFknCr(crCsv, EMPTY_GROUP_MAP, FKN_REFERENCE_DATE)
    apRecords = cp.records
    arRecords = cr.records
  }

  const out = await ingestCef({
    files: inputFiles,
    account: ACCOUNT,
    openingBalance: OPENING,
    apRecords,
    arRecords,
  })

  const totalTx = out.transactions.length
  const inflow = out.transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0)
  const outflowAbs = -out.transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + t.amount, 0)
  const net = inflow - outflowAbs
  const ob = out.openingBalance ?? 0
  const cb = out.closingBalance ?? 0
  const drift = Math.abs(net - (cb - ob))
  const otherCount = out.bucketCoverage["OTHER"]
  const otherPct = totalTx > 0 ? (otherCount / totalTx) * 100 : 0
  const sanityOk = drift < 0.01
  const otherOk = otherPct < 2.0

  // Sanity da reconciliação (Fase B). Quando ausente, ambos true por convenção.
  let reconcileTotalsOk = true
  let reconcileSplitOk = true
  if (out.reconciliation !== undefined) {
    const r = out.reconciliation
    reconcileTotalsOk = r.cefReconcilable + r.cefBypass === totalTx
    reconcileSplitOk =
      r.cefMatched + r.cefAmbiguous + r.cefUnmatched === r.cefReconcilable
  }

  printReport(out, files.length, {
    inflow,
    outflowAbs,
    net,
    drift,
    otherPct,
    sanityOk,
    otherOk,
    reconcileTotalsOk,
    reconcileSplitOk,
  })

  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const outFile = resolve(OUTPUT_DIR, `cef-run-${stamp}.json`)
  writeFileSync(outFile, JSON.stringify(out, null, 2), "utf-8")
  console.log("")
  console.log(`output salvo em: ${outFile}`)

  if (!sanityOk) {
    console.error("")
    console.error(
      `SANITY FAIL: |Net - (closing - opening)| = ${fmtBrl(drift)} ≥ R$ 0,01`,
    )
    process.exit(2)
  }
  if (!otherOk) {
    console.error("")
    console.error(`SANITY FAIL: OTHER% = ${otherPct.toFixed(1)}% ≥ 2%`)
    process.exit(2)
  }
  if (!reconcileTotalsOk) {
    console.error("")
    console.error(
      "SANITY FAIL: cefReconcilable + cefBypass ≠ total transactions",
    )
    process.exit(2)
  }
  if (!reconcileSplitOk) {
    console.error("")
    console.error(
      "SANITY FAIL: cefMatched + cefAmbiguous + cefUnmatched ≠ cefReconcilable",
    )
    process.exit(2)
  }
}

function printReport(
  out: BankIngestOutput,
  fileCount: number,
  metrics: {
    inflow: number
    outflowAbs: number
    net: number
    drift: number
    otherPct: number
    sanityOk: boolean
    otherOk: boolean
    reconcileTotalsOk: boolean
    reconcileSplitOk: boolean
  },
): void {
  const totalTx = out.transactions.length
  const ob = out.openingBalance ?? 0
  const cb = out.closingBalance ?? 0

  const lines: string[] = [
    "=== SMOKE CEF GREGORUTT ===",
    `account: ${out.account}`,
    `period: ${out.periodStart} → ${out.periodEnd}`,
    "",
    "PARSING",
    `  Files:                ${pad(fileCount, 7)}`,
    `  Total transactions:   ${pad(totalTx, 7)} (esperado ~6.364)`,
    `  Warnings:             ${pad(out.warnings.length, 7)}`,
    "",
    "SALDO",
    `  Opening balance:      ${fmtBrl(ob)} (informed: ${OPENING.date})`,
    `  Closing balance:      ${fmtBrl(cb)}`,
    `  Net period:           ${fmtBrl(metrics.net)} (esperado ~+R$ 14.249,96)`,
    "",
    "BUCKET COVERAGE",
  ]
  for (const b of ALL_BUCKETS) {
    const c = out.bucketCoverage[b]
    lines.push(`  ${b.padEnd(20)} ${pad(c, 7)}`)
  }
  lines.push("")
  lines.push("FLUXOS")
  lines.push(`  Total inflow:         ${fmtBrl(metrics.inflow)}`)
  lines.push(`  Total outflow:        ${fmtBrl(metrics.outflowAbs)}`)
  lines.push(`  Net:                  ${fmtBrl(metrics.net)}`)
  lines.push("")

  if (out.reconciliation !== undefined) {
    const r = out.reconciliation
    const cpPct = r.cpPaidTotal > 0 ? (r.cpMatched / r.cpPaidTotal) * 100 : 0
    const arPct = r.arPaidTotal > 0 ? (r.arMatched / r.arPaidTotal) * 100 : 0
    const cefPct =
      r.cefReconcilable > 0 ? (r.cefMatched / r.cefReconcilable) * 100 : 0
    lines.push("RECONCILIAÇÃO COM FKN")
    lines.push(`  AP paid total:        ${pad(r.cpPaidTotal, 7)}`)
    lines.push(
      `  AP matched:           ${pad(r.cpMatched, 7)} (${cpPct.toFixed(1)}%)`,
    )
    lines.push(`  AP unmatched:         ${pad(r.cpUnmatched, 7)}`)
    lines.push("")
    lines.push(`  AR paid total:        ${pad(r.arPaidTotal, 7)}`)
    lines.push(
      `  AR matched:           ${pad(r.arMatched, 7)} (${arPct.toFixed(1)}%)`,
    )
    lines.push(`  AR unmatched:         ${pad(r.arUnmatched, 7)}`)
    lines.push("")
    lines.push(`  CEF reconcilable:     ${pad(r.cefReconcilable, 7)}`)
    lines.push(
      `  CEF matched:          ${pad(r.cefMatched, 7)} (${cefPct.toFixed(1)}%)`,
    )
    lines.push(`  CEF ambiguous:        ${pad(r.cefAmbiguous, 7)}`)
    lines.push(`  CEF unmatched:        ${pad(r.cefUnmatched, 7)}`)
    lines.push(`  CEF bypass:           ${pad(r.cefBypass, 7)}`)
  } else {
    lines.push(
      "RECONCILIAÇÃO: pulada (FKN CSVs não encontrados em data/gregorutt/csv/)",
    )
  }
  lines.push("")

  lines.push("SANITY")
  lines.push(
    `  |Net - (closing - opening)|: ${fmtBrl(metrics.drift)} (< R$ 0,01? ${metrics.sanityOk ? "OK" : "FAIL"})`,
  )
  lines.push(
    `  OTHER %: ${metrics.otherPct.toFixed(1)}% (ideal <2%, ${metrics.otherOk ? "OK" : "FAIL"})`,
  )
  if (out.reconciliation !== undefined) {
    lines.push(
      `  cefReconcilable + cefBypass === total: ${metrics.reconcileTotalsOk ? "OK" : "FAIL"}`,
    )
    lines.push(
      `  cefMatched + cefAmbiguous + cefUnmatched === cefReconcilable: ${metrics.reconcileSplitOk ? "OK" : "FAIL"}`,
    )
  }
  console.log(lines.join("\n"))
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
