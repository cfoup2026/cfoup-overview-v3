import type { CF13Output } from 'cfoup-core/cf13/contract'

import type { Escopo } from './montarVereditoUI'

/**
 * Card superior da tela CF13 (CF13 UI Contract Item 7 §2-§3).
 *
 * Cards típicos: menorCaixaProjetado, menorGapMinimo, contagem de
 * pendências críticas, confiança consolidada. `fonte` indica de qual
 * sub-output do `CF13Output` o card foi derivado — útil pra debug.
 */
export type CardCF13 = {
  id: string
  titulo: string
  valor: number | string
  subtitulo?: string
  severidade: 'neutra' | 'positiva' | 'atencao' | 'aviso_forte' | 'negativa'
  fonte: 'projecao' | 'cobertura' | 'confianca' | 'veredito'
}

/**
 * TODO (Passo 7): implementar conforme CF13 UI Contract Item 7 §2-§3.
 * Produzir cards a partir de `cf13.projecao.<escopo>.menorCaixaProjetado`,
 * `menorGapMinimo`, `cf13.cobertura.status`, `cf13.confianca.<escopo>.projecao`,
 * `cf13.veredito.<escopo>.categoria`.
 */
export function montarCardsCF13(
  _cf13: CF13Output,
  _escopo: Escopo = { tipo: 'consolidado' },
): CardCF13[] {
  throw new Error(
    'montarCardsCF13: not implemented (CF13 UI Contract Item 7)',
  )
}
