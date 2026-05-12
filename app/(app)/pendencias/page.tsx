import { PageHeader } from "@/components/page-header"
import {
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
  AlertCircle,
  ClipboardList,
  TrendingUp,
  Wallet,
  FileText,
  Users,
  LayoutGrid,
  Circle,
} from "lucide-react"

// ================================================================
// TYPES & CONSTANTS
// ================================================================

type Severity = "alta" | "media" | "baixa"

interface Driver {
  severity: Severity
  icon: React.ElementType
  title: string
  desc: string
  impact: string
}

interface Issue {
  severity: Severity
  icon: React.ElementType
  title: string
  sub: string
  impactText: string
  chips: string[]
  action: string
}

interface ReliableArea {
  icon: React.ElementType
  title: string
  desc: string
}

interface HistoryStep {
  pct: number
  date: string
  current?: boolean
}

const SEVERITY_STYLES: Record<Severity, { bg: string; color: string; label: string }> = {
  alta: { bg: "rgba(209,67,67,0.10)", color: "var(--brand-error-soft)", label: "Alta" },
  media: { bg: "rgba(224,139,0,0.12)", color: "var(--brand-warning)", label: "Média" },
  baixa: { bg: "#FFF7E0", color: "#A47900", label: "Baixa" },
}

// Chip colors for decision categories
const CHIP_COLORS: Record<string, { bg: string; color: string }> = {
  "caixa atual": { bg: "rgba(54,186,88,0.12)", color: "var(--brand-green)" },
  "projeção": { bg: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" },
  "margem": { bg: "rgba(0,180,180,0.10)", color: "var(--brand-cyan)" },
  "fornecedor": { bg: "rgba(209,67,67,0.10)", color: "var(--brand-error-soft)" },
  "cliente": { bg: "rgba(147,112,219,0.12)", color: "#7C5CBF" },
  "impostos": { bg: "#FFF7E0", color: "#A47900" },
  "folha": { bg: "rgba(15,42,90,0.10)", color: "var(--brand-navy)" },
  "corte": { bg: "rgba(139,69,69,0.12)", color: "#8B4545" },
  "retirada": { bg: "rgba(139,90,43,0.10)", color: "#8B5A2B" },
}

// ================================================================
// MOCK DATA
// ================================================================

const SCORE = 82
const UPDATED_AT = "20/05/2026 às 08:35"

const DRIVERS: Driver[] = [
  {
    severity: "alta",
    icon: AlertTriangle,
    title: "Saldo de abertura não confirmado em 1 conta",
    desc: "Impacta projeção de caixa e conciliações",
    impact: "−12%",
  },
  {
    severity: "media",
    icon: ClipboardList,
    title: "18 lançamentos sem categoria em saídas",
    desc: "Impacta margem, fornecedor e corte de custo",
    impact: "−6%",
  },
  {
    severity: "baixa",
    icon: Info,
    title: "Folha de pagamento de maio não localizada",
    desc: "Impacta folha, impostos e caixa",
    impact: "−4%",
  },
]

const ISSUES: Issue[] = [
  {
    severity: "alta",
    icon: AlertTriangle,
    title: "Saldo de abertura",
    sub: "Banco Bradesco PJ",
    impactText: "A projeção de caixa pode estar distorcida.",
    chips: ["caixa atual", "projeção", "margem"],
    action: "Confirmar saldo",
  },
  {
    severity: "alta",
    icon: ClipboardList,
    title: "18 lançamentos sem categoria",
    sub: "Últimos 15 dias",
    impactText: "Margem e custos por categoria podem estar subestimados.",
    chips: ["cliente", "fornecedor", "corte"],
    action: "Classificar agora",
  },
  {
    severity: "media",
    icon: Info,
    title: "Folha de pagamento de maio não localizada",
    sub: "Competência 05/2026",
    impactText: "Folha, impostos e caixa futuro podem estar incorretos.",
    chips: ["impostos", "folha"],
    action: "Enviar documento",
  },
  {
    severity: "media",
    icon: AlertCircle,
    title: "Fornecedor recorrente sem validação",
    sub: "7 fornecedores",
    impactText: "Risco de duplicidade ou dados incorretos nos próximos pagamentos.",
    chips: ["fornecedor", "caixa atual", "corte"],
    action: "Validar fornecedores",
  },
]

const RELIABLE_AREAS: ReliableArea[] = [
  { icon: Wallet, title: "Caixa atual", desc: "Dados bancários atualizados" },
  { icon: FileText, title: "Contas a receber", desc: "Faturamento e recebimentos ok" },
  { icon: Users, title: "Clientes", desc: "Base e movimentações confiáveis" },
  { icon: LayoutGrid, title: "Despesas fixas recorrentes", desc: "Identificadas e categorizadas" },
]

const HISTORY: HistoryStep[] = [
  { pct: 62, date: "10/05" },
  { pct: 71, date: "13/05" },
  { pct: 78, date: "16/05" },
  { pct: 82, date: "20/05", current: true },
]

// ================================================================
// PAGE COMPONENT
// ================================================================

export default function QualidadeDaDecisaoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mesa de Decisão"
        title="Qualidade da Decisão"
        description="Esta tela não lista tarefas. Ela controla se o CFOup pode dar uma recomendação financeira confiável hoje."
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">Dados atualizados em {UPDATED_AT}</span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white transition hover:border-[var(--brand-blue)]"
            aria-label="Atualizar dados"
          >
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-white transition hover:border-[var(--brand-blue)]"
            aria-label="Ajuda"
          >
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </PageHeader>

      {/* BLOCO 1 — Veredito + Drivers */}
      <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        {/* Card Esquerdo — Veredito */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            Qualidade da decisão
          </p>

          <div className="mt-4 flex items-center gap-6">
            {/* Gauge SVG */}
            <div className="relative h-[140px] w-[140px] shrink-0">
              <svg viewBox="0 0 140 140" className="h-full w-full">
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke="var(--brand-green)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 * (1 - SCORE / 100)}
                  transform="rotate(-90 70 70)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[30px] font-extrabold tabular-nums" style={{ color: "var(--brand-navy)" }}>
                  {SCORE}%
                </span>
                <span className="text-[11px] text-muted-foreground">de qualidade</span>
              </div>
            </div>

            {/* Info column */}
            <div className="flex flex-col gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold"
                style={{ background: "rgba(54,186,88,0.12)", color: "var(--brand-green)" }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Confiança parcial
              </span>
              <p className="text-[12.5px] leading-relaxed text-[var(--ink-soft)]">
                A leitura está boa, mas 2 itens reduzem a confiança em margem e projeção de caixa.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3.5 py-2 text-xs font-bold transition hover:border-[var(--brand-blue)]"
                style={{ color: "var(--brand-navy)" }}
              >
                Entenda o que afeta
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>

        {/* Card Direito — Drivers */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
                O que mais impacta a qualidade (drivers)
              </p>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-[11px] text-muted-foreground">Impacto no score</span>
          </div>

          <ul className="mt-3.5 divide-y divide-[var(--border-soft)]">
            {DRIVERS.map((driver) => {
              const style = SEVERITY_STYLES[driver.severity]
              const Icon = driver.icon
              return (
                <li key={driver.title} className="flex items-center gap-3.5 py-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: style.bg, color: style.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold" style={{ color: "var(--brand-navy)" }}>
                      {driver.title}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground">{driver.desc}</p>
                  </div>
                  <span
                    className="shrink-0 text-sm font-extrabold tabular-nums"
                    style={{ color: style.color }}
                  >
                    {driver.impact}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-0.5 text-xs font-bold"
              style={{ color: "var(--brand-blue)" }}
            >
              Ver todos os itens que impactam
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </section>
      </div>

      {/* BLOCO 2 — Tabela + Lateral */}
      <div className="mb-4 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        {/* Card Esquerdo — Tabela */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
              O que reduz a qualidade hoje
            </h2>
            <span className="text-xs font-semibold text-muted-foreground">{ISSUES.length} itens</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-[30%] py-2 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Problema
                  </th>
                  <th className="w-[24%] py-2 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Impacto na decisão
                  </th>
                  <th className="w-[22%] py-2 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Decisões afetadas
                  </th>
                  <th className="w-[24%] py-2 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Ação recomendada
                  </th>
                </tr>
              </thead>
              <tbody>
                {ISSUES.map((issue) => {
                  const style = SEVERITY_STYLES[issue.severity]
                  const Icon = issue.icon
                  const extraChips = issue.chips.length > 3 ? issue.chips.length - 3 : 0
                  const visibleChips = issue.chips.slice(0, 3)

                  return (
                    <tr key={issue.title} className="border-b border-[var(--border-soft)] align-top">
                      <td className="py-3.5 pr-3">
                        <span
                          className="mb-1.5 inline-block rounded px-2 py-0.5 text-[9.5px] font-bold uppercase"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {style.label}
                        </span>
                        <div className="flex gap-2.5">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: style.bg, color: style.color }}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-[12.5px] font-bold" style={{ color: "var(--brand-navy)" }}>
                              {issue.title}
                            </p>
                            <p className="text-[10.5px] text-muted-foreground">{issue.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <p className="text-xs leading-snug text-[var(--ink-muted)]">{issue.impactText}</p>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="flex flex-wrap gap-1.5">
                          {visibleChips.map((chip) => {
                            const chipStyle = CHIP_COLORS[chip] || { bg: "#EEF3F8", color: "var(--ink-muted)" }
                            return (
                              <span
                                key={chip}
                                className="flex h-7 w-7 items-center justify-center rounded-lg"
                                style={{ background: chipStyle.bg, color: chipStyle.color }}
                                title={chip}
                              >
                                <Circle className="h-3.5 w-3.5" />
                              </span>
                            )
                          })}
                          {extraChips > 0 && (
                            <span className="text-[11px] font-bold text-muted-foreground">+{extraChips}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <div className="flex flex-col items-start gap-1.5">
                          <button
                            type="button"
                            className="rounded-lg border border-border bg-white px-3.5 py-1.5 text-[11.5px] font-bold transition hover:border-[var(--brand-blue)]"
                            style={{ color: "var(--brand-navy)" }}
                          >
                            {issue.action}
                          </button>
                          <button
                            type="button"
                            className="text-[10.5px] font-semibold"
                            style={{ color: "var(--brand-blue)" }}
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-0.5 text-xs font-bold"
              style={{ color: "var(--brand-blue)" }}
            >
              Ver todos os itens
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </section>

        {/* Lateral Direita */}
        <div className="flex flex-col gap-4">
          {/* Card 1 — O que pode ser decidido */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-[18px] w-[18px]" style={{ color: "var(--brand-green)" }} />
              <h2 className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
                O que pode ser decidido mesmo assim
              </h2>
            </div>
            <p className="mb-3.5 mt-1 text-[11.5px] text-muted-foreground">
              Essas áreas estão confiáveis com os dados atuais.
            </p>

            <ul className="space-y-3">
              {RELIABLE_AREAS.map((area) => {
                const Icon = area.icon
                return (
                  <li key={area.title} className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "rgba(54,186,88,0.10)", color: "var(--brand-green)" }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[12.5px] font-bold" style={{ color: "var(--brand-navy)" }}>
                        {area.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{area.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-3.5 flex justify-end">
              <button
                type="button"
                className="text-[11px] font-semibold"
                style={{ color: "var(--brand-blue)" }}
              >
                Ver detalhes
              </button>
            </div>
          </section>

          {/* Card 2 — Evolução */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: "var(--brand-blue)" }} />
              <h2 className="text-sm font-bold" style={{ color: "var(--brand-navy)" }}>
                Evolução da qualidade
              </h2>
            </div>
            <p className="mb-3.5 mt-1 text-[11.5px] text-muted-foreground">
              Sua qualidade da decisão vem melhorando.
            </p>

            <div className="flex items-end justify-between gap-2">
              {HISTORY.map((step) => (
                <div
                  key={step.date}
                  className="flex flex-col items-center rounded-lg px-1 py-2"
                  style={step.current ? { background: "rgba(54,186,88,0.10)" } : undefined}
                >
                  <span
                    className="text-[15px] font-extrabold tabular-nums"
                    style={{ color: step.current ? "var(--brand-green)" : "var(--brand-navy)" }}
                  >
                    {step.pct}%
                  </span>
                  <span className="text-[10px] text-muted-foreground">{step.date}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* RODAPÉ — Legenda */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            Impacto no score
          </span>

          <div className="flex items-center gap-2.5">
            <span
              className="flex h-[30px] w-[30px] items-center justify-center rounded-lg"
              style={{ background: "rgba(209,67,67,0.10)", color: "var(--brand-error-soft)" }}
            >
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11.5px] font-bold" style={{ color: "var(--brand-navy)" }}>Alto impacto</p>
              <p className="text-[10.5px] tabular-nums text-muted-foreground">−8% a −15%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className="flex h-[30px] w-[30px] items-center justify-center rounded-lg"
              style={{ background: "rgba(224,139,0,0.12)", color: "var(--brand-warning)" }}
            >
              <AlertCircle className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11.5px] font-bold" style={{ color: "var(--brand-navy)" }}>Médio impacto</p>
              <p className="text-[10.5px] tabular-nums text-muted-foreground">−3% a −7%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className="flex h-[30px] w-[30px] items-center justify-center rounded-lg"
              style={{ background: "#FFF7E0", color: "#A47900" }}
            >
              <Info className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11.5px] font-bold" style={{ color: "var(--brand-navy)" }}>Baixo impacto</p>
              <p className="text-[10.5px] tabular-nums text-muted-foreground">−1% a −2%</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className="flex h-[30px] w-[30px] items-center justify-center rounded-lg"
              style={{ background: "#EEF3F8", color: "var(--ink-muted)" }}
            >
              <Circle className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11.5px] font-bold" style={{ color: "var(--brand-navy)" }}>Informativo</p>
              <p className="text-[10.5px] tabular-nums text-muted-foreground">sem impacto</p>
            </div>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 text-[11.5px] font-semibold"
            style={{ color: "var(--brand-blue)" }}
          >
            Entenda como o score é calculado
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </>
  )
}
