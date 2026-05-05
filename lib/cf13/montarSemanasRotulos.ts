import type { CF13Output } from 'cfoup-core/cf13/contract'

import type { Escopo } from './montarVereditoUI'

/**
 * Extrai os 13 rótulos de semana já renderizados pelo core
 * (`SemanaProjecao.rotulo`, ex: `"Sem 1 · 21–27 abr"`).
 *
 * Usado como header de coluna na tabela 13 semanas. Cada rótulo é
 * gerado deterministicamente pelo `formatarRotuloSemana` do core
 * (PT-BR, mês abreviado minúsculo). UI consome direto — zero
 * formatação no front.
 */
export function montarSemanasRotulos(
  cf13: CF13Output,
  escopo: Escopo = { tipo: 'consolidado' },
): string[] {
  if (escopo.tipo === 'consolidado') {
    return cf13.projecao.consolidado.semanas.map((s) => s.rotulo)
  }
  const u = cf13.projecao.unidades.find(
    (n) => n.escopo.tipo === 'unidade' && n.escopo.legalEntityId === escopo.legalEntityId,
  )
  return (u?.semanas ?? cf13.projecao.consolidado.semanas).map((s) => s.rotulo)
}
