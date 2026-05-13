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
      {/* H2 + lede */}
      <h2
        className="mb-2 text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
        style={{ color: "var(--brand-navy)" }}
      >
        Perguntas ao Contador
      </h2>
      <p className="mb-6 max-w-[1180px] text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
        {conteudoAoContador.intro}
      </p>

      {/* Questions card */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
        {dados.grupos.map((grupo) => (
          <div key={grupo.id} className="mb-7 last:mb-0">
            {/* Título */}
            <h3
              className="mb-1 text-base font-bold leading-snug"
              style={{ color: "var(--brand-navy)" }}
            >
              {grupo.numero}. {grupo.titulo}
            </h3>
            {/* Contexto */}
            <p className="mb-3 text-[12px] italic" style={{ color: "var(--brand-ink-muted)" }}>
              {grupo.contexto}
            </p>
            {/* Lista */}
            <ol className="list-none space-y-0">
              {grupo.perguntas.map((pergunta, idx) => (
                <li
                  key={idx}
                  className="relative border-b border-border py-3 pl-10 text-[13px] leading-relaxed last:border-b-0"
                  style={{ color: "var(--brand-ink-muted)" }}
                >
                  <span
                    className="absolute left-0 top-3 w-7 text-[13px] font-bold tabular-nums"
                    style={{ color: "var(--brand-cyan)" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {pergunta}
                </li>
              ))}
            </ol>
          </div>
        ))}
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
