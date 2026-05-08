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
    <>
      {/* ============================================================ */}
      {/* STICKY WRAPPER — hero card + tab nav fixos no topo            */}
      {/* ============================================================ */}
      <div
        className="sticky top-14 z-20 lg:top-0"
        style={{ background: "var(--cfoup-bg)", borderBottom: "1px solid var(--cfoup-line)" }}
      >
        {/* ============================================================ */}
        {/* HEADER — hero card com gradient navy                         */}
        {/* ============================================================ */}
        <div
          className="text-white"
          style={{ background: "linear-gradient(135deg, var(--cfoup-navy) 0%, var(--cfoup-navy-light) 100%)" }}
        >
          <div className="mx-auto max-w-[1340px] px-6 py-6">
            {/* Eyebrow line 1 */}
            <div
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "var(--cfoup-cyan)" }}
            >
              {conteudo.hero.eyebrow}
            </div>
            {/* Eyebrow line 2 */}
            <div className="mt-1 text-[11px] uppercase tracking-wider text-white/60">
              {conteudo.hero.subEyebrow}
            </div>
            {/* H1 */}
            <h1
              className="mt-3 text-[30px] md:text-[44px]"
              style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500 }}
            >
              {cliente.nome}
            </h1>
            {/* Subtítulo */}
            <p
              className="mt-2 text-[14px] text-white/80 md:text-[15px]"
              style={{ fontFamily: "var(--cfoup-font-sans)" }}
            >
              {conteudo.hero.subtitulo}
            </p>

            {/* Meta chips */}
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <MetaChip label={conteudo.hero.metaLabels.exercicios} value={hero.exercicios} />
              <MetaChip label={conteudo.hero.metaLabels.dataBase} value={hero.dataBase} />
              <MetaChip label={conteudo.hero.metaLabels.nfsAnalisadas} value={hero.nfsAnalisadas} />
              <MetaChip label={conteudo.hero.metaLabels.setor} value={hero.setor} />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TABS NAV                                                      */}
        {/* ============================================================ */}
        <div className="border-t bg-white" style={{ borderColor: "var(--cfoup-line)" }}>
          <div className="mx-auto max-w-[1340px] overflow-x-auto px-6">
            <div className="flex gap-1 whitespace-nowrap">
              {conteudo.abas.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-3 py-3 text-[12px]"
                    style={{
                      borderBottom: isActive
                        ? "2px solid var(--cfoup-blue)"
                        : "2px solid transparent",
                      color: isActive ? "var(--cfoup-navy)" : "var(--cfoup-muted)",
                    }}
                  >
                    <span
                      className="mr-1"
                      style={{ color: "var(--cfoup-blue)", fontWeight: 700 }}
                    >
                      {tab.num}
                    </span>
                    {tab.nome}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CONTENT                                                        */}
      {/* ============================================================ */}
      <main className="min-h-screen" style={{ background: "var(--cfoup-bg)" }}>
        <div className="mx-auto max-w-[1340px] px-6 py-8">
          {activeTab === "sintese" && (
            <SinteseTab dados={sintese} conteudo={conteudo.sintese} />
          )}
          {activeTab !== "sintese" && (
            <div
              className="rounded-[12px] border bg-white p-8 text-center"
              style={{ borderColor: "var(--cfoup-line)", color: "var(--cfoup-muted)" }}
            >
              Em construção
            </div>
          )}
        </div>
      </main>
    </>
  )
}

// ---------------------------------------------------------------------
// MetaChip helper
// ---------------------------------------------------------------------
function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="text-[11px] uppercase tracking-wider"
        style={{ color: "var(--cfoup-cyan)" }}
      >
        {label}
      </div>
      <div className="mt-0.5 text-[14px] font-medium text-white">{value}</div>
    </div>
  )
}
