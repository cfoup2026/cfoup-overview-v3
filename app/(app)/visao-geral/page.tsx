import Link from "next/link"
import {
  ArrowUpRight,
  ArrowDownRight,
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

        {/* Bloco 3 · Entradas e saídas recentes */}
        <section
          aria-labelledby="bloco-movimentos"
          className="lg:col-span-7 rounded-2xl border border-border bg-card p-4 md:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Movimentações recentes
              </p>
              <h2 id="bloco-movimentos" className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
                Últimos 7 dias
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-[var(--brand-green-dark)]">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span className="font-semibold tabular-nums">+R$ 142,3k</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[var(--slate-600)]">
                <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span className="font-semibold tabular-nums">−R$ 88,9k</span>
              </span>
            </div>
          </div>

          <ul className="mt-3 divide-y divide-border">
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
    <li className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: positive ? "rgba(54,186,88,0.12)" : "rgba(15,23,42,0.06)",
            color: positive ? "var(--brand-green-dark)" : "var(--slate-700)",
          }}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold" style={{ color: "var(--brand-navy)" }}>
            {label}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {when} · {meta}
          </p>
        </div>
      </div>
      <span
        className="shrink-0 text-[13px] font-bold tabular-nums"
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
      href={chatHref(text)}
      className="flex items-center justify-between gap-2.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[12px] leading-snug text-white/90 transition hover:bg-white/10"
    >
      <span className="line-clamp-1">{text}</span>
      <TrendingUp className="h-3.5 w-3.5 shrink-0 text-white/70" />
    </Link>
  )
}
