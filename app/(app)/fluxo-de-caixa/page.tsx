"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { ChevronDown, ChevronRight, RefreshCw, Plus, Building2, AlertTriangle, ArrowDownRight, ArrowUpRight, PencilLine, Tags, Gauge, MessageSquare, Wifi, Hand, CheckCircle2, Eye, BarChart3, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command"

const GHOST_BTN = "inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium text-muted-foreground rounded-md hover:bg-[rgba(7,29,59,0.06)] hover:text-[var(--brand-navy)] transition"

// ---------------------------------------------------------------------
// Mocks para QuickAddForecastSheet
// ---------------------------------------------------------------------
const CATEGORIAS_ENTRADA = ["CR a receber", "CR vencidos", "Empréstimo recebido", "Aporte", "Outras entradas"]
const CATEGORIAS_SAIDA = ["Folha", "Fornecedores", "Tributos", "Empréstimo · pagamento", "Despesas operacionais", "Outras saídas"]

type Contraparte = { id: string; nome: string; tipo: "cliente" | "fornecedor" }
const CONTRAPARTES: Contraparte[] = [
  { id: "c1", nome: "Cliente ABC Ltda", tipo: "cliente" },
  { id: "c2", nome: "Cliente DEF Ltda", tipo: "cliente" },
  { id: "c3", nome: "Cliente GHI Ltda", tipo: "cliente" },
  { id: "f1", nome: "Fornecedor XYZ", tipo: "fornecedor" },
  { id: "f2", nome: "Fornecedor WWW", tipo: "fornecedor" },
  { id: "t1", nome: "Receita Federal", tipo: "fornecedor" },
]

/**
 * /fluxo-de-caixa
 *
 * DFC pelo método direto em janela rolante de 13 semanas, com 4 atividades
 * — Operação, Financiamento, Investimento e Entre Companhias — cada qual
 * fechando em uma linha "Líquido". Linhas de fechamento agregam Variação
 * Líquida e os saldos de Início/Final do período.
 *
 * DEMO visual. Quando o Núcleo de Dados for plugado, os arrays MOCK_*
 * abaixo são substituídos por um hook do tipo useCashflow13w(activeUnit)
 * que devolve a mesma forma.
 */

// =====================================================================
// Subtotal background (kept as const for table cells)
// =====================================================================
const SUBTOTAL_BG = "rgba(21,103,200,0.08)"

// =====================================================================
// Janela de 13 semanas (sempre segunda → domingo)
// =====================================================================
type WeekHeader = { label: string; mondayLabel: string }
const WEEKS: WeekHeader[] = [
  { label: "S1",  mondayLabel: "04/Mai/26" },
  { label: "S2",  mondayLabel: "11/Mai/26" },
  { label: "S3",  mondayLabel: "18/Mai/26" },
  { label: "S4",  mondayLabel: "25/Mai/26" },
  { label: "S5",  mondayLabel: "01/Jun/26" },
  { label: "S6",  mondayLabel: "08/Jun/26" },
  { label: "S7",  mondayLabel: "15/Jun/26" },
  { label: "S8",  mondayLabel: "22/Jun/26" },
  { label: "S9",  mondayLabel: "29/Jun/26" },
  { label: "S10", mondayLabel: "06/Jul/26" },
  { label: "S11", mondayLabel: "13/Jul/26" },
  { label: "S12", mondayLabel: "20/Jul/26" },
  { label: "S13", mondayLabel: "27/Jul/26" },
]

// =====================================================================
// Mocks cliente piloto (engenharia mínima em S13 = -251.633)
// =====================================================================
const CAIXA_MINIMO_OPERACIONAL = 25_000

// REGRA CONTÁBIL — saldos não somam, fluxos somam.
// Caixa Início e Caixa Final são SALDOS (snapshots no tempo), não fluxos:
//   - Total das 13s   = snapshot da S1 (Início) ou S13 (Final), NÃO soma do array.
//   - Depois da S13   = não aplicável → exibido como "—".
// Já as linhas de fluxo (Receitas/Saídas, Líquidos por atividade,
// Variação Líquida) somam matematicamente as 13 colunas no Total.
// Invariante por semana: Caixa Final[i] = Caixa Início[i] + Variação Líquida[i].
// Invariante de horizonte: Caixa Final[12] = Caixa Início[0] + Σ Variação Líquida.
const CAIXA_INICIO = [34_494, 27_841, 30_745, -27_880, -46_758, -76_600, -103_819, -145_356, -151_348, -167_614, -173_855, -240_239, -246_232]
const CAIXA_FINAL  = [27_841, 30_745, -27_880, -46_758, -76_600, -103_819, -145_356, -151_348, -167_614, -173_855, -240_239, -246_232, -251_633]

// --- OPERAÇÃO · Receitas (positivos) ---
const CR_RECEBER       = [44_675, 48_543, 27_337, 18_034, 1_460, 0, 17_457, 0, 0, 0, 0, 0, 0]
const CR_RECUPERACAO   = [22_488, 22_488, 22_488, 22_488, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const OUTRAS_RECEITAS  = Array(13).fill(0)

// --- OPERAÇÃO · Saídas (negativos) ---
const CP_A_PAGAR       = [-27_721, -25_507, -20_002, -24_169, -15_037, -14_427, -375, -591, 0, -840, -375, -591, 0]
const CP_VENCIDOS      = [-29_829, -29_829, -29_829, -29_829, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const FOLHA            = Array.from({ length: 13 }, (_, i) => ([0, 2, 4, 6, 8, 10].includes(i) ? -10_864 : 0))
const TRIBUTOS_VENDAS  = Array.from({ length: 13 }, (_, i) => ([2, 6, 10].includes(i) ? -42_353 : 0))
const ENCARGOS_TRAB    = Array(13).fill(0)
const DESPESAS_OPER    = Array(13).fill(-4_260)

// --- FINANCIAMENTO ---
const EMPRESTIMOS_NOVOS = Array(13).fill(0)
const APORTE_SOCIOS    = Array(13).fill(0)
const EMPRESTIMO_FIN   = Array.from({ length: 13 }, (_, i) => ([1, 5, 10].includes(i) ? -7_390 : 0))
const TARIFAS_IOF      = Array(13).fill(-1_142)
const RETIRADA_SOCIOS  = Array(13).fill(0)

// --- INVESTIMENTO ---
const VENDA_EQUIP      = Array(13).fill(0)
const COMPRA_EQUIP     = Array(13).fill(0)

// --- ENTRE COMPANHIAS ---
const RECEB_INTERCO    = Array(13).fill(0)
const PAGTO_INTERCO    = Array(13).fill(0)

// --- "Depois da S13" (após S13) ---
const BEYOND_CR_RECEBER = 18_520
const BEYOND_CP_A_PAGAR = -12_430
const BEYOND_EMPRESTIMO = -22_170

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
const sumByWeek = (arrs: number[][]) =>
  Array.from({ length: 13 }, (_, i) => arrs.reduce((acc, a) => acc + a[i], 0))

// --- Subtotais por sub-grupo (sempre visíveis, mesmo com sub-rows expandidas) ---
const REC_OP_SUB_BY_WEEK = sumByWeek([CR_RECEBER, CR_RECUPERACAO, OUTRAS_RECEITAS])
const SAI_OP_SUB_BY_WEEK = sumByWeek([CP_A_PAGAR, CP_VENCIDOS, FOLHA, TRIBUTOS_VENDAS, ENCARGOS_TRAB, DESPESAS_OPER])
const REC_OP_BEYOND = BEYOND_CR_RECEBER + 0 + 0
const SAI_OP_BEYOND = BEYOND_CP_A_PAGAR + 0 + 0 + 0 + 0 + 0

// --- Líquidos por atividade ---
const CL_OPERACAO = REC_OP_SUB_BY_WEEK.map((v, i) => v + SAI_OP_SUB_BY_WEEK[i])
const CL_FINANCIAMENTO = sumByWeek([EMPRESTIMOS_NOVOS, APORTE_SOCIOS, EMPRESTIMO_FIN, TARIFAS_IOF, RETIRADA_SOCIOS])
const CL_INVESTIMENTO = sumByWeek([VENDA_EQUIP, COMPRA_EQUIP])
const CL_INTERCO = sumByWeek([RECEB_INTERCO, PAGTO_INTERCO])

const CL_OPERACAO_BEYOND = REC_OP_BEYOND + SAI_OP_BEYOND
const CL_FIN_BEYOND = 0 + 0 + BEYOND_EMPRESTIMO + 0 + 0
const CL_INV_BEYOND = 0
const CL_IC_BEYOND = 0

const VARIACAO_LIQUIDA = CL_OPERACAO.map((_, i) => CL_OPERACAO[i] + CL_FINANCIAMENTO[i] + CL_INVESTIMENTO[i] + CL_INTERCO[i])
const VARIACAO_BEYOND = CL_OPERACAO_BEYOND + CL_FIN_BEYOND + CL_INV_BEYOND + CL_IC_BEYOND

// =====================================================================
// Formatador compacto
// =====================================================================
function fmtCompact(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—"
  if (v === 0) return "—"
  const abs = Math.abs(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })
  return v < 0 ? `(${abs})` : abs
}
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 0 })
function fmtBRL(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—"
  return BRL.format(v)
}

