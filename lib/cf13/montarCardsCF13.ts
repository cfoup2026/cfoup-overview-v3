import type { CF13Output } from 'cfoup-core/cf13/contract'

import { montarVereditoUI, type Escopo, type SeveridadeUI } from './montarVereditoUI'

/**
 * Card superior da tela CF13.
 *
 * Ordem v0 (4 cards):
 *  1. Veredito           — categoria + texto curto
 *  2. Menor caixa        — `min(caixaFinalSemana)` ao longo das 13 semanas
 *  3. Menor gap mínimo   — `min(caixaFinalSemana - caixaMinimoOp)`
 *  4. Confiança          — `confianca.<escopo>.projecao`
 *
 * Severidade: mapping UI puro — não inventa regra financeira.
 *  - Veredito: severidade do banner.
 *  - Menor caixa: `< 0 → 'negativa'`, senão `'neutra'`.
 *  - Menor gap: `< 0 → 'aviso_forte'` (abaixo do mínimo, mas saldo
 *    pode ainda ser positivo), senão `'neutra'`.
 *  - Confiança: `baixa → 'atencao'`, `media → 'neutra'`, `alta → 'positiva'`.
 *
 * `valor` é `number` (cardinal); `FluxoDeCaixaScreen` formata com
 * `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
 */
export type CardCF13 = {
  id: string
  titulo: string
  valor: number | string
  subtitulo?: string
  severidade: SeveridadeUI
  fonte: 'projecao' | 'cobertura' | 'confianca' | 'veredito'
}

const CONFIANCA_SEVERIDADE: Readonly<
  Record<'baixa' | 'media' | 'alta', SeveridadeUI>
> = {
  baixa: 'atencao',
  media: 'neutra',
  alta: 'positiva',
}

const CONFIANCA_LABEL: Readonly<
  Record<'baixa' | 'media' | 'alta', string>
> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

export function montarCardsCF13(
  cf13: CF13Output,
  escopo: Escopo = { tipo: 'consolidado' },
): CardCF13[] {
  const projecao =
    escopo.tipo === 'consolidado'
      ? cf13.projecao.consolidado
      : cf13.projecao.unidades.find(
          (u) => u.escopo.tipo === 'unidade' && u.escopo.legalEntityId === escopo.legalEntityId,
        ) ?? cf13.projecao.consolidado

  const confianca =
    escopo.tipo === 'consolidado'
      ? cf13.confianca.consolidado
      : cf13.confianca.unidades.find(
          (u) => u.legalEntityId === escopo.legalEntityId,
        ) ?? cf13.confianca.consolidado

  const veredito = montarVereditoUI(cf13, escopo)

  const menorCaixa = projecao.menorCaixaProjetado
  const menorGap = projecao.menorGapMinimo

  const cards: CardCF13[] = [
    {
      id: 'veredito',
      titulo: veredito.titulo,
      valor: veredito.categoria === 'dados_insuficientes' ? '—' : veredito.titulo,
      subtitulo: veredito.mensagem,
      severidade: veredito.severidade,
      fonte: 'veredito',
    },
    {
      id: 'menor-caixa',
      titulo: 'Menor caixa projetado',
      valor: menorCaixa.valor,
      subtitulo: `Semana de ${menorCaixa.semanaInicio}`,
      severidade: menorCaixa.valor < 0 ? 'negativa' : 'neutra',
      fonte: 'projecao',
    },
    {
      id: 'menor-gap',
      titulo: 'Menor folga vs. mínimo',
      valor: menorGap.valor,
      subtitulo: `Semana de ${menorGap.semanaInicio}`,
      severidade: menorGap.valor < 0 ? 'aviso_forte' : 'neutra',
      fonte: 'projecao',
    },
    {
      id: 'confianca',
      titulo: 'Confiança da projeção',
      valor: CONFIANCA_LABEL[confianca.projecao],
      subtitulo:
        cf13.confianca.pendenciaCriticaPresente
          ? 'Pendências críticas presentes'
          : 'Sem pendências críticas',
      severidade: CONFIANCA_SEVERIDADE[confianca.projecao],
      fonte: 'confianca',
    },
  ]

  return cards
}
