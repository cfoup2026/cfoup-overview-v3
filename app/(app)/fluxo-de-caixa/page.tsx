"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Plus,
  Building2,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  PencilLine,
  Tags,
  Gauge,
  MessageSquare,
  Wifi,
  Hand,
  CheckCircle2,
  Eye,
  BarChart3,
  X,
  Check,
  Plug,
} from "lucide-react"
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command"
import {
  useCashflow13w,
  type Problema,
  type AcaoProblema,
  type Contraparte,
  type WeekHeader,
  type CashflowSnapshot,
} from "@/lib/hooks/use-cashflow-13w"

const GHOST_BTN =
  "inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium text-muted-foreground rounded-md hover:bg-[rgba(7,29,59,0.06)] hover:text-[var(--brand-navy)] transition"

// ---------------------------------------------------------------------
// LightSheetContent — backdrop transparente para drill-downs contextuais
// ---------------------------------------------------------------------
function LightSheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Content
        className={`fixed inset-y-0 right-0 z-50 w-[320px] bg-background border-l border-border shadow-[0_6px_24px_-12px_rgba(7,29,59,0.25)] p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right ${className ?? ""}`}
      >
        <SheetPrimitive.Close className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-[rgba(7,29,59,0.04)] hover:text-[var(--brand-navy)] transition">
          <X className="h-3.5 w-3.5" />
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

// ---------------------------------------------------------------------
// Masks (reutilizadas por QuickAddForecastSheet e InformarSaldoSheet)
// ---------------------------------------------------------------------
function maskValor(v: string): string {
  const digits = v.replace(/\D/g, "")
  if (!digits) return ""
  return (parseInt(digits, 10) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}
function maskData(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return d.slice(0, 2) + "/" + d.slice(2)
  return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4)
}

// ---------------------------------------------------------------------
// Taxonomia padrão de categorias — estrutura, não dado do cliente
// ---------------------------------------------------------------------
const CATEGORIAS_ENTRADA = ["CR a receber", "CR vencidos", "Empréstimo recebido", "Aporte", "Outras entradas"]
const CATEGORIAS_SAIDA = ["Folha", "Fornecedores", "Tributos", "Empréstimo · pagamento", "Despesas operacionais", "Outras saídas"]

/**
 * /fluxo-de-caixa
 *
 * DFC pelo método direto em janela rolante de 13 semanas, com 4 atividades
 * — Operação, Financiamento, Investimento e Entre Companhias — cada qual
 * fechando em uma linha "Líquido". Linhas de fechamento agregam Variação
 * Líquida e os saldos de Início/Final do período.
 *
 * Os arrays de dado vêm do hook useCashflow13w(activeUnit) — quando sem
 * conexão, snapshot é null e a UI mostra estado vazio honesto.
 */

// =====================================================================
// Subtotal background (kept as const for table cells)
// =====================================================================
const SUBTOTAL_BG = "rgba(21,103,200,0.08)"

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
const sumByWeek = (arrs: number[][]) =>
  Array.from({ length: 13 }, (_, i) => arrs.reduce((acc, a) => acc + a[i], 0))

// =====================================================================
// Formatador compacto
// =====================================================================
function fmtCompact(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—"
  if (v === 0) return "—"
  const abs = Math.abs(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 })
  return v < 0 ? `(${abs})` : abs
}
const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})
function fmtBRL(v: number | null | undefined): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—"
  return BRL.format(v)
}

// =====================================================================
// Veredito
// =====================================================================
type Veredito = "LIMPO" | "ATENCAO" | "ALERTA" | "CRITICO" | "DADOS_INSUFICIENTES" | "OK"
const VEREDITO_STYLES: Record<Veredito, { label: string; bg: string; fg: string; dotColor: string }> = {
  LIMPO: { label: "LIMPO", bg: "rgba(54,186,88,0.14)", fg: "var(--brand-green)", dotColor: "var(--brand-green)" },
  ATENCAO: { label: "ATENÇÃO", bg: "rgba(224,139,0,0.14)", fg: "var(--brand-warning)", dotColor: "var(--brand-warning)" },
  ALERTA: { label: "ALERTA", bg: "rgba(224,139,0,0.18)", fg: "var(--brand-warning)", dotColor: "var(--brand-warning)" },
  CRITICO: { label: "CRÍTICO", bg: "rgba(209,67,67,0.14)", fg: "var(--brand-error-soft)", dotColor: "var(--brand-error-soft)" },
  DADOS_INSUFICIENTES: { label: "DADOS INSUFICIENTES", bg: "var(--muted)", fg: "var(--muted-foreground)", dotColor: "var(--muted-foreground)" },
  OK: { label: "TUDO VERIFICADO", bg: "rgba(54,186,88,0.10)", fg: "var(--brand-green)", dotColor: "var(--brand-green)" },
}

// =====================================================================
// Glossário inline (tooltip on hover) — referência metodológica
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
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dotted border-muted-foreground/50">{children}</span>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="start"
        sideOffset={8}
        collisionPadding={16}
        className="z-[60] max-w-[260px] border bg-popover px-3 py-2 text-[11px] text-popover-foreground"
        style={{ boxShadow: "0 8px 24px -12px rgba(7,29,59,0.20)", borderWidth: "0.5px", borderColor: "var(--border)" }}
      >
        <strong className="block text-[11px] font-semibold text-[var(--brand-navy)]">{entry.title}</strong>
        <span className="mt-0.5 block text-[11px] text-[var(--brand-navy)] opacity-80">{entry.body}</span>
      </TooltipContent>
    </Tooltip>
  )
}

// =====================================================================
// Tipos de origem de dados (taxonomia, não dado)
// =====================================================================
type CelulaOrigem = "documento" | "estimativa" | "manual"

const ROW_ORIGEM: Record<string, CelulaOrigem> = {
  cr_receber: "documento",
  cr_recuperacao: "documento",
  cp_pagar: "documento",
  cp_vencidos: "documento",
  folha: "estimativa",
  tributos: "estimativa",
  encargos: "estimativa",
  despesas: "estimativa",
  outras: "manual",
}

function getOrigem(rowId: string | undefined): CelulaOrigem {
  if (!rowId) return "estimativa"
  for (const [k, v] of Object.entries(ROW_ORIGEM)) {
    if (rowId.includes(k)) return v
  }
  return "estimativa"
}

// =====================================================================
// Tipos de Evento e dados ligados às drill-down sheets (sem mocks fixos)
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

type EventoCelula = { id: string; data: string; contraparte: string; valor: number; status: "confirmado" | "estimado" }

