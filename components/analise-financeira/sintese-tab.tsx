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
      {/* Section Head (navy gradient) */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
        style={{ background: "linear-gradient(135deg, #071D3B 0%, #0A2647 100%)" }}
      >
        <h2
          className="m-0 text-[22px] font-medium tracking-[-0.005em] text-white"
          style={{ fontFamily: "var(--cfoup-font-serif)" }}
        >
          Síntese · <span style={{ color: "#38B8E8" }}>O que importa agora</span>
        </h2>
        <span className="text-[11px] tracking-[0.04em] text-white/70">
          A tese e as decisões da semana
        </span>
      </div>

      {/* Section Body */}
      <div className="p-7" style={{ background: "#FFFFFF" }}>
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
            className="text-[19px] font-medium leading-[1.35] tracking-[-0.005em]"
            style={{ fontFamily: "var(--cfoup-font-serif)", color: "#071D3B" }}
          >
            {dados.tese}
          </span>
        </div>

        {/* Actions (bloco navy) */}
        <div
          className="rounded-[10px] px-7 py-6"
          style={{ background: "#071D3B" }}
        >
          <h4
            className="mb-[14px] text-[14px] font-medium uppercase tracking-[0.04em]"
            style={{ fontFamily: "var(--cfoup-font-serif)", color: "#38B8E8" }}
          >
            3 decisões desta semana
          </h4>
          <ol className="m-0 list-none p-0" style={{ counterReset: "acts" }}>
            {dados.decisoes.map((d, idx) => (
              <li
                key={idx}
                className="relative block py-[10px] pl-[38px] text-[14px] leading-[1.6]"
                style={{ color: "#D8E2F0", counterIncrement: "acts" }}
              >
                <span
                  className="absolute left-0 top-[10px] inline-flex h-6 w-6 items-center justify-center rounded-[5px] text-[13px] font-semibold"
                  style={{
                    fontFamily: "var(--cfoup-font-serif)",
                    background: "#38B8E8",
                    color: "#071D3B",
                  }}
                >
                  {idx + 1}
                </span>
                <b className="font-semibold text-white">{d.titulo}</b> — {d.descricao}{" "}
                <span className="ml-2 text-[12px] italic text-white/65">{d.meta}</span>
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
