"use client"

import { useState, type ReactNode } from "react"
import type { BPDadosCliente, BPLinhaAH } from "@/lib/clientes/empresa-001"
import { conteudoBP } from "@/lib/conteudos/analise-contabil"

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function formatBRL(n: number | null): string {
  if (n === null) return "—"
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString("pt-BR", { maximumFractionDigits: 0 })
  return n < 0 ? `(${formatted})` : formatted
}

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

function renderBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: "var(--brand-navy)", fontWeight: 600 }}>{part}</strong> : part
  )
}

function getPctClass(pct: number, direcao: BPLinhaAH["direcaoFavoravel"]): string {
  if (direcao === "neutra") return ""
  const isFavoravel =
    (direcao === "cresce" && pct >= 0) || (direcao === "cai" && pct <= 0)
  return isFavoravel ? "text-[color:var(--brand-green)]" : "text-[color:var(--brand-error-soft)]"
}

const NOTE_LABEL_COLOR = {
  positivo: "var(--brand-green)",
  atencao: "var(--brand-warning)",
  info: "var(--brand-blue)",
}

// ---------------------------------------------------------------------
// BPTab component
// ---------------------------------------------------------------------
type View = "vertical" | "horizontal" | "comentarios"

export function BPTab({ dados }: { dados: BPDadosCliente }) {
  const [view, setView] = useState<View>("vertical")

  return (
    <section>
      {/* H2 + lede */}
      <h2
        className="mb-2 text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
        style={{ color: "var(--brand-navy)" }}
      >
        Balanço Patrimonial
      </h2>
      <p className="mb-6 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">
        {conteudoBP.intro}
      </p>

      {/* Subtabs */}
      <div className="mb-6 flex w-fit gap-1 rounded-xl bg-muted p-1">
        {(["vertical", "horizontal", "comentarios"] as View[]).map((v) => {
          const isActive = view === v
          const label = v === "vertical" ? "Análise Vertical" : v === "horizontal" ? "Análise Horizontal" : "Comentários"
          return (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition ${
                isActive ? "bg-[color:var(--brand-blue)] text-white" : "bg-transparent text-muted-foreground hover:text-[color:var(--brand-blue)]"
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {view === "vertical" && <ViewVertical dados={dados} />}
      {view === "horizontal" && <ViewHorizontal dados={dados} />}
      {view === "comentarios" && <ViewComentarios dados={dados} />}

      <GlossarioInline glossario={conteudoBP.glossario} label="Balanço Patrimonial" />
    </section>
  )
}

function ViewVertical({ dados }: { dados: BPDadosCliente }) {
  return (
    <div>
      <p className="mb-2 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">
        {conteudoBP.legendaAV}
      </p>
      <div className="overflow-hidden rounded-xl bg-card shadow-sm">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-muted">
              <th className="border-b-2 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)", width: "34%" }}>Conta</th>
              <th colSpan={2} className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2023</th>
              <th colSpan={2} className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2024</th>
              <th colSpan={2} className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2025</th>
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
            {dados.linhasAV.map((linha, idx) => {
              const isLast = idx === dados.linhasAV.length - 1
              let rowStyle: React.CSSProperties = { color: "var(--brand-navy)" }
              let rowClass = ""
              let labelClass = ""
              if (linha.isHeaderSecao) {
                rowStyle = { background: "var(--muted)", color: "var(--brand-navy)" }
                rowClass = "font-extrabold"
                labelClass = "text-[12px] uppercase tracking-[0.08em]"
              } else if (linha.isSubtotal) {
                rowStyle = { background: "var(--muted)", color: "var(--brand-navy)" }
                rowClass = "font-semibold"
              }
              return (
                <tr key={linha.id} className={`border-b hover:bg-muted/50 ${rowClass} ${isLast ? "border-b-0" : ""}`} style={{ ...rowStyle, borderColor: "var(--border)" }}>
                  <td className={`px-3 py-2 pl-6 text-left font-medium ${labelClass}`}>{linha.label}</td>
                  {linha.valores.map((v) => (
                    <>
                      <td key={`${v.ano}-rs`} className="px-3 py-2 text-right tabular-nums">{formatBRL(v.rs)}</td>
                      <td key={`${v.ano}-av`} className="px-3 py-2 text-right tabular-nums"><span className="inline-block min-w-[48px] pl-2 text-right text-[11px] font-medium">{formatPct(v.av)}</span></td>
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
    <div>
      <p className="mb-2 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">{conteudoBP.legendaAH}</p>
      <div className="overflow-hidden rounded-xl bg-card shadow-sm">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-muted">
              <th className="border-b-2 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)", width: "38%" }}>Conta</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2023</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2024</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2025</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>Δ 24/23</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>Δ 25/24</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>Δ 25/23</th>
            </tr>
          </thead>
          <tbody>
            {dados.linhasAH.map((linha, idx) => {
              const isLast = idx === dados.linhasAH.length - 1
              let rowStyle: React.CSSProperties = { color: "var(--brand-navy)" }
              let rowClass = ""
              let labelClass = ""
              if (linha.isHeaderSecao) {
                rowStyle = { background: "var(--muted)", color: "var(--brand-navy)" }
                rowClass = "font-extrabold"
                labelClass = "text-[12px] uppercase tracking-[0.08em]"
              } else if (linha.isSubtotal) {
                rowStyle = { background: "var(--muted)", color: "var(--brand-navy)" }
                rowClass = "font-semibold"
              }
              return (
                <tr key={linha.id} className={`border-b hover:bg-muted/50 ${rowClass} ${isLast ? "border-b-0" : ""}`} style={{ ...rowStyle, borderColor: "var(--border)" }}>
                  <td className={`px-3 py-2 pl-6 text-left font-medium ${labelClass}`}>{linha.label}</td>
                  {linha.valores.map((v) => (
                    <td key={v.ano} className="px-3 py-2 text-right tabular-nums">{linha.isHeaderSecao ? "—" : formatBRL(v.rs)}</td>
                  ))}
                  {linha.deltas.map((d) => (
                    <td key={d.intervalo} className="px-3 py-2 text-right tabular-nums">
                      <span className={`inline-block min-w-[48px] pl-2 text-right text-[11px] font-medium ${linha.isHeaderSecao ? "" : getPctClass(d.pct, linha.direcaoFavoravel)}`}>
                        {linha.isHeaderSecao ? "—" : formatPct(d.pct, true)}
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

function ViewComentarios({ dados }: { dados: BPDadosCliente }) {
  return (
    <div className="rounded-xl border border-border bg-card py-2">
      {dados.comentarios.map((c, idx) => {
        const labelColor = NOTE_LABEL_COLOR[c.status] || "var(--brand-blue)"
        const isLast = idx === dados.comentarios.length - 1
        return (
          <div key={c.id} className={`grid gap-6 px-7 py-4 md:grid-cols-[140px_1fr] ${isLast ? "" : "border-b border-border"}`}>
            <p className="pt-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: labelColor }}>{c.titulo}</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{renderBold(c.corpo)}</p>
          </div>
        )
      })}
    </div>
  )
}

function GlossarioInline({ glossario, label }: { glossario: { termo: string; definicao: string }[]; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-14 border-t border-border pt-8">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-6 py-4 text-left transition hover:border-[color:var(--brand-cyan)] hover:bg-muted">
        <span className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>Glossário</span>
          <span className="text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>Termos usados no {label}</span>
        </span>
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[16px] leading-none transition-transform ${open ? "rotate-45 bg-[color:var(--brand-cyan)] text-white" : "bg-muted text-[color:var(--brand-blue)]"}`}>+</span>
      </button>
      <div className={`overflow-hidden rounded-b-xl border border-t-0 border-border bg-card transition-all ${open ? "max-h-[3000px] border-dashed border-t" : "max-h-0 border-transparent"}`}>
        <div className="px-7 pb-2 pt-6">
          {glossario.map((item) => (
            <div key={item.termo} className="border-b border-border py-4 last:border-b-0">
              <p className="mb-1 text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>{item.termo}</p>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{item.definicao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