type Semana = {
  numero: number
  dateRange: string
  caixaInicial: number
  caixaFinal: number
  minimo: number
  totalEntradas: number
  totalSaidas: number
  liquido: number
}

type CellDrillData =
  | { origem: "documento"; eventos: EventoCelula[] }
  | { origem: "estimativa"; metodo: string; periodo: string; confianca: "Alta" | "Média" | "Baixa" }
  | { origem: "manual"; data: string; contraparte: string; valor: number; status: "estimado" | "confirmado"; confianca: "Alta" | "Média" | "Baixa"; obs?: string }

// =====================================================================
// Página
// =====================================================================
// NOTA — multi-tenant. CFOup atende 70k+ clientes e cada um tem N unidades
// (filiais, CNPJs, centros de custo) com nomes próprios vindos do source
// system (ERP, contábil, Open Finance). O nome do cliente (tenant) NÃO
// aparece nesta tela — vem do sidebar/header global do app.
type UnidadeId = string

export default function FluxoDeCaixa13Semanas() {
  const router = useRouter()
  const [unidade, setUnidade] = useState<UnidadeId>("consolidado")

  const { hasConnections, weeks, snapshot, pendencias, contrapartes } = useCashflow13w(unidade)
  const [pendenciasOverride, setPendenciasOverride] = useState<Problema[] | null>(null)
  const pendenciasAtuais = pendenciasOverride ?? pendencias

  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null)
  const [openEvento, setOpenEvento] = useState(false)
  const [openSemana, setOpenSemana] = useState(false)
  const [selectedSemana, setSelectedSemana] = useState<Semana | null>(null)
  const [openSaldo, setOpenSaldo] = useState(false)
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null)
  const [highlightedWeekIdx, setHighlightedWeekIdx] = useState<number | null>(null)
  const [expandedCell, setExpandedCell] = useState<{ rowId: string; weekIdx: number } | null>(null)
  const [cellDrillData, setCellDrillData] = useState<CellDrillData | null>(null)

  const handleAction = (problemaId: string, action: AcaoProblema) => {
    setPendenciasOverride((prev) => (prev ?? pendencias).filter((p) => p.id !== problemaId))
    if (action.route) router.push(action.route)
    else if (action.opensSaldoSheet) setOpenSaldo(true)
  }

  const handleRowClick = (rowId: string) => {
    // Sem snapshot, não há evento real pra abrir. Handler é no-op.
    if (!snapshot) return
    setHighlightedRowId(rowId)
    // TODO: quando hook tiver fetch real, buscar evento via API antes de abrir
    setOpenEvento(true)
  }

  const handleCellClick = (rowId: string, weekIdx: number) => {
    if (!snapshot) return
    setExpandedCell((prev) =>
      prev?.rowId === rowId && prev?.weekIdx === weekIdx ? null : { rowId, weekIdx },
    )
    // TODO: quando hook tiver fetch real, buscar composição da célula via API
    setCellDrillData(null)
  }

  const handleWeekClick = (weekIdx: number) => {
    if (!snapshot) return
    setHighlightedWeekIdx(weekIdx)
    // TODO: quando hook tiver fetch real, buscar agregado da semana via API
    setSelectedSemana(null)
    setOpenSemana(true)
  }

  const handleEventoFromExpansion = () => {
    if (!snapshot) return
    setOpenEvento(true)
  }

  return (
    <>
      <Zone1Header unidade={unidade} setUnidade={setUnidade} contrapartes={contrapartes} />
      <Zone2Kpis
        hasConnections={hasConnections}
        snapshot={snapshot}
        pendencias={pendenciasAtuais}
        onAction={handleAction}
      />
      <Zone3Grid
        hasConnections={hasConnections}
        snapshot={snapshot}
        weeks={weeks}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        onWeekClick={handleWeekClick}
        highlightedRowId={highlightedRowId}
        highlightedWeekIdx={highlightedWeekIdx}
        expandedCell={expandedCell}
      />
      <EventoSheet
        evento={selectedEvento}
        open={openEvento}
        onOpenChange={(o) => {
          setOpenEvento(o)
          if (!o) setHighlightedRowId(null)
        }}
      />
      <SemanaSheet
        semana={selectedSemana}
        open={openSemana}
        onOpenChange={(o) => {
          setOpenSemana(o)
          if (!o) setHighlightedWeekIdx(null)
        }}
      />
      <InformarSaldoSheet open={openSaldo} onOpenChange={setOpenSaldo} />
      <CellDrillSheet
        expandedCell={expandedCell}
        data={cellDrillData}
        onOpenChange={(o) => {
          if (!o) {
            setExpandedCell(null)
            setCellDrillData(null)
          }
        }}
        onEventoClick={handleEventoFromExpansion}
      />
    </>
  )
}

// ---------------------------------------------------------------------
// Zona 1 — Header (dropdown de unidades)
// ---------------------------------------------------------------------
// Placeholders genéricos. Em produção, as N unidades virão dinamicamente do
// source system do cliente. "Consolidado" é sempre o primeiro item.
const UNIDADES: { id: UnidadeId; label: string }[] = [
  { id: "consolidado", label: "Consolidado" },
  { id: "filial-1", label: "Filial 1" },
  { id: "filial-2", label: "Filial 2" },
]

