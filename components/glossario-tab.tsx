"use client"

import {
  conteudoSintese,
  conteudoDRE,
  conteudoBP,
  conteudoIndicadores,
  conteudoAoContador,
} from "@/lib/conteudos/analise-contabil"

// ---------------------------------------------------------------------
// GlossarioTab — replica HTML .glossary-full cfoup-tese
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

  return (
    <section>
      {/* H2 + lede */}
      <h2
        className="mb-2 text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
        style={{ color: "var(--brand-navy)" }}
      >
        Glossário
      </h2>
      <p className="mb-6 max-w-[1180px] text-[13px] leading-relaxed text-muted-foreground">
        Todos os termos contábeis e financeiros usados neste relatório, explicados em linguagem simples.
      </p>

      {/* Glossary-full card */}
      <div className="rounded-xl border border-border bg-card py-2">
        {Object.entries(grupos).map(([letra, termos]) => (
          <div key={letra}>
            {/* Letra header */}
            <div className="border-b border-border bg-muted px-8 py-5">
              <span
                className="text-xl font-extrabold tabular-nums"
                style={{ color: "var(--brand-cyan)" }}
              >
                {letra}
              </span>
            </div>
            {/* Termos */}
            {termos.map((item, idx) => {
              const isLast = idx === termos.length - 1
              return (
                <div
                  key={item.termo}
                  className={`grid gap-7 px-8 py-4 md:grid-cols-[220px_1fr] ${isLast ? "" : "border-b border-border"}`}
                >
                  <p
                    className="pt-1 text-[13px] font-semibold"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {item.termo}
                  </p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-ink-muted)" }}>
                    {item.definicao}
                  </p>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
