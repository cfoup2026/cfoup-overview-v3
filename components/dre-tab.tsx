"use client"

import { useState, type ReactNode } from "react"
import type { DREData, DRELinhaAH } from "@/lib/clientes/empresa-001"
import { conteudoDRE } from "@/lib/conteudos/analise-contabil"

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
    i % 2 === 1 ? <strong key={i} style={{ color: "var(--brand-navy)", fontWeight: 600 }}>{part}</strong> : part
  )
}

/** Determina cor do delta conforme HTML: verde se favorável, vermelho se desfavorável */
function getPctClass(pct: number, direcao: DRELinhaAH["direcaoFavoravel"]): string {
  const isFavoravel =
    (direcao === "cresce" && pct >= 0) || (direcao === "cai" && pct <= 0)
  return isFavoravel ? "text-[color:var(--brand-green)]" : "text-[color:var(--brand-error-soft)]"
}

// ---------------------------------------------------------------------
// Note label color by status
// ---------------------------------------------------------------------
const NOTE_LABEL_COLOR = {
  positivo: "var(--brand-green)",
  atencao: "var(--brand-warning)",
  info: "var(--brand-blue)",
}

// ---------------------------------------------------------------------
// DRETab component
// ---------------------------------------------------------------------
type View = "vertical" | "horizontal" | "comentarios"

