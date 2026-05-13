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
  highlight?: boolean
  href?: string
}

// Tipo genérico para Alerta
export type Alerta = {
  nivel: "critico" | "atencao" | "controle"
  titulo: string
  texto: string
  href?: string
}

// Tipo genérico para Ação
export type Acao = {
  texto: string
  meta: string
  href?: string
}

// Tipo genérico para termo de glossário
export type TermoGlossario = {
  termo: string
  definicao: string
}

// Tipo para Evidence Block colapsável
export type EvidenceBlock = {
  titulo: string
  conteudo: string // HTML ou texto
}

// Tipo para CTA executivo
export type CTA = {
  eyebrow: string
  texto: string
  ctaLabel: string
  href: string
}

// ---------------------------------------------------------------------
// Síntese (aba ✦)
// ---------------------------------------------------------------------
export type KpiSintese = {
  label: string
  valor: string
  contexto?: string
  href?: string
}

export type AlertaSintese = {
  nivel: "critico" | "atencao" | "controle"
  texto: string
  href?: string
}

export type LeituraExecutiva = {
  principal: string
  oQueFuncionou: string
  oQuePreocupa: string
  oQueFazerAgora: string
}

export type AcaoSintese = {
  titulo: string
  descricao: string
  href?: string
}

export type SinteseFinanceiraData = {
  veredito: string
  kpis: KpiSintese[]
  alertas: AlertaSintese[]
  leitura: LeituraExecutiva
  acoes: AcaoSintese[]
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
  evidenceBlocks?: EvidenceBlock[]
  ctas?: CTA[]
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
