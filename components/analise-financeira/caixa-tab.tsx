"use client"

import { AlertTriangle } from "lucide-react"
import { TabHeaderCard } from "@/components/tab-header-card"
import { conteudoCaixa } from "@/lib/conteudos/analise-financeira"
import type { DadosCaixa } from "@/lib/types/analise-financeira"

// ---------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------
type Props = {
  dados?: DadosCaixa
}

// ---------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------
function formatCurrency(value: number | undefined): string {
  if (value === undefined) return "—"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number | undefined): string {
  if (value === undefined) return "—"
  return new Intl.NumberFormat("pt-BR").format(value)
}

function formatPct(value: number | undefined): string {
  if (value === undefined) return "—"
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------
export default function CaixaTab({ dados }: Props) {
  return (
    <div>
      {/* 1. Header */}
      <TabHeaderCard titulo="A · Caixa" intro={conteudoCaixa.intro} />

      {/* 2. Card Veredito */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Veredito
        </span>
        <p
          className="mt-1 text-[14px] leading-relaxed"
          style={{ color: "var(--brand-navy)" }}
        >
          {dados?.veredito ?? conteudoCaixa.veredictTemplate}
        </p>
      </div>

      {/* 3. Grid 4 KPI cards */}
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <KPICard
          label={conteudoCaixa.kpis.saldoAtual}
          valor={formatCurrency(dados?.saldoAtual?.valor)}
          sub={dados?.saldoAtual?.sub}
        />
        <KPICard
          label={conteudoCaixa.kpis.runway}
          valor={dados?.runwayDias?.valor !== undefined ? `${formatNumber(dados.runwayDias.valor)} dias` : "—"}
          sub={dados?.runwayDias?.sub}
        />
        <KPICard
          label={conteudoCaixa.kpis.entradas}
          valor={formatCurrency(dados?.entradas30d?.valor)}
          sub={dados?.entradas30d?.sub}
        />
        <KPICard
          label={conteudoCaixa.kpis.saidas}
          valor={formatCurrency(dados?.saidas30d?.valor)}
          sub={dados?.saidas30d?.sub}
        />
      </div>

      {/* 4. Card tabela Fluxo de caixa */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
        {/* Header */}
        <div className="flex items-baseline justify-between">
          <h2
            className="text-base font-bold leading-snug"
            style={{ color: "var(--brand-navy)" }}
          >
            {conteudoCaixa.tabela.titulo}
          </h2>
          <span className="text-[11px] text-muted-foreground">
            {conteudoCaixa.tabela.source}
          </span>
        </div>

        {/* Tabela */}
        <div className="mr-auto mt-4 max-w-[1280px] overflow-x-auto">
          <table className="w-full table-fixed text-[12px]">
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {conteudoCaixa.tabela.colunas.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {conteudoCaixa.categorias.map((cat) => {
                const row = dados?.fluxoCaixa?.find((r) => r.categoria === cat.id)
                return (
                  <tr
                    key={cat.id}
                    className={`border-b border-border ${cat.isSubtotal ? "bg-muted/20 font-semibold" : ""}`}
                  >
                    <td
                      className="px-3 py-2.5"
                      style={{ color: "var(--brand-navy)" }}
                    >
                      {cat.label}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-right">
                      {formatCurrency(row?.ano2023)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-right">
                      {formatCurrency(row?.ano2024)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-right">
                      {formatCurrency(row?.ano2025)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-right">
                      {formatPct(row?.varPct)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Card Ponto de atenção */}
      <div className="mt-6 flex gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--warning-bg, hsl(38 92% 95%))" }}
        >
          <AlertTriangle
            className="h-5 w-5"
            style={{ color: "var(--warning, hsl(38 92% 50%))" }}
          />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Ponto de atenção
          </span>
          <p
            className="mt-1 text-[13px] leading-relaxed"
            style={{ color: "var(--slate-700)" }}
          >
            {dados?.atencao ?? conteudoCaixa.atencaoTemplate}
          </p>
        </div>
      </div>

      {/* 6. Card Ações de caixa */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
        <h3
          className="text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          {conteudoCaixa.acoesTitulo}
        </h3>
        {dados?.acoes && dados.acoes.length > 0 ? (
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] leading-relaxed text-[color:var(--slate-700)]">
            {dados.acoes.map((acao, i) => (
              <li key={i}>{acao}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-[13px] text-muted-foreground">
            {conteudoCaixa.acoesEmptyState}
          </p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------
// KPICard helper
// ---------------------------------------------------------------------
function KPICard({
  label,
  valor,
  sub,
}: {
  label: string
  valor: string
  sub?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: "var(--brand-cyan)" }}
      />
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p
        className="mt-1 text-3xl font-bold"
        style={{ color: "var(--brand-navy)" }}
      >
        {valor}
      </p>
      {sub && (
        <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>
      )}
    </div>
  )
}