export function DRETab({ data }: { data: DREData }) {
  const [view, setView] = useState<View>("vertical")

  return (
    <section>
      {/* H2 + lede */}
      <h2
        className="mb-2 text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
        style={{ color: "var(--brand-navy)" }}
      >
        Demonstração do Resultado
      </h2>
      <p className="mb-6 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">
        {data.intro}
      </p>

      {/* Subtabs — matches HTML .subtabs */}
      <div className="mb-6 flex w-fit gap-1 rounded-xl bg-muted p-1">
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
              className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition ${
                isActive
                  ? "bg-[color:var(--brand-blue)] text-white"
                  : "bg-transparent text-muted-foreground hover:text-[color:var(--brand-blue)]"
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

      {/* Glossário inline */}
      <GlossarioInline glossario={conteudoDRE.glossario} label="DRE" />
    </section>
  )
}

// ---------------------------------------------------------------------
// View: Análise Vertical — matches HTML .tbl-wrap
// ---------------------------------------------------------------------
function ViewVertical({ data }: { data: DREData }) {
  return (
    <div>
      {/* Legenda */}
      <p className="mb-2 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">
        {renderBold(data.legendaAV)}
      </p>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl bg-card shadow-sm">
        <table className="w-full border-collapse text-[13px]">
          <caption className="px-6 pb-2 pt-4 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            DRE — peso de cada linha sobre a Receita Líquida
          </caption>
          <thead>
            <tr className="bg-muted">
              <th
                className="border-b-2 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ borderColor: "var(--border)", color: "var(--brand-navy)", width: "34%" }}
              >
                Linha
              </th>
              <th
                colSpan={2}
                className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}
              >
                2023
              </th>
              <th
                colSpan={2}
                className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}
              >
                2024
              </th>
              <th
                colSpan={2}
                className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}
              >
                2025
              </th>
            </tr>
            <tr className="bg-muted">
              <th className="border-b-2 px-3 py-2" style={{ borderColor: "var(--border)" }} />
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>R$</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>AV</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>R$</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>AV</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>R$</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>AV</th>
            </tr>
          </thead>
          <tbody>
            {data.linhasAV.map((linha, idx) => {
              const isLast = idx === data.linhasAV.length - 1
              // Row classes per HTML: tr.subtotal, tr.total, tr.indent
              let rowStyle: React.CSSProperties = {}
              let rowClass = ""
              let labelPadding = "pl-6"
              if (linha.isLucroLiquido) {
                rowStyle = { background: "var(--brand-navy)" }
                rowClass = "font-bold text-white"
              } else if (linha.isSubtotal) {
                rowStyle = { background: "var(--muted)", color: "var(--brand-navy)" }
                rowClass = "font-semibold"
              } else if (linha.isIndent) {
                labelPadding = "pl-10"
                rowStyle = { color: "var(--brand-ink-muted)" }
              } else {
                rowStyle = { color: "var(--brand-navy)" }
              }
              return (
                <tr
                  key={linha.id}
                  className={`border-b hover:bg-muted/50 ${rowClass} ${isLast ? "border-b-0" : ""}`}
                  style={{ ...rowStyle, borderColor: "var(--border)" }}
                >
                  <td className={`px-3 py-2 text-left font-medium ${labelPadding}`}>
                    {linha.label}
                  </td>
                  {linha.valores.map((v) => (
                    <>
                      <td key={`${v.ano}-rs`} className="px-3 py-2 text-right tabular-nums">
                        {formatBRL(v.rs)}
                      </td>
                      <td key={`${v.ano}-av`} className="px-3 py-2 text-right tabular-nums">
                        <span className={`inline-block min-w-[48px] pl-2 text-right text-[11px] font-medium ${linha.isLucroLiquido ? "text-[color:var(--brand-cyan)]" : ""}`}>
                          {formatPct(v.av)}
                        </span>
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
    <div>
      {/* Legenda */}
      <p className="mb-2 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">
        {renderBold(data.legendaAH)}
      </p>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl bg-card shadow-sm">
        <table className="w-full border-collapse text-[13px]">
          <caption className="px-6 pb-2 pt-4 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            DRE — quanto cada linha cresceu ou caiu entre os anos
          </caption>
          <thead>
            <tr className="bg-muted">
              <th className="border-b-2 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)", width: "38%" }}>Linha</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2023</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2024</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2025</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>Δ 24/23</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>Δ 25/24</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>Δ 25/23</th>
            </tr>
          </thead>
          <tbody>
            {data.linhasAH.map((linha, idx) => {
              const isLast = idx === data.linhasAH.length - 1
              let rowStyle: React.CSSProperties = {}
              let rowClass = ""
              if (linha.isLucroLiquido) {
                rowStyle = { background: "var(--brand-navy)" }
                rowClass = "font-bold text-white"
              } else if (linha.isSubtotal) {
                rowStyle = { background: "var(--muted)", color: "var(--brand-navy)" }
                rowClass = "font-semibold"
              } else {
                rowStyle = { color: "var(--brand-navy)" }
              }
              return (
                <tr
                  key={linha.id}
                  className={`border-b hover:bg-muted/50 ${rowClass} ${isLast ? "border-b-0" : ""}`}
                  style={{ ...rowStyle, borderColor: "var(--border)" }}
                >
                  <td className="px-3 py-2 pl-6 text-left font-medium">{linha.label}</td>
                  {linha.valores.map((v) => (
                    <td key={v.ano} className="px-3 py-2 text-right tabular-nums">
                      {formatBRL(v.rs)}
                    </td>
                  ))}
                  {linha.deltas.map((d) => (
                    <td key={d.intervalo} className="px-3 py-2 text-right tabular-nums">
                      <span className={`inline-block min-w-[48px] pl-2 text-right text-[11px] font-medium ${linha.isLucroLiquido ? "text-[color:var(--brand-cyan)]" : getPctClass(d.pct, linha.direcaoFavoravel)}`}>
                        {formatPct(d.pct, true)}
                      </span>
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
// View: Comentários — matches HTML .notes
// ---------------------------------------------------------------------
function ViewComentarios({ data }: { data: DREData }) {
  return (
    <div className="rounded-xl border border-border bg-card py-2">
      {data.comentarios.map((c, idx) => {
        const labelColor = NOTE_LABEL_COLOR[c.status] || "var(--brand-blue)"
        const isLast = idx === data.comentarios.length - 1
        return (
          <div
            key={c.id}
            className={`grid gap-6 px-7 py-4 md:grid-cols-[140px_1fr] ${isLast ? "" : "border-b border-border"}`}
          >
            <p
              className="pt-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: labelColor }}
            >
              {c.titulo}
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
              {renderBold(c.corpo)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------
// Glossário Inline — matches HTML .glossary-inline
// ---------------------------------------------------------------------
function GlossarioInline({
  glossario,
  label,
}: {
  glossario: { termo: string; definicao: string }[]
  label: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-14 border-t border-border pt-8">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-6 py-4 text-left transition hover:border-[color:var(--brand-cyan)] hover:bg-muted"
      >
        <span className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>Glossário</span>
          <span className="text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>Termos usados no {label}</span>
        </span>
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[16px] leading-none transition-transform ${open ? "rotate-45 bg-[color:var(--brand-cyan)] text-white" : "bg-muted text-[color:var(--brand-blue)]"}`}>+</span>
      </button>
      <div
        className={`overflow-hidden rounded-b-xl border border-t-0 border-border bg-card transition-all ${open ? "max-h-[3000px] border-dashed border-t" : "max-h-0 border-transparent"}`}
      >
        <div className="px-7 pb-2 pt-6">
          {glossario.map((item) => (
            <div key={item.termo} className="border-b border-border py-4 last:border-b-0">
              <p className="mb-1 text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>{item.termo}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{item.definicao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
