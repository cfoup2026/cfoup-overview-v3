import Link from "next/link"
import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertTriangle,
  Info,
  TrendingUp,
  ShieldCheck,
  CircleDot,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function VisaoGeralPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mesa de decisão · hoje"
        title="Bom dia, Usuário. Sua empresa está saudável."
        description="Esta é a leitura do CFOup sobre Sua empresa. Três sinais merecem atenção, nenhum pede ação imediata. A decisão principal de hoje está destacada abaixo."
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              aria-hidden
              className="inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--brand-green)" }}
            />
            Atualizado há 12 minutos
          </div>
        }
      />

      {/* ───────────────────────── Bloco 1 · Resumo executivo / saúde financeira ───────────────────────── */}
      <section aria-labelledby="bloco-resumo" className="mb-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-hero-gradient">
          <div className="grid gap-8 p-8 md:grid-cols-[1.3fr_1fr] md:p-10">
            <div>
              <div className="mb-5 flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(54,186,88,0.12)", color: "var(--brand-green-dark)" }}
                >
                  <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                </span>
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--brand-green-dark)" }}
                >
                  Saúde financeira · Saudável
                </span>
              </div>

              <h2
                id="bloco-resumo"
                className="text-balance text-2xl font-extrabold leading-tight md:text-3xl"
                style={{ color: "var(--brand-navy)" }}
              >
                Sua empresa fechou os últimos 30 dias com caixa estável e margem operacional
                dentro da meta.
              </h2>

              <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-[var(--slate-700)]">
                A geração de caixa operacional cobriu todas as saídas do período. O CFOup
                identificou três exceções pontuais e uma oportunidade de ganho de margem no
                próximo ciclo.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <SignalPill tone="positive" label="Caixa operacional positivo" />
                <SignalPill tone="neutral" label="Margem dentro da meta" />
                <SignalPill tone="warning" label="3 exceções mapeadas" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 self-center">
              <MetricTile label="Receita 30d" value="R$ 482,1k" trend="+6,4%" positive />
              <MetricTile label="Resultado" value="R$ 71,8k" trend="+2,1%" positive />
              <MetricTile label="Margem líq." value="14,9%" trend="−0,3 p.p." />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Grid de decisão ───────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Bloco 2 · Caixa / runway / liquidez */}
        <section
          aria-labelledby="bloco-caixa"
          className="lg:col-span-7 rounded-2xl border border-border bg-card p-7 md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Caixa e liquidez
              </p>
              <h2 id="bloco-caixa" className="mt-1 text-xl font-bold" style={{ color: "var(--brand-navy)" }}>
                Runway confortável
              </h2>
            </div>
            <Link
              href="/fluxo-de-caixa"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-blue)] hover:underline"
            >
              Fluxo de caixa
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Caixa disponível
              </p>
              <p
                className="mt-2 text-[2.25rem] font-extrabold leading-none tabular-nums"
                style={{ color: "var(--brand-navy)" }}
              >
                R$ 1,284M
              </p>
              <p className="mt-1 text-xs text-[var(--brand-green-dark)]">+R$ 48,7k vs. mês anterior</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Runway
              </p>
              <p
                className="mt-2 text-[2.25rem] font-extrabold leading-none tabular-nums"
                style={{ color: "var(--brand-navy)" }}
              >
                8,2<span className="ml-1 text-lg font-bold text-muted-foreground">meses</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">ao ritmo de queima atual</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Queima / mês
              </p>
              <p
                className="mt-2 text-[2.25rem] font-extrabold leading-none tabular-nums"
                style={{ color: "var(--brand-navy)" }}
              >
                R$ 156k
              </p>
              <p className="mt-1 text-xs text-muted-foreground">média móvel 3 meses</p>
            </div>
          </div>

          <div className="mt-7">
            <CashflowSpark />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Fev</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>Mai</span>
              <span>Jun</span>
              <span>Jul</span>
              <span className="font-semibold text-[var(--brand-navy)]">Ago</span>
            </div>
          </div>
        </section>

        {/* Bloco 4 · Alertas e exceções */}
        <section
          aria-labelledby="bloco-alertas"
          className="lg:col-span-5 rounded-2xl border border-border bg-card p-7 md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Alertas e exceções
              </p>
              <h2 id="bloco-alertas" className="mt-1 text-xl font-bold" style={{ color: "var(--brand-navy)" }}>
                3 itens para observar
              </h2>
            </div>
            <Link
              href="/pendencias"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-blue)] hover:underline"
            >
              Ver todas
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="mt-6 divide-y divide-border">
            <AlertRow
              severity="warning"
              title="Concentração de receita"
              body="Um cliente representa 34% da receita dos últimos 90 dias."
            />
            <AlertRow
              severity="info"
              title="Conciliação pendente"
              body="7 lançamentos aguardam classificação no Banco PJ."
            />
            <AlertRow
              severity="warning"
              title="Prazo médio de recebimento subiu"
              body="PMR foi de 28 para 34 dias no último ciclo."
            />
          </ul>
        </section>

        {/* Bloco 3 · Entradas e saídas recentes */}
        <section
          aria-labelledby="bloco-movimentos"
          className="lg:col-span-7 rounded-2xl border border-border bg-card p-7 md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Movimentações recentes
              </p>
              <h2 id="bloco-movimentos" className="mt-1 text-xl font-bold" style={{ color: "var(--brand-navy)" }}>
                Últimos 7 dias
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-[var(--brand-green-dark)]">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                <span className="font-semibold tabular-nums">+R$ 142,3k</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--slate-600)]">
                <ArrowDownRight className="h-4 w-4" strokeWidth={2.2} />
                <span className="font-semibold tabular-nums">−R$ 88,9k</span>
              </span>
            </div>
          </div>

          <ul className="mt-6 divide-y divide-border">
            <MovementRow
              kind="in"
              when="Hoje · 09:42"
              label="Recebimento de cliente"
              meta="Contrato recorrente · Banco PJ"
              amount="+ R$ 24.800,00"
            />
            <MovementRow
              kind="out"
              when="Hoje · 08:10"
              label="Folha de pagamento"
              meta="Parcela mensal · Banco PJ"
              amount="− R$ 62.140,00"
            />
            <MovementRow
              kind="in"
              when="Ontem"
              label="Repasse de gateway"
              meta="Vendas online · D+1"
              amount="+ R$ 17.320,55"
            />
            <MovementRow
              kind="out"
              when="Ontem"
              label="Pagamento a fornecedor"
              meta="Insumos · 30 dias"
              amount="− R$ 9.480,00"
            />
            <MovementRow
              kind="in"
              when="3 dias"
              label="Recebimento em boleto"
              meta="Cliente corporativo"
              amount="+ R$ 41.000,00"
            />
          </ul>
        </section>

        {/* Bloco 5 · Ação principal / Chat CFOup */}
        <section
          aria-labelledby="bloco-acao"
          className="lg:col-span-5 overflow-hidden rounded-2xl border border-[rgba(21,103,200,0.25)] bg-brand-gradient p-7 text-white md:p-8"
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Ação principal
          </div>
          <h2 id="bloco-acao" className="mt-3 text-balance text-[1.65rem] font-extrabold leading-tight">
            Devo antecipar recebíveis este mês?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/85">
            Com PMR subindo e caixa confortável, o CFOup preparou um diagnóstico em 3
            passos. Inclui impacto no resultado e no runway.
          </p>

          <Link
            href="/chat"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[var(--brand-navy)] shadow-sm transition hover:bg-white/95"
          >
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
            Abrir Chat CFOup
          </Link>

          <div className="mt-7 grid gap-2 text-sm">
            <SuggestedPrompt text="Qual o impacto se eu antecipar 40% dos recebíveis?" />
            <SuggestedPrompt text="Como está a saúde financeira comparada ao trimestre passado?" />
            <SuggestedPrompt text="Onde estou perdendo margem nos últimos 60 dias?" />
          </div>
        </section>
      </div>
    </>
  )
}

