"use client"

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
import { useVisaoGeralData, type DrilldownIcon } from "@/lib/hooks/use-visao-geral-data"

/* Helper: cria link pro Chat CFOup com pergunta pré-preenchida e auto-submit. */
function chatHref(q: string) {
  return `/chat?q=${encodeURIComponent(q)}&auto=1`
}

/* Mapa de ícones dos cards de drilldown — o hook devolve o nome, aqui resolvemos o componente. */
const DRILLDOWN_ICON: Record<
  DrilldownIcon,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  receber: ArrowDownToLine,
  pagar: ArrowUpToLine,
  antigos: History,
  concentracao: TrendingUp,
}

export default function VisaoGeralPage() {
  const data = useVisaoGeralData()

  return (
    <>
      {/* Header compacto (inline, apenas nesta página) */}
      <header className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <h1
            className="text-balance text-lg font-extrabold leading-tight tracking-tight md:text-[1.3rem]"
            style={{ color: "var(--brand-navy)" }}
          >
            {data.greeting}, {data.userName}. {data.headline}
          </h1>
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
                {data.resumoEyebrow}
              </p>

              <h2
                id="bloco-resumo"
                className="text-balance text-[15px] font-bold leading-snug md:text-base"
                style={{ color: "var(--brand-navy)" }}
              >
                {data.resumoTitulo}
              </h2>

              <p className="mt-1.5 max-w-xl text-pretty text-[13px] leading-relaxed text-[var(--slate-700)]">
                {data.resumoTexto}
              </p>
            </div>

            <div className="flex items-baseline justify-between gap-4 rounded-xl border border-[var(--brand-blue)]/20 bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Saldo atual
              </p>
              {data.saldoAtual.status === "ok" && data.saldoAtual.value ? (
                <p
                  className="text-[1.5rem] font-extrabold leading-none tabular-nums"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {data.saldoAtual.value}
                </p>
              ) : (
                <p className="text-right text-[11px] font-medium leading-snug text-muted-foreground">
                  Aguardando conexão bancária
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Blocos investigáveis ───────────────────────── */}
      <section aria-labelledby="bloco-investigar" className="mb-3">
        <h2 id="bloco-investigar" className="sr-only">
          Onde investigar a fundo
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {data.cardsDrilldown.map((card) => (
            <DrillInCard
              key={card.href}
              href={card.href}
              eyebrow={card.eyebrow}
              icon={DRILLDOWN_ICON[card.icon]}
              total={card.total}
              count={card.count}
              hint={card.hint}
            />
          ))}
        </div>
      </section>

      {/* ───────────────────────── Grid de decisão ───────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Bloco 2 · Caixa / liquidez por período */}
        <LiquidezBlock />

        {/* Bloco 4 · O que precisa de ação */}
        <section
          aria-labelledby="bloco-alertas"
          className="lg:col-span-5 rounded-2xl border p-4 md:p-5"
          style={{
            background: "rgba(234,179,8,0.08)",
            borderColor: "rgba(234,179,8,0.35)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#92651b" }}
              >
                Alertas de execução
              </p>
              <h2 id="bloco-alertas" className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
                O que precisa de ação
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

          <ul className="mt-3 divide-y divide-border/60">
            {data.alertas.map((a, i) => (
              <AlertRow key={i} severity={a.severity} title={a.title} body={a.body} />
            ))}
          </ul>
        </section>

        {/* Bloco 3 · Análise de clientes */}
        <section
          aria-labelledby="bloco-clientes"
          className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 md:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Clientes
              </p>
              <h2
                id="bloco-clientes"
                className="mt-0.5 text-base font-bold"
                style={{ color: "var(--brand-navy)" }}
              >
                Análise
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

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Top 5 do período
          </p>
          <ul className="mt-2 space-y-1">
            {data.topClientes.map((c, i) => (
              <TopClientRow key={i} name={c.name} share={c.share} />
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
            <PortfolioIndicator label="Prazo médio" value={data.indicadoresClientes.prazoMedio} />
            <PortfolioIndicator label="Margem média" value={data.indicadoresClientes.margemMedia} />
            <PortfolioIndicator label="Atraso médio" value={data.indicadoresClientes.atrasoMedio} />
          </div>

          <Link
            href={data.clienteCritico.href}
            className="group mt-4 flex items-center gap-3 rounded-xl border border-border bg-hero-gradient px-3.5 py-3 transition hover:border-[var(--brand-blue)]/30"
          >
            <span
              aria-hidden
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(54,186,88,0.18)", color: "var(--brand-green-dark)" }}
            >
              <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Cliente mais crítico
              </p>
              <p className="mt-0.5 text-[14px] font-bold leading-tight" style={{ color: "var(--brand-navy)" }}>
                {data.clienteCritico.name}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-[var(--slate-700)]">
                {data.clienteCritico.description}
              </p>
            </div>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-navy)]"
              strokeWidth={2.2}
            />
          </Link>
        </section>

        {/* Bloco 4 · Análise de fornecedores */}
        <section
          aria-labelledby="bloco-fornecedores"
          className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 md:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Fornecedores
              </p>
              <h2
                id="bloco-fornecedores"
                className="mt-0.5 text-base font-bold"
                style={{ color: "var(--brand-navy)" }}
              >
                Análise
              </h2>
            </div>
            <Link
              href="/fornecedores"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-blue)] hover:underline"
            >
              Ver todos
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Top 5 do período
          </p>
          <ul className="mt-2 space-y-1">
            {data.topFornecedores.map((f, i) => (
              <TopSupplierRow key={i} name={f.name} share={f.share} />
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
            <PortfolioIndicator label="Prazo médio" value={data.indicadoresFornecedores.prazoMedio} />
            <PortfolioIndicator label="Top 5 no custo" value={data.indicadoresFornecedores.topShareCusto} />
            <PortfolioIndicator label="Atraso médio" value={data.indicadoresFornecedores.atrasoMedio} />
          </div>

          <Link
            href={data.fornecedorCritico.href}
            className="group mt-4 flex items-center gap-3 rounded-xl border border-border bg-hero-gradient px-3.5 py-3 transition hover:border-[var(--brand-blue)]/30"
          >
            <span
              aria-hidden
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(54,186,88,0.18)", color: "var(--brand-green-dark)" }}
            >
              <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Fornecedor mais crítico
              </p>
              <p className="mt-0.5 text-[14px] font-bold leading-tight" style={{ color: "var(--brand-navy)" }}>
                {data.fornecedorCritico.name}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-[var(--slate-700)]">
                {data.fornecedorCritico.description}
              </p>
            </div>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-navy)]"
              strokeWidth={2.2}
            />
          </Link>
        </section>

        {/* Bloco 5 · Ação principal / Chat CFOup */}
        <section
          aria-labelledby="bloco-acao"
          className="lg:col-span-12 overflow-hidden rounded-2xl border border-[rgba(21,103,200,0.25)] bg-brand-gradient p-4 text-white md:p-5"
        >
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                Ação principal
              </div>
              <h2
                id="bloco-acao"
                className="mt-1.5 text-balance text-lg font-extrabold leading-tight md:text-[1.25rem]"
              >
                Ficou com alguma dúvida?
              </h2>
              <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-white/85">
                Se algo aqui não ficou claro, pergunte ao Chat CFOup.
              </p>

              <Link
                href="/chat"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[var(--brand-navy)] shadow-sm transition hover:bg-white/95"
              >
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
                Abrir Chat CFOup
              </Link>
            </div>

            <div className="grid gap-1.5 text-sm md:border-l md:border-white/20 md:pl-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Perguntas sugeridas
              </p>
              {data.promptsSugeridos.map((p) => (
                <SuggestedPrompt key={p} text={p} />
              ))}
            </div>
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

function TopClientRow({ name, share }: { name: string; share: number }) {
  return (
    <li>
      <Link
        href={`/clientes?cliente=${encodeURIComponent(name)}`}
        className="group flex items-center gap-3 rounded-lg px-1.5 py-1 transition hover:bg-muted/60"
      >
        <p
          className="flex-1 truncate text-[13px] font-medium"
          style={{ color: "var(--brand-navy)" }}
        >
          {name}
        </p>
        <div
          aria-hidden
          className="h-1 w-20 overflow-hidden rounded-full"
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
        <p
          className="w-9 shrink-0 text-right text-[13px] font-bold tabular-nums"
          style={{ color: "var(--brand-navy)" }}
        >
          {share}%
        </p>
      </Link>
    </li>
  )
}

function TopSupplierRow({ name, share }: { name: string; share: number }) {
  return (
    <li>
      <Link
        href={`/fornecedores?fornecedor=${encodeURIComponent(name)}`}
        className="group flex items-center gap-3 rounded-lg px-1.5 py-1 transition hover:bg-muted/60"
      >
        <p
          className="flex-1 truncate text-[13px] font-medium"
          style={{ color: "var(--brand-navy)" }}
        >
          {name}
        </p>
        <div
          aria-hidden
          className="h-1 w-20 overflow-hidden rounded-full"
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
        <p
          className="w-9 shrink-0 text-right text-[13px] font-bold tabular-nums"
          style={{ color: "var(--brand-navy)" }}
        >
          {share}%
        </p>
      </Link>
    </li>
  )
}

function PortfolioIndicator({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className="mt-1 text-[1rem] font-extrabold leading-none tabular-nums"
        style={{ color: "var(--brand-navy)" }}
      >
        {value}
      </p>
    </div>
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
