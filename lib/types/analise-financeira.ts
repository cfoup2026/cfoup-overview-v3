// ---------------------------------------------------------------------
// Types — Análise Financeira
// ---------------------------------------------------------------------

export type DadosSintese = {
  periodoDescricao?: string
  fontes?: string[]
  kpis?: { label: string; valor: string; delta?: string; status?: "positivo" | "atencao" | "neutro" }[]
  headlines?: { titulo: string; texto: string; status: "positivo" | "atencao" | "neutro"; link?: { label: string; href: string } }[]
  leituraExecutiva?: string
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
