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

// Tipo para linha de tabela de movimentação mensal
export type MovimentoMes = {
  mes: string
  entradas: number
  saidas: number
  saldo: number
  isMelhor?: boolean
  isPior?: boolean
}

// Tipo para linha de tabela de saídas recorrentes
export type SaidaRecorrente = {
  categoria: string
  valorMedio: number
  recorrencia: string
  leitura: string
  acao?: string
}

// Tipo para linha de tabela de clientes (perdidos/queda/alta)
export type ClienteTabela = {
  nome: string
  valor2024?: number
  valor2025?: number
  delta?: number
  deltaPercent?: number
  obs?: string
}

// Tipo para painel dentro de grid-4-paineis
export type PainelGrid = {
  id: string // ex: "A.1", "A.2"
  titulo: string
  conteudo: string // HTML da tabela/conteudo interno
  notaRodape?: string
  notaMarker?: "fato" | "leitura" | "hipotese" | "trajetoria" // marker opcional antes da nota
}

// Tipo para Evidence Block colapsável (suporta HTML ou dados estruturados)
export type EvidenceBlock = {
  titulo: string
  tipo: "html" | "movimento-mensal" | "saidas-recorrentes" | "dois-paineis" | "dois-paineis-2-3" | "tabela-clientes" | "grid-4-paineis"
  // Para tipo "html"
  conteudo?: string
  // Para tipo "movimento-mensal"
  movimentos?: MovimentoMes[]
  totalEntradas?: number
  totalSaidas?: number
  mediaEntradas?: number
  mediaSaidas?: number
  notaRodape?: string
  // Para tipo "saidas-recorrentes"
  saidas?: SaidaRecorrente[]
  totalSaidas2?: number
  // Para tipo "dois-paineis" (grid 2 colunas)
  painelEsquerdo?: { titulo: string; conteudo: string }
  painelDireito?: { titulo: string; conteudo: string }
  // Para tipo "tabela-clientes"
  clientes?: ClienteTabela[]
  subtotalLabel?: string
  subtotalValor?: number
  colunas?: string[] // ex: ["Cliente", "2024", "2025", "Δ"]
  // Para tipo "grid-4-paineis"
  paineis?: PainelGrid[]
}

// Tipo para CTA executivo
export type CTA = {
  eyebrow: string
  texto: string
  ctaLabel: string
  href?: string
  isExport?: boolean // true = botão de export (não navegação)
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
// Checklist Mensal
// ---------------------------------------------------------------------
export type ChecklistStatus = "concluido" | "atencao" | "pendente"

export type ChecklistItem = {
  titulo: string
  contexto?: string
  status: ChecklistStatus
}

export type ChecklistGrupo = {
  titulo: string
  itens: ChecklistItem[]
}

export type ChecklistMensalData = {
  grupos: ChecklistGrupo[]
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
  checklistMensal: ChecklistMensalData
}
