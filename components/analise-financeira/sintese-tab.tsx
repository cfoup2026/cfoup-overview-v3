"use client"

import { ArrowUpRight, AlertTriangle, Info } from "lucide-react"
import type { SinteseDados } from "@/lib/types/analise-financeira"
import type { conteudoAnaliseFinanceira } from "@/lib/conteudos/analise-financeira"

// ---------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------
type Props = {
  dados: SinteseDados
  conteudo: typeof conteudoAnaliseFinanceira.sintese
}

// ---------------------------------------------------------------------
// KPI icon config by subTone
// ---------------------------------------------------------------------
function getKpiIconConfig(tone?: string) {
  switch (tone) {
    case "pos":
      return { Icon: ArrowUpRight, color: "var(--brand-green-dark)", bg: "rgba(54,186,88,0.18)" }
    case "neg":
      return { Icon: AlertTriangle, color: "var(--brand-error-soft)", bg: "rgba(209,67,67,0.12)" }
    case "warn":
      return { Icon: AlertTriangle, color: "#b45309", bg: "rgba(234,179,8,0.12)" }
    case "muted":
    default:
      return { Icon: Info, color: "var(--brand-blue)", bg: "rgba(21,103,200,0.10)" }
  }
}

// ---------------------------------------------------------------------
// Alerta style config by nivel
// ---------------------------------------------------------------------
function getAlertaStyle(nivel: "critico" | "atencao" | "controle") {
  switch (nivel) {
    case "critico":
      return {
        border: "var(--brand-error-soft)",
        badgeBg: "rgba(209,67,67,0.12)",
        badgeColor: "var(--brand-error-soft)",
      }
    case "atencao":
      return {
        border: "var(--brand-warning)",
        badgeBg: "rgba(224,139,0,0.12)",
        badgeColor: "var(--brand-warning)",
      }
    case "controle":
      return {
        border: "var(--brand-green)",
        badgeBg: "rgba(54,186,88,0.12)",
        badgeColor: "var(--brand-green-dark)",
      }
  }
}

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------
export default function SinteseTab({ dados, conteudo }: Props) {
  return (
    <section className="space-y-6">
      {/* ============================================================ */}
      {/* BLOCO 1 — Veredito                                            */}
      {/* ============================================================ */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 transition-shadow hover:shadow-md">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          {conteudo.vereditoLabel}
        </p>
        <h3
          className="mt-1 text-base font-semibold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          {dados.veredito}
        </h3>
      </div>

      {/* ============================================================ */}
      {/* BLOCO 2 — KPIs (grid 5 cols)                                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {dados.kpis.map((kpi, idx) => {
          const iconConfig = getKpiIconConfig(kpi.subTone)
          return (
            <div
              key={idx}
              className="relative rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <span
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: iconConfig.bg }}
              >
                <iconConfig.Icon size={14} style={{ color: iconConfig.color }} />
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
                {kpi.sub}
              </p>
            </div>
          )
        })}
      </div>

      {/* ============================================================ */}
      {/* BLOCO 3 — Alertas (grid 3 cols)                               */}
      {/* ============================================================ */}
      <div className="grid gap-3 md:grid-cols-3">
        {dados.alertas.map((alerta, idx) => {
          const s = getAlertaStyle(alerta.nivel)
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              style={{ borderLeftWidth: "4px", borderLeftColor: s.border }}
            >
              <span
                className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ background: s.badgeBg, color: s.badgeColor }}
              >
                {conteudo.alertasLabels[alerta.nivel]}
              </span>
              <h4
                className="mt-2 text-[13px] font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                {alerta.titulo}
              </h4>
              <p
                className="mt-2 text-[13px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {alerta.texto}
              </p>
            </div>
          )
        })}
      </div>

      {/* ============================================================ */}
      {/* BLOCO 4 — Leitura Executiva                                   */}
      {/* ============================================================ */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 transition-shadow hover:shadow-md">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          {conteudo.leituraLabel}
        </p>
        <h3
          className="mt-1 text-base font-semibold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          {dados.leitura.tese}
        </h3>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <h4
              className="text-[12px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-navy)" }}
            >
              {conteudo.leituraSubBlocos.funcionou}
            </h4>
            <p
              className="mt-1.5 text-[13px] leading-relaxed"
              style={{ color: "var(--slate-700)" }}
            >
              {dados.leitura.funcionou}
            </p>
          </div>
          <div>
            <h4
              className="text-[12px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-navy)" }}
            >
              {conteudo.leituraSubBlocos.preocupa}
            </h4>
            <p
              className="mt-1.5 text-[13px] leading-relaxed"
              style={{ color: "var(--slate-700)" }}
            >
              {dados.leitura.preocupa}
            </p>
          </div>
          <div>
            <h4
              className="text-[12px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-navy)" }}
            >
              {conteudo.leituraSubBlocos.fazerAgora}
            </h4>
            <p
              className="mt-1.5 text-[13px] leading-relaxed"
              style={{ color: "var(--slate-700)" }}
            >
              {dados.leitura.fazerAgora}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BLOCO 5 — Ações Priorizadas                                   */}
      {/* ============================================================ */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 transition-shadow hover:shadow-md">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          {conteudo.acoesLabel}
        </p>
        <ol className="mt-4 space-y-4">
          {dados.acoes.map((acao, idx) => (
            <li key={idx} className="flex gap-3">
              <span
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ background: "var(--brand-blue)" }}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {acao.titulo}
                </p>
                <p
                  className="mt-0.5 text-[13px] leading-relaxed"
                  style={{ color: "var(--slate-700)" }}
                >
                  {acao.descricao}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {acao.meta}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
