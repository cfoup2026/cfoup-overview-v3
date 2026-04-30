/**
 * Smoke do piloto Gregorutt (FKN).
 *
 * Uso: `pnpm tsx scripts/smoke-gregorutt.ts`
 *
 * Lê os 3 CSVs em `data/gregorutt/csv/` (cp1252) e roda o pipeline FKN
 * completo, imprimindo um relatório de cobertura e qualidade no stdout.
 * Salva o `IngestOutput` em `data/gregorutt/output/run-{ISO}.json`.
 *
 * Nada commita: CSVs e output ficam ignorados pelo .gitignore.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import iconv from "iconv-lite"

import { fknAccountCodeHints } from "../adapters/fkn/account-code-hints"
import { ingestFkn } from "../pipeline/ingest-fkn"
import type { GroupMap, IngestOutput } from "../parsers/types"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, "..")
const CSV_DIR = resolve(REPO_ROOT, "data/gregorutt/csv")
const OUTPUT_DIR = resolve(REPO_ROOT, "data/gregorutt/output")
const MAPPINGS_FILE = resolve(REPO_ROOT, "mappings/gregorutt-groups.json")

const CP_FILE = resolve(CSV_DIR, "Gregorutt_CP_2023_ate_20Abr2026.csv")
const CR_FILE = resolve(CSV_DIR, "Gregorutt_CR_2023__ate_20Abr2026.csv")
const VENDAS_FILE = resolve(CSV_DIR, "Gregorutt_Vendas_2023_ate_20Abr2026.csv")

interface FixturesCheck {
  ok: boolean
  missing: string[]
}

function checkFixtures(): FixturesCheck {
  const missing: string[] = []
  for (const f of [CP_FILE, CR_FILE, VENDAS_FILE]) {
    if (!existsSync(f)) missing.push(f)
  }
  return { ok: missing.length === 0, missing }
}

function readCsv(path: string): string {
  const buf = readFileSync(path)
  return iconv.decode(buf, "cp1252")
}

function readGroupMap(): GroupMap {
  if (!existsSync(MAPPINGS_FILE)) {
    return { customers: [], suppliers: [] }
  }
  const raw = readFileSync(MAPPINGS_FILE, "utf-8")
  const parsed = JSON.parse(raw) as GroupMap
  return {
    customers: parsed.customers ?? [],
    suppliers: parsed.suppliers ?? [],
  }
}

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

function pct(part: number, total: number): string {
  if (total === 0) return "0.0%"
  return `${((part / total) * 100).toFixed(1)}%`
}

function sumFace<T extends { faceValue: number }>(rows: T[]): number {
  return rows.reduce((acc, r) => acc + r.faceValue, 0)
}

function printReport(
  out: IngestOutput,
  cpCount: number,
  crCount: number,
  vendasCount: number,
  cpWarnings: number,
  crWarnings: number,
  vendasWarnings: number,
): void {
  const q = out.quality
  const cov = q.classificationCoverage
  const apClassifications = out.classifiedAp.map((r) => r.classification)
  const arClassifications = out.classifiedAr.map((r) => r.classification)
  const apClassified = apClassifications.filter((c) => c.status === "classified").length
  const apNeedsConfirm = apClassifications.filter((c) => c.status === "needs_confirmation").length
  const apPending = apClassifications.filter((c) => c.status === "pending").length
  const apHintExact = apClassifications.filter(
    (c) =>
      c.classificationMethod === "account_code_hint" &&
      c.confidenceLevel === "high",
  ).length
  const apHintPrefix = apClassifications.filter(
    (c) =>
      c.classificationMethod === "account_code_hint" &&
      c.confidenceLevel === "medium",
  ).length
  const apKeyword = apClassifications.filter(
    (c) => c.classificationMethod === "keyword_rule",
  ).length

  const arClassified = arClassifications.filter((c) => c.status === "classified").length

  const joinMatched = vendasCount - q.joinMisses.length

  const lines = [
    "=== SMOKE GREGORUTT (FKN) ===",
    `referenceDate: ${out.referenceDate}`,
    "",
    "PARSING",
    `  CP rows:           ${pad(cpCount, 7)} (esperado ~6.880)`,
    `  CR rows:           ${pad(crCount, 7)} (esperado ~11.611)`,
    `  Vendas rows:       ${pad(vendasCount, 7)} (esperado ~9.903)`,
    `  CP warnings:       ${pad(cpWarnings, 7)}`,
    `  CR warnings:       ${pad(crWarnings, 7)}`,
    `  Vendas warnings:   ${pad(vendasWarnings, 7)}`,
    "",
    "JOIN VENDAS ↔ CR",
    `  Vendas com match:  ${pad(joinMatched, 7)} (${pct(joinMatched, vendasCount)})`,
    `  Vendas sem match:  ${pad(q.joinMisses.length, 7)}`,
    "",
    "QUALIDADE DE DADO",
    `  AP open:           ${pad(out.ap.filter((r) => r.isOpen).length, 7)} | ${fmtBrl(sumFace(out.ap.filter((r) => r.isOpen)))}`,
    `  AR open:           ${pad(out.ar.filter((r) => r.isOpen).length, 7)} | ${fmtBrl(sumFace(out.ar.filter((r) => r.isOpen)))}`,
    `  AR overdue >90d:   ${pad(q.arOverdue90Plus.length, 7)} | ${fmtBrl(sumFace(q.arOverdue90Plus))}`,
    `  AP overdue >90d:   ${pad(q.apOverdue90Plus.length, 7)} | ${fmtBrl(sumFace(q.apOverdue90Plus))}`,
    `  AP partial:        ${pad(q.partialPayments.length, 7)}`,
    "",
    "CLASSIFICAÇÃO AP (motor + hints FKN)",
    `  Total:             ${pad(apClassifications.length, 7)}`,
    `  Classificados:     ${pad(apClassified, 7)} (${pct(apClassified, apClassifications.length)})`,
    `  Needs confirm:     ${pad(apNeedsConfirm, 7)}`,
    `  Pendentes:         ${pad(apPending, 7)}`,
    `  Cobertura exact:   ${pad(apHintExact, 7)}`,
    `  Cobertura prefix:  ${pad(apHintPrefix, 7)}`,
    `  Cobertura desc:    ${pad(apKeyword, 7)}`,
    "",
    "CLASSIFICAÇÃO AR (motor)",
    `  Classificados:     ${pad(arClassified, 7)} (${pct(arClassified, arClassifications.length)})`,
    "",
    "TOTAL CLASSIFICAÇÃO (AP + AR)",
    `  Total:             ${pad(cov.total, 7)}`,
    `  Coverage:          ${cov.coveragePct.toFixed(1)}%`,
  ]
  console.log(lines.join("\n"))
}

async function main(): Promise<void> {
  const check = checkFixtures()
  if (!check.ok) {
    console.error("Fontes ausentes em data/gregorutt/csv/:")
    for (const m of check.missing) console.error(`  - ${m}`)
    console.error("")
    console.error(
      "Copie os 3 CSVs (cp1252) com os nomes acima e rode novamente.",
    )
    process.exit(1)
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

  const cpCsv = readCsv(CP_FILE)
  const crCsv = readCsv(CR_FILE)
  const vendasCsv = readCsv(VENDAS_FILE)
  const groupMap = readGroupMap()

  const out = await ingestFkn({
    cpCsv,
    crCsv,
    vendasCsv,
    groupMap,
    accountCodeHints: fknAccountCodeHints,
  })

  // Contagens "raw" (incluem registros que viraram warning + foram aceitos)
  const cpCount = out.ap.length
  const crCount = out.ar.length
  const vendasCount = out.sales.length

  // Re-roda parsers só pra contar warnings (cheap, evita IngestOutput inchar
  // com warnings que não usamos em runtime).
  const { parseFknCp } = await import("../parsers/fkn-cp-parser")
  const { parseFknCr } = await import("../parsers/fkn-cr-parser")
  const { parseFknVendas } = await import("../parsers/fkn-vendas-parser")
  const cpW = parseFknCp(cpCsv, groupMap, out.referenceDate).warnings.length
  const crW = parseFknCr(crCsv, groupMap, out.referenceDate).warnings.length
  const venW = parseFknVendas(vendasCsv, groupMap).warnings.length

  printReport(out, cpCount, crCount, vendasCount, cpW, crW, venW)

  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const outFile = resolve(OUTPUT_DIR, `run-${stamp}.json`)
  writeFileSync(outFile, JSON.stringify(out, null, 2), "utf-8")
  console.log("")
  console.log(`output salvo em: ${outFile}`)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
