import { bucketCefHistory } from "../adapters/cef/hist-buckets"
import type { BankTransaction, ISODate } from "./types"

/**
 * Parser CEF TXT (extrato bancário CEF, formato relatório).
 *
 * Formato:
 *   "Conta";"Data_Mov";"Nr_Doc";"Historico";"Valor";"Deb_Cred"
 *   "0423012920005778782426";"20250401";"310325";"COB COMPE";"5964.52";"C"
 *
 * Encoding: UTF-8 / ASCII puro (CEF não usa cp1252 aqui).
 *
 * Linhas SALDO DIA / SALDO ANT são filtradas em silêncio (informativas,
 * não são movimentação financeira).
 *
 * Linhas inválidas (Deb_Cred ≠ C/D, data malformada, valor não-numérico)
 * geram warning e são puladas — parser nunca lança.
 */

const HEADER_LINE =
  '"Conta";"Data_Mov";"Nr_Doc";"Historico";"Valor";"Deb_Cred"'
const SKIP_HIST_CODES = new Set(["SALDO DIA", "SALDO ANT"])

export interface ParseCefResult {
  records: Array<
    Omit<
      BankTransaction,
      | "runningBalance"
      | "reconciled"
      | "reconciledTo"
      | "reconciliationConfidence"
      | "reconciliationCandidates"
    >
  >
  warnings: string[]
}

export function parseCef(csvText: string): ParseCefResult {
  const records: ParseCefResult["records"] = []
  const warnings: string[] = []

  const lines = csvText.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const lineNumber = i + 1
    const raw = lines[i] ?? ""
    const trimmed = raw.trim()
    if (trimmed === "") continue

    if (i === 0) {
      if (trimmed !== HEADER_LINE) {
        warnings.push(
          `linha 1: header diferente do esperado — ${JSON.stringify(trimmed)}`,
        )
      }
      continue
    }

    const fields = splitQuotedSemi(trimmed)
    if (fields.length < 6) {
      warnings.push(
        `linha ${lineNumber}: número de campos < 6 — pulando`,
      )
      continue
    }

    const account = fields[0] ?? ""
    const dataMov = fields[1] ?? ""
    const nrDoc = fields[2] ?? ""
    const histCode = fields[3] ?? ""
    const valorStr = fields[4] ?? ""
    const debCred = fields[5] ?? ""

    if (SKIP_HIST_CODES.has(histCode)) continue

    if (debCred !== "C" && debCred !== "D") {
      warnings.push(
        `linha ${lineNumber}: Deb_Cred inválido (${JSON.stringify(debCred)}) — pulando`,
      )
      continue
    }
    const direction: "C" | "D" = debCred

    const postingDate = parseYYYYMMDD(dataMov)
    if (postingDate === null) {
      warnings.push(
        `linha ${lineNumber}: Data_Mov inválida (${JSON.stringify(dataMov)}) — pulando`,
      )
      continue
    }

    const rawValue = parseFloat(valorStr)
    if (!Number.isFinite(rawValue)) {
      warnings.push(
        `linha ${lineNumber}: Valor não-numérico (${JSON.stringify(valorStr)}) — pulando`,
      )
      continue
    }

    const amount = direction === "C" ? rawValue : -rawValue
    const histBucket = bucketCefHistory(histCode, direction)

    records.push({
      source: "cef",
      account,
      postingDate,
      bankRefNumber: nrDoc,
      histCode,
      histBucket,
      rawValue,
      direction,
      amount,
    })
  }

  return { records, warnings }
}

/** Split por ';' e remove aspas duplas externas. CEF não tem ';' dentro de campo. */
function splitQuotedSemi(line: string): string[] {
  return line.split(";").map((t) => {
    const s = t.trim()
    if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
      return s.slice(1, -1)
    }
    return s
  })
}

function parseYYYYMMDD(s: string): ISODate | null {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(s.trim())
  if (m === null) return null
  const yyyy = m[1] ?? ""
  const mm = m[2] ?? ""
  const dd = m[3] ?? ""
  if (yyyy === "0000" || mm === "00" || dd === "00") return null
  return `${yyyy}-${mm}-${dd}`
}
