import type { CF13Output } from 'cfoup-core/cf13/contract'

import type { Escopo } from './montarVereditoUI'

/**
 * Linha da grade 13 semanas (CF13 UI Contract Item 6 §2-§6).
 *
 * Cada linha tem 13 valores ordenados conforme
 * `cf13.projecao.<escopo>.semanas[]`. `flags` carrega anotações por
 * célula (ex: `'abaixoDoMinimo'`, `'saldoNegativo'`). `eventosIds`
 * permite drill-down do clique na célula.
 */
export type LinhaGradeCF13 = {
  id: string
  label: string
  tipo: 'entrada' | 'saida' | 'saldo_semana' | 'saldo_acumulado' | 'variacao'
  valores: {
    semanaId: string
    valor: number
    flags?: string[]
    eventosIds?: string[]
  }[]
}

/**
 * TODO (Passo 7): implementar conforme CF13 UI Contract Item 6 §2-§6.
 * Iterar `cf13.projecao.<escopo>.semanas[]` e produzir N linhas
 * (entradas, saidas, saldoSemana, caixaFinal, caixaMinimoOp etc.) com
 * valores alinhados pelas 13 semanas.
 */
export function montarGradeCF13(
  _cf13: CF13Output,
  _escopo: Escopo = { tipo: 'consolidado' },
): LinhaGradeCF13[] {
  throw new Error(
    'montarGradeCF13: not implemented (CF13 UI Contract Item 6)',
  )
}
