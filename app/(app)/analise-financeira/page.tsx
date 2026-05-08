"use client"

import { useState } from "react"
import { clienteAtual } from "@/lib/clientes/cliente-atual"
import { conteudoAnaliseFinanceira } from "@/lib/conteudos/analise-financeira"
import { AnalysisShell, type TabConfig } from "@/components/analysis-shell"
import SinteseTab from "@/components/analise-financeira/sintese-tab"
import { FaturamentoTab } from "@/components/analise-financeira/faturamento-tab"
import { ClientesTab } from "@/components/analise-financeira/clientes-tab"
import { AuditoriaTab } from "@/components/analise-financeira/auditoria-tab"
import { FornecedoresTab } from "@/components/analise-financeira/fornecedores-tab"
import { CaixaTab } from "@/components/analise-financeira/caixa-tab"
import { CicloTab } from "@/components/analise-financeira/ciclo-tab"
import { ChecklistTab } from "@/components/analise-financeira/checklist-tab"

const TABS: TabConfig[] = conteudoAnaliseFinanceira.abas.map((a) => ({
  id: a.id,
  numeral: a.num,
  label: a.nome,
}))

export default function AnaliseFinanceiraPage() {
  const [activeTab, setActiveTab] = useState("sintese")
  const dados = clienteAtual.dadosFinanceiros
  const hero = dados.hero

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
      {activeTab === "sintese" && <SinteseTab dados={dados.sintese} />}
      {activeTab === "faturamento" && <FaturamentoTab dados={dados.faturamento} />}
      {activeTab === "clientes" && <ClientesTab dados={dados.clientes} />}
      {activeTab === "auditoria" && <AuditoriaTab dados={dados.auditoria} />}
      {activeTab === "fornecedores" && <FornecedoresTab dados={dados.fornecedores} />}
      {activeTab === "caixa" && <CaixaTab dados={dados.caixa} />}
      {activeTab === "ciclo" && <CicloTab dados={dados.ciclo} />}
      {activeTab === "checklist" && <ChecklistTab />}
    </AnalysisShell>
  )
}
