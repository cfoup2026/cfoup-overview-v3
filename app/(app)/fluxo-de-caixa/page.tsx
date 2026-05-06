"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react"

/**
 * /fluxo-de-caixa
 *
 * Hub central da Mesa de Decisão: caixa em janela rolante de 13 semanas.
 * DFC pelo método direto (Cash Flow Statement adaptado a 13 semanas), com
 * 4 atividades — Operação, Financiamento, Investimento e Entre Companhias —
 * cada qual fechando em uma linha "Caixa Líquido". Linhas de fechamento
 * agregam Variação Líquida, Caixa de Início e Caixa de Final do período.
 *
 * DEMO visual. Quando o Núcleo de Dados for plugado, os arrays MOCK_*
 * abaixo são substituídos por um hook do tipo useCashflow13w(activeUnit)
 * que devolve a mesma forma.
 */

// =====================================================================
// Tokens
// =====================================================================
const NAVY = "#071D3B"
const NAVY_MID = "#0A2647"   // subtotais "Caixa Líquido" e Variação Líquida
const NAVY_DARK = "#051634"  // Caixa Início/Final, header e cells da col Total/Beyond
const BLUE = "#1567C8"
const CYAN = "#38B8E8"
const GREEN = "#36BA58"
const NEG = "#D14343"        // negativo em fundo claro (parênteses contábeis)
const NEG_DARK = "#FF8B8B"   // negativo em fundo escuro (Caixa Líquido / Variação / Saldos / col Total)
const WARN = "#E08B00"
const INK = "#0F1B2D"
const MUTED = "#5B6B82"
const LINE = "#E5EBF2"
const BG = "#F7F9FC"

// Linhas de subtotal/fechamento — todas dark navy.
const ROW_BG_CAIXA_LIQUIDO = NAVY_MID
const ROW_BG_VARIACAO = NAVY_MID
const ROW_BG_SALDO = NAVY_DARK
const TOTAL_COL_BG = NAVY_DARK // background fixo das células das colunas Total/Beyond

// =====================================================================
// Janela de 13 semanas (segunda-domingo, abrindo em 05/05)
// =====================================================================
type WeekHeader = { label: string; range: string }
const WEEKS: WeekHeader[] = [
  { label: "S1", range: "05/05-11/05" },
  { label: "S2", range: "12/05-18/05" },
  { label: "S3", range: "19/05-25/05" },
  { label: "S4", range: "26/05-01/06" },
  { label: "S5", range: "02/06-08/06" },
  { label: "S6", range: "09/06-15/06" },
  { label: "S7", range: "16/06-22/06" },
  { label: "S8", range: "23/06-29/06" },
  { label: "S9", range: "30/06-06/07" },
  { label: "S10", range: "07/07-13/07" },
  { label: "S11", range: "14/07-20/07" },
  { label: "S12", range: "21/07-27/07" },
  { label: "S13", range: "28/07-03/08" },
]

// =====================================================================
// Mocks Gregorutt
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

// --- Beyond (após S13) ---
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
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight" style={{ color: NAVY, fontFamily: "var(--font-serif)" }}>
          Fluxo de Caixa <span style={{ color: MUTED }}>·</span> 13 semanas
        </h1>
        <p className="mt-1.5 text-[13px]" style={{ color: MUTED }}>
          Atualizado em 06/05 às 14:23
        </p>
      </div>

      <div className="inline-flex items-center gap-1 rounded-full border p-1" role="tablist" aria-label="Escopo de visualização" style={{ borderColor: LINE, background: "#FFFFFF" }}>
        <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
          Unidade:
        </span>
        <button
          role="tab"
          aria-selected={escopo === "unidade"}
          onClick={() => setEscopo("unidade")}
          className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors"
          style={{ background: escopo === "unidade" ? NAVY : "transparent", color: escopo === "unidade" ? "#FFFFFF" : MUTED }}
        >
          Gregorutt
        </button>
        <button
          role="tab"
          aria-selected={escopo === "consolidado"}
          onClick={() => setEscopo("consolidado")}
          className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors"
          style={{ background: escopo === "consolidado" ? NAVY : "transparent", color: escopo === "consolidado" ? "#FFFFFF" : MUTED }}
        >
          Consolidado
        </button>
      </div>

      <button type="button" className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-[13px] font-semibold transition-colors hover:opacity-90" style={{ borderColor: NAVY, color: NAVY }}>
        <RefreshCw className="h-4 w-4" strokeWidth={1.8} />
        Atualizar
      </button>
    </header>
  )
}

