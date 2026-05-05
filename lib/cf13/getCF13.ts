import { runCF13Pipeline, type CF13Output } from 'cfoup-core/cf13/contract'

import { loadCF13Inputs } from './loadInputs'

/**
 * Entrada pública do CF13 UI Contract no overview-v3.
 *
 * Carrega inputs (snake_case nativo) e roda `runCF13Pipeline` do core,
 * que adapta a saída pra `CF13Output` (camelCase, JSON-safe).
 *
 * **Sem transformação semântica na borda.** `runCF13Pipeline` já
 * entrega JSON-safe — UI consome direto. Conversões permitidas aqui
 * são apenas técnicas (ex: parse de Date para ISO em fixture, já
 * feito no core).
 */
export async function getCF13(
  clienteId: string,
  baseDate: string,
): Promise<CF13Output> {
  const inputs = await loadCF13Inputs(clienteId, baseDate)

  const output = runCF13Pipeline({
    cliente_id: clienteId,
    base_date: baseDate,
    eventos: inputs.eventos,
    opening_balances: inputs.openingBalances,
  })

  return output
}