/* ───────────────────────── helpers ───────────────────────── */

function SignalPill({
  tone,
  label,
}: {
  tone: "positive" | "warning" | "neutral"
  label: string
}) {
  const styles =
    tone === "positive"
      ? { background: "rgba(54,186,88,0.12)", color: "var(--brand-green-dark)" }
      : tone === "warning"
        ? { background: "rgba(234,179,8,0.14)", color: "#92610b" }
        : { background: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={styles}
    >
      <CircleDot className="h-3 w-3" strokeWidth={2.4} />
      {label}
    </span>
  )
}

function MetricTile({
  label,
  value,
  trend,
  positive = false,
}: {
  label: string
  value: string
  trend: string
  positive?: boolean
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-white/80 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-extrabold tabular-nums leading-none" style={{ color: "var(--brand-navy)" }}>
        {value}
      </p>
      <p
        className="mt-1.5 text-[11px] font-semibold"
        style={{ color: positive ? "var(--brand-green-dark)" : "var(--slate-500)" }}
      >
        {trend}
      </p>
    </div>
  )
}

function AlertRow({
  severity,
  title,
  body,
}: {
  severity: "warning" | "info"
  title: string
  body: string
}) {
  const Icon = severity === "warning" ? AlertTriangle : Info
  const color = severity === "warning" ? "#b45309" : "var(--brand-blue)"
  const bg = severity === "warning" ? "rgba(234,179,8,0.12)" : "rgba(21,103,200,0.10)"
  return (
    <li className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: bg, color }}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight" style={{ color: "var(--brand-navy)" }}>
          {title}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </li>
  )
}

