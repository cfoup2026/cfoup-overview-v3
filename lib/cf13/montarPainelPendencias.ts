import type { CF13Output, PendenciaCF13 } from 'cfoup-core/cf13/contract'

/**
 * Item do painel de pendências (CF13 UI Contract Item 8).
 *
 * Tipo é alinhado 1:1 com `PendenciaCF13` do core — engine entrega no
 * formato que a UI consome direto. Ordenação determinística (severidade
 * desc → semanaId asc → id asc) já vem feita pelo `runCF13Pipeline`.
 */
export type PendenciaPanelItem = PendenciaCF13

/**
 * TODO (Passo 7): implementar conforme CF13 UI Contract Item 8.
 * Pode ser passthrough (`cf13.pendencias`) ou aplicar filtros/agrupamentos
 * conforme spec final. Por enquanto, fica `throw` pra forçar uso
 * intencional do output cru no Passo 5.
 */
export function montarPainelPendencias(
  _cf13: CF13Output,
): PendenciaPanelItem[] {
  throw new Error(
    'montarPainelPendencias: not implemented (CF13 UI Contract Item 8)',
  )
}
