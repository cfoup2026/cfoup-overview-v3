import {
  classifyTransaction,
  type AccountCodeHintMap,
  type ClassificationResult,
  type SourceTransaction,
} from "cfoup-core"

import { parseFknCp } from "../parsers/fkn-cp-parser"
import { parseFknCr } from "../parsers/fkn-cr-parser"
import { parseFknVendas } from "../parsers/fkn-vendas-parser"
import type {
  APRecord,
  ARRecord,
  DataQualityBlock,
  GroupMap,
  IngestOutput,
  ISODate,
  SaleRecord,
} from "../parsers/types"
import { daysBetween } from "../parsers/utils"

export interface IngestFknInput {
  cpCsv: string
  crCsv: string
  vendasCsv: string
  groupMap: GroupMap
  accountCodeHints: AccountCodeHintMap
  /** Default: max(emissionDate) entre AP, AR, vendas. */
  referenceDate?: ISODate
}

const COMPANY_ID = "fkn-pilot"

/**
 * Roda os 3 parsers FKN, calcula o bloco de qualidade de dado e classifica
 * AP+AR via cfoup-core. Sem persistência: devolve um `IngestOutput` para o
 * caller (smoke, futuras telas) consumir.
 *
 * AR não tem `originalAccountCode` — passamos só `description` (nome
 * normalizado) para o motor; AP passa também `originalAccountCode` para
 * que `accountCodeHints` participe da decisão.
 */
export async function ingestFkn(input: IngestFknInput): Promise<IngestOutput> {
  const referenceDate = input.referenceDate ?? deriveReferenceDate(input)

  const cp = parseFknCp(input.cpCsv, input.groupMap, referenceDate)
  const cr = parseFknCr(input.crCsv, input.groupMap, referenceDate)
  const vendas = parseFknVendas(input.vendasCsv, input.groupMap)

  const classifiedAp: Array<APRecord & { classification: ClassificationResult }> =
    cp.records.map((rec, idx) => {
      const sourceTx = apToSourceTransaction(rec, idx)
      const classification = classifyTransaction(sourceTx, {
        accountCodeHints: input.accountCodeHints,
      })
      return { ...rec, classification }
    })

  const classifiedAr: Array<ARRecord & { classification: ClassificationResult }> =
    cr.records.map((rec, idx) => {
      const sourceTx = arToSourceTransaction(rec, idx)
      const classification = classifyTransaction(sourceTx, {
        accountCodeHints: input.accountCodeHints,
      })
      return { ...rec, classification }
    })

  const quality = buildQualityBlock(
    cp.records,
    cr.records,
    vendas.records,
    referenceDate,
    [...classifiedAp.map((r) => r.classification), ...classifiedAr.map((r) => r.classification)],
  )

  return {
    referenceDate,
    ap: cp.records,
    ar: cr.records,
    sales: vendas.records,
    quality,
    classifiedAp,
    classifiedAr,
  }
}

function deriveReferenceDate(input: IngestFknInput): ISODate {
  // Recorre aos parsers só para extrair as datas máximas — paga o custo
  // mas mantém a semântica explícita.
  const tmpReference: ISODate = "1970-01-01"
  const ap = parseFknCp(input.cpCsv, input.groupMap, tmpReference).records
  const ar = parseFknCr(input.crCsv, input.groupMap, tmpReference).records
  const sales = parseFknVendas(input.vendasCsv, input.groupMap).records

  const dates: ISODate[] = []
  for (const r of ap) dates.push(r.emissionDate)
  for (const r of ar) dates.push(r.emissionDate)
  for (const r of sales) dates.push(r.saleDate)
  if (dates.length === 0) {
    return new Date().toISOString().slice(0, 10)
  }
  dates.sort()
  return dates[dates.length - 1] as ISODate
}

