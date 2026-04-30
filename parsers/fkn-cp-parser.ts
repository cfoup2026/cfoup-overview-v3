import type { APRecord, GroupMap, ISODate } from "./types"
import {
  isFooterLegend,
  isSubtotalLine,
  normalizeName,
  parseBRL,
  parseDate4,
  resolveSupplierGroup,
  splitSemicolon,
} from "./utils"

/**
 * Parser FKN CP (contas a pagar). Encoding cp1252 já decodificado pelo
 * caller; este parser recebe `csvText` em UTF-16 string nativa.
 *
 * Linhas de dado têm 13 campos. Cabeçalho (linhas 0–3) ignorado. Linhas
 * que começam com '(', subtotais ('TOTAL' nos 20 primeiros chars) e linhas
 * em branco também são ignoradas em silêncio. Linha válida: o primeiro
 * campo casa /^\d{2}\/\d{2}\/\d{2,4}/.
 *
 * Ordem das colunas (espelha o relatório FKN):
 *   0  EMIS         (DD/MM/YYYY)
 *   1  CONTA        (código da conta original)
 *   2  FORNECEDOR
 *   3  DOCUM.       (nº de documento / NF)
 *   4  FIL          (filial)
 *   5  VALOR        (BR)
 *   6  VALOR PAGO   (BR)
 *   7  VCTO         (DD/MM/YYYY)
 *   8  PGTO         (DD/MM/YYYY ou 00/00/0000)
 *   9  ATR          (atraso em dias)
 *  10  PORTADOR     (forma de pagamento)
 *  11  PRZ          (prazo em dias)
 *  12  (sem header) SIM/NÃO — flag de pagamento parcial
 */

const HEADER_PREFIX_RE = /^\d{2}\/\d{2}\/\d{2,4}/
const PAYMENT_NULL_SENTINEL = "00/00/0000"

export interface ParseFknCpResult {
  records: APRecord[]
  warnings: string[]
}

export function parseFknCp(
  csvText: string,
  groupMap: GroupMap,
  _referenceDate: ISODate,
): ParseFknCpResult {
  const records: APRecord[] = []
  const warnings: string[] = []

  const lines = csvText.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const lineNumber = i + 1
    const raw = lines[i] ?? ""
    const trimmed = raw.trim()

    // Linhas 0–3 são cabeçalho do relatório
    if (i < 4) continue
    if (trimmed === "") continue
    if (isFooterLegend(trimmed)) continue
    if (isSubtotalLine(trimmed)) continue

    const fields = splitSemicolon(raw)
    if (fields.length < 12) continue

    const first = (fields[0] ?? "").trim()
    if (!HEADER_PREFIX_RE.test(first)) continue

    const emisStr = (fields[0] ?? "").trim()
    const contaStr = (fields[1] ?? "").trim()
    const fornecedorStr = (fields[2] ?? "").trim()
    const docStr = (fields[3] ?? "").trim()
    const filStr = (fields[4] ?? "").trim()
    const valorStr = (fields[5] ?? "").trim()
    const valorPagoStr = (fields[6] ?? "").trim()
    const vctoStr = (fields[7] ?? "").trim()
    const pgtoStr = (fields[8] ?? "").trim()
    const atrStr = (fields[9] ?? "").trim()
    const portadorStr = (fields[10] ?? "").trim()
    const przStr = (fields[11] ?? "").trim()
    const parcialFlagStr = (fields[12] ?? "").trim()

    const emissionDate = parseDate4(emisStr)
    if (emissionDate === null) {
      warnings.push(
        `linha ${lineNumber}: EMIS inválido (${JSON.stringify(emisStr)}) — pulando`,
      )
      continue
    }

    const dueDate = parseDate4(vctoStr)
    if (dueDate === null) {
      warnings.push(
        `linha ${lineNumber}: VCTO inválido (${JSON.stringify(vctoStr)}) — pulando`,
      )
      continue
    }

    let paymentDate: ISODate | null = null
    if (pgtoStr !== "" && pgtoStr !== PAYMENT_NULL_SENTINEL) {
      const parsed = parseDate4(pgtoStr)
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

    const supplierNameNormalized = normalizeName(fornecedorStr)
    const supplierGroup = resolveSupplierGroup(supplierNameNormalized, groupMap)

    const isOpen = paymentDate === null
    // Flag SIM/NÃO da 13ª coluna; quando ausente, deriva por valores.
    let isPartialPayment: boolean
    if (parcialFlagStr === "SIM") {
      isPartialPayment = true
    } else if (parcialFlagStr === "NÃO" || parcialFlagStr === "NAO") {
      isPartialPayment = false
    } else {
      isPartialPayment =
        paidValue > 0 && paidValue + 0.01 < faceValue && !isOpen
    }

    const termDays = parseInteger(przStr) ?? 0
    const delayDays = parseInteger(atrStr) ?? 0

    const record: APRecord = {
      source: "fkn-cp",
      emissionDate,
      dueDate,
      paymentDate,
      faceValue,
      paidValue,
      isOpen,
      isPartialPayment,
      supplierCode: contaStr === "" ? null : contaStr,
      supplierNameRaw: fornecedorStr,
      supplierNameNormalized,
      supplierLegalName: null,
      supplierDocument: null,
      supplierGroupId: supplierGroup.groupId,
      supplierGroupName: supplierGroup.groupName,
      supplierDisplayName: supplierGroup.displayName,
      documentNumber: docStr,
      branch: filStr,
      originalAccountCode: contaStr,
      paymentMethod: portadorStr,
      termDays,
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
