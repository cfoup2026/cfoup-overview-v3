import type { CF13Output, PendenciaCF13 } from 'cfoup-core/cf13/contract'

/**
 * Item do painel de pendências (CF13 UI Contract Item 8).
 *
 * Passthrough do `cf13.pendencias` — o core já entrega ordenado
 * (severidade desc → semanaId asc → id asc). Tipo idêntico ao
 * `PendenciaCF13` do contrato; o `FluxoDeCaixaScreen` consome um
 * subset dos campos.
 */
export type PendenciaPanelItem = PendenciaCF13

export function montarPainelPendencias(
  cf13: CF13Output,
): PendenciaPanelItem[] {
  return cf13.pendencias
}
