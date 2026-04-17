import Link from "next/link"
import {
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Info,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpToLine,
  History,
  ChevronRight,
} from "lucide-react"
import { LiquidezBlock } from "@/components/liquidez-block"
import { LiveStatus } from "@/components/live-status"

/* Helper: cria link pro Chat CFOup com pergunta pré-preenchida e auto-submit. */
function chatHref(q: string) {
  return `/chat?q=${encodeURIComponent(q)}&auto=1`
}

export default function VisaoGeralPage() {
  return (
    <>
      {/* Header compacto (inline, apenas nesta página) */}
      <header className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <h1
            className="text-balance text-lg font-extrabold leading-tight tracking-tight md:text-[1.3rem]"
            style={{ color: "var(--brand-navy)" }}
          >
            Bom dia, Roger. A operação está rodando, mas os números ainda precisam ser separados.
          </h1>
          <p className="mt-1.5 max-w-2xl text-pretty text-[13px] leading-relaxed text-muted-foreground">
            O banco mostra uma posição real de caixa, mas o sistema ainda pode estar misturando valores a receber e itens antigos em aberto. O primeiro passo é separar banco, receber, pagar e pendências antigas.
          </p>
        </div>
        <LiveStatus />
      </header>

      {/* ───────────────────────── Bloco 1 · Resumo executivo ───────────────────────── */}
      <section aria-labelledby="bloco-resumo" className="mb-3">
        <div className="overflow-hidden rounded-2xl border border-border bg-hero-gradient">
          <div className="grid gap-4 p-4 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-6 md:p-5">
            <div>
              <p
                className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--brand-blue)" }}
              >
                Resumo do momento
              </p>

              <h2
                id="bloco-resumo"
                className="text-balance text-[15px] font-bold leading-snug md:text-base"
                style={{ color: "var(--brand-navy)" }}
              >
                O primeiro passo aqui é separar o que está no banco do que ainda está no sistema.
              </h2>

              <p className="mt-1.5 max-w-xl text-pretty text-[13px] leading-relaxed text-[var(--slate-700)]">
                Com isso limpo, fica mais fácil entender o que realmente falta receber, o que precisa ser
                pago e o que ainda pede revisão.
              </p>
            </div>

            <div className="flex items-baseline justify-between gap-4 rounded-xl border border-[var(--brand-blue)]/20 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Saldo atual
              </p>
              <p
                className="text-[1.5rem] font-extrabold leading-none tabular-nums"
                style={{ color: "var(--brand-navy)" }}
              >
                R$ 43.677
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Blocos investigáveis ─────────────────────────
          Resumo primeiro; clique abre a lista detalhada com filtros. */}
      <section aria-labelledby="bloco-investigar" className="mb-3">
        <h2 id="bloco-investigar" className="sr-only">
          Onde investigar a fundo
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <DrillInCard
            href="/contas-a-receber"
            eyebrow="Contas a receber"
            icon={ArrowDownToLine}
            total="R$ 342,8k"
            count="10 títulos"
            hint="2 vencidos · 3 vencem em 7 dias"
          />
          <DrillInCard
            href="/contas-a-pagar"
            eyebrow="Contas a pagar"
            icon={ArrowUpToLine}
            total="R$ 280,2k"
            count="9 títulos"
            hint="1 vencido · 3 vencem em 7 dias"
          />
          <DrillInCard
            href="/itens-antigos"
            eyebrow="Itens antigos"
            icon={History}
            total="R$ 112,5k"
            count="8 itens"
            hint="4 acima de 90 dias"
          />
        </div>
      </section>

      {/* ───────────────────────── Grid de decisão ───────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Bloco 2 · Caixa / liquidez por período */}
        <LiquidezBlock />

        {/* Bloco 4 · Alertas e exceções */}
        <section
          aria-labelledby="bloco-alertas"
          className="lg:col-span-5 rounded-2xl border border-border bg-card p-4 md:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Alertas e exceções
              </p>
              <h2 id="bloco-alertas" className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
                3 pontos de atenção
              </h2>
            </div>
            <Link
              href="/pendencias"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-blue)] hover:underline"
            >
              Ver todas
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="mt-3 divide-y divide-border">
            <AlertRow
              severity="warning"
              title="Caixa e recebíveis podem estar misturados"
              body="O valor exibido pode incluir títulos ainda em aberto no sistema."
            />
            <AlertRow
              severity="info"
              title="Conciliação pendente"
              body="Há sinais de que recebimentos e baixas ainda não estão fechando bem."
            />
            <AlertRow
              severity="warning"
              title="Receber vencido precisa ser revisado"
              body="Parte do saldo a receber pode já ter sido liquidada ou precisa de cobrança."
            />
          </ul>
        </section>

        {/* Bloco 3 · Análise de clientes */}
        <section
          aria-labelledby="bloco-clientes"
          className="lg:col-span-7 rounded-2xl border border-border bg-card p-4 md:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Análise de clientes
              </p>
              <h2 id="bloco-clientes" className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
                Top 5 no período
              </h2>
            </div>
            <Link
              href="/clientes"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-blue)] hover:underline"
            >
              Ver todos
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Top 5 clientes */}
          <ul className="mt-3 space-y-2">
            <TopClientRow rank={1} name="Construtora Andrade" value="R$ 82.400" share={24} />
            <TopClientRow rank={2} name="Metalúrgica Vitória" value="R$ 54.100" share={16} />
            <TopClientRow rank={3} name="Grupo Sertanejo" value="R$ 41.800" share={12} />
            <TopClientRow rank={4} name="Laticínios Bela Vista" value="R$ 32.600" share={9} />
            <TopClientRow rank={5} name="Transportadora Linha Azul" value="R$ 24.200" share={7} />
          </ul>

          {/* KPIs clicáveis */}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <ClientKpi
              href="/contas-a-receber"
              label="A receber em aberto"
              value="R$ 342,8k"
              hint="32% vencido"
              tone="warning"
            />
            <ClientKpi
              href="/clientes/atraso"
              label="Atraso médio"
              value="18 dias"
              hint="+4 vs mês anterior"
              tone="warning"
            />
            <ClientKpi
              href="/clientes?status=ativos"
              label="Clientes pagantes"
              value="47"
              hint="+5 vs mês anterior"
              tone="neutral"
            />
          </div>

          {/* Risco principal */}
          <Link
            href="/clientes/concentracao"
            className="group mt-3 flex items-start gap-2.5 rounded-xl border border-[rgba(234,179,8,0.35)] bg-[rgba(234,179,8,0.08)] px-3 py-2.5 transition hover:border-[rgba(234,179,8,0.55)]"
          >
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
              style={{ background: "rgba(234,179,8,0.18)", color: "#b45309" }}
            >
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#92400e]">
                Risco principal
              </p>
              <p className="mt-0.5 text-[13px] font-semibold leading-snug" style={{ color: "var(--brand-navy)" }}>
                Top 5 clientes concentram 68% da receita do período.
              </p>
            </div>
            <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[var(--brand-blue)] transition group-hover:underline">
              Ver detalhes
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </Link>
        </section>

        {/* Bloco 5 · Ação principal / Chat CFOup */}
        <section
          aria-labelledby="bloco-acao"
          className="lg:col-span-5 overflow-hidden rounded-2xl border border-[rgba(21,103,200,0.25)] bg-brand-gradient p-4 text-white md:p-5"
        >
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Ação principal
          </div>
          <h2 id="bloco-acao" className="mt-1.5 text-balance text-lg font-extrabold leading-tight md:text-[1.25rem]">
            Quero separar banco, receber e pendências.
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/85">
            Abra o Chat CFOup para revisar o que é saldo real, o que ainda falta entrar e o que precisa de
            auditoria no sistema.
          </p>

          <Link
            href={chatHref(
              "Separe para mim o que é saldo real no banco, o que está em contas a receber e o que pode estar vencido ou sem baixa.",
            )}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[var(--brand-navy)] shadow-sm transition hover:bg-white/95"
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
            Abrir Chat CFOup
          </Link>

          <div className="mt-4 grid gap-1.5 text-sm">
            <SuggestedPrompt text="Qual o impacto se eu antecipar 40% dos recebíveis?" />
            <SuggestedPrompt text="Como tá a saúde financeira comparada ao trimestre passado?" />
            <SuggestedPrompt text="Onde tô perdendo margem nos últimos 60 dias?" />
          </div>
        </section>
      </div>
    </>
  )
}

