"use client"

import { useState, type ReactNode } from "react"
import type { IndicadoresDadosCliente } from "@/lib/clientes/empresa-001"
import { conteudoIndicadores } from "@/lib/conteudos/analise-contabil"

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function renderBold(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: "var(--brand-navy)", fontWeight: 600 }}>{part}</strong> : part
  )
}

const NOTE_LABEL_COLOR = {
  positivo: "var(--brand-green)",
  atencao: "var(--brand-warning)",
  info: "var(--brand-blue)",
}

// ---------------------------------------------------------------------
// IndicadoresTab component — replica HTML cfoup-tese
// ---------------------------------------------------------------------
export function IndicadoresTab({ dados }: { dados: IndicadoresDadosCliente }) {
  return (
    <section>
      {/* Tabela */}
      <div className="max-w-4xl overflow-hidden rounded-xl bg-card shadow-sm">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-muted">
              <th className="border-b-2 px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>Indicador</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2023</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2024</th>
              <th className="border-b-2 px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--border)", color: "var(--brand-navy)" }}>2025</th>
            </tr>
          </thead>
          <tbody>
            {dados.linhas.map((linha, idx) => {
              const isLast = idx === dados.linhas.length - 1
              return (
                <tr
                  key={linha.id}
                  className={`border-b hover:bg-muted/50 ${isLast ? "border-b-0" : ""}`}
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-3 py-2 pl-6 font-medium" style={{ color: "var(--brand-navy)" }}>{linha.label}</td>
                  {linha.valoresPorAno.map((v) => (
                    <td key={v.ano} className="px-3 py-2 text-right tabular-nums" style={{ color: "var(--brand-navy)" }}>{v.valor}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Bloco: O que esses números dizem no conjunto — card padrão */}
      <div
        className="mt-6 rounded-2xl border border-border p-6 md:p-8"
        style={{ background: "white" }}
      >
        <p
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--brand-blue)" }}
        >
          O que esses números dizem no conjunto
        </p>
        <div className="divide-y divide-border">
          {dados.comentarios.map((c) => (
            <div key={c.id} className="grid gap-4 py-4 first:pt-0 last:pb-0 md:grid-cols-[140px_1fr]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: NOTE_LABEL_COLOR[c.status] || "var(--brand-blue)" }}>{c.titulo}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>{renderBold(c.corpo)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Glossário inline */}
      <GlossarioInline glossario={conteudoIndicadores.glossario} label="Indicadores" />
    </section>
  )
}

function GlossarioInline({ glossario, label }: { glossario: { termo: string; definicao: string }[]; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-14 border-t border-border pt-8">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-6 py-4 text-left transition hover:border-[color:var(--brand-cyan)] hover:bg-muted">
        <span className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>Glossário</span>
          <span className="text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>Termos usados em {label}</span>
        </span>
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[16px] leading-none transition-transform ${open ? "rotate-45 bg-[color:var(--brand-cyan)] text-white" : "bg-muted text-[color:var(--brand-blue)]"}`}>+</span>
      </button>
      <div className={`overflow-hidden rounded-b-xl border border-t-0 border-border bg-card transition-all ${open ? "max-h-[3000px] border-dashed border-t" : "max-h-0 border-transparent"}`}>
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
