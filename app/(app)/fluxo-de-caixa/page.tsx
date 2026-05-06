"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"

/**
 * /fluxo-de-caixa
 *
 * Hub central da Mesa de Decisão: caixa em janela rolante de 13 semanas.
 * Espelha a estrutura Hub & Spokes do modelo Pipeline Capital, traduzida
 * para PMME brasileira.
 *
 * Esta tela é DEMO visual. Quando o Núcleo de Dados for plugado, os arrays
 * MOCK_ENTRADAS / MOCK_SAIDAS abaixo são substituídos por um hook do tipo
 * useCashflow13w(activeUnit) que devolve a mesma forma.
 */

// =====================================================================
// Tokens (uso restrito ao brief)
// =====================================================================
const NAVY = "#071D3B"
const BLUE = "#1567C8"
const CYAN = "#38B8E8"
const GREEN = "#36BA58"
const POS = "#36BA58"
const NEG = "#D14343"
const WARN = "#E08B00"
const INK = "#0F1B2D"
const MUTED = "#5B6B82"
const LINE = "#E5EBF2"
const BG = "#F7F9FC"

// =====================================================================
// Datas das 13 semanas (cadência semanal a partir de 06/05)
// =====================================================================
const WEEK_LABELS = [
  "06/05",
  "13/05",
  "20/05",
  "27/05",
  "03/06",
  "10/06",
  "17/06",
  "24/06",
  "01/07",
  "08/07",
  "15/07",
  "22/07",
  "28/07",
] as const

// =====================================================================
// Mock — totais semanais engenheirados para que S9 seja o mínimo (-85.922)
// e o saldo médio projetado fique próximo de -32k.
// =====================================================================
const SALDO_INICIAL = 43_677

// TODO: substituir MOCK_ENTRADAS / MOCK_SAIDAS pelo hook useCashflow13w(activeUnit)
const MOCK_ENTRADAS = [38_450, 45_220, 32_110, 41_350, 34_890, 38_760, 33_450, 46_520, 30_110, 53_500, 44_230, 49_110, 58_450]
const MOCK_SAIDAS = [42_180, 47_890, 49_560, 43_870, 55_420, 51_180, 56_890, 48_350, 75_119, 47_090, 48_000, 46_220, 38_150]
const CAIXA_MINIMO_OPERACIONAL = 25_000

// Quebra das ENTRADAS em 3 sub-categorias por semana.
// Realizado pesa mais nas primeiras semanas; Estimado nas últimas.
function splitEntrada(total: number, weekIdx: number): [number, number, number] {
  const realizadoPct = Math.max(0, 0.6 - weekIdx * 0.05)
  const estimadoPct = Math.min(0.7, 0.1 + weekIdx * 0.05)
  const confirmadoPct = 1 - realizadoPct - estimadoPct
  const r = Math.round(total * realizadoPct)
  const c = Math.round(total * confirmadoPct)
  const e = total - r - c
  return [r, c, e]
}

// Quebra das SAÍDAS em 7 sub-categorias por semana com pesos fixos.
function splitSaida(total: number): [number, number, number, number, number, number, number] {
  const folha = Math.round(total * 0.35)
  const forn = Math.round(total * 0.25)
  const desp = Math.round(total * 0.15)
  const com = Math.round(total * 0.08)
  const log = Math.round(total * 0.07)
  const trib = Math.round(total * 0.07)
  const outros = total - folha - forn - desp - com - log - trib
  return [folha, forn, desp, com, log, trib, outros]
}

const ENTRADAS_BREAKDOWN = MOCK_ENTRADAS.map((t, i) => splitEntrada(t, i))
const SAIDAS_BREAKDOWN = MOCK_SAIDAS.map((t) => splitSaida(t))

