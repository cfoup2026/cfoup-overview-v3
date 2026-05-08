"use client"

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
// Helpers
// ---------------------------------------------------------------------
function subToneColor(tone?: string): string {
  switch (tone) {
    case "pos":
      return "var(--brand-green)"
    case "neg":
      return "var(--brand-error-soft)"
    case "warn":
      return "var(--brand-warning)"
    default:
      return "var(--cfoup-muted)"
  }
}

function alertaStyle(nivel: "critico" | "atencao" | "controle") {
  switch (nivel) {
    case "critico":
      return {
        borderColor: "var(--brand-error-soft)",
        background: "rgba(209,67,67,.08)",
        badgeBg: "rgba(209,67,67,.15)",
        badgeColor: "var(--brand-error-soft)",
      }
    case "atencao":
      return {
        borderColor: "var(--brand-warning)",
        background: "rgba(224,139,0,.08)",
        badgeBg: "rgba(224,139,0,.15)",
        badgeColor: "var(--brand-warning)",
      }
    case "controle":
      return {
        borderColor: "var(--brand-green)",
        background: "rgba(54,186,88,.08)",
        badgeBg: "rgba(54,186,88,.15)",
        badgeColor: "var(--brand-green)",
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
      <div
        className="rounded-[12px] border bg-white p-6"
        style={{ borderColor: "var(--cfoup-line)" }}
      >
        <div
          className="text-[11px] uppercase tracking-wider"
          style={{ color: "var(--cfoup-muted)" }}
        >
          {conteudo.vereditoLabel}
        </div>
        <p
          className="mt-2 text-[22px] md:text-[30px]"
          style={{
            fontFamily: "var(--cfoup-font-serif)",
            fontWeight: 500,
            color: "var(--brand-navy)",
          }}
        >
          {dados.veredito}
        </p>
      </div>

      {/* ============================================================ */}
      {/* BLOCO 2 — KPIs (grid 5 cols)                                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {dados.kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-[12px] border bg-white p-5"
            style={{
              borderColor: "var(--cfoup-line)",
              borderLeftWidth: "3px",
              borderLeftColor: "var(--brand-cyan)",
            }}
          >
            <div
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "var(--cfoup-muted)" }}
            >
              {kpi.label}
            </div>
            <div
              className="mt-2 text-[30px]"
              style={{
                fontFamily: "var(--cfoup-font-serif)",
                fontWeight: 500,
                color: "var(--brand-navy)",
              }}
            >
              {kpi.valor}
            </div>
            <div
              className="mt-1 text-[11px]"
              style={{ color: subToneColor(kpi.subTone) }}
            >
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* BLOCO 3 — Alertas (grid 3 cols)                               */}
      {/* ============================================================ */}
      <div className="grid gap-4 md:grid-cols-3">
        {dados.alertas.map((alerta, idx) => {
          const s = alertaStyle(alerta.nivel)
          return (
            <div
              key={idx}
              className="rounded-[12px] p-5"
              style={{
                borderLeft: `4px solid ${s.borderColor}`,
                background: s.background,
              }}
            >
              <span
                className="inline-block rounded-[4px] px-2 py-0.5 text-[11px] font-bold uppercase"
                style={{ background: s.badgeBg, color: s.badgeColor }}
              >
                {conteudo.alertasLabels[alerta.nivel]}
              </span>
              <h4
                className="mt-2 text-[15px] font-semibold"
                style={{ color: "var(--brand-navy)", fontFamily: "var(--cfoup-font-sans)" }}
              >
                {alerta.titulo}
              </h4>
              <p
                className="mt-2 text-[14px]"
                style={{ color: "var(--cfoup-ink-soft)" }}
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
      <div
        className="rounded-[12px] border bg-white p-6 md:p-8"
        style={{ borderColor: "var(--cfoup-line)" }}
      >
        <div
          className="text-[11px] uppercase tracking-wider"
          style={{ color: "var(--cfoup-muted)" }}
        >
          {conteudo.leituraLabel}
        </div>
        <h3
          className="mt-2 text-[22px] md:text-[30px]"
          style={{
            fontFamily: "var(--cfoup-font-serif)",
            fontWeight: 500,
            color: "var(--brand-navy)",
          }}
        >
          {dados.leitura.tese}
        </h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <SubBloco
            label={conteudo.leituraSubBlocos.funcionou}
            texto={dados.leitura.funcionou}
          />
          <SubBloco
            label={conteudo.leituraSubBlocos.preocupa}
            texto={dados.leitura.preocupa}
          />
          <SubBloco
            label={conteudo.leituraSubBlocos.fazerAgora}
            texto={dados.leitura.fazerAgora}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* BLOCO 5 — Ações Priorizadas                                   */}
      {/* ============================================================ */}
      <div
        className="rounded-[12px] border bg-white p-6 md:p-8"
        style={{ borderColor: "var(--cfoup-line)" }}
      >
        <div
          className="text-[11px] uppercase tracking-wider"
          style={{ color: "var(--cfoup-muted)" }}
        >
          {conteudo.acoesLabel}
        </div>
        <ol className="mt-4 list-inside list-decimal space-y-4">
          {dados.acoes.map((acao, idx) => (
            <li
              key={idx}
              className="text-[14px]"
              style={{ color: "var(--cfoup-ink-soft)" }}
            >
              <strong style={{ color: "var(--brand-navy)" }}>{acao.titulo}</strong> —{" "}
              {acao.descricao}
              <span
                className="ml-6 mt-1 block text-[11px]"
                style={{ color: "var(--cfoup-muted)" }}
              >
                {acao.meta}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------
// Sub Bloco
// ---------------------------------------------------------------------
function SubBloco({ label, texto }: { label: string; texto: string }) {
  return (
    <div>
      <h4
        className="text-[12px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--brand-navy)" }}
      >
        {label}
      </h4>
      <p
        className="mt-2 text-[14px]"
        style={{ color: "var(--cfoup-ink-soft)" }}
      >
        {texto}
      </p>
    </div>
  )
}
