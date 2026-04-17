"use client"

import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"

type Row = {
  rank: number
  name: string
  segment: string
  revenue: number
  share: number
  cumulative: number
}

const ROWS: Row[] = [
  { rank: 1, name: "Construtora Andrade", segment: "Construção civil", revenue: 82400, share: 24, cumulative: 24 },
  { rank: 2, name: "Metalúrgica Vitória", segment: "Indústria", revenue: 54100, share: 16, cumulative: 40 },
  { rank: 3, name: "Grupo Sertanejo", segment: "Agro", revenue: 41800, share: 12, cumulative: 52 },
  { rank: 4, name: "Laticínios Bela Vista", segment: "Alimentos", revenue: 32600, share: 9, cumulative: 61 },
  { rank: 5, name: "Transportadora Linha Azul", segment: "Logística", revenue: 24200, share: 7, cumulative: 68 },
  { rank: 6, name: "Plastech Brasil", segment: "Indústria", revenue: 19400, share: 5, cumulative: 73 },
  { rank: 7, name: "Grupo Montezanto", segment: "Atacado", revenue: 17100, share: 5, cumulative: 78 },
  { rank: 8, name: "Tecnopar Indústria", segment: "Indústria", revenue: 12800, share: 4, cumulative: 82 },
]

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

export default function ConcentracaoPage() {
  const top5 = ROWS.slice(0, 5)
  const top5Share = top5.reduce((acc, r) => acc + r.share, 0)
  const totalRevenue = ROWS.reduce((acc, r) => acc + r.revenue, 0)
  const top5Revenue = top5.reduce((acc, r) => acc + r.revenue, 0)

  return (
    <>
      <PageHeader
        eyebrow="Risco principal"
        title="Concentração de receita"
        description="Participação dos principais clientes na receita do período e exposição em caso de perda."
        actions={
          <Link
            href="/clientes"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para clientes
          </Link>
        }
      />

      {/* Callout risco */}
      <section
        className="mb-5 flex items-start gap-3 rounded-2xl border border-[rgba(234,179,8,0.35)] bg-[rgba(234,179,8,0.08)] p-4 md:p-5"
      >
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "rgba(234,179,8,0.18)", color: "#b45309" }}
        >
          <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#92400e]">
            Risco principal
          </p>
          <p className="mt-0.5 text-[15px] font-bold leading-snug" style={{ color: "var(--brand-navy)" }}>
            Top 5 clientes concentram {top5Share}% da receita do período.
          </p>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--slate-700)]">
            A perda de qualquer um desses clientes afeta diretamente o caixa dos próximos meses. Considere diversificar a carteira e reforçar cobrança com esses nomes.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Participação Top 5
          </p>
          <p className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
            {top5Share}%
          </p>
          <p className="mt-1 text-[11px] font-medium" style={{ color: "#b45309" }}>
            Concentração alta
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Receita Top 5
          </p>
          <p className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
            {formatMoney(top5Revenue)}
          </p>
          <p className="mt-1 text-[11px] font-medium text-[var(--slate-600)]">
            de {formatMoney(totalRevenue)} totais
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Maior cliente
          </p>
          <p className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
            {top5[0].share}%
          </p>
          <p className="mt-1 truncate text-[11px] font-medium text-[var(--slate-600)]">
            {top5[0].name}
          </p>
        </div>
      </section>

      {/* Breakdown */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Breakdown por cliente
            </p>
            <h2 className="mt-0.5 text-[15px] font-bold" style={{ color: "var(--brand-navy)" }}>
              Participação acumulada
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 w-12">#</th>
                <th className="px-4 py-2.5">Cliente</th>
                <th className="px-4 py-2.5">Segmento</th>
                <th className="px-4 py-2.5 text-right">Receita</th>
                <th className="px-4 py-2.5 text-right">% receita</th>
                <th className="px-4 py-2.5 text-right">% acumulado</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => {
                const inTop5 = r.rank <= 5
                return (
                  <tr key={r.rank} className="border-t border-border">
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[11px] font-bold tabular-nums"
                        style={{ color: "var(--brand-navy)" }}
                      >
                        {r.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--brand-navy)" }}>
                      {r.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.segment}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: "var(--brand-navy)" }}>
                      {formatMoney(r.revenue)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div
                          className="h-1 w-20 overflow-hidden rounded-full"
                          style={{ background: "rgba(21,103,200,0.10)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(r.share * 3, 100)}%`,
                              background: inTop5 ? "#b45309" : "var(--brand-blue)",
                            }}
                          />
                        </div>
                        <span className="tabular-nums text-[var(--slate-700)]">{r.share}%</span>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-right tabular-nums font-semibold"
                      style={{ color: inTop5 ? "#b45309" : "var(--slate-700)" }}
                    >
                      {r.cumulative}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
