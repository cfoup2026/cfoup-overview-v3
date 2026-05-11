import Link from "next/link"
import { GitBranch, Plus, ArrowUpRight, Target, TrendingDown, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { clienteAtual } from "@/lib/clientes/cliente-atual"

export default function CenariosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Planejamento"
        title="Cenários"
        description="Compare decisões antes de tomar. Impacto direto em caixa, margem e fôlego de caixa."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand-navy)] px-3.5 py-2 text-xs font-bold text-white transition hover:brightness-110">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.2} />
            Novo cenário
          </button>
        }
      />

      {/* Destaque */}
      <section className="mb-3 overflow-hidden rounded-2xl border border-border bg-hero-gradient p-4 md:p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue)]">
          <Target className="h-3.5 w-3.5" />
          Cenário em análise
        </div>
        <h2 className="mt-2 max-w-2xl text-balance text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight" style={{ color: "var(--brand-navy)" }}>
          Antecipar 40% dos recebíveis e reforçar caixa em agosto
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ImpactTile label="Caixa imediato" value="+ R$ 244,8k" tone="positive" detail="em D+2" />
          <ImpactTile label="Resultado do mês" value="− R$ 7,1k" tone="negative" detail="custo da antecipação" />
          <ImpactTile label="Fôlego de caixa" value="9,1 meses" tone="neutral" detail="vs. 8,2 atuais" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/chat?q=${encodeURIComponent(
              `Analisa o cenário de antecipar 40% dos recebíveis (R$ 244,8k de caixa, R$ 7,1k de custo). Vale pra ${clienteAtual.empresa.nomeCurto} agora?`,
            )}&auto=1`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand-navy)] px-3.5 py-2 text-xs font-bold text-white hover:brightness-110"
          >
            Discutir com o CFOup
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-blue)]/40">
            Duplicar cenário
          </button>
        </div>
      </section>

      {/* Lista de cenários */}
      <section aria-labelledby="cenarios-list" className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 md:px-5 py-3">
          <h3 id="cenarios-list" className="text-[13px] font-bold" style={{ color: "var(--brand-navy)" }}>
            Todos os cenários
          </h3>
          <p className="text-[11px] text-muted-foreground">4 rascunhos · 2 salvos</p>
        </div>
        <ul className="divide-y divide-border">
          <ScenarioRow
            title="Antecipação de recebíveis"
            summary="Liberar caixa para reforçar estoque antes do pico de vendas"
            status="Em análise"
            impact="+R$ 244,8k caixa / −R$ 7,1k resultado"
          />
          <ScenarioRow
            title="Contratação de novo head comercial"
            summary="Ponto de equilíbrio em 4,5 meses considerando ramp-up"
            status="Rascunho"
            impact="−R$ 28k / mês até break-even"
          />
          <ScenarioRow
            title="Reajuste de preço da Linha B"
            summary="+3% em clientes recorrentes, churn estimado abaixo de 2%"
            status="Salvo"
            impact="+R$ 18,4k / mês projetados"
          />
          <ScenarioRow
            title="Renegociação de fornecedor crítico"
            summary="Alongar pagamento de 30 para 45 dias"
            status="Salvo"
            impact="+R$ 62k em capital de giro"
          />
        </ul>
      </section>
    </>
  )
}

function ImpactTile({
  label,
  value,
  tone,
  detail,
}: {
  label: string
  value: string
  tone: "positive" | "negative" | "neutral"
  detail: string
}) {
  const color =
    tone === "positive"
      ? "var(--brand-green-dark)"
      : tone === "negative"
        ? "var(--brand-red)"
        : "var(--brand-navy)"
  const Icon = tone === "positive" ? TrendingUp : tone === "negative" ? TrendingDown : GitBranch
  return (
    <div className="rounded-xl border border-border bg-white/80 p-4">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-[1.35rem] md:text-[1.45rem] font-extrabold leading-none tabular-nums" style={{ color }}>
        {value}
      </p>
      <p className="mt-1.5 text-[11px] text-muted-foreground">{detail}</p>
    </div>
  )
}

function ScenarioRow({
  title,
  summary,
  status,
  impact,
}: {
  title: string
  summary: string
  status: string
  impact: string
}) {
  return (
    <li className="flex flex-col gap-2 px-4 md:px-5 py-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 md:max-w-[56%]">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold" style={{ color: "var(--brand-navy)" }}>
            {title}
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {status}
          </span>
        </div>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{summary}</p>
      </div>
      <div className="flex items-center justify-between gap-4 md:justify-end">
        <span className="text-[13px] font-semibold tabular-nums" style={{ color: "var(--brand-navy)" }}>
          {impact}
        </span>
        <button
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--brand-blue)] hover:underline"
          type="button"
        >
          Abrir
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  )
}
