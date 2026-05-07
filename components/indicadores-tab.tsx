"use client"

import { type ReactNode } from "react"
import { TrendingUp, AlertTriangle, Info } from "lucide-react"
import type { IndicadoresDadosCliente } from "@/lib/clientes/empresa-001"
import { conteudoIndicadores } from "@/lib/conteudos/analise-contabil"
import { TabHeaderCard } from "@/components/tab-header-card"

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/** Converte **trecho** em <strong>trecho</strong> */
function renderBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// ---------------------------------------------------------------------
// Badge config por status
// ---------------------------------------------------------------------
const STATUS_CONFIG = {
  positivo: {
    Icon: TrendingUp,
    color: "var(--brand-green-dark)",
    bg: "rgba(54,186,88,0.18)",
  },
  atencao: {
    Icon: AlertTriangle,
    color: "#b45309",
    bg: "rgba(234,179,8,0.12)",
  },
  info: {
    Icon: Info,
    color: "var(--brand-blue)",
    bg: "rgba(21,103,200,0.10)",
  },
}

// ---------------------------------------------------------------------
// IndicadoresTab component
// ---------------------------------------------------------------------
export function IndicadoresTab({ dados }: { dados: IndicadoresDadosCliente }) {
  return (
    <div>
      {/* Header */}
      <TabHeaderCard titulo="Indicadores" intro={conteudoIndicadores.intro} />

      {/* Tabela */}
      <div className="mr-auto mt-4 max-w-[1280px] overflow-hidden rounded-2xl border border-border bg-card px-4 py-4 md:px-5">
        <table className="w-full table-fixed text-[12px]">
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "51%" }} />
          </colgroup>
          <thead className="bg-muted/40 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              <th className="px-2 py-2 text-left">Indicador</th>
              <th className="px-2 py-2 text-right">2023</th>
              <th className="px-2 py-2 text-right">2024</th>
              <th className="px-2 py-2 text-right">2025</th>
              <th className="px-2 py-2 text-left">O que quer dizer</th>
            </tr>
          </thead>
          <tbody>
            {dados.linhas.map((linha) => (
              <tr
                key={linha.id}
                className="border-b border-border last:border-b-0"
              >
                <td
                  className="px-2 py-2 font-medium"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {linha.label}
                </td>
                {linha.valoresPorAno.map((v) => (
                  <td
                    key={v.ano}
                    className="px-2 py-2 text-right tabular-nums"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {v.valor}
                  </td>
                ))}
                <td className="px-2 py-2 leading-relaxed text-muted-foreground">
                  {linha.explicacao}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leitura geral */}
      <div className="mt-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Leitura geral
        </p>
        <h3
          className="mt-0.5 text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          O que esses números dizem no conjunto
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {dados.comentarios.map((c) => {
            const cfg = STATUS_CONFIG[c.status]
            return (
              <div
                key={c.id}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    <cfg.Icon size={18} style={{ color: cfg.color }} />
                  </div>
                  <h4
                    className="pt-1 text-[13px] font-semibold leading-snug"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {c.titulo}
                  </h4>
                </div>
                <p
                  className="mt-2 text-[13px] leading-relaxed"
                  style={{ color: "var(--slate-700)" }}
                >
                  {renderBold(c.corpo)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Glossário */}
      <details className="mb-6 mt-6">
        <summary
          className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Glossário · Termos usados em Indicadores +
        </summary>
        <dl className="mt-3 space-y-3">
          {conteudoIndicadores.glossario.map((g) => (
            <div key={g.termo}>
              <dt
                className="text-[13px] font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                {g.termo}
              </dt>
              <dd
                className="mt-1 text-[13px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {g.definicao}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}
