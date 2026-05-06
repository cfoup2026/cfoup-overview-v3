"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { RefreshCw } from "lucide-react"

/**
 * /fluxo-de-caixa
 *
 * Hub central da Mesa de Decisão: caixa em janela rolante de 13 semanas.
 * Espelha a aba CF_13_Semanas do modelo Pipeline Capital, traduzida para PMME
 * brasileira (CR, CP, DAS, ICMS, IOF, Folha quinzenal, etc).
 *
 * Esta tela é DEMO visual. Quando o Núcleo de Dados for plugado, os arrays
 * MOCK_* abaixo são substituídos por um hook do tipo useCashflow13w(activeUnit)
 * que devolve a mesma forma.
 */

// =====================================================================
// Tokens
// =====================================================================
const NAVY = "#071D3B"
const NAVY_DARK = "#051634"
const BLUE = "#1567C8"
const CYAN = "#38B8E8"
const GREEN = "#36BA58"
const NEG = "#D14343"
const WARN = "#E08B00"
const INK = "#0F1B2D"
const MUTED = "#5B6B82"
const LINE = "#E5EBF2"
const BG = "#F7F9FC"
const ROW_BG_TOTAL = "#F7F9FC"
const ROW_BG_FLUXO = "#E8F4FB"
const ROW_BG_SALDO = "#FFF7E5"
const CELL_NEG_BG = "#FFF1F1"

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
// Mocks engenheirados para fechar com:
//   Saldo Inicial S1 = 34.494
//   Caixa Mínimo da Janela = -251.633 em S13 (mínimo monotônico)
//   Caixa Médio Projetado ≈ -121.566
//
// Cadência: Folha quinzenal (dia 5 e 20) cai em S1, S3, S5, S7, S9, S11.
// Impostos DAS+ICMS no dia 20 caem em S3, S7, S11.
// Empréstimo (mensal, dia 10) cai em S1, S6, S10.
//
// TODO: substituir os 9 arrays abaixo pelo hook useCashflow13w(activeUnit).
// =====================================================================
const SALDO_INICIAL_S1 = 34_494
const CAIXA_MINIMO_OPERACIONAL = 25_000

const CR_RECEBER     = [70_000, 78_000, 68_000, 82_000, 65_000, 88_000, 72_000, 80_000, 68_000, 76_000, 84_000, 78_000, 92_000]
const CR_RECUPERACAO = [ 5_000,  4_000,  6_000,  3_000,  8_000,  4_000,  5_000,  3_000,  6_000,  4_000,  5_000,  3_000,  7_000]

const CP_A_PAGAR     = [45_000, 84_000, 32_000, 92_000, 66_000, 90_000, 33_000, 94_000, 56_000, 77_000, 45_000, 86_000, 100_000]
const CP_VENCIDOS    = [ 5_144,  9_650,  3_650, 10_650,  6_650,  9_650,  3_650,  9_650,  6_650,  8_650,  4_650,  8_650,  11_283]
const FOLHA          = [30_000,      0, 30_000,      0, 30_000,      0, 30_000,      0, 30_000,      0, 30_000,      0,       0]
const IMPOSTOS       = [     0,      0, 20_000,      0,      0,      0, 22_000,      0,      0,      0, 24_000,      0,       0]
const DIARIAS        = [ 5_000,  5_000,  5_000,  5_000,  5_000,  5_000,  5_000,  5_000,  5_000,  5_000,  5_000,  5_000,   5_000]
const TARIFAS        = [   350,    350,    350,    350,    350,    350,    350,    350,    350,    350,    350,    350,     350]
const EMPRESTIMO     = [12_000,      0,      0,      0,      0, 12_000,      0,      0,      0, 12_000,      0,      0,       0]

// Derivados
const TOTAL_ENTRADAS = CR_RECEBER.map((v, i) => v + CR_RECUPERACAO[i])
const TOTAL_SAIDAS = CP_A_PAGAR.map(
  (v, i) => v + CP_VENCIDOS[i] + FOLHA[i] + IMPOSTOS[i] + DIARIAS[i] + TARIFAS[i] + EMPRESTIMO[i],
)
const FLUXO_LIQUIDO = TOTAL_ENTRADAS.map((v, i) => v - TOTAL_SAIDAS[i])

// Saldo inicial por semana (S1 = extrato; S2..S13 herdam saldo final da semana anterior).
// Saldo final por semana (encadeado).
const SALDO_INICIAL_WEEK: number[] = []
const SALDO_FINAL: number[] = []
;(() => {
  let prev = SALDO_INICIAL_S1
  for (let i = 0; i < 13; i++) {
    SALDO_INICIAL_WEEK.push(prev)
    const next = prev + FLUXO_LIQUIDO[i]
    SALDO_FINAL.push(next)
    prev = next
  }
})()

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

