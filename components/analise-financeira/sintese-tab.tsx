"use client"

import type { SinteseFinanceiraData } from "@/lib/types/analise-financeira"

type Props = {
  dados: SinteseFinanceiraData
}

const NIVEL_LABEL: Record<string, string> = {
  critico: "Crítico",
  atencao: "Atenção",
  controle: "Controle",
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {dados.kpis.map((kpi, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
              <p className="text-lg font-bold tabular-nums" style={{ color: "var(--brand-navy)" }}>{kpi.valor}</p>
              {kpi.contexto && (
                <p className="text-[11px] text-muted-foreground">{kpi.contexto}</p>
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
          {dados.alertas.map((alerta, idx) => (
            <div key={idx} className="py-3 first:pt-0 last:pb-0">
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
                <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {NIVEL_LABEL[alerta.nivel] || alerta.nivel}
                </span>
                {alerta.texto}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* LEITURA EXECUTIVA */}
      <div className="mt-6 rounded-2xl border border-border p-6 md:p-8" style={{ background: "white" }}>
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Leitura executiva
        </p>
        <div className="space-y-5">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">A leitura principal</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.principal}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">O que funcionou</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.oQueFuncionou}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">O que preocupa</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{dados.leitura.oQuePreocupa}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">O que fazer agora</p>
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
              <span className="text-[13px] font-bold tabular-nums text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
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
