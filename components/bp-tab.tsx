"use client"

import { useState, type ReactNode } from "react"
import { TrendingUp, AlertTriangle, Info } from "lucide-react"
import type { BPDadosCliente, BPLinhaAH } from "@/lib/clientes/empresa-001"
import { conteudoBP } from "@/lib/conteudos/analise-contabil"
import { TabHeaderCard } from "@/components/tab-header-card"

// ---------------------------------------------------------------------
// Helpers (idênticos ao DRETab)
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

/** Determina cor do delta: verde se favorável, vermelho se desfavorável, muted se neutra */
function getDeltaClass(
  pct: number,
  direcao: BPLinhaAH["direcaoFavoravel"]
): string {
  if (direcao === "neutra") return "text-muted-foreground"
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
// BPTab component
// ---------------------------------------------------------------------
type View = "vertical" | "horizontal" | "comentarios"

export function BPTab({ dados }: { dados: BPDadosCliente }) {
  const [view, setView] = useState<View>("vertical")

  return (
    <section>
      {/* Header */}
      <TabHeaderCard titulo="Balanço Patrimonial" intro={conteudoBP.intro} />

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
      {view === "vertical" && <ViewVertical dados={dados} />}
      {view === "horizontal" && <ViewHorizontal dados={dados} />}
      {view === "comentarios" && <ViewComentarios dados={dados} />}

      {/* Glossário */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 md:p-6">
        <details>
          <summary
            className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Glossário · Termos do Balanço Patrimonial +
          </summary>
          <dl className="mt-3 space-y-3">
            {conteudoBP.glossario.map((item) => (
              <div key={item.termo}>
                <dt
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {item.termo}
                </dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {item.definicao}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------

function ViewVertical({ dados }: { dados: BPDadosCliente }) {
  return (
    <div className="mt-6">
      {/* Legenda */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <p className="text-[11px] italic text-muted-foreground">
          {conteudoBP.legendaAV}
        </p>
      </div>

      {/* Tabela */}
      <div className="mt-4 mr-auto max-w-[920px] overflow-x-auto px-4 py-4 md:px-5">
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
          <thead className="bg-muted/40 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              <th className="px-2 py-2 text-left">Conta</th>
              <th className="px-2 py-2 text-right">2023 R$</th>
              <th className="px-2 py-2 text-right">2023 AV</th>
              <th className="px-2 py-2 text-right">2024 R$</th>
              <th className="px-2 py-2 text-right">2024 AV</th>
              <th className="px-2 py-2 text-right">2025 R$</th>
              <th className="px-2 py-2 text-right">2025 AV</th>
            </tr>
          </thead>
          <tbody>
            {dados.linhasAV.map((linha, idx) => {
              const isLast = idx === dados.linhasAV.length - 1
              // Estilo por tipo de linha
              let rowClass = ""
              if (linha.isHeaderSecao) {
                rowClass = "bg-muted/60"
              } else if (linha.isSubtotal) {
                rowClass = "bg-muted/40 font-semibold"
              }
              const textStyle = { color: "var(--brand-navy)" }
              const labelClass = linha.isHeaderSecao
                ? "text-[12px] font-extrabold uppercase tracking-[0.08em]"
                : "text-[12px]"

              return (
                <tr
                  key={linha.id}
                  className={`border-b border-border ${isLast ? "border-b-0" : ""} ${rowClass}`}
                  style={textStyle}
                >
                  <td className={`px-2 py-2 ${labelClass}`}>{linha.label}</td>
                  {linha.valores.map((v) => (
                    <>
                      <td
                        key={`${v.ano}-rs`}
                        className={`px-2 py-2 text-right tabular-nums ${linha.isHeaderSecao ? "font-extrabold" : ""}`}
                      >
                        {formatBRL(v.rs)}
                      </td>
                      <td
                        key={`${v.ano}-av`}
                        className={`px-2 py-2 text-right tabular-nums ${linha.isHeaderSecao ? "font-extrabold" : ""}`}
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

function ViewHorizontal({ dados }: { dados: BPDadosCliente }) {
  return (
    <div className="mt-6">
      {/* Legenda */}
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <p className="text-[11px] italic text-muted-foreground">
          {conteudoBP.legendaAH}
        </p>
      </div>

      {/* Tabela */}
      <div className="mt-4 mr-auto max-w-[920px] overflow-x-auto px-4 py-4 md:px-5">
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
          <thead className="bg-muted/40 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              <th className="px-2 py-2 text-left">Conta</th>
              <th className="px-2 py-2 text-right">2023</th>
              <th className="px-2 py-2 text-right">2024</th>
              <th className="px-2 py-2 text-right">2025</th>
              <th className="px-2 py-2 text-right">Δ 24/23</th>
              <th className="px-2 py-2 text-right">Δ 25/24</th>
              <th className="px-2 py-2 text-right">Δ 25/23</th>
            </tr>
          </thead>
          <tbody>
            {dados.linhasAH.map((linha, idx) => {
              const isLast = idx === dados.linhasAH.length - 1
              // Estilo por tipo de linha
              let rowClass = ""
              if (linha.isHeaderSecao) {
                rowClass = "bg-muted/60"
              } else if (linha.isSubtotal) {
                rowClass = "bg-muted/40 font-semibold"
              }
              const textStyle = { color: "var(--brand-navy)" }
              const labelClass = linha.isHeaderSecao
                ? "text-[12px] font-extrabold uppercase tracking-[0.08em]"
                : "text-[12px]"

              return (
                <tr
                  key={linha.id}
                  className={`border-b border-border ${isLast ? "border-b-0" : ""} ${rowClass}`}
                  style={textStyle}
                >
                  <td className={`px-2 py-2 ${labelClass}`}>{linha.label}</td>
                  {linha.valores.map((v) => (
                    <td
                      key={v.ano}
                      className={`px-2 py-2 text-right tabular-nums ${linha.isHeaderSecao ? "font-extrabold" : ""}`}
                    >
                      {linha.isHeaderSecao ? "—" : formatBRL(v.rs)}
                    </td>
                  ))}
                  {linha.deltas.map((d) => (
                    <td
                      key={d.intervalo}
                      className={`px-2 py-2 text-right tabular-nums font-semibold ${linha.isHeaderSecao ? "" : getDeltaClass(d.pct, linha.direcaoFavoravel)}`}
                    >
                      {linha.isHeaderSecao ? "—" : formatPct(d.pct, true)}
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

function ViewComentarios({ dados }: { dados: BPDadosCliente }) {
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-2">
      {dados.comentarios.map((c) => {
        const cfg = STATUS_CONFIG[c.status]
        return (
          <div
            key={c.id}
            className="flex gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: cfg.bg }}
            >
              <cfg.Icon size={16} style={{ color: cfg.color }} />
            </span>
            <div>
              <p
                className="text-[13px] font-semibold"
                style={{ color: "var(--brand-navy)" }}
              >
                {c.titulo}
              </p>
              <p
                className="mt-1 text-[12px] leading-relaxed"
                style={{ color: "var(--slate-700)" }}
              >
                {renderBold(c.corpo)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