// =====================================================================
// Formatadores
// =====================================================================
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
  CP: {
    title: "Contas a Pagar",
    body: "Obrigações da empresa com fornecedores, impostos e demais credores ainda não quitadas.",
  },
  CR: {
    title: "Contas a Receber",
    body: "Valores que a empresa tem para receber de clientes referentes a vendas já faturadas.",
  },
  DAS: {
    title: "Documento de Arrecadação do Simples",
    body: "Guia única do Simples Nacional que reúne os tributos federais, estaduais e municipais.",
  },
  ICMS: {
    title: "Imposto sobre Circulação de Mercadorias e Serviços",
    body: "Tributo estadual incidente sobre vendas, serviços de transporte e comunicação.",
  },
  IOF: {
    title: "Imposto sobre Operações Financeiras",
    body: "Tributo federal sobre crédito, câmbio, seguros e operações com títulos.",
  },
  PMR: {
    title: "Prazo Médio de Recebimento",
    body: "Média de dias entre a venda e o efetivo recebimento dos clientes.",
  },
  PMP: {
    title: "Prazo Médio de Pagamento",
    body: "Média de dias entre a compra e o pagamento dos fornecedores.",
  },
}

function GlossaryTerm({ term, children }: { term: GlossaryKey; children: ReactNode }) {
  const entry = GLOSSARY[term]
  return (
    <span className="group relative inline-block">
      <span
        className="cursor-help border-b border-dotted"
        style={{ borderColor: "rgba(91,107,130,0.55)" }}
        aria-describedby={`gloss-${term}`}
      >
        {children}
      </span>
      <span
        id={`gloss-${term}`}
        role="tooltip"
        className="pointer-events-none invisible absolute left-0 top-full z-[60] mt-1.5 w-64 rounded-md px-3 py-2 text-[12px] font-normal normal-case leading-snug opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
        style={{
          background: NAVY,
          color: "#FFFFFF",
          letterSpacing: "normal",
          fontFamily: "var(--font-sans)",
          boxShadow: "0 8px 20px -6px rgba(7,29,59,0.35)",
        }}
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
    // Pinta o fundo #F7F9FC neutralizando o padding do AppShell para cobrir a viewport.
    <div
      className="-mx-8 -my-3 min-h-[calc(100vh-3rem)] px-8 py-8 md:-mx-10 md:px-10 lg:-mx-12 lg:-my-4 lg:px-12 lg:py-10"
      style={{ background: BG, color: INK, fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto w-full max-w-[1340px]">
        {/* ZONA 1 — HEADER */}
        <Zone1Header escopo={escopo} setEscopo={setEscopo} />

        {/* ZONA 2 — KPIs */}
        <Zone2Kpis />

        {/* ZONA 3 — Grid 13 semanas (reescrita) */}
        <Zone3Grid />

        {/* Footer pendências */}
        <FooterPendencias />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------
// Zona 1 — Header (preservado)
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
        <h1
          className="text-[28px] font-semibold leading-tight tracking-tight"
          style={{ color: NAVY, fontFamily: "var(--font-serif)" }}
        >
          Fluxo de Caixa <span style={{ color: MUTED }}>·</span> 13 semanas
        </h1>
        <p className="mt-1.5 text-[13px]" style={{ color: MUTED }}>
          Atualizado em 06/05 às 14:23
        </p>
      </div>

      <div
        className="inline-flex items-center gap-1 rounded-full border p-1"
        role="tablist"
        aria-label="Escopo de visualização"
        style={{ borderColor: LINE, background: "#FFFFFF" }}
      >
        <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
          Unidade:
        </span>
        <button
          role="tab"
          aria-selected={escopo === "unidade"}
          onClick={() => setEscopo("unidade")}
          className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors"
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
          className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors"
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
// Zona 2 — KPIs (valores atualizados)
// ---------------------------------------------------------------------
function Zone2Kpis() {
  const veredito = VEREDITO_STYLES[VEREDITO_ATUAL]
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Caixa Atual" value={fmtBRL(34_494)} sub="Hoje · 05/05" />
      <KpiCard
        label="Caixa Mínimo da Janela"
        value={fmtBRL(-251_633)}
        valueColor={NEG}
        sub="em 28/07 (S13)"
      />
      <KpiCard label="Caixa Médio Projetado" value={fmtBRL(-121_566)} valueColor={NEG} sub="Média das 13 semanas" />
      <article className="relative overflow-hidden rounded-lg border bg-white p-4" style={{ borderColor: LINE }}>
        <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: CYAN }} />
        <p className="text-[10px] font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.1em" }}>
          Veredito
        </p>
        <div className="mt-3 flex items-center">
          <span
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-bold tracking-wide"
            style={{ background: veredito.bg, color: veredito.fg }}
          >
            {veredito.label}
          </span>
        </div>
        <p className="mt-2 text-[12px]" style={{ color: MUTED }}>
          Aguardando ingestão completa
        </p>
      </article>
    </section>
  )
}

