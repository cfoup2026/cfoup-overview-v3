/**
 * useCashflow13w — fonte única de dados da página Fluxo de Caixa 13 semanas.
 *
 * ARQUITETURA
 * -----------
 * Esta página é genérica e multi-tenant. Serve para qualquer empresa cliente
 * do CFOup, com N unidades (filiais, CNPJs, centros de custo). A estrutura
 * visual da grade (S1..S13, seções OPERAÇÃO / FINANCIAMENTO / INVESTIMENTO
 * / ENTRE COMPANHIAS, linhas Caixa Início/Final, taxonomia de categorias)
 * vive no componente da página — é UI/template. Tudo que é número, data
 * específica, nome de cliente/fornecedor/banco, valor de saldo e pendência
 * vem deste hook.
 *
 * HOJE: a empresa ainda não tem conexões ativas.
 * `hasConnections: false` → snapshot é null → UI mostra estado vazio honesto.
 *
 * AMANHÃ: depois que o dono conectar os dados:
 * - hasConnections vira true
 * - o hook busca /api/cashflow-13w?unit=...&companyId=...
 * - a mesma UI renderiza a grade, os KPIs, as pendências e as contrapartes.
 *
 * Nada na UI muda. Só a fonte.
 */

"use client"

export type WeekHeader = { label: string; mondayLabel: string }

export type AcaoProblema = {
  label: string
  route?: string
  opensSaldoSheet?: boolean
}

export type Problema = {
  id: string
  title: string
  detail: string
  impact: string
  actions: AcaoProblema[]
}

export type Contraparte = {
  id: string
  nome: string
  tipo: "cliente" | "fornecedor"
}

export type KpiMinimo = {
  value: number
  weekLabel: string
  weekDateLabel: string
}

export type CashflowSnapshot = {
  caixaHoje: number
  kpis: {
    minimo: KpiMinimo
    medio: number
  }
  caixaMinimoOperacional: number
  // Saldos por semana (snapshots, não fluxos)
  caixaInicio: number[]
  caixaFinal: number[]
  // Operação · receitas (positivos)
  crReceber: number[]
  crRecuperacao: number[]
  outrasReceitas: number[]
  // Operação · saídas (negativos)
  cpPagar: number[]
  cpVencidos: number[]
  folha: number[]
  tributosVendas: number[]
  encargosTrab: number[]
  despesasOper: number[]
  // Financiamento
  emprestimosNovos: number[]
  aporteSocios: number[]
  emprestimoFin: number[]
  tarifasIof: number[]
  retiradaSocios: number[]
  // Investimento
  vendaEquip: number[]
  compraEquip: number[]
  // Entre companhias
  recebInterco: number[]
  pagtoInterco: number[]
  // "Depois da S13"
  beyondCrReceber: number
  beyondCpPagar: number
  beyondEmprestimo: number
}

export type CashflowData = {
  hasConnections: boolean
  weeks: WeekHeader[]
  snapshot: CashflowSnapshot | null
  pendencias: Problema[]
  contrapartes: Contraparte[]
}

// =====================================================================
// Geração dinâmica das 13 semanas (a partir da segunda da semana atual)
// Fato calendarial; não depende de conexão.
// =====================================================================

const MESES_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function buildWeeksFromToday(): WeekHeader[] {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=dom, 1=seg, ...
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - daysToMonday)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 13 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i * 7)
    const day = String(d.getDate()).padStart(2, "0")
    const month = MESES_PT[d.getMonth()]
    const year = String(d.getFullYear()).slice(-2)
    return {
      label: `S${i + 1}`,
      mondayLabel: `${day}/${month}/${year}`,
    }
  })
}

// TODO: substituir pelo fetch real a /api/cashflow-13w?unit=...&companyId=...
// O parâmetro `unit` é usado pra filtrar Consolidado vs Filial X.
export function useCashflow13w(_activeUnit: string): CashflowData {
  return {
    hasConnections: false,
    weeks: buildWeeksFromToday(),
    snapshot: null,
    pendencias: [],
    contrapartes: [],
  }
}
