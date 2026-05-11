import { PageHeader } from "@/components/page-header"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { clienteAtual } from "@/lib/clientes/cliente-atual"

type Status = "positive" | "attention" | "negative" | "neutral"

const STATUS_COLORS: Record<Status, { border: string; delta: string }> = {
  positive: { border: "var(--brand-green)", delta: "var(--brand-green-dark)" },
  attention: { border: "var(--brand-warning)", delta: "var(--brand-warning)" },
  negative: { border: "var(--brand-error-soft)", delta: "var(--brand-red)" },
  neutral: { border: "var(--brand-cyan)", delta: "var(--slate-600)" },
}

export default function IndicadoresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mesa de decisão"
        title="Indicadores"
        description={`Sinais que o dono da ${clienteAtual.empresa.nomeCurto} olha antes de decidir. Margens, ciclo financeiro e ponto de equilíbrio.`}
      />

      {/* 1. Margens */}
      <section className="mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Margens</p>
        <div className="mb-3 mt-2 grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Margem bruta"
            value="32,4%"
            delta="+1,1 p.p."
            refText="vs. ano anterior"
            status="positive"
          />
          <KpiCard
            label="Margem operacional"
            value="9,8%"
            delta="−0,4 p.p."
            refText="pressão em despesas fixas"
            status="attention"
          />
          <KpiCard
            label="Margem líquida"
            value="7,2%"
            delta="+0,2 p.p."
            refText="mês fechado"
            status="positive"
          />
        </div>
        <p className="mb-8 text-[13px] leading-relaxed text-muted-foreground">
          A margem bruta melhorou, mas a operacional ficou apertada com o aumento de despesas fixas no trimestre.
        </p>
      </section>

      {/* 2. Ciclo financeiro */}
      <section className="mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Ciclo financeiro</p>
        <div className="mb-3 mt-2 grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Prazo médio de recebimento"
            value="38 dias"
            delta="−3 dias"
            refText="melhor desde jan"
            status="positive"
          />
          <KpiCard
            label="Prazo médio de pagamento"
            value="26 dias"
            delta="+1 dia"
            refText="dentro da política"
            status="neutral"
          />
          <KpiCard
            label="Prazo médio de estoque"
            value="54 dias"
            delta="+6 dias"
            refText="giro caiu"
            status="attention"
          />
        </div>
        <p className="mb-8 text-[13px] leading-relaxed text-muted-foreground">
          O recebimento acelerou, mas o estoque está parado há mais tempo — vale revisar o mix de produtos.
        </p>
      </section>

      {/* 3. Ponto de equilíbrio */}
      <section className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Ponto de equilíbrio</p>
        <div className="mt-2 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Valor */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Ponto de equilíbrio mensal
              </p>
              <p
                className="mt-2 text-[2rem] font-extrabold leading-none tabular-nums"
                style={{ color: "var(--brand-navy)" }}
              >
                R$ 248k
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">mínimo para cobrir custos fixos</p>
            </div>

            {/* Distância */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Receita do mês vs. ponto
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <p
                  className="text-[2rem] font-extrabold leading-none tabular-nums"
                  style={{ color: "var(--brand-green-dark)" }}
                >
                  +R$ 64k
                </p>
                <p className="text-[13px] font-semibold" style={{ color: "var(--brand-green-dark)" }}>
                  acima
                </p>
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">receita atual: R$ 312k</p>
            </div>
          </div>

          {/* Barra */}
          <div className="mt-5">
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--slate-100)]">
              {/* Ponto de equilíbrio marker */}
              <div
                className="absolute top-0 h-full w-0.5 bg-[var(--brand-navy)]"
                style={{ left: `${(248 / 350) * 100}%` }}
              />
              {/* Receita atual */}
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(312 / 350) * 100}%`,
                  background: "var(--brand-green)",
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span>R$ 0</span>
              <span style={{ marginLeft: `${(248 / 350) * 100 - 8}%` }}>Ponto</span>
              <span>R$ 350k</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leitura do CFOup */}
      <section className="rounded-2xl border border-[rgba(21,103,200,0.25)] bg-brand-gradient p-7 text-white md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Leitura do CFOup</p>
        <h2 className="mt-3 max-w-3xl text-balance text-2xl font-extrabold leading-tight">
          A margem operacional caiu 0,4 p.p. — despesas fixas cresceram mais que a receita.
        </h2>
        <p className="mt-3 max-w-2xl text-white/85">
          O sinal de atenção está nas despesas fixas que subiram sem acompanhar o faturamento. A receita ainda está R$ 64k acima do ponto de equilíbrio, mas se a margem continuar caindo, esse colchão diminui rápido. Vale revisar contratos recorrentes e renegociar onde der.
        </p>
      </section>
    </>
  )
}

function KpiCard({
  label,
  value,
  delta,
  refText,
  status,
}: {
  label: string
  value: string
  delta: string
  refText: string
  status: Status
}) {
  const colors = STATUS_COLORS[status]
  const IconComponent = delta.startsWith("+") ? TrendingUp : delta.startsWith("−") || delta.startsWith("-") ? TrendingDown : Minus

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-5">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: colors.border }}
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p
        className="mt-3 text-[1.5rem] font-extrabold leading-none tabular-nums"
        style={{ color: "var(--brand-navy)" }}
      >
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: colors.delta }}>
        <IconComponent className="h-3.5 w-3.5" />
        {delta}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{refText}</p>
    </div>
  )
}
