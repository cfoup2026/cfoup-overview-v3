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

export type AnalysisShellProps = {
  empresa: { nome: string }
  eyebrow: string
  subtitulo: string
  descricao: string
  chips: { label: string; value: string }[]
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (id: string) => void
  children: ReactNode
}

export function AnalysisShell({
  empresa,
  eyebrow,
  subtitulo,
  descricao,
  chips,
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
      <div className="sticky top-0 z-20 -mx-8 md:-mx-10 lg:-mx-12">
        {/* HERO — fundo navy gradient */}
        <header className="rounded-t-2xl bg-hero-gradient px-8 py-8 md:px-10 md:py-10 lg:px-12">
          {/* Brand text (eyebrow + subtitulo) */}
          <div className="mb-6">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand-blue)" }}
            >
              {eyebrow}
            </p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {subtitulo}
            </p>
          </div>

          {/* H1 */}
          <h1
            className="mb-2 text-[26px] leading-[1.1] tracking-[-0.015em] md:text-[36px]"
            style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-navy)" }}
          >
            {empresa.nome}
          </h1>

          {/* Descrição */}
          <p
            className="mb-5 max-w-[1180px] text-[13px] font-light leading-[1.55] md:text-[14px]"
            style={{ color: "var(--slate-700)" }}
          >
            {descricao}
          </p>

          {/* Chips */}
          <div className="flex flex-wrap gap-6">
            {chips.map((c, idx) => (
              <div key={idx}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  {c.label}
                </p>
                <p className="mt-0.5 text-[13px] font-medium" style={{ color: "var(--brand-navy)" }}>
                  {c.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* TABS NAV */}
        <nav className="border-b border-border bg-background px-8 md:px-10 lg:px-12">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-baseline gap-1.5 whitespace-nowrap rounded-t-md px-2 py-3 transition-colors ${
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
      <div className="mt-6">{children}</div>
    </>
  )
}
