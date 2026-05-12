"use client"

// ---------------------------------------------------------------------
// Síntese — Análise Financeira
// Replicação fiel do HTML cfoup-tese: section-head + verdict + actions + callout
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
    <section className="op-section space-y-4">
        {/* Clean header */}
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
            Síntese
          </p>
          <h2 className="mt-1 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
            O que importa agora
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            A tese e as decisões da semana
          </p>
        </div>

        {/* Verdict */}
        <div
          className="flex items-baseline gap-4 rounded-xl border border-border px-6 py-4"
          style={{ background: "#F0F4FA", borderLeft: "4px solid var(--brand-blue)" }}
        >
          <span
            className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Tese
          </span>
          <span
            className="text-[15px] md:text-[16px] font-semibold leading-snug"
            style={{ color: "var(--brand-navy)" }}
          >
            {dados.tese}
          </span>
        </div>

        {/* Actions */}
        <div
          className="rounded-xl border border-border px-7 py-6"
          style={{ background: "white" }}
        >
          <h4
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-blue)" }}
          >
            3 decisões desta semana
          </h4>
          <ol className="m-0 list-none p-0" style={{ counterReset: "acts" }}>
            {dados.decisoes.map((d, idx) => (
              <li
                key={idx}
                className="relative block py-3 pl-10 text-[13px] leading-relaxed"
                style={{ color: "var(--brand-navy)", counterIncrement: "acts" }}
              >
                <span
                  className="absolute left-0 top-3 inline-flex h-6 w-6 items-center justify-center rounded-lg text-[13px] font-bold tabular-nums"
                  style={{
                    background: "var(--brand-blue)",
                    color: "white",
                  }}
                >
                  {idx + 1}
                </span>
                <b className="font-semibold">{d.titulo}</b> — {d.descricao}{" "}
                <span className="ml-2 text-[12px] italic text-muted-foreground">{d.meta}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Callout final */}
        <div
          className="rounded-xl border border-border px-6 py-4 text-[15px] leading-relaxed"
          style={{ background: "var(--muted)", borderLeft: "3px solid var(--brand-cyan)", color: "var(--brand-navy)" }}
        >
          <b className="font-semibold">{dados.callout.split(".")[0]}.</b>
          {dados.callout.substring(dados.callout.indexOf(".") + 1)}
        </div>
    </section>
  )
}
