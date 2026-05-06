"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react"

/**
 * /fluxo-de-caixa
 *
 * DFC pelo método direto em janela rolante de 13 semanas, com 4 atividades
 * — Operação, Financiamento, Investimento e Entre Companhias — cada qual
 * fechando em uma linha "Caixa Líquido". Linhas de fechamento agregam
 * Variação Líquida, Caixa de Início e Caixa de Final do período.
 *
 * DEMO visual. Quando o Núcleo de Dados for plugado, os arrays MOCK_*
 * abaixo são substituídos por um hook do tipo useCashflow13w(activeUnit)
 * que devolve a mesma forma.
 */

// =====================================================================
// Tokens — paleta minimalista. Totais perdem fundo navy: distinção só por
// peso/cor e, para Total/Depois, um separador esquerdo cinza (#E5EBF2 4px).
// =====================================================================
const NAVY = "#071D3B"
const BLUE = "#1567C8"
const CYAN = "#38B8E8"
const GREEN = "#36BA58"
const NEG = "#D14343"      // negativo, sempre #D14343 (fundo claro, único agora)
const WARN = "#E08B00"
const INK = "#0F1B2D"
const MUTED = "#5B6B82"
const LINE = "#E5EBF2"
const BG = "#F7F9FC"

// =====================================================================
// Janela de 13 semanas (sempre segunda → domingo)
// Hoje (05/05/26) cai na S1; S13 cobre 27/07-02/08, com mínimo em 28/07.
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
// Mocks Gregorutt (inalterados — engenharia mínima em S13 = -251.633)
// =====================================================================
const CAIXA_MINIMO_OPERACIONAL = 25_000

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

// --- Subtotais por sub-grupo (mostrados quando o sub-grupo está colapsado) ---
const REC_OP_SUB_BY_WEEK = sumByWeek([CR_RECEBER, CR_RECUPERACAO, OUTRAS_RECEITAS])
const SAI_OP_SUB_BY_WEEK = sumByWeek([CP_A_PAGAR, CP_VENCIDOS, FOLHA, TRIBUTOS_VENDAS, ENCARGOS_TRAB, DESPESAS_OPER])
const REC_OP_BEYOND = BEYOND_CR_RECEBER + 0 + 0
const SAI_OP_BEYOND = BEYOND_CP_A_PAGAR + 0 + 0 + 0 + 0 + 0

// --- Caixa Líquido por atividade ---
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
// Formatador compacto: sem "R$", parênteses contábeis para negativos,
// "—" para 0/null. "Valores em R$" entra como rótulo único no header.
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
  LIMPO: { label: "LIMPO", bg: "rgba(54,186,88,0.14)", fg: GREEN },
  ATENCAO: { label: "ATENÇÃO", bg: "rgba(224,139,0,0.14)", fg: WARN },
  ALERTA: { label: "ALERTA", bg: "rgba(224,139,0,0.18)", fg: "#B86D00" },
  CRITICO: { label: "CRÍTICO", bg: "rgba(209,67,67,0.14)", fg: NEG },
  DADOS_INSUFICIENTES: { label: "DADOS INSUFICIENTES", bg: "#EEF1F5", fg: MUTED },
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
      <span className="cursor-help border-b border-dotted" style={{ borderColor: "rgba(91,107,130,0.55)" }} aria-describedby={`gloss-${term}`}>
        {children}
      </span>
      <span
        id={`gloss-${term}`}
        role="tooltip"
        className="pointer-events-none invisible absolute left-0 top-full z-[60] mt-1.5 w-64 rounded-md px-3 py-2 text-[12px] font-normal normal-case leading-snug opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
        style={{ background: NAVY, color: "#FFFFFF", letterSpacing: "normal", fontFamily: "var(--font-sans)", boxShadow: "0 8px 20px -6px rgba(7,29,59,0.35)" }}
      >
        <strong className="block text-[12px] font-semibold">{entry.title}</strong>
        <span className="mt-0.5 block opacity-90">{entry.body}</span>
      </span>
    </span>
  )
}

