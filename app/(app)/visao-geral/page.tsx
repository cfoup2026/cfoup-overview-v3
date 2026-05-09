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
  Plug,
} from "lucide-react"
import { LiquidezBlock } from "@/components/liquidez-block"
import { LiveStatus } from "@/components/live-status"
import { useVisaoGeralData, type DrilldownIcon } from "@/lib/hooks/use-visao-geral-data"
import { useCurrentUser } from "@/lib/hooks/use-current-user"

function chatHref(q: string) {
  return `/chat?q=${encodeURIComponent(q)}&auto=1`
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

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
  const user = useCurrentUser()
  const greeting = getGreeting()

  return (
    <>
      {/* Header */}
      <header className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <h1
            className="text-balance text-lg font-extrabold leading-tight tracking-tight md:text-[1.3rem]"
            style={{ color: "var(--brand-navy)" }}
          >
            {greeting}, {user.name}. {data.headline}
          </h1>
        </div>
        <LiveStatus />
      </header>

      {/* Resumo executivo */}
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
              {!data.hasConnections && (
                <Link
                  href="/conexoes"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--brand-navy)] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[var(--brand-blue)]"
                >
                  <Plug className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Ir para Conexões
                </Link>
              )}
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
                  Aguardando conexão
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cards de drilldown */}
      <section aria-labelledby="bloco-investigar" className="mb-3">
        <h2 id="bloco-investigar" className="sr-only">
          Onde investigar a fundo
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {data.cardsDrilldown.map((card) => (
            <DrillInCard
              key={card.eyebrow}
              href={card.href}
              eyebrow={card.eyebrow}
              icon={DRILLDOWN_ICON[card.icon]}
              total={card.total}
              count={card.count}
              hint={card.hint}
              empty={!data.hasConnections}
            />
          ))}
        </div>
      </section>

      {/* Grid */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Caixa / liquidez */}
        {data.hasConnections ? (
          <LiquidezBlock />
        ) : (
          <EmptyLiquidezBlock />
        )}

        {/* Alertas */}
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
            {data.alertas.length > 0 && (
              <Link
                href="/pendencias"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-blue)] hover:underline"
              >
                Ver todas
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {data.alertas.length > 0 ? (
            <ul className="mt-3 divide-y divide-border/60">
              {data.alertas.map((a, i) => (
                <AlertRow key={i} severity={a.severity} title={a.title} body={a.body} />
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--slate-700)]">
              Os alertas aparecem aqui quando a operação começar a gerar sinais — receber vencido, variação incomum,
              concentração crítica. Depende dos dados conectados.
            </p>
          )}
        </section>

        {/* Clientes */}
        <PortfolioSection
          ariaId="bloco-clientes"
          eyebrow="Clientes"
          verTodosHref="/clientes"
          top={data.topClientes}
          topKind="client"
          indicadores={[
            { label: "Prazo médio", value: data.indicadoresClientes.prazoMedio },
            { label: "Margem média", value: data.indicadoresClientes.margemMedia },
            { label: "Atraso médio", value: data.indicadoresClientes.atrasoMedio },
          ]}
          criticoLabel="Cliente mais crítico"
          critico={data.clienteCritico}
          empty={!data.hasConnections}
        />

        {/* Fornecedores */}
        <PortfolioSection
          ariaId="bloco-fornecedores"
          eyebrow="Fornecedores"
          verTodosHref="/fornecedores"
          top={data.topFornecedores}
          topKind="supplier"
          indicadores={[
            { label: "Prazo médio", value: data.indicadoresFornecedores.prazoMedio },
            { label: "Top 5 no custo", value: data.indicadoresFornecedores.topShareCusto },
            { label: "Atraso médio", value: data.indicadoresFornecedores.atrasoMedio },
          ]}
          criticoLabel="Fornecedor mais crítico"
          critico={data.fornecedorCritico}
          empty={!data.hasConnections}
        />

        {/* Ação principal / Chat */}
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
  empty,
}: {
  href: string
  eyebrow: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  total: string | null
  count: string | null
  hint: string | null
  empty: boolean
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
          {count && <p className="text-[11px] text-muted-foreground">{count}</p>}
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          {empty ? (
            <p className="text-[11px] text-muted-foreground">Conectar para ver</p>
          ) : (
            <>
              <p
                className="text-[1.25rem] font-extrabold leading-none tabular-nums"
                style={{ color: "var(--brand-navy)" }}
              >
                {total}
              </p>
              {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
            </>
          )}
        </div>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-navy)]"
        strokeWidth={2.2}
      />
    </Link>
  )
}

