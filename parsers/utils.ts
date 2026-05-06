import type { GroupMap, ISODate } from "./types"

/** '1.234,56' → 1234.56; vazio/inválido → 0. */
export function parseBRL(s: string): number {
  if (s === undefined || s === null) return 0
  const cleaned = String(s).trim()
  if (cleaned === "") return 0
  const normalized = cleaned.replace(/\./g, "").replace(",", ".")
  const n = parseFloat(normalized)
  return Number.isFinite(n) ? n : 0
}

/** 'DD/MM/YYYY' → 'YYYY-MM-DD'; '00/00/0000' → null; inválido → null. */
export function parseDate4(s: string): ISODate | null {
  const t = (s ?? "").trim()
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t)
  if (m === null) return null
  const dd = m[1]
  const mm = m[2]
  const yyyy = m[3]
  if (dd === "00" || mm === "00" || yyyy === "0000") return null
  return `${yyyy}-${mm}-${dd}`
}

/** 'DD/MM/YY' com cutoff 50 → 'YYYY-MM-DD'. 00–49 → 20XX, 50–99 → 19XX. */
export function parseDate2(s: string): ISODate | null {
  const t = (s ?? "").trim()
  const m = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(t)
  if (m === null) return null
  const dd = m[1]
  const mm = m[2]
  const yy = m[3]
  if (dd === "00" || mm === "00") return null
  const yyNum = parseInt(yy, 10)
  const yyyy = yyNum < 50 ? 2000 + yyNum : 1900 + yyNum
  return `${yyyy}-${mm}-${dd}`
}

/** Trim + colapsa espaços + uppercase. Idempotente. */
export function normalizeName(s: string): string {
  return (s ?? "").trim().replace(/\s+/g, " ").toUpperCase()
}

/** True se 'TOTAL' aparece nos primeiros 20 chars (linha de subtotal/agregado). */
export function isSubtotalLine(s: string): boolean {
  return (s ?? "").slice(0, 20).includes("TOTAL")
}

/** True se a linha começa com '(' — legenda de rodapé tipo '(*) ...' / '($) ...'. */
export function isFooterLegend(s: string): boolean {
  return (s ?? "").startsWith("(")
}

/** Remove ';' finais e separa por ';' preservando campos vazios. */
export function splitSemicolon(line: string): string[] {
  return (line ?? "").replace(/;+$/, "").split(";")
}

/** Diferença em dias inteiros entre duas ISODates (b - a). */
export function daysBetween(a: ISODate, b: ISODate): number {
  const da = Date.UTC(
    Number(a.slice(0, 4)),
    Number(a.slice(5, 7)) - 1,
    Number(a.slice(8, 10)),
  )
  const db = Date.UTC(
    Number(b.slice(0, 4)),
    Number(b.slice(5, 7)) - 1,
    Number(b.slice(8, 10)),
  )
  return Math.round((db - da) / 86_400_000)
}

interface GroupResolution {
  groupId: string | null
  groupName: string
  displayName: string
}

/**
 * Casa cliente por `customerCode` exato OU `customerNameNormalized` exato.
 * Sem match: groupId=null, groupName=normName, displayName=normName.
 */
export function resolveCustomerGroup(
  code: string,
  normName: string,
  map: GroupMap,
): GroupResolution {
  for (const grp of map.customers) {
    for (const m of grp.members) {
      if (m.customerCode !== undefined && m.customerCode === code) {
        return {
          groupId: grp.groupId,
          groupName: grp.groupName,
          displayName: grp.groupName,
        }
      }
      if (
        m.customerNameNormalized !== undefined &&
        m.customerNameNormalized === normName
      ) {
        return {
          groupId: grp.groupId,
          groupName: grp.groupName,
          displayName: grp.groupName,
        }
      }
    }
  }
  return { groupId: null, groupName: normName, displayName: normName }
}

/**
 * Casa fornecedor por `supplierNameNormalized` exato. Sem match: groupId=null,
 * groupName=normName, displayName=normName.
 */
export function resolveSupplierGroup(
  normName: string,
  map: GroupMap,
): GroupResolution {
  for (const grp of map.suppliers) {
    for (const m of grp.members) {
      if (m.supplierNameNormalized === normName) {
        return {
          groupId: grp.groupId,
          groupName: grp.groupName,
          displayName: grp.groupName,
        }
      }
    }
  }
  return { groupId: null, groupName: normName, displayName: normName }
}
