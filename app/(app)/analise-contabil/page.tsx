"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { Plug } from "lucide-react"
import { AnalysisShell, type TabConfig } from "@/components/analysis-shell"
import type { AnaliseContabilData, FontesImportadas } from "@/lib/clientes/empresa-001"
import { dadosClienteVazio } from "@/lib/clientes/empresa-vazia"
import { conteudoSintese } from "@/lib/conteudos/analise-contabil"
import { DRETab } from "@/components/dre-tab"
import { BPTab } from "@/components/bp-tab"
import { IndicadoresTab } from "@/components/indicadores-tab"
import { AoContadorTab } from "@/components/ao-contador-tab"

// ---------------------------------------------------------------------
// Tabs config — matches HTML cfoup-tese
// ---------------------------------------------------------------------
const TABS: TabConfig[] = [
  { id: "sintese", numeral: "01", label: "Síntese" },
  { id: "dre", numeral: "02", label: "DRE" },
  { id: "balanco", numeral: "03", label: "Balanço" },
  { id: "indicadores", numeral: "04", label: "Indicadores" },
  { id: "perguntas-contador", numeral: "05", label: "Ao Contador" },
]

// ---------------------------------------------------------------------
// Regras mínimas de fonte por aba
// ---------------------------------------------------------------------
function canRenderSintese(f: FontesImportadas) {
  return f.dre && f.balanco
}
function canRenderDRE(f: FontesImportadas) {
  return f.dre
}
function canRenderBalanco(f: FontesImportadas) {
  return f.balanco
}
function canRenderIndicadores(f: FontesImportadas) {
  return f.dre && f.balanco
}
function canRenderAoContador(f: FontesImportadas) {
  return f.dre || f.balanco
}

// ---------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------
export default function AnaliseContabilPage() {
  const data: AnaliseContabilData = dadosClienteVazio
  const [activeTab, setActiveTab] = useState("sintese")
  const f = data.fontesImportadas

  return (
    <AnalysisShell
      empresa={{ nome: data.empresa.nome }}
      eyebrow="CFOUP · ANÁLISE CONTÁBIL"
      chips={[
        { label: "PERÍODO ANALISADO", value: data.periodos.length > 0 ? data.periodos.join(" · ") : "—" },
        { label: "REGIME TRIBUTÁRIO", value: data.empresa.regime },
        { label: "FONTES RECEBIDAS", value: data.fontesRecebidas },
        { label: "STATUS DA ANÁLISE", value: data.statusAnalise },
      ]}
      subtitulo="Leitura dos demonstrativos contábeis recebidos."
      descricao=""
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "sintese" && (
        canRenderSintese(f) ? (
          <SinteseExecutiva data={data.sintese} />
        ) : (
          <EmptyTabState message="Conecte os demonstrativos contábeis para iniciar a análise." />
        )
      )}
      {activeTab === "dre" && (
        canRenderDRE(f) ? (
          <DRETab data={data.dre} />
        ) : (
          <EmptyTabState message="Importe a DRE para gerar esta análise." />
        )
      )}
      {activeTab === "balanco" && (
        canRenderBalanco(f) ? (
          <BPTab dados={data.balanco} />
        ) : (
          <EmptyTabState message="Importe o Balanço Patrimonial para gerar esta análise." />
        )
      )}
      {activeTab === "indicadores" && (
        canRenderIndicadores(f) ? (
          <IndicadoresTab dados={data.indicadores} />
        ) : (
          <EmptyTabState message="Importe DRE e Balanço Patrimonial para gerar os indicadores." />
        )
      )}
      {activeTab === "perguntas-contador" && (
        canRenderAoContador(f) ? (
          <AoContadorTab dados={data.aoContador} />
        ) : (
          <EmptyTabState message="Conecte ao menos um demonstrativo contábil para abrir a pauta de alinhamento." />
        )
      )}
    </AnalysisShell>
  )
}

// ---------------------------------------------------------------------
// Empty State — padrão visual consistente com EmptyLiquidezBlock
// ---------------------------------------------------------------------
function EmptyTabState({ message }: { message: string }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Análise indisponível
      </p>
      <p className="mt-3 max-w-xl text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
        {message}
      </p>
      <Link
        href="/conexoes"
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:border-[var(--brand-blue)]/40"
        style={{ color: "var(--brand-navy)" }}
      >
        <Plug className="h-3.5 w-3.5" strokeWidth={2.2} />
        Importar arquivos
      </Link>
    </section>
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
  "var(--brand-warning)",
  "var(--brand-warning)",
]

