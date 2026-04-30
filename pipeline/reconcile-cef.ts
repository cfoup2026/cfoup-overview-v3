import type {
  APRecord,
  ARRecord,
  BankHistBucket,
  BankReconciliationStats,
  BankTransaction,
  ISODate,
  ReconciliationLink,
  ReconciliationTolerances,
} from "../parsers/types"

/**
 * Reconciliação CEF ↔ FKN AP/AR — Fase B.
 *
 * Algoritmo:
 *   1. Filtra AP/AR por `paymentDate !== null` (só efetivos).
 *   2. Para cada bank tx em ordem cronológica:
 *      - Se `histBucket ∈ RECONCILABLE_OUT` e `direction === 'D'` → match contra AP.
 *      - Se `histBucket ∈ RECONCILABLE_IN`  e `direction === 'C'` → match contra AR.
 *      - Caso contrário, não toca (Fase A inalterada).
 *   3. Pass 1 (exact): |amount diff| < R$ 0,01, dentro da tolerância de data.
 *   4. Pass 2 (heurístico, só se pass 1 vazio): |amount diff| < R$ 5
 *      OU |amount diff| / rawValue < 0,5%.
 *   5. Resolução:
 *      - 1 candidato exact     → matched, confidence=exact
 *      - >1 candidatos exact   → ambiguous (não consome ninguém)
 *      - 1 candidato heuristic → matched, confidence=heuristic
 *      - >1 heuristic          → ambiguous (não consome)
 *      - 0                     → unmatched
 *
 * Anti-double-match: cada AP/AR consumida vai pra um Set; candidatos
 * subsequentes filtram por essa key. Ambíguos NÃO consomem.
 *
 * IMPORTANTE: o array `bank` de entrada não é mutado. As mutações vão
 * em um clone raso (com deep-copy do array de candidatos).
 */

export const DEFAULT_RECONCILE_TOLERANCES: ReconciliationTolerances = {
  pix: 0,
  ted: 1,
  boleto: 2,
  check: 5,
}

const RECONCILABLE_OUT: ReadonlySet<BankHistBucket> = new Set<BankHistBucket>([
  "PIX_OUT",
  "TED_OUT",
  "BOLETO_OUT",
  "CHECK_OUT",
  "PAYROLL_OUT",
])
const RECONCILABLE_IN: ReadonlySet<BankHistBucket> = new Set<BankHistBucket>([
  "PIX_IN",
  "TED_IN",
  "BANK_COLLECTION_IN",
])

type APPaid = APRecord & { paymentDate: ISODate }
type ARPaid = ARRecord & { paymentDate: ISODate }
type Kind = "cp" | "cr"

function isReconcilableOut(tx: BankTransaction): boolean {
  return RECONCILABLE_OUT.has(tx.histBucket) && tx.direction === "D"
}
function isReconcilableIn(tx: BankTransaction): boolean {
  return RECONCILABLE_IN.has(tx.histBucket) && tx.direction === "C"
}
function isReconcilable(tx: BankTransaction): boolean {
  return isReconcilableOut(tx) || isReconcilableIn(tx)
}

function bucketTolerance(
  b: BankHistBucket,
  t: ReconciliationTolerances,
): { days: number; biz: boolean } {
  switch (b) {
    case "PIX_OUT":
    case "PIX_IN":
      return { days: t.pix, biz: false }
    case "TED_OUT":
    case "TED_IN":
      return { days: t.ted, biz: false }
    case "BOLETO_OUT":
    case "BANK_COLLECTION_IN":
      return { days: t.boleto, biz: true }
    case "CHECK_OUT":
      return { days: t.check, biz: true }
    case "PAYROLL_OUT":
      return { days: t.ted, biz: false }
    default:
      return { days: 0, biz: false }
  }
}

function isoToMs(s: ISODate): number {
  return new Date(`${s}T00:00:00Z`).getTime()
}

/** Diferença em dias absolutos. Se businessDays, conta apenas seg-sex (sem feriados). */
function diffDays(a: ISODate, b: ISODate, businessDays: boolean): number {
  const da = isoToMs(a)
  const db = isoToMs(b)
  if (!businessDays) {
    return Math.abs(Math.round((db - da) / 86_400_000))
  }
  const start = Math.min(da, db)
  const end = Math.max(da, db)
  let count = 0
  for (let t = start; t < end; t += 86_400_000) {
    const dow = new Date(t).getUTCDay()
    if (dow !== 0 && dow !== 6) count += 1
  }
  return count
}

function recordKey(r: APPaid | ARPaid, kind: Kind): string {
  if (kind === "cp") {
    const ap = r as APPaid
    return `cp:${ap.supplierNameRaw}|${ap.documentNumber}|${ap.faceValue.toFixed(2)}`
  }
  const ar = r as ARPaid
  return `cr:${ar.customerCode}|${ar.duplicate}|${ar.faceValue.toFixed(2)}`
}

