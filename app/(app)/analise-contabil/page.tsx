"use client"

import { useState, type ReactNode } from "react"
import { AnalysisShell, type TabConfig } from "@/components/analysis-shell"
import {
  type AnaliseContabilData,
  gregoruttData,
} from "@/lib/mocks/analise-contabil-gregorutt"

// ---------------------------------------------------------------------
// Tabs config
// ---------------------------------------------------------------------
const TABS: TabConfig[] = [
  { id: "sintese", numeral: "01", label: "Síntese Executiva" },
  { id: "dre", numeral: "02", label: "DRE" },
  { id: "balanco", numeral: "03", label: "Balanço Patrimonial" },
  { id: "indicadores", numeral: "04", label: "Indicadores" },
  { id: "perguntas-contador", numeral: "05", label: "Perguntas ao Contador" },
  { id: "glossario", numeral: "06", label: "Glossário" },
  { id: "conclusao", numeral: "07", label: "Conclusão" },
]

// ---------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------
export default function AnaliseContabilPage() {
  const data: AnaliseContabilData = gregoruttData
  const [activeTab, setActiveTab] = useState("sintese")

  return (
    <AnalysisShell
      empresa={data.empresa}
      periodos={data.periodos}
      emitidoEm={data.emitidoEm}
      eyebrow="CFOup · Análise Contábil"
      subtitulo="Demonstração do Resultado · Balanço Patrimonial"
      descricao={`Análise do DRE e do Balanço Patrimonial de ${data.periodos.join(", ")} para embasar as próximas decisões financeiras da empresa.`}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "sintese" && <SinteseExecutiva data={data.sintese} />}
      {activeTab !== "sintese" && (
        <div className="text-[12px] text-muted-foreground">
          Em construção · próximo PR.
        </div>
      )}
    </AnalysisShell>
  )
}

// ---------------------------------------------------------------------
// Helper: converte **trecho** em <strong>trecho</strong> inline
// ---------------------------------------------------------------------
function renderBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// ---------------------------------------------------------------------
// Síntese Executiva
// ---------------------------------------------------------------------
type SinteseData = AnaliseContabilData["sintese"]

function SinteseExecutiva({ data }: { data: SinteseData }) {
  return (
    <section>
      {/* Intro */}
      <div>
        <h2
          className="text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          Síntese Executiva
        </h2>
        <p
          className="mt-1.5 max-w-3xl text-[13px] leading-relaxed"
          style={{ color: "var(--slate-700)" }}
        >
          {data.intro}
        </p>
      </div>

      {/* Três fatos */}
      <div className="mt-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Os três fatos que importam
        </p>
        <h3
          className="mt-0.5 text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          O que o DRE e o Balanço mostram juntos
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {data.fatos.map((fato) => (
            <div
              key={fato.numero}
              className="rounded-2xl border border-border bg-card p-4 md:p-5"
            >
              <p
                className="text-[1.25rem] font-extrabold leading-none"
                style={{ color: "var(--brand-blue)" }}
              >
                {fato.numero}
              </p>
              <p
                className="mt-2 text-[13px] font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                {fato.titulo}
              </p>
              <p
                className="mt-2 text-[13px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {renderBold(fato.corpo)}
              </p>
              <p className="mt-3 border-t border-border pt-3 text-[11px] italic text-muted-foreground">
                {fato.chatCfoup}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {data.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {kpi.label}
            </p>
            <p
              className="mt-2 text-[1.25rem] font-extrabold leading-none tabular-nums"
              style={{ color: "var(--brand-navy)" }}
            >
              {kpi.valor}
            </p>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              {kpi.comentario}
            </p>
          </div>
        ))}
      </div>

      {/* Como usar */}
      <div className="mt-8">
        <h3
          className="text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          Como usar este relatório
        </h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h4
              className="mb-1.5 text-[13px] font-semibold"
              style={{ color: "var(--brand-navy)" }}
            >
              Navegação
            </h4>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--slate-700)" }}
            >
              {renderBold(data.comoUsar.navegacao)}
            </p>
          </div>
          <div>
            <h4
              className="mb-1.5 text-[13px] font-semibold"
              style={{ color: "var(--brand-navy)" }}
            >
              O que analisamos
            </h4>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--slate-700)" }}
            >
              {renderBold(data.comoUsar.oQueAnalisamos)}
            </p>
          </div>
        </div>
      </div>

      {/* Glossário */}
      <details className="mb-6 mt-6">
        <summary
          className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Glossário · Termos usados na Síntese Executiva +
        </summary>
        <dl className="mt-3 space-y-3">
          {data.glossario.map((item) => (
            <div key={item.termo}>
              <dt
                className="text-[13px] font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                {item.termo}
              </dt>
              <dd
                className="mt-1 text-[13px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {item.definicao}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  )
}
