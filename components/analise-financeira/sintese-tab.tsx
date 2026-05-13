"use client"

import type { SinteseFinanceiraData } from "@/lib/types/analise-financeira"

type Props = {
  dados: SinteseFinanceiraData
}

const NIVEL_CONFIG: Record<string, { label: string; color: string }> = {
  critico: { label: "Crítico", color: "var(--brand-red)" },
  atencao: { label: "Atenção", color: "var(--brand-warning)" },
  controle: { label: "Controle", color: "var(--brand-green)" },
}

export default function SinteseTab({ dados }: Props) {
  return (
    <section>
      {/* VEREDITO */}
      <div className="rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Veredito
        </p>
        <p className="max-w-3xl text-[15px] md:text-[16px] font-semibold leading-snug" style={{ color: "var(--brand-navy)" }}>
          {dados.veredito}
        </p>
      </div>

      {/* KPIs-CHAVE */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          KPIs-chave
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {dados.kpis.map((kpi, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-xl font-bold tabular-nums" style={{ color: "var(--brand-navy)" }}>{kpi.valor}</p>
              {kpi.contexto && (
                <p className="mt-1 text-[11px] text-muted-foreground">{kpi.contexto}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ALERTAS OPERACIONAIS */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Alertas operacionais
        </p>
        <div className="divide-y divide-border">
          {dados.alertas.map((alerta, idx) => {
            const config = NIVEL_CONFIG[alerta.nivel] || { label: alerta.nivel, color: "var(--brand-blue)" }
            return (
              <div key={idx} className="py-3 first:pt-0 last:pb-0">
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
                  <span
                    className="mr-2 text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </span>
                  {alerta.texto}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* LEITURA EXECUTIVA */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Leitura executiva
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>A leitura principal</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.principal}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>O que funcionou</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.oQueFuncionou}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>O que preocupa</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.oQuePreocupa}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>O que fazer agora</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.oQueFazerAgora}</p>
          </div>
        </div>
      </div>

      {/* AÇÕES PRIORITÁRIAS */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Ações prioritárias
        </p>
        <div className="divide-y divide-border">
          {dados.acoes.map((acao, idx) => (
            <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0">
              <span className="text-[13px] font-bold tabular-nums" style={{ color: "var(--brand-blue)" }}>{String(idx + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
                  <strong className="font-semibold">{acao.titulo}</strong> — {acao.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
