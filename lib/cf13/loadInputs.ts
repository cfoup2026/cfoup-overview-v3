import type { EventoCaixa, OpeningBalanceSnapshot } from 'cfoup-core'

import gregoruttFixture from './fixtures/gregorutt.json'

/**
 * Inputs do pipeline CF13 — formato snake_case nativo do core.
 *
 * Tipos vêm da raiz `cfoup-core` (snake_case do core); `CF13Output`
 * (camelCase) vem do subpath `cfoup-core/cf13/contract`. Coexistência
 * intencional: `loadCF13Inputs` lida com input nativo, `getCF13`
 * produz output do contrato via `runCF13Pipeline`.
 */
export type CF13Inputs = {
  eventos: EventoCaixa[]
  openingBalances: OpeningBalanceSnapshot[]
}

/**
 * Campos `Date` do `EventoCaixa` que precisam ser revividos a partir
 * da fixture JSON (JSON.parse retorna strings ISO; o pipeline interno
 * exige `Date` objects). Lista vinda de `src/types/EventoCaixa.ts` do core.
 *
 * `data_realizada` é especial: em `status='confirmado'|'estimado'|'pendente'`
 * vem `null`, e null deve ser preservado. Reviver pula `null`/`undefined`.
 */
const EVENTO_DATE_FIELDS = [
  'data_esperada',
  'data_realizada',
  'data_vencimento',
  'criado_em',
  'confirmado_em',
  'reconciliado_em',
] as const

const SALDO_DATE_FIELDS = ['data_referencia', 'criado_em'] as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reviveDates(obj: any, fields: readonly string[]): any {
  for (const f of fields) {
    const v = obj[f]
    if (typeof v === 'string') {
      obj[f] = new Date(v)
    }
    // null / undefined / já-Date passam intactos.
  }
  return obj
}

/**
 * V0: fixture estática para `clienteId === 'gregorutt'`.
 *
 * `data_referencia` é o campo correto do `OpeningBalanceSnapshot` (não
 * `data_corte`). Filtramos saldos cujo dia (`YYYY-MM-DD` do
 * `data_referencia` ISO, primeiros 10 chars) bate com `baseDate`.
 *
 * Outras keys retornam vazio — Estado 1 ("Sem dados conectados") é
 * decidido pelo caller, antes de chamar `getCF13`.
 *
 * Fixture é input bruto do pipeline, não output. `runCF13Pipeline`
 * roda em runtime sobre esses inputs dentro de `getCF13`.
 *
 * **Reviver datas:** JSON serializa `Date` como string ISO; o pipeline
 * interno do core valida `instanceof Date` em vários estágios. Cada
 * evento + snapshot é mutado in-place pra trocar campos string-ISO
 * por `Date`. Mutamos a cópia da fixture (Next isola o module entre
 * requests, então side-effect aqui não vaza globalmente).
 *
 * Cast `as any` no JSON é aceitável no v0 (fixture estática
 * controlada). Validação runtime (zod) pode entrar pós-MVP se
 * necessário.
 */
export async function loadCF13Inputs(
  clienteId: string,
  baseDate: string,
): Promise<CF13Inputs> {
  if (clienteId !== 'gregorutt') {
    return { eventos: [], openingBalances: [] }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixture = gregoruttFixture as any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventos = (fixture.eventos_caixa ?? []).map((ev: any) =>
    reviveDates({ ...ev }, EVENTO_DATE_FIELDS),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openingBalancesAll = (fixture.opening_balance_snapshots ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s: any) => reviveDates({ ...s }, SALDO_DATE_FIELDS),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openingBalances = openingBalancesAll.filter((s: any) => {
    const ref = s.data_referencia
    if (!(ref instanceof Date) || Number.isNaN(ref.getTime())) return false
    // Compara `YYYY-MM-DD` UTC.
    const ano = ref.getUTCFullYear()
    const mes = String(ref.getUTCMonth() + 1).padStart(2, '0')
    const dia = String(ref.getUTCDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}` === baseDate
  })

  return {
    eventos: eventos as EventoCaixa[],
    openingBalances: openingBalances as OpeningBalanceSnapshot[],
  }
}
