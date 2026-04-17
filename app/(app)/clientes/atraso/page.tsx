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
  { label: "A vencer", range: "0 dias", count: 12, amount: 128400, tone: "safe" },
  { label: "1 a 15 dias", range: "1–15 dias", count: 5, amount: 64200, tone: "warning" },
  { label: "16 a 30 dias", range: "16–30 dias", count: 3, amount: 41800, tone: "warning" },
  { label: "31 a 60 dias", range: "31–60 dias", count: 2, amount: 28600, tone: "danger" },
  { label: "Acima de 60 dias", range: "60+ dias", count: 4, amount: 79800, tone: "danger" },
]

type DelayRow = {
  id: string
  name: string
  segment: string
  avgDelayDays: number
  overdueAmount: number
  invoicesOverdue: number
}

const ROWS: DelayRow[] = [
  { id: "C-008", name: "Tecnopar Indústria", segment: "Indústria", avgDelayDays: 41, overdueAmount: 18900, invoicesOverdue: 2 },
  { id: "C-007", name: "Grupo Montezanto", segment: "Atacado", avgDelayDays: 31, overdueAmount: 54300, invoicesOverdue: 3 },
  { id: "C-004", name: "Laticínios Bela Vista", segment: "Alimentos", avgDelayDays: 22, overdueAmount: 4100, invoicesOverdue: 1 },
  { id: "C-006", name: "Plastech Brasil", segment: "Indústria", avgDelayDays: 18, overdueAmount: 2100, invoicesOverdue: 1 },
  { id: "C-003", name: "Grupo Sertanejo", segment: "Agro", avgDelayDays: 14, overdueAmount: 8200, invoicesOverdue: 1 },
  { id: "C-001", name: "Construtora Andrade", segment: "Construção civil", avgDelayDays: 9, overdueAmount: 12400, invoicesOverdue: 1 },
]

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

export default function AtrasoPage() {
  const totalOverdue = BUCKETS.filter((b) => b.tone !== "safe").reduce((acc, b) => acc + b.amount, 0)
  const totalCount = BUCKETS.reduce((acc, b) => acc + b.count, 0)
  const avgDelay = Math.round(
    ROWS.reduce((acc, r) => acc + r.avgDelayDays, 0) / Math.max(ROWS.length, 1),
  )

  const maxBucketAmount = Math.max(...BUCKETS.map((b) => b.amount))

  return (
    <>
      <PageHeader
        eyebrow="Atraso médio"
        title="Aging da carteira"
        description="Distribuição dos valores a receber por faixa de atraso e clientes com maior impacto."
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

      {/* KPIs */}
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Atraso médio
          </p>
          <p className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
            {avgDelay} dias
          </p>
          <p className="mt-1 text-[11px] font-medium" style={{ color: "#b45309" }}>
            +4 vs mês anterior
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Total vencido
          </p>
          <p className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
            {formatMoney(totalOverdue)}
          </p>
          <p className="mt-1 text-[11px] font-medium text-[var(--slate-600)]">Somando todas as faixas</p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Títulos em aberto
          </p>
          <p className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
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
              b.tone === "danger" ? "#b45309" : b.tone === "warning" ? "#eab308" : "var(--brand-blue)"
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
                <div className="mt-1 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(21,103,200,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${width}%`, background: color }} />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Clientes com maior atraso */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Clientes
            </p>
            <h2 className="mt-0.5 text-[15px] font-bold" style={{ color: "var(--brand-navy)" }}>
              Maior atraso médio
            </h2>
          </div>
          <Link
            href="/contas-a-receber"
            className="text-xs font-semibold text-[var(--brand-blue)] hover:underline"
          >
            Ver títulos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Cliente</th>
                <th className="px-4 py-2.5">Segmento</th>
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
                  <td className="px-4 py-3 text-muted-foreground">{r.segment}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className="inline-flex items-center gap-1 text-[13px] font-semibold tabular-nums"
                      style={{ color: r.avgDelayDays >= 30 ? "#b45309" : "var(--brand-navy)" }}
                    >
                      {r.avgDelayDays >= 30 && <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.2} />}
                      {r.avgDelayDays} dias
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: "var(--brand-navy)" }}>
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