function makeLink(
  r: APPaid | ARPaid,
  kind: Kind,
  tx: BankTransaction,
  biz: boolean,
): ReconciliationLink {
  return {
    source: kind === "cp" ? "fkn-cp" : "fkn-cr",
    recordKey: recordKey(r, kind),
    matchedOn: {
      dateDelta: diffDays(tx.postingDate, r.paymentDate, biz),
      amountDelta: Math.abs(tx.rawValue - r.paidValue),
    },
  }
}

interface ToleranceResolved {
  days: number
  biz: boolean
}

function findCandidates(
  pool: APPaid[] | ARPaid[],
  kind: Kind,
  tx: BankTransaction,
  tol: ToleranceResolved,
  consumed: Set<string>,
  mode: "exact" | "heuristic",
): Array<APPaid | ARPaid> {
  const out: Array<APPaid | ARPaid> = []
  for (const r of pool) {
    const key = recordKey(r, kind)
    if (consumed.has(key)) continue
    const dateDelta = diffDays(tx.postingDate, r.paymentDate, tol.biz)
    if (dateDelta > tol.days) continue
    const amountDiff = Math.abs(tx.rawValue - r.paidValue)
    if (mode === "exact") {
      if (amountDiff < 0.01) out.push(r)
    } else {
      const relativeOk =
        tx.rawValue > 0 && amountDiff / tx.rawValue < 0.005
      if (amountDiff < 5 || relativeOk) out.push(r)
    }
  }
  return out
}

export function reconcileCef(
  bank: BankTransaction[],
  ap: APRecord[],
  ar: ARRecord[],
  tolerances: ReconciliationTolerances = DEFAULT_RECONCILE_TOLERANCES,
): { transactions: BankTransaction[]; stats: BankReconciliationStats } {
  // Clone — não muta o input. Cópia rasa do array de candidatos também
  // (pra evitar aliasing inadvertido se o caller mutar depois).
  const transactions: BankTransaction[] = bank.map((tx) => ({
    ...tx,
    reconciliationCandidates: [...tx.reconciliationCandidates],
  }))

  const apPaid: APPaid[] = ap.filter(
    (r): r is APPaid => r.paymentDate !== null,
  )
  const arPaid: ARPaid[] = ar.filter(
    (r): r is ARPaid => r.paymentDate !== null,
  )

  const consumedAp = new Set<string>()
  const consumedAr = new Set<string>()

  for (const tx of transactions) {
    let kind: Kind
    let pool: APPaid[] | ARPaid[]
    let consumed: Set<string>
    if (isReconcilableOut(tx)) {
      kind = "cp"
      pool = apPaid
      consumed = consumedAp
    } else if (isReconcilableIn(tx)) {
      kind = "cr"
      pool = arPaid
      consumed = consumedAr
    } else {
      continue
    }

    const tol = bucketTolerance(tx.histBucket, tolerances)

    const exact = findCandidates(pool, kind, tx, tol, consumed, "exact")
    if (exact.length === 1) {
      const r = exact[0]!
      tx.reconciled = true
      tx.reconciledTo = makeLink(r, kind, tx, tol.biz)
      tx.reconciliationConfidence = "exact"
      consumed.add(recordKey(r, kind))
      continue
    }
    if (exact.length > 1) {
      tx.reconciled = false
      tx.reconciledTo = null
      tx.reconciliationConfidence = "ambiguous"
      tx.reconciliationCandidates = exact.map((r) =>
        makeLink(r, kind, tx, tol.biz),
      )
      continue
    }

    const heur = findCandidates(pool, kind, tx, tol, consumed, "heuristic")
    if (heur.length === 1) {
      const r = heur[0]!
      tx.reconciled = true
      tx.reconciledTo = makeLink(r, kind, tx, tol.biz)
      tx.reconciliationConfidence = "heuristic"
      consumed.add(recordKey(r, kind))
      continue
    }
    if (heur.length > 1) {
      tx.reconciled = false
      tx.reconciledTo = null
      tx.reconciliationConfidence = "ambiguous"
      tx.reconciliationCandidates = heur.map((r) =>
        makeLink(r, kind, tx, tol.biz),
      )
      continue
    }
    // Sem candidatos — campos default da Fase A são preservados.
  }

  // Stats — calcular cefMatched/Ambiguous/Unmatched APENAS sobre reconcilable.
  const reconcilable = transactions.filter(isReconcilable)
  const cefReconcilable = reconcilable.length
  const cefMatched = reconcilable.filter((t) => t.reconciled === true).length
  const cefAmbiguous = reconcilable.filter(
    (t) => t.reconciliationConfidence === "ambiguous",
  ).length
  const cefUnmatched = cefReconcilable - cefMatched - cefAmbiguous
  const cefBypass = transactions.length - cefReconcilable

  const stats: BankReconciliationStats = {
    cpPaidTotal: apPaid.length,
    cpMatched: consumedAp.size,
    cpUnmatched: apPaid.length - consumedAp.size,
    arPaidTotal: arPaid.length,
    arMatched: consumedAr.size,
    arUnmatched: arPaid.length - consumedAr.size,
    cefReconcilable,
    cefMatched,
    cefAmbiguous,
    cefUnmatched,
    cefBypass,
  }

  return { transactions, stats }
}
