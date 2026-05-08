// ---------------------------------------------------------------------
// Types — Análise Financeira
// Estrutura baseada em analise-financeira.html (cfoup-tese)
// ---------------------------------------------------------------------

// Tipo genérico para KPI
export type KPI = {
  label: string
  valor: string
  delta: string
  deltaType: "up" | "down" | "flat" | "warn"
  highlight?: boolean // fundo amarelo
}

// Tipo genérico para Alerta
export type Alerta = {
  nivel: "critico" | "atencao" | "controle"
  titulo: string
  texto: string
}

// Tipo genérico para Ação
export type Acao = {
  texto: string
  meta: string
}

// Tipo genérico para termo de glossário
export type TermoGlossario = {
  termo: string
  definicao: string
}

// ---------------------------------------------------------------------
// Síntese (aba ✦)
// ---------------------------------------------------------------------
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

// ---------------------------------------------------------------------
// Bloco genérico (Faturamento, Clientes, Auditoria, Fornecedores, Caixa, Ciclo)
// ---------------------------------------------------------------------
export type BlocoOperacional = {
  veredito: string
  leitura: string
  kpis: KPI[]
  alertas: Alerta[]
  acoes: Acao[]
  glossario: TermoGlossario[]
}

// ---------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------
export type HeroFinanceiro = {
  subTitulo: string
  descricao: string
  exercicios: string
  cobertura: string
  fonte: string
  dataBase: string
}

// ---------------------------------------------------------------------
// Dados completos da Análise Financeira
// ---------------------------------------------------------------------
export type AnaliseFinanceiraDados = {
  hero: HeroFinanceiro
  sintese: SinteseFinanceiraData
  faturamento: BlocoOperacional
  clientes: BlocoOperacional
  auditoria: BlocoOperacional
  fornecedores: BlocoOperacional
  caixa: BlocoOperacional
  ciclo: BlocoOperacional
}
