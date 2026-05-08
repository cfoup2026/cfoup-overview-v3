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
  return isFavoravel ? "text-[color:var(--pos)]" : "text-[color:var(--neg)]"
}

// ---------------------------------------------------------------------
// Note label color by status
// ---------------------------------------------------------------------
const NOTE_LABEL_COLOR = {
  positivo: "var(--pos)",
  atencao: "var(--warn)",
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
        className="mb-2 text-[30px] leading-[1.1] tracking-[-0.01em]"
        style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-navy)" }}
      >
        Demonstração do Resultado
      </h2>
      <p
        className="mb-6 max-w-[1180px] text-[15.5px] leading-[1.65]"
        style={{ color: "var(--muted-html)" }}
      >
        {data.intro}
      </p>

      {/* Subtabs — matches HTML .subtabs */}
      <div
        className="mb-6 flex w-fit gap-1 rounded-[10px] p-1"
        style={{ background: "#EEF3F9" }}
      >
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
              className={`rounded-[7px] px-4 py-2 text-[12.5px] font-semibold tracking-[0.02em] transition ${
                isActive
                  ? "bg-[color:var(--brand-blue)] text-white"
                  : "bg-transparent text-[color:var(--muted-html)] hover:text-[color:var(--brand-blue)]"
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
      <p
        className="mb-2 max-w-[1180px] text-[13.5px]"
        style={{ color: "var(--muted-html)" }}
      >
        {renderBold(data.legendaAV)}
      </p>

      {/* Tabela */}
      <div
        className="overflow-hidden rounded-xl shadow-[0_1px_3px_rgba(7,29,59,0.04),0_8px_24px_rgba(7,29,59,0.04)]"
        style={{ background: "var(--white, #fff)" }}
      >
        <table className="w-full border-collapse text-[13px]">
          <caption
            className="px-6 pb-1 pt-4 text-left text-[11px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: "var(--muted-html)" }}
          >
            DRE — peso de cada linha sobre a Receita Líquida
          </caption>
          <thead>
            <tr style={{ background: "var(--tbl-header-bg)" }}>
              <th
                className="border-b-2 px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ borderColor: "var(--line)", color: "var(--brand-navy)", width: "34%" }}
              >
                Linha
              </th>
              <th
                colSpan={2}
                className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}
              >
                2023
              </th>
              <th
                colSpan={2}
                className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}
              >
                2024
              </th>
              <th
                colSpan={2}
                className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}
              >
                2025
              </th>
            </tr>
            <tr style={{ background: "var(--tbl-header-bg)" }}>
              <th className="border-b-2 px-3 py-2" style={{ borderColor: "var(--line)" }} />
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>R$</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>AV</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>R$</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>AV</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>R$</th>
              <th className="border-b-2 px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>AV</th>
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
                rowStyle = { background: "var(--brand-navy)", color: "#fff" }
                rowClass = "font-bold"
              } else if (linha.isSubtotal) {
                rowStyle = { background: "#F4F8FD", color: "var(--brand-navy)" }
                rowClass = "font-semibold"
              } else if (linha.isIndent) {
                labelPadding = "pl-10"
                rowStyle = { color: "#3D4D66" }
              } else {
                rowStyle = { color: "#1F2A3D" }
              }
              return (
                <tr
                  key={linha.id}
                  className={`border-b hover:bg-[color:var(--tbl-row-hover)] ${rowClass} ${isLast ? "border-b-0" : ""}`}
                  style={{ ...rowStyle, borderColor: "var(--line)" }}
                >
                  <td className={`px-3 py-2.5 text-left font-medium ${labelPadding}`}>
                    {linha.label}
                  </td>
                  {linha.valores.map((v) => (
                    <>
                      <td key={`${v.ano}-rs`} className="px-3 py-2.5 text-right tabular-nums">
                        {formatBRL(v.rs)}
                      </td>
                      <td key={`${v.ano}-av`} className="px-3 py-2.5 text-right tabular-nums">
                        <span className={`inline-block min-w-[48px] pl-1.5 text-right text-[11px] font-medium ${linha.isLucroLiquido ? "text-[#9FCAE5]" : ""}`}>
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
      <p
        className="mb-2 max-w-[1180px] text-[13.5px]"
        style={{ color: "var(--muted-html)" }}
      >
        {renderBold(data.legendaAH)}
      </p>

      {/* Tabela */}
      <div
        className="overflow-hidden rounded-xl shadow-[0_1px_3px_rgba(7,29,59,0.04),0_8px_24px_rgba(7,29,59,0.04)]"
        style={{ background: "var(--white, #fff)" }}
      >
        <table className="w-full border-collapse text-[13px]">
          <caption
            className="px-6 pb-1 pt-4 text-left text-[11px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: "var(--muted-html)" }}
          >
            DRE — quanto cada linha cresceu ou caiu entre os anos
          </caption>
          <thead>
            <tr style={{ background: "var(--tbl-header-bg)" }}>
              <th className="border-b-2 px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)", width: "38%" }}>Linha</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>2023</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>2024</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>2025</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>Δ 24/23</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>Δ 25/24</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>Δ 25/23</th>
            </tr>
          </thead>
          <tbody>
            {data.linhasAH.map((linha, idx) => {
              const isLast = idx === data.linhasAH.length - 1
              let rowStyle: React.CSSProperties = {}
              let rowClass = ""
              if (linha.isLucroLiquido) {
                rowStyle = { background: "var(--brand-navy)", color: "#fff" }
                rowClass = "font-bold"
              } else if (linha.isSubtotal) {
                rowStyle = { background: "#F4F8FD", color: "var(--brand-navy)" }
                rowClass = "font-semibold"
              } else {
                rowStyle = { color: "#1F2A3D" }
              }
              return (
                <tr
                  key={linha.id}
                  className={`border-b hover:bg-[color:var(--tbl-row-hover)] ${rowClass} ${isLast ? "border-b-0" : ""}`}
                  style={{ ...rowStyle, borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2.5 pl-6 text-left font-medium">{linha.label}</td>
                  {linha.valores.map((v) => (
                    <td key={v.ano} className="px-3 py-2.5 text-right tabular-nums">
                      {formatBRL(v.rs)}
                    </td>
                  ))}
                  {linha.deltas.map((d) => (
                    <td key={d.intervalo} className="px-3 py-2.5 text-right tabular-nums">
                      <span className={`inline-block min-w-[48px] pl-1.5 text-right text-[11px] font-medium ${linha.isLucroLiquido ? "text-[#9FCAE5]" : getPctClass(d.pct, linha.direcaoFavoravel)}`}>
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
    <div
      className="rounded-xl border bg-white py-2"
      style={{ borderColor: "var(--line)" }}
    >
      {data.comentarios.map((c, idx) => {
        const labelColor = NOTE_LABEL_COLOR[c.status] || "var(--brand-blue)"
        const isLast = idx === data.comentarios.length - 1
        return (
          <div
            key={c.id}
            className={`grid gap-6 px-7 py-4 md:grid-cols-[140px_1fr] ${isLast ? "" : "border-b"}`}
            style={{ borderColor: "var(--line)" }}
          >
            <p
              className="pt-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em]"
              style={{ color: labelColor }}
            >
              {c.titulo}
            </p>
            <p
              className="text-[14px] leading-[1.65]"
              style={{ color: "#243042" }}
            >
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
    <div className="mt-14 border-t pt-8" style={{ borderColor: "var(--line)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-[10px] border bg-white px-6 py-4 text-left transition hover:border-[color:var(--brand-cyan)] hover:bg-[#FAFCFF]"
        style={{ borderColor: "var(--line)" }}
      >
        <span className="flex items-center gap-3">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--brand-blue)" }}>Glossário</span>
          <span className="text-[13.5px] font-semibold tracking-[0.02em]" style={{ color: "var(--brand-navy)" }}>Termos usados no {label}</span>
        </span>
        <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[16px] leading-none transition-transform ${open ? "rotate-45 bg-[color:var(--brand-cyan)] text-white" : "bg-[#EEF3F9] text-[color:var(--brand-blue)]"}`}>+</span>
      </button>
      <div
        className={`overflow-hidden rounded-b-[10px] border border-t-0 bg-white transition-all ${open ? "max-h-[3000px] border-dashed border-t" : "max-h-0 border-transparent"}`}
        style={{ borderColor: open ? "var(--line)" : "transparent" }}
      >
        <div className="px-7 pb-2 pt-6">
          {glossario.map((item) => (
            <div key={item.termo} className="border-b py-3.5 last:border-b-0" style={{ borderColor: "#F0F3F8" }}>
              <p className="mb-1 text-[14px] font-semibold tracking-[-0.005em]" style={{ color: "var(--brand-navy)" }}>{item.termo}</p>
              <p className="text-[13.5px] leading-[1.6]" style={{ color: "#3D4D66" }}>{item.definicao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
