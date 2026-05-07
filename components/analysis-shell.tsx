"use client"

import type { ReactNode } from "react"

// ---------------------------------------------------------------------
// AnalysisShell — reusable header + tabs wrapper for Análise Contábil
// and Análise Financeira. Espelha sizes/weights/cores do header de
// /visao-geral. Tamanhos de texto, pesos e cores seguem o design system
// (Tailwind semântico + CSS vars).
// ---------------------------------------------------------------------

export type TabConfig = {
  id: string
  numeral: string
  label: string
}

export type AnalysisShellProps = {
  empresa: { nome: string; cnpj: string; regime: string }
  periodos: string[]
  emitidoEm: string
  eyebrow: string
  subtitulo: string
  descricao: string
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (id: string) => void
  children: ReactNode
}

export function AnalysisShell({
  empresa,
  periodos,
  emitidoEm,
  eyebrow,
  subtitulo,
  descricao,
  tabs,
  activeTab,
  onTabChange,
  children,
}: AnalysisShellProps) {
  return (
    <>
      {/* ============================================================ */}
      {/* HEADER — envolvido em bloco com bg-hero-gradient              */}
      {/* ============================================================ */}
      <header className="rounded-2xl border border-border bg-hero-gradient p-5 md:p-6">
        {/* Eyebrow */}
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          {eyebrow}
        </p>
        {/* Subtitulo */}
        <p className="text-[12px] text-muted-foreground">{subtitulo}</p>
        {/* H1 */}
        <h1
          className="mt-0.5 text-lg font-extrabold leading-tight md:text-[1.3rem]"
          style={{ color: "var(--brand-navy)" }}
        >
          {empresa.nome}
        </h1>
        {/* Descrição */}
        <p
          className="mt-1.5 max-w-3xl text-[13px] leading-relaxed"
          style={{ color: "var(--slate-700)" }}
        >
          {descricao}
        </p>

        {/* Chips */}
        <div className="mt-4 flex flex-wrap gap-6">
          <Chip label="EXERCÍCIOS" value={periodos.join(" · ")} />
          <Chip label="CNPJ" value={empresa.cnpj} />
          <Chip label="REGIME" value={empresa.regime} />
          <Chip label="EMITIDO EM" value={emitidoEm} />
        </div>
      </header>

      {/* ============================================================ */}
      {/* TABS NAV — sticky abaixo do topbar mobile (56px), top-0 desktop */}
      {/* ============================================================ */}
      <nav className="sticky top-14 z-20 -mx-8 mt-4 border-b border-border bg-background px-8 md:-mx-10 md:px-10 lg:-mx-12 lg:top-0 lg:px-12">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-baseline gap-1.5 rounded-t-md px-2 py-3 transition-colors ${
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

// ---------------------------------------------------------------------
// Chip helper — label + value
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
