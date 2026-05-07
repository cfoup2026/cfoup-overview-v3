"use client"

import { useState, useEffect } from "react"
import type { AnaliseFinanceiraDados } from "@/lib/types/analise-financeira"
import { conteudoAnaliseFinanceira } from "@/lib/conteudos/analise-financeira"
import SinteseTab from "./sintese-tab"

// ---------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------
type ClienteComFinanceiro = {
  nome: string
  dadosFinanceiros: AnaliseFinanceiraDados
}

type Props = {
  cliente: ClienteComFinanceiro
  conteudo: typeof conteudoAnaliseFinanceira
}

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------
export default function AnaliseFinanceiraShell({ cliente, conteudo }: Props) {
  const [activeTab, setActiveTab] = useState("sintese")

  // Reset scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }, [activeTab])

  const { hero, sintese } = cliente.dadosFinanceiros

  return (
    <div className="mx-auto max-w-[1340px] px-6">
      {/* ============================================================ */}
      {/* STICKY WRAPPER — hero card + tab nav fixos no topo            */}
      {/* ============================================================ */}
      <div className="sticky top-14 z-20 -mx-6 bg-background px-6 lg:top-0">
        {/* ============================================================ */}
        {/* HEADER — hero card com bg-hero-gradient                      */}
        {/* ============================================================ */}
        <header className="rounded-2xl border border-border bg-hero-gradient p-5 md:p-6">
          {/* Eyebrow line 1 */}
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--brand-blue)" }}
          >
            {conteudo.hero.eyebrow}
          </p>
          {/* Eyebrow line 2 */}
          <p className="text-[12px] text-muted-foreground">
            {conteudo.hero.subEyebrow}
          </p>
          {/* H1 */}
          <h1
            className="mt-0.5 text-lg font-extrabold leading-tight md:text-[1.3rem]"
            style={{ color: "var(--brand-navy)" }}
          >
            {cliente.nome}
          </h1>
          {/* Subtítulo */}
          <p
            className="mt-1.5 max-w-3xl text-[13px] leading-relaxed"
            style={{ color: "var(--slate-700)" }}
          >
            {conteudo.hero.subtitulo}
          </p>

          {/* Meta chips */}
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Chip label={conteudo.hero.metaLabels.exercicios} value={hero.exercicios} />
            <Chip label={conteudo.hero.metaLabels.dataBase} value={hero.dataBase} />
            <Chip label={conteudo.hero.metaLabels.nfsAnalisadas} value={hero.nfsAnalisadas} />
            <Chip label={conteudo.hero.metaLabels.setor} value={hero.setor} />
          </div>
        </header>

        {/* ============================================================ */}
        {/* TABS NAV                                                      */}
        {/* ============================================================ */}
        <nav className="mt-4 border-b border-border">
          <div className="flex gap-1 overflow-x-auto">
            {conteudo.abas.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-baseline gap-1.5 rounded-t-md px-3 py-3 transition-colors ${
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
                    className="text-[10px] font-bold"
                    style={{ color: "var(--brand-blue)" }}
                  >
                    {tab.num}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {tab.nome}
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
      <div className="py-8">
        {activeTab === "sintese" && (
          <SinteseTab dados={sintese} conteudo={conteudo.sintese} />
        )}
        {activeTab !== "sintese" && (
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <p className="text-[13px] text-muted-foreground">
              Em construção · próximo PR.
            </p>
          </div>
        )}
      </div>
    </div>
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
