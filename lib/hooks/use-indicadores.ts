/**
 * useIndicadores — fonte única de dados da página Indicadores.
 *
 * ARQUITETURA
 * -----------
 * Esta página é genérica. Serve para qualquer empresa cliente do CFOup.
 * Os números vêm da camada de dados (após o dono conectar banco/NF-e/ERP
 * na tela /conexoes). A leitura narrativa é derivada do próprio array
 * de indicadores via gerarLeituraCFOup() e gerarAtencaoAgora().
 *
 * HOJE: a empresa ainda não tem conexões ativas.
 * `hasConnections: false` → array vazio → UI mostra estado honesto.
 *
 * AMANHÃ: depois que o dono conectar os dados:
 * - hasConnections vira true
 * - o hook busca /api/indicadores?companyId=...
 * - a mesma UI renderiza os indicadores e a leitura derivada.
 *
 * Nada na UI muda. Só a fonte.
 */

"use client"

export type Status = "saudavel" | "pressionando" | "risco" | "estavel"

export type Indicator = {
  label: string
  value: string
  delta: string
  refText: string
  status: Status
  leitura: string
}

export type IndicadoresData = {
  hasConnections: boolean
  indicadores: Indicator[]
}

// TODO: substituir pelo fetch real a /api/indicadores?companyId=...
export function useIndicadores(): IndicadoresData {
  return {
    hasConnections: false,
    indicadores: [],
  }
}
