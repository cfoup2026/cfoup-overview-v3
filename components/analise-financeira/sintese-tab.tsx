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
// Component
// ---------------------------------------------------------------------
export default function SinteseTab({ dados, conteudo }: Props) {
  return (
    <section className="space-y-6">
      {/* ============================================================ */}
      {/* BLOCO 1 — Veredito                                            */}
      {/* ============================================================ */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {conteudo.vereditoLabel}
        </p>
        <p
          className="font-fraunces text-xl md:text-2xl"
          style={{ color: "var(--brand-navy)" }}
        >
          {dados.veredito}
        </p>
      </div>

      {/* ============================================================ */}
      {/* BLOCO 2 — KPIs (grid 5 cols)                                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {dados.kpis.map((kpi, idx) => (
          <KPICard key={idx} kpi={kpi} />
        ))}
      </div>

      {/* ============================================================ */}
      {/* BLOCO 3 — Alertas (grid 3 cols)                               */}
      {/* ============================================================ */}
      <div className="grid gap-4 md:grid-cols-3">
        {dados.alertas.map((alerta, idx) => (
          <AlertaCard key={idx} alerta={alerta} labels={conteudo.alertasLabels} />
        ))}
      </div>

      {/* ============================================================ */}
      {/* BLOCO 4 — Leitura Executiva                                   */}
      {/* ============================================================ */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {conteudo.leituraLabel}
        </p>
        <h3
          className="mt-2 font-fraunces text-2xl md:text-3xl"
          style={{ color: "var(--brand-navy)" }}
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
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {conteudo.acoesLabel}
        </p>
        <ol className="mt-4 list-inside list-decimal space-y-4">
          {dados.acoes.map((acao, idx) => (
            <li key={idx} className="text-[15px] leading-relaxed">
              <strong className="font-semibold">{acao.titulo}</strong> — {acao.descricao}
              <span className="ml-6 mt-1 block text-xs text-muted-foreground">
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
// KPI Card
// ---------------------------------------------------------------------
function KPICard({ kpi }: { kpi: { label: string; valor: string; sub: string; subTone?: string } }) {
  const subColorClass =
    kpi.subTone === "pos"
      ? "text-green-600"
      : kpi.subTone === "neg"
        ? "text-red-600"
        : kpi.subTone === "warn"
          ? "text-amber-600"
          : "text-muted-foreground"

  return (
    <div
      className="rounded-2xl border border-border bg-card p-5"
      style={{ borderLeftWidth: "4px", borderLeftColor: "var(--brand-cyan)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {kpi.label}
      </p>
      <p className="mt-2 font-fraunces text-3xl" style={{ color: "var(--brand-navy)" }}>
        {kpi.valor}
      </p>
      <p className={`mt-1 text-xs ${subColorClass}`}>{kpi.sub}</p>
    </div>
  )
}

// ---------------------------------------------------------------------
// Alerta Card
// ---------------------------------------------------------------------
function AlertaCard({
  alerta,
  labels,
}: {
  alerta: { nivel: "critico" | "atencao" | "controle"; titulo: string; texto: string }
  labels: { critico: string; atencao: string; controle: string }
}) {
  const styles = {
    critico: {
      border: "border-l-red-500",
      bg: "bg-red-50 dark:bg-red-950/30",
      badge: "text-red-700 dark:text-red-400",
    },
    atencao: {
      border: "border-l-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      badge: "text-amber-700 dark:text-amber-400",
    },
    controle: {
      border: "border-l-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      badge: "text-blue-700 dark:text-blue-400",
    },
  }

  const s = styles[alerta.nivel]

  return (
    <div className={`rounded-2xl border-l-4 ${s.border} ${s.bg} p-5`}>
      <span className={`text-xs font-semibold uppercase ${s.badge}`}>
        {labels[alerta.nivel]}
      </span>
      <h4 className="mt-2 font-semibold" style={{ color: "var(--brand-navy)" }}>
        {alerta.titulo}
      </h4>
      <p className="mt-2 text-sm text-foreground/80">{alerta.texto}</p>
    </div>
  )
}

// ---------------------------------------------------------------------
// Sub Bloco
// ---------------------------------------------------------------------
function SubBloco({ label, texto }: { label: string; texto: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase" style={{ color: "var(--brand-navy)" }}>
        {label}
      </h4>
      <p className="mt-2 text-sm text-foreground/80">{texto}</p>
    </div>
  )
}
