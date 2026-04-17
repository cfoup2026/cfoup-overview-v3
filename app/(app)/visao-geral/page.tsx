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

          {/* Top 5 clientes */}
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Top 5 do período
          </p>
          <ul className="mt-2 space-y-1">
            <TopClientRow name="Construtora Andrade" share={24} />
            <TopClientRow name="Metalúrgica Vitória" share={16} />
            <TopClientRow name="Grupo Sertanejo" share={12} />
            <TopClientRow name="Laticínios Bela Vista" share={9} />
            <TopClientRow name="Transportadora Linha Azul" share={7} />
          </ul>

          {/* Indicadores da carteira */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
            <PortfolioIndicator label="Prazo médio" value="42 dias" />
            <PortfolioIndicator label="Margem média" value="18%" />
            <PortfolioIndicator label="Atraso médio" value="18 dias" />
          </div>

          {/* Cliente mais crítico */}
          <Link
            href="/clientes/concentracao"
            className="group mt-4 flex items-center gap-3 rounded-xl border border-[rgba(234,179,8,0.4)] bg-[rgba(234,179,8,0.08)] px-3.5 py-3 transition hover:border-[rgba(234,179,8,0.6)]"
          >
            <span
              aria-hidden
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(234,179,8,0.2)", color: "#b45309" }}
            >
              <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#92400e]">
                Cliente mais crítico
              </p>
              <p className="mt-0.5 text-[14px] font-bold leading-tight" style={{ color: "var(--brand-navy)" }}>
                Cliente em validação
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-[var(--slate-700)]">
                Participação na receita, prazo e margem em validação
              </p>
            </div>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-navy)]"
              strokeWidth={2.2}
            />
          </Link>
        </section>

        {/* Bloco 4 · Análise de fornecedores (parallel ao de clientes) */}
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
              href="/contas-a-pagar"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-blue)] hover:underline"
            >
              Ver todos
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Top 5 fornecedores · share calculado sobre o total a pagar do período (R$ 280,2k) */}
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Top 5 do período
          </p>
          <ul className="mt-2 space-y-1">
            <TopSupplierRow name="Plastibras Insumos" share={16} />
            <TopSupplierRow name="Aços São Paulo" share={14} />
            <TopSupplierRow name="Metalfix Ferramentas" share={6} />
            <TopSupplierRow name="Transportadora Linha Sul" share={5} />
            <TopSupplierRow name="Energia SP" share={4} />
          </ul>

          {/* Indicadores da base de fornecedores */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
            <PortfolioIndicator label="Prazo médio" value="14 dias" />
            <PortfolioIndicator label="Top 5 no custo" value="43%" />
            <PortfolioIndicator label="Atraso médio" value="7 dias" />
          </div>

          {/* Fornecedor mais crítico · Plastibras Insumos */}
          <Link
            href="/contas-a-pagar"
            className="group mt-4 flex items-center gap-3 rounded-xl border border-[rgba(234,179,8,0.4)] bg-[rgba(234,179,8,0.08)] px-3.5 py-3 transition hover:border-[rgba(234,179,8,0.6)]"
          >
            <span
              aria-hidden
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(234,179,8,0.2)", color: "#b45309" }}
            >
              <AlertTriangle className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#92400e]">
                Fornecedor mais crítico
              </p>
              <p className="mt-0.5 text-[14px] font-bold leading-tight" style={{ color: "var(--brand-navy)" }}>
                Plastibras Insumos
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-[var(--slate-700)]">
                R$ 44,2k · 1 título vencido há 7 dias e outro com suspeita de duplicidade
              </p>
            </div>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-navy)]"
              strokeWidth={2.2}
            />
          </Link>
        </section>

        {/* Bloco 5 · Ação principal / Chat CFOup — movido para baixo dos blocos de análise */}
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
                Quero separar banco, receber e pendências.
              </h2>
              <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-white/85">
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
            </div>

            <div className="grid gap-1.5 text-sm md:border-l md:border-white/20 md:pl-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Perguntas sugeridas
              </p>
              <SuggestedPrompt text="Qual o impacto se eu antecipar 40% dos recebíveis?" />
              <SuggestedPrompt text="Como tá a saúde financeira comparada ao trimestre passado?" />
              <SuggestedPrompt text="Onde tô perdendo margem nos últimos 60 dias?" />
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
        href={`/contas-a-pagar?fornecedor=${encodeURIComponent(name)}`}
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