// =====================================================================
// Página
// =====================================================================
export default function FluxoDeCaixa13Semanas() {
  const [escopo, setEscopo] = useState<"unidade" | "consolidado">("unidade")

  return (
    <div
      className="-mx-8 -my-3 min-h-[calc(100vh-3rem)] px-8 py-8 md:-mx-10 md:px-10 lg:-mx-12 lg:-my-4 lg:px-12 lg:py-10"
      style={{ background: BG, color: INK, fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto w-full max-w-[1340px]">
        <Zone1Header escopo={escopo} setEscopo={setEscopo} />
        <Zone2Kpis />
        <Zone3Grid />
        <FooterPendencias />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------
// Zona 1 — Header
// ---------------------------------------------------------------------
function Zone1Header({
  escopo,
  setEscopo,
}: {
  escopo: "unidade" | "consolidado"
  setEscopo: (v: "unidade" | "consolidado") => void
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {/* (7) Título: "Fluxo de Caixa" sem "13 semanas" */}
        <h1
          className="text-[28px] font-semibold leading-tight tracking-tight"
          style={{ color: NAVY, fontFamily: "var(--font-serif)" }}
        >
          Fluxo de Caixa
        </h1>
        <p className="mt-1.5 text-[13px]" style={{ color: MUTED }}>
          Atualizado em 06/05 às 14:23
        </p>
      </div>

      {/* (6) Toggle Unidade — Montserrat 13px, pill clean. */}
      <div
        className="inline-flex items-center gap-1 rounded-full border p-1"
        role="tablist"
        aria-label="Escopo de visualização"
        style={{ borderColor: LINE, background: "#FFFFFF", fontFamily: "var(--font-sans)" }}
      >
        <span className="px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
          Unidade
        </span>
        <button
          role="tab"
          aria-selected={escopo === "unidade"}
          onClick={() => setEscopo("unidade")}
          className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors"
          style={{
            background: escopo === "unidade" ? NAVY : "transparent",
            color: escopo === "unidade" ? "#FFFFFF" : MUTED,
          }}
        >
          Gregorutt
        </button>
        <button
          role="tab"
          aria-selected={escopo === "consolidado"}
          onClick={() => setEscopo("consolidado")}
          className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors"
          style={{
            background: escopo === "consolidado" ? NAVY : "transparent",
            color: escopo === "consolidado" ? "#FFFFFF" : MUTED,
          }}
        >
          Consolidado
        </button>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-[13px] font-semibold transition-colors hover:opacity-90"
        style={{ borderColor: NAVY, color: NAVY }}
      >
        <RefreshCw className="h-4 w-4" strokeWidth={1.8} />
        Atualizar
      </button>
    </header>
  )
}

// ---------------------------------------------------------------------
// Zona 2 — KPIs (Montserrat, valor 18px navy semi-bold, mais compactos)
// ---------------------------------------------------------------------
function Zone2Kpis() {
  const veredito = VEREDITO_STYLES[VEREDITO_ATUAL]
  return (
    <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Caixa Atual" value={fmtBRL(34_494)} sub="Hoje · 05/05" />
      <KpiCard label="Caixa Mínimo da Janela" value={fmtBRL(-251_633)} valueColor={NEG} sub="em 28/07 (S13)" />
      <KpiCard label="Caixa Médio Projetado" value={fmtBRL(-121_566)} valueColor={NEG} sub="Média das 13 semanas" />
      <article className="relative overflow-hidden rounded-lg border bg-white p-3" style={{ borderColor: LINE }}>
        <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: CYAN }} />
        <p className="text-[10px] font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.1em" }}>Veredito</p>
        <div className="mt-2 flex items-center">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide"
            style={{ background: veredito.bg, color: veredito.fg }}
          >
            {veredito.label}
          </span>
        </div>
        <p className="mt-1.5 text-[11px]" style={{ color: MUTED }}>Aguardando ingestão completa</p>
      </article>
    </section>
  )
}

