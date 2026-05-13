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
      <div className="sticky top-0 z-20 -mx-8 bg-background md:-mx-10 lg:-mx-12">
        <div className="px-8 pt-4 md:px-10 lg:px-12">
          {/* HERO — card visual */}
          <header className="rounded-2xl border border-border bg-hero-gradient p-6 md:p-8">
          {/* Brand text (eyebrow + subtitulo) */}
          <div className="mb-6">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand-blue)" }}
            >
              {eyebrow}
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {subtitulo}
            </p>
          </div>

          {/* H1 */}
          <h1
            className="mb-2 text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            {empresa.nome}
          </h1>

          {/* Descrição */}
          <p className="mb-5 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">
            {descricao}
          </p>

          {/* Chips */}
          <div className="flex flex-wrap gap-6">
            {chips.map((c, idx) => (
              <div key={idx}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  {c.label}
                </p>
                <p className="mt-1 text-[13px] font-medium" style={{ color: "var(--brand-navy)" }}>
                  {c.value}
                </p>
              </div>
            ))}
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
