"use client"

import { useEffect, type ReactNode } from "react"

// ---------------------------------------------------------------------
// AnalysisShell — reusable header + tabs wrapper for Análise Contábil
// and Análise Financeira. Hero editorial (fundo navy gradient, Fraunces
// no H1, chips claros). Tabs nav sticky. Espelha sizes/weights/cores
// dos HTMLs cfoup-tese.
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
      {/* ============================================================ */}
      {/* STICKY HEADER — hero + tabs juntos                            */}
      {/* ============================================================ */}
      <div className="sticky top-0 z-20 -mx-8 bg-background md:-mx-10 lg:-mx-12">
        <div className="px-8 pt-4 md:px-10 lg:px-12">
          {/* HERO — card visual */}
          <header className="rounded-2xl border border-border bg-card p-6 md:p-8">
            {/* Eyebrow */}
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand-blue)" }}
            >
              {eyebrow}
            </p>

            {/* H1 — nome da empresa ou fallback */}
            <h1
              className="mt-3 text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
              style={{ color: "var(--brand-navy)" }}
            >
              {empresa.nome || "—"}
            </h1>

            {/* Descrição curta */}
            <p className="mt-2 max-w-[800px] text-[13px] leading-relaxed text-muted-foreground">
              {descricaoCurta}
            </p>

            {/* Metadados */}
            <div className="mt-5 space-y-1 text-[13px] text-muted-foreground">
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
          </header>
        </div>

        {/* TABS NAV */}
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