function KpiCard({ label, value, sub, valueColor }: { label: string; value: string; sub: string; valueColor?: string }) {
  return (
    <article className="relative overflow-hidden rounded-lg border bg-white p-3" style={{ borderColor: LINE }}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: CYAN }} />
      <p className="text-[10px] font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.1em" }}>
        {label}
      </p>
      {/* (4) Valor: Montserrat 18px navy semi-bold (sem Fraunces) */}
      <p
        className="mt-1.5 text-[18px] font-semibold leading-tight tabular-nums"
        style={{ color: valueColor ?? NAVY, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px]" style={{ color: MUTED }}>
        {sub}
      </p>
    </article>
  )
}

// ---------------------------------------------------------------------
// Zona 3 — Grid 13 semanas (DFC pelo método direto, expand/collapse 2 níveis)
// ---------------------------------------------------------------------
const FIRST_COL_WIDTH = 220
const WEEK_COL_WIDTH = 65
const TOTAL_COL_WIDTH = 95
const BEYOND_COL_WIDTH = 95
// (3) Separador discreto antes das colunas Total / Depois da S13.
const TOTAL_BORDER_LEFT = `4px solid ${LINE}`
const HEADER_GRADIENT = `linear-gradient(180deg, ${NAVY} 0%, #0a2853 100%)`

type OpenState = { op: boolean; op_rec: boolean; op_sai: boolean; fin: boolean; inv: boolean; ic: boolean }