// ---------------------------------------------------------------------
// Zona 2 — KPIs
// ---------------------------------------------------------------------
function Zone2Kpis() {
  const veredito = VEREDITO_STYLES[VEREDITO_ATUAL]
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Caixa Atual" value={fmtBRL(34_494)} sub="Hoje · 05/05" />
      <KpiCard label="Caixa Mínimo da Janela" value={fmtBRL(-251_633)} valueColor={NEG} sub="em 28/07 (S13)" />
      <KpiCard label="Caixa Médio Projetado" value={fmtBRL(-121_566)} valueColor={NEG} sub="Média das 13 semanas" />
      <article className="relative overflow-hidden rounded-lg border bg-white p-4" style={{ borderColor: LINE }}>
        <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: CYAN }} />
        <p className="text-[10px] font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.1em" }}>Veredito</p>
        <div className="mt-3 flex items-center">
          <span className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-bold tracking-wide" style={{ background: veredito.bg, color: veredito.fg }}>
            {veredito.label}
          </span>
        </div>
        <p className="mt-2 text-[12px]" style={{ color: MUTED }}>Aguardando ingestão completa</p>
      </article>
    </section>
  )
}

function KpiCard({ label, value, sub, valueColor }: { label: string; value: string; sub: string; valueColor?: string }) {
  return (
    <article className="relative overflow-hidden rounded-lg border bg-white p-4" style={{ borderColor: LINE }}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: CYAN }} />
      <p className="text-[10px] font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.1em" }}>{label}</p>
      <p className="mt-2 text-[26px] font-semibold leading-tight tabular-nums" style={{ color: valueColor ?? NAVY, fontFamily: "var(--font-serif)", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </p>
      <p className="mt-1 text-[12px]" style={{ color: MUTED }}>{sub}</p>
    </article>
  )
}

// ---------------------------------------------------------------------
// Zona 3 — Grid 13 semanas (DFC pelo método direto, expand/collapse 2 níveis)
// ---------------------------------------------------------------------
const FIRST_COL_WIDTH = 220
const WEEK_COL_WIDTH = 65
const TOTAL_COL_WIDTH = 85
const BEYOND_COL_WIDTH = 85
const HEADER_GRADIENT = `linear-gradient(180deg, ${NAVY} 0%, #0a2853 100%)`

type OpenState = { op: boolean; op_rec: boolean; op_sai: boolean; fin: boolean; inv: boolean; ic: boolean }