function EmptyLiquidezBlock() {
  return (
    <section
      aria-label="Caixa e liquidez"
      className="lg:col-span-7 rounded-2xl border border-border bg-card p-4 md:p-5"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Caixa e liquidez
      </p>
      <h2 className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
        Variação por período
      </h2>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--slate-700)]">
        A variação de caixa aparece aqui quando o banco estiver conectado. Receitas vs. saídas, mês a mês, com
        comparação contra o período anterior.
      </p>
      <Link
        href="/conexoes"
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-blue)]/40"
      >
        <Plug className="h-3.5 w-3.5" strokeWidth={2.2} />
        Conectar banco
      </Link>
    </section>
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

function PortfolioSection({
  ariaId,
  eyebrow,
  verTodosHref,
  top,
  topKind,
  indicadores,
  criticoLabel,
  critico,
  empty,
}: {
  ariaId: string
  eyebrow: string
  verTodosHref: string
  top: Array<{ name: string; share: number }>
  topKind: "client" | "supplier"
  indicadores: Array<{ label: string; value: string }>
  criticoLabel: string
  critico: { name: string; description: string; href: string }
  empty: boolean
}) {
  return (
    <section
      aria-labelledby={ariaId}
      className="lg:col-span-6 rounded-2xl border border-border bg-card p-4 md:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 id={ariaId} className="mt-0.5 text-base font-bold" style={{ color: "var(--brand-navy)" }}>
            Análise
          </h2>
        </div>
        {!empty && (
          <Link
            href={verTodosHref}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-blue)] hover:underline"
          >
            Ver todos
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {empty ? (
        <p className="mt-3 text-[13px] leading-relaxed text-[var(--slate-700)]">
          Os {eyebrow.toLowerCase()} que mais pesam no seu resultado aparecem aqui quando os dados estiverem
          conectados.
        </p>
      ) : (
        <>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Top 5 do período
          </p>
          <ul className="mt-2 space-y-1">
            {top.map((item, i) =>
              topKind === "client" ? (
                <TopClientRow key={i} name={item.name} share={item.share} />
              ) : (
                <TopSupplierRow key={i} name={item.name} share={item.share} />
              ),
            )}
          </ul>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
            {indicadores.map((ind) => (
              <PortfolioIndicator key={ind.label} label={ind.label} value={ind.value} />
            ))}
          </div>

          <Link
            href={critico.href}
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
                {criticoLabel}
              </p>
              <p className="mt-0.5 text-[14px] font-bold leading-tight" style={{ color: "var(--brand-navy)" }}>
                {critico.name}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-[var(--slate-700)]">{critico.description}</p>
            </div>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-navy)]"
              strokeWidth={2.2}
            />
          </Link>
        </>
      )}
    </section>
  )
}

function TopClientRow({ name, share }: { name: string; share: number }) {
  return (
    <li>
      <Link
        href={`/clientes?cliente=${encodeURIComponent(name)}`}
        className="group flex items-center gap-3 rounded-lg px-1.5 py-1 transition hover:bg-muted/60"
      >
        <p className="flex-1 truncate text-[13px] font-medium" style={{ color: "var(--brand-navy)" }}>
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
        <p className="flex-1 truncate text-[13px] font-medium" style={{ color: "var(--brand-navy)" }}>
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
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