// =====================================================================
// Veredito
// =====================================================================
type Veredito = "LIMPO" | "ATENCAO" | "ALERTA" | "CRITICO" | "DADOS_INSUFICIENTES"
const VEREDITO_ATUAL: Veredito = "DADOS_INSUFICIENTES"
const VEREDITO_STYLES: Record<Veredito, { label: string; bg: string; fg: string }> = {
  LIMPO: { label: "LIMPO", bg: "rgba(54,186,88,0.14)", fg: "var(--brand-green)" },
  ATENCAO: { label: "ATENÇÃO", bg: "rgba(224,139,0,0.14)", fg: "var(--brand-warning)" },
  ALERTA: { label: "ALERTA", bg: "rgba(224,139,0,0.18)", fg: "var(--brand-warning)" },
  CRITICO: { label: "CRÍTICO", bg: "rgba(209,67,67,0.14)", fg: "var(--brand-error-soft)" },
  DADOS_INSUFICIENTES: { label: "DADOS INSUFICIENTES", bg: "var(--muted)", fg: "var(--muted-foreground)" },
}

// =====================================================================
// Glossário inline (tooltip on hover)
// =====================================================================
type GlossaryKey = "CP" | "CR" | "DAS" | "ICMS" | "IOF" | "PMR" | "PMP"
const GLOSSARY: Record<GlossaryKey, { title: string; body: string }> = {
  CP: { title: "Contas a Pagar", body: "Obrigações da empresa com fornecedores, impostos e demais credores ainda não quitadas." },
  CR: { title: "Contas a Receber", body: "Valores que a empresa tem para receber de clientes referentes a vendas já faturadas." },
  DAS: { title: "Documento de Arrecadação do Simples", body: "Guia única do Simples Nacional que reúne os tributos federais, estaduais e municipais." },
  ICMS: { title: "Imposto sobre Circulação de Mercadorias e Serviços", body: "Tributo estadual incidente sobre vendas, serviços de transporte e comunicação." },
  IOF: { title: "Imposto sobre Operações Financeiras", body: "Tributo federal sobre crédito, câmbio, seguros e operações com títulos." },
  PMR: { title: "Prazo Médio de Recebimento", body: "Média de dias entre a venda e o efetivo recebimento dos clientes." },
  PMP: { title: "Prazo Médio de Pagamento", body: "Média de dias entre a compra e o pagamento dos fornecedores." },
}

function GlossaryTerm({ term, children }: { term: GlossaryKey; children: ReactNode }) {
  const entry = GLOSSARY[term]
  return (
    <span className="group relative inline-block">
      <span className="cursor-help border-b border-dotted border-muted-foreground/50" aria-describedby={`gloss-${term}`}>
        {children}
      </span>
      <span
        id={`gloss-${term}`}
        role="tooltip"
        className="pointer-events-none invisible absolute left-0 top-full z-[60] mt-1.5 w-64 rounded-md bg-[var(--brand-navy)] px-3 py-2 text-[12px] font-normal normal-case leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
        style={{ boxShadow: "0 8px 20px -6px rgba(7,29,59,0.35)" }}
      >
        <strong className="block text-[12px] font-semibold">{entry.title}</strong>
        <span className="mt-0.5 block opacity-90">{entry.body}</span>
      </span>
    </span>
  )
}

// =====================================================================
// Evento Mock (placeholder para integração futura)
// =====================================================================
type Evento = {
  id: string
  direcao: "entrada" | "saida"
  valor: number
  data: string
  categoria: string
  contraparte: string
  status: "confirmado" | "estimado"
  confianca: "A" | "M" | "B"
  observacao?: string
  origem: "API" | "manual"
}
const EVENTO_MOCK: Evento = {
  id: "ev1",
  direcao: "entrada",
  valor: 22488,
  data: "12/05/2026",
  categoria: "CR a receber",
  contraparte: "Cliente ABC Ltda",
  status: "estimado",
  confianca: "M",
  origem: "API",
}

type EventoCelula = { id: string; data: string; contraparte: string; valor: number; status: "confirmado" | "estimado" }
const EVENTOS_CELULA_MOCK: EventoCelula[] = [
  { id: "e1", data: "08/05", contraparte: "Cliente ABC", valor: 22488, status: "confirmado" },
  { id: "e2", data: "09/05", contraparte: "Cliente DEF", valor: 12000, status: "estimado" },
  { id: "e3", data: "10/05", contraparte: "Cliente GHI", valor: 10187, status: "estimado" },
]

type Semana = { numero: number; dateRange: string; caixaInicial: number; caixaFinal: number; minimo: number; totalEntradas: number; totalSaidas: number; liquido: number }
const SEMANA_MOCK: Semana = { numero: 6, dateRange: "17-23 jun", caixaInicial: -76600, caixaFinal: -103819, minimo: -110000, totalEntradas: 0, totalSaidas: 15018, liquido: -15018 }

// =====================================================================
// Página
// =====================================================================
// NOTA — multi-tenant. CFOup atende 70k+ clientes e cada um tem N unidades
// (filiais, CNPJs, centros de custo) com nomes próprios vindos do source
// system (ERP, contábil, Open Finance). O nome do cliente (tenant) NÃO
// aparece nesta tela — vem do sidebar/header global do app.
// Esta tela é cliente-agnostic: o header recebe um array dinâmico de unidades
// e adiciona a opção "Consolidado" como PRIMEIRO item da lista (também o
// default selecionado). Ver bloco de comentário acima de UNIDADES para o
// shape esperado em produção.
type UnidadeId = string