function Zone3Grid() {
  // DEFAULT: tudo "colapsado" — Operação aberta como container (mostra os 2 sub-headers Receitas/Saídas Op),
  // mas cada sub-grupo está fechado mostrando apenas seu subtotal. Demais atividades fechadas, mostrando
  // apenas a linha "Caixa Líquido da [atividade]".
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
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2" style={{ borderColor: LINE }}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
          Valores em R$
        </span>
        <span className="text-[11px]" style={{ color: MUTED }}>
          Negativos exibidos entre parênteses
        </span>
      </div>

      {/* Wrapper com scrollbars sempre visíveis (overflow:scroll, não auto) */}
      <div
        style={{
          overflowX: "scroll",
          overflowY: "scroll",
          maxHeight: "70vh",
        }}
      >
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
                    <span className="text-[9px] font-semibold opacity-75 tracking-normal normal-case">{w.range}</span>
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
                  background: NAVY_DARK,
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                <div className="flex flex-col items-end leading-tight">
                  <span>Total</span>
                  <span className="text-[9px] font-semibold opacity-75 tracking-normal normal-case">13 sem</span>
                </div>
              </th>
              <th
                scope="col"
                className="px-1.5 py-2 text-right"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  background: NAVY_DARK,
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                <div className="flex flex-col items-end leading-tight">
                  <span>Beyond</span>
                  <span className="text-[9px] font-semibold opacity-75 tracking-normal normal-case">após S13</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {/* ===================== 1. OPERAÇÃO ===================== */}
            <SectionHeader label="OPERAÇÃO" expanded={open.op} onToggle={() => toggle("op")} />

            {open.op && (
              <>
                {/* Sub-grupo nível 2: Receitas Operacionais */}
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

                {/* Sub-grupo nível 2: Saídas Operacionais */}
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

            {/* Caixa Líquido da Operação — sempre visível (mesmo com Operação colapsada) */}
            <DataRow
              label={<span style={{ fontWeight: 700 }}>→ Caixa Líquido da Operação</span>}
              values={CL_OPERACAO}
              total={sum(CL_OPERACAO)}
              beyond={CL_OPERACAO_BEYOND}
              cellBg={ROW_BG_CAIXA_LIQUIDO}
              labelBg={ROW_BG_CAIXA_LIQUIDO}
              darkRow
              labelBold
              valueBold
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
              label={<span style={{ fontWeight: 700 }}>→ Caixa Líquido do Financiamento</span>}
              values={CL_FINANCIAMENTO}
              total={sum(CL_FINANCIAMENTO)}
              beyond={CL_FIN_BEYOND}
              cellBg={ROW_BG_CAIXA_LIQUIDO}
              labelBg={ROW_BG_CAIXA_LIQUIDO}
              darkRow
              labelBold
              valueBold
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
              label={<span style={{ fontWeight: 700 }}>→ Caixa Líquido do Investimento</span>}
              values={CL_INVESTIMENTO}
              total={sum(CL_INVESTIMENTO)}
              beyond={CL_INV_BEYOND}
              cellBg={ROW_BG_CAIXA_LIQUIDO}
              labelBg={ROW_BG_CAIXA_LIQUIDO}
              darkRow
              labelBold
              valueBold
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
              label={<span style={{ fontWeight: 700 }}>→ Caixa Líquido Entre Companhias</span>}
              values={CL_INTERCO}
              total={sum(CL_INTERCO)}
              beyond={CL_IC_BEYOND}
              cellBg={ROW_BG_CAIXA_LIQUIDO}
              labelBg={ROW_BG_CAIXA_LIQUIDO}
              darkRow
              labelBold
              valueBold
            />

            {/* ===================== Fechamento ===================== */}
            <DataRow
              label={<span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Variação Líquida de Caixa</span>}
              values={VARIACAO_LIQUIDA}
              total={sum(VARIACAO_LIQUIDA)}
              beyond={VARIACAO_BEYOND}
              cellBg={ROW_BG_VARIACAO}
              labelBg={ROW_BG_VARIACAO}
              darkRow
              labelBold
              valueBold
            />

            <DataRow
              label={<span style={{ fontWeight: 700 }}>Caixa - Início do Período</span>}
              values={CAIXA_INICIO}
              total={null}
              beyond={null}
              cellBg={ROW_BG_SALDO}
              labelBg={ROW_BG_SALDO}
              darkRow
              labelBold
              valueBold
            />

            <DataRow
              label={<span style={{ fontWeight: 700 }}>Caixa - Final do Período</span>}
              values={CAIXA_FINAL}
              total={null}
              beyond={null}
              cellBg={ROW_BG_SALDO}
              labelBg={ROW_BG_SALDO}
              darkRow
              labelBold
              valueBold
            />

            <DataRow
              label={<span style={{ fontStyle: "italic", color: MUTED }}>Caixa Mínimo Operacional</span>}
              values={Array.from({ length: 13 }, () => CAIXA_MINIMO_OPERACIONAL)}
              total={null}
              beyond={null}
              italic
              colorOverride={MUTED}
              isLast
            />
          </tbody>
        </table>
      </div>
    </section>
  )
}

// =====================================================================
// Helpers de linha
// =====================================================================

// Section header (nível 1) — clicável, com chevron, fundo navy
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
        className="px-3 py-1.5 text-left"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: HEADER_GRADIENT,
          color: "#FFFFFF",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <span className="inline-flex items-center gap-1.5">
          <Icon className="h-3 w-3" strokeWidth={2.4} aria-hidden />
          {label}
        </span>
      </th>
      {Array.from({ length: 13 }).map((_, i) => (
        <td key={i} style={{ background: HEADER_GRADIENT, borderBottom: `1px solid ${LINE}`, height: 26 }} />
      ))}
      <td style={{ background: NAVY_DARK, borderBottom: `1px solid ${LINE}`, height: 26 }} />
      <td style={{ background: NAVY_DARK, borderBottom: `1px solid ${LINE}`, height: 26 }} />
    </tr>
  )
}