// Saldo final por semana (encadeado).
const CAIXA_FINAL: number[] = (() => {
  const out: number[] = []
  let prev = SALDO_INICIAL
  for (let i = 0; i < 13; i++) {
    const next = prev + MOCK_ENTRADAS[i] - MOCK_SAIDAS[i]
    out.push(next)
    prev = next
  }
  return out
})()

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
// Veredito (categorias possíveis: LIMPO, ATENCAO, ALERTA, CRITICO, DADOS_INSUFICIENTES)
// Hoje fixamos em DADOS_INSUFICIENTES para refletir estado de implantação.
// Quando o Núcleo de Dados existir, derivar do mínimo da janela e do caixa
// mínimo operacional configurado pelo cliente.
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
        {/* ============================================================ */}
        {/* ZONA 1 — HEADER                                               */}
        {/* ============================================================ */}
        <Zone1Header escopo={escopo} setEscopo={setEscopo} />

        {/* ============================================================ */}
        {/* ZONA 2 — KPIs                                                 */}
        {/* ============================================================ */}
        <Zone2Kpis />

        {/* ============================================================ */}
        {/* ZONA 3 — Grid 13 semanas                                      */}
        {/* ============================================================ */}
        <Zone3Grid />

        {/* Footer abaixo da grid */}
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

      {/* Pill toggle Unidade | Consolidado */}
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

      {/* Botão Atualizar */}
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
// Zona 2 — KPIs
// ---------------------------------------------------------------------
function Zone2Kpis() {
  const veredito = VEREDITO_STYLES[VEREDITO_ATUAL]

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Caixa Atual" value={fmtBRL(43_677)} sub="Hoje · 06/05" />
      <KpiCard
        label="Caixa Mínimo da Janela"
        value={fmtBRL(-85_922)}
        valueColor={NEG}
        sub="em 06/07 (S9)"
      />
      <KpiCard label="Caixa Médio Projetado" value={fmtBRL(-32_450)} sub="Média das 13 semanas" />

      {/* Card Veredito */}
      <article
        className="relative overflow-hidden rounded-lg border bg-white p-4"
        style={{ borderColor: LINE }}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ background: CYAN }}
        />
        <p
          className="text-[10px] font-semibold uppercase"
          style={{ color: MUTED, letterSpacing: "0.1em" }}
        >
          Veredito
        </p>
        <div className="mt-3 flex items-center">
          <span
            className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-bold tracking-wide"
            style={{ background: veredito.bg, color: veredito.fg, fontFamily: "var(--font-sans)" }}
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
    <article
      className="relative overflow-hidden rounded-lg border bg-white p-4"
      style={{ borderColor: LINE }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: CYAN }}
      />
      <p
        className="text-[10px] font-semibold uppercase"
        style={{ color: MUTED, letterSpacing: "0.1em" }}
      >
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
// Zona 3 — Grid 13 semanas
// ---------------------------------------------------------------------

// Linhas do corpo da tabela. groupHeader = linha de seção em navy.
type BodyRow =
  | { kind: "saldoInicial" }
  | { kind: "groupHeader"; label: "ENTRADAS" | "SAÍDAS" }
  | { kind: "subRow"; label: string; values: number[] }
  | { kind: "totalEntradas" }
  | { kind: "totalSaidas" }
  | { kind: "caixaFinal" }
  | { kind: "caixaMin" }

const ROWS: BodyRow[] = [
  { kind: "saldoInicial" },
  { kind: "groupHeader", label: "ENTRADAS" },
  { kind: "subRow", label: "Recebimento de Clientes (AR realizado)", values: ENTRADAS_BREAKDOWN.map((b) => b[0]) },
  { kind: "subRow", label: "AR Confirmado", values: ENTRADAS_BREAKDOWN.map((b) => b[1]) },
  { kind: "subRow", label: "AR Estimado", values: ENTRADAS_BREAKDOWN.map((b) => b[2]) },
  { kind: "totalEntradas" },
  { kind: "groupHeader", label: "SAÍDAS" },
  { kind: "subRow", label: "Folha", values: SAIDAS_BREAKDOWN.map((b) => b[0]) },
  { kind: "subRow", label: "Fornecedor Direto", values: SAIDAS_BREAKDOWN.map((b) => b[1]) },
  { kind: "subRow", label: "Despesas Operacionais", values: SAIDAS_BREAKDOWN.map((b) => b[2]) },
  { kind: "subRow", label: "Comissão", values: SAIDAS_BREAKDOWN.map((b) => b[3]) },
  { kind: "subRow", label: "Logística", values: SAIDAS_BREAKDOWN.map((b) => b[4]) },
  { kind: "subRow", label: "Tributos", values: SAIDAS_BREAKDOWN.map((b) => b[5]) },
  { kind: "subRow", label: "Outros", values: SAIDAS_BREAKDOWN.map((b) => b[6]) },
  { kind: "totalSaidas" },
  { kind: "caixaFinal" },
  { kind: "caixaMin" },
]

