import Link from "next/link"
import { GitBranch, Plus, ArrowUpRight, Target, TrendingDown, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/page-header"

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
          Decisão em teste
        </div>
        <h2 className="mt-2 max-w-2xl text-balance text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight" style={{ color: "var(--brand-navy)" }}>
          Antecipar recebíveis segura agosto?
        </h2>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-[var(--slate-700)]">
          Entra caixa agora, mas a decisão custa margem e pode virar hábito se o aperto voltar.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ImpactTile label="Caixa agora" value="+ R$ 244,8k" tone="positive" detail="entra em até 2 dias" />
          <ImpactTile label="Custo da decisão" value="− R$ 7,1k" tone="negative" detail="sai do resultado do mês" />
          <ImpactTile label="Fôlego de caixa" value="9,1 meses" tone="neutral" detail="ganha quase 1 mês" />
        </div>

        {/* Impacto 13 semanas */}
        <WeeksImpactBlock />

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/chat?q=${encodeURIComponent(
              `Analisa o cenário de antecipar 40% dos recebíveis (R$ 244,8k de caixa, R$ 7,1k de custo). Vale agora?`,
            )}&auto=1`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-blue)]/40"
          >
            Discutir com o CFOup
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Lista de cenários */}
      <section aria-labelledby="cenarios-list" className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 md:px-5 py-3">
          <h3 id="cenarios-list" className="text-[13px] font-bold" style={{ color: "var(--brand-navy)" }}>
            Outras decisões para testar
          </h3>
          <p className="text-[11px] text-muted-foreground">3 prontas pra testar</p>
        </div>
        <ul className="divide-y divide-border">
          <ScenarioRow
            title="Contratar mais um vendedor"
            summary="Aumentar venda nova sem sobrecarregar o time"
            impact="−R$ 28k/mês até começar a se pagar"
          />
          <ScenarioRow
            title="Reajustar preço da Linha B"
            summary="Corrigir margem sem perder cliente bom"
            impact="+R$ 18,4k/mês se volume segurar"
          />
          <ScenarioRow
            title="Renegociar prazo com fornecedor"
            summary="Ganhar fôlego de pagamento sem queimar relação"
            impact="+R$ 62k de fôlego se prazo virar 45 dias"
          />
        </ul>
      </section>
    </>
  )
}

type WeekEffect =
  | { label: string; tone: "positive" | "negative" | "neutral"; text: string }
  | { label: string; tone: "empty" }

const WEEKS_IMPACT: WeekEffect[] = [
  { label: "S1",  tone: "positive", text: "entra caixa" },
  { label: "S2",  tone: "empty" },
  { label: "S3",  tone: "neutral",  text: "evita aperto" },
  { label: "S4",  tone: "negative", text: "custo aparece" },
  { label: "S5",  tone: "empty" },
  { label: "S6",  tone: "empty" },
  { label: "S7",  tone: "empty" },
  { label: "S8",  tone: "empty" },
  { label: "S9",  tone: "empty" },
  { label: "S10", tone: "empty" },
  { label: "S11", tone: "empty" },
  { label: "S12", tone: "empty" },
  { label: "S13", tone: "empty" },
]

function WeeksImpactBlock() {
  return (
    <div className="mt-4 rounded-xl border border-border bg-white/80 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Impacto nas próximas 13 semanas
      </p>

      <div className="mt-3 grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
        {WEEKS_IMPACT.map((w) => {
          const color =
            w.tone === "positive" ? "var(--brand-green-dark)" :
            w.tone === "negative" ? "var(--brand-red)" :
            w.tone === "neutral"  ? "var(--brand-cyan)" :
            "var(--muted-foreground)"
          const hasEffect = w.tone !== "empty"
          return (
            <div
              key={w.label}
              className="flex min-h-[48px] flex-col items-center justify-start gap-1 rounded py-1.5"
              style={{
                background: hasEffect ? "rgba(21,103,200,0.04)" : "transparent",
              }}
            >
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {w.label}
              </span>
              {hasEffect ? (
                <span
                  className="text-[9px] font-semibold uppercase leading-tight tracking-[0.06em] text-center"
                  style={{ color }}
                >
                  {w.text}
                </span>
              ) : (
                <span className="text-[10px] leading-none text-muted-foreground">—</span>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-[var(--slate-700)]">
        Esse cenário compra fôlego agora, mas custa R$ 7,1k e não corrige a causa se o aperto voltar no mês seguinte.
      </p>
    </div>
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
  impact,
}: {
  title: string
  summary: string
  impact: string
}) {
  return (
    <li className="flex flex-col gap-2 px-4 md:px-5 py-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 md:max-w-[58%]">
        <span className="text-[13px] font-bold" style={{ color: "var(--brand-navy)" }}>
          {title}
        </span>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{summary}</p>
      </div>
      <div className="flex items-center justify-between gap-3 md:justify-end">
        <span className="text-[13px] font-semibold tabular-nums" style={{ color: "var(--brand-navy)" }}>
          {impact}
        </span>
        <button
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--brand-blue)] hover:underline"
          type="button"
        >
          Testar
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  )
}