// Sub-group header (nível 2) — Receitas/Saídas Operacionais.
// Quando colapsado: mostra subtotal por semana/total/beyond. Quando expandido: cells vazias.
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
  const labelBg = "#F2F5F9"

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
          fontStyle: "italic",
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
              bold
              italic
              colorRule="signed"
              borderBottom={`1px solid ${LINE}`}
            />
          ))}
      <NumericCell
        value={expanded ? null : subtotalTotal}
        baseBg={labelBg}
        bold
        italic
        colorRule="signed"
        borderBottom={`1px solid ${LINE}`}
        isTotalCol
      />
      <NumericCell
        value={expanded ? null : subtotalBeyond}
        baseBg={labelBg}
        bold
        italic
        colorRule="signed"
        borderBottom={`1px solid ${LINE}`}
        isTotalCol
      />
    </tr>
  )
}

type ColorRule = "default" | "signed"

function DataRow({
  label,
  values,
  total,
  beyond = null,
  cellBg = "#FFFFFF",
  labelBg,
  labelBold = false,
  valueBold = false,
  italic = false,
  colorOverride,
  colorRule = "default",
  darkRow = false,
  isLast = false,
}: {
  label: ReactNode
  values: number[]
  total: number | null
  beyond?: number | null
  cellBg?: string
  labelBg?: string
  labelBold?: boolean
  valueBold?: boolean
  italic?: boolean
  colorOverride?: string
  colorRule?: ColorRule
  darkRow?: boolean
  isLast?: boolean
}) {
  const borderBottom = isLast ? "none" : `1px solid ${LINE}`
  const labelColor = darkRow ? "#FFFFFF" : NAVY

  return (
    <tr>
      <th
        scope="row"
        className="px-3 py-1.5 text-left"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: labelBg ?? cellBg,
          color: labelColor,
          fontSize: 11,
          fontWeight: labelBold ? 700 : 500,
          fontStyle: italic ? "italic" : "normal",
          borderBottom,
        }}
      >
        {label}
      </th>
      {values.map((v, i) => (
        <NumericCell
          key={i}
          value={v}
          baseBg={cellBg}
          bold={valueBold}
          italic={italic}
          colorOverride={colorOverride}
          colorRule={colorRule}
          darkRow={darkRow}
          borderBottom={borderBottom}
        />
      ))}
      <NumericCell
        value={total}
        baseBg={cellBg}
        bold={valueBold}
        italic={italic}
        colorOverride={colorOverride}
        colorRule={colorRule}
        darkRow={darkRow}
        borderBottom={borderBottom}
        isTotalCol
      />
      <NumericCell
        value={beyond}
        baseBg={cellBg}
        bold={valueBold}
        italic={italic}
        colorOverride={colorOverride}
        colorRule={colorRule}
        darkRow={darkRow}
        borderBottom={borderBottom}
        isTotalCol
      />
    </tr>
  )
}

function NumericCell({
  value,
  baseBg,
  bold,
  italic,
  colorOverride,
  colorRule = "default",
  darkRow = false,
  borderBottom,
  isTotalCol = false,
}: {
  value: number | null
  baseBg: string
  bold: boolean
  italic: boolean
  colorOverride?: string
  colorRule?: ColorRule
  darkRow?: boolean
  borderBottom: string
  isTotalCol?: boolean
}) {
  const isEmpty = value === null || value === undefined
  const isNegative = !isEmpty && (value as number) < 0
  // Coluna Total/Beyond: força fundo dark navy + paleta de texto invertida.
  const isDark = darkRow || isTotalCol
  const bg = isTotalCol ? TOTAL_COL_BG : baseBg

  let color: string
  if (isEmpty) {
    color = isDark ? "rgba(255,255,255,0.45)" : MUTED
  } else if (colorRule === "signed") {
    if (isDark) color = isNegative ? NEG_DARK : "#FFFFFF"
    else color = isNegative ? NEG : NAVY
  } else if (colorOverride) {
    color = colorOverride
  } else if (isDark) {
    color = isNegative ? NEG_DARK : "#FFFFFF"
  } else {
    color = isNegative ? NEG : INK
  }

  const borderLeft = isTotalCol ? `1px solid rgba(255,255,255,0.08)` : undefined

  return (
    <td
      className="px-1.5 py-1.5 text-right"
      style={{
        background: bg,
        color,
        fontSize: 11,
        fontWeight: bold ? 700 : 500,
        fontStyle: italic ? "italic" : "normal",
        fontVariantNumeric: "tabular-nums",
        borderBottom,
        borderLeft,
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
