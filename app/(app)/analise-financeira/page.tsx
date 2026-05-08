"use client"

import { useState } from "react"
import { clienteAtual } from "@/lib/clientes/cliente-atual"
import { conteudoAnaliseFinanceira } from "@/lib/conteudos/analise-financeira"
import { AnalysisShell, type TabConfig } from "@/components/analysis-shell"
import SinteseTab from "@/components/analise-financeira/sintese-tab"

const TABS: TabConfig[] = conteudoAnaliseFinanceira.abas.map((a) => ({
  id: a.id,
  numeral: a.num,
  label: a.nome,
}))

export default function AnaliseFinanceiraPage() {
  const [activeTab, setActiveTab] = useState("sintese")
  const hero = clienteAtual.dadosFinanceiros.hero
  const sintese = clienteAtual.dadosFinanceiros.sintese

  return (
    <AnalysisShell
      empresa={{ nome: clienteAtual.empresa?.nome ?? "—" }}
      eyebrow="CFOup · Análise Financeira"
      subtitulo={hero.subTitulo}
      descricao={hero.descricao}
      chips={[
        { label: "EXERCÍCIOS", value: hero.exercicios },
        { label: "COBERTURA", value: hero.cobertura },
        { label: "FONTE", value: hero.fonte },
        { label: "DATA-BASE", value: hero.dataBase },
      ]}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "sintese" && <SinteseTab dados={sintese} />}
      {activeTab !== "sintese" && (
        <section className="op-section">
          <div
            className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
            style={{ background: "linear-gradient(135deg, #071D3B 0%, #0A2647 100%)" }}
          >
            <h2
              className="m-0 text-[22px] font-medium tracking-[-0.005em] text-white"
              style={{ fontFamily: "var(--cfoup-font-serif)" }}
            >
              {TABS.find((t) => t.id === activeTab)?.label ?? "—"}
            </h2>
          </div>
          <div className="p-7" style={{ background: "#FFFFFF" }}>
            <p className="text-center text-muted-foreground">Em construção</p>
          </div>
        </section>
      )}
    </AnalysisShell>
  )
}
