"use client"

import { AnalysisShell } from "@/components/analysis-shell"
import SinteseTab from "@/components/analise-financeira/sintese-tab"
import { clienteAtual } from "@/lib/clientes/cliente-atual"
import { conteudoSintese } from "@/lib/conteudos/analise-financeira"

// ---------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------
export default function AnaliseFinanceiraPage() {
  const data = clienteAtual

  return (
    <AnalysisShell
      empresa={data.empresa}
      periodos={data.periodos}
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
    >
      <SinteseTab
        dados={data.dadosFinanceiros.sintese}
        intro={conteudoSintese.intro}
      />
    </AnalysisShell>
  )
}