const FIRST_COL_WIDTH = 280
const WEEK_COL_WIDTH = 90
const GROUP_GRADIENT = `linear-gradient(180deg, ${NAVY} 0%, #0a2853 100%)`

function Zone3Grid() {
  return (
    <section
      className="overflow-x-auto rounded-lg border bg-white"
      style={{ borderColor: LINE }}
      aria-label="Grade de fluxo de caixa em 13 semanas"
    >
      <table
        className="w-full border-separate text-[13px]"
        style={{
          borderSpacing: 0,
          minWidth: FIRST_COL_WIDTH + 13 * WEEK_COL_WIDTH,
          fontFamily: "var(--font-sans)",
        }}
      >
        <thead>
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left"
              style={{
                position: "sticky",
                left: 0,
                top: 0,
                zIndex: 3,
                width: FIRST_COL_WIDTH,
                minWidth: FIRST_COL_WIDTH,
                background: GROUP_GRADIENT,
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Categoria
            </th>
            {WEEK_LABELS.map((d, i) => (
              <th
                key={i}
                scope="col"
                className="px-2 py-3 text-right"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  width: WEEK_COL_WIDTH,
                  minWidth: WEEK_COL_WIDTH,
                  background: GROUP_GRADIENT,
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <div className="flex flex-col items-end leading-tight">
                  <span>{`S${i + 1}`}</span>
                  <span className="text-[10px] font-semibold opacity-80">{d}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ROWS.map((row, rowIdx) => (
            <BodyRowRenderer key={rowIdx} row={row} />
          ))}
        </tbody>
      </table>
    </section>
  )
}

function BodyRowRenderer({ row }: { row: BodyRow }) {
  // Linha "Saldo Inicial"
  if (row.kind === "saldoInicial") {
    return (
      <tr>
        <ThSticky bg="#F7F9FC" bold>
          Saldo Inicial
        </ThSticky>
        <NumericTd value={SALDO_INICIAL} bg="#F7F9FC" bold />
        {Array.from({ length: 12 }).map((_, i) => (
          <NumericTd key={i} value={null} bg="#F7F9FC" />
        ))}
      </tr>
    )
  }

  // Header de grupo (ENTRADAS / SAÍDAS)
  if (row.kind === "groupHeader") {
    return (
      <tr>
        <ThSticky bg={GROUP_GRADIENT} fg="#FFFFFF" uppercase>
          {row.label}
        </ThSticky>
        {Array.from({ length: 13 }).map((_, i) => (
          <td
            key={i}
            style={{
              background: GROUP_GRADIENT,
              borderBottom: `1px solid ${LINE}`,
              width: WEEK_COL_WIDTH,
              minWidth: WEEK_COL_WIDTH,
              height: 32,
            }}
          />
        ))}
      </tr>
    )
  }

  // Sub-linha de categoria
  if (row.kind === "subRow") {
    return (
      <tr>
        <ThSticky>{row.label}</ThSticky>
        {row.values.map((v, i) => (
          <NumericTd key={i} value={v} />
        ))}
      </tr>
    )
  }

  // Linha "Total Entradas"
  if (row.kind === "totalEntradas") {
    return (
      <tr>
        <ThSticky bold>Total Entradas</ThSticky>
        {MOCK_ENTRADAS.map((v, i) => (
          <NumericTd key={i} value={v} bold />
        ))}
      </tr>
    )
  }

  // Linha "Total Saídas"
  if (row.kind === "totalSaidas") {
    return (
      <tr>
        <ThSticky bold>Total Saídas</ThSticky>
        {MOCK_SAIDAS.map((v, i) => (
          <NumericTd key={i} value={-v} bold forceColor={NEG} />
        ))}
      </tr>
    )
  }

  // Linha "Caixa Final"
  if (row.kind === "caixaFinal") {
    return (
      <tr>
        <ThSticky bg="#E8F4FB" bold>
          Caixa Final
        </ThSticky>
        {CAIXA_FINAL.map((v, i) => {
          const negative = v < 0
          return (
            <NumericTd
              key={i}
              value={v}
              bold
              bg={negative ? "#FFF1F1" : "#E8F4FB"}
              forceColor={negative ? NEG : NAVY}
            />
          )
        })}
      </tr>
    )
  }

  // Linha "Caixa Mínimo Operacional"
  if (row.kind === "caixaMin") {
    return (
      <tr>
        <ThSticky bg="#FAFBFD" italic muted>
          Caixa Mínimo Operacional
        </ThSticky>
        {Array.from({ length: 13 }).map((_, i) => (
          <NumericTd
            key={i}
            value={CAIXA_MINIMO_OPERACIONAL}
            bg="#FAFBFD"
            italic
            forceColor={MUTED}
          />
        ))}
      </tr>
    )
  }

  return null
}

// =====================================================================
// Células reutilizáveis
// =====================================================================
function ThSticky({
  children,
  bg = "#FFFFFF",
  fg,
  bold = false,
  italic = false,
  uppercase = false,
  muted = false,
}: {
  children: React.ReactNode
  bg?: string
  fg?: string
  bold?: boolean
  italic?: boolean
  uppercase?: boolean
  muted?: boolean
}) {
  return (
    <th
      scope="row"
      className="px-4 py-2 text-left"
      style={{
        position: "sticky",
        left: 0,
        zIndex: 1,
        width: FIRST_COL_WIDTH,
        minWidth: FIRST_COL_WIDTH,
        background: bg,
        color: fg ?? (muted ? MUTED : NAVY),
        fontWeight: bold ? 700 : 500,
        fontStyle: italic ? "italic" : "normal",
        textTransform: uppercase ? "uppercase" : "none",
        letterSpacing: uppercase ? "0.06em" : "normal",
        fontSize: uppercase ? 11 : 13,
        borderBottom: `1px solid ${LINE}`,
      }}
    >
      {children}
    </th>
  )
}

function NumericTd({
  value,
  bg = "#FFFFFF",
  bold = false,
  italic = false,
  forceColor,
}: {
  value: number | null
  bg?: string
  bold?: boolean
  italic?: boolean
  forceColor?: string
}) {
  const isEmpty = value === null || value === undefined
  const isNegative = !isEmpty && (value as number) < 0
  const color = forceColor ?? (isNegative ? NEG : INK)

  return (
    <td
      className="px-2 py-2 text-right"
      style={{
        width: WEEK_COL_WIDTH,
        minWidth: WEEK_COL_WIDTH,
        background: bg,
        color: isEmpty ? MUTED : color,
        fontWeight: bold ? 700 : 500,
        fontStyle: italic ? "italic" : "normal",
        fontVariantNumeric: "tabular-nums",
        borderBottom: `1px solid ${LINE}`,
        whiteSpace: "nowrap",
      }}
    >
      {isEmpty ? "—" : fmtBRL(value as number)}
    </td>
  )
}

// ---------------------------------------------------------------------
// Footer pendências
// ---------------------------------------------------------------------
function FooterPendencias() {
  return (
    <footer
      className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px]"
      style={{ color: MUTED }}
    >
      <span>Pendências críticas:</span>
      <button
        type="button"
        className="font-semibold underline-offset-2 hover:underline"
        style={{ color: BLUE }}
      >
        1
      </button>
      <span>(Banco sem dado recente)</span>
      <span aria-hidden style={{ color: MUTED }}>
        ·
      </span>
      <span>Pendências laterais:</span>
      <button
        type="button"
        className="font-semibold underline-offset-2 hover:underline"
        style={{ color: BLUE }}
      >
        0
      </button>
    </footer>
  )
}
