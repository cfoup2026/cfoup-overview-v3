"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight } from "lucide-react"

type PeriodKey = "mes" | "trimestre" | "ytd" | "12m"

type PeriodData = {
  key: PeriodKey
  label: string
  variation: string
  positive: boolean
  sentence: string
}

const PERIODS: PeriodData[] = [
  {
    key: "mes",
    label: "Mês",
    variation: "+R$ 9.183",
    positive: true,
    sentence: "As entradas de clientes superaram as saídas com fornecedores e folha neste mês.",
  },
  {
    key: "trimestre",
    label: "Trimestre",
    variation: "+R$ 18.450",
    positive: true,
    sentence: "A operação voltou a gerar caixa depois de março, com recebimentos mais regulares.",
  },
  {
    key: "ytd",
    label: "Ano até agora",
    variation: "+R$ 24.120",
    positive: true,
    sentence: "Crescimento leve, sustentado pelos dois últimos meses de recuperação.",
  },
  {
    key: "12m",
    label: "Últimos 12 meses",
    variation: "−R$ 8.650",
    positive: false,
    sentence: "Meses de queda mais pesados pesaram mais que os meses de recuperação recente.",
  },
]

export function LiquidezBlock() {
  const [active, setActive] = useState<PeriodKey>("mes")
  const current = PERIODS.find((p) => p.key === active) ?? PERIODS[0]

  return (
    <section
      aria-labelledby="bloco-caixa"
      className="lg:col-span-7 rounded-2xl border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            id="bloco-caixa"
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
          >
            Caixa e liquidez
          </p>
          <h3 className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
            Variação por período
          </h3>
        </div>
        <Link
          href="/fluxo-de-caixa"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-blue)] hover:underline"
        >
          Fluxo de caixa
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Seletor de período — mais leve */}
      <div role="tablist" aria-label="Período" className="mt-3 flex flex-wrap gap-1">
        {PERIODS.map((p) => {
          const isActive = p.key === active
          return (
            <button
              key={p.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(p.key)}
              className={
                "rounded-md px-2.5 py-1 text-[12px] font-medium transition " +
                (isActive
                  ? "bg-[var(--brand-navy)] text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-[var(--brand-navy)]")
              }
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Métrica */}
      <div className="mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Variação
        </p>
        <p
          className="mt-1 text-[1.625rem] font-extrabold leading-none tabular-nums"
          style={{
            color: current.positive ? "var(--brand-green-dark)" : "var(--slate-800)",
          }}
        >
          {current.variation}
        </p>
        <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-[var(--slate-700)]">
          {current.sentence}
        </p>
      </div>
    </section>
  )
}
