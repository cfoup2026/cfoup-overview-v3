import type { CF13Output, SemanaProjecao } from 'cfoup-core/cf13/contract'

import type { Escopo } from './montarVereditoUI'

/**
 * Linha da grade 13 semanas (CF13 UI Contract Item 6).
 *
 * Cinco linhas v0:
 *  1. Entradas              — `semana.entradas`
 *  2. Saídas                — `semana.saidas`
 *  3. Saldo da semana       — `semana.saldoSemana` (= entradas - saidas)
 *  4. Caixa final           — `semana.caixaFinalSemana`
 *  5. Mínimo operacional    — `semana.caixaMinimoOp`
 *
 * `valores` é `number[]` alinhado pelas 13 semanas (índice 0..12 casa
 * com `semanasRotulos[0..12]`). `flags` carrega marcações por célula:
 *  - `'abaixo_do_minimo'`: `caixaFinalSemana < caixaMinimoOp` (linha "Caixa final")
 *  - `'saldo_negativo'`: `caixaFinalSemana < 0` (linha "Caixa final")
 *
 * Sem lógica financeira nova — só leitura dos campos pré-calculados
 * pelo Stage 4 do core.
 */
export type LinhaGradeCF13 = {
  id: string
  tipo: string
  label: string
  valores: number[]
  flags?: string[][]
}

function flagsCaixaFinal(semanas: readonly SemanaProjecao[]): string[][] {
  return semanas.map((s) => {
    const out: string[] = []
    if (s.saldoNegativo) out.push('saldo_negativo')
    if (s.abaixoDoMinimo) out.push('abaixo_do_minimo')
    return out
  })
}

export function montarGradeCF13(
  cf13: CF13Output,
  escopo: Escopo = { tipo: 'consolidado' },
): LinhaGradeCF13[] {
  const projecao =
    escopo.tipo === 'consolidado'
      ? cf13.projecao.consolidado
      : cf13.projecao.unidades.find(
          (u) => u.escopo.tipo === 'unidade' && u.escopo.legalEntityId === escopo.legalEntityId,
        ) ?? cf13.projecao.consolidado

  const semanas = projecao.semanas

  return [
    {
      id: 'entradas',
      tipo: 'entrada',
      label: 'Entradas',
      valores: semanas.map((s) => s.entradas),
    },
    {
      id: 'saidas',
      tipo: 'saida',
      label: 'Saídas',
      valores: semanas.map((s) => s.saidas),
    },
    {
      id: 'saldo-semana',
      tipo: 'saldo_semana',
      label: 'Saldo da semana',
      valores: semanas.map((s) => s.saldoSemana),
    },
    {
      id: 'caixa-final',
      tipo: 'saldo_acumulado',
      label: 'Caixa final',
      valores: semanas.map((s) => s.caixaFinalSemana),
      flags: flagsCaixaFinal(semanas),
    },
    {
      id: 'minimo-operacional',
      tipo: 'variacao',
      label: 'Mínimo operacional',
      valores: semanas.map((s) => s.caixaMinimoOp),
    },
  ]
}