export default function FluxoDeCaixa13Semanas() {
  const [unidade, setUnidade] = useState<UnidadeId>("consolidado")
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null)
  const [openEvento, setOpenEvento] = useState(false)
  const [openComposicao, setOpenComposicao] = useState(false)
  const [openSemana, setOpenSemana] = useState(false)

  const handleRowClick = () => {
    setSelectedEvento(EVENTO_MOCK)
    setOpenEvento(true)
  }

  const handleCellClick = () => {
    setOpenComposicao(true)
  }

  const handleWeekClick = () => {
    setOpenSemana(true)
  }

  const handleEventoFromComposicao = () => {
    setOpenComposicao(false)
    setSelectedEvento(EVENTO_MOCK)
    setOpenEvento(true)
  }
  
  return (
  <>
  <Zone1Header unidade={unidade} setUnidade={setUnidade} />
  <Zone2Kpis />
  <Zone3Grid onRowClick={handleRowClick} onCellClick={handleCellClick} onWeekClick={handleWeekClick} />
  <EventoSheet evento={selectedEvento} open={openEvento} onOpenChange={setOpenEvento} />
  <ComposicaoSheet open={openComposicao} onOpenChange={setOpenComposicao} onEventoClick={handleEventoFromComposicao} />
  <SemanaSheet open={openSemana} onOpenChange={setOpenSemana} />
  </>
  )
  }

// ---------------------------------------------------------------------
// Zona 1 — Header (dropdown de unidades)
// ---------------------------------------------------------------------
// PLACEHOLDER MOCK — em produção, as N filiais virão dinamicamente do
// source system do cliente (ERP, contábil, Open Finance). "Consolidado"
// é sempre o PRIMEIRO item e representa a soma das filiais com
// transferências internas neutralizadas; é também o default selecionado.
// Os labels "Filial 1" / "Filial 2" abaixo são placeholders genéricos:
// CFOup é multi-tenant para 70k+ clientes com qualquer número de
// unidades (1, 10, 100). Pill segmentado não escala — dropdown sim.
// Para tenants com listas longas (50+ unidades) adicionar filter/search
// no dropdown numa iteração futura. Para o MVP, dropdown simples basta.
// Estrutura esperada em prod:
//   const filiais = await fetchFiliais(tenantId)            // [{id, label}]
//   const UNIDADES = [{ id: "consolidado", label: "Consolidado" }, ...filiais]
const UNIDADES: { id: UnidadeId; label: string }[] = [
  { id: "consolidado", label: "Consolidado" },
  { id: "filial-1", label: "Filial 1" },
  { id: "filial-2", label: "Filial 2" },
]

