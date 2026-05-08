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
      {activeTab === "sintese" && (
        <SinteseTab dados={sintese} conteudo={conteudoAnaliseFinanceira.sintese} />
      )}
      {activeTab !== "sintese" && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Em construção
        </div>
      )}
    </AnalysisShell>
  )
}
