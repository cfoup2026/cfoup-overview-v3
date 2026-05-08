"use client"

import { TabHeaderCard } from "@/components/tab-header-card"
import { conteudoConclusao } from "@/lib/conteudos/analise-contabil"
import type { ConclusaoDadosCliente } from "@/lib/clientes/empresa-001"

export function ConclusaoTab({ dados }: { dados: ConclusaoDadosCliente }) {
  return (
    <>
      <TabHeaderCard titulo="Conclusão" intro={conteudoConclusao.intro} />

      <div className="mt-6 space-y-4">
        {dados.cards.map((card, idx) => (
          <div
            key={card.id}
            className="rounded-2xl border border-border bg-card p-5 md:p-6"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-blue)]">
              {String(idx + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 text-base font-bold leading-snug text-[color:var(--brand-navy)]">
              {card.titulo}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--slate-700)]">
              {card.paragrafo}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-12" />
    </>
  )
}
