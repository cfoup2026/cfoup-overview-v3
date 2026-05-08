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
        className="mb-2 text-[30px] leading-[1.1] tracking-[-0.01em]"
        style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-navy)" }}
      >
        Glossário
      </h2>
      <p
        className="mb-6 max-w-[1180px] text-[15.5px] leading-[1.65]"
        style={{ color: "var(--muted-html)" }}
      >
        Todos os termos contábeis e financeiros usados neste relatório, explicados em linguagem simples.
      </p>

      {/* Glossary-full card */}
      <div
        className="rounded-xl border bg-white py-2"
        style={{ borderColor: "var(--line)" }}
      >
        {Object.entries(grupos).map(([letra, termos]) => (
          <div key={letra}>
            {/* Letra header */}
            <div
              className="border-b px-8 py-5"
              style={{ background: "#FAFCFF", borderColor: "var(--line)" }}
            >
              <span
                className="text-[22px] tracking-[-0.01em]"
                style={{ fontFamily: "var(--cfoup-font-serif)", fontWeight: 500, color: "var(--brand-cyan)" }}
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
                  className={`grid gap-7 px-8 py-4 md:grid-cols-[220px_1fr] ${isLast ? "" : "border-b"}`}
                  style={{ borderColor: "var(--line)" }}
                >
                  <p
                    className="pt-0.5 text-[14px] font-semibold tracking-[-0.005em]"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {item.termo}
                  </p>
                  <p
                    className="text-[13.5px] leading-[1.6]"
                    style={{ color: "#3D4D66" }}
                  >
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
