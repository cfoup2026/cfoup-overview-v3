// ---------------------------------------------------------------------
// Types — Análise Financeira
// Estrutura fiel ao HTML cfoup-tese
// ---------------------------------------------------------------------

// Síntese (aba principal)
export type DecisaoSintese = {
  titulo: string
  descricao: string
  meta: string
}

export type SinteseFinanceiraData = {
  tese: string
  decisoes: DecisaoSintese[]
  callout: string
}

// Hero
export type HeroFinanceiro = {
  subTitulo: string
  descricao: string
  exercicios: string
  cobertura: string
  fonte: string
  dataBase: string
}

// Dados completos da Análise Financeira
export type AnaliseFinanceiraDados = {
  hero: HeroFinanceiro
  sintese: SinteseFinanceiraData
}

// Tipos para abas futuras (stubs)
export type DadosCaixa = {
  // TODO: PR seguinte
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
