"use client"

import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"

type Row = {
  rank: number
  name: string
  category: string
  purchases: number
  share: number
  cumulative: number
}

const ROWS: Row[] = [
  { rank: 1, name: "Plastibras Insumos", category: "Matéria-prima", purchases: 96800, share: 22, cumulative: 22 },
  { rank: 2, name: "Aços São Paulo", category: "Matéria-prima", purchases: 74500, share: 17, cumulative: 39 },
  { rank: 3, name: "Químicos União", category: "Matéria-prima", purchases: 48200, share: 11, cumulative: 50 },
  { rank: 4, name: "Metalfix Ferramentas", category: "Ferramentaria", purchases: 32400, share: 7, cumulative: 57 },
  { rank: 5, name: "Embalagens Norte", category: "Embalagens", purchases: 28100, share: 6, cumulative: 63 },
  { rank: 6, name: "Transportadora Linha Sul", category: "Logística", purchases: 22800, share: 5, cumulative: 68 },
  { rank: 7, name: "Energia SP", category: "Utilidades", purchases: 19700, share: 4, cumulative: 72 },
  { rank: 8, name: "Manutenção Sigma", category: "Manutenção", purchases: 14600, share: 3, cumulative: 75 },
]

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

export default function ConcentracaoFornecedoresPage() {
  const top5 = ROWS.slice(0, 5)
  const top5Share = top5.reduce((acc, r) => acc + r.share, 0)
  const totalPurchases = ROWS.reduce((acc, r) => acc + r.purchases, 0)
  const top5Purchases = top5.reduce((acc, r) => acc + r.purchases, 0)

  return (
    <>
      <PageHeader
        eyebrow="Risco principal"
        title="Concentração do custo"
        description="Participação dos principais fornecedores nas compras do período e exposição em caso de interrupção."
        actions={
          <Link
            href="/fornecedores"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para fornecedores
          </Link>
        }
      />

      {/* Callout risco */}
      <section className="mb-5 flex items-start gap-3 rounded-2xl border border-[rgba(234,179,8,0.35)] bg-[rgba(234,179,8,0.08)] p-4 md:p-5">
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
            Top 5 fornecedores respondem por {top5Share}% do custo do período.
          </p>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-[var(--slate-700)]">
            Uma falha de entrega ou reajuste nesses nomes tem impacto direto em margem e prazo de produção. Vale diversificar onde for possível e manter um fornecedor alternativo mapeado.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Participação Top 5
          </p>
          <p
            className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums"
            style={{ color: "var(--brand-navy)" }}
          >
            {top5Share}%
          </p>
          <p className="mt-1 text-[11px] font-medium" style={{ color: "#b45309" }}>
            Concentração alta
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Compras Top 5
          </p>
          <p
            className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums"
            style={{ color: "var(--brand-navy)" }}
          >
            {formatMoney(top5Purchases)}
          </p>
          <p className="mt-1 text-[11px] font-medium text-[var(--slate-600)]">
            de {formatMoney(totalPurchases)} totais
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Maior fornecedor
          </p>
          <p
            className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums"
            style={{ color: "var(--brand-navy)" }}
          >
            {top5[0].share}%
          </p>
          <p className="mt-1 truncate text-[11px] font-medium text-[var(--slate-600)]">{top5[0].name}</p>
        </div>
      </section>

      {/* Breakdown */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Breakdown por fornecedor
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
                <th className="px-4 py-2.5">Fornecedor</th>
                <th className="px-4 py-2.5">Categoria</th>
                <th className="px-4 py-2.5 text-right">Compras</th>
                <th className="px-4 py-2.5 text-right">% custo</th>
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
                    <td className="px-4 py-3 text-muted-foreground">{r.category}</td>
                    <td
                      className="px-4 py-3 text-right tabular-nums font-semibold"
                      style={{ color: "var(--brand-navy)" }}
                    >
                      {formatMoney(r.purchases)}
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
