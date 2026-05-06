import type { EventoCaixa, OpeningBalanceSnapshot } from 'cfoup-core'

import gregoruttFixture from './fixtures/gregorutt.json'
import {
  resolverDataReferencia,
  type ResolucaoDataReferencia,
} from './resolverDataReferencia'

/**
 * Inputs do pipeline CF13 — formato snake_case nativo do core.
 *
 * Tipos vêm da raiz `cfoup-core` (snake_case do core); `CF13Output`
 * (camelCase) vem do subpath `cfoup-core/cf13/contract`. Coexistência
 * intencional: `loadCF13Inputs` lida com input nativo, `getCF13`
 * produz output do contrato via `runCF13Pipeline`.
 *
 * **Sem hardcode de baseDate.** A `dataReferencia` é resolvida pela
 * função central `resolverDataReferencia` (regra única do produto).
 */
export type CF13Inputs = {
  eventos: EventoCaixa[]
  openingBalances: OpeningBalanceSnapshot[]
  resolucao: ResolucaoDataReferencia
}

/**
 * Campos `Date` que precisam ser revividos a partir da fixture JSON.
 * `JSON.parse` retorna strings ISO; o pipeline interno do core valida
 * `instanceof Date` em vários estágios.
 *
 * `data_realizada` em status `confirmado/estimado/pendente` vem `null`
 * — reviver pula `null`/`undefined`.
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
  }
  return obj
}

/**
 * V0: fixture estática para `clienteId === 'gregorutt'`.
 *
 * Retorna **sempre** todos os eventos do cliente — pipeline precisa do
 * histórico pra calibrar recorrência/confiança e dos futuros (CR/CP em
 * aberto + estimados) pra projeção. **Não filtra** por data.
 *
 * `openingBalances` vem da `resolucao.saldoInicial` (snapshots na
 * `dataReferencia` escolhida pela regra central). Outros snapshots
 * fora dessa data NÃO entram — Stage 4 do core consome só o saldo de
 * abertura, não série temporal.
 *
 * Outras keys retornam vazio + `motivo: 'sem_snapshots'` — caller
 * decide se trata como "Estado 1 — sem dados conectados".
 */
export async function loadCF13Inputs(
  clienteId: string,
): Promise<CF13Inputs> {
  if (clienteId !== 'gregorutt') {
    return {
      eventos: [],
      openingBalances: [],
      resolucao: resolverDataReferencia([], []),
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fixture = gregoruttFixture as any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventos: EventoCaixa[] = (fixture.eventos_caixa ?? []).map((ev: any) =>
    reviveDates({ ...ev }, EVENTO_DATE_FIELDS),
  )

  const snapshotsTodos: OpeningBalanceSnapshot[] = (
    fixture.opening_balance_snapshots ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).map((s: any) => reviveDates({ ...s }, SALDO_DATE_FIELDS))

  const resolucao = resolverDataReferencia(eventos, snapshotsTodos)

  return {
    eventos,
    openingBalances: resolucao.saldoInicial,
    resolucao,
  }
}
