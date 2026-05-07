"use client"

import { useState, type ReactNode } from "react"
import {
  type AnaliseContabilData,
  gregoruttData,
} from "@/lib/mocks/analise-contabil-gregorutt"

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
// Tabs config
// ---------------------------------------------------------------------
const TABS = [
  { id: "sintese", numeral: "01", label: "Síntese Executiva" },
  { id: "dre", numeral: "02", label: "DRE" },
  { id: "balanco", numeral: "03", label: "Balanço Patrimonial" },
  { id: "indicadores", numeral: "04", label: "Indicadores" },
  { id: "perguntas-contador", numeral: "05", label: "Perguntas ao Contador" },
  { id: "glossario", numeral: "06", label: "Glossário" },
  { id: "conclusao", numeral: "07", label: "Conclusão" },
] as const

type TabId = (typeof TABS)[number]["id"]

// ---------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------
export default function AnaliseContabilPage() {
  const data: AnaliseContabilData = gregoruttData
  const [activeTab, setActiveTab] = useState<TabId>("sintese")

  return (
    <div
      className="mx-auto max-w-[1340px] px-8 py-10"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* ============================================================ */}
      {/* HEADER                                                        */}
      {/* ============================================================ */}
      <header>
        <p className="text-sm tracking-wide" style={{ color: "var(--brand-blue)" }}>
          CFOup · Análise Contábil
        </p>
        <p className="text-sm" style={{ color: "var(--slate-500)" }}>
          Demonstração do Resultado · Balanço Patrimonial
        </p>
        <h1 className="mt-2 text-4xl font-bold" style={{ color: "var(--brand-navy)" }}>
          {data.empresa.nome}
        </h1>
        <p className="mt-3 max-w-3xl" style={{ color: "var(--slate-600)" }}>
          Análise do DRE e do Balanço Patrimonial de{" "}
          {data.periodos.join(", ")} para embasar as próximas decisões
          financeiras da empresa.
        </p>

        {/* Chips */}
        <div className="mt-6 flex gap-8">
          <Chip label="EXERCÍCIOS" value={data.periodos.join(" · ")} />
          <Chip label="CNPJ" value={data.empresa.cnpj} />
          <Chip label="REGIME" value={data.empresa.regime} />
          <Chip label="EMITIDO EM" value={data.emitidoEm} />
        </div>
      </header>

      {/* ============================================================ */}
      {/* SUB-TABS NAV (sticky)                                         */}
      {/* ============================================================ */}
      <nav
        className="sticky top-0 z-10 -mx-8 mt-10 border-b bg-white px-8"
        style={{ borderColor: "var(--slate-200)" }}
      >
        <div className="flex gap-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="py-4 font-medium transition-colors"
                style={{
                  borderBottom: isActive ? "2px solid var(--brand-blue)" : "2px solid transparent",
                  color: isActive ? "var(--brand-navy)" : "var(--slate-500)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span className="mr-2 text-xs" style={{ color: "var(--slate-400)" }}>
                  {tab.numeral}
                </span>
                <span className="text-sm">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* ============================================================ */}
      {/* TAB CONTENT                                                   */}
      {/* ============================================================ */}
      {activeTab === "sintese" && <TabSintese data={data} />}
      {activeTab !== "sintese" && (
        <div className="mt-12 text-sm" style={{ color: "var(--slate-400)" }}>
          Em construção · próximo PR.
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------
// Chip helper
// ---------------------------------------------------------------------
function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider" style={{ color: "var(--slate-400)" }}>{label}</p>
      <p className="mt-1 text-base font-semibold" style={{ color: "var(--brand-navy)" }}>{value}</p>
    </div>
  )
}

// ---------------------------------------------------------------------
// Tab Síntese Executiva
// ---------------------------------------------------------------------
function TabSintese({ data }: { data: AnaliseContabilData }) {
  return (
    <section>
      {/* Intro */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold" style={{ color: "var(--brand-navy)" }}>Síntese Executiva</h2>
        <p className="mt-4 max-w-3xl text-lg" style={{ color: "var(--slate-700)" }}>
          {data.sintese.intro}
        </p>
      </div>

      {/* Três fatos */}
      <div className="mt-12">
        <p className="text-sm uppercase tracking-wider" style={{ color: "var(--brand-cyan)" }}>
          Os três fatos que importam
        </p>
        <h3 className="mt-2 text-xl font-semibold" style={{ color: "var(--brand-navy)" }}>
          O que o DRE e o Balanço mostram juntos
        </h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {data.sintese.fatos.map((fato) => (
            <div
              key={fato.numero}
              className="rounded-lg border bg-white p-6"
              style={{ borderColor: "var(--slate-200)" }}
            >
              <p className="text-3xl font-bold" style={{ color: "var(--brand-blue)" }}>{fato.numero}</p>
              <p className="mt-2 text-base font-semibold" style={{ color: "var(--brand-navy)" }}>
                {fato.titulo}
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--slate-600)" }}>
                {renderBold(fato.corpo)}
              </p>
              <p
                className="mt-4 border-t pt-3 text-xs italic"
                style={{ borderColor: "var(--slate-100)", color: "var(--slate-500)" }}
              >
                {fato.chatCfoup}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="mt-12 grid gap-4 md:grid-cols-5">
        {data.sintese.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg p-5" style={{ background: "var(--slate-50)" }}>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--slate-500)" }}>
              {kpi.label}
            </p>
            <p className="mt-2 text-2xl font-bold" style={{ color: "var(--brand-navy)" }}>{kpi.valor}</p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--slate-500)" }}>
              {kpi.comentario}
            </p>
          </div>
        ))}
      </div>

      {/* Como usar este relatório */}
      <div className="mt-16">
        <h3 className="text-xl font-semibold" style={{ color: "var(--brand-navy)" }}>
          Como usar este relatório
        </h3>
        <div className="mt-6 grid gap-12 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-base font-semibold" style={{ color: "var(--brand-navy)" }}>
              Navegação
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "var(--slate-600)" }}>
              {renderBold(data.sintese.comoUsar.navegacao)}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-base font-semibold" style={{ color: "var(--brand-navy)" }}>
              O que analisamos
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "var(--slate-600)" }}>
              {renderBold(data.sintese.comoUsar.oQueAnalisamos)}
            </p>
          </div>
        </div>
      </div>

      {/* Glossário */}
      <details className="mb-16 mt-12">
        <summary className="cursor-pointer list-none text-sm font-semibold" style={{ color: "var(--brand-blue)" }}>
          Glossário · Termos usados na Síntese Executiva +
        </summary>
        <dl className="mt-4 space-y-4">
          {data.sintese.glossario.map((item) => (
            <div key={item.termo}>
              <dt className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
                {item.termo}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed" style={{ color: "var(--slate-600)" }}>
                {item.definicao}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  )
}