function Zone3Grid() {
  // DEFAULT: Operação aberta como container, mas com sub-grupos colapsados
  // (mostra subtotais Receitas/Saídas Op por semana). Demais atividades fechadas.
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
    <section className="rounded-lg border bg-white" style={{ borderColor: LINE }} aria-label="Grade de fluxo de caixa em 13 semanas">
      {/* Sub-header da tabela: rótulo único de unidade monetária */}
      <div
        className="flex items-center justify-between gap-2 border-b px-4 py-2"
        style={{ borderColor: LINE }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
          Valores em R$
        </span>
        <span className="text-[11px]" style={{ color: MUTED }}>
          Negativos exibidos entre parênteses
        </span>
      </div>

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
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Categoria
              </th>
              {/* (5) Header semana: 65px, "S1" + "04/Mai/26" */}
              {WEEKS.map((w, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-1.5 py-2 text-right"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    background: HEADER_GRADIENT,
                    color: "#FFFFFF",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
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
                className="px-1.5 py-2 text-right"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  background: HEADER_GRADIENT,
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  borderLeft: TOTAL_BORDER_LEFT,
                }}
              >
                <div className="flex flex-col items-end leading-tight">
                  <span>Total</span>
                  <span className="text-[9px] font-semibold opacity-80 tracking-normal normal-case">13 sem</span>
                </div>
              </th>
              {/* (1) "Beyond" → "Depois da S13" */}
              <th
                scope="col"
                className="px-1.5 py-2 text-right"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  background: HEADER_GRADIENT,
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
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
            {/* ===================== 1. OPERAÇÃO ===================== */}
            <SectionHeader label="OPERAÇÃO" expanded={open.op} onToggle={() => toggle("op")} />

            {open.op && (
              <>
                {/* (8) Sub-grupo nível 0: Receitas Operacionais — fontWeight 600 */}
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
                      label={<>(+) <GlossaryTerm term="CR">CR</GlossaryTerm> a receber <span style={{ color: MUTED }}>(vencimentos)</span></>}
                      values={CR_RECEBER}
                      total={sum(CR_RECEBER)}
                      beyond={BEYOND_CR_RECEBER}
                    />
                    <DataRow
                      label={<>(+) <GlossaryTerm term="CR">CR</GlossaryTerm> vencidos <span style={{ color: MUTED }}>- recuperação</span></>}
                      values={CR_RECUPERACAO}
                      total={sum(CR_RECUPERACAO)}
                      beyond={0}
                    />
                    <DataRow label={<>(+) Outras receitas</>} values={OUTRAS_RECEITAS} total={sum(OUTRAS_RECEITAS)} beyond={0} />
                  </>
                )}

                {/* (8) Sub-grupo nível 0: Saídas Operacionais — fontWeight 600 */}
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
                      label={<>(−) <GlossaryTerm term="CP">CP</GlossaryTerm> a pagar <span style={{ color: MUTED }}>(vencimentos)</span></>}
                      values={CP_A_PAGAR}
                      total={sum(CP_A_PAGAR)}
                      beyond={BEYOND_CP_A_PAGAR}
                    />
                    <DataRow
                      label={<>(−) <GlossaryTerm term="CP">CP</GlossaryTerm> vencidos <span style={{ color: MUTED }}>- renegociação</span></>}
                      values={CP_VENCIDOS}
                      total={sum(CP_VENCIDOS)}
                      beyond={0}
                    />
                    <DataRow label={<>(−) Folha</>} values={FOLHA} total={sum(FOLHA)} beyond={0} />
                    <DataRow label={<>(−) Tributos sobre Vendas</>} values={TRIBUTOS_VENDAS} total={sum(TRIBUTOS_VENDAS)} beyond={0} />
                    <DataRow label={<>(−) Encargos Trabalhistas</>} values={ENCARGOS_TRAB} total={sum(ENCARGOS_TRAB)} beyond={0} />
                    <DataRow label={<>(−) Despesas Operacionais</>} values={DESPESAS_OPER} total={sum(DESPESAS_OPER)} beyond={0} />
                  </>
                )}
              </>
            )}

            {/* (8) Caixa Líquido da atividade — fontWeight 700 navy, fundo branco */}
            <DataRow
              label="→ Caixa Líquido da Operação"
              values={CL_OPERACAO}
              total={sum(CL_OPERACAO)}
              beyond={CL_OPERACAO_BEYOND}
              variant="caixaLiquido"
            />

            {/* ===================== 2. FINANCIAMENTO ===================== */}
            <SectionHeader label="FINANCIAMENTO" expanded={open.fin} onToggle={() => toggle("fin")} />
            {open.fin && (
              <>
                <DataRow label={<>(+) Empréstimos novos</>} values={EMPRESTIMOS_NOVOS} total={sum(EMPRESTIMOS_NOVOS)} beyond={0} />
                <DataRow label={<>(+) Aporte de sócios</>} values={APORTE_SOCIOS} total={sum(APORTE_SOCIOS)} beyond={0} />
                <DataRow label={<>(−) Empréstimo / Financiamento</>} values={EMPRESTIMO_FIN} total={sum(EMPRESTIMO_FIN)} beyond={BEYOND_EMPRESTIMO} />
                <DataRow
                  label={<>(−) Tarifas Bancárias / <GlossaryTerm term="IOF">IOF</GlossaryTerm></>}
                  values={TARIFAS_IOF}
                  total={sum(TARIFAS_IOF)}
                  beyond={0}
                />
                <DataRow label={<>(−) Retiradas de Sócios</>} values={RETIRADA_SOCIOS} total={sum(RETIRADA_SOCIOS)} beyond={0} />
              </>
            )}
            <DataRow
              label="→ Caixa Líquido do Financiamento"
              values={CL_FINANCIAMENTO}
              total={sum(CL_FINANCIAMENTO)}
              beyond={CL_FIN_BEYOND}
              variant="caixaLiquido"
            />

            {/* ===================== 3. INVESTIMENTO ===================== */}
            <SectionHeader label="INVESTIMENTO" expanded={open.inv} onToggle={() => toggle("inv")} />
            {open.inv && (
              <>
                <DataRow label={<>(+) Venda de Equipamentos</>} values={VENDA_EQUIP} total={sum(VENDA_EQUIP)} beyond={0} />
                <DataRow label={<>(−) Compra de Equipamentos</>} values={COMPRA_EQUIP} total={sum(COMPRA_EQUIP)} beyond={0} />
              </>
            )}
            <DataRow
              label="→ Caixa Líquido do Investimento"
              values={CL_INVESTIMENTO}
              total={sum(CL_INVESTIMENTO)}
              beyond={CL_INV_BEYOND}
              variant="caixaLiquido"
            />

            {/* ===================== 4. ENTRE COMPANHIAS ===================== */}
            <SectionHeader label="ENTRE COMPANHIAS" expanded={open.ic} onToggle={() => toggle("ic")} />
            {open.ic && (
              <>
                <DataRow label={<>(+) Recebimentos entre companhias</>} values={RECEB_INTERCO} total={sum(RECEB_INTERCO)} beyond={0} />
                <DataRow label={<>(−) Pagamentos entre companhias</>} values={PAGTO_INTERCO} total={sum(PAGTO_INTERCO)} beyond={0} />
              </>
            )}
            <DataRow
              label="→ Caixa Líquido Entre Companhias"
              values={CL_INTERCO}
              total={sum(CL_INTERCO)}
              beyond={CL_IC_BEYOND}
              variant="caixaLiquido"
            />

            {/* ===================== Fechamento (todos fundo branco, navy 700) ===================== */}
            <DataRow
              label="VARIAÇÃO LÍQUIDA DE CAIXA"
              values={VARIACAO_LIQUIDA}
              total={sum(VARIACAO_LIQUIDA)}
              beyond={VARIACAO_BEYOND}
              variant="variacao"
            />
            <DataRow
              label="Caixa - Início do Período"
              values={CAIXA_INICIO}
              total={null}
              beyond={null}
              variant="saldo"
            />
            <DataRow
              label="Caixa - Final do Período"
              values={CAIXA_FINAL}
              total={null}
              beyond={null}
              variant="saldo"
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
// SectionHeader (nível 1) — (2) BRANCO, navy bold uppercase 11px,
// 8px de espaçamento vertical antes da seção. Sem fill navy.
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
      style={{ cursor: "pointer" }}
    >
      <th
        scope="row"
        className="px-3 text-left"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: "#FFFFFF",
          color: NAVY,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          paddingTop: 8, // espaçamento de 8px antes da seção
          paddingBottom: 6,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          <Icon className="h-3 w-3" strokeWidth={2.4} aria-hidden style={{ color: NAVY }} />
          {label}
        </span>
      </th>
      {Array.from({ length: 13 }).map((_, i) => (
        <td
          key={i}
          style={{ background: "#FFFFFF", borderBottom: `1px solid ${LINE}`, height: 26 }}
        />
      ))}
      <td
        style={{
          background: "#FFFFFF",
          borderBottom: `1px solid ${LINE}`,
          borderLeft: TOTAL_BORDER_LEFT,
          height: 26,
        }}
      />
      <td style={{ background: "#FFFFFF", borderBottom: `1px solid ${LINE}`, height: 26 }} />
    </tr>
  )
}

