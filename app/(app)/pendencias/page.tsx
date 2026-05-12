import { PageHeader } from "@/components/page-header"

type ConfidenceLevel = "alta" | "parcial" | "reduzida" | "insuficiente"
type ImpactWeight = "alto" | "medio" | "baixo"
type DecisionState = "confiavel" | "parcial" | "comprometida"

const CONFIDENCE_STYLES: Record<ConfidenceLevel, { bg: string; color: string; label: string }> = {
  alta: { bg: "rgba(54,186,88,0.18)", color: "var(--brand-green)", label: "Alta confiança" },
  parcial: { bg: "rgba(224,139,0,0.18)", color: "var(--brand-warning)", label: "Confiança parcial" },
  reduzida: { bg: "rgba(209,67,67,0.18)", color: "var(--brand-error-soft)", label: "Confiança reduzida" },
  insuficiente: { bg: "rgba(224,139,0,0.18)", color: "var(--brand-warning)", label: "Dados insuficientes" },
}

const WEIGHT_COLORS: Record<ImpactWeight, string> = {
  alto: "var(--brand-error-soft)",
  medio: "var(--brand-warning)",
  baixo: "var(--brand-blue)",
}

const STATE_STYLES: Record<DecisionState, { bg: string; color: string; label: string }> = {
  confiavel: { bg: "var(--brand-green)", color: "var(--brand-green)", label: "Confiável" },
  parcial: { bg: "var(--brand-warning)", color: "var(--brand-warning)", label: "Parcial" },
  comprometida: { bg: "var(--brand-error-soft)", color: "var(--brand-error-soft)", label: "Comprometida" },
}

interface Issue {
  weight: ImpactWeight
  title: string
  impact: string
  decisions: string[]
  action: string
}

interface DecisionChip {
  name: string
  state: DecisionState
}

// Mock data
const SCORE = 82
const CONFIDENCE_LEVEL: ConfidenceLevel = SCORE >= 90 ? "alta" : SCORE >= 70 ? "parcial" : SCORE >= 40 ? "reduzida" : "insuficiente"

const ISSUES: Issue[] = [
  {
    weight: "alto",
    title: "Saldo de abertura do Banco PJ não confirmado",
    impact: "−8%",
    decisions: ["caixa atual", "projeção de caixa 13 semanas"],
    action: "Confirmar saldo",
  },
  {
    weight: "medio",
    title: "12 saídas materiais sem categoria",
    impact: "−6%",
    decisions: ["margem", "fornecedor", "corte de custo"],
    action: "Classificar",
  },
  {
    weight: "medio",
    title: "Folha de abril não aparece no CF13",
    impact: "−4%",
    decisions: ["projeção de caixa 13 semanas", "folha"],
    action: "Adicionar evento",
  },
]

const DECISION_CHIPS: DecisionChip[] = [
  { name: "caixa atual", state: "confiavel" },
  { name: "projeção de caixa 13 semanas", state: "parcial" },
  { name: "margem", state: "parcial" },
  { name: "fornecedor", state: "parcial" },
  { name: "cliente", state: "confiavel" },
  { name: "impostos", state: "confiavel" },
  { name: "folha", state: "parcial" },
  { name: "corte de custo", state: "comprometida" },
  { name: "retirada do dono", state: "confiavel" },
]

const RELIABLE_DECISIONS = DECISION_CHIPS.filter((d) => d.state === "confiavel").map((d) => d.name)

export default function QualidadeDaDecisaoPage() {
  const confidenceStyle = CONFIDENCE_STYLES[CONFIDENCE_LEVEL]

  return (
    <>
      <PageHeader
        eyebrow="Mesa de Decisão"
        title="Qualidade da Decisão"
        description="O que define se o CFOup pode responder com confiança hoje."
      />

      {/* BLOCO 1 — Veredito (hero) */}
      <section
        className="mb-6 rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-deep) 60%, var(--brand-navy-light) 100%)",
        }}
      >
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-5xl md:text-6xl font-extrabold tabular-nums text-white leading-none">
              {SCORE}%
            </p>
            <span
              className="mt-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ background: confidenceStyle.bg, color: confidenceStyle.color }}
            >
              {confidenceStyle.label}
            </span>
          </div>
          <div>
            <p className="text-[13px] leading-relaxed text-white/85">
              O caixa e o faturamento estão atualizados, mas 18% das saídas ainda não têm categoria. Você pode decidir com confiança sobre caixa imediato; respostas sobre margem e fornecedor ficam parciais.
            </p>
            <p className="mt-3 text-[11px] text-white/60">Atualizado há 12 min</p>
          </div>
        </div>
      </section>

      {/* BLOCO 2 — O que reduz confiança hoje */}
      <section className="mb-6 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-bold" style={{ color: "var(--brand-navy)" }}>
            O que reduz confiança hoje
          </h2>
          <span className="text-[11px] text-muted-foreground">{ISSUES.length} itens</span>
        </div>
        <ul className="divide-y divide-border">
          {ISSUES.map((issue) => (
            <IssueRow key={issue.title} {...issue} />
          ))}
        </ul>
      </section>

      {/* BLOCO 3 — Como isso afeta suas decisões */}
      <section className="mb-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
          Como isso afeta suas decisões
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {DECISION_CHIPS.map((chip) => (
            <DecisionChipCard key={chip.name} {...chip} />
          ))}
        </div>
      </section>

      {/* BLOCO 4 — O que continua firme */}
      <section
        className="mb-6 rounded-2xl border border-border bg-card p-5"
        style={{ borderLeftWidth: "3px", borderLeftColor: "var(--brand-green)" }}
      >
        <h2 className="mb-2 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
          O que continua firme
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: "rgba(var(--brand-navy-rgb), 0.85)" }}>
          Hoje você pode decidir com confiança sobre {RELIABLE_DECISIONS.slice(0, -1).join(", ")} e {RELIABLE_DECISIONS.slice(-1)}. Os outros temas dependem das pendências acima.
        </p>
      </section>

      {/* BLOCO 5 — Histórico */}
      <p className="text-[11px] text-muted-foreground">
        Resolvido no mês: 14 itens · Confiança subiu de 68% para 82% nos últimos 30 dias.
      </p>
    </>
  )
}

function IssueRow({ weight, title, impact, decisions, action }: Issue) {
  const borderColor = WEIGHT_COLORS[weight]

  return (
    <li
      className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-start md:justify-between"
      style={{ borderLeftWidth: "3px", borderLeftColor: borderColor }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold leading-snug" style={{ color: "var(--brand-navy)" }}>
          {title}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
          Impacto: {impact}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {decisions.map((d) => (
            <span
              key={d}
              className="rounded-full border border-border bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]"
              style={{ color: "var(--brand-navy)" }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-bold transition hover:border-[var(--brand-blue)]/40"
        style={{ color: "var(--brand-navy)" }}
      >
        {action}
      </button>
    </li>
  )
}

function DecisionChipCard({ name, state }: DecisionChip) {
  const style = STATE_STYLES[state]

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-white p-3">
      <span
        className="text-[11px] font-bold uppercase tracking-[0.06em]"
        style={{ color: "var(--brand-navy)" }}
      >
        {name}
      </span>
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="h-2 w-2 rounded-full"
          style={{ background: style.bg }}
        />
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: style.color }}
        >
          {style.label}
        </span>
      </div>
    </div>
  )
}
