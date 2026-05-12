/**
 * useCenarios — fonte única de dados da página Cenários.
 *
 * ARQUITETURA
 * -----------
 * A estrutura das decisões (alavancas, parâmetros, rótulos) vive na page,
 * porque é UI/template. Os valores, trajetórias, leitura e prompt do chat
 * dependem do caixa real do cliente — esses vêm deste hook.
 *
 * O hook recebe (decisionId, paramValue) e devolve:
 * - baseline: caixa hoje + cenário "sem agir" + trajetória sem agir (13 semanas)
 * - calculo: estado da decisão escolhida com o parâmetro escolhido
 *
 * HOJE: a empresa ainda não tem conexões ativas.
 * `hasConnections: false` → baseline e calculo são null → UI mostra
 * "Conecte dados para simular cenários com base no caixa real."
 *
 * AMANHÃ: depois que o dono conectar os dados:
 * - hasConnections vira true
 * - o hook busca /api/cenarios?decision=...&param=...&companyId=...
 * - a mesma UI renderiza valores, trajetórias e leitura
 *
 * Nada na UI muda. Só a fonte.
 */

"use client"

export type Tone = "positive" | "negative" | "neutral"

export type CenariosBaseline = {
  caixaHoje: string
  semAgir: { value: string; sub: string }
  trajectorySemAgir: number[]
}

export type CenariosCalculo = {
  caixaMinComDecisao: {
    value: string
    sub: string
    tone: "positive" | "negative"
    delta: string
  }
  consequences: {
    caixa: { value: string; detail: string; tone: Tone }
    custo: { value: string; detail: string; tone: Tone }
    folego: { value: string; detail: string; tone: Tone }
  }
  trajectoryComDecisao: number[]
  reading: string
  chatPrompt: string
}

export type CenariosData = {
  hasConnections: boolean
  baseline: CenariosBaseline | null
  calculo: CenariosCalculo | null
}

// TODO: substituir pelo fetch real a /api/cenarios?decision=...&param=...&companyId=...
// Args usados pra futura busca; ignorados no MVP enquanto não há conexões.
export function useCenarios(_decisionId: string, _paramValue: string): CenariosData {
  return {
    hasConnections: false,
    baseline: null,
    calculo: null,
  }
}
