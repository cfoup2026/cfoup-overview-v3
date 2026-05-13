"use client"

import { useEffect, type ReactNode } from "react"
import { PageHeader } from "@/components/page-header"

// ---------------------------------------------------------------------
// AnalysisShell — reusable header + tabs wrapper for Análise Contábil
// and Análise Financeira. Uses PageHeader for consistency with other pages.
// ---------------------------------------------------------------------

export type TabConfig = {
  id: string
  numeral: string
  label: string
}

export type AnalysisShellMeta = {
  periodoAnalisado?: string
  regimeTributario?: string
  fontesRecebidas?: string
  statusAnalise?: "Completa" | "Parcial" | "Aguardando arquivos"
}

export type AnalysisShellProps = {
  empresa: { nome?: string }
  eyebrow: string
  descricaoCurta: string
  meta?: AnalysisShellMeta
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (id: string) => void
  children: ReactNode
}

export function AnalysisShell({
  empresa,
  eyebrow,
  descricaoCurta,
  meta,
  tabs,
  activeTab,
  onTabChange,
  children,
}: AnalysisShellProps) {
  // Reset scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [activeTab])

  return (
    <>
      {/* HEADER — usando PageHeader canônico */}
      <PageHeader eyebrow={eyebrow} title={empresa.nome || "—"} />

      {/* METADADOS — bloco separado abaixo do PageHeader */}
      <div className="-mt-6 mb-6">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {descricaoCurta}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-muted-foreground">
          <p>
            <span className="font-medium" style={{ color: "var(--brand-navy)" }}>Período analisado:</span>{" "}
            {meta?.periodoAnalisado || "—"}
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--brand-navy)" }}>Regime tributário:</span>{" "}
            {meta?.regimeTributario || "—"}
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--brand-navy)" }}>Fontes recebidas:</span>{" "}
            {meta?.fontesRecebidas || "Nenhum arquivo recebido"}
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--brand-navy)" }}>Status da análise:</span>{" "}
            {meta?.statusAnalise || "Aguardando arquivos"}
          </p>
        </div>
      </div>

      {/* STICKY TABS NAV */}
      <div className="sticky top-0 z-20 -mx-8 bg-background md:-mx-10 lg:-mx-12">
        <nav className="border-b border-border bg-background px-8 md:px-10 lg:px-12">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-baseline gap-2 whitespace-nowrap rounded-t-lg px-2 py-3 transition-colors ${
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
                  className="text-[10px] font-semibold"
                  style={{ color: "var(--brand-blue)" }}
                >
                  {tab.numeral}
                </span>
                <span className={`text-[13px] ${isActive ? "font-bold" : "font-medium"}`}>
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
      <div className="mt-6">{children}</div>
    </>
  )
}
