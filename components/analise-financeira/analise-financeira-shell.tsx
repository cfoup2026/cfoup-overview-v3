"use client"

import { useState, useEffect } from "react"
import type { AnaliseContabilData } from "@/lib/clientes/empresa-001"
import type { DadosFinanceiros } from "@/lib/types/analise-financeira"
import SinteseTab from "./sintese-tab"
import CaixaTab from "./caixa-tab"

// ---------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------
const tabs = [
  { id: "S", numeral: "S", label: "Síntese" },
  { id: "A", numeral: "A", label: "Caixa" },
  { id: "B", numeral: "B", label: "Clientes" },
  { id: "C", numeral: "C", label: "Faturamento" },
  { id: "D", numeral: "D", label: "Fornecedor" },
  { id: "E", numeral: "E", label: "Ciclo Financeiro" },
  { id: "F", numeral: "F", label: "Auditoria" },
  { id: "checklist", numeral: "✓", label: "Checklist Mensal" },
]

// ---------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------
type ClienteComFinanceiro = AnaliseContabilData & {
  dadosFinanceiros?: DadosFinanceiros
}

type Props = {
  cliente: ClienteComFinanceiro
}

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------
export default function AnaliseFinanceiraShell({ cliente }: Props) {
  const [activeTab, setActiveTab] = useState("S")

  // Reset scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [activeTab])

  return (
    <>
      {/* ============================================================ */}
      {/* STICKY WRAPPER — hero card + tab nav fixos no topo            */}
      {/* ============================================================ */}
      <div className="sticky top-14 z-20 -mx-8 bg-background px-8 pb-0 pt-0 md:-mx-10 md:px-10 lg:-mx-12 lg:top-0 lg:px-12">
        {/* ============================================================ */}
        {/* HEADER — hero card com bg-hero-gradient                      */}
        {/* ============================================================ */}
        <header className="rounded-2xl border border-border bg-hero-gradient p-5 md:p-6">
          {/* Eyebrow line 1 */}
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--brand-blue)" }}
          >
            CFOup · Análise Financeira
          </p>
          {/* Eyebrow line 2 */}
          <p className="text-[12px] text-muted-foreground">
            Operação · Vendas · Recebíveis · Caixa
          </p>
          {/* H1 */}
          <h1
            className="mt-0.5 text-lg font-extrabold leading-tight md:text-[1.3rem]"
            style={{ color: "var(--brand-navy)" }}
          >
            {cliente.empresa?.nome ?? "—"}
          </h1>
          {/* Descrição */}
          <p
            className="mt-1.5 max-w-3xl text-[13px] leading-relaxed"
            style={{ color: "var(--slate-700)" }}
          >
            Análise operacional e financeira do negócio — faturamento, clientes,
            caixa, ciclo e fornecedores.
          </p>

          {/* Meta chips */}
          <div className="mt-4 flex flex-wrap gap-6">
            <Chip label="EXERCÍCIOS" value={cliente.periodos?.join(" · ") ?? "—"} />
            <Chip label="DATA-BASE" value={cliente.emitidoEm ?? "—"} />
            <Chip label="NFs ANALISADAS" value="—" />
            <Chip label="SETOR" value="—" />
          </div>
        </header>

        {/* ============================================================ */}
        {/* TABS NAV                                                      */}
        {/* ============================================================ */}
        <nav className="mt-4 border-b border-border">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-baseline gap-1.5 rounded-t-md px-2 py-3 transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  }`}
                  style={{
                    borderBottom: isActive
                      ? "3px solid var(--brand-blue)"
                      : "3px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: "var(--brand-blue)" }}
                  >
                    {tab.numeral}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {/* ============================================================ */}
      {/* CONTENT                                                        */}
      {/* ============================================================ */}
      <div className="mt-6">
        {activeTab === "S" && (
          <SinteseTab dados={cliente.dadosFinanceiros?.sintese} />
        )}
        {activeTab === "A" && (
          <CaixaTab dados={cliente.dadosFinanceiros?.caixa} />
        )}
        {activeTab !== "S" && activeTab !== "A" && (
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <p className="text-[13px] text-muted-foreground">
              Em construção · próximo PR.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------
// Chip helper
// ---------------------------------------------------------------------
function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p
        className="mt-0.5 text-[13px] font-semibold"
        style={{ color: "var(--brand-navy)" }}
      >
        {value}
      </p>
    </div>
  )
}
