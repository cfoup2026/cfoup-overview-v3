"use client"

import { useState, type ReactNode } from "react"
import { TrendingUp, AlertTriangle, Info } from "lucide-react"
import type { DREData, DRELinhaAH } from "@/lib/mocks/analise-contabil-gregorutt"

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/** Formata BRL: "1.905.833" positivo, "(651.522)" negativo, "—" null */
function formatBRL(n: number | null): string {
  if (n === null) return "—"
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString("pt-BR", { maximumFractionDigits: 0 })
  return n < 0 ? `(${formatted})` : formatted
}

/** Formata porcentagem: "13,9%" sem sinal; com sign: "+30,2%" / "-17,1%" */
function formatPct(n: number | null, withSign = false): string {
  if (n === null) return "—"
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  if (withSign) {
    return n >= 0 ? `+${formatted}%` : `-${formatted}%`
  }
  return n < 0 ? `-${formatted}%` : `${formatted}%`
}

/** Converte **trecho** em <strong>trecho</strong> */
function renderBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

/** Determina cor do delta: verde se favorável, vermelho se desfavorável */
function getDeltaClass(
  pct: number,
  direcao: DRELinhaAH["direcaoFavoravel"]
): string {
  const isFavoravel =
    (direcao === "cresce" && pct >= 0) || (direcao === "cai" && pct <= 0)
  return isFavoravel
    ? "text-[color:var(--brand-green-dark)]"
    : "text-[color:var(--brand-red)]"
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
// DRETab component
// ---------------------------------------------------------------------
type View = "vertical" | "horizontal" | "comentarios"

export function DRETab({ data }: { data: DREData }) {
  const [view, setView] = useState<View>("vertical")

  return (
    <section>
      {/* Header */}
      <div className="mt-6">
        <h2
          className="text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          Demonstração do Resultado
        </h2>
        <p
          className="mt-1.5 max-w-3xl text-[13px] leading-relaxed"
          style={{ color: "var(--slate-700)" }}
        >
          {data.intro}
        </p>
      </div>

      {/* Toggle pills */}
      <div className="mt-4 flex gap-2">
        {(["vertical", "horizontal", "comentarios"] as View[]).map((v) => {
          const isActive = view === v
          const label =
            v === "vertical"
              ? "Análise Vertical"
              : v === "horizontal"
                ? "Análise Horizontal"
                : "Comentários"
          return (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1.5 text-[13px] transition ${
                isActive
                  ? "border border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)] font-semibold text-white"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Views */}
      {view === "vertical" && <ViewVertical data={data} />}
      {view === "horizontal" && <ViewHorizontal data={data} />}
      {view === "comentarios" && <ViewComentarios data={data} />}

      {/* Glossário */}
      <details className="mb-6 mt-6">
        <summary
          className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Glossário · Termos usados no DRE +
        </summary>
        <dl className="mt-3 space-y-3">
          {data.glossario.map((item) => (
            <div key={item.termo}>
              <dt
                className="text-[13px] font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                {item.termo}
              </dt>
              <dd
                className="mt-1 text-[13px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {item.definicao}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  )
}

// ---------------------------------------------------------------------
// View: Análise Vertical
// ---------------------------------------------------------------------
function ViewVertical({ data }: { data: DREData }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
      {/* Legenda */}
      <div className="flex items-start gap-2 border-b border-border p-4 md:p-5">
        <Info
          size={16}
          className="mt-0.5 shrink-0"
          style={{ color: "var(--brand-blue)" }}
        />
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: "var(--slate-700)" }}
        >
          {renderBold(data.legendaAV)}
        </p>
      </div>

      {/* Tabela */}
      <div className="mr-auto max-w-[920px] overflow-x-auto px-4 py-4 md:px-5">
        <table className="w-full table-fixed text-[12px]">
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead
            className="bg-muted/40 text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
          >
            <tr>
              <th className="px-2 py-2 text-left">Linha</th>
              <th className="px-2 py-2 text-right">2023 R$</th>
              <th className="px-2 py-2 text-right">2023 AV</th>
              <th className="px-2 py-2 text-right">2024 R$</th>
              <th className="px-2 py-2 text-right">2024 AV</th>
              <th className="px-2 py-2 text-right">2025 R$</th>
              <th className="px-2 py-2 text-right">2025 AV</th>
            </tr>
          </thead>
          <tbody>
            {data.linhasAV.map((linha, idx) => {
              const isLast = idx === data.linhasAV.length - 1
              const rowClass = linha.isLucroLiquido
                ? "bg-[rgba(54,186,88,0.10)] font-extrabold"
                : linha.isSubtotal
                  ? "bg-muted/40 font-semibold"
                  : ""
              return (
                <tr
                  key={linha.id}
                  className={`border-b border-border ${isLast ? "border-b-0" : ""} ${rowClass}`}
                  style={{ color: "var(--brand-navy)" }}
                >
                  <td className="px-2 py-2">{linha.label}</td>
                  {linha.valores.map((v) => (
                    <>
                      <td
                        key={`${v.ano}-rs`}
                        className="px-2 py-2 text-right tabular-nums"
                      >
                        {formatBRL(v.rs)}
                      </td>
                      <td
                        key={`${v.ano}-av`}
                        className="px-2 py-2 text-right tabular-nums"
                      >
                        {formatPct(v.av)}
                      </td>
                    </>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------
// View: Análise Horizontal
// ---------------------------------------------------------------------
function ViewHorizontal({ data }: { data: DREData }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
      {/* Legenda */}
      <div className="flex items-start gap-2 border-b border-border p-4 md:p-5">
        <Info
          size={16}
          className="mt-0.5 shrink-0"
          style={{ color: "var(--brand-blue)" }}
        />
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: "var(--slate-700)" }}
        >
          {renderBold(data.legendaAH)}
        </p>
      </div>

      {/* Tabela */}
      <div className="mr-auto max-w-[920px] overflow-x-auto px-4 py-4 md:px-5">
        <table className="w-full table-fixed text-[12px]">
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead
            className="bg-muted/40 text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
          >
            <tr>
              <th className="px-2 py-2 text-left">Linha</th>
              <th className="px-2 py-2 text-right">2023</th>
              <th className="px-2 py-2 text-right">2024</th>
              <th className="px-2 py-2 text-right">2025</th>
              <th className="px-2 py-2 text-right">Δ 24/23</th>
              <th className="px-2 py-2 text-right">Δ 25/24</th>
              <th className="px-2 py-2 text-right">Δ 25/23</th>
            </tr>
          </thead>
          <tbody>
            {data.linhasAH.map((linha, idx) => {
              const isLast = idx === data.linhasAH.length - 1
              const rowClass = linha.isLucroLiquido
                ? "bg-[rgba(54,186,88,0.10)] font-extrabold"
                : linha.isSubtotal
                  ? "bg-muted/40 font-semibold"
                  : ""
              return (
                <tr
                  key={linha.id}
                  className={`border-b border-border ${isLast ? "border-b-0" : ""} ${rowClass}`}
                  style={{ color: "var(--brand-navy)" }}
                >
                  <td className="px-2 py-2">{linha.label}</td>
                  {linha.valores.map((v) => (
                    <td
                      key={v.ano}
                      className="px-2 py-2 text-right tabular-nums"
                    >
                      {formatBRL(v.rs)}
                    </td>
                  ))}
                  {linha.deltas.map((d) => (
                    <td
                      key={d.intervalo}
                      className={`px-2 py-2 text-right tabular-nums font-semibold ${getDeltaClass(d.pct, linha.direcaoFavoravel)}`}
                    >
                      {formatPct(d.pct, true)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------
// View: Comentários
// ---------------------------------------------------------------------
function ViewComentarios({ data }: { data: DREData }) {
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {data.comentarios.map((c) => {
        const cfg = STATUS_CONFIG[c.status]
        return (
          <div
            key={c.id}
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 md:p-5"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: cfg.bg }}
              >
                <cfg.Icon size={18} style={{ color: cfg.color }} />
              </span>
              <h3
                className="pt-1 text-[13px] font-semibold leading-snug"
                style={{ color: "var(--brand-navy)" }}
              >
                {c.titulo}
              </h3>
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
  )
}
