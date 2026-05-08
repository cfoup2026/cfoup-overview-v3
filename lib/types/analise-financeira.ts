// ---------------------------------------------------------------------
// Types — Análise Financeira
// ---------------------------------------------------------------------

export type SinteseKPI = {
  label: string
  valor: string
  sub: string
  subTone?: "pos" | "neg" | "warn" | "muted"
}

export type SinteseAlerta = {
  nivel: "critico" | "atencao" | "controle"
  titulo: string
  texto: string
}

export type SinteseLeitura = {
  tese: string
  funcionou: string
  preocupa: string
  fazerAgora: string
}

export type SinteseAcao = {
  titulo: string
  descricao: string
  meta: string
}

export type SinteseDados = {
  veredito: string
  kpis: SinteseKPI[]
  alertas: SinteseAlerta[]
  leitura: SinteseLeitura
  acoes: SinteseAcao[]
}

export type HeroFinanceiro = {
  subTitulo: string
  descricao: string
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