// ---------------------------------------------------------------------
// Síntese Executiva — replica HTML cfoup-tese fielmente
// ---------------------------------------------------------------------
type SinteseData = AnaliseContabilData["sintese"]

function SinteseExecutiva({ data }: { data: SinteseData }) {
  return (
    <section>
      {/* ============================================================ */}
      {/* RESUMO EXECUTIVO — card padrão                                */}
      {/* ============================================================ */}
      <div
        className="rounded-2xl border border-border p-6 md:p-8"
        style={{ background: "white" }}
      >
        <p className="max-w-[1180px] text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
          {data.intro}
        </p>
      </div>

      {/* ============================================================ */}
      {/* KPIs — 5 cards com border-left colorida                       */}
      {/* ============================================================ */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {data.kpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            className="relative flex min-h-[120px] flex-col overflow-hidden rounded-xl border bg-white px-4 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Border-left colorida */}
            <span
              className="absolute left-0 top-0 h-full w-[3px]"
              style={{ background: KPI_BORDER_COLORS[idx] || "var(--brand-cyan)" }}
            />
            <p className="mb-1.5 min-h-[24px] text-[10px] font-semibold uppercase leading-[1.3] tracking-[0.18em] text-muted-foreground">
              {kpi.label}
            </p>
            <p
              className="mb-1.5 text-lg md:text-[1.3rem] font-extrabold leading-tight tabular-nums"
              style={{ color: "var(--brand-navy)" }}
            >
              {kpi.valor}
            </p>
            <p className="mt-auto text-[11px] leading-snug text-muted-foreground">
              {kpi.comentario}
            </p>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* OS 3 FATOS QUE IMPORTAM — caixa com 3 colunas                  */}
      {/* ============================================================ */}
      <div
        className="mt-6 rounded-2xl border border-border p-6 md:p-8"
        style={{ background: "white" }}
      >
        <p
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Os três fatos que importam
        </p>
        <h3
          className="mb-2 text-base md:text-lg font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          O que o DRE e o Balanço mostram juntos
        </h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-border">
          {data.fatos.map((fato, idx) => (
            <div key={fato.numero} className={idx > 0 ? "pt-6 md:pt-0 md:pl-8" : ""}>
              <h4
                className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-blue)" }}
              >
                {fato.numero} · {fato.titulo}
              </h4>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--brand-navy)" }}
              >
                {renderBoldNavy(fato.corpo)}
              </p>
              {fato.chatCfoup && (
                <em className="mt-3 block text-[12px]" style={{ color: "var(--brand-ink-muted)" }}>
                  Chat CFOup: {fato.chatCfoup}
                </em>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Como usar — card padrão                                       */}
      {/* ============================================================ */}
      <div
        className="mt-6 rounded-2xl border border-border p-6 md:p-8"
        style={{ background: "white" }}
      >
        <p
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Como usar este relatório
        </p>
        <div className="divide-y divide-border">
          <div className="grid gap-4 pb-4 md:grid-cols-[140px_1fr]">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand-blue)" }}
            >
              Navegação
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
              {renderBoldNavy(data.comoUsar.navegacao)}
            </p>
          </div>
          <div className="grid gap-4 pt-4 md:grid-cols-[140px_1fr]">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand-blue)" }}
            >
              O que analisamos
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
              {renderBoldNavy(data.comoUsar.oQueAnalisamos)}
            </p>
          </div>
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
    <div className="mt-14 border-t border-border pt-8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-6 py-4 text-left transition hover:border-[color:var(--brand-cyan)] hover:bg-muted"
      >
        <span className="flex items-center gap-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Glossário
          </span>
          <span
            className="text-[13px] font-semibold"
            style={{ color: "var(--brand-navy)" }}
          >
            Termos usados na {label}
          </span>
        </span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-[16px] leading-none transition-transform ${
            open ? "rotate-45 bg-[color:var(--brand-cyan)] text-white" : "bg-muted text-[color:var(--brand-blue)]"
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden rounded-b-xl border border-t-0 border-border bg-card transition-all ${
          open ? "max-h-[3000px] border-dashed border-t" : "max-h-0 border-transparent"
        }`}
      >
        <div className="px-7 pb-2 pt-6">
          {glossario.map((item) => (
            <div key={item.termo} className="border-b border-border py-4 last:border-b-0">
              <p
                className="mb-1 text-[13px] font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                {item.termo}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
                {item.definicao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
