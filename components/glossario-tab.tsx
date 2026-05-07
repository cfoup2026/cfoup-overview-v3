"use client"

import {
  conteudoSintese,
  conteudoDRE,
  conteudoBP,
  conteudoIndicadores,
  conteudoAoContador,
} from "@/lib/conteudos/analise-contabil"

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

  // Agrupar por letra inicial
  const grupos: Record<string, typeof dedupe> = {}
  dedupe.forEach((item) => {
    const letra = item.termo[0].toUpperCase()
    if (!grupos[letra]) grupos[letra] = []
    grupos[letra].push(item)
  })

  // Ordenar letras
  const letrasOrdenadas = Object.keys(grupos).sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  )

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="mt-12">
        <h2
          className="text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          Glossário
        </h2>
        <p
          className="mt-1.5 text-[13px] leading-relaxed"
          style={{ color: "var(--slate-700)" }}
        >
          Todos os termos contábeis e financeiros usados neste relatório,
          explicados em linguagem simples.
        </p>
      </div>

      {/* Lista por letra */}
      <div className="mt-6 space-y-6">
        {letrasOrdenadas.map((letra) => (
          <div key={letra}>
            {/* Divisor com letra */}
            <div className="flex items-center gap-3">
              <span
                className="text-2xl font-extrabold"
                style={{ color: "var(--brand-blue)" }}
              >
                {letra}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Termos */}
            <dl className="mt-3 space-y-3">
              {grupos[letra].map((item) => (
                <div key={item.termo}>
                  <dt
                    className="text-[13px] font-semibold"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {item.termo}
                  </dt>
                  <dd
                    className="mt-0.5 text-[13px] leading-relaxed"
                    style={{ color: "var(--slate-700)" }}
                  >
                    {item.definicao}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  )
}