// =====================================================================
// SubGroupHeader (nível 2) — Receitas/Saídas Operacionais.
// Quando colapsado: subtotal por semana/total/depois. Quando expandido: cells vazias.
// (8) fontWeight 600 navy.
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
  const labelBg = "#FAFBFD"

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
      style={{ cursor: "pointer" }}
    >
      <th
        scope="row"
        className="px-3 py-1.5 text-left"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: labelBg,
          color: NAVY,
          fontSize: 11,
          fontWeight: 600,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          <Icon className="h-3 w-3" strokeWidth={2.4} aria-hidden style={{ color: MUTED }} />
          {label}
        </span>
      </th>
      {expanded
        ? Array.from({ length: 13 }).map((_, i) => (
            <td key={i} style={{ background: labelBg, borderBottom: `1px solid ${LINE}`, height: 24 }} />
          ))
        : subtotalValues.map((v, i) => (
            <NumericCell
              key={i}
              value={v}
              baseBg={labelBg}
              fontWeight={600}
              colorRule="signed"
              borderBottom={`1px solid ${LINE}`}
            />
          ))}
      <NumericCell
        value={expanded ? null : subtotalTotal}
        baseBg={labelBg}
        fontWeight={600}
        colorRule="signed"
        borderBottom={`1px solid ${LINE}`}
        isTotalCol
      />
      <NumericCell
        value={expanded ? null : subtotalBeyond}
        baseBg={labelBg}
        fontWeight={600}
        colorRule="signed"
        borderBottom={`1px solid ${LINE}`}
        isTotalCol
      />
    </tr>
  )
}

