"use client"

import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react"
import type { DadosSintese } from "@/lib/types/analise-financeira"
import { conteudoSintese } from "@/lib/conteudos/analise-financeira"

type Props = {
  dados?: DadosSintese
}

export default function SinteseTab({ dados }: Props) {
  return (
    <div className="space-y-4">
      {/* Card 1: Veredito */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          {conteudoSintese.vereditoLabel}
        </p>
        <p
          className="mt-2 text-[15px] font-medium leading-relaxed"
          style={{ color: "var(--brand-navy)" }}
        >
          {dados?.veredito ?? "—"}
        </p>
      </div>

      {/* Card 2: KPIs Grid */}
      {dados?.kpis && dados.kpis.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dados.kpis.map((kpi) => (
            <KPICard
              key={kpi.label}
              label={kpi.label}
              valor={kpi.valor}
              sub={kpi.sub}
              subTone={kpi.subTone}
            />
          ))}
        </div>
      )}

      {/* Card 3: Alerts */}
      {dados?.alerts && dados.alerts.length > 0 && (
        <div className="space-y-3">
          {dados.alerts.map((alert, idx) => (
            <AlertCard
              key={idx}
              nivel={alert.nivel}
              titulo={alert.titulo}
              texto={alert.texto}
            />
          ))}
        </div>
      )}

      {/* Card 4: Leitura Executiva */}
      {dados?.leituraExecutiva && (
        <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--brand-blue)" }}
          >
            {conteudoSintese.leituraExecutivaLabel}
          </p>
          <h3
            className="mt-1 text-base font-bold leading-snug"
            style={{ color: "var(--brand-navy)" }}
          >
            {dados.leituraExecutiva.titulo}
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {/* O que funcionou */}
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--green-600)" }}
              >
                {conteudoSintese.subBlocosLabels.funcionou}
              </p>
              <p
                className="mt-1 text-[13px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {dados.leituraExecutiva.funcionou}
              </p>
            </div>

            {/* O que preocupa */}
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--amber-600)" }}
              >
                {conteudoSintese.subBlocosLabels.preocupa}
              </p>
              <p
                className="mt-1 text-[13px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {dados.leituraExecutiva.preocupa}
              </p>
            </div>

            {/* O que fazer agora */}
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--brand-blue)" }}
              >
                {conteudoSintese.subBlocosLabels.fazerAgora}
              </p>
              <p
                className="mt-1 text-[13px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {dados.leituraExecutiva.fazerAgora}
              </p>
            </div>
          </div>

          {/* Ações priorizadas */}
          {dados.leituraExecutiva.acoes.length > 0 && (
            <div className="mt-6">
              <p
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--brand-navy)" }}
              >
                {conteudoSintese.subBlocosLabels.acoes}
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                {dados.leituraExecutiva.acoes.map((acao, idx) => (
                  <li
                    key={idx}
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--slate-700)" }}
                  >
                    {acao}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------
function KPICard({
  label,
  valor,
  sub,
  subTone,
}: {
  label: string
  valor: string
  sub: string
  subTone?: "pos" | "neg" | "neutral"
}) {
  const subColor =
    subTone === "pos"
      ? "var(--green-600)"
      : subTone === "neg"
        ? "var(--red-600)"
        : "var(--slate-500)"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: "var(--brand-cyan)" }}
      />
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p
        className="mt-1 text-2xl font-bold"
        style={{ color: "var(--brand-navy)" }}
      >
        {valor}
      </p>
      <p className="mt-0.5 text-sm" style={{ color: subColor }}>
        {sub}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------
// Alert Card
// ---------------------------------------------------------------------
function AlertCard({
  nivel,
  titulo,
  texto,
}: {
  nivel: "critico" | "atencao" | "controle"
  titulo: string
  texto: string
}) {
  const config = {
    critico: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: AlertCircle,
      iconColor: "text-red-600",
      labelColor: "var(--red-600)",
      label: conteudoSintese.alertsLabels.critico,
    },
    atencao: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      labelColor: "var(--amber-600)",
      label: conteudoSintese.alertsLabels.atencao,
    },
    controle: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: Info,
      iconColor: "text-blue-600",
      labelColor: "var(--brand-blue)",
      label: conteudoSintese.alertsLabels.controle,
    },
  }

  const c = config[nivel]
  const Icon = c.icon

  return (
    <div
      className={`flex gap-3 rounded-2xl border p-5 md:p-6 ${c.bg} ${c.border}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${c.iconColor}`} />
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: c.labelColor }}
        >
          {c.label}
        </p>
        <h4
          className="mt-0.5 text-[14px] font-bold"
          style={{ color: "var(--brand-navy)" }}
        >
          {titulo}
        </h4>
        <p
          className="mt-1 text-[13px] leading-relaxed"
          style={{ color: "var(--slate-700)" }}
        >
          {texto}
        </p>
      </div>
    </div>
  )
}