function MovementRow({
  kind,
  when,
  label,
  meta,
  amount,
}: {
  kind: "in" | "out"
  when: string
  label: string
  meta: string
  amount: string
}) {
  const positive = kind === "in"
  return (
    <li className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 min-w-0">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: positive ? "rgba(54,186,88,0.12)" : "rgba(15,23,42,0.06)",
            color: positive ? "var(--brand-green-dark)" : "var(--slate-700)",
          }}
        >
          {positive ? (
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          ) : (
            <ArrowDownRight className="h-4 w-4" strokeWidth={2.2} />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>
            {label}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {when} · {meta}
          </p>
        </div>
      </div>
      <span
        className="shrink-0 text-sm font-bold tabular-nums"
        style={{ color: positive ? "var(--brand-green-dark)" : "var(--slate-800)" }}
      >
        {amount}
      </span>
    </li>
  )
}

function SuggestedPrompt({ text }: { text: string }) {
  return (
    <Link
      href="/chat"
      className="flex items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-[13px] leading-snug text-white/90 transition hover:bg-white/10"
    >
      <span className="line-clamp-1">{text}</span>
      <TrendingUp className="h-4 w-4 shrink-0 text-white/70" />
    </Link>
  )
}

/** Sparkline discreto do caixa — SVG inline, sem libs. */
function CashflowSpark() {
  const pts = [30, 36, 42, 38, 52, 58, 62, 74]
  const w = 560
  const h = 96
  const stepX = w / (pts.length - 1)
  const max = Math.max(...pts)
  const min = Math.min(...pts)
  const range = max - min || 1
  const path = pts
    .map((v, i) => {
      const x = i * stepX
      const y = h - ((v - min) / range) * (h - 12) - 6
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
  const area = `${path} L${w},${h} L0,${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="96" aria-hidden="true" className="block">
      <defs>
        <linearGradient id="ca" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1567C8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1567C8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ca)" />
      <path d={path} fill="none" stroke="#1567C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((pts[pts.length - 1] - min) / range) * (h - 12) - 6} r="4" fill="#36BA58" />
    </svg>
  )
}
