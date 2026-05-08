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
  positivo: "var(--pos)",
  atencao: "var(--warn)",
  info: "var(--brand-blue)",
}

// ---------------------------------------------------------------------
// IndicadoresTab component — replica HTML cfoup-tese
// ---------------------------------------------------------------------
export function IndicadoresTab({ dados }: { dados: IndicadoresDadosCliente }) {
  return (
    <section>
      {/* H2 + lede */}
      <h2
        className="mb-2 text-[30px] leading-[1.1] tracking-[-0.01em]"
        style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-navy)" }}
      >
        Indicadores
      </h2>
      <p
        className="mb-6 max-w-[1180px] text-[15.5px] leading-[1.65]"
        style={{ color: "var(--muted-html)" }}
      >
        {conteudoIndicadores.intro}
      </p>

      {/* Tabela */}
      <div
        className="overflow-hidden rounded-xl shadow-[0_1px_3px_rgba(7,29,59,0.04),0_8px_24px_rgba(7,29,59,0.04)]"
        style={{ background: "#fff" }}
      >
        <table className="w-full border-collapse text-[13px]">
          <caption
            className="px-6 pb-1 pt-4 text-left text-[11px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: "var(--muted-html)" }}
          >
            Principais indicadores — o que cada um responde
          </caption>
          <thead>
            <tr style={{ background: "var(--tbl-header-bg)" }}>
              <th className="border-b-2 px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)", width: "34%" }}>Indicador</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>2023</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>2024</th>
              <th className="border-b-2 px-3 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)" }}>2025</th>
              <th className="border-b-2 px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ borderColor: "var(--line)", color: "var(--brand-navy)", width: "34%" }}>O que quer dizer</th>
            </tr>
          </thead>
          <tbody>
            {dados.linhas.map((linha, idx) => {
              const isLast = idx === dados.linhas.length - 1
              return (
                <tr
                  key={linha.id}
                  className={`border-b hover:bg-[color:var(--tbl-row-hover)] ${isLast ? "border-b-0" : ""}`}
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="px-3 py-2.5 pl-6 font-medium" style={{ color: "var(--brand-navy)" }}>{linha.label}</td>
                  {linha.valoresPorAno.map((v) => (
                    <td key={v.ano} className="px-3 py-2.5 text-right tabular-nums" style={{ color: "var(--brand-navy)" }}>{v.valor}</td>
                  ))}
                  <td className="px-3 py-2.5 text-left text-[12px]" style={{ color: "var(--muted-html)" }}>{linha.explicacao}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* H3 + notes */}
      <h3
        className="mb-3 mt-8 text-[17px] font-semibold tracking-[-0.005em]"
        style={{ color: "var(--brand-navy)" }}
      >
        O que esses números dizem no conjunto
      </h3>
      <div className="rounded-xl border bg-white py-2" style={{ borderColor: "var(--line)" }}>
        {dados.comentarios.map((c, idx) => {
          const labelColor = NOTE_LABEL_COLOR[c.status] || "var(--brand-blue)"
          const isLast = idx === dados.comentarios.length - 1
          return (
            <div
              key={c.id}
              className={`grid gap-6 px-7 py-4 md:grid-cols-[140px_1fr] ${isLast ? "" : "border-b"}`}
              style={{ borderColor: "var(--line)" }}
            >
              <p className="pt-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em]" style={{ color: labelColor }}>{c.titulo}</p>
              <p className="text-[14px] leading-[1.65]" style={{ color: "#243042" }}>{renderBold(c.corpo)}</p>
            </div>
          )
        })}
      </div>

      {/* Glossário inline */}
      <GlossarioInline glossario={conteudoIndicadores.glossario} label="Indicadores" />
    </section>
  )
}

function GlossarioInline({ glossario, label }: { glossario: { termo: string; definicao: string }[]; label: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-14 border-t pt-8" style={{ borderColor: "var(--line)" }}>
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-[10px] border bg-white px-6 py-4 text-left transition hover:border-[color:var(--brand-cyan)] hover:bg-[#FAFCFF]" style={{ borderColor: "var(--line)" }}>
        <span className="flex items-center gap-3">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--brand-blue)" }}>Glossário</span>
          <span className="text-[13.5px] font-semibold tracking-[0.02em]" style={{ color: "var(--brand-navy)" }}>Termos usados em {label}</span>
        </span>
        <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[16px] leading-none transition-transform ${open ? "rotate-45 bg-[color:var(--brand-cyan)] text-white" : "bg-[#EEF3F9] text-[color:var(--brand-blue)]"}`}>+</span>
      </button>
      <div className={`overflow-hidden rounded-b-[10px] border border-t-0 bg-white transition-all ${open ? "max-h-[3000px] border-dashed border-t" : "max-h-0 border-transparent"}`} style={{ borderColor: open ? "var(--line)" : "transparent" }}>
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
