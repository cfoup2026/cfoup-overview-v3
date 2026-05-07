"use client"

import { conteudoAoContador } from "@/lib/conteudos/analise-contabil"
import type { AoContadorDadosCliente } from "@/lib/clientes/empresa-001"

type Props = {
  dados: AoContadorDadosCliente
}

export function AoContadorTab({ dados }: Props) {
  const formatNumero = (n: number) => String(n).padStart(2, "0")

  return (
    <div>
      {/* Header */}
      <div className="mt-12">
        <h2
          className="text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          Ao Contador
        </h2>
        {conteudoAoContador.intro && (
          <p
            className="mt-1.5 text-[13px] leading-relaxed"
            style={{ color: "var(--slate-700)" }}
          >
            {conteudoAoContador.intro}
          </p>
        )}
      </div>

      {/* Lista de grupos */}
      <div className="mt-6 space-y-4">
        {dados.grupos.map((grupo) => (
          <div
            key={grupo.id}
            className="rounded-2xl border border-border bg-card p-5 md:p-6"
          >
            {/* Eyebrow */}
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-blue)" }}
            >
              {formatNumero(grupo.numero)}
            </span>

            {/* Título */}
            <h3
              className="mt-1 text-base font-bold leading-snug"
              style={{ color: "var(--brand-navy)" }}
            >
              {grupo.titulo}
            </h3>

            {/* Contexto */}
            <p className="mt-2 text-[12px] italic leading-relaxed text-muted-foreground">
              {grupo.contexto}
            </p>

            {/* Lista numerada */}
            <ol className="mt-4 list-outside list-decimal space-y-2 pl-5">
              {grupo.perguntas.map((pergunta, idx) => (
                <li
                  key={idx}
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--slate-700)" }}
                >
                  {pergunta}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Glossário */}
      {conteudoAoContador.glossario.length > 0 && (
        <details className="mb-6 mt-6">
          <summary
            className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Glossário · Termos usados em Ao Contador +
          </summary>
          <dl className="mt-3 space-y-3">
            {conteudoAoContador.glossario.map((item) => (
              <div key={item.termo}>
                <dt
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {item.termo}
                </dt>
                <dd
                  className="mt-1 text-[13px] leading-relaxed"
                  style={{ color: "var(--slate-700)" }}
                >
                  {item.definicao}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </div>
  )
}
