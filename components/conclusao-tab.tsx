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
        className="mb-2 text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
        style={{ color: "var(--brand-navy)" }}
      >
        Conclusão
      </h2>
      <p className="mb-6 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">
        {conteudoConclusao.intro}
      </p>

      {/* Notes */}
      <div className="rounded-xl border border-border bg-card py-2">
        {dados.cards.map((card, idx) => {
          const labelColor = NOTE_LABEL_COLOR[card.status] || "var(--brand-blue)"
          const isLast = idx === dados.cards.length - 1
          return (
            <div
              key={card.id}
              className={`grid gap-6 px-7 py-4 md:grid-cols-[140px_1fr] ${isLast ? "" : "border-b border-border"}`}
            >
              <p
                className="pt-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: labelColor }}
              >
                {card.titulo}
              </p>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {card.paragrafo}
              </p>
            </div>
          )
        })}
      </div>

      {/* Callout "Resumo em uma frase" */}
      <div
        className="mt-8 rounded-xl border border-border bg-card px-8 py-7"
        style={{ borderLeftWidth: "4px", borderLeftColor: "var(--brand-cyan)" }}
      >
        <h4
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--brand-cyan)" }}
        >
          Resumo em uma frase
        </h4>
        <p
          className="text-[15px] leading-relaxed font-semibold"
          style={{ color: "var(--brand-navy)" }}
        >
          A Gregorutt é um caso raro: R$ 44 de lucro em cada R$ 100 vendidos, zero dívida, R$ 1,45 milhão em banco. O desafio não é ganhar dinheiro — é decidir o que fazer com ele.
        </p>
      </div>
    </section>
  )
}
