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
    <section className="op-section">
      {/* Section Body */}
      <div className="p-7" style={{ background: "#FFFFFF" }}>
        {/* Clean header */}
        <div className="mb-6 rounded-xl border border-border bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
            Síntese
          </p>
          <h2 className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
            O que importa agora
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            A tese e as decisões da semana
          </p>
        </div>

        {/* Verdict */}
        <div
          className="mb-7 flex items-baseline gap-4 rounded-r-lg px-[22px] py-4"
          style={{ background: "#F0F4FA", borderLeft: "4px solid #1567C8" }}
        >
          <span
            className="flex-shrink-0 text-[10.5px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "#1567C8" }}
          >
            Tese
          </span>
          <span
            className="text-[15px] md:text-[16px] font-semibold leading-snug"
            style={{ color: "#071D3B" }}
          >
            {dados.tese}
          </span>
        </div>

        {/* Actions */}
        <div
          className="rounded-[10px] border border-border px-7 py-6"
          style={{ background: "white" }}
        >
          <h4
            className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--brand-blue)" }}
          >
            3 decisões desta semana
          </h4>
          <ol className="m-0 list-none p-0" style={{ counterReset: "acts" }}>
            {dados.decisoes.map((d, idx) => (
              <li
                key={idx}
                className="relative block py-[10px] pl-[38px] text-[14px] leading-[1.6]"
                style={{ color: "var(--brand-navy)", counterIncrement: "acts" }}
              >
                <span
                  className="absolute left-0 top-[10px] inline-flex h-6 w-6 items-center justify-center rounded-[5px] text-[13px] font-semibold"
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
          className="mt-6 px-[22px] py-[18px] text-[16px] leading-[1.55]"
          style={{ background: "#F7F9FC", borderLeft: "3px solid #38B8E8", color: "#071D3B" }}
        >
          <b className="font-semibold">{dados.callout.split(".")[0]}.</b>
          {dados.callout.substring(dados.callout.indexOf(".") + 1)}
        </div>
      </div>
    </section>
  )
}
