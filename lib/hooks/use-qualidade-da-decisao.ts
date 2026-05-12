/**
 * useQualidadeDaDecisao — fonte única de dados da página Qualidade da Decisão.
 *
 * ARQUITETURA
 * -----------
 * Esta página é genérica. Serve para qualquer empresa cliente do CFOup.
 * Os números vêm da camada de dados (após o dono conectar banco/NF-e/ERP
 * na tela /conexoes). O score, drivers, issues, áreas confiáveis e
 * histórico são calculados a partir dos dados reais.
 *
 * HOJE: a empresa ainda não tem conexões ativas.
 * `hasConnections: false` → score null, arrays vazios → UI mostra
 * "Dados insuficientes para calcular qualidade da decisão".
 *
 * AMANHÃ: depois que o dono conectar os dados:
 * - hasConnections vira true
 * - o hook busca /api/qualidade-decisao?companyId=...
 * - a mesma UI renderiza o gauge, drivers, issues, áreas e histórico.
 *
 * Nada na UI muda. Só a fonte.
 */

"use client"

export type Severity = "alta" | "media" | "baixa"

export type DriverIconKey = "alert-triangle" | "clipboard-list" | "info" | "alert-circle"
export type IssueIconKey = "alert-triangle" | "clipboard-list" | "info" | "alert-circle"
export type ReliableIconKey = "wallet" | "file-text" | "users" | "layout-grid"

export type Driver = {
  severity: Severity
  icon: DriverIconKey
  title: string
  desc: string
  impact: string
}

export type Issue = {
  severity: Severity
  icon: IssueIconKey
  title: string
  sub: string
  impactText: string
  action: string
  actionHref: string
}

export type ReliableArea = {
  icon: ReliableIconKey
  title: string
  desc: string
  href: string
}

export type HistoryStep = {
  pct: number
  date: string
  current?: boolean
}

export type Veredito = {
  label: string
  description: string
}

export type QualidadeDaDecisaoData = {
  hasConnections: boolean
  score: number | null
  updatedAt: string | null
  veredito: Veredito | null
  drivers: Driver[]
  issues: Issue[]
  reliableAreas: ReliableArea[]
  history: HistoryStep[]
}

// TODO: substituir pelo fetch real a /api/qualidade-decisao?companyId=...
export function useQualidadeDaDecisao(): QualidadeDaDecisaoData {
  return {
    hasConnections: false,
    score: null,
    updatedAt: null,
    veredito: null,
    drivers: [],
    issues: [],
    reliableAreas: [],
    history: [],
  }
}
