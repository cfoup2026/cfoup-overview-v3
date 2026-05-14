"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { clienteAtual } from "@/lib/clientes/cliente-atual"
import { AnalysisShell, type TabConfig } from "@/components/analysis-shell"
import SinteseTab from "@/components/analise-financeira/sintese-tab"
import { FaturamentoTab } from "@/components/analise-financeira/faturamento-tab"
import { ClientesTab } from "@/components/analise-financeira/clientes-tab"
import { AuditoriaTab } from "@/components/analise-financeira/auditoria-tab"
import { FornecedoresTab } from "@/components/analise-financeira/fornecedores-tab"
import { CaixaTab } from "@/components/analise-financeira/caixa-tab"
import { CicloTab } from "@/components/analise-financeira/ciclo-tab"
import { ChecklistMensalTab } from "@/components/analise-financeira/checklist-mensal-tab"

const TABS: TabConfig[] = [
  { id: "sintese", numeral: "01", label: "Síntese" },
  { id: "caixa", numeral: "02", label: "Caixa" },
  { id: "clientes", numeral: "03", label: "Clientes" },
  { id: "faturamento", numeral: "04", label: "Faturamento" },
  { id: "fornecedores", numeral: "05", label: "Fornecedores" },
  { id: "ciclo", numeral: "06", label: "Ciclo Financeiro" },
  { id: "auditoria", numeral: "07", label: "Auditoria" },
  { id: "checklist", numeral: "08", label: "Checklist Mensal" },
]

// Map query param values (including variations) to valid tab IDs
function resolveTabFromParam(param: string | null): string {
  if (!param) return "sintese"
  const normalized = param.toLowerCase().trim()
  const mapping: Record<string, string> = {
    sintese: "sintese",
    síntese: "sintese",
    caixa: "caixa",
    clientes: "clientes",
    cliente: "clientes",
    faturamento: "faturamento",
    fornecedores: "fornecedores",
    fornecedor: "fornecedores",
    ciclo: "ciclo",
    auditoria: "auditoria",
    checklist: "checklist",
  }
  return mapping[normalized] || "sintese"
}

export default function AnaliseFinanceiraPage() {
  return (
    <Suspense fallback={null}>
      <AnaliseFinanceiraContent />
    </Suspense>
  )
}

function AnaliseFinanceiraContent() {
  const searchParams = useSearchParams()
  const abaParam = searchParams.get("aba")
  const [activeTab, setActiveTab] = useState(() => resolveTabFromParam(abaParam))

  // Sync tab when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const resolved = resolveTabFromParam(abaParam)
    setActiveTab(resolved)
  }, [abaParam])
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
      {activeTab === "checklist" && <ChecklistMensalTab dados={dados.checklistMensal} />}
    </AnalysisShell>
  )
}
