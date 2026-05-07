"use client"

import { useState, type ReactNode } from "react"
import {
  TrendingUp,
  Wallet,
  Coins,
  ArrowUpRight,
  AlertTriangle,
  Info,
  ChevronRight,
} from "lucide-react"
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
      {activeTab === "dre" && <DRETab data={data.dre} />}
      {activeTab === "balanco" && <BPTab dados={data.balanco} />}
      {activeTab === "indicadores" && <IndicadoresTab dados={data.indicadores} />}
      {activeTab === "perguntas-contador" && <AoContadorTab dados={data.aoContador} />}
      {activeTab === "glossario" && <GlossarioTab />}
      {activeTab !== "sintese" && activeTab !== "dre" && activeTab !== "balanco" && activeTab !== "indicadores" && activeTab !== "perguntas-contador" && activeTab !== "glossario" && (
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

// Fato icons config: 01 ganha mais, 02 dinheiro parado, 03 lucro não tirado
const FATO_ICONS = [
  { Icon: TrendingUp, color: "var(--brand-green-dark)", bg: "rgba(54,186,88,0.18)" },
  { Icon: Wallet, color: "#b45309", bg: "rgba(234,179,8,0.12)" },
  { Icon: Coins, color: "var(--brand-blue)", bg: "rgba(21,103,200,0.10)" },
]

// KPI icons config (by index)
const KPI_ICONS = [
  { Icon: ArrowUpRight, color: "var(--brand-green-dark)", bg: "rgba(54,186,88,0.18)" }, // Quanto vendeu
  { Icon: ArrowUpRight, color: "var(--brand-green-dark)", bg: "rgba(54,186,88,0.18)" }, // Lucro de 2025
  { Icon: TrendingUp, color: "var(--brand-green-dark)", bg: "rgba(54,186,88,0.18)" },  // Lucro por R$100
  { Icon: AlertTriangle, color: "#b45309", bg: "rgba(234,179,8,0.12)" },                // Do patrimônio em banco
  { Icon: Info, color: "var(--brand-blue)", bg: "rgba(21,103,200,0.10)" },              // Liquidez Corrente
]

function SinteseExecutiva({ data }: { data: SinteseData }) {
  return (
    <section>
      {/* Intro */}
      <TabHeaderCard titulo="Síntese Executiva" intro={data.intro} />

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
          {data.fatos.map((fato, idx) => {
            const fatoConfig = FATO_ICONS[idx] || FATO_ICONS[0]
            return (
              <button
                key={fato.numero}
                type="button"
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md md:p-5"
              >
                {/* Conteúdo principal — flex-1 pra empurrar footer pro rodapé */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{ background: fatoConfig.bg }}
                    >
                      <fatoConfig.Icon size={18} style={{ color: fatoConfig.color }} />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {fato.numero}
                    </span>
                  </div>
                  <p
                    className="mt-3 text-[13px] font-semibold"
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
                </div>
                {/* Footer CTA — mt-auto garante posição no rodapé */}
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[12px] text-foreground">
                    {fato.chatCfoup}
                  </span>
                  <ChevronRight size={16} style={{ color: "var(--brand-blue)" }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {data.kpis.map((kpi, idx) => {
          const kpiConfig = KPI_ICONS[idx] || KPI_ICONS[0]
          return (
            <div
              key={kpi.label}
              className="relative rounded-2xl border border-border bg-card p-4"
            >
              <span
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: kpiConfig.bg }}
              >
                <kpiConfig.Icon size={14} style={{ color: kpiConfig.color }} />
              </span>
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
          )
        })}
      </div>

      {/* Card de ação */}
      <div className="mt-6 rounded-2xl bg-brand-gradient p-4 text-white md:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
          AÇÃO
        </p>
        <h3 className="mt-1 text-base font-extrabold leading-tight md:text-[1.1rem]">
          Quer entender o que esses números dizem pro próximo passo?
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-white/85">
          Pergunte ao Chat CFOup. Ele tem o DRE, o Balanço e os 3 anos da empresa em mãos pra responder o que importa pro dono.
        </p>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-white/20"
        >
          Abrir Chat CFOup
          <ChevronRight size={14} />
        </button>
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
    </section>
  )
}
