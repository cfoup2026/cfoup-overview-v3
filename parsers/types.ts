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
