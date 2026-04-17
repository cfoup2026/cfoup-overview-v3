"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useMemo } from "react"
import { ArrowUpRight, Search } from "lucide-react"
import { PageHeader } from "@/components/page-header"

type Supplier = {
  id: string
  name: string
  category: string
  purchases: number
  costShare: number
  openAmount: number
  overdueAmount: number
  avgPaymentTermDays: number
  status: "ativo" | "inativo"
  lastInvoice: string
}

const SUPPLIERS: Supplier[] = [
  {
    id: "F-001",
    name: "Plastibras Insumos",
    category: "Matéria-prima",
    purchases: 96800,
    costShare: 22,
    openAmount: 44200,
    overdueAmount: 22100,
    avgPaymentTermDays: 15,
    status: "ativo",
    lastInvoice: "2025-10-12",
  },
  {
    id: "F-002",
    name: "Aços São Paulo",
    category: "Matéria-prima",
    purchases: 74500,
    costShare: 17,
    openAmount: 38400,
    overdueAmount: 0,
    avgPaymentTermDays: 14,
    status: "ativo",
    lastInvoice: "2025-10-14",
  },
  {
    id: "F-003",
    name: "Químicos União",
    category: "Matéria-prima",
    purchases: 48200,
    costShare: 11,
    openAmount: 0,
    overdueAmount: 0,
    avgPaymentTermDays: 21,
    status: "ativo",
    lastInvoice: "2025-10-02",
  },
  {
    id: "F-004",
    name: "Metalfix Ferramentas",
    category: "Ferramentaria",
    purchases: 32400,
    costShare: 7,
    openAmount: 16300,
    overdueAmount: 0,
    avgPaymentTermDays: 30,
    status: "ativo",
    lastInvoice: "2025-10-11",
  },
  {
    id: "F-005",
    name: "Embalagens Norte",
    category: "Embalagens",
    purchases: 28100,
    costShare: 6,
    openAmount: 0,
    overdueAmount: 0,
    avgPaymentTermDays: 28,
    status: "ativo",
    lastInvoice: "2025-09-30",
  },
  {
    id: "F-006",
    name: "Transportadora Linha Sul",
    category: "Logística",
    purchases: 22800,
    costShare: 5,
    openAmount: 12800,
    overdueAmount: 0,
    avgPaymentTermDays: 10,
    status: "ativo",
    lastInvoice: "2025-10-15",
  },
  {
    id: "F-007",
    name: "Energia SP",
    category: "Utilidades",
    purchases: 19700,
    costShare: 4,
    openAmount: 9850,
    overdueAmount: 0,
    avgPaymentTermDays: 7,
    status: "ativo",
    lastInvoice: "2025-10-10",
  },
  {
    id: "F-008",
    name: "Manutenção Sigma",
    category: "Manutenção",
    purchases: 14600,
    costShare: 3,
    openAmount: 6200,
    overdueAmount: 0,
    avgPaymentTermDays: 20,
    status: "ativo",
    lastInvoice: "2025-10-07",
  },
  {
    id: "F-009",
    name: "Software Contábil LTDA",
    category: "Serviços",
    purchases: 9600,
    costShare: 2,
    openAmount: 2400,
    overdueAmount: 0,
    avgPaymentTermDays: 30,
    status: "ativo",
    lastInvoice: "2025-10-05",
  },
  {
    id: "F-010",
    name: "Comercial Andrade",
    category: "Serviços",
    purchases: 6800,
    costShare: 2,
    openAmount: 0,
    overdueAmount: 0,
    avgPaymentTermDays: 15,
    status: "inativo",
    lastInvoice: "2025-08-28",
  },
]

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

function FornecedoresContent() {
  const params = useSearchParams()
  const status = params.get("status")
  const isAtivos = status === "ativos"

  const filtered = useMemo(() => {
    if (isAtivos) return SUPPLIERS.filter((s) => s.status === "ativo")
    return SUPPLIERS
  }, [isAtivos])

  const totalPurchases = filtered.reduce((acc, s) => acc + s.purchases, 0)
  const totalOpen = filtered.reduce((acc, s) => acc + s.openAmount, 0)
  const totalOverdue = filtered.reduce((acc, s) => acc + s.overdueAmount, 0)

  return (
    <>
      <PageHeader
        eyebrow={isAtivos ? "Fornecedores com compras recentes" : "Análise de fornecedores"}
        title={isAtivos ? "Fornecedores ativos no período" : "Visão completa dos fornecedores"}
        description={
          isAtivos
            ? "Fornecedores com ao menos uma compra ou pagamento nos últimos 90 dias."
            : "Compras, concentração do custo, valores em aberto e prazo médio por fornecedor."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {isAtivos ? (
              <Link
                href="/fornecedores"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
              >
                Ver todos
              </Link>
            ) : (
              <Link
                href="/fornecedores?status=ativos"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
              >
                Apenas ativos
              </Link>
            )}
            <Link
              href="/fornecedores/atraso"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-[var(--slate-700)] hover:border-[var(--brand-navy)] hover:text-[var(--brand-navy)]"
            >
              Atraso médio
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/fornecedores/concentracao"
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
        <StatCard
          label="Fornecedores no recorte"
          value={`${filtered.length}`}
          hint={isAtivos ? "Ativos no período" : "Toda a base"}
        />
        <StatCard
          label="Compras no período"
          value={formatMoney(totalPurchases)}
          hint="Somatório no período"
        />
        <StatCard
          label="A pagar em aberto"
          value={formatMoney(totalOpen)}
          hint={`Vencido: ${formatMoney(totalOverdue)}`}
          tone={totalOverdue > 0 ? "warning" : "neutral"}
        />
      </section>

      {/* Tabela */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            {filtered.length} fornecedores
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Fornecedor</th>
                <th className="px-4 py-2.5">Categoria</th>
                <th className="px-4 py-2.5 text-right">Compras</th>
                <th className="px-4 py-2.5 text-right">% custo</th>
                <th className="px-4 py-2.5 text-right">A pagar</th>
                <th className="px-4 py-2.5 text-right">Vencido</th>
                <th className="px-4 py-2.5 text-right">Prazo médio</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-border align-middle">
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--brand-navy)" }}>
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                  <td
                    className="px-4 py-3 text-right tabular-nums font-semibold"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {formatMoney(s.purchases)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-[var(--slate-700)]">{s.costShare}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatMoney(s.openAmount)}</td>
                  <td
                    className="px-4 py-3 text-right tabular-nums font-semibold"
                    style={{ color: s.overdueAmount > 0 ? "var(--brand-red)" : "var(--slate-600)" }}
                  >
                    {formatMoney(s.overdueAmount)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{s.avgPaymentTermDays} dias</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
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

export default function FornecedoresPage() {
  return (
    <Suspense fallback={<div className="py-10 text-sm text-muted-foreground">Carregando base de fornecedores...</div>}>
      <FornecedoresContent />
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
      <p
        className="mt-1 text-[1.25rem] font-extrabold leading-none tabular-nums"
        style={{ color: "var(--brand-navy)" }}
      >
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

function StatusBadge({ status }: { status: Supplier["status"] }) {
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