/* ───────────────────────── helpers ───────────────────────── */

function DrillInCard({
  href,
  eyebrow,
  icon: Icon,
  total,
  count,
  hint,
}: {
  href: string
  eyebrow: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  total: string
  count: string
  hint: string
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition hover:-translate-y-0.5 hover:border-[var(--brand-blue)]/40 hover:shadow-[0_6px_24px_-12px_rgba(7,29,59,0.25)]"
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
          <p className="text-[11px] text-muted-foreground">{count}</p>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <p
            className="text-[1.25rem] font-extrabold leading-none tabular-nums"
            style={{ color: "var(--brand-navy)" }}
          >
            {total}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
        </div>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-navy)]"
        strokeWidth={2.2}
      />
    </Link>
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
    <li className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0">
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: bg, color }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--brand-navy)" }}>
          {title}
        </p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </li>
  )
}

function TopClientRow({
  rank,
  name,
  value,
  share,
}: {
  rank: number
  name: string
  value: string
  share: number
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-bold tabular-nums"
        style={{ color: "var(--brand-navy)" }}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>
            {name}
          </p>
          <p className="shrink-0 text-[13px] font-bold tabular-nums" style={{ color: "var(--brand-navy)" }}>
            {value}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div
            className="h-1 flex-1 overflow-hidden rounded-full"
            style={{ background: "rgba(21,103,200,0.10)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(share * 3, 100)}%`,
                background: "var(--brand-blue)",
              }}
            />
          </div>
          <p className="shrink-0 text-[11px] font-semibold tabular-nums text-muted-foreground">
            {share}% da receita
          </p>
        </div>
      </div>
    </li>
  )
}

function ClientKpi({
  href,
  label,
  value,
  hint,
  tone,
}: {
  href: string
  label: string
  value: string
  hint: string
  tone: "warning" | "neutral"
}) {
  const hintColor = tone === "warning" ? "#b45309" : "var(--slate-600)"
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-xl border border-border bg-card px-3 py-2.5 transition hover:border-[var(--brand-blue)]/40 hover:bg-muted/40"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <ChevronRight
          className="h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-navy)]"
          strokeWidth={2.2}
        />
      </div>
      <p className="text-[1.125rem] font-extrabold leading-none tabular-nums" style={{ color: "var(--brand-navy)" }}>
        {value}
      </p>
      <p className="text-[11px] font-medium" style={{ color: hintColor }}>
        {hint}
      </p>
    </Link>
  )
}

function SuggestedPrompt({ text }: { text: string }) {
  return (
    <Link
      href={chatHref(text)}
      className="flex items-center justify-between gap-2.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[12px] leading-snug text-white/90 transition hover:bg-white/10"
    >
      <span className="line-clamp-1">{text}</span>
      <TrendingUp className="h-3.5 w-3.5 shrink-0 text-white/70" />
    </Link>
  )
}