function KpiCard({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string
  value: string
  sub: string
  valueColor?: string
}) {
  return (
    <article className="relative overflow-hidden rounded-lg border bg-white p-4" style={{ borderColor: LINE }}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: CYAN }} />
      <p className="text-[10px] font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.1em" }}>
        {label}
      </p>
      <p
        className="mt-2 text-[26px] font-semibold leading-tight tabular-nums"
        style={{
          color: valueColor ?? NAVY,
          fontFamily: "var(--font-serif)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </p>
      <p className="mt-1 text-[12px]" style={{ color: MUTED }}>
        {sub}
      </p>
    </article>
  )
}

// ---------------------------------------------------------------------
// Zona 3 — Grid 13 semanas (REESCRITA)
// ---------------------------------------------------------------------
const FIRST_COL_WIDTH = 280
const WEEK_COL_WIDTH = 100
const TOTAL_COL_WIDTH = 110
const HEADER_GRADIENT = `linear-gradient(180deg, ${NAVY} 0%, #0a2853 100%)`
const TOTAL_HEADER_BG = NAVY_DARK

function Zone3Grid() {
  return (
    <section
      className="overflow-x-auto rounded-lg border bg-white"
      style={{ borderColor: LINE, overflowY: "visible" }}
      aria-label="Grade de fluxo de caixa em 13 semanas"
    >
      <table
        className="w-full border-separate text-[13px]"
        style={{
          borderSpacing: 0,
          minWidth: FIRST_COL_WIDTH + 13 * WEEK_COL_WIDTH + TOTAL_COL_WIDTH,
          fontFamily: "var(--font-sans)",
        }}
      >
        <colgroup>
          <col style={{ width: FIRST_COL_WIDTH }} />
          {WEEKS.map((_, i) => (
            <col key={i} style={{ width: WEEK_COL_WIDTH }} />
          ))}
          <col style={{ width: TOTAL_COL_WIDTH }} />
        </colgroup>

        <thead>
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left"
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
                className="px-2 py-2 text-right"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  background: HEADER_GRADIENT,
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <div className="flex flex-col items-end leading-tight">
                  <span>{w.label}</span>
                  <span className="text-[10px] font-semibold opacity-80 tracking-normal normal-case">
                    {w.range}
                  </span>
                </div>
              </th>
            ))}
            <th
              scope="col"
              className="px-2 py-2 text-right"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 3,
                background: TOTAL_HEADER_BG,
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <div className="flex flex-col items-end leading-tight">
                <span>Total</span>
                <span className="text-[10px] font-semibold opacity-80 tracking-normal normal-case">13 sem</span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {/* 1. SALDO INICIAL */}
          <DataRow
            label={<span style={{ fontWeight: 600 }}>Saldo Inicial</span>}
            values={SALDO_INICIAL_WEEK}
            total={null}
            cellBg={ROW_BG_TOTAL}
            labelBg={ROW_BG_TOTAL}
            labelBold
            colorOverride={NAVY}
          />

          {/* 2. ENTRADAS PROJETADAS — section header */}
          <SectionHeader label="ENTRADAS PROJETADAS" />

          {/* 3. (+) CR a receber */}
          <DataRow
            label={
              <>
                (+) <GlossaryTerm term="CR">CR</GlossaryTerm> a receber{" "}
                <span style={{ color: MUTED }}>(vencimentos)</span>
              </>
            }
            values={CR_RECEBER}
            total={sum(CR_RECEBER)}
          />

          {/* 4. (+) CR vencidos - recuperação */}
          <DataRow
            label={
              <>
                (+) <GlossaryTerm term="CR">CR</GlossaryTerm> vencidos{" "}
                <span style={{ color: MUTED }}>- recuperação</span>
              </>
            }
            values={CR_RECUPERACAO}
            total={sum(CR_RECUPERACAO)}
          />

          {/* 5. → TOTAL ENTRADAS */}
          <DataRow
            label={<span style={{ fontWeight: 700 }}>→ Total Entradas</span>}
            values={TOTAL_ENTRADAS}
            total={sum(TOTAL_ENTRADAS)}
            cellBg={ROW_BG_TOTAL}
            labelBg={ROW_BG_TOTAL}
            labelBold
            valueBold
            colorOverride={NAVY}
          />

          {/* 6. SAÍDAS PROJETADAS — section header */}
          <SectionHeader label="SAÍDAS PROJETADAS" />

          {/* 7. (−) CP a pagar */}
          <DataRow
            label={
              <>
                (−) <GlossaryTerm term="CP">CP</GlossaryTerm> a pagar{" "}
                <span style={{ color: MUTED }}>(vencimentos)</span>
              </>
            }
            values={CP_A_PAGAR}
            total={sum(CP_A_PAGAR)}
          />

          {/* 8. (−) CP vencidos - renegociação */}
          <DataRow
            label={
              <>
                (−) <GlossaryTerm term="CP">CP</GlossaryTerm> vencidos{" "}
                <span style={{ color: MUTED }}>- renegociação</span>
              </>
            }
            values={CP_VENCIDOS}
            total={sum(CP_VENCIDOS)}
          />

          {/* 9. (−) Folha (quinzenal) */}
          <DataRow
            label={
              <>
                (−) Folha <span style={{ color: MUTED }}>(quinzenal, dia 5 e 20)</span>
              </>
            }
            values={FOLHA}
            total={sum(FOLHA)}
          />

          {/* 10. (−) Impostos DAS+ICMS */}
          <DataRow
            label={
              <>
                (−) Impostos <GlossaryTerm term="DAS">DAS</GlossaryTerm>+
                <GlossaryTerm term="ICMS">ICMS</GlossaryTerm>{" "}
                <span style={{ color: MUTED }}>(dia 20)</span>
              </>
            }
            values={IMPOSTOS}
            total={sum(IMPOSTOS)}
          />

          {/* 11. (−) Diárias / Terceiros */}
          <DataRow
            label={
              <>
                (−) Diárias / Terceiros <span style={{ color: MUTED }}>(semanal)</span>
              </>
            }
            values={DIARIAS}
            total={sum(DIARIAS)}
          />

          {/* 12. (−) Tarifas Bancárias / IOF */}
          <DataRow
            label={
              <>
                (−) Tarifas Bancárias / <GlossaryTerm term="IOF">IOF</GlossaryTerm>{" "}
                <span style={{ color: MUTED }}>(semanal)</span>
              </>
            }
            values={TARIFAS}
            total={sum(TARIFAS)}
          />

          {/* 13. (−) Empréstimo / Parcela */}
          <DataRow
            label={
              <>
                (−) Empréstimo / Parcela <span style={{ color: MUTED }}>(mensal)</span>
              </>
            }
            values={EMPRESTIMO}
            total={sum(EMPRESTIMO)}
          />

          {/* 14. → TOTAL SAÍDAS */}
          <DataRow
            label={<span style={{ fontWeight: 700 }}>→ Total Saídas</span>}
            values={TOTAL_SAIDAS}
            total={sum(TOTAL_SAIDAS)}
            cellBg={ROW_BG_TOTAL}
            labelBg={ROW_BG_TOTAL}
            labelBold
            valueBold
            colorOverride={NEG}
          />

          {/* 15. → FLUXO LÍQUIDO DA SEMANA */}
          <DataRow
            label={<span style={{ fontWeight: 700 }}>→ Fluxo Líquido da Semana</span>}
            values={FLUXO_LIQUIDO}
            total={sum(FLUXO_LIQUIDO)}
            cellBg={ROW_BG_FLUXO}
            labelBg={ROW_BG_FLUXO}
            labelBold
            valueBold
            colorRule="signed"
          />

          {/* 16. SALDO FINAL DA SEMANA */}
          <DataRow
            label={<span style={{ fontWeight: 700 }}>Saldo Final da Semana</span>}
            values={SALDO_FINAL}
            total={null}
            cellBg={ROW_BG_SALDO}
            labelBg={ROW_BG_SALDO}
            labelBold
            valueBold
            colorRule="signed"
            negativeCellBg={CELL_NEG_BG}
          />

          {/* 17. Caixa Mínimo Operacional */}
          <DataRow
            label={
              <span style={{ fontStyle: "italic", color: MUTED }}>Caixa Mínimo Operacional</span>
            }
            values={Array.from({ length: 13 }, () => CAIXA_MINIMO_OPERACIONAL)}
            total={null}
            italic
            colorOverride={MUTED}
            isLast
          />
        </tbody>
      </table>
    </section>
  )
}