// =====================================================================
// DataRow — variantes:
//   default     : peso 500 INK, label NAVY 500
//   caixaLiquido: peso 700 NAVY, label NAVY 700
//   variacao    : peso 700 NAVY uppercase
//   saldo       : peso 700 NAVY (Caixa Início/Final)
//   muted       : muted italic (Caixa Mínimo Operacional)
// =====================================================================
type RowVariant = "default" | "caixaLiquido" | "variacao" | "saldo" | "muted"

function DataRow({
  label,
  values,
  total,
  beyond = null,
  variant = "default",
  isLast = false,
}: {
  label: ReactNode
  values: number[]
  total: number | null
  beyond?: number | null
  variant?: RowVariant
  isLast?: boolean
}) {
  const borderBottom = isLast ? "none" : `1px solid ${LINE}`

  // Resolve estilos por variant.
  let labelColor = NAVY
  let valueWeight: 400 | 500 | 600 | 700 = 500
  let labelWeight: 400 | 500 | 600 | 700 = 500
  let italic = false
  let upperLabel = false
  let colorRule: "default" | "signed" = "default"

  switch (variant) {
    case "caixaLiquido":
      labelWeight = 700
      valueWeight = 700
      colorRule = "signed"
      break
    case "variacao":
      labelWeight = 700
      valueWeight = 700
      upperLabel = true
      colorRule = "signed"
      break
    case "saldo":
      labelWeight = 700
      valueWeight = 700
      colorRule = "signed"
      break
    case "muted":
      labelColor = MUTED
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
    <tr>
      <th
        scope="row"
        className="px-3 py-1.5 text-left"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: "#FFFFFF",
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
          baseBg="#FFFFFF"
          fontWeight={valueWeight}
          italic={italic}
          colorOverride={variant === "muted" ? MUTED : undefined}
          colorRule={colorRule}
          borderBottom={borderBottom}
        />
      ))}
      <NumericCell
        value={total}
        baseBg="#FFFFFF"
        fontWeight={Math.max(valueWeight, 600) as 600 | 700}
        italic={italic}
        colorOverride={variant === "muted" ? MUTED : undefined}
        colorRule={colorRule}
        borderBottom={borderBottom}
        isTotalCol
      />
      <NumericCell
        value={beyond}
        baseBg="#FFFFFF"
        fontWeight={Math.max(valueWeight, 600) as 600 | 700}
        italic={italic}
        colorOverride={variant === "muted" ? MUTED : undefined}
        colorRule={colorRule}
        borderBottom={borderBottom}
        isTotalCol
      />
    </tr>
  )
}

// =====================================================================
// NumericCell — coluna Total/Depois ganha border-left 4px #E5EBF2
// e font-weight mínimo 600 (regra (3)).
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
}: {
  value: number | null
  baseBg: string
  fontWeight?: 400 | 500 | 600 | 700
  italic?: boolean
  colorOverride?: string
  colorRule?: "default" | "signed"
  borderBottom: string
  isTotalCol?: boolean
}) {
  const isEmpty = value === null || value === undefined
  const isNegative = !isEmpty && (value as number) < 0

  let color: string
  if (isEmpty) {
    color = MUTED
  } else if (colorOverride) {
    color = colorOverride
  } else if (colorRule === "signed") {
    // (9) Negativos: #D14343 + parênteses (parens vêm do fmtCompact)
    color = isNegative ? NEG : NAVY
  } else {
    color = isNegative ? NEG : INK
  }

  return (
    <td
      className="px-1.5 py-1.5 text-right"
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
    >
      {fmtCompact(isEmpty ? null : (value as number))}
    </td>
  )
}

// ---------------------------------------------------------------------
// Footer pendências
// ---------------------------------------------------------------------
function FooterPendencias() {
  return (
    <footer className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]" style={{ color: MUTED }}>
      <span>Pendências críticas:</span>
      <button type="button" className="font-semibold underline-offset-2 hover:underline" style={{ color: BLUE }}>
        1
      </button>
      <span>(Banco sem dado recente)</span>
      <span aria-hidden style={{ color: MUTED }}>·</span>
      <span>Pendências laterais:</span>
      <button type="button" className="font-semibold underline-offset-2 hover:underline" style={{ color: BLUE }}>
        0
      </button>
    </footer>
  )
}
