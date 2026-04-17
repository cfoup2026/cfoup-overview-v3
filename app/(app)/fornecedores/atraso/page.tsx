"use client"

import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/page-header"

type AgingBucket = {
  label: string
  range: string
  count: number
  amount: number
  tone: "safe" | "warning" | "danger"
}

const BUCKETS: AgingBucket[] = [
  { label: "A vencer", range: "0 dias", count: 8, amount: 198700, tone: "safe" },
  { label: "1 a 15 dias", range: "1–15 dias", count: 2, amount: 44200, tone: "warning" },
  { label: "16 a 30 dias", range: "16–30 dias", count: 1, amount: 8600, tone: "warning" },
  { label: "31 a 60 dias", range: "31–60 dias", count: 1, amount: 6400, tone: "danger" },
  { label: "Acima de 60 dias", range: "60+ dias", count: 0, amount: 0, tone: "danger" },
]

type DelayRow = {
  id: string
  name: string
  category: string
  avgDelayDays: number
  overdueAmount: number
  invoicesOverdue: number
}

const ROWS: DelayRow[] = [
  { id: "F-001", name: "Plastibras Insumos", category: "Matéria-prima", avgDelayDays: 7, overdueAmount: 22100, invoicesOverdue: 1 },
  { id: "F-008", name: "Manutenção Sigma", category: "Manutenção", avgDelayDays: 4, overdueAmount: 6200, invoicesOverdue: 1 },
  { id: "F-007", name: "Energia SP", category: "Utilidades", avgDelayDays: 2, overdueAmount: 0, invoicesOverdue: 0 },
  { id: "F-006", name: "Transportadora Linha Sul", category: "Logística", avgDelayDays: 1, overdueAmount: 0, invoicesOverdue: 0 },
  { id: "F-002", name: "Aços São Paulo", category: "Matéria-prima", avgDelayDays: 0, overdueAmount: 0, invoicesOverdue: 0 },
  { id: "F-004", name: "Metalfix Ferramentas", category: "Ferramentaria", avgDelayDays: 0, overdueAmount: 0, invoicesOverdue: 0 },
]

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

export default function AtrasoFornecedoresPage() {
  const totalOverdue = BUCKETS.filter((b) => b.tone !== "safe").reduce((acc, b) => acc + b.amount, 0)
  const totalCount = BUCKETS.reduce((acc, b) => acc + b.count, 0)
  const suppliersWithOverdue = ROWS.filter((r) => r.overdueAmount > 0)
  const avgDelay = suppliersWithOverdue.length
    ? Math.round(
        suppliersWithOverdue.reduce((acc, r) => acc + r.avgDelayDays, 0) /
          Math.max(suppliersWithOverdue.length, 1),
      )
    : 0

  const maxBucketAmount = Math.max(...BUCKETS.map((b) => b.amount), 1)

  return (
    <>
      <PageHeader
        eyebrow="Atraso médio"
        title="Aging dos pagamentos"
        description="Distribuição das contas a pagar por faixa e fornecedores que a Gregorutt está pagando em atraso."
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

      {/* KPIs */}
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Atraso médio
          </p>
          <p
            className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums"
            style={{ color: "var(--brand-navy)" }}
          >
            {avgDelay} dias
          </p>
          <p className="mt-1 text-[11px] font-medium text-[var(--slate-600)]">
            Entre fornecedores com vencido
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Total vencido
          </p>
          <p
            className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums"
            style={{ color: "var(--brand-navy)" }}
          >
            {formatMoney(totalOverdue)}
          </p>
          <p className="mt-1 text-[11px] font-medium text-[var(--slate-600)]">Somando todas as faixas</p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Títulos em aberto
          </p>
          <p
            className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums"
            style={{ color: "var(--brand-navy)" }}
          >
            {totalCount}
          </p>
          <p className="mt-1 text-[11px] font-medium text-[var(--slate-600)]">Distribuídos por faixa</p>
        </div>
      </section>

      {/* Aging buckets */}
      <section className="mb-5 rounded-2xl border border-border bg-card p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Distribuição por faixa
            </p>
            <h2 className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
              Aging buckets
            </h2>
          </div>
        </div>

        <ul className="mt-4 space-y-3">
          {BUCKETS.map((b) => {
            const width = Math.max((b.amount / maxBucketAmount) * 100, 4)
            const color =
              b.tone === "danger"
                ? "var(--brand-red)"
                : b.tone === "warning"
                  ? "#eab308"
                  : "var(--brand-blue)"
            return (
              <li key={b.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>
                      {b.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{b.count} títulos</p>
                  </div>
                  <p className="text-[13px] font-bold tabular-nums" style={{ color: "var(--brand-navy)" }}>
                    {formatMoney(b.amount)}
                  </p>
                </div>
                <div
                  className="mt-1 h-1.5 overflow-hidden rounded-full"
                  style={{ background: "rgba(21,103,200,0.08)" }}
                >
                  <div className="h-full rounded-full" style={{ width: `${width}%`, background: color }} />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Fornecedores com maior atraso */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Fornecedores
            </p>
            <h2 className="mt-0.5 text-[15px] font-bold" style={{ color: "var(--brand-navy)" }}>
              Maior atraso médio
            </h2>
          </div>
          <Link
            href="/contas-a-pagar"
            className="text-xs font-semibold text-[var(--brand-blue)] hover:underline"
          >
            Ver títulos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Fornecedor</th>
                <th className="px-4 py-2.5">Categoria</th>
                <th className="px-4 py-2.5 text-right">Atraso médio</th>
                <th className="px-4 py-2.5 text-right">Vencido</th>
                <th className="px-4 py-2.5 text-right">Títulos vencidos</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--brand-navy)" }}>
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.category}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className="inline-flex items-center gap-1 text-[13px] font-semibold tabular-nums"
                      style={{ color: r.avgDelayDays >= 7 ? "var(--brand-red)" : "var(--brand-navy)" }}
                    >
                      {r.avgDelayDays >= 7 && <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.2} />}
                      {r.avgDelayDays} dias
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-right tabular-nums font-semibold"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {formatMoney(r.overdueAmount)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--slate-700)]">
                    {r.invoicesOverdue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
