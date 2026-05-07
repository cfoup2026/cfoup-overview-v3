"use client"

import { TrendingUp, AlertTriangle, Info } from "lucide-react"
import { TabHeaderCard } from "@/components/tab-header-card"
import type { DadosSintese, Status } from "@/lib/types/analise-financeira"

function StatusIcon({ status }: { status: Status }) {
  const config = {
    positivo: {
      bg: "bg-green-100",
      text: "text-green-700",
      Icon: TrendingUp,
    },
    atencao: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      Icon: AlertTriangle,
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      Icon: Info,
    },
  }
  const { bg, text, Icon } = config[status]
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full ${bg} ${text}`}
    >
      <Icon className="h-4 w-4" />
    </div>
  )
}

function deltaColor(status?: Status) {
  if (status === "positivo") return "text-green-600"
  if (status === "atencao") return "text-amber-600"
  return "text-muted-foreground"
}

export default function SinteseTab({
  dados,
  intro,
}: {
  dados: DadosSintese
  intro: string
}) {
  return (
    <section>
      <TabHeaderCard titulo="Síntese Executiva" intro={intro} />

      {/* Card 1 — Período em revisão */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
        <h3 className="mb-3 text-base font-semibold text-[color:var(--brand-navy)]">
          Período em revisão
        </h3>
        <p className="text-sm text-muted-foreground">{dados.periodoDescricao}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {dados.fontes.map((fonte) => (
            <span
              key={fonte}
              className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
            >
              {fonte}
            </span>
          ))}
        </div>
      </div>

      {/* Card 2 — Números do Exercício */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-5 md:p-6">
        <h3 className="mb-4 text-base font-semibold text-[color:var(--brand-navy)]">
          Números do Exercício
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {dados.kpis.map((kpi) => (
            <div key={kpi.label}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {kpi.label}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">
                  {kpi.valor}
                </span>
                {kpi.delta && (
                  <span className={`text-xs ${deltaColor(kpi.status)}`}>
                    {kpi.delta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3 — Headlines */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-5 md:p-6">
        <h3 className="mb-4 text-base font-semibold text-[color:var(--brand-navy)]">
          Headlines
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {dados.headlines.map((headline) => (
            <div
              key={headline.titulo}
              className="flex h-full flex-col rounded-xl bg-muted/30 p-4"
            >
              <StatusIcon status={headline.status} />
              <h4 className="mt-3 font-semibold">{headline.titulo}</h4>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">
                {headline.texto}
              </p>
              {headline.link && (
                <a
                  href={headline.link.href}
                  className="mt-3 text-sm text-[color:var(--brand-blue)] hover:underline"
                >
                  {headline.link.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Card 4 — Leitura Executiva */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-5 md:p-6">
        <h3 className="mb-3 text-base font-semibold text-[color:var(--brand-navy)]">
          Leitura Executiva
        </h3>
        <p className="text-base leading-relaxed">{dados.leituraExecutiva}</p>
      </div>
    </section>
  )
}
