"use client"

import {
  conteudoSintese,
  conteudoDRE,
  conteudoBP,
  conteudoIndicadores,
  conteudoAoContador,
} from "@/lib/conteudos/analise-contabil"
import { TabHeaderCard } from "@/components/tab-header-card"

// ---------------------------------------------------------------------
// GlossarioTab — consolidação de todos os glossários universais
// ---------------------------------------------------------------------
export function GlossarioTab() {
  // Agregar todos os glossários
  const todos = [
    ...conteudoSintese.glossario,
    ...conteudoDRE.glossario,
    ...conteudoBP.glossario,
    ...conteudoIndicadores.glossario,
    ...conteudoAoContador.glossario,
  ]

  // Deduplicar por termo (mantém primeira ocorrência)
  const dedupe = todos.reduce(
    (acc, item) => {
      if (!acc.find((t) => t.termo === item.termo)) acc.push(item)
      return acc
    },
    [] as { termo: string; definicao: string }[]
  )

  // Ordenar alfabeticamente em pt-BR
  dedupe.sort((a, b) => a.termo.localeCompare(b.termo, "pt-BR"))

  // Agrupar por letra inicial (ordenado)
  const grupos: Record<string, typeof dedupe> = {}
  dedupe.forEach((item) => {
    const letra = item.termo[0].toUpperCase()
    if (!grupos[letra]) grupos[letra] = []
    grupos[letra].push(item)
  })

  return (
    <section className="mb-12">
      {/* Header */}
      <TabHeaderCard
        titulo="Glossário"
        intro="Todos os termos contábeis e financeiros usados neste relatório, explicados em linguagem simples."
      />

      {/* Lista por letra */}
      <div className="mt-6 space-y-4">
        {Object.entries(grupos).map(([letra, termos]) => (
          <div key={letra} className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-[color:var(--brand-blue)]">{letra}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <dl className="mt-3 space-y-3">
              {termos.map((item) => (
                <div key={item.termo}>
                  <dt className="text-[13px] font-semibold text-[color:var(--brand-navy)]">{item.termo}</dt>
                  <dd className="mt-0.5 text-[13px] leading-relaxed text-[color:var(--slate-700)]">{item.definicao}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
