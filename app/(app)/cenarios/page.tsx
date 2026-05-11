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
          <ImpactTile label="Caixa agora" value="+ R$ 244,8k" tone="positive" detail="entra em até 2 dias" />
          <ImpactTile label="Custo da decisão" value="− R$ 7,1k" tone="negative" detail="sai do resultado do mês" />
          <ImpactTile label="Fôlego de caixa" value="9,1 meses" tone="neutral" detail="vs. 8,2 sem o cenário" />
        </div>

        {/* Impacto 13 semanas */}
        <WeeksImpactBlock />

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
            Decisões em simulação
          </h3>
          <p className="text-[11px] text-muted-foreground">4 em análise · 2 salvas</p>
        </div>
        <ul className="divide-y divide-border">
          <ScenarioRow
            title="Antecipar 40% dos recebíveis"
            summary="Cobrir aperto de caixa antes do pico de venda"
            status="Em análise"
            impact="+R$ 244,8k caixa / −R$ 7,1k resultado"
          />
          <ScenarioRow
            title="Contratar mais um vendedor sênior"
            summary="Aumentar venda nova sem sobrecarregar o time atual"
            status="Rascunho"
            impact="−R$ 28k/mês até se pagar"
          />
          <ScenarioRow
            title="Reajustar preço da Linha B"
            summary="Recuperar margem que vem caindo por desconto"
            status="Salvo"
            impact="+R$ 18,4k/mês"
          />
          <ScenarioRow
            title="Renegociar prazo com fornecedor"
            summary="Ganhar fôlego de pagamento sem queimar relação"
            status="Salvo"
            impact="+R$ 62k de fôlego"
          />
        </ul>
      </section>
    </>
  )
}

type WeekEffect =
  | { label: string; kind: "positive" | "negative"; value: string }
  | { label: string; kind: "qualitative"; text: string }
  | { label: string; kind: "empty" }

const WEEKS_IMPACT: WeekEffect[] = [
  { label: "S1", kind: "positive", value: "+R$ 244,8k" },
  { label: "S2", kind: "empty" },
  { label: "S3", kind: "qualitative", text: "evita aperto" },
  { label: "S4", kind: "negative", value: "−R$ 7,1k" },
  { label: "S5", kind: "empty" },
  { label: "S6", kind: "empty" },
  { label: "S7", kind: "empty" },
  { label: "S8", kind: "empty" },
  { label: "S9", kind: "empty" },
  { label: "S10", kind: "empty" },
  { label: "S11", kind: "empty" },
  { label: "S12", kind: "empty" },
  { label: "S13", kind: "empty" },
]

function WeeksImpactBlock() {
  return (
    <div className="mt-4 rounded-xl border border-border bg-white/80 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Impacto nas próximas 13 semanas
      </p>

      <div className="mt-3 grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
        {WEEKS_IMPACT.map((w) => (
          <div
            key={w.label}
            className="flex min-h-[48px] flex-col items-center justify-start gap-1 rounded py-1.5"
            style={{
              background: w.kind === "empty" ? "transparent" : "rgba(21,103,200,0.04)",
            }}
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {w.label}
            </span>
            {w.kind === "positive" && (
              <span
                className="text-[10px] font-bold leading-none tabular-nums"
                style={{ color: "var(--brand-green-dark)" }}
              >
                {w.value}
              </span>
            )}
            {w.kind === "negative" && (
              <span
                className="text-[10px] font-bold leading-none tabular-nums"
                style={{ color: "var(--brand-red)" }}
              >
                {w.value}
              </span>
            )}
            {w.kind === "qualitative" && (
              <span
                className="text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.06em]"
                style={{ color: "var(--brand-cyan)" }}
              >
                {w.text}
              </span>
            )}
            {w.kind === "empty" && (
              <span className="text-[10px] leading-none text-muted-foreground">—</span>
            )}
          </div>
        ))}
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
