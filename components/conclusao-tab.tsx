"use client"

import { conteudoConclusao } from "@/lib/conteudos/analise-contabil"
import type { ConclusaoDadosCliente } from "@/lib/clientes/empresa-001"

const NOTE_LABEL_COLOR = {
  positivo: "var(--pos)",
  atencao: "var(--warn)",
  info: "var(--brand-blue)",
}

// ---------------------------------------------------------------------
// ConclusaoTab — replica HTML .notes + callout cfoup-tese
// ---------------------------------------------------------------------
export function ConclusaoTab({ dados }: { dados: ConclusaoDadosCliente }) {
  return (
    <section>
      {/* H2 + lede */}
      <h2
        className="mb-2 text-[30px] leading-[1.1] tracking-[-0.01em]"
        style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-navy)" }}
      >
        Conclusão
      </h2>
      <p
        className="mb-6 max-w-[1180px] text-[15.5px] leading-[1.65]"
        style={{ color: "var(--muted-html)" }}
      >
        {conteudoConclusao.intro}
      </p>

      {/* Notes */}
      <div
        className="rounded-xl border bg-white py-2"
        style={{ borderColor: "var(--line)" }}
      >
        {dados.cards.map((card, idx) => {
          const labelColor = NOTE_LABEL_COLOR[card.status] || "var(--brand-blue)"
          const isLast = idx === dados.cards.length - 1
          return (
            <div
              key={card.id}
              className={`grid gap-6 px-7 py-4 md:grid-cols-[140px_1fr] ${isLast ? "" : "border-b"}`}
              style={{ borderColor: "var(--line)" }}
            >
              <p
                className="pt-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em]"
                style={{ color: labelColor }}
              >
                {card.titulo}
              </p>
              <p
                className="text-[14px] leading-[1.65]"
                style={{ color: "#243042" }}
              >
                {card.paragrafo}
              </p>
            </div>
          )
        })}
      </div>

      {/* Callout "Resumo em uma frase" */}
      <div
        className="mt-8 rounded-xl border bg-white px-8 py-7"
        style={{ borderColor: "var(--line)", borderLeftWidth: "4px", borderLeftColor: "var(--brand-cyan)" }}
      >
        <h4
          className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: "var(--brand-cyan)" }}
        >
          Resumo em uma frase
        </h4>
        <p
          className="text-[16px] leading-[1.5]"
          style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-navy)" }}
        >
          A Gregorutt é um caso raro: R$ 44 de lucro em cada R$ 100 vendidos, zero dívida, R$ 1,45 milhão em banco. O desafio não é ganhar dinheiro — é decidir o que fazer com ele.
        </p>
      </div>
    </section>
  )
}
