"use client"

import { useEffect, type ReactNode } from "react"
import { CfoupLogo } from "@/components/cfoup-logo"

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
      {/* HERO — fundo navy gradient, NÃO sticky                        */}
      {/* ============================================================ */}
      <header
        className="-mx-8 rounded-2xl px-8 py-10 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12"
        style={{
          background: "linear-gradient(135deg, #071D3B 0%, #0A2647 60%, #0E3A6B 100%)",
        }}
      >
        {/* Linha topo: logo + divider + brand text */}
        <div className="mb-8 flex items-center gap-5">
          <CfoupLogo
            className="h-14 w-auto md:h-[72px]"
            style={{ mixBlendMode: "screen", filter: "brightness(1.05)" }}
          />
          <div className="border-l border-white/[0.18] pl-5">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "#38B8E8" }}
            >
              {eyebrow}
            </p>
            <p
              className="mt-0.5 text-[13px]"
              style={{ color: "#B8C8DC" }}
            >
              {subtitulo}
            </p>
          </div>
        </div>

        {/* H1 */}
        <h1
          className="mb-3 text-[30px] leading-[1.1] tracking-[-0.015em] text-white md:text-[44px]"
          style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500 }}
        >
          {empresa.nome}
        </h1>

        {/* Descrição */}
        <p
          className="mb-7 max-w-[1180px] text-[14px] font-light leading-[1.55] md:text-[16px]"
          style={{ color: "#B8C8DC" }}
        >
          {descricao}
        </p>

        {/* Chips */}
        <div className="flex flex-wrap gap-8">
          {chips.map((c, idx) => (
            <div key={idx}>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: "#8FA3BD" }}
              >
                {c.label}
              </p>
              <p className="mt-0.5 text-[14px] font-medium text-white">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* ============================================================ */}
      {/* TABS NAV — sticky top:0                                        */}
      {/* ============================================================ */}
      <nav className="sticky top-0 z-20 -mx-8 border-b border-border bg-background px-8 md:-mx-10 md:px-10 lg:-mx-12 lg:px-12">
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

      {/* ============================================================ */}
      {/* CONTENT                                                        */}
      {/* ============================================================ */}
      <div className="mt-6">{children}</div>
    </>
  )
}
