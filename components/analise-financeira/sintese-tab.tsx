"use client"

// ---------------------------------------------------------------------
// Síntese — Análise Financeira
// Alinhado ao padrão operacional SinteseExecutiva da Análise Contábil
// ---------------------------------------------------------------------

type Decisao = {
  titulo: string
  descricao: string
  meta: string
}

type SinteseFinanceiraData = {
  tese: string
  decisoes: Decisao[]
  callout: string
}

type Props = {
  dados: SinteseFinanceiraData
}

export default function SinteseTab({ dados }: Props) {
  return (
    <section>
      {/* ============================================================ */}
      {/* TESE — parágrafo direto no fluxo                             */}
      {/* ============================================================ */}
      <div
        className="rounded-2xl border border-border p-6 md:p-8"
        style={{ background: "white" }}
      >
        <p
          className="max-w-[1180px] text-[15px] md:text-[16px] font-semibold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          {dados.tese}
        </p>
      </div>

      {/* ============================================================ */}
      {/* DECISÕES DA SEMANA — lista simples                           */}
      {/* ============================================================ */}
      <div
        className="mt-6 rounded-2xl border border-border p-6 md:p-8"
        style={{ background: "white" }}
      >
        <p
          className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--brand-blue)" }}
        >
          3 decisões desta semana
        </p>
        <div className="divide-y divide-border">
          {dados.decisoes.map((d, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
                <strong className="font-semibold">{d.titulo}</strong> — {d.descricao}
              </p>
              <p className="mt-1 text-[12px] italic text-muted-foreground">
                {d.meta}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* CALLOUT — bloco simples sem borda lateral                    */}
      {/* ============================================================ */}
      <div
        className="mt-6 rounded-2xl border border-border p-6 md:p-8"
        style={{ background: "white" }}
      >
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          <strong className="font-semibold">{dados.callout.split(".")[0]}.</strong>
          {dados.callout.substring(dados.callout.indexOf(".") + 1)}
        </p>
      </div>
    </section>
  )
}