// =====================================================================
// Helpers de linha
// =====================================================================
function SectionHeader({ label }: { label: string }) {
  return (
    <tr>
      <th
        scope="row"
        className="px-4 py-2 text-left"
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
        {label}
      </th>
      {Array.from({ length: 13 }).map((_, i) => (
        <td
          key={i}
          style={{
            background: HEADER_GRADIENT,
            borderBottom: `1px solid ${LINE}`,
            height: 30,
          }}
        />
      ))}
      <td
        style={{
          background: TOTAL_HEADER_BG,
          borderBottom: `1px solid ${LINE}`,
          height: 30,
        }}
      />
    </tr>
  )
}

type ColorRule = "default" | "signed"

function DataRow({
  label,
  values,
  total,
  cellBg = "#FFFFFF",
  labelBg,
  labelBold = false,
  valueBold = false,
  italic = false,
  colorOverride,
  colorRule = "default",
  negativeCellBg,
  isLast = false,
}: {
  label: ReactNode
  values: number[]
  total: number | null
  cellBg?: string
  labelBg?: string
  labelBold?: boolean
  valueBold?: boolean
  italic?: boolean
  colorOverride?: string
  colorRule?: ColorRule
  negativeCellBg?: string
  isLast?: boolean
}) {
  const borderBottom = isLast ? "none" : `1px solid ${LINE}`

  return (
    <tr>
      <th
        scope="row"
        className="px-4 py-2 text-left"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: labelBg ?? cellBg,
          color: NAVY,
          fontSize: 13,
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
          negativeCellBg={negativeCellBg}
          borderBottom={borderBottom}
        />
      ))}
      {/* Coluna Total 13 sem */}
      <NumericCell
        value={total}
        baseBg={cellBg}
        bold={valueBold}
        italic={italic}
        colorOverride={colorOverride}
        colorRule={colorRule}
        negativeCellBg={negativeCellBg}
        borderBottom={borderBottom}
        isTotal
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
  colorRule,
  negativeCellBg,
  borderBottom,
  isTotal = false,
}: {
  value: number | null
  baseBg: string
  bold: boolean
  italic: boolean
  colorOverride?: string
  colorRule: ColorRule
  negativeCellBg?: string
  borderBottom: string
  isTotal?: boolean
}) {
  const isEmpty = value === null || value === undefined
  const isNegative = !isEmpty && (value as number) < 0

  // Cor por célula:
  //  - colorRule "signed": navy quando >=0, vermelho quando <0 (Saldo Final, Fluxo Líquido).
  //  - colorOverride: sobrepõe (ex: Total Saídas sempre em vermelho, Caixa Mínimo Operacional em muted).
  //  - default: vermelho automático para negativos, INK para positivos.
  let color: string
  if (isEmpty) {
    color = MUTED
  } else if (colorRule === "signed") {
    color = isNegative ? NEG : NAVY
  } else if (colorOverride) {
    color = colorOverride
  } else {
    color = isNegative ? NEG : INK
  }

  // BG por célula: se a regra de negativo aciona, troca apenas naquela célula.
  const bg = !isEmpty && isNegative && negativeCellBg ? negativeCellBg : baseBg

  // Reforço sutil para a coluna Total: borda esquerda em LINE para separar
  // visualmente sem competir com o header navy escuro.
  const borderLeft = isTotal ? `1px solid ${LINE}` : undefined

  return (
    <td
      className="px-2 py-2 text-right"
      style={{
        background: bg,
        color,
        fontSize: 13,
        fontWeight: bold ? 700 : 500,
        fontStyle: italic ? "italic" : "normal",
        fontVariantNumeric: "tabular-nums",
        borderBottom,
        borderLeft,
        whiteSpace: "nowrap",
      }}
    >
      {isEmpty ? "—" : fmtBRL(value as number)}
    </td>
  )
}

// ---------------------------------------------------------------------
// Footer pendências (preservado)
// ---------------------------------------------------------------------
function FooterPendencias() {
  return (
    <footer
      className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]"
      style={{ color: MUTED }}
    >
      <span>Pendências críticas:</span>
      <button type="button" className="font-semibold underline-offset-2 hover:underline" style={{ color: BLUE }}>
        1
      </button>
      <span>(Banco sem dado recente)</span>
      <span aria-hidden style={{ color: MUTED }}>
        ·
      </span>
      <span>Pendências laterais:</span>
      <button type="button" className="font-semibold underline-offset-2 hover:underline" style={{ color: BLUE }}>
        0
      </button>
    </footer>
  )
}
