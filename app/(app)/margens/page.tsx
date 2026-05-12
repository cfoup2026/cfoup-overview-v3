import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { clienteAtual } from "@/lib/clientes/cliente-atual"

type Status = "saudavel" | "pressionando" | "risco" | "estavel"

const STATUS_STYLES: Record<Status, { color: string; bg: string }> = {
  saudavel: { color: "var(--brand-green)", bg: "rgba(54,186,88,0.10)" },
  pressionando: { color: "var(--brand-warning)", bg: "rgba(224,139,0,0.12)" },
  risco: { color: "var(--brand-error-soft)", bg: "rgba(209,67,67,0.10)" },
  estavel: { color: "var(--brand-cyan)", bg: "rgba(56,184,232,0.10)" },
}

const STATUS_LABELS: Record<Status, string> = {
  saudavel: "Saudável",
  pressionando: "Pressionando",
  risco: "Risco",
  estavel: "Estável",
}

type Indicator = {
  label: string
  value: string
  delta: string
  refText: string
  status: Status
  leitura: string
}

const INDICADORES: Indicator[] = [
  {
    label: "Margem operacional",
    value: "9,8%",
    delta: "−0,4 p.p.",
    refText: "pressão em despesa fixa",
    status: "pressionando",
    leitura: "Resultado pressionado em R$ 14k/mês.",
  },
  {
    label: "Prazo médio de estoque",
    value: "54 dias",
    delta: "+6 dias",
    refText: "giro caiu",
    status: "risco",
    leitura: "R$ 92k a mais presos do que em janeiro.",
  },
  {
    label: "Margem bruta",
    value: "32,4%",
    delta: "+1,1 p.p.",
    refText: "vs. ano anterior",
    status: "saudavel",
    leitura: "Mantém o fôlego pra absorver pressão.",
  },
  {
    label: "Prazo médio de recebimento",
    value: "38 dias",
    delta: "−3 dias",
    refText: "melhor desde jan",
    status: "saudavel",
    leitura: "Cliente pagando mais rápido.",
  },
  {
    label: "Margem líquida",
    value: "7,2%",
    delta: "+0,2 p.p.",
    refText: "mês fechado",
    status: "saudavel",
    leitura: "No azul, dentro da meta.",
  },
  {
    label: "Prazo médio de pagamento",
    value: "26 dias",
    delta: "+1 dia",
    refText: "dentro da política",
    status: "estavel",
    leitura: "Sem mudança relevante.",
  },
  {
    label: "Ponto de equilíbrio",
    value: "R$ 248k/mês",
    delta: "+R$ 64k",
    refText: "receita R$ 312k",
    status: "saudavel",
    leitura: "R$ 64k acima do ponto.",
  },
]

export default function IndicadoresPage() {
  return (
    <>
      <PageHeader eyebrow="Mesa de decisão" title="Indicadores" />

      {/* Leitura do CFOup */}
      <section className="mb-6 rounded-2xl border border-border bg-hero-gradient p-4 md:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
          Leitura do CFOup
        </p>
        <h2
          className="mt-2 max-w-3xl text-balance text-[15px] md:text-base font-bold leading-snug"
          style={{ color: "var(--brand-navy)" }}
        >
          Negócio no azul: margem bruta subindo, líquida positiva, operação R$ 64k acima do ponto de equilíbrio.
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-[var(--slate-700)]">
          O aperto vem do estoque que prende mais dinheiro a cada mês e da despesa fixa pressionando a margem operacional. Cliente paga em dia, fornecedor no mesmo ritmo.
        </p>
      </section>

      {/* Grid de indicadores — 3 colunas */}
      <section className="mb-3 grid gap-4 md:grid-cols-3">
        {INDICADORES.map((ind) => (
          <IndicatorCard key={ind.label} {...ind} />
        ))}
      </section>

      {/* Bloco final — Atenção agora */}
      <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <span
          className="mb-3 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ background: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }}
        >
          Atenção agora
        </span>
        <ul className="space-y-2 text-[13.5px] leading-relaxed" style={{ color: "var(--brand-navy)" }}>
          <li>Revisar custo fixo no próximo fechamento.</li>
          <li>Olhar Prazo médio de estoque por linha de produto.</li>
        </ul>
      </section>
    </>
  )
}

function IndicatorCard({ label, value, delta, refText, status, leitura }: Indicator) {
  const styles = STATUS_STYLES[status]
  const statusLabel = STATUS_LABELS[status]

  const IconComponent = delta.startsWith("+") ? TrendingUp : delta.startsWith("−") || delta.startsWith("-") ? TrendingDown : Minus

  const deltaColor =
    status === "saudavel" ? "var(--brand-green-dark)" :
    status === "pressionando" ? "var(--brand-warning)" :
    status === "risco" ? "var(--brand-error-soft)" :
    "var(--brand-cyan)"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-5">
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: styles.color }}
      />
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <span
          className="shrink-0 rounded px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em]"
          style={{ background: styles.bg, color: styles.color }}
        >
          {statusLabel}
        </span>
      </div>
      <p
        className="text-[1.5rem] font-extrabold leading-none tabular-nums"
        style={{ color: "var(--brand-navy)" }}
      >
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: deltaColor }}>
        <IconComponent className="h-3.5 w-3.5" />
        {delta}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{refText}</p>
      <p
        className="mt-3 border-t border-border pt-3 text-[12.5px] leading-relaxed"
        style={{ color: "var(--brand-navy)" }}
      >
        {leitura}
      </p>
    </div>
  )
}
