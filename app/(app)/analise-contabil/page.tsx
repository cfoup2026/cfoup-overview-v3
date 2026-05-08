"use client"

import { useState, type ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { AnalysisShell, type TabConfig } from "@/components/analysis-shell"
import {
  type AnaliseContabilData,
  dadosCliente,
} from "@/lib/clientes/empresa-001"
import { conteudoSintese } from "@/lib/conteudos/analise-contabil"
import { DRETab } from "@/components/dre-tab"
import { BPTab } from "@/components/bp-tab"
import { IndicadoresTab } from "@/components/indicadores-tab"
import { AoContadorTab } from "@/components/ao-contador-tab"
import { GlossarioTab } from "@/components/glossario-tab"
import { ConclusaoTab } from "@/components/conclusao-tab"
import { TabHeaderCard } from "@/components/tab-header-card"

// ---------------------------------------------------------------------
// Tabs config
// ---------------------------------------------------------------------
const TABS: TabConfig[] = [
  { id: "sintese", numeral: "01", label: "Síntese Executiva" },
  { id: "dre", numeral: "02", label: "DRE" },
  { id: "balanco", numeral: "03", label: "BP" },
  { id: "indicadores", numeral: "04", label: "Indicadores" },
  { id: "perguntas-contador", numeral: "05", label: "Ao Contador" },
  { id: "glossario", numeral: "06", label: "Glossário" },
  { id: "conclusao", numeral: "07", label: "Conclusão" },
]

// ---------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------
export default function AnaliseContabilPage() {
  const data: AnaliseContabilData = dadosCliente
  const [activeTab, setActiveTab] = useState("sintese")

  return (
    <AnalysisShell
      empresa={{ nome: data.empresa.nome }}
      eyebrow="CFOup · Análise Contábil"
      chips={[
        { label: "EXERCÍCIOS", value: data.periodos.join(" · ") },
        { label: "CNPJ", value: data.empresa.cnpj },
        { label: "REGIME", value: data.empresa.regime },
        { label: "EMITIDO EM", value: data.emitidoEm },
      ]}
      subtitulo="Demonstração do Resultado · Balanço Patrimonial"
      descricao={`Análise do DRE e do Balanço Patrimonial de ${data.periodos.join(", ")} para embasar as próximas decisões financeiras da empresa.`}
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "sintese" && <SinteseExecutiva data={data.sintese} />}
      {activeTab === "dre" && <DRETab data={data.dre} />}
      {activeTab === "balanco" && <BPTab dados={data.balanco} />}
      {activeTab === "indicadores" && <IndicadoresTab dados={data.indicadores} />}
      {activeTab === "perguntas-contador" && <AoContadorTab dados={data.aoContador} />}
      {activeTab === "glossario" && <GlossarioTab />}
      {activeTab === "conclusao" && <ConclusaoTab dados={data.conclusao} />}
    </AnalysisShell>
  )
}

// ---------------------------------------------------------------------
// Helper: converte **trecho** em <strong>trecho</strong> inline
// ---------------------------------------------------------------------
function renderBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{part}</strong> : part
  )
}

// ---------------------------------------------------------------------
// Síntese Executiva
// ---------------------------------------------------------------------
type SinteseData = AnaliseContabilData["sintese"]

// KPI border colors by index
const KPI_BORDER_COLORS = [
  "var(--brand-green)",   // Quanto vendeu
  "var(--brand-green)",   // Lucro 2025
  "var(--brand-green)",   // Lucro por R$100
  "var(--brand-warning)", // Patrimônio em banco
  "var(--brand-blue)",    // Liquidez
]

function SinteseExecutiva({ data }: { data: SinteseData }) {
  return (
    <section>
      {/* Intro */}
      <TabHeaderCard titulo="Síntese Executiva" intro={data.intro} />

      {/* ============================================================ */}
      {/* SYNTHESIS — caixa navy com 3 colunas                          */}
      {/* ============================================================ */}
      <div
        className="my-6 rounded-2xl p-9 md:p-10"
        style={{ background: "#071D3B" }}
      >
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#38B8E8]">
          Os três fatos que importam
        </p>
        <h3
          className="mb-1.5 text-[22px] font-medium leading-tight tracking-[-0.005em] text-white"
          style={{ fontFamily: "var(--cfoup-font-serif)" }}
        >
          O que o DRE e o Balanço mostram juntos
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
          {data.fatos.map((fato) => (
            <div key={fato.numero}>
              <h4 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#38B8E8]">
                {fato.numero} · {fato.titulo}
              </h4>
              <p className="text-[13.5px] leading-[1.65] text-[#C8D4E5]">
                {renderBold(fato.corpo)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Botão Chat CFOup */}
      <div className="mt-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[13px] font-semibold transition hover:bg-muted/40"
          style={{ color: "var(--brand-blue)" }}
        >
          Pergunte ao Chat CFOup
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* ============================================================ */}
      {/* KPIs — 5 cards com border-left colorida                       */}
      {/* ============================================================ */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
        {data.kpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            className="relative flex min-h-[180px] flex-col overflow-hidden rounded-xl border border-border bg-card p-5"
          >
            {/* Border-left colorida */}
            <span
              className="absolute left-0 top-0 h-full w-[3px]"
              style={{ background: KPI_BORDER_COLORS[idx] || "var(--brand-blue)" }}
            />
            <p className="mb-3 min-h-[28px] text-[10.5px] font-semibold uppercase leading-tight tracking-[0.1em] text-muted-foreground">
              {kpi.label}
            </p>
            <p
              className="mb-2.5 text-[26px] font-medium leading-[1.05] tracking-[-0.01em] tabular-nums"
              style={{ fontFamily: "var(--cfoup-font-serif)", color: "var(--brand-navy)" }}
            >
              {kpi.valor}
            </p>
            <p className="mt-auto text-[11.5px] leading-[1.5] text-muted-foreground">
              {kpi.comentario}
            </p>
          </div>
        ))}
      </div>

      {/* Como usar */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
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
              {renderBoldNavy(data.comoUsar.navegacao)}
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
              {renderBoldNavy(data.comoUsar.oQueAnalisamos)}
            </p>
          </div>
        </div>
      </div>

      {/* Glossário */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
        <details>
          <summary
            className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Glossário · Termos usados na Síntese Executiva +
          </summary>
          <dl className="mt-3 space-y-3">
            {conteudoSintese.glossario.map((item) => (
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
      </div>
    </section>
  )
}

// Helper para renderBold em contexto claro (navy em vez de white)
function renderBoldNavy(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold" style={{ color: "var(--brand-navy)" }}>{part}</strong> : part
  )
}
