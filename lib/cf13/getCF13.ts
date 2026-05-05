import { runCF13Pipeline, type CF13Output } from 'cfoup-core/cf13/contract'

import { loadCF13Inputs } from './loadInputs'

/**
 * Erro lançado quando não há `OpeningBalanceSnapshot` no input —
 * cliente sem dados conectados (Estado 1 do CF13 UI Contract).
 *
 * Caller (page) decide se renderiza estado especial ou propaga 5xx.
 * Em v0 a page só repropaga; tratamento dedicado entra junto com o
 * fluxo de Conexões.
 */
export class CF13SemDadosError extends Error {
  override readonly name = 'CF13SemDadosError' as const

  constructor(public readonly clienteId: string) {
    super(
      `CF13: cliente '${clienteId}' sem opening_balance_snapshots — não é possível resolver dataReferencia.`,
    )
    Object.setPrototypeOf(this, CF13SemDadosError.prototype)
  }
}

/**
 * Entrada pública do CF13 UI Contract no overview-v3.
 *
 * Resolve `dataReferencia` internamente via `loadCF13Inputs`
 * (que delega pra `resolverDataReferencia`) — **sem hardcode**. Datas
 * literais não existem em código de produto; só em fixtures/testes.
 *
 * Roda `runCF13Pipeline` com a `dataReferencia` derivada e os snapshots
 * do dia. UI consome o `CF13Output` direto, incluindo `meta.baseDate`
 * pra mostrar "Dados atualizados até DD/MM/YYYY".
 */
export async function getCF13(clienteId: string): Promise<CF13Output> {
  const inputs = await loadCF13Inputs(clienteId)

  if (inputs.resolucao.motivo === 'sem_snapshots') {
    throw new CF13SemDadosError(clienteId)
  }

  /* `dataReferencia` é não-null aqui (motivo === 'derivado_do_ultimo_snapshot'). */
  const baseDate = inputs.resolucao.dataReferencia as string

  const output = runCF13Pipeline({
    cliente_id: clienteId,
    base_date: baseDate,
    eventos: inputs.eventos,
    opening_balances: inputs.openingBalances,
  })

  return output
}
