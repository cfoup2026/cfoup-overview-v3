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
        className="mb-2 text-[30px] leading-[1.1] tracking-[-0.01em]"
        style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-navy)" }}
      >
        Perguntas ao Contador
      </h2>
      <p
        className="mb-6 max-w-[1180px] text-[15.5px] leading-[1.65]"
        style={{ color: "var(--muted-html)" }}
      >
        {conteudoAoContador.intro}
      </p>

      {/* Questions card */}
      <div
        className="rounded-[14px] border p-9 shadow-[0_8px_32px_rgba(7,29,59,0.04)] md:p-10"
        style={{
          background: "linear-gradient(180deg, #fff 0%, #FAFCFF 100%)",
          borderColor: "var(--line)",
        }}
      >
        {dados.grupos.map((grupo) => (
          <div key={grupo.id} className="mb-7 last:mb-0">
            {/* Título */}
            <h3
              className="mb-1 text-[19px] tracking-[-0.005em]"
              style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-navy)" }}
            >
              {grupo.numero}. {grupo.titulo}
            </h3>
            {/* Contexto */}
            <p
              className="mb-3.5 text-[12.5px] italic tracking-[0.01em]"
              style={{ color: "var(--muted-html)" }}
            >
              {grupo.contexto}
            </p>
            {/* Lista */}
            <ol className="list-none space-y-0">
              {grupo.perguntas.map((pergunta, idx) => (
                <li
                  key={idx}
                  className="relative border-b py-3 pl-10 text-[14px] leading-[1.55] last:border-b-0"
                  style={{ borderColor: "var(--line)", color: "#1F2A3D" }}
                >
                  <span
                    className="absolute left-0 top-3 w-7 text-[13px]"
                    style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-cyan)" }}
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
    <div className="mt-14 border-t pt-8" style={{ borderColor: "var(--line)" }}>
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between rounded-[10px] border bg-white px-6 py-4 text-left transition hover:border-[color:var(--brand-cyan)] hover:bg-[#FAFCFF]" style={{ borderColor: "var(--line)" }}>
        <span className="flex items-center gap-3">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--brand-blue)" }}>Glossário</span>
          <span className="text-[13.5px] font-semibold tracking-[0.02em]" style={{ color: "var(--brand-navy)" }}>Termos usados nas {label}</span>
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
