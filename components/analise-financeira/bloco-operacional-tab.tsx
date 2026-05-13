"use client"

import { useState } from "react"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

// ---------------------------------------------------------------------
// BlocoOperacionalTab — componente reutilizável para abas A-F
// Estrutura: section-head + verdict + headline + kpis + alerts + actions + glossary
// CSS classes baseadas em analise-financeira.html
// ---------------------------------------------------------------------

type Props = {
  letra: string
  titulo: string
  src: string
  dados: BlocoOperacional
}

export function BlocoOperacionalTab({ letra, titulo, src, dados }: Props) {
  const [glossOpen, setGlossOpen] = useState(false)

  return (
    <section className="op-section">
      {/* Section Head (navy gradient) */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
        style={{ background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-deep) 100%)" }}
      >
        <h2
          className="m-0 text-[22px] font-medium tracking-[-0.005em] text-white"
          style={{ fontFamily: "var(--cfoup-font-serif)" }}
        >
          {letra} <span style={{ color: "var(--brand-cyan)" }}>· {titulo}</span>
        </h2>
        <span className="text-[11px] tracking-[0.04em] text-white/70">{src}</span>
      </div>

      {/* Section Body */}
      <div className="p-7">
        {/* Verdict */}
        <div
          className="mb-3 flex items-baseline gap-4 rounded-r-lg border-l-4 px-6 py-4"
          style={{ background: "#F0F4FA", borderLeftColor: "var(--brand-blue)" }}
        >
          <span
            className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Veredito
          </span>
          <span
            className="text-[19px] font-medium leading-[1.35] tracking-[-0.005em]"
            style={{ fontFamily: "var(--cfoup-font-serif)", color: "var(--brand-navy)" }}
          >
            {dados.veredito}
          </span>
        </div>

        {/* Headline (leitura) */}
        <div
          className="mb-5 rounded-r-lg border-l-4 px-6 py-4"
          style={{
            background: "linear-gradient(180deg, #FFFEF7 0%, #FFFAEB 100%)",
            borderLeftColor: "var(--brand-warning)",
          }}
        >
          <div
            className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-warning)" }}
          >
            A leitura
          </div>
          <p
            className="m-0 text-[14px] leading-relaxed"
            style={{ color: "var(--brand-navy)" }}
            dangerouslySetInnerHTML={{ __html: dados.leitura }}
          />
        </div>

        {/* KPIs */}
        <div
          className="mb-4 grid gap-3"
          style={{
            gridTemplateColumns:
              dados.kpis.length === 5
                ? "repeat(5, 1fr)"
                : dados.kpis.length === 3
                  ? "repeat(3, 1fr)"
                  : "repeat(4, 1fr)",
          }}
        >
          {dados.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="relative block overflow-hidden rounded-xl border border-border px-5 py-5"
              style={{
                background: kpi.highlight
                  ? "linear-gradient(180deg, #FFFEF7 0%, #FFFAEB 100%)"
                  : "var(--card)",
              }}
            >
              {/* Border-left */}
              <span
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{
                  background: kpi.highlight
                    ? "var(--brand-warning)"
                    : "var(--brand-cyan)",
                }}
              />
              <div
                className={`mb-2 text-[10px] font-semibold uppercase leading-[1.3] tracking-[0.18em] ${kpi.highlight ? "" : "text-muted-foreground"}`}
                style={kpi.highlight ? { color: "var(--brand-warning)" } : undefined}
              >
                {kpi.label}
              </div>
              <div
                className="text-[26px] font-medium leading-[1.05] tracking-[-0.01em]"
                style={{ fontFamily: "var(--cfoup-font-serif)", color: "var(--brand-navy)" }}
                dangerouslySetInnerHTML={{ __html: kpi.valor }}
              />
              <div
                className={`mt-2 text-[12px] font-medium ${kpi.deltaType === "neutral" ? "text-muted-foreground" : ""}`}
                style={
                  kpi.deltaType === "up"
                    ? { color: "var(--brand-green)" }
                    : kpi.deltaType === "down"
                      ? { color: "var(--brand-error-soft)" }
                      : kpi.deltaType === "warn"
                        ? { color: "var(--brand-warning)" }
                        : undefined
                }
              >
                {kpi.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div
          className="mb-4 grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {dados.alertas.map((alerta, idx) => (
            <div
              key={idx}
              className="rounded-r-xl border border-border px-5 py-4"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor:
                  alerta.nivel === "critico"
                    ? "var(--brand-error-soft)"
                    : alerta.nivel === "atencao"
                      ? "var(--brand-warning)"
                      : "var(--brand-green)",
              }}
            >
              <span
                className="mb-2 inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  background:
                    alerta.nivel === "critico"
                      ? "rgba(209,67,67,0.1)"
                      : alerta.nivel === "atencao"
                        ? "rgba(224,139,0,0.1)"
                        : "rgba(54,186,88,0.1)",
                  color:
                    alerta.nivel === "critico"
                      ? "var(--brand-error-soft)"
                      : alerta.nivel === "atencao"
                        ? "var(--brand-warning)"
                        : "var(--brand-green)",
                }}
              >
                {alerta.nivel === "critico"
                  ? "Crítico"
                  : alerta.nivel === "atencao"
                    ? "Atenção"
                    : "Sob controle"}
              </span>
              <div
                className="mb-2 text-[13px] font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                {alerta.titulo}
              </div>
              <div
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--brand-ink-muted)" }}
                dangerouslySetInnerHTML={{ __html: alerta.texto }}
              />
            </div>
          ))}
        </div>

        {/* Actions (navy background) */}
        <div
          className="mb-4 rounded-2xl p-6 md:p-8"
          style={{ background: "var(--brand-navy)" }}
        >
          <h4
            className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-cyan)" }}
          >
            Ações priorizadas — Bloco {letra}
          </h4>
          <ol className="m-0 list-none space-y-4 p-0">
            {dados.acoes.map((acao, idx) => (
              <li key={idx} className="flex gap-4">
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold tabular-nums"
                  style={{ background: "var(--brand-cyan)", color: "var(--brand-navy)" }}
                >
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <span
                    className="text-[13px] leading-relaxed text-white"
                    dangerouslySetInnerHTML={{ __html: acao.texto }}
                  />
                  <span className="ml-2 text-[11px] text-white/60">{acao.meta}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Glossary toggle */}
        <div className="mt-6 border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setGlossOpen(!glossOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-6 py-4 text-left text-[13px] font-semibold transition-all hover:border-[color:var(--brand-cyan)] hover:bg-muted"
            style={{ color: "var(--brand-navy)" }}
          >
            <span>
              <span
                className="mr-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-blue)" }}
              >
                Glossário
              </span>
              Bloco {letra}
            </span>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[16px] leading-none transition-transform ${glossOpen ? "rotate-45 bg-[color:var(--brand-cyan)] text-white" : "bg-[color:var(--brand-line-soft)] text-[color:var(--brand-blue)]"}`}
            >
              +
            </span>
          </button>
          {glossOpen && (
            <div className="mt-[-1px] rounded-b-xl border border-t border-dashed border-border bg-card px-7 pb-2 pt-6">
              {dados.glossario.map((item, idx) => (
                <div key={idx} className="border-b border-border py-4 last:border-b-0">
                  <dt
                    className="mb-1 text-[13px] font-semibold"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {item.termo}
                  </dt>
                  <dd className="m-0 text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
                    {item.definicao}
                  </dd>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
