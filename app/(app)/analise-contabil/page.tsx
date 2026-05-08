"use client"

import { useState, type ReactNode } from "react"
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

// ---------------------------------------------------------------------
// Tabs config — matches HTML cfoup-tese
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

// KPI border colors by index (green, blue, cyan, warn, warn)
const KPI_BORDER_COLORS = [
  "var(--brand-green)",
  "var(--brand-blue)",
  "var(--brand-cyan)",
  "var(--warn)",
  "var(--warn)",
]

// ---------------------------------------------------------------------
// Síntese Executiva — replica HTML cfoup-tese fielmente
// ---------------------------------------------------------------------
type SinteseData = AnaliseContabilData["sintese"]

function SinteseExecutiva({ data }: { data: SinteseData }) {
  return (
    <section>
      {/* H2 + lede */}
      <h2
        className="mb-2 text-[20px] md:text-[26px] font-extrabold tracking-tight leading-tight"
        style={{ color: "var(--brand-navy)" }}
      >
        Síntese Executiva
      </h2>
      <p
        className="mb-8 max-w-[1180px] text-[15.5px] leading-[1.65]"
        style={{ color: "var(--muted-html)" }}
      >
        {data.intro}
      </p>

      {/* ============================================================ */}
      {/* SYNTHESIS — caixa navy com 3 colunas                          */}
      {/* ============================================================ */}
      <div
        className="rounded-[14px] border border-border p-9 md:p-10"
        style={{ background: "white" }}
      >
        <p
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Os três fatos que importam
        </p>
        <h3
          className="mb-1.5 text-base md:text-lg font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          O que o DRE e o Balanço mostram juntos
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
          {data.fatos.map((fato) => (
            <div key={fato.numero}>
              <h4
                className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--brand-blue)" }}
              >
                {fato.numero} · {fato.titulo}
              </h4>
              <p
                className="text-[13.5px] leading-[1.65]"
                style={{ color: "var(--brand-navy)" }}
              >
                {renderBoldNavy(fato.corpo)}
              </p>
              {fato.chatCfoup && (
                <em
                  className="mt-2.5 block text-[12.5px] text-muted-foreground"
                >
                  Chat CFOup: {fato.chatCfoup}
                </em>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* KPIs — 5 cards com border-left colorida                       */}
      {/* ============================================================ */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {data.kpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            className="relative flex min-h-[180px] flex-col overflow-hidden rounded-xl border bg-white p-5"
            style={{ borderColor: "var(--line)" }}
          >
            {/* Border-left colorida */}
            <span
              className="absolute left-0 top-0 h-full w-[3px]"
              style={{ background: KPI_BORDER_COLORS[idx] || "var(--brand-cyan)" }}
            />
            <p
              className="mb-3 min-h-[28px] text-[10.5px] font-semibold uppercase leading-[1.3] tracking-[0.1em]"
              style={{ color: "var(--muted-html)" }}
            >
              {kpi.label}
            </p>
            <p
              className="mb-2.5 text-[20px] md:text-[24px] font-extrabold leading-tight tabular-nums"
              style={{ color: "var(--brand-navy)" }}
            >
              {kpi.valor}
            </p>
            <p
              className="mt-auto text-[11.5px] leading-[1.5]"
              style={{ color: "var(--muted-html)" }}
            >
              {kpi.comentario}
            </p>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* Como usar — notes                                             */}
      {/* ============================================================ */}
      <h3
        className="mb-3 mt-10 text-[17px] font-semibold tracking-[-0.005em]"
        style={{ color: "var(--brand-navy)" }}
      >
        Como usar este relatório
      </h3>
      <div
        className="rounded-xl border bg-white py-2"
        style={{ borderColor: "var(--line)" }}
      >
        <div
          className="grid gap-6 border-b px-7 py-4 md:grid-cols-[140px_1fr]"
          style={{ borderColor: "var(--line)" }}
        >
          <p
            className="pt-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Navegação
          </p>
          <p
            className="text-[14px] leading-[1.65]"
            style={{ color: "#243042" }}
          >
            {renderBoldNavy(data.comoUsar.navegacao)}
          </p>
        </div>
        <div
          className="grid gap-6 px-7 py-4 md:grid-cols-[140px_1fr]"
        >
          <p
            className="pt-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--brand-blue)" }}
          >
            O que analisamos
          </p>
          <p
            className="text-[14px] leading-[1.65]"
            style={{ color: "#243042" }}
          >
            {renderBoldNavy(data.comoUsar.oQueAnalisamos)}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Glossário inline                                              */}
      {/* ============================================================ */}
      <GlossarioInline glossario={conteudoSintese.glossario} label="Síntese Executiva" />
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

// ---------------------------------------------------------------------
// Glossário Inline — accordion fiel ao HTML
// ---------------------------------------------------------------------
function GlossarioInline({
  glossario,
  label,
}: {
  glossario: { termo: string; definicao: string }[]
  label: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-14 border-t pt-8" style={{ borderColor: "var(--line)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-[10px] border bg-white px-6 py-4 text-left transition hover:border-[color:var(--brand-cyan)] hover:bg-[#FAFCFF]"
        style={{ borderColor: "var(--line)" }}
      >
        <span className="flex items-center gap-3">
          <span
            className="text-[10.5px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Glossário
          </span>
          <span
            className="text-[13.5px] font-semibold tracking-[0.02em]"
            style={{ color: "var(--brand-navy)" }}
          >
            Termos usados na {label}
          </span>
        </span>
        <span
          className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[16px] leading-none transition-transform ${
            open ? "rotate-45 bg-[color:var(--brand-cyan)] text-white" : "bg-[#EEF3F9] text-[color:var(--brand-blue)]"
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden rounded-b-[10px] border border-t-0 bg-white transition-all ${
          open ? "max-h-[3000px] border-dashed border-t" : "max-h-0 border-transparent"
        }`}
        style={{ borderColor: open ? "var(--line)" : "transparent" }}
      >
        <div className="px-7 pb-2 pt-6">
          {glossario.map((item) => (
            <div key={item.termo} className="border-b py-3.5 last:border-b-0" style={{ borderColor: "#F0F3F8" }}>
              <p
                className="mb-1 text-[14px] font-semibold tracking-[-0.005em]"
                style={{ color: "var(--brand-navy)" }}
              >
                {item.termo}
              </p>
              <p
                className="text-[13.5px] leading-[1.6]"
                style={{ color: "#3D4D66" }}
              >
                {item.definicao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