function Zone1Header({
  unidade,
  setUnidade,
  contrapartes,
}: {
  unidade: UnidadeId
  setUnidade: (v: UnidadeId) => void
  contrapartes: Contraparte[]
}) {
  const activeLabel = UNIDADES.find((u) => u.id === unidade)?.label ?? "Consolidado"
  const [sheetOpen, setSheetOpen] = useState(false)
  return (
    <div className="mb-4">
      <PageHeader eyebrow="Mesa de Decisão" title="Fluxo de Caixa">
        <div className="flex items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger className={GHOST_BTN}>
              <Building2 className="h-3 w-3 text-muted-foreground" />
              {activeLabel}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              {UNIDADES.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => setUnidade(u.id)}
                  className="text-[12px] flex items-center justify-between gap-2"
                >
                  <span>{u.label}</span>
                  {unidade === u.id && <Check className="h-3 w-3 text-[var(--brand-blue)] shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button type="button" className={GHOST_BTN}>
            <RefreshCw className="h-3 w-3 text-muted-foreground" />
            Atualizar
          </button>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button type="button" className={GHOST_BTN}>
                <Plus className="h-3 w-3 text-[var(--brand-blue)]" />
                Adicionar previsão
              </button>
            </SheetTrigger>
            <QuickAddForecastSheet onClose={() => setSheetOpen(false)} contrapartes={contrapartes} />
          </Sheet>
        </div>
      </PageHeader>
    </div>
  )
}

// ---------------------------------------------------------------------
// Quick Add Sheet — evento futuro
// ---------------------------------------------------------------------
function QuickAddForecastSheet({
  onClose,
  contrapartes,
}: {
  onClose: () => void
  contrapartes: Contraparte[]
}) {
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
    // TODO: persistir via /api/cashflow/events quando hook tiver fetch real
    onClose()
  }

  const PILL = "h-6 px-3 text-[11px] font-semibold rounded-full border transition"
  const PILL_ACTIVE = "bg-[rgba(21,103,200,0.10)] border-[rgba(21,103,200,0.40)] text-[var(--brand-blue)]"
  const PILL_INACTIVE = "border-border text-muted-foreground hover:border-[rgba(21,103,200,0.30)]"
  const DIR_BTN = "flex-1 h-8 flex items-center justify-center gap-1.5 border rounded-md transition text-[10px] font-semibold"
  const DIR_ACTIVE = "bg-[rgba(21,103,200,0.10)] border-[rgba(21,103,200,0.40)] text-[var(--brand-blue)]"
  const DIR_INACTIVE = "border-border text-muted-foreground hover:border-[rgba(21,103,200,0.30)]"
  const LABEL = "text-[10px] font-semibold text-muted-foreground"
  const INPUT_BASE =
    "w-full border-0 border-b border-border bg-transparent outline-none focus:border-[var(--brand-blue)] transition placeholder:text-muted-foreground/60"

  const valorColor = direcao === "entrada" ? "var(--brand-navy)" : "var(--brand-error-soft)"

  return (
    <SheetContent side="right" className="w-[340px] p-4">
      <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
        <span className="text-[14px] font-bold text-[var(--brand-navy)]">Adicionar previsão</span>
        <button
          type="button"
          onClick={onClose}
          className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-[rgba(7,29,59,0.06)] transition"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

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
                <SelectItem key={c} value={c} className="text-[12px]">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-3">
        <label className={LABEL}>Cliente ou fornecedor</label>
        <Popover open={contraparteOpen} onOpenChange={setContraparteOpen}>
          <PopoverTrigger className="w-full h-6 text-[13px] font-semibold text-[var(--brand-navy)] border-0 border-b border-border bg-transparent rounded-none px-1 text-left flex items-center justify-between hover:border-[var(--brand-blue)] transition mt-0.5">
            <span className={contraparte ? "" : "text-muted-foreground font-medium"}>
              {contraparte || "buscar cliente ou fornecedor"}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0" align="start">
            <Command>
              <CommandInput placeholder="buscar..." className="text-[12px] h-9" />
              <CommandList>
                <CommandEmpty className="text-[11px] py-3 px-3 text-muted-foreground text-center">
                  {contrapartes.length === 0
                    ? "lista disponível após conexão dos dados"
                    : "nenhum resultado"}
                </CommandEmpty>
                {contrapartes.length > 0 && (
                  <CommandGroup>
                    {contrapartes.map((cp) => (
                      <CommandItem
                        key={cp.id}
                        value={cp.nome}
                        onSelect={() => {
                          setContraparte(cp.nome)
                          setContraparteOpen(false)
                        }}
                        className="text-[12px] flex items-center justify-between"
                      >
                        <span>{cp.nome}</span>
                        <span className="text-[10px] text-muted-foreground capitalize">{cp.tipo}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

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
  const origemText = evento.origem === "API" ? "Importado via API" : "Manual · adicionado por você"

  const statusStyles =
    evento.status === "confirmado"
      ? "text-[var(--brand-green)] border-[rgba(54,186,88,0.30)] bg-[rgba(54,186,88,0.08)]"
      : "text-[var(--brand-warning)] border-[rgba(224,139,0,0.30)] bg-[rgba(224,139,0,0.08)]"

  const handleAction = () => {
    onOpenChange(false)
  }

  const ACTION_ROW =
    "flex items-center gap-2.5 px-2 py-2.5 rounded-md hover:bg-[rgba(21,103,200,0.05)] transition cursor-pointer w-full text-left"

  const actions = [
    { icon: CheckCircle2, title: "Confirmar como firme", sub: "marcar como documentado · confiança alta" },
    { icon: PencilLine, title: "Editar valor ou data", sub: "ajustar projeção" },
    { icon: Tags, title: "Reclassificar", sub: "mudar categoria ou bucket" },
    { icon: Gauge, title: "Ajustar confiança", sub: "alta · média · baixa" },
    { icon: MessageSquare, title: "Adicionar observação", sub: "anotação livre" },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <LightSheetContent className="w-[320px]">
        <div className="flex items-center justify-between pb-2 mb-3 mt-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span className="text-[10px] uppercase tracking-[0.10em] text-muted-foreground font-medium">EVENTO · CF13</span>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <DirIcon className="h-4 w-4 shrink-0" style={{ color: dirColor }} />
            <span className="text-lg md:text-[1.3rem] font-extrabold tabular-nums" style={{ color: dirColor }}>
              {fmtBRL(evento.valor)}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {evento.data} · {evento.categoria} · {evento.contraparte}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
            <OrigemIcon className="h-2.5 w-2.5" />
            {origemText}
          </p>
        </div>

        <div className="flex items-center gap-1.5 mb-3 pb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span
            className={`h-5 px-2 rounded-full text-[11px] font-semibold inline-flex items-center ${statusStyles}`}
            style={{ borderWidth: "0.5px" }}
          >
            {evento.status === "confirmado" ? "Confirmado" : "Estimado"}
          </span>
          <span
            className="h-5 px-2 rounded-full text-[11px] font-semibold text-muted-foreground inline-flex items-center"
            style={{ borderWidth: "0.5px", borderColor: "var(--border)" }}
          >
            Confiança {evento.confianca}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {actions.map((a) => (
            <button key={a.title} type="button" className={ACTION_ROW} onClick={handleAction}>
              <a.icon className="h-3.5 w-3.5 text-[var(--brand-blue)] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[var(--brand-navy)] leading-tight">{a.title}</p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{a.sub}</p>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </LightSheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------
// Cell Drill Sheet — drill-down de célula
// ---------------------------------------------------------------------
function CellDrillSheet({
  expandedCell,
  data,
  onOpenChange,
  onEventoClick,
}: {
  expandedCell: { rowId: string; weekIdx: number } | null
  data: CellDrillData | null
  onOpenChange: (open: boolean) => void
  onEventoClick: () => void
}) {
  return (
    <Sheet open={expandedCell !== null} onOpenChange={onOpenChange}>
      <LightSheetContent className="w-[320px]">
        <div className="flex items-center justify-between pb-2 mb-3 mt-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span className="text-[10px] uppercase tracking-[0.10em] text-muted-foreground font-medium">
            COMPOSIÇÃO · S{(expandedCell?.weekIdx ?? 0) + 1}
          </span>
        </div>

        {!data ? (
          <p className="py-2 text-[11px] text-muted-foreground">
            A composição da célula aparece aqui após a conexão dos dados.
          </p>
        ) : data.origem === "documento" ? (
          <>
            <p className="text-[11px] font-semibold text-[var(--brand-navy)] mb-2">Eventos da célula</p>
            <div className="flex flex-col gap-0.5">
              {data.eventos.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={onEventoClick}
                  className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-[rgba(21,103,200,0.05)] transition text-left"
                >
                  <div>
                    <span className="text-[11px] font-medium text-[var(--brand-navy)]">{e.data}</span>
                    <span className="text-[11px] text-muted-foreground mx-1.5">·</span>
                    <span className="text-[11px] text-muted-foreground">{e.contraparte}</span>
                    <span
                      className="ml-2 text-[10px] font-semibold"
                      style={{ color: e.status === "confirmado" ? "var(--brand-green)" : "var(--brand-warning)" }}
                    >
                      {e.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold tabular-nums text-[var(--brand-navy)]">
                    {fmtBRL(e.valor)}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : data.origem === "estimativa" ? (
          <div className="py-2">
            <p className="text-[11px] font-semibold text-[var(--brand-navy)]">Valor estimado pelo motor</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{data.metodo}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Período: {data.periodo} · Confiança: {data.confianca}
            </p>
          </div>
        ) : (
          <button type="button" onClick={onEventoClick} className="w-full text-left py-2">
            <p className="text-[11px] font-semibold text-[var(--brand-navy)]">Adicionado por você</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {data.data} · {data.contraparte}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Status: {data.status} · Confiança: {data.confianca}
            </p>
            {data.obs && <p className="text-[11px] text-muted-foreground mt-0.5 italic">&quot;{data.obs}&quot;</p>}
            <p className="text-[11px] font-semibold tabular-nums text-[var(--brand-navy)] mt-1">
              {fmtBRL(data.valor)}
            </p>
          </button>
        )}
      </LightSheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------
// Semana Sheet — visão consolidada da semana
// ---------------------------------------------------------------------
function SemanaSheet({ semana, open, onOpenChange }: { semana: Semana | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const colorFor = (v: number) => (v < 0 ? "var(--brand-error-soft)" : "var(--brand-navy)")

  const handleAction = () => {
    onOpenChange(false)
  }

  const ACTION_ROW =
    "flex items-center gap-2.5 px-2 py-2.5 rounded-md hover:bg-[rgba(21,103,200,0.05)] transition cursor-pointer w-full text-left"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <LightSheetContent className="w-[320px]">
        <div className="flex items-center justify-between pb-2 mb-3 mt-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span className="text-[10px] uppercase tracking-[0.10em] text-muted-foreground font-medium">
            {semana ? `SEMANA · S${semana.numero} · ${semana.dateRange.toUpperCase()}` : "SEMANA"}
          </span>
        </div>

        {!semana ? (
          <p className="py-2 text-[11px] text-muted-foreground">
            A visão consolidada da semana aparece aqui após a conexão dos dados.
          </p>
        ) : (
          <>
            <div className="mb-3 pb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
              {[
                { label: "Caixa inicial", value: semana.caixaInicial },
                { label: "Caixa final", value: semana.caixaFinal },
                { label: "Mínimo da semana", value: semana.minimo },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-1.5 py-1">
                  <span className="text-[11px] text-muted-foreground font-medium">{item.label}</span>
                  <span className="text-[13px] font-bold tabular-nums" style={{ color: colorFor(item.value) }}>
                    {fmtBRL(item.value)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-3 pb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
              <div className="flex items-baseline gap-1.5 py-1">
                <span className="text-[11px] text-muted-foreground font-medium">Entradas</span>
                <span className="text-[13px] font-bold tabular-nums text-[var(--brand-navy)]">
                  {fmtBRL(semana.totalEntradas)}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 py-1">
                <span className="text-[11px] text-muted-foreground font-medium">Saídas</span>
                <span className="text-[13px] font-bold tabular-nums text-[var(--brand-error-soft)]">
                  {fmtBRL(semana.totalSaidas)}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 py-1">
                <span className="text-[11px] text-muted-foreground font-medium">Líquido</span>
                <span className="text-[13px] font-bold tabular-nums" style={{ color: colorFor(semana.liquido) }}>
                  {fmtBRL(semana.liquido)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <button type="button" className={ACTION_ROW} onClick={handleAction}>
                <Eye className="h-3.5 w-3.5 text-[var(--brand-blue)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--brand-navy)] leading-tight">
                    Ver todos eventos da semana
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                    lista completa de entradas e saídas
                  </p>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
              </button>
              <button type="button" className={ACTION_ROW} onClick={handleAction}>
                <BarChart3 className="h-3.5 w-3.5 text-[var(--brand-blue)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--brand-navy)] leading-tight">
                    Comparar Forecast vs Actual
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">previsto contra realizado</p>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
              </button>
            </div>
          </>
        )}
      </LightSheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------
// Informar Saldo Manual Sheet
// ---------------------------------------------------------------------
const UNIDADES_SALDO = ["Consolidado", "Filial 1", "Filial 2"]

function InformarSaldoSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [unidadeSaldo, setUnidadeSaldo] = useState(UNIDADES_SALDO[0])
  const [valorSaldo, setValorSaldo] = useState("")
  const [dataSaldo, setDataSaldo] = useState("")

  const handleSave = () => {
    // TODO: persistir via /api/cashflow/balance quando hook tiver fetch real
    onOpenChange(false)
  }

  const LABEL = "text-[10px] font-semibold text-muted-foreground"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] p-4">
        <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <span className="text-[14px] font-bold text-[var(--brand-navy)]">Informar saldo manual</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-[rgba(7,29,59,0.06)] transition"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className={LABEL}>Unidade</label>
            <Select value={unidadeSaldo} onValueChange={setUnidadeSaldo}>
              <SelectTrigger className="h-7 text-[13px] font-semibold border-0 border-b border-border bg-transparent rounded-none px-1 focus:ring-0 focus:border-[var(--brand-blue)] mt-0.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIDADES_SALDO.map((u) => (
                  <SelectItem key={u} value={u} className="text-[12px]">
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={LABEL}>Valor</label>
            <input
              type="text"
              value={valorSaldo}
              onChange={(e) => setValorSaldo(maskValor(e.target.value))}
              placeholder="R$ 0,00"
              className="w-full h-8 text-[18px] font-extrabold tabular-nums border-0 border-b border-border bg-transparent outline-none focus:border-[var(--brand-blue)] transition placeholder:text-muted-foreground/60 mt-0.5 text-[var(--brand-navy)]"
            />
          </div>
          <div>
            <label className={LABEL}>Data de referência</label>
            <input
              type="text"
              value={dataSaldo}
              onChange={(e) => setDataSaldo(maskData(e.target.value))}
              placeholder="DD/MM/AAAA"
              className="w-full h-6 text-[13px] border-0 border-b border-border bg-transparent outline-none focus:border-[var(--brand-blue)] transition placeholder:text-muted-foreground/60 mt-0.5"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="w-full h-8 bg-[var(--brand-navy)] text-white text-[12px] font-bold rounded-md hover:bg-[var(--brand-blue)] transition"
          >
            Salvar saldo
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ---------------------------------------------------------------------
// Zona 2 — KPIs
// ---------------------------------------------------------------------
function Zone2Kpis({
  hasConnections,
  snapshot,
  pendencias,
  onAction,
}: {
  hasConnections: boolean
  snapshot: CashflowSnapshot | null
  pendencias: Problema[]
  onAction: (id: string, action: AcaoProblema) => void
}) {
  // Lógica do veredito: sem conexão OU pendências > 0 → DADOS_INSUFICIENTES.
  // Conectado e zero pendências → OK.
  const verdictKey: Veredito = !hasConnections || pendencias.length > 0 ? "DADOS_INSUFICIENTES" : "OK"
  const veredito = VEREDITO_STYLES[verdictKey]

  const caixaHojeStr = snapshot ? fmtBRL(snapshot.caixaHoje) : "—"
  const minimoStr = snapshot ? fmtBRL(snapshot.kpis.minimo.value) : "—"
  const minimoMeta = snapshot ? `${snapshot.kpis.minimo.weekLabel} · ${snapshot.kpis.minimo.weekDateLabel}` : undefined
  const medioStr = snapshot ? fmtBRL(snapshot.kpis.medio) : "—"
  const medioMeta = snapshot ? "13 sem" : undefined
  const minimoColor = snapshot && snapshot.kpis.minimo.value < 0 ? "var(--brand-error-soft)" : undefined
  const medioColor = snapshot && snapshot.kpis.medio < 0 ? "var(--brand-error-soft)" : undefined

  return (
    <section className="mb-3 flex flex-wrap items-baseline border-y border-border py-2 px-1">
      <KpiInline label="Caixa hoje" value={caixaHojeStr} />
      <KpiInline label="Mínimo" value={minimoStr} valueColor={minimoColor} meta={minimoMeta} />
      <KpiInline label="Médio" value={medioStr} valueColor={medioColor} meta={medioMeta} />
      <div className="inline-flex items-baseline gap-2 px-4">
        <Popover>
          <PopoverTrigger
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded px-1.5 py-0.5 hover:bg-[rgba(7,29,59,0.06)] transition"
            style={{ color: veredito.fg }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: veredito.dotColor }} />
            {veredito.label}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[320px] p-3 text-[12px]">
            {!hasConnections ? (
              <div className="py-4 text-center">
                <Plug className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-[11px] font-semibold text-[var(--brand-navy)] mt-2">
                  Aguardando conexão dos dados
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Conecte banco, sistema de NF-e ou ERP em Conexões para o motor calcular o veredito.
                </p>
                <Link
                  href="/conexoes"
                  className="inline-flex items-center gap-1.5 mt-3 px-2.5 h-6 text-[11px] font-semibold rounded-md border border-border text-[var(--brand-navy)] hover:border-[var(--brand-blue)] transition"
                >
                  <Plug className="h-3 w-3" />
                  Ir para Conexões
                </Link>
              </div>
            ) : pendencias.length === 0 ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="h-6 w-6 mx-auto text-[var(--brand-green)]" />
                <p className="text-[11px] text-muted-foreground mt-2">Tudo verificado · nenhuma pendência</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                  <span className="text-[11px] font-semibold text-[var(--brand-navy)]">Dados insuficientes</span>
                  <span className="h-4 px-1.5 inline-flex items-center text-[10px] font-bold rounded-full bg-[rgba(224,139,0,0.10)] text-[var(--brand-warning)]">
                    {pendencias.length}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {pendencias.map((it) => (
                    <div key={it.id} className="rounded-md p-2 hover:bg-[rgba(7,29,59,0.03)] transition">
                      <p className="text-[11px] font-semibold text-[var(--brand-navy)] leading-tight">{it.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{it.detail}</p>
                      <p className="text-[10px] text-muted-foreground/80 leading-tight mt-0.5 italic">{it.impact}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {it.actions.map((a, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onAction(it.id, a)}
                            className="h-5 px-2 text-[10px] font-semibold border-[0.5px] border-border rounded-md text-[var(--brand-navy)] hover:bg-[rgba(21,103,200,0.06)] hover:border-[rgba(21,103,200,0.30)] hover:text-[var(--brand-blue)] transition"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>
        {pendencias.length > 0 && (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-semibold rounded px-1.5 py-0.5 transition hover:bg-[rgba(224,139,0,0.10)]"
            style={{ color: "var(--brand-warning)" }}
          >
            <AlertTriangle className="h-3 w-3" />
            {pendencias.length} críticas
          </button>
        )}
      </div>
    </section>
  )
}

function KpiInline({ label, value, valueColor, meta }: { label: string; value: string; valueColor?: string; meta?: string }) {
  return (
    <div className="inline-flex items-baseline gap-1.5 px-4 first:pl-1 border-r last:border-r-0 border-border rounded-md hover:bg-[rgba(7,29,59,0.04)] transition">
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      <span className="text-[13px] font-bold tabular-nums" style={{ color: valueColor ?? "var(--brand-navy)" }}>
        {value}
      </span>
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

function Zone3Grid({
  hasConnections,
  snapshot,
  weeks,
  onRowClick,
  onCellClick,
  onWeekClick,
  highlightedRowId,
  highlightedWeekIdx,
  expandedCell,
}: {
  hasConnections: boolean
  snapshot: CashflowSnapshot | null
  weeks: WeekHeader[]
  onRowClick?: (rowId: string) => void
  onCellClick?: (rowId: string, weekIdx: number) => void
  onWeekClick?: (weekIdx: number) => void
  highlightedRowId?: string | null
  highlightedWeekIdx?: number | null
  expandedCell?: { rowId: string; weekIdx: number } | null
}) {
  if (!snapshot) {
    return <EmptyCashflowGrid hasConnections={hasConnections} />
  }

  return (
    <FullCashflowGrid
      snapshot={snapshot}
      weeks={weeks}
      onRowClick={onRowClick}
      onCellClick={onCellClick}
      onWeekClick={onWeekClick}
      highlightedRowId={highlightedRowId}
      highlightedWeekIdx={highlightedWeekIdx}
      expandedCell={expandedCell}
    />
  )
}

function EmptyCashflowGrid({ hasConnections }: { hasConnections: boolean }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-8 md:p-10" aria-label="Grade de fluxo de caixa em 13 semanas">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fluxo de Caixa · 13 semanas</p>
      <h2 className="mt-1 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
        {hasConnections ? "Dados insuficientes para projetar o fluxo." : "Conecte dados para ver o fluxo de caixa de 13 semanas."}
      </h2>
      <p className="mt-2 max-w-[640px] text-[13px] leading-relaxed text-[var(--slate-700)]">
        A grade renderiza projeção semanal por atividade (Operação, Financiamento, Investimento, Entre Companhias), com saldos de Início e Final, Variação Líquida e a faixa "Depois da S13". Aparece aqui assim que o banco, sistema de NF-e ou ERP estiver conectado.
      </p>
      <Link
        href="/conexoes"
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:border-[var(--brand-blue)]/40"
        style={{ color: "var(--brand-navy)" }}
      >
        <Plug className="h-3.5 w-3.5" strokeWidth={2.2} />
        Ir para Conexões
      </Link>
    </section>
  )
}

function FullCashflowGrid({
  snapshot,
  weeks,
  onRowClick,
  onCellClick,
  onWeekClick,
  highlightedRowId,
  highlightedWeekIdx,
  expandedCell,
}: {
  snapshot: CashflowSnapshot
  weeks: WeekHeader[]
  onRowClick?: (rowId: string) => void
  onCellClick?: (rowId: string, weekIdx: number) => void
  onWeekClick?: (weekIdx: number) => void
  highlightedRowId?: string | null
  highlightedWeekIdx?: number | null
  expandedCell?: { rowId: string; weekIdx: number } | null
}) {
  const [nivel, setNivel] = useState<1 | 2 | 3>(2)
  const [open, setOpen] = useState<OpenState>({
    op: true,
    op_rec: false,
    op_sai: false,
    fin: false,
    inv: false,
    ic: false,
  })
  const toggle = (k: keyof OpenState) => setOpen((p) => ({ ...p, [k]: !p[k] }))

  const applyNivel = (n: 1 | 2 | 3) => {
    setNivel(n)
    if (n === 1) {
      setOpen({ op: false, op_rec: false, op_sai: false, fin: false, inv: false, ic: false })
    } else if (n === 2) {
      setOpen({ op: true, op_rec: false, op_sai: false, fin: true, inv: true, ic: true })
    } else {
      setOpen({ op: true, op_rec: true, op_sai: true, fin: true, inv: true, ic: true })
    }
  }

  // Subtotais derivados do snapshot
  const REC_OP_SUB_BY_WEEK = sumByWeek([snapshot.crReceber, snapshot.crRecuperacao, snapshot.outrasReceitas])
  const SAI_OP_SUB_BY_WEEK = sumByWeek([
    snapshot.cpPagar,
    snapshot.cpVencidos,
    snapshot.folha,
    snapshot.tributosVendas,
    snapshot.encargosTrab,
    snapshot.despesasOper,
  ])
  const REC_OP_BEYOND = snapshot.beyondCrReceber + 0 + 0
  const SAI_OP_BEYOND = snapshot.beyondCpPagar + 0 + 0 + 0 + 0 + 0

  const CL_OPERACAO = REC_OP_SUB_BY_WEEK.map((v, i) => v + SAI_OP_SUB_BY_WEEK[i])
  const CL_FINANCIAMENTO = sumByWeek([
    snapshot.emprestimosNovos,
    snapshot.aporteSocios,
    snapshot.emprestimoFin,
    snapshot.tarifasIof,
    snapshot.retiradaSocios,
  ])
  const CL_INVESTIMENTO = sumByWeek([snapshot.vendaEquip, snapshot.compraEquip])
  const CL_INTERCO = sumByWeek([snapshot.recebInterco, snapshot.pagtoInterco])

  const CL_OPERACAO_BEYOND = REC_OP_BEYOND + SAI_OP_BEYOND
  const CL_FIN_BEYOND = 0 + 0 + snapshot.beyondEmprestimo + 0 + 0
  const CL_INV_BEYOND = 0
  const CL_IC_BEYOND = 0

  const VARIACAO_LIQUIDA = CL_OPERACAO.map(
    (_, i) => CL_OPERACAO[i] + CL_FINANCIAMENTO[i] + CL_INVESTIMENTO[i] + CL_INTERCO[i],
  )
  const VARIACAO_BEYOND = CL_OPERACAO_BEYOND + CL_FIN_BEYOND + CL_INV_BEYOND + CL_IC_BEYOND

  return (
    <section className="rounded-2xl border border-border bg-card" aria-label="Grade de fluxo de caixa em 13 semanas">
      <div className="flex items-center justify-end px-3 py-1.5 border-b border-border">
        {[
          { value: 1 as const, label: "sintético" },
          { value: 2 as const, label: "grupos" },
          { value: 3 as const, label: "detalhado" },
        ].map((n, i) => (
          <span key={n.value} className="flex items-center">
            {i > 0 && <span className="text-[10px] text-muted-foreground/40 mx-1.5">·</span>}
            <button
              type="button"
              onClick={() => applyNivel(n.value)}
              className={
                nivel === n.value
                  ? "text-[10px] font-semibold text-[var(--brand-navy)] underline underline-offset-4 decoration-[var(--brand-blue)] decoration-1 transition"
                  : "text-[10px] font-medium text-muted-foreground hover:text-[var(--brand-navy)] transition"
              }
            >
              {n.label}
            </button>
          </span>
        ))}
      </div>

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
            {weeks.map((_, i) => (
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
              {weeks.map((w, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`px-1.5 py-2 text-right transition hover:!bg-[rgba(21,103,200,0.08)] hover:!text-[var(--brand-navy)] ${highlightedWeekIdx === i ? "!bg-[rgba(21,103,200,0.10)]" : ""}`}
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    background: highlightedWeekIdx === i ? "rgba(21,103,200,0.10)" : HEADER_GRADIENT,
                    color: highlightedWeekIdx === i ? "var(--brand-navy)" : "var(--muted-foreground)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid var(--brand-navy)",
                    cursor: "pointer",
                  }}
                  onClick={() => onWeekClick?.(i)}
                >
                  <div className="flex flex-col items-end leading-tight">
                    <span>{w.label}</span>
                    {w.mondayLabel && (
                      <span className="text-[9px] font-semibold opacity-80 tracking-normal normal-case">
                        {w.mondayLabel}
                      </span>
                    )}
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
            <DataRow
              label="Caixa Início do Período"
              values={snapshot.caixaInicio}
              total={snapshot.caixaInicio[0]}
              beyond={null}
              variant="subtotal"
            />

            <SectionHeader label="OPERAÇÃO" expanded={open.op} onToggle={() => toggle("op")} />

            {open.op && (
              <>
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
                      rowId="op_rec-cr_receber"
                      label={
                        <>
                          (+) <GlossaryTerm term="CR">CR</GlossaryTerm> a receber{" "}
                          <span className="text-muted-foreground">(vencimentos)</span>
                        </>
                      }
                      values={snapshot.crReceber}
                      total={sum(snapshot.crReceber)}
                      beyond={snapshot.beyondCrReceber}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_rec-cr_receber"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_rec-cr_receber" ? expandedCell.weekIdx : null}
                    />
                    <DataRow
                      rowId="op_rec-cr_recuperacao"
                      label={
                        <>
                          (+) <GlossaryTerm term="CR">CR</GlossaryTerm> vencidos{" "}
                          <span className="text-muted-foreground">- recuperação</span>
                        </>
                      }
                      values={snapshot.crRecuperacao}
                      total={sum(snapshot.crRecuperacao)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_rec-cr_recuperacao"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_rec-cr_recuperacao" ? expandedCell.weekIdx : null}
                    />
                    <DataRow
                      rowId="op_rec-outras"
                      label={<>(+) Outras receitas</>}
                      values={snapshot.outrasReceitas}
                      total={sum(snapshot.outrasReceitas)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_rec-outras"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_rec-outras" ? expandedCell.weekIdx : null}
                    />
                  </>
                )}

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
                      rowId="op_sai-cp_pagar"
                      label={
                        <>
                          (−) <GlossaryTerm term="CP">CP</GlossaryTerm> a pagar{" "}
                          <span className="text-muted-foreground">(vencimentos)</span>
                        </>
                      }
                      values={snapshot.cpPagar}
                      total={sum(snapshot.cpPagar)}
                      beyond={snapshot.beyondCpPagar}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_sai-cp_pagar"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_sai-cp_pagar" ? expandedCell.weekIdx : null}
                    />
                    <DataRow
                      rowId="op_sai-cp_vencidos"
                      label={
                        <>
                          (−) <GlossaryTerm term="CP">CP</GlossaryTerm> vencidos{" "}
                          <span className="text-muted-foreground">- renegociação</span>
                        </>
                      }
                      values={snapshot.cpVencidos}
                      total={sum(snapshot.cpVencidos)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_sai-cp_vencidos"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_sai-cp_vencidos" ? expandedCell.weekIdx : null}
                    />
                    <DataRow
                      rowId="op_sai-folha"
                      label={<>(−) Folha</>}
                      values={snapshot.folha}
                      total={sum(snapshot.folha)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_sai-folha"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_sai-folha" ? expandedCell.weekIdx : null}
                    />
                    <DataRow
                      rowId="op_sai-tributos"
                      label={<>(−) Tributos sobre Vendas</>}
                      values={snapshot.tributosVendas}
                      total={sum(snapshot.tributosVendas)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_sai-tributos"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_sai-tributos" ? expandedCell.weekIdx : null}
                    />
                    <DataRow
                      rowId="op_sai-encargos"
                      label={<>(−) Encargos Trabalhistas</>}
                      values={snapshot.encargosTrab}
                      total={sum(snapshot.encargosTrab)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_sai-encargos"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_sai-encargos" ? expandedCell.weekIdx : null}
                    />
                    <DataRow
                      rowId="op_sai-despesas"
                      label={<>(−) Despesas Operacionais</>}
                      values={snapshot.despesasOper}
                      total={sum(snapshot.despesasOper)}
                      beyond={0}
                      onClickRow={onRowClick}
                      onCellClick={onCellClick}
                      isHighlighted={highlightedRowId === "op_sai-despesas"}
                      highlightedWeekIdx={highlightedWeekIdx}
                      expandedWeekIdx={expandedCell?.rowId === "op_sai-despesas" ? expandedCell.weekIdx : null}
                    />
                  </>
                )}
              </>
            )}

            <DataRow
              label="→ Líquido da Operação"
              values={CL_OPERACAO}
              total={sum(CL_OPERACAO)}
              beyond={CL_OPERACAO_BEYOND}
              variant="subtotal"
            />

            <SectionHeader label="FINANCIAMENTO" expanded={open.fin} onToggle={() => toggle("fin")} />
            {open.fin && (
              <>
                <DataRow
                  rowId="fin-emprest_novos"
                  label={<>(+) Empréstimos novos</>}
                  values={snapshot.emprestimosNovos}
                  total={sum(snapshot.emprestimosNovos)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "fin-emprest_novos"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "fin-emprest_novos" ? expandedCell.weekIdx : null}
                />
                <DataRow
                  rowId="fin-aporte"
                  label={<>(+) Aporte de sócios</>}
                  values={snapshot.aporteSocios}
                  total={sum(snapshot.aporteSocios)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "fin-aporte"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "fin-aporte" ? expandedCell.weekIdx : null}
                />
                <DataRow
                  rowId="fin-emprest_fin"
                  label={<>(−) Empréstimo / Financiamento</>}
                  values={snapshot.emprestimoFin}
                  total={sum(snapshot.emprestimoFin)}
                  beyond={snapshot.beyondEmprestimo}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "fin-emprest_fin"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "fin-emprest_fin" ? expandedCell.weekIdx : null}
                />
                <DataRow
                  rowId="fin-tarifas"
                  label={
                    <>
                      (−) Tarifas Bancárias / <GlossaryTerm term="IOF">IOF</GlossaryTerm>
                    </>
                  }
                  values={snapshot.tarifasIof}
                  total={sum(snapshot.tarifasIof)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "fin-tarifas"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "fin-tarifas" ? expandedCell.weekIdx : null}
                />
                <DataRow
                  rowId="fin-retirada"
                  label={<>(−) Retiradas de Sócios</>}
                  values={snapshot.retiradaSocios}
                  total={sum(snapshot.retiradaSocios)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "fin-retirada"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "fin-retirada" ? expandedCell.weekIdx : null}
                />
              </>
            )}
            <DataRow
              label="→ Líquido do Financiamento"
              values={CL_FINANCIAMENTO}
              total={sum(CL_FINANCIAMENTO)}
              beyond={CL_FIN_BEYOND}
              variant="subtotal"
            />

            <SectionHeader label="INVESTIMENTO" expanded={open.inv} onToggle={() => toggle("inv")} />
            {open.inv && (
              <>
                <DataRow
                  rowId="inv-venda"
                  label={<>(+) Venda de Equipamentos</>}
                  values={snapshot.vendaEquip}
                  total={sum(snapshot.vendaEquip)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "inv-venda"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "inv-venda" ? expandedCell.weekIdx : null}
                />
                <DataRow
                  rowId="inv-compra"
                  label={<>(−) Compra de Equipamentos</>}
                  values={snapshot.compraEquip}
                  total={sum(snapshot.compraEquip)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "inv-compra"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "inv-compra" ? expandedCell.weekIdx : null}
                />
              </>
            )}
            <DataRow
              label="→ Líquido do Investimento"
              values={CL_INVESTIMENTO}
              total={sum(CL_INVESTIMENTO)}
              beyond={CL_INV_BEYOND}
              variant="subtotal"
            />

            <SectionHeader label="ENTRE COMPANHIAS" expanded={open.ic} onToggle={() => toggle("ic")} />
            {open.ic && (
              <>
                <DataRow
                  rowId="ic-receb"
                  label={<>(+) Recebimentos entre companhias</>}
                  values={snapshot.recebInterco}
                  total={sum(snapshot.recebInterco)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "ic-receb"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "ic-receb" ? expandedCell.weekIdx : null}
                />
                <DataRow
                  rowId="ic-pagto"
                  label={<>(−) Pagamentos entre companhias</>}
                  values={snapshot.pagtoInterco}
                  total={sum(snapshot.pagtoInterco)}
                  beyond={0}
                  onClickRow={onRowClick}
                  onCellClick={onCellClick}
                  isHighlighted={highlightedRowId === "ic-pagto"}
                  highlightedWeekIdx={highlightedWeekIdx}
                  expandedWeekIdx={expandedCell?.rowId === "ic-pagto" ? expandedCell.weekIdx : null}
                />
              </>
            )}
            <DataRow
              label="→ Líquido Entre Companhias"
              values={CL_INTERCO}
              total={sum(CL_INTERCO)}
              beyond={CL_IC_BEYOND}
              variant="subtotal"
            />

            <DataRow
              label="VARIAÇÃO LÍQUIDA DO CAIXA"
              values={VARIACAO_LIQUIDA}
              total={sum(VARIACAO_LIQUIDA)}
              beyond={VARIACAO_BEYOND}
              variant="subtotal"
              upperLabel
            />
            <DataRow
              label="Caixa Final do Período"
              values={snapshot.caixaFinal}
              total={snapshot.caixaFinal[12]}
              beyond={null}
              variant="subtotal"
            />
            <DataRow
              label="Caixa Mínimo Operacional"
              values={Array.from({ length: 13 }, () => snapshot.caixaMinimoOperacional)}
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
// SectionHeader
// =====================================================================
function SectionHeader({ label, expanded, onToggle }: { label: string; expanded: boolean; onToggle: () => void }) {
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
          <Icon
            className="h-3 w-3 transition-all opacity-60 group-hover:opacity-100 group-hover:text-[var(--brand-blue)]"
            strokeWidth={2.4}
            aria-hidden
            style={{ color: "var(--brand-navy)" }}
          />
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
      <td
        className="transition group-hover:!bg-[rgba(21,103,200,0.06)]"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", height: 26 }}
      />
    </tr>
  )
}

// =====================================================================
// SubGroupHeader
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
          <Icon
            className="h-3 w-3 transition-all opacity-60 group-hover:opacity-100 group-hover:text-[var(--brand-blue)]"
            strokeWidth={2.4}
            aria-hidden
            style={{ color: "var(--brand-navy)" }}
          />
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
// DataRow
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
  rowId,
  isHighlighted = false,
  highlightedWeekIdx,
  expandedWeekIdx,
}: {
  label: ReactNode
  values: number[]
  total: number | null
  beyond?: number | null
  variant?: RowVariant
  upperLabel?: boolean
  isLast?: boolean
  onClickRow?: (rowId: string) => void
  onCellClick?: (rowId: string, weekIdx: number) => void
  rowId?: string
  isHighlighted?: boolean
  highlightedWeekIdx?: number | null
  expandedWeekIdx?: number | null
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

  const highlightBg = "rgba(21,103,200,0.10)"

  return (
    <>
      <tr
        className={isClickable ? "group cursor-pointer transition-colors" : undefined}
        onClick={isClickable && rowId ? () => onClickRow?.(rowId) : undefined}
      >
        <th
          scope="row"
          className={`px-3 py-1.5 text-left${isClickable ? " transition group-hover:!bg-[rgba(21,103,200,0.05)]" : ""}`}
          style={{
            position: "sticky",
            left: 0,
            zIndex: 1,
            background: isHighlighted ? highlightBg : rowBg,
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
        {values.map((v, i) => {
          const isCellExpanded = expandedWeekIdx === i
          const isCellHighlighted = highlightedWeekIdx === i
          const cellBg = isHighlighted
            ? highlightBg
            : isCellExpanded
            ? "rgba(21,103,200,0.12)"
            : isCellHighlighted
            ? "rgba(21,103,200,0.04)"
            : rowBg
          return (
            <NumericCell
              key={i}
              value={v}
              baseBg={cellBg}
              fontWeight={valueWeight}
              italic={italic}
              colorOverride={variant === "muted" ? "var(--muted-foreground)" : undefined}
              colorRule={colorRule}
              borderBottom={borderBottom}
              className={isClickable ? "transition group-hover:!bg-[rgba(21,103,200,0.05)]" : undefined}
              onClick={isClickable && rowId ? () => onCellClick?.(rowId, i) : undefined}
            />
          )
        })}
        <NumericCell
          value={total}
          baseBg={isHighlighted ? highlightBg : rowBg}
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
          baseBg={isHighlighted ? highlightBg : rowBg}
          fontWeight={Math.max(valueWeight, 600) as 600 | 700}
          italic={italic}
          colorOverride={variant === "muted" ? "var(--muted-foreground)" : undefined}
          colorRule={colorRule}
          borderBottom={borderBottom}
          isTotalCol
          className={isClickable ? "transition group-hover:!bg-[rgba(21,103,200,0.05)]" : undefined}
        />
      </tr>
    </>
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
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation()
              onClick()
            }
          : undefined
      }
    >
      {fmtCompact(isEmpty ? null : (value as number))}
    </td>
  )
}