function Zone1Header({
  unidade,
  setUnidade,
}: {
  unidade: UnidadeId
  setUnidade: (v: UnidadeId) => void
}) {
  const activeLabel = UNIDADES.find((u) => u.id === unidade)?.label ?? "Consolidado"
  const [sheetOpen, setSheetOpen] = useState(false)
  return (
    <header className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
      <div className="flex items-baseline gap-2 flex-wrap">
        <h1 className="text-[13px] font-bold leading-none text-[var(--brand-navy)] tracking-tight">Fluxo de Caixa 13 Semanas</h1>
        <span className="text-[11px] text-muted-foreground">· há 2 min</span>
      </div>
      <div className="flex items-center gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger className={GHOST_BTN}>
            <Building2 className="h-3 w-3 text-muted-foreground" />{activeLabel}<ChevronDown className="h-3 w-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            {UNIDADES.map((u) => (
              <DropdownMenuItem key={u.id} onClick={() => setUnidade(u.id)} className="text-[12px]">
                {u.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button type="button" className={GHOST_BTN}>
          <RefreshCw className="h-3 w-3 text-muted-foreground" />Atualizar
        </button>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button type="button" className={GHOST_BTN}>
              <Plus className="h-3 w-3 text-[var(--brand-blue)]" />Adicionar previsão
            </button>
          </SheetTrigger>
          <QuickAddForecastSheet onClose={() => setSheetOpen(false)} />
        </Sheet>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------
// Quick Add Sheet — evento futuro (inline component)
// ---------------------------------------------------------------------
function QuickAddForecastSheet({ onClose }: { onClose: () => void }) {
  const [valor, setValor] = useState("")
  const [direcao, setDirecao] = useState<"entrada" | "saida">("entrada")
  const [data, setData] = useState("")
  const [categoria, setCategoria] = useState("")
  const [contraparte, setContraparte] = useState("")
  const [status, setStatus] = useState<"confirmado" | "estimado">("estimado")
  const [confianca, setConfianca] = useState<"Alta" | "Média" | "Baixa">("Média")
  const [obs, setObs] = useState("")
  const [showObs, setShowObs] = useState(false)
  const [contraparteOpen, setContraparteOpen] = useState(false)

  const maskValor = (v: string) => {
    const digits = v.replace(/\D/g, "")
    if (!digits) return ""
    return (parseInt(digits, 10) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }
  const maskData = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8)
    if (d.length <= 2) return d
    if (d.length <= 4) return d.slice(0, 2) + "/" + d.slice(2)
    return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4)
  }

  const handleDirecaoChange = (dir: "entrada" | "saida") => {
    setDirecao(dir)
    setCategoria("")
  }

  const handleStatusChange = (s: "confirmado" | "estimado") => {
    setStatus(s)
    if (s === "confirmado") setConfianca("Alta")
    else setConfianca("Média")
  }

  const handleSubmit = () => {
    console.log({ valor, direcao, data, categoria, contraparte, status, confianca, obs })
    onClose()
  }

  const PILL = "h-6 px-3 text-[11px] font-semibold rounded-full border transition"
  const PILL_ACTIVE = "bg-[rgba(21,103,200,0.10)] border-[rgba(21,103,200,0.40)] text-[var(--brand-blue)]"
  const PILL_INACTIVE = "border-border text-muted-foreground hover:border-[rgba(21,103,200,0.30)]"
  const DIR_BTN = "flex-1 h-8 flex items-center justify-center gap-1.5 border rounded-md transition text-[10px] font-semibold"
  const DIR_ACTIVE = "bg-[rgba(21,103,200,0.10)] border-[rgba(21,103,200,0.40)] text-[var(--brand-blue)]"
  const DIR_INACTIVE = "border-border text-muted-foreground hover:border-[rgba(21,103,200,0.30)]"
  const LABEL = "text-[10px] font-semibold text-muted-foreground"
  const INPUT_BASE = "w-full border-0 border-b border-border bg-transparent outline-none focus:border-[var(--brand-blue)] transition placeholder:text-muted-foreground/60"

  const valorColor = direcao === "entrada" ? "var(--brand-navy)" : "var(--brand-error-soft)"

  return (
    <SheetContent side="right" className="w-[340px] p-[14px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
        <span className="text-[14px] font-bold text-[var(--brand-navy)]">Adicionar previsão</span>
        <button type="button" onClick={onClose} className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-[rgba(7,29,59,0.06)] transition">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Linha 1: Direção */}
      <div className="flex gap-1 mb-3">
        <button
          type="button"
          onClick={() => handleDirecaoChange("entrada")}
          className={`${DIR_BTN} ${direcao === "entrada" ? DIR_ACTIVE : DIR_INACTIVE}`}
          style={{ borderWidth: "0.5px" }}
        >
          <ArrowDownRight className="h-3 w-3" strokeWidth={2} />
          Entrada
        </button>
        <button
          type="button"
          onClick={() => handleDirecaoChange("saida")}
          className={`${DIR_BTN} ${direcao === "saida" ? DIR_ACTIVE : DIR_INACTIVE}`}
          style={{ borderWidth: "0.5px" }}
        >
          <ArrowUpRight className="h-3 w-3" strokeWidth={2} />
          Saída
        </button>
      </div>

      {/* Linha 2: Valor */}
      <div className="mb-3">
        <label className={LABEL}>Valor</label>
        <input
          type="text"
          value={valor}
          onChange={(e) => setValor(maskValor(e.target.value))}
          placeholder="R$ 0,00"
          className={`${INPUT_BASE} h-8 text-[18px] font-extrabold tabular-nums mt-0.5`}
          style={{ color: valorColor }}
        />
      </div>

      {/* Linha 3: Data + Categoria */}
      <div className="flex gap-2 mb-3">
        <div className="w-[120px]">
          <label className={LABEL}>Data esperada</label>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(maskData(e.target.value))}
            placeholder="DD/MM/AAAA"
            className={`${INPUT_BASE} h-6 text-[12px] mt-0.5`}
          />
        </div>
        <div className="flex-1">
          <label className={LABEL}>Categoria</label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="h-6 text-[13px] font-semibold border-0 border-b border-border bg-transparent rounded-none px-1 focus:ring-0 focus:border-[var(--brand-blue)] mt-0.5">
              <SelectValue placeholder="escolha a categoria" />
            </SelectTrigger>
            <SelectContent>
              {(direcao === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA).map((c) => (
                <SelectItem key={c} value={c} className="text-[12px]">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Linha 4: Cliente ou fornecedor */}
      <div className="mb-3">
        <label className={LABEL}>Cliente ou fornecedor</label>
        <Popover open={contraparteOpen} onOpenChange={setContraparteOpen}>
          <PopoverTrigger className="w-full h-6 text-[13px] font-semibold text-[var(--brand-navy)] border-0 border-b border-border bg-transparent rounded-none px-1 text-left flex items-center justify-between hover:border-[var(--brand-blue)] transition mt-0.5">
            <span className={contraparte ? "" : "text-muted-foreground font-medium"}>{contraparte || "buscar cliente ou fornecedor"}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0" align="start">
            <Command>
              <CommandInput placeholder="buscar..." className="text-[12px] h-9" />
              <CommandList>
                <CommandEmpty className="text-[11px] py-3 px-3 text-muted-foreground text-center">nenhum resultado</CommandEmpty>
                <CommandGroup>
                  {CONTRAPARTES.map((cp) => (
                    <CommandItem key={cp.id} value={cp.nome} onSelect={() => { setContraparte(cp.nome); setContraparteOpen(false) }} className="text-[12px] flex items-center justify-between">
                      <span>{cp.nome}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{cp.tipo}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Linha 5: Status */}
      <div className="flex items-center gap-2 mb-2">
        <span className={LABEL}>Status</span>
        <button
          type="button"
          onClick={() => handleStatusChange("estimado")}
          className={`${PILL} ${status === "estimado" ? PILL_ACTIVE : PILL_INACTIVE}`}
          style={{ borderWidth: "0.5px" }}
        >
          Estimado
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange("confirmado")}
          className={`${PILL} ${status === "confirmado" ? PILL_ACTIVE : PILL_INACTIVE}`}
          style={{ borderWidth: "0.5px" }}
        >
          Confirmado
        </button>
      </div>

      {/* Linha 6: Confiança */}
      <div className="flex items-center gap-2 mb-3">
        <span className={LABEL}>Confiança</span>
        {(["Alta", "Média", "Baixa"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setConfianca(c)}
            className={`${PILL} ${confianca === c ? PILL_ACTIVE : PILL_INACTIVE}`}
            style={{ borderWidth: "0.5px" }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Linha 7: Observação */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setShowObs(!showObs)}
          className="text-[11px] text-muted-foreground hover:text-[var(--brand-blue)] transition"
        >
          + Observação
        </button>
        {showObs && (
          <textarea
            rows={2}
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="anotação livre"
            className="w-full mt-2 p-2 text-[12px] border rounded-md bg-transparent outline-none focus:border-[var(--brand-blue)] transition placeholder:text-muted-foreground/60 resize-none"
            style={{ borderWidth: "0.5px", borderColor: "var(--border)" }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-border">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-8 bg-[var(--brand-navy)] text-white text-[12px] font-bold rounded-md hover:bg-[var(--brand-blue)] transition"
        >
          Adicionar previsão
        </button>
      </div>
    </SheetContent>
  )
}

// ---------------------------------------------------------------------
// Evento Sheet — detalhes + 5 ações de revisão
// ---------------------------------------------------------------------
function EventoSheet({ evento, open, onOpenChange }: { evento: Evento | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!evento) return null

  const DirIcon = evento.direcao === "entrada" ? ArrowDownRight : ArrowUpRight
  const dirColor = evento.direcao === "entrada" ? "var(--brand-navy)" : "var(--brand-error-soft)"
  const OrigemIcon = evento.origem === "API" ? Wifi : Hand
  const origemText = evento.origem === "API" ? "Importado · Pluggy CEF" : "Manual · adicionado por você"

  const statusStyles = evento.status === "confirmado"
    ? "text-[var(--brand-green)] border-[rgba(54,186,88,0.30)] bg-[rgba(54,186,88,0.08)]"
    : "text-[var(--brand-warning)] border-[rgba(224,139,0,0.30)] bg-[rgba(224,139,0,0.08)]"

  const handleAction = (action: string) => {
    console.log("Ação:", action, "evento:", evento.id)
    onOpenChange(false)
  }

  const ACTION_ROW = "flex items-center gap-2.5 px-2 py-2.5 rounded-md hover:bg-[rgba(21,103,200,0.05)] transition cursor-pointer w-full text-left"

  const actions = [
    { icon: CheckCircle2, title: "Confirmar como firme", sub: "marcar como documentado · confiança alta" },
    { icon: PencilLine, title: "Editar valor ou data", sub: "ajustar projeção" },
    { icon: Tags, title: "Reclassificar", sub: "mudar categoria ou bucket" },
    { icon: Gauge, title: "Ajustar confiança", sub: "alta · média · baixa" },
    { icon: MessageSquare, title: "Adicionar observação", sub: "anotação livre" },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[360px] p-[14px]">
        {/* Eyebrow */}
        <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span className="text-[10px] uppercase tracking-[0.10em] text-muted-foreground font-medium">
            EVENTO · CF13
          </span>
        </div>

        {/* Bloco identidade */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <DirIcon className="h-4 w-4 shrink-0" style={{ color: dirColor }} />
            <span className="text-[20px] font-extrabold tabular-nums" style={{ color: dirColor }}>
              R$ {evento.valor.toLocaleString("pt-BR")}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {evento.data} · {evento.categoria} · {evento.contraparte}
          </p>
          <p className="text-[10.5px] text-muted-foreground mt-1.5 flex items-center gap-1">
            <OrigemIcon className="h-2.5 w-2.5" />
            {origemText}
          </p>
        </div>

        {/* Bloco status atual */}
        <div className="flex items-center gap-1.5 mb-3 pb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span
            className={`h-5 px-2 rounded-full text-[10.5px] font-semibold inline-flex items-center ${statusStyles}`}
            style={{ borderWidth: "0.5px" }}
          >
            {evento.status === "confirmado" ? "Confirmado" : "Estimado"}
          </span>
          <span
            className="h-5 px-2 rounded-full text-[10.5px] font-semibold text-muted-foreground inline-flex items-center"
            style={{ borderWidth: "0.5px", borderColor: "var(--border)" }}
          >
            Confiança {evento.confianca}
          </span>
        </div>

        {/* 5 ações verticais */}
        <div className="flex flex-col gap-0.5">
          {actions.map((a) => (
            <button key={a.title} type="button" className={ACTION_ROW} onClick={() => handleAction(a.title)}>
              <a.icon className="h-3.5 w-3.5 text-[var(--brand-blue)] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[var(--brand-navy)] leading-tight">{a.title}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{a.sub}</p>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------
// Composição Sheet — lista de eventos que somam o valor da célula
// ---------------------------------------------------------------------
function ComposicaoSheet({ open, onOpenChange, onEventoClick }: { open: boolean; onOpenChange: (v: boolean) => void; onEventoClick: () => void }) {
  const total = EVENTOS_CELULA_MOCK.reduce((acc, e) => acc + e.valor, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[360px] p-[14px]">
        {/* Eyebrow */}
        <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span className="text-[10px] uppercase tracking-[0.10em] text-muted-foreground font-medium">
            COMPOSIÇÃO · S1 · CR A RECEBER
          </span>
        </div>

        {/* Bloco resumo */}
        <div className="mb-3 pb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <p className="text-[20px] font-extrabold tabular-nums text-[var(--brand-navy)]">
            R$ {total.toLocaleString("pt-BR")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {EVENTOS_CELULA_MOCK.length} eventos · entrada
          </p>
        </div>

        {/* Lista de eventos */}
        <div className="flex flex-col gap-0.5">
          {EVENTOS_CELULA_MOCK.map((e) => {
            const statusStyle = e.status === "confirmado"
              ? "text-[var(--brand-green)] border-[rgba(54,186,88,0.30)] bg-[rgba(54,186,88,0.08)]"
              : "text-[var(--brand-warning)] border-[rgba(224,139,0,0.30)] bg-[rgba(224,139,0,0.08)]"
            return (
              <button
                key={e.id}
                type="button"
                onClick={onEventoClick}
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[rgba(21,103,200,0.05)] transition cursor-pointer w-full text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--brand-navy)] leading-tight">
                    {e.data} · {e.contraparte}
                  </p>
                  <span
                    className={`inline-flex items-center mt-1 h-4 px-1.5 text-[10px] font-semibold rounded-full ${statusStyle}`}
                    style={{ borderWidth: "0.5px" }}
                  >
                    {e.status === "confirmado" ? "Confirmado" : "Estimado"}
                  </span>
                </div>
                <span className="text-[12px] font-bold tabular-nums text-[var(--brand-navy)]">
                  R$ {e.valor.toLocaleString("pt-BR")}
                </span>
                <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
              </button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------
// Semana Sheet — visão consolidada da semana
// ---------------------------------------------------------------------
function SemanaSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const s = SEMANA_MOCK

  const fmtVal = (v: number) => {
    const abs = Math.abs(v)
    const formatted = abs >= 1000 ? `${(abs / 1000).toFixed(0)}k` : abs.toLocaleString("pt-BR")
    return v < 0 ? `-R$ ${formatted}` : `R$ ${formatted}`
  }
  const colorFor = (v: number) => v < 0 ? "var(--brand-error-soft)" : "var(--brand-navy)"

  const handleAction = (action: string) => {
    console.log("Ação semana:", action)
    onOpenChange(false)
  }

  const ACTION_ROW = "flex items-center gap-2.5 px-2 py-2.5 rounded-md hover:bg-[rgba(21,103,200,0.05)] transition cursor-pointer w-full text-left"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] p-[14px]">
        {/* Eyebrow */}
        <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span className="text-[10px] uppercase tracking-[0.10em] text-muted-foreground font-medium">
            SEMANA · S{s.numero} · {s.dateRange.toUpperCase()}
          </span>
        </div>

        {/* Bloco saldo */}
        <div className="mb-3 pb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          {[
            { label: "Caixa inicial", value: s.caixaInicial },
            { label: "Caixa final", value: s.caixaFinal },
            { label: "Mínimo da semana", value: s.minimo },
          ].map((item) => (
            <div key={item.label} className="flex items-baseline gap-1.5 py-1">
              <span className="text-[11px] text-muted-foreground font-medium">{item.label}</span>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: colorFor(item.value) }}>
                {fmtVal(item.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Bloco totais */}
        <div className="mb-3 pb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <div className="flex items-baseline gap-1.5 py-1">
            <span className="text-[11px] text-muted-foreground font-medium">Entradas</span>
            <span className="text-[13px] font-bold tabular-nums text-[var(--brand-navy)]">
              {fmtVal(s.totalEntradas)}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 py-1">
            <span className="text-[11px] text-muted-foreground font-medium">Saídas</span>
            <span className="text-[13px] font-bold tabular-nums text-[var(--brand-error-soft)]">
              {fmtVal(s.totalSaidas)}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 py-1">
            <span className="text-[11px] text-muted-foreground font-medium">Líquido</span>
            <span className="text-[13px] font-bold tabular-nums" style={{ color: colorFor(s.liquido) }}>
              {fmtVal(s.liquido)}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-0.5">
          <button type="button" className={ACTION_ROW} onClick={() => handleAction("Ver todos eventos da semana")}>
            <Eye className="h-3.5 w-3.5 text-[var(--brand-blue)] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[var(--brand-navy)] leading-tight">Ver todos eventos da semana</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">lista completa de entradas e saídas</p>
            </div>
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>
          <button type="button" className={ACTION_ROW} onClick={() => handleAction("Comparar Forecast vs Actual")}>
            <BarChart3 className="h-3.5 w-3.5 text-[var(--brand-blue)] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[var(--brand-navy)] leading-tight">Comparar Forecast vs Actual</p>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">previsto contra realizado</p>
            </div>
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------
// Zona 2 — KPIs (linha tipográfica compacta)
// ---------------------------------------------------------------------
function Zone2Kpis() {
  const veredito = VEREDITO_STYLES[VEREDITO_ATUAL]
  return (
    <section className="mb-3 flex flex-wrap items-baseline border-y border-border py-2 px-1">
      <KpiInline label="Caixa hoje" value="R$ 34.494" />
      <KpiInline label="Mínimo" value="-R$ 251.633" valueColor="var(--brand-error-soft)" meta="S12 · 20/jul" />
      <KpiInline label="Médio" value="-R$ 121.566" valueColor="var(--brand-error-soft)" meta="13 sem" />
      <div className="inline-flex items-baseline gap-2 px-4">
        <Popover>
          <PopoverTrigger className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground rounded px-1.5 py-0.5 hover:bg-[rgba(7,29,59,0.06)] transition">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            {veredito.label}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[280px] text-[12px]">
            <p className="font-semibold mb-2 text-[var(--brand-navy)]">Por que dados insuficientes</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• Saldo de abertura ausente · Filial 2</li>
              <li>• Conta CEF sem atualização há 14 dias</li>
              <li>• 3 eventos sem classificação · R$ 89k</li>
              <li>• Folha S6 sem evento confirmado</li>
            </ul>
          </PopoverContent>
        </Popover>
        <button type="button" className="inline-flex items-center gap-1 text-[11px] font-semibold rounded px-1.5 py-0.5 transition hover:bg-[rgba(224,139,0,0.10)]" style={{ color: "var(--brand-warning)" }}>
          <AlertTriangle className="h-3 w-3" />4 críticas
        </button>
      </div>
    </section>
  )
}

function KpiInline({ label, value, valueColor, meta }: { label: string; value: string; valueColor?: string; meta?: string }) {
  return (
    <div className="inline-flex items-baseline gap-1.5 px-4 first:pl-1 border-r last:border-r-0 border-border rounded-md hover:bg-[rgba(7,29,59,0.04)] transition">
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      <span className="text-[13px] font-bold tabular-nums" style={{ color: valueColor ?? "var(--brand-navy)" }}>{value}</span>
      {meta && <span className="text-[11px] text-muted-foreground font-normal">{meta}</span>}
    </div>
  )
}

// ---------------------------------------------------------------------
// Zona 3 — Grid 13 semanas
// ---------------------------------------------------------------------
const FIRST_COL_WIDTH = 220
const WEEK_COL_WIDTH = 65
const TOTAL_COL_WIDTH = 95
const BEYOND_COL_WIDTH = 95
const TOTAL_BORDER_LEFT = "4px solid var(--border)"
const HEADER_GRADIENT = "rgba(7,29,59,0.03)"

type OpenState = { op: boolean; op_rec: boolean; op_sai: boolean; fin: boolean; inv: boolean; ic: boolean }
  function Zone3Grid({ onRowClick, onCellClick, onWeekClick }: { onRowClick?: () => void; onCellClick?: () => void; onWeekClick?: () => void }) {
  const [open, setOpen] = useState<OpenState>({
  op: true,
  op_rec: false,
  op_sai: false,
  fin: false,
  inv: false,
  ic: false,
  })
  const toggle = (k: keyof OpenState) => setOpen((p) => ({ ...p, [k]: !p[k] }))

  return (
  <section className="rounded-2xl border border-border bg-card" aria-label="Grade de fluxo de caixa em 13 semanas">

      {/* Wrapper com scrollbars sempre visíveis. */}
      <div style={{ overflowX: "scroll", overflowY: "scroll", maxHeight: "70vh" }}>
        <table
          className="w-full border-separate"
          style={{
            borderSpacing: 0,
            minWidth: FIRST_COL_WIDTH + 13 * WEEK_COL_WIDTH + TOTAL_COL_WIDTH + BEYOND_COL_WIDTH,
            fontFamily: "var(--font-sans)",
            fontSize: 11,
          }}
        >
          <colgroup>
            <col style={{ width: FIRST_COL_WIDTH }} />
            {WEEKS.map((_, i) => (
              <col key={i} style={{ width: WEEK_COL_WIDTH }} />
            ))}
            <col style={{ width: TOTAL_COL_WIDTH }} />
            <col style={{ width: BEYOND_COL_WIDTH }} />
          </colgroup>

          <thead>
            <tr>
              <th
                scope="col"
                className="px-3 py-2 text-left"
                style={{
                  position: "sticky",
                  left: 0,
                  top: 0,
                  zIndex: 4,
                  background: HEADER_GRADIENT,
                  color: "var(--brand-navy)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  borderBottom: "1px solid var(--brand-navy)",
                }}
              >
                Categoria
              </th>
              {WEEKS.map((w, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-1.5 py-2 text-right transition hover:!bg-[rgba(21,103,200,0.08)] hover:!text-[var(--brand-navy)]"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    background: HEADER_GRADIENT,
                    color: "var(--muted-foreground)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid var(--brand-navy)",
                    cursor: "pointer",
                  }}
                  onClick={onWeekClick}
                >
                  <div className="flex flex-col items-end leading-tight">
                    <span>{w.label}</span>
                    <span className="text-[9px] font-semibold opacity-80 tracking-normal normal-case">
                      {w.mondayLabel}
                    </span>
                  </div>
                </th>
              ))}
              <th
                scope="col"
                className="px-1.5 py-2 text-right transition hover:!bg-[rgba(21,103,200,0.08)] hover:!text-[var(--brand-navy)]"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  background: HEADER_GRADIENT,
                  color: "var(--muted-foreground)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  borderLeft: TOTAL_BORDER_LEFT,
                  borderBottom: "1px solid var(--brand-navy)",
                  cursor: "pointer",
                }}
              >
                <div className="flex flex-col items-end leading-tight">
                  <span>Total</span>
                  <span className="text-[9px] font-semibold opacity-80 tracking-normal normal-case">13 sem</span>
                </div>
              </th>
              <th
                scope="col"
                className="px-1.5 py-2 text-right transition hover:!bg-[rgba(21,103,200,0.08)] hover:!text-[var(--brand-navy)]"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  background: HEADER_GRADIENT,
                  color: "var(--muted-foreground)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  borderBottom: "1px solid var(--brand-navy)",
                  cursor: "pointer",
                }}
              >
                <div className="flex flex-col items-end leading-tight">
                  <span>Depois</span>
                  <span className="text-[9px] font-semibold opacity-80 tracking-normal normal-case">da S13</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {/* (2) Caixa Início do Período — abre a tabela.
                SALDO: Total = snapshot da S1, Depois da S13 = "—" (null). */}
            <DataRow
              label="Caixa Início do Período"
              values={CAIXA_INICIO}
              total={CAIXA_INICIO[0]}
              beyond={null}
              variant="subtotal"
            />

            {/* ===================== 1. OPERAÇÃO ===================== */}
            <SectionHeader label="OPERAÇÃO" expanded={open.op} onToggle={() => toggle("op")} />

            {open.op && (
              <>
                {/* (1) Receitas Operacionais — subtotal AZUL CLARO bold; valor sempre visível */}
                <SubGroupHeader
                  label="Receitas Operacionais"
                  expanded={open.op_rec}
                  onToggle={() => toggle("op_rec")}
                  subtotalValues={REC_OP_SUB_BY_WEEK}
                  subtotalTotal={sum(REC_OP_SUB_BY_WEEK)}
                  subtotalBeyond={REC_OP_BEYOND}
                />
                {open.op_rec && (
                  <>
                    <DataRow
                      label={<>(+) <GlossaryTerm term="CR">CR</GlossaryTerm> a receber <span className="text-muted-foreground">(vencimentos)</span></>}
                      values={CR_RECEBER}
                      total={sum(CR_RECEBER)}
                      beyond={BEYOND_CR_RECEBER}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                    />
                    <DataRow
                      label={<>(+) <GlossaryTerm term="CR">CR</GlossaryTerm> vencidos <span className="text-muted-foreground">- recuperação</span></>}
                      values={CR_RECUPERACAO}
                      total={sum(CR_RECUPERACAO)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                    />
                    <DataRow label={<>(+) Outras receitas</>} values={OUTRAS_RECEITAS} total={sum(OUTRAS_RECEITAS)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                  </>
                )}

                {/* (1) Saídas Operacionais — subtotal AZUL CLARO bold; valor sempre visível */}
                <SubGroupHeader
                  label="Saídas Operacionais"
                  expanded={open.op_sai}
                  onToggle={() => toggle("op_sai")}
                  subtotalValues={SAI_OP_SUB_BY_WEEK}
                  subtotalTotal={sum(SAI_OP_SUB_BY_WEEK)}
                  subtotalBeyond={SAI_OP_BEYOND}
                />
                {open.op_sai && (
                  <>
                    <DataRow
                      label={<>(−) <GlossaryTerm term="CP">CP</GlossaryTerm> a pagar <span className="text-muted-foreground">(vencimentos)</span></>}
                      values={CP_A_PAGAR}
                      total={sum(CP_A_PAGAR)}
                      beyond={BEYOND_CP_A_PAGAR}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                    />
                    <DataRow
                      label={<>(−) <GlossaryTerm term="CP">CP</GlossaryTerm> vencidos <span className="text-muted-foreground">- renegociação</span></>}
                      values={CP_VENCIDOS}
                      total={sum(CP_VENCIDOS)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                    />
                    <DataRow label={<>(−) Folha</>} values={FOLHA} total={sum(FOLHA)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                    <DataRow label={<>(−) Tributos sobre Vendas</>} values={TRIBUTOS_VENDAS} total={sum(TRIBUTOS_VENDAS)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                    <DataRow label={<>(−) Encargos Trabalhistas</>} values={ENCARGOS_TRAB} total={sum(ENCARGOS_TRAB)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                    <DataRow label={<>(−) Despesas Operacionais</>} values={DESPESAS_OPER} total={sum(DESPESAS_OPER)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                  </>
                )}
              </>
            )}

            {/* (3) "Caixa Líquido X" → "Líquido X". Variant subtotal (azul claro bold). */}
            <DataRow
              label="→ Líquido da Operação"
              values={CL_OPERACAO}
              total={sum(CL_OPERACAO)}
              beyond={CL_OPERACAO_BEYOND}
              variant="subtotal"
            />

            {/* ===================== 2. FINANCIAMENTO ===================== */}
            <SectionHeader label="FINANCIAMENTO" expanded={open.fin} onToggle={() => toggle("fin")} />
            {open.fin && (
              <>
                <DataRow label={<>(+) Empréstimos novos</>} values={EMPRESTIMOS_NOVOS} total={sum(EMPRESTIMOS_NOVOS)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                <DataRow label={<>(+) Aporte de sócios</>} values={APORTE_SOCIOS} total={sum(APORTE_SOCIOS)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                <DataRow label={<>(−) Empréstimo / Financiamento</>} values={EMPRESTIMO_FIN} total={sum(EMPRESTIMO_FIN)} beyond={BEYOND_EMPRESTIMO} onClickRow={onRowClick} onCellClick={onCellClick} />
                <DataRow
                  label={<>(−) Tarifas Bancárias / <GlossaryTerm term="IOF">IOF</GlossaryTerm></>}
                  values={TARIFAS_IOF}
                  total={sum(TARIFAS_IOF)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                />
                <DataRow label={<>(−) Retiradas de Sócios</>} values={RETIRADA_SOCIOS} total={sum(RETIRADA_SOCIOS)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
              </>
            )}
            <DataRow
              label="→ Líquido do Financiamento"
              values={CL_FINANCIAMENTO}
              total={sum(CL_FINANCIAMENTO)}
              beyond={CL_FIN_BEYOND}
              variant="subtotal"
            />

            {/* ===================== 3. INVESTIMENTO ===================== */}
            <SectionHeader label="INVESTIMENTO" expanded={open.inv} onToggle={() => toggle("inv")} />
            {open.inv && (
              <>
                <DataRow label={<>(+) Venda de Equipamentos</>} values={VENDA_EQUIP} total={sum(VENDA_EQUIP)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                <DataRow label={<>(−) Compra de Equipamentos</>} values={COMPRA_EQUIP} total={sum(COMPRA_EQUIP)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
              </>
            )}
            <DataRow
              label="→ Líquido do Investimento"
              values={CL_INVESTIMENTO}
              total={sum(CL_INVESTIMENTO)}
              beyond={CL_INV_BEYOND}
              variant="subtotal"
            />

            {/* ===================== 4. ENTRE COMPANHIAS ===================== */}
            <SectionHeader label="ENTRE COMPANHIAS" expanded={open.ic} onToggle={() => toggle("ic")} />
            {open.ic && (
              <>
                <DataRow label={<>(+) Recebimentos entre companhias</>} values={RECEB_INTERCO} total={sum(RECEB_INTERCO)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
                <DataRow label={<>(−) Pagamentos entre companhias</>} values={PAGTO_INTERCO} total={sum(PAGTO_INTERCO)} beyond={0} onClickRow={onRowClick} onCellClick={onCellClick} />
              </>
            )}
            <DataRow
              label="→ Líquido Entre Companhias"
              values={CL_INTERCO}
              total={sum(CL_INTERCO)}
              beyond={CL_IC_BEYOND}
              variant="subtotal"
            />

            {/* ===================== Fechamento ===================== */}
            <DataRow
              label="VARIAÇÃO LÍQUIDA DO CAIXA"
              values={VARIACAO_LIQUIDA}
              total={sum(VARIACAO_LIQUIDA)}
              beyond={VARIACAO_BEYOND}
              variant="subtotal"
              upperLabel
            />
            {/* SALDO: Total = snapshot da S13, Depois da S13 = "—" (null). */}
            <DataRow
              label="Caixa Final do Período"
              values={CAIXA_FINAL}
              total={CAIXA_FINAL[12]}
              beyond={null}
              variant="subtotal"
            />
            <DataRow
              label="Caixa Mínimo Operacional"
              values={Array.from({ length: 13 }, () => CAIXA_MINIMO_OPERACIONAL)}
              total={null}
              beyond={null}
              variant="muted"
              isLast
            />
          </tbody>
        </table>
      </div>
    </section>
  )
}

// =====================================================================
// SectionHeader (nível 1) — fundo branco, navy bold uppercase 11px, com chevron.
// =====================================================================
function SectionHeader({
  label,
  expanded,
  onToggle,
}: {
  label: string
  expanded: boolean
  onToggle: () => void
}) {
  const Icon = expanded ? ChevronDown : ChevronRight
  return (
    <tr
      onClick={onToggle}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
      className="group cursor-pointer transition-colors"
    >
      <th
        scope="row"
        className="px-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--brand-navy)] transition group-hover:!bg-[rgba(21,103,200,0.06)]"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: "var(--card)",
          paddingTop: 8,
          paddingBottom: 6,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          <Icon className="h-3 w-3 transition-all opacity-60 group-hover:opacity-100 group-hover:text-[var(--brand-blue)]" strokeWidth={2.4} aria-hidden style={{ color: "var(--brand-navy)" }} />
          {label}
        </span>
      </th>
      {Array.from({ length: 13 }).map((_, i) => (
        <td
          key={i}
          className="transition group-hover:!bg-[rgba(21,103,200,0.06)]"
          style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", height: 26 }}
        />
      ))}
      <td
        className="transition group-hover:!bg-[rgba(21,103,200,0.06)]"
        style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          borderLeft: TOTAL_BORDER_LEFT,
          height: 26,
        }}
      />
      <td className="transition group-hover:!bg-[rgba(21,103,200,0.06)]" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", height: 26 }} />
    </tr>
  )
}

// =====================================================================
// SubGroupHeader (nível 2) — Receitas/Saídas Operacionais.
// (1) Fundo #DCE7F5 + navy bold. CRÍTICO: subtotal SEMPRE visível, mesmo
// quando expandido — sub-rows aparecem ABAIXO desta linha.
// =====================================================================
function SubGroupHeader({
  label,
  expanded,
  onToggle,
  subtotalValues,
  subtotalTotal,
  subtotalBeyond,
}: {
  label: string
  expanded: boolean
  onToggle: () => void
  subtotalValues: number[]
  subtotalTotal: number
  subtotalBeyond: number
}) {
  const Icon = expanded ? ChevronDown : ChevronRight
  return (
    <tr
      onClick={onToggle}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
      className="group cursor-pointer transition-colors"
    >
      <th
        scope="row"
        className="px-3 py-1.5 text-left text-[11px] font-bold text-[var(--brand-navy)] transition group-hover:!bg-[rgba(21,103,200,0.10)]"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: SUBTOTAL_BG,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          <Icon className="h-3 w-3 transition-all opacity-60 group-hover:opacity-100 group-hover:text-[var(--brand-blue)]" strokeWidth={2.4} aria-hidden style={{ color: "var(--brand-navy)" }} />
          {label}
        </span>
      </th>
      {subtotalValues.map((v, i) => (
        <NumericCell
          key={i}
          value={v}
          baseBg={SUBTOTAL_BG}
          fontWeight={700}
          colorRule="signed"
          borderBottom="1px solid var(--border)"
          className="transition group-hover:!bg-[rgba(21,103,200,0.10)]"
        />
      ))}
      <NumericCell
        value={subtotalTotal}
        baseBg={SUBTOTAL_BG}
        fontWeight={700}
        colorRule="signed"
        borderBottom="1px solid var(--border)"
        isTotalCol
        className="transition group-hover:!bg-[rgba(21,103,200,0.10)]"
      />
      <NumericCell
        value={subtotalBeyond}
        baseBg={SUBTOTAL_BG}
        fontWeight={700}
        colorRule="signed"
        borderBottom="1px solid var(--border)"
        isTotalCol
        className="transition group-hover:!bg-[rgba(21,103,200,0.10)]"
      />
    </tr>
  )
}

// =====================================================================
// DataRow — variantes:
//   default  : peso 500 INK/NAVY (linhas analíticas)
//   subtotal : (1) fundo #DCE7F5 + texto navy bold 700 (Líquidos, Variação, Caixa Início/Final)
//   muted    : muted italic (Caixa Mínimo Operacional)
// =====================================================================
type RowVariant = "default" | "subtotal" | "muted"

function DataRow({
  label,
  values,
  total,
  beyond = null,
  variant = "default",
  upperLabel = false,
  isLast = false,
  onClickRow,
  onCellClick,
}: {
  label: ReactNode
  values: number[]
  total: number | null
  beyond?: number | null
  variant?: RowVariant
  upperLabel?: boolean
  isLast?: boolean
  onClickRow?: () => void
  onCellClick?: () => void
}) {
  const borderBottom = isLast ? "none" : "1px solid var(--border)"
  const isClickable = variant === "default"

  let labelColor = "var(--brand-navy)"
  let valueWeight: 400 | 500 | 600 | 700 = 500
  let labelWeight: 400 | 500 | 600 | 700 = 500
  let italic = false
  let colorRule: "default" | "signed" = "default"
  let rowBg = "var(--card)"

  switch (variant) {
    case "subtotal":
      labelWeight = 700
      valueWeight = 700
      colorRule = "signed"
      rowBg = SUBTOTAL_BG
      break
    case "muted":
      labelColor = "var(--muted-foreground)"
      labelWeight = 400
      valueWeight = 400
      italic = true
      break
    default:
      labelWeight = 500
      valueWeight = 500
      colorRule = "default"
  }

  return (
    <tr className={isClickable ? "group cursor-pointer transition-colors" : undefined} onClick={isClickable ? onClickRow : undefined}>
      <th
        scope="row"
        className={`px-3 py-1.5 text-left${isClickable ? " transition group-hover:!bg-[rgba(21,103,200,0.05)]" : ""}`}
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: rowBg,
          color: labelColor,
          fontSize: 11,
          fontWeight: labelWeight,
          fontStyle: italic ? "italic" : "normal",
          textTransform: upperLabel ? "uppercase" : "none",
          letterSpacing: upperLabel ? "0.04em" : "normal",
          borderBottom,
        }}
      >
        {label}
      </th>
      {values.map((v, i) => (
        <NumericCell
          key={i}
          value={v}
          baseBg={rowBg}
          fontWeight={valueWeight}
          italic={italic}
          colorOverride={variant === "muted" ? "var(--muted-foreground)" : undefined}
          colorRule={colorRule}
          borderBottom={borderBottom}
          className={isClickable ? "transition group-hover:!bg-[rgba(21,103,200,0.05)]" : undefined}
          onClick={isClickable ? onCellClick : undefined}
        />
      ))}
      <NumericCell
        value={total}
        baseBg={rowBg}
        fontWeight={Math.max(valueWeight, 600) as 600 | 700}
        italic={italic}
        colorOverride={variant === "muted" ? "var(--muted-foreground)" : undefined}
        colorRule={colorRule}
        borderBottom={borderBottom}
        isTotalCol
        className={isClickable ? "transition group-hover:!bg-[rgba(21,103,200,0.05)]" : undefined}
      />
      <NumericCell
        value={beyond}
        baseBg={rowBg}
        fontWeight={Math.max(valueWeight, 600) as 600 | 700}
        italic={italic}
        colorOverride={variant === "muted" ? "var(--muted-foreground)" : undefined}
        colorRule={colorRule}
        borderBottom={borderBottom}
        isTotalCol
        className={isClickable ? "transition group-hover:!bg-[rgba(21,103,200,0.05)]" : undefined}
      />
    </tr>
  )
}

// =====================================================================
// NumericCell
// =====================================================================
function NumericCell({
  value,
  baseBg,
  fontWeight = 500,
  italic = false,
  colorOverride,
  colorRule = "default",
  borderBottom,
  isTotalCol = false,
  className,
  onClick,
}: {
  value: number | null
  baseBg: string
  fontWeight?: 400 | 500 | 600 | 700
  italic?: boolean
  colorOverride?: string
  colorRule?: "default" | "signed"
  borderBottom: string
  isTotalCol?: boolean
  className?: string
  onClick?: () => void
}) {
  const isEmpty = value === null || value === undefined
  const isNegative = !isEmpty && (value as number) < 0

  let color: string
  if (isEmpty) {
    color = "var(--muted-foreground)"
  } else if (colorOverride) {
    color = colorOverride
  } else if (colorRule === "signed") {
    color = isNegative ? "var(--brand-error-soft)" : "var(--brand-navy)"
  } else {
    color = isNegative ? "var(--brand-error-soft)" : "var(--foreground)"
  }

  return (
    <td
      className={["px-1.5 py-1.5 text-right", onClick ? "cursor-pointer" : undefined, className].filter(Boolean).join(" ")}
      style={{
        background: baseBg,
        color,
        fontSize: 11,
        fontWeight,
        fontStyle: italic ? "italic" : "normal",
        fontVariantNumeric: "tabular-nums",
        borderBottom,
        borderLeft: isTotalCol ? TOTAL_BORDER_LEFT : undefined,
        whiteSpace: "nowrap",
      }}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick() } : undefined}
    >
      {fmtCompact(isEmpty ? null : (value as number))}
    </td>
  )
}

