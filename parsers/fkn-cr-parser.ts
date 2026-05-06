import type { ARRecord, GroupMap, ISODate } from "./types"
import {
  daysBetween,
  isFooterLegend,
  isSubtotalLine,
  normalizeName,
  parseBRL,
  parseDate2,
  resolveCustomerGroup,
  splitSemicolon,
} from "./utils"

/**
 * Parser FKN CR (contas a receber). Datas em DD/MM/YY (cutoff 50).
 *
 * Linhas válidas têm 14 campos; algumas têm 12 (TIP + NOSSO NRO/BCO vazios).
 * Cabeçalho (linhas 0–3), linhas em branco, linhas com '(' inicial,
 * linhas com 'TOTAL' nos 20 primeiros chars são ignoradas.
 *
 * CR tem ruído extra:
 *   - linhas começando com ';Obs:' (primeira coluna vazia, segunda 'Obs:')
 *   - 4 linhas finais de totalização por portador (primeira coluna vazia,
 *     segunda em {'A VISTA', 'DESCONTADOS', 'CAUCIONADOS', 'OUTROS'})
 *
 * Linha de dado válida: primeiro campo casa /^\d{2}\/\d{2}\/\d{2,4}/.
 *
 * Ordem das colunas:
 *   0  EMIS         (DD/MM/YY)
 *   1  COD.         (customerCode)
 *   2  CLIENTE      (raw name)
 *   3  FIL          (filial)
 *   4  DUPLIC.      (ex: '115683/01')
 *   5  ID           (internal id)
 *   6  VALOR
 *   7  VALOR PAGO
 *   8  VCTO         (DD/MM/YY ou 'A VISTA')
 *   9  PGTO         (DD/MM/YY ou 00/00/00)
 *  10  ATR
 *  11  PORTADOR
 *  12  TIP          (opcional)
 *  13  NOSSO NRO/BCO (opcional)
 */

const HEADER_PREFIX_RE = /^\d{2}\/\d{2}\/\d{2,4}/
const A_VISTA_RE = /^A\s*VISTA$/i
const PAYMENT_NULL_SENTINEL_2 = "00/00/00"
const PORTADOR_TOTALS = new Set([
  "A VISTA",
  "DESCONTADOS",
  "CAUCIONADOS",
  "OUTROS",
])

export interface ParseFknCrResult {
  records: ARRecord[]
  warnings: string[]
}

export function parseFknCr(
  csvText: string,
  groupMap: GroupMap,
  referenceDate: ISODate,
): ParseFknCrResult {
  const records: ARRecord[] = []
  const warnings: string[] = []

  const lines = csvText.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const lineNumber = i + 1
    const raw = lines[i] ?? ""
    const trimmed = raw.trim()

    if (i < 4) continue
    if (trimmed === "") continue
    if (isFooterLegend(trimmed)) continue
    if (isSubtotalLine(trimmed)) continue

    const fields = splitSemicolon(raw)
    const first = (fields[0] ?? "").trim()
    const second = (fields[1] ?? "").trim()

    // Linhas ;Obs: (col0 vazio, col1='Obs:') — skip silencioso
    if (first === "" && (second === "Obs:" || second.startsWith("Obs:"))) {
      continue
    }
    if (first.startsWith("Obs:")) continue

    // 4 linhas finais de totalização por portador (col0 vazio + col1 ∈ portador-set)
    if (first === "" && PORTADOR_TOTALS.has(second.toUpperCase())) continue

    if (!HEADER_PREFIX_RE.test(first)) continue
    if (fields.length < 12) continue

    const emisStr = (fields[0] ?? "").trim()
    const codStr = (fields[1] ?? "").trim()
    const clienteStr = (fields[2] ?? "").trim()
    const filStr = (fields[3] ?? "").trim()
    const duplicStr = (fields[4] ?? "").trim()
    const idStr = (fields[5] ?? "").trim()
    const valorStr = (fields[6] ?? "").trim()
    const valorPagoStr = (fields[7] ?? "").trim()
    const vctoStr = (fields[8] ?? "").trim()
    const pgtoStr = (fields[9] ?? "").trim()
    const atrStr = (fields[10] ?? "").trim()
    const portadorStr = (fields[11] ?? "").trim()

    const emissionDate = parseDate2(emisStr)
    if (emissionDate === null) {
      warnings.push(
        `linha ${lineNumber}: EMIS inválido (${JSON.stringify(emisStr)}) — pulando`,
      )
      continue
    }

    let dueDateRaw: string
    let effectiveDueDate: ISODate
    if (A_VISTA_RE.test(vctoStr)) {
      dueDateRaw = "A_VISTA"
      effectiveDueDate = emissionDate
    } else {
      const parsed = parseDate2(vctoStr)
      if (parsed === null) {
        warnings.push(
          `linha ${lineNumber}: VCTO inválido (${JSON.stringify(vctoStr)}) — pulando`,
        )
        continue
      }
      dueDateRaw = parsed
      effectiveDueDate = parsed
    }

    let paymentDate: ISODate | null = null
    if (pgtoStr !== "" && pgtoStr !== PAYMENT_NULL_SENTINEL_2) {
      const parsed = parseDate2(pgtoStr)
      if (parsed === null) {
        warnings.push(
          `linha ${lineNumber}: PGTO em formato inválido (${JSON.stringify(pgtoStr)}) — paymentDate=null`,
        )
      } else {
        paymentDate = parsed
      }
    }

    const faceValue = parseBRL(valorStr)
    const paidValue = parseBRL(valorPagoStr)

    const customerNameNormalized = normalizeName(clienteStr)
    const customerGroup = resolveCustomerGroup(
      codStr,
      customerNameNormalized,
      groupMap,
    )

    const isOpen = paymentDate === null
    const delayDays = parseInteger(atrStr) ?? 0
    const overdueDays = isOpen
      ? daysBetween(effectiveDueDate, referenceDate)
      : 0
    const isOverdue90Plus = isOpen && overdueDays > 90

    const invoiceNumber = duplicStr.includes("/")
      ? (duplicStr.split("/")[0] ?? "")
      : duplicStr

    const record: ARRecord = {
      source: "fkn-cr",
      emissionDate,
      dueDateRaw,
      effectiveDueDate,
      paymentDate,
      faceValue,
      paidValue,
      isOpen,
      isOverdue90Plus,
      customerCode: codStr,
      customerNameRaw: clienteStr,
      customerNameNormalized,
      customerLegalName: null,
      customerDocument: null,
      customerGroupId: customerGroup.groupId,
      customerGroupName: customerGroup.groupName,
      customerDisplayName: customerGroup.displayName,
      duplicate: duplicStr,
      invoiceNumber,
      internalId: idStr,
      branch: filStr,
      paymentMethod: portadorStr,
      delayDays,
    }
    records.push(record)
  }

  return { records, warnings }
}

function parseInteger(s: string): number | null {
  const t = (s ?? "").trim()
  if (t === "") return null
  if (!/^-?\d+$/.test(t)) return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}
