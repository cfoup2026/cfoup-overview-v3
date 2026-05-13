"use client"

import { useState } from "react"
import { conteudoAoContador } from "@/lib/conteudos/analise-contabil"
import type { AoContadorDadosCliente } from "@/lib/clientes/empresa-001"

type Props = {
  dados: AoContadorDadosCliente
}

// ---------------------------------------------------------------------
// AoContadorTab — replica HTML .questions cfoup-tese
// ---------------------------------------------------------------------
export function AoContadorTab({ dados }: Props) {
  return (
    <section>
      {/* Card único: pauta operacional */}
      <div
        className="rounded-2xl border border-border p-6 md:p-8"
        style={{ background: "white" }}
      >
        <p
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--brand-blue)" }}
        >
          Pauta de alinhamento com o contador
        </p>

        <div className="divide-y divide-border">
          {dados.grupos.map((grupo) => (
            <div key={grupo.id} className="py-5 first:pt-0 last:pb-0">
              {/* Eyebrow do grupo */}
              <p
                className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-blue)" }}
              >
                {grupo.numero} · {grupo.titulo}
              </p>
              {/* Contexto */}
              <p className="mb-4 text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
                {grupo.contexto}
              </p>
              {/* Perguntas */}
              <ul className="space-y-2">
                {grupo.perguntas.map((pergunta, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[13px] leading-relaxed"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--brand-blue)" }}
                    />
                    {pergunta}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Glossário inline */}
      {conteudoAoContador.glossario.length > 0 && (
        <GlossarioInline glossario={conteudoAoContador.glossario} label="Perguntas ao Contador" />
      )}
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
          <span className="text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>Termos usados nas {label}</span>
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
