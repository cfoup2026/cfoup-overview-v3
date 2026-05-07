// ---------------------------------------------------------------------
// Types — Análise Financeira
// ---------------------------------------------------------------------

export type SinteseDecisao = {
  titulo: string
  descricao: string
  meta: string
}

export type SinteseDados = {
  tese: string
  decisoes: SinteseDecisao[]
  citacaoFechamento: string
}

export type HeroFinanceiro = {
  exercicios: string
  cobertura: string
  fonte: string
  dataBase: string
}

export type AnaliseFinanceiraDados = {
  hero: HeroFinanceiro
  sintese: SinteseDados
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

export type DadosValidacao = {
  // TODO: PR seguinte
}

export type DadosChecklist = {
  // TODO: PR seguinte
}
