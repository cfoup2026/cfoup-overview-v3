"use client"

import type { SinteseDados } from "@/lib/types/analise-financeira"
import type { conteudoAnaliseFinanceira } from "@/lib/conteudos/analise-financeira"

// ---------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------
type Props = {
  dados: SinteseDados
  conteudo: typeof conteudoAnaliseFinanceira.sintese
  empresa: { nome: string }
}

// ---------------------------------------------------------------------
// Bold text parser — splits on ** and renders <strong>
// ---------------------------------------------------------------------
function renderBold(text: string): React.ReactNode {
  const parts = text.split("**")
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

// ---------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------
export default function SinteseTab({ dados, conteudo, empresa }: Props) {
  // Replace [empresa.nome] placeholder with actual name
  const citacaoProcessada = dados.citacaoFechamento.replace(
    /\[empresa\.nome\]/g,
    empresa.nome
  )

  return (
    <section className="space-y-6">
      {/* ============================================================ */}
      {/* 1. Section head (sem card, simples)                           */}
      {/* ============================================================ */}
      <div>
        <h2 className="font-fraunces text-2xl">
          {conteudo.titulo}{" "}
          <span className="font-normal text-muted-foreground">
            · {conteudo.subtitulo}
          </span>
        </h2>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          {conteudo.src}
        </p>
      </div>

      {/* ============================================================ */}
      {/* 2. Verdict block (Tese)                                       */}
      {/* ============================================================ */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {conteudo.tagTese}
        </p>
        <p className="mt-2 font-fraunces text-xl" style={{ color: "var(--brand-navy)" }}>
          {dados.tese}
        </p>
      </div>

      {/* ============================================================ */}
      {/* 3. Actions block (navy background)                            */}
      {/* ============================================================ */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: "var(--brand-navy)" }}
      >
        <h4
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--brand-cyan)" }}
        >
          {conteudo.tituloDecisoes}
        </h4>
        <ol className="mt-4 list-decimal space-y-4 pl-5 text-white">
          {dados.decisoes.map((decisao, idx) => (
            <li key={idx} className="text-[15px] leading-relaxed">
              <strong className="text-white">{decisao.titulo}</strong> —{" "}
              {decisao.descricao}
              <span
                className="mt-2 block text-sm"
                style={{ color: "var(--brand-cyan)" }}
              >
                {decisao.meta}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* ============================================================ */}
      {/* 4. Closing block (citação)                                    */}
      {/* ============================================================ */}
      <div
        className="rounded-2xl border-l-4 bg-muted p-5"
        style={{ borderLeftColor: "var(--brand-cyan)" }}
      >
        <p
          className="text-[15px] leading-relaxed"
          style={{ color: "var(--brand-navy)" }}
        >
          {renderBold(citacaoProcessada)}
        </p>
      </div>
    </section>
  )
}
