"use client"

import Link from "next/link"
import type { SinteseFinanceiraData } from "@/lib/types/analise-financeira"
import { NIVEL_CONFIG } from "@/lib/analise-financeira/constants/niveis"
import { EYEBROWS, LEITURA_EXECUTIVA_LABELS } from "@/lib/analise-financeira/constants/labels"

type Props = {
  dados: SinteseFinanceiraData
}

export default function SinteseTab({ dados }: Props) {
  return (
    <section>
      {/* VEREDITO — estático, sem interação */}
      <div className="rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          {EYEBROWS.veredito}
        </p>
        <p className="text-[15px] md:text-[16px] font-semibold leading-snug" style={{ color: "var(--brand-navy)" }}>
          {dados.veredito}
        </p>
      </div>

      {/* KPIs-CHAVE — clicáveis quando href presente */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          {EYEBROWS.kpisChave}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {dados.kpis.map((kpi, idx) => {
            const content = (
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
                <p className="mt-1 text-xl font-bold tabular-nums" style={{ color: "var(--brand-navy)" }}>{kpi.valor}</p>
                {kpi.contexto && (
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{kpi.contexto}</p>
                )}
              </div>
            )
            return kpi.href ? (
              <Link
                key={idx}
                href={kpi.href}
                className="flex cursor-pointer items-center justify-center rounded-lg border border-border bg-muted/30 px-3 py-2.5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-[var(--brand-blue)]/40 hover:bg-muted/50 hover:shadow-sm"
              >
                {content}
              </Link>
            ) : (
              <div
                key={idx}
                className="flex cursor-default items-center justify-center rounded-lg border border-border bg-muted/30 px-3 py-2.5 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-border/80 hover:bg-muted/40 hover:shadow-sm"
              >
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {/* ALERTAS OPERACIONAIS — clicáveis quando href presente */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          {EYEBROWS.alertasOperacionais}
        </p>
        <div className="divide-y divide-border">
          {dados.alertas.map((alerta, idx) => {
            const config = NIVEL_CONFIG[alerta.nivel] || { label: alerta.nivel, color: "var(--brand-blue)" }
            const content = (
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
                <span
                  className="mr-2 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: config.color }}
                >
                  {config.label}
                </span>
                {alerta.texto}
              </p>
            )
            return alerta.href ? (
              <Link
                key={idx}
                href={alerta.href}
                className="block py-3 first:pt-0 last:pb-0 transition-colors hover:bg-muted/30 -mx-2 px-2 rounded"
              >
                {content}
              </Link>
            ) : (
              <div key={idx} className="py-3 first:pt-0 last:pb-0">
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {/* LEITURA EXECUTIVA — estática */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          {EYEBROWS.leituraExecutiva}
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>{LEITURA_EXECUTIVA_LABELS.principal}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.principal}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>{LEITURA_EXECUTIVA_LABELS.oQueFuncionou}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.oQueFuncionou}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>{LEITURA_EXECUTIVA_LABELS.oQuePreocupa}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.oQuePreocupa}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>{LEITURA_EXECUTIVA_LABELS.oQueFazerAgora}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.oQueFazerAgora}</p>
          </div>
        </div>
      </div>

      {/* AÇÕES PRIORITÁRIAS — clicáveis quando href presente */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          {EYEBROWS.acoesPrioritarias}
        </p>
        <div className="divide-y divide-border">
          {dados.acoes.map((acao, idx) => {
            const content = (
              <>
                <span className="text-[13px] font-bold tabular-nums" style={{ color: "var(--brand-blue)" }}>{String(idx + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
                    <strong className="font-semibold">{acao.titulo}</strong> — {acao.descricao}
                  </p>
                </div>
              </>
            )
            return acao.href ? (
              <Link
                key={idx}
                href={acao.href}
                className="flex gap-4 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-muted/30 -mx-2 px-2 rounded"
              >
                {content}
              </Link>
            ) : (
              <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