function apToSourceTransaction(rec: APRecord, idx: number): SourceTransaction {
  const tx: SourceTransaction = {
    id: `fkn-cp:${idx}`,
    companyId: COMPANY_ID,
    sourceSystem: "accounts_payable",
    transactionDate: new Date(`${rec.emissionDate}T00:00:00Z`),
    direction: "outflow",
    amount: rec.faceValue,
    currency: "BRL",
    counterpartyName: rec.supplierNameRaw,
    description: rec.supplierNameNormalized,
    documentNumber: rec.documentNumber,
  }
  if (rec.originalAccountCode !== "") {
    tx.originalAccountCode = rec.originalAccountCode
  }
  if (rec.dueDate !== "") {
    tx.dueDate = new Date(`${rec.dueDate}T00:00:00Z`)
  }
  if (rec.paymentDate !== null) {
    tx.paidDate = new Date(`${rec.paymentDate}T00:00:00Z`)
  }
  return tx
}

function arToSourceTransaction(rec: ARRecord, idx: number): SourceTransaction {
  const tx: SourceTransaction = {
    id: `fkn-cr:${idx}`,
    companyId: COMPANY_ID,
    sourceSystem: "accounts_receivable",
    transactionDate: new Date(`${rec.emissionDate}T00:00:00Z`),
    dueDate: new Date(`${rec.effectiveDueDate}T00:00:00Z`),
    direction: "inflow",
    amount: rec.faceValue,
    currency: "BRL",
    counterpartyName: rec.customerNameRaw,
    description: rec.customerNameNormalized,
    documentNumber: rec.duplicate,
  }
  if (rec.paymentDate !== null) {
    tx.paidDate = new Date(`${rec.paymentDate}T00:00:00Z`)
  }
  return tx
}

function buildQualityBlock(
  ap: APRecord[],
  ar: ARRecord[],
  sales: SaleRecord[],
  referenceDate: ISODate,
  classifications: ClassificationResult[],
): DataQualityBlock {
  const arOpen = ar.filter((r) => r.isOpen)
  const arOverdue90Plus = arOpen.filter((r) => r.isOverdue90Plus)
  const arOverdue0to90 = arOpen.filter((r) => {
    if (r.isOverdue90Plus) return false
    return daysBetween(r.effectiveDueDate, referenceDate) > 0
  })
  const arAVistaSemPgto = ar.filter(
    (r) => r.dueDateRaw === "A_VISTA" && r.isOpen,
  )

  const apOpen = ap.filter((r) => r.isOpen)
  const apOverdue90Plus = apOpen.filter(
    (r) => daysBetween(r.dueDate, referenceDate) > 90,
  )
  const apOverdue0to90 = apOpen.filter((r) => {
    const overdue = daysBetween(r.dueDate, referenceDate)
    return overdue > 0 && overdue <= 90
  })
  const partialPayments = ap.filter((r) => r.isPartialPayment)

  // Join Vendas ↔ CR pelo prefixo do número de duplicata. Joins-miss = vendas
  // sem qualquer CR cujo `invoiceNumber` (prefixo do `duplicate`) bata.
  const crInvoiceSet = new Set(ar.map((r) => r.invoiceNumber).filter((s) => s !== ""))
  const joinMisses = sales.filter(
    (s) => s.invoiceNumber !== "" && !crInvoiceSet.has(s.invoiceNumber),
  )

  const total = classifications.length
  const classified = classifications.filter((c) => c.status === "classified").length
  const needsConfirmation = classifications.filter(
    (c) => c.status === "needs_confirmation",
  ).length
  const pending = classifications.filter((c) => c.status === "pending").length
  const coveragePct = total > 0 ? (classified / total) * 100 : 0

  return {
    arOverdue90Plus,
    arOverdue0to90,
    arAVistaSemPgto,
    apOverdue90Plus,
    apOverdue0to90,
    partialPayments,
    joinMisses,
    classificationCoverage: {
      total,
      classified,
      needsConfirmation,
      pending,
      coveragePct,
    },
  }
}
