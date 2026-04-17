"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useMemo } from "react"
import { ArrowUpRight, Search } from "lucide-react"
import { PageHeader } from "@/components/page-header"

type Client = {
  id: string
  name: string
  segment: string
  revenue: number
  share: number
  openAmount: number
  overdueAmount: number
  avgDelayDays: number
  status: "ativo" | "inativo"
  lastInvoice: string
}

const CLIENTS: Client[] = [
  {
    id: "C-001",
    name: "Construtora Andrade",
    segment: "Construção civil",
    revenue: 82400,
    share: 24,
    openAmount: 48200,
    overdueAmount: 12400,
    avgDelayDays: 9,
    status: "ativo",
    lastInvoice: "2025-10-12",
  },
  {
    id: "C-002",
    name: "Metalúrgica Vitória",
    segment: "Indústria",
    revenue: 54100,
    share: 16,
    openAmount: 31400,
    overdueAmount: 0,
    avgDelayDays: 0,
    status: "ativo",
    lastInvoice: "2025-10-14",
  },
  {
    id: "C-003",
    name: "Grupo Sertanejo",
    segment: "Agro",
    revenue: 41800,
    share: 12,
    openAmount: 22800,
    overdueAmount: 8200,
    avgDelayDays: 14,
    status: "ativo",
    lastInvoice: "2025-10-09",
  },
  {
    id: "C-004",
    name: "Laticínios Bela Vista",
    segment: "Alimentos",
    revenue: 32600,
    share: 9,
    openAmount: 14600,
    overdueAmount: 4100,
    avgDelayDays: 22,
    status: "ativo",
    lastInvoice: "2025-10-08",
  },
  {
    id: "C-005",
    name: "Transportadora Linha Azul",
    segment: "Logística",
    revenue: 24200,
    share: 7,
    openAmount: 9800,
    overdueAmount: 0,
    avgDelayDays: 3,
    status: "ativo",
    lastInvoice: "2025-10-15",
  },
  {
    id: "C-006",
    name: "Plastech Brasil",
    segment: "Indústria",
    revenue: 19400,
    share: 5,
    openAmount: 7200,
    overdueAmount: 2100,
    avgDelayDays: 18,
    status: "ativo",
    lastInvoice: "2025-10-05",
  },
  {
    id: "C-007",
    name: "Grupo Montezanto",
    segment: "Atacado",
    revenue: 17100,
    share: 5,
    openAmount: 54300,
    overdueAmount: 54300,
    avgDelayDays: 31,
    status: "ativo",
    lastInvoice: "2025-09-20",
  },
  {
    id: "C-008",
    name: "Tecnopar Indústria",
    segment: "Indústria",
    revenue: 12800,
    share: 4,
    openAmount: 18900,
    overdueAmount: 18900,
    avgDelayDays: 41,
    status: "ativo",
    lastInvoice: "2025-09-12",
  },
  {
    id: "C-009",
    name: "Mercantil Forte",
    segment: "Varejo",
    revenue: 9600,
    share: 3,
    openAmount: 0,
    overdueAmount: 0,
    avgDelayDays: 2,
    status: "inativo",
    lastInvoice: "2025-08-30",
  },
  {
    id: "C-010",
    name: "Indústria Andrade",
    segment: "Indústria",
    revenue: 8200,
    share: 2,
    openAmount: 6400,
    overdueAmount: 0,
    avgDelayDays: 5,
    status: "ativo",
    lastInvoice: "2025-10-10",
  },
]

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

function ClientesContent() {
  const params = useSearchParams()
  const status = params.get("status")
  const isAtivos = status === "ativos"

  const filtered = useMemo(() => {
    if (isAtivos) return CLIENTS.filter((c) => c.status === "ativo")
    return CLIENTS
  }, [isAtivos])

  const totalRevenue = filtered.reduce((acc, c) => acc + c.revenue, 0)
  const totalOpen = filtered.reduce((acc, c) => acc + c.openAmount, 0)
  const totalOverdue = filtered.reduce((acc, c) => acc + c.overdueAmount, 0)

  return (
    <>
      <PageHeader
        eyebrow={isAtivos ? "Clientes pagantes" : "Análise de clientes"}
        title={isAtivos ? "Clientes ativos no período" : "Visão completa da carteira"}
        description={
          isAtivos
            ? "Clientes com ao menos uma fatura emitida ou recebida nos últimos 90 dias."
            : "Receita, concentração, valores em aberto e atraso médio por cliente."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {isAtivos ? (
              <Link
                href="/clientes"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
              >
                Ver todos
              </Link>
            ) : (
              <Link
                href="/clientes?status=ativos"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
              >
                Apenas ativos
              </Link>
            )}
            <Link
              href="/clientes/atraso"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
            >
              Atraso médio
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/clientes/concentracao"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
            >
              Concentração
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        }
      />

      {/* KPIs de topo */}
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Clientes no recorte" value={`${filtered.length}`} hint={isAtivos ? "Ativos no período" : "Toda a carteira"} />
        <StatCard label="Receita" value={formatMoney(totalRevenue)} hint="Somatório no período" />
        <StatCard label="A receber em aberto" value={formatMoney(totalOpen)} hint={`Vencido: ${formatMoney(totalOverdue)}`} tone={totalOverdue > 0 ? "warning" : "neutral"} />
      </section>

      {/* Tabela */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            {filtered.length} clientes
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Cliente</th>
                <th className="px-4 py-2.5">Segmento</th>
                <th className="px-4 py-2.5 text-right">Receita</th>
                <th className="px-4 py-2.5 text-right">% receita</th>
                <th className="px-4 py-2.5 text-right">A receber</th>
                <th className="px-4 py-2.5 text-right">Vencido</th>
                <th className="px-4 py-2.5 text-right">Atraso médio</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-border align-middle">
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--brand-navy)" }}>
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.segment}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold" style={{ color: "var(--brand-navy)" }}>
                    {formatMoney(c.revenue)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--slate-700)]">{c.share}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatMoney(c.openAmount)}</td>
                  <td
                    className="px-4 py-3 text-right tabular-nums font-semibold"
                    style={{ color: c.overdueAmount > 0 ? "var(--brand-red)" : "var(--slate-600)" }}
                  >
                    {formatMoney(c.overdueAmount)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.avgDelayDays} dias</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
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

export default function ClientesPage() {
  return (
    <Suspense fallback={<div className="py-10 text-sm text-muted-foreground">Carregando carteira...</div>}>
      <ClientesContent />
    </Suspense>
  )
}

function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string
  value: string
  hint?: string
  tone?: "neutral" | "warning"
}) {
  const hintColor = tone === "warning" ? "var(--brand-red)" : "var(--slate-600)"
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[11px] font-medium" style={{ color: hintColor }}>
          {hint}
        </p>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: Client["status"] }) {
  const isAtivo = status === "ativo"
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{
        background: isAtivo ? "rgba(54,186,88,0.12)" : "rgba(15,23,42,0.06)",
        color: isAtivo ? "var(--brand-green-dark)" : "var(--slate-700)",
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: isAtivo ? "var(--brand-green)" : "var(--slate-500)" }}
      />
      {isAtivo ? "Ativo" : "Inativo"}
    </span>
  )
}
