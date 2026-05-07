// ---------------------------------------------------------------------
// Types — Análise Financeira
// ---------------------------------------------------------------------

export type DadosSintese = {
  veredito?: string
  kpis?: { label: string; valor: string; sub: string; subTone?: "pos" | "neg" | "neutral" }[]
  alerts?: { nivel: "critico" | "atencao" | "controle"; titulo: string; texto: string }[]
  leituraExecutiva?: {
    titulo: string
    funcionou: string
    preocupa: string
    fazerAgora: string
    acoes: string[]
  }
}

export type DadosCaixa = {
  veredito?: string
  saldoAtual?: { valor: number; sub: string }
  runwayDias?: { valor: number; sub: string }
  entradas30d?: { valor: number; sub: string }
  saidas30d?: { valor: number; sub: string }
  fluxoCaixa?: {
    categoria: string
    ano2023: number
    ano2024: number
    ano2025: number
    varPct: number
    isSubtotal?: boolean
  }[]
  atencao?: string
  acoes?: string[]
}

export type DadosClientes = {
  // TODO: PR seguinte
}

export type DadosFaturamento = {
  // TODO: PR seguinte
}

export type DadosFornecedor = {
  // TODO: PR seguinte
}

export type DadosCiclo = {
  // TODO: PR seguinte
}

export type DadosAuditoria = {
  // TODO: PR seguinte
}

export type DadosChecklist = {
  // TODO: PR seguinte
}

export type DadosFinanceiros = {
  sintese?: DadosSintese
  caixa?: DadosCaixa
  clientes?: DadosClientes
  faturamento?: DadosFaturamento
  fornecedor?: DadosFornecedor
  ciclo?: DadosCiclo
  auditoria?: DadosAuditoria
  checklist?: DadosChecklist
}
