import { PageHeader } from "@/components/page-header"
import { clienteAtual } from "@/lib/clientes/cliente-atual"

export default function IndicadoresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mesa de decisão"
        title="Indicadores"
        description={`Onde a ${clienteAtual.empresa.nomeCurto} está saudável, onde está pressionando e o que merece atenção agora.`}
      />

      {/* Leitura do CFOup — ELEMENTO PRINCIPAL */}
      <section className="mb-6 rounded-2xl border border-[rgba(21,103,200,0.25)] bg-brand-gradient p-7 md:p-9 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Leitura do CFOup</p>
        <h2 className="mt-3 max-w-3xl text-balance text-[1.5rem] md:text-[1.75rem] font-extrabold leading-tight">
          Margem operacional pressiona o resultado em R$ 14k/mês. Caixa segura outros 6 meses no ritmo atual.
        </h2>
        <p className="mt-3 max-w-2xl text-white/85 text-[14px] leading-relaxed">
          O fôlego da margem bruta segura a operação, mas a despesa fixa está absorvendo demais. Próxima decisão: revisar custo fixo no fechamento de junho.
        </p>
      </section>

      {/* Bloco A — SAUDÁVEL */}
      <section className="mb-3 relative rounded-2xl border border-border bg-card p-5 md:p-6 pl-7">
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[4px] rounded-l-2xl"
          style={{ background: "var(--brand-green)" }}
        />
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded mb-3"
          style={{ background: "rgba(54,186,88,0.10)", color: "var(--brand-green)" }}
        >
          Saudável
        </span>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          Margem bruta em <strong>32,4%</strong> mantém o fôlego, +1,1 p.p. vs ano anterior.
        </p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          Recebimento em <strong>38 dias</strong> — melhorou 3 dias desde janeiro.
        </p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          Receita do mês <strong>R$ 312k</strong>, R$ 64k acima do ponto de equilíbrio.
        </p>
      </section>

      {/* Bloco B — PRESSIONANDO */}
      <section className="mb-3 relative rounded-2xl border border-border bg-card p-5 md:p-6 pl-7">
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[4px] rounded-l-2xl"
          style={{ background: "var(--brand-warning)" }}
        />
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded mb-3"
          style={{ background: "rgba(224,139,0,0.12)", color: "var(--brand-warning)" }}
        >
          Pressionando
        </span>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          Margem operacional caiu 0,4 p.p. — está em <strong>9,8%</strong>.
        </p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          Despesa fixa absorvendo mais do que deveria. Resultado pressionado em <strong>R$ 14k/mês</strong>.
        </p>
      </section>

      {/* Bloco C — RISCO */}
      <section className="mb-3 relative rounded-2xl border border-border bg-card p-5 md:p-6 pl-7">
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[4px] rounded-l-2xl"
          style={{ background: "var(--brand-error-soft)" }}
        />
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded mb-3"
          style={{ background: "rgba(209,67,67,0.10)", color: "var(--brand-error-soft)" }}
        >
          Risco
        </span>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          Prazo médio de estoque subiu 6 dias, está em <strong>54 dias</strong>.
        </p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          <strong>R$ 92k</strong> a mais presos no estoque do que em janeiro.
        </p>
      </section>

      {/* Bloco D — ATENÇÃO AGORA */}
      <section className="mb-3 relative rounded-2xl border border-border bg-card p-5 md:p-6 pl-7">
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-[4px] rounded-l-2xl"
          style={{ background: "var(--brand-blue)" }}
        />
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded mb-3"
          style={{ background: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }}
        >
          Atenção agora
        </span>
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          Revisar custo fixo no próximo fechamento.
        </p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          Olhar Prazo médio de estoque por linha de produto.
        </p>
      </section>
    </>
  )
}
