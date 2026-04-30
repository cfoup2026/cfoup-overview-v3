import type { GroupMap, SaleRecord } from "./types"
import {
  isFooterLegend,
  isSubtotalLine,
  normalizeName,
  parseBRL,
  parseDate4,
  resolveCustomerGroup,
  splitSemicolon,
} from "./utils"

/**
 * Parser FKN Vendas. Não-flat: vendas vêm agrupadas por cliente, e o nome
 * do cliente vive em uma linha-cabeçalho separada que precede o bloco.
 *
 * Mantemos estado `currentCustomer` enquanto iteramos as linhas:
 *   - linha 'CLIENTE: <code> <nome>;' redefine `currentCustomer`
 *   - linhas '---' (régua) são skip
 *   - linhas TOTAL - NOTAS / TOTAL GERAL são skip (subtotais)
 *   - linhas '(' (legenda) são skip
 *
 * Ordem das colunas de uma venda:
 *   0  DATA         (DD/MM/YYYY)
 *   1  NOTA         (invoiceNumber)
 *   2  VENDEDOR     (salesperson)
 *   3  PRAZO        (paymentTerm)
 *   4  VALOR NOTA   (BR)
 *   5  VALOR CUSTO  (BR)
 *   6  %LUC         (BR)
 */

const HEADER_PREFIX_RE = /^\d{2}\/\d{2}\/\d{2,4}/
const RULER_RE = /^-{3,}\s*$/
const CUSTOMER_HEADER_RE = /^CLIENTE:\s+(\S+)\s+(.+?)\s*;?\s*$/

export interface ParseFknVendasResult {
  records: SaleRecord[]
  warnings: string[]
}

export function parseFknVendas(
  csvText: string,
  groupMap: GroupMap,
): ParseFknVendasResult {
  const records: SaleRecord[] = []
  const warnings: string[] = []

  let currentCustomer: { code: string; nameRaw: string } | null = null

  const lines = csvText.split(/\r?\n/)
  for (let i = 0; i < lines.length; i += 1) {
    const lineNumber = i + 1
    const raw = lines[i] ?? ""
    const trimmed = raw.trim()

    if (i < 4) continue
    if (trimmed === "") continue
    if (RULER_RE.test(trimmed)) continue

    // Customer header
    const headerMatch = CUSTOMER_HEADER_RE.exec(trimmed)
    if (headerMatch !== null) {
      currentCustomer = {
        code: headerMatch[1] ?? "",
        nameRaw: (headerMatch[2] ?? "").trim(),
      }
      continue
    }

    if (isFooterLegend(trimmed)) continue
    if (isSubtotalLine(trimmed)) continue

    const fields = splitSemicolon(raw)
    const first = (fields[0] ?? "").trim()
    if (!HEADER_PREFIX_RE.test(first)) continue
    if (fields.length < 7) continue

    if (currentCustomer === null) {
      warnings.push(
        `linha ${lineNumber}: venda sem header CLIENTE: precedente — pulando`,
      )
      continue
    }

    const dataStr = (fields[0] ?? "").trim()
    const notaStr = (fields[1] ?? "").trim()
    const vendedorStr = (fields[2] ?? "").trim()
    const prazoStr = (fields[3] ?? "").trim()
    const valorStr = (fields[4] ?? "").trim()
    const custoStr = (fields[5] ?? "").trim()
    const lucStr = (fields[6] ?? "").trim()

    const saleDate = parseDate4(dataStr)
    if (saleDate === null) {
      warnings.push(
        `linha ${lineNumber}: DATA inválida (${JSON.stringify(dataStr)}) — pulando`,
      )
      continue
    }

    const customerNameNormalized = normalizeName(currentCustomer.nameRaw)
    const customerGroup = resolveCustomerGroup(
      currentCustomer.code,
      customerNameNormalized,
      groupMap,
    )

    const invoiceValue = parseBRL(valorStr)
    const costValue = parseBRL(custoStr)
    const marginPct = parseBRL(lucStr)

    const record: SaleRecord = {
      source: "fkn-vendas",
      saleDate,
      invoiceNumber: notaStr,
      customerCode: currentCustomer.code,
      customerNameRaw: currentCustomer.nameRaw,
      customerNameNormalized,
      customerLegalName: null,
      customerDocument: null,
      customerGroupId: customerGroup.groupId,
      customerGroupName: customerGroup.groupName,
      customerDisplayName: customerGroup.displayName,
      salesperson: vendedorStr,
      paymentTerm: prazoStr,
      invoiceValue,
      costValue,
      marginPct,
    }
    records.push(record)
  }

  return { records, warnings }
}
