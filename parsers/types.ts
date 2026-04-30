import type { ClassificationResult } from "cfoup-core"

export type ISODate = string // 'YYYY-MM-DD'

export interface APRecord {
  source: "fkn-cp"
  emissionDate: ISODate
  dueDate: ISODate
  paymentDate: ISODate | null
  faceValue: number
  paidValue: number
  isOpen: boolean
  isPartialPayment: boolean
  supplierCode: string | null
  supplierNameRaw: string
  supplierNameNormalized: string
  supplierLegalName: string | null
  supplierDocument: string | null
  supplierGroupId: string | null
  supplierGroupName: string
  supplierDisplayName: string
  documentNumber: string
  branch: string
  originalAccountCode: string
  paymentMethod: string
  termDays: number
  delayDays: number
}

export interface ARRecord {
  source: "fkn-cr"
  emissionDate: ISODate
  dueDateRaw: string // 'YYYY-MM-DD' ou 'A_VISTA'
  effectiveDueDate: ISODate
  paymentDate: ISODate | null
  faceValue: number
  paidValue: number
  isOpen: boolean
  isOverdue90Plus: boolean
  customerCode: string
  customerNameRaw: string
  customerNameNormalized: string
  customerLegalName: string | null
  customerDocument: string | null
  customerGroupId: string | null
  customerGroupName: string
  customerDisplayName: string
  duplicate: string // ex: '115683/01'
  invoiceNumber: string // prefixo de duplicate antes do '/'
  internalId: string
  branch: string
  paymentMethod: string
  delayDays: number
}

export interface SaleRecord {
  source: "fkn-vendas"
  saleDate: ISODate
  invoiceNumber: string
  customerCode: string
  customerNameRaw: string
  customerNameNormalized: string
  customerLegalName: string | null
  customerDocument: string | null
  customerGroupId: string | null
  customerGroupName: string
  customerDisplayName: string
  salesperson: string
  paymentTerm: string
  invoiceValue: number
  costValue: number
  marginPct: number
}

export interface DataQualityBlock {
  arOverdue90Plus: ARRecord[]
  arOverdue0to90: ARRecord[]
  arAVistaSemPgto: ARRecord[]
  apOverdue90Plus: APRecord[]
  apOverdue0to90: APRecord[]
  partialPayments: APRecord[]
  joinMisses: SaleRecord[]
  classificationCoverage: {
    total: number
    classified: number
    needsConfirmation: number
    pending: number
    coveragePct: number
  }
}

export interface IngestOutput {
  referenceDate: ISODate
  ap: APRecord[]
  ar: ARRecord[]
  sales: SaleRecord[]
  quality: DataQualityBlock
  classifiedAp: Array<APRecord & { classification: ClassificationResult }>
  classifiedAr: Array<ARRecord & { classification: ClassificationResult }>
}

export interface CustomerGroupMember {
  customerCode?: string
  customerNameNormalized?: string
}

export interface SupplierGroupMember {
  supplierNameNormalized: string
}

export interface CustomerGroup {
  groupId: string
  groupName: string
  members: CustomerGroupMember[]
}

export interface SupplierGroup {
  groupId: string
  groupName: string
  members: SupplierGroupMember[]
}

export interface GroupMap {
  customers: CustomerGroup[]
  suppliers: SupplierGroup[]
}

// =====================================================================
// Bank — schema genérico (CEF é o primeiro adapter)
// =====================================================================

export type BankHistBucket =
  | "PIX_OUT"
  | "PIX_IN"
  | "TED_OUT"
  | "TED_IN"
  | "BOLETO_OUT"
  | "BANK_COLLECTION_IN"
  | "CARD_ACQUIRER_IN"
  | "CHECK_OUT"
  | "CHECK_IN"
  | "PAYROLL_OUT"
  | "WITHDRAW"
  | "FEE"
  | "PURCHASE"
  | "GOV_OUT"
  | "UTILITY_OUT"
  | "INSURANCE_OUT"
  | "LOAN_OUT"
  | "INVESTMENT"
  | "OTHER"

export interface ReconciliationLink {
  source: "fkn-cp" | "fkn-cr"
  recordKey: string
  matchedOn: { dateDelta: number; amountDelta: number }
}

export interface BankTransaction {
  source: "cef"
  account: string
  postingDate: ISODate
  bankRefNumber: string
  histCode: string
  histBucket: BankHistBucket
  rawValue: number
  direction: "C" | "D"
  amount: number
  runningBalance: number | null
  // Reconciliação — Fase A não popula. Schema declarado para Fase B.
  reconciled: boolean
  reconciledTo: ReconciliationLink | null
  reconciliationConfidence: "exact" | "heuristic" | "ambiguous" | null
  reconciliationCandidates: ReconciliationLink[]
}

export interface BankIngestOutput {
  account: string
  openingBalance: number | null
  closingBalance: number | null
  periodStart: ISODate
  periodEnd: ISODate
  transactions: BankTransaction[]
  bucketCoverage: Record<BankHistBucket, number>
  warnings: string[]
  /** Presente apenas quando o pipeline reconciliou contra AP/AR (Fase B). */
  reconciliation?: BankReconciliationStats
}

/** Tolerâncias de data por canal, usadas no reconciler. */
export interface ReconciliationTolerances {
  /** Dias corridos. PIX é instantâneo; default 0. */
  pix: number
  /** Dias corridos. TED pode levar até 1 dia útil; default 1. */
  ted: number
  /** Dias úteis (seg-sex, sem feriados). Boleto liquida em 1–2 d.u.; default 2. */
  boleto: number
  /** Dias úteis. Cheque pode demorar dias para compensar; default 5. */
  check: number
}

/** Métricas agregadas da reconciliação CEF ↔ FKN AP/AR. */
export interface BankReconciliationStats {
  cpPaidTotal: number
  cpMatched: number
  cpUnmatched: number
  arPaidTotal: number
  arMatched: number
  arUnmatched: number
  cefReconcilable: number
  cefMatched: number
  cefAmbiguous: number
  cefUnmatched: number
  cefBypass: number
}
