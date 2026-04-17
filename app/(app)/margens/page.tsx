import { PageHeader } from "@/components/page-header"
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"

export default function MargensPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resultado"
        title="Margens e Rentabilidade"
        description="Onde Sua empresa está ganhando e onde está perdendo margem. Quebrado por linha de receita, com a leitura do CFOup sobre o que mudar."
      />

      {/* Três indicadores principais */}
      <section className="mb-8 grid gap-5 md:grid-cols-3">
        <MarginKpi label="Margem bruta" value="42,6%" delta="+0,8 p.p." positive detail="vs. trimestre anterior" />
        <MarginKpi label="Margem operacional" value="21,4%" delta="+1,2 p.p." positive detail="melhor ciclo do ano" />
        <MarginKpi label="Margem líquida" value="14,9%" delta="−0,3 p.p." detail="pressão em despesas fixas" />
      </section>

      {/* Leitura do CFOup */}
      <section className="mb-8 rounded-2xl border border-[rgba(21,103,200,0.25)] bg-brand-gradient p-7 text-white md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Leitura do CFOup</p>
        <h2 className="mt-3 max-w-3xl text-balance text-2xl font-extrabold leading-tight">
          A margem bruta melhorou, mas a linha B está segurando o resultado consolidado.
        </h2>
        <p className="mt-3 max-w-2xl text-white/85">
          O ganho de 0,8 ponto na bruta veio de renegociação com fornecedores. Na ponta, a Linha B caiu 2,1 p.p. por
          descontos concedidos fora da política. Corrigir a régua de desconto recupera ~R$ 18k/mês.
        </p>
      </section>

      {/* Tabela por linha de receita */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
            Margens por linha de receita · últimos 90 dias
          </h3>
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-blue)] hover:underline">
            Detalhar
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_1.6fr] border-b border-border px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground md:grid">
          <span>Linha de receita</span>
          <span className="text-right">Receita</span>
          <span className="text-right">Margem</span>
          <span className="text-right">Variação</span>
          <span>Composição</span>
        </div>

        <ul className="divide-y divide-border">
          <MarginRow name="Linha A · Serviços recorrentes" revenue="R$ 214,8k" margin="38,2%" delta="+1,4 p.p." positive bar={82} />
          <MarginRow name="Linha B · Projetos sob demanda" revenue="R$ 148,1k" margin="18,7%" delta="−2,1 p.p." bar={46} />
          <MarginRow name="Linha C · Licenciamento" revenue="R$ 76,4k" margin="54,9%" delta="+0,5 p.p." positive bar={94} />
          <MarginRow name="Linha D · Consultoria pontual" revenue="R$ 42,8k" margin="28,3%" delta="0,0 p.p." bar={62} />
        </ul>

        <div className="flex items-center justify-between border-t border-border px-6 py-4 text-sm">
          <span className="font-bold" style={{ color: "var(--brand-navy)" }}>
            Consolidado
          </span>
          <div className="flex items-center gap-6 tabular-nums">
            <span className="text-muted-foreground">Receita <span className="ml-1 font-bold text-[var(--brand-navy)]">R$ 482,1k</span></span>
            <span className="text-muted-foreground">Margem <span className="ml-1 font-bold text-[var(--brand-navy)]">31,8%</span></span>
          </div>
        </div>
      </section>
    </>
  )
}

function MarginKpi({
  label,
  value,
  delta,
  detail,
  positive = false,
}: {
  label: string
  value: string
  delta: string
  detail: string
  positive?: boolean
}) {
  const TrendIcon = positive ? TrendingUp : TrendingDown
  const color = positive ? "var(--brand-green-dark)" : "var(--slate-700)"
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p
        className="mt-3 text-[2.25rem] font-extrabold leading-none tabular-nums"
        style={{ color: "var(--brand-navy)" }}
      >
        {value}
      </p>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
        <TrendIcon className="h-3.5 w-3.5" />
        {delta}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  )
}

function MarginRow({
  name,
  revenue,
  margin,
  delta,
  bar,
  positive = false,
}: {
  name: string
  revenue: string
  margin: string
  delta: string
  bar: number
  positive?: boolean
}) {
  return (
    <li className="grid grid-cols-1 gap-2 px-6 py-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.6fr] md:items-center">
      <div>
        <p className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
          {name}
        </p>
      </div>
      <p className="text-sm tabular-nums text-muted-foreground md:text-right">{revenue}</p>
      <p
        className="text-sm font-extrabold tabular-nums md:text-right"
        style={{ color: "var(--brand-navy)" }}
      >
        {margin}
      </p>
      <p
        className="text-sm font-semibold tabular-nums md:text-right"
        style={{ color: positive ? "var(--brand-green-dark)" : "var(--slate-600)" }}
      >
        {delta}
      </p>
      <div className="h-2 w-full rounded-full bg-[var(--slate-100)]">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${bar}%`,
            background:
              bar >= 80
                ? "var(--brand-green)"
                : bar >= 55
                  ? "var(--brand-blue)"
                  : "var(--brand-cyan)",
          }}
        />
      </div>
    </li>
  )
}
