"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"

/**
 * Modelo de item usado pelas três telas de lista (a receber, a pagar, antigos).
 * Tom owner-friendly: títulos claros, sem jargão contábil.
 */
export type LedgerItem = {
  id: string
  /** Cliente, fornecedor ou descrição principal do lançamento. */
  counterparty: string
  /** Subtítulo: categoria, NF, documento, etc. */
  meta: string
  /** Data de vencimento ou de referência (ISO curta, ex: 2024-08-12) */
  dueDate: string
  /** Dias até vencer (negativo = vencido). */
  daysToDue: number
  /** Valor em reais (positivo). */
  amount: number
  /** Status owner-friendly: "Em dia", "Vence em 7 dias", "Vencido", "Sem baixa", etc. */
  status: "em-dia" | "vencendo" | "vencido" | "sem-baixa"
}

export type FilterChip = {
  id: string
  label: string
  /** Função de filtro sobre o item; se omitida, significa "Tudo". */
  predicate?: (item: LedgerItem) => boolean
}

type LedgerListViewProps = {
  eyebrow: string
  title: string
  description: string
  /** Card de resumo ao topo. */
  summary: {
    totalLabel: string
    total: number
    countLabel: string
    count: number
    extra?: { label: string; value: string }[]
  }
  items: LedgerItem[]
  filters: FilterChip[]
  /** Se verdadeiro, rótulos dos títulos usam "fornecedor" etc; default é "cliente". */
  kind: "receber" | "pagar" | "antigos"
  /** Prompt para abrir no Chat CFOup. */
  chatPrompt: string
}

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

function chatHref(q: string) {
  return `/chat?q=${encodeURIComponent(q)}&auto=1`
}

export function LedgerListView({
  eyebrow,
  title,
  description,
  summary,
  items,
  filters,
  kind,
  chatPrompt,
}: LedgerListViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>(filters[0]?.id ?? "all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const chip = filters.find((f) => f.id === activeFilter)
    const pred = chip?.predicate
    const q = query.trim().toLowerCase()
    return items.filter((it) => {
      if (pred && !pred(it)) return false
      if (!q) return true
      return (
        it.counterparty.toLowerCase().includes(q) ||
        it.meta.toLowerCase().includes(q) ||
        it.id.toLowerCase().includes(q)
      )
    })
  }, [items, filters, activeFilter, query])

  const filteredTotal = filtered.reduce((acc, it) => acc + it.amount, 0)

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <Link
            href={chatHref(chatPrompt)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[var(--brand-blue)]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Discutir no Chat CFOup
          </Link>
        }
      />

      {/* Resumo do topo */}
      <section className="mb-6 rounded-2xl border border-border bg-card p-6 md:p-7">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {summary.totalLabel}
            </p>
            <p
              className="mt-2 text-[2.5rem] font-extrabold leading-none tabular-nums"
              style={{ color: "var(--brand-navy)" }}
            >
              {formatBRL(summary.total)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {summary.count} {summary.countLabel}
            </p>
          </div>

          {summary.extra?.map((ex) => (
            <div key={ex.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {ex.label}
              </p>
              <p
                className="mt-2 text-xl font-extrabold tabular-nums"
                style={{ color: "var(--brand-navy)" }}
              >
                {ex.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filtros + busca */}
      <section className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const active = f.id === activeFilter
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={
                  active
                    ? "rounded-full bg-[var(--brand-navy)] px-3.5 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-[var(--brand-blue)]/40 hover:text-[var(--brand-navy)]"
                }
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <label className="relative block md:w-72">
          <span className="sr-only">Buscar</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              kind === "pagar" ? "Buscar fornecedor ou documento" : "Buscar cliente ou documento"
            }
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--brand-blue)]/50"
          />
        </label>
      </section>

      {/* Tabela / lista */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
              {filtered.length} {filtered.length === 1 ? "item" : "itens"}
            </h2>
            <span className="text-xs text-muted-foreground">
              Total exibido · <span className="tabular-nums">{formatBRL(filteredTotal)}</span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Ordenado por vencimento</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-muted-foreground">
            Nada por aqui com os filtros atuais.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((it) => (
              <LedgerRow key={it.id} item={it} kind={kind} />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function LedgerRow({ item, kind }: { item: LedgerItem; kind: "receber" | "pagar" | "antigos" }) {
  const statusBadge = getStatusBadge(item.status)

  return (
    <li className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ background: statusBadge.bg, color: statusBadge.color }}
          >
            {statusBadge.label}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {item.id}
          </span>
        </div>
        <p className="mt-1.5 text-[15px] font-semibold leading-tight" style={{ color: "var(--brand-navy)" }}>
          {item.counterparty}
        </p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{item.meta}</p>
      </div>

      <div className="flex items-center justify-between gap-4 md:gap-8">
        <div className="text-right md:min-w-[120px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {kind === "pagar" ? "Vence" : "Vencimento"}
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums" style={{ color: "var(--brand-navy)" }}>
            {formatDate(item.dueDate)}
          </p>
          <p
            className="mt-0.5 text-[11px] font-medium"
            style={{
              color:
                item.daysToDue < 0
                  ? "#b91c4b"
                  : item.daysToDue <= 7
                    ? "#92610b"
                    : "var(--slate-500)",
            }}
          >
            {relativeDue(item.daysToDue)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-extrabold tabular-nums" style={{ color: "var(--brand-navy)" }}>
            {formatBRL(item.amount)}
          </p>
        </div>
      </div>
    </li>
  )
}

function getStatusBadge(s: LedgerItem["status"]) {
  switch (s) {
    case "vencido":
      return { label: "Vencido", bg: "rgba(225,29,72,0.10)", color: "#b91c4b" }
    case "vencendo":
      return { label: "Vencendo", bg: "rgba(234,179,8,0.14)", color: "#92610b" }
    case "sem-baixa":
      return { label: "Sem baixa", bg: "rgba(234,179,8,0.14)", color: "#92610b" }
    case "em-dia":
    default:
      return { label: "Em dia", bg: "rgba(54,186,88,0.12)", color: "var(--brand-green-dark)" }
  }
}

function formatDate(iso: string) {
  // iso esperado no formato YYYY-MM-DD
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y.slice(2)}`
}

function relativeDue(days: number) {
  if (days < 0) return `${Math.abs(days)} dias em atraso`
  if (days === 0) return "vence hoje"
  if (days === 1) return "vence amanhã"
  if (days <= 7) return `vence em ${days} dias`
  return `em ${days} dias`
}

