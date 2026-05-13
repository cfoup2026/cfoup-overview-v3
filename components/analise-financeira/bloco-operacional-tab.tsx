"use client"

import { useState } from "react"
import Link from "next/link"
import type { BlocoOperacional } from "@/lib/types/analise-financeira"

type Props = {
  letra: string
  titulo: string
  src: string
  dados: BlocoOperacional
}

const NIVEL_CONFIG: Record<string, { label: string; color: string }> = {
  critico: { label: "Crítico", color: "var(--brand-red)" },
  atencao: { label: "Atenção", color: "var(--brand-warning)" },
  controle: { label: "Controle", color: "var(--brand-green)" },
}

export function BlocoOperacionalTab({ letra, titulo, src, dados }: Props) {
  const [glossOpen, setGlossOpen] = useState(false)
  const [evidenceOpen, setEvidenceOpen] = useState<Record<number, boolean>>({})

  const toggleEvidence = (idx: number) => {
    setEvidenceOpen((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <section>
      {/* VEREDITO */}
      <div className="rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Veredito · Bloco {letra}
        </p>
        <p
          className="max-w-3xl text-[15px] md:text-[16px] font-semibold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          {dados.veredito}
        </p>
        <p className="mt-2 text-[11px] text-muted-foreground">{src}</p>
      </div>

      {/* LEITURA */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          A leitura
        </p>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--brand-ink-muted)" }}
          dangerouslySetInnerHTML={{ __html: dados.leitura }}
        />
      </div>

      {/* KPIs */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          KPIs-chave
        </p>
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns:
              dados.kpis.length === 5
                ? "repeat(5, 1fr)"
                : dados.kpis.length === 3
                  ? "repeat(3, 1fr)"
                  : "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {dados.kpis.map((kpi, idx) => {
            const deltaColor =
              kpi.deltaType === "up"
                ? "var(--brand-green)"
                : kpi.deltaType === "down"
                  ? "var(--brand-red)"
                  : kpi.deltaType === "warn"
                    ? "var(--brand-warning)"
                    : undefined

            const content = (
              <>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                <p
                  className="mt-1 text-xl font-bold tabular-nums"
                  style={{ color: "var(--brand-navy)" }}
                  dangerouslySetInnerHTML={{ __html: kpi.valor }}
                />
                <p
                  className="mt-1 text-[11px] tabular-nums"
                  style={{ color: deltaColor || "var(--brand-ink-muted)" }}
                >
                  {kpi.delta}
                </p>
              </>
            )

            if (kpi.href) {
              return (
                <Link
                  key={idx}
                  href={kpi.href}
                  className="block rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:border-[var(--brand-blue)]/40 hover:bg-muted/50"
                >
                  {content}
                </Link>
              )
            }

            return (
              <div key={idx} className="rounded-lg border border-border bg-muted/30 p-3">
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {/* ALERTAS */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Alertas operacionais
        </p>
        <div className="divide-y divide-border">
          {dados.alertas.map((alerta, idx) => {
            const config = NIVEL_CONFIG[alerta.nivel] || { label: alerta.nivel, color: "var(--brand-blue)" }

            const content = (
              <>
                <span
                  className="mr-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: config.color }}
                >
                  {config.label}
                </span>
                <span className="font-semibold" style={{ color: "var(--brand-navy)" }}>
                  {alerta.titulo}
                </span>
                <span
                  className="ml-2"
                  style={{ color: "var(--brand-ink-muted)" }}
                  dangerouslySetInnerHTML={{ __html: alerta.texto }}
                />
              </>
            )

            if (alerta.href) {
              return (
                <Link
                  key={idx}
                  href={alerta.href}
                  className="block py-3 text-[13px] leading-relaxed transition-colors first:pt-0 last:pb-0 hover:bg-muted/30"
                >
                  {content}
                </Link>
              )
            }

            return (
              <div key={idx} className="py-3 text-[13px] leading-relaxed first:pt-0 last:pb-0">
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {/* EVIDENCE BLOCKS (opcional) */}
      {dados.evidenceBlocks && dados.evidenceBlocks.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
            Detalhamento
          </p>
          <div className="space-y-3">
            {dados.evidenceBlocks.map((block, idx) => (
              <div key={idx} className="rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => toggleEvidence(idx)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-semibold transition-colors hover:bg-muted/30"
                  style={{ color: "var(--brand-navy)" }}
                >
                  <span>{block.titulo}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[14px] leading-none transition-transform ${
                      evidenceOpen[idx] ? "rotate-45 bg-[var(--brand-blue)] text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    +
                  </span>
                </button>
                {evidenceOpen[idx] && (
                  <div
                    className="border-t border-border px-4 py-4 text-[13px] leading-relaxed"
                    style={{ color: "var(--brand-ink-muted)" }}
                    dangerouslySetInnerHTML={{ __html: block.conteudo }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAs (opcional) */}
      {dados.ctas && dados.ctas.length > 0 && (
        <div className="mt-6 space-y-3">
          {dados.ctas.map((cta, idx) => (
            <div key={idx} className="rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
                {cta.eyebrow}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
                {cta.texto}
              </p>
              <Link
                href={cta.href}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:border-[var(--brand-blue)]/40"
                style={{ color: "var(--brand-navy)" }}
              >
                {cta.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* AÇÕES PRIORIZADAS */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Ações priorizadas · Bloco {letra}
        </p>
        <div className="divide-y divide-border">
          {dados.acoes.map((acao, idx) => {
            const content = (
              <>
                <span className="text-[13px] font-bold tabular-nums" style={{ color: "var(--brand-blue)" }}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <span
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--brand-navy)" }}
                    dangerouslySetInnerHTML={{ __html: acao.texto }}
                  />
                  <span className="ml-2 text-[11px] text-muted-foreground">{acao.meta}</span>
                </div>
              </>
            )

            if (acao.href) {
              return (
                <Link
                  key={idx}
                  href={acao.href}
                  className="flex gap-4 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-muted/30"
                >
                  {content}
                </Link>
              )
            }

            return (
              <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {/* GLOSSÁRIO */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setGlossOpen(!glossOpen)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-white px-6 py-4 text-left text-[13px] font-semibold transition-all hover:bg-muted/30"
          style={{ color: "var(--brand-navy)" }}
        >
          <span>
            <span className="mr-3 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
              Glossário
            </span>
            Bloco {letra} · {titulo}
          </span>
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[14px] leading-none transition-transform ${
              glossOpen ? "rotate-45 bg-[var(--brand-blue)] text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            +
          </span>
        </button>
        {glossOpen && (
          <div className="mt-[-1px] rounded-b-2xl border border-t-0 border-border bg-white px-6 py-4">
            {dados.glossario.map((item, idx) => (
              <div key={idx} className="border-b border-border py-3 last:border-b-0">
                <dt className="text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>
                  {item.termo}
                </dt>
                <dd className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
                  {item.definicao}
                </dd>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
