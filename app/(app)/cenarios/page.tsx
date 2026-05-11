"use client"

import { useState } from "react"
import Link from "next/link"
import { GitBranch, Plus, ArrowUpRight, Target, TrendingDown, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/page-header"

type Pct = 20 | 40 | 60

type ScenarioData = {
  caixa: string
  custo: string
  folego: string
  folegoDetail: string
  weeks: WeekEffect[]
  leitura: string
  chatQuery: string
  caixaMinComDecisao: { value: string; sub: string; tone: "positive" | "negative" }
  antesDepoisReading: string
}

const CAIXA_HOJE = "R$ 34,4k"
const CAIXA_MIN_SEM_AGIR = { value: "−R$ 25,6k", sub: "na S3" }

const SCENARIO_DATA: Record<Pct, ScenarioData> = {
  20: {
    caixa: "+ R$ 122,4k",
    custo: "− R$ 3,5k",
    folego: "8,6 meses",
    folegoDetail: "ganha umas 2 semanas",
    weeks: [
      { label: "S1",  tone: "positive", text: "entra caixa" },
      { label: "S2",  tone: "empty" },
      { label: "S3",  tone: "neutral",  text: "alivia" },
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
    ],
    leitura: "Antecipação leve — alivia sem gastar muito, mas se o aperto for maior o caixa não aguenta.",
    chatQuery: "Analisa o cenário de antecipar 20% dos recebíveis (R$ 122,4k de caixa, R$ 3,5k de custo). Vale agora?",
    caixaMinComDecisao: { value: "R$ 12,4k", sub: "na S3", tone: "positive" },
    antesDepoisReading: "Ajuda, mas ainda deixa pouco espaço se entrar atraso.",
  },
  40: {
    caixa: "+ R$ 244,8k",
    custo: "− R$ 7,1k",
    folego: "9,1 meses",
    folegoDetail: "ganha quase 1 mês",
    weeks: [
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
    ],
    leitura: "Esse cenário compra fôlego agora, mas custa R$ 7,1k e não corrige a causa se o aperto voltar no mês seguinte.",
    chatQuery: "Analisa o cenário de antecipar 40% dos recebíveis (R$ 244,8k de caixa, R$ 7,1k de custo). Vale agora?",
    caixaMinComDecisao: { value: "R$ 78,9k", sub: "na S3", tone: "positive" },
    antesDepoisReading: "Resolve agosto com folga, mas custa R$ 7,1k.",
  },
  60: {
    caixa: "+ R$ 367,2k",
    custo: "− R$ 10,6k",
    folego: "9,8 meses",
    folegoDetail: "ganha quase 2 meses",
    weeks: [
      { label: "S1",  tone: "positive", text: "entra caixa" },
      { label: "S2",  tone: "empty" },
      { label: "S3",  tone: "neutral",  text: "sobra folga" },
      { label: "S4",  tone: "negative", text: "custo alto" },
      { label: "S5",  tone: "empty" },
      { label: "S6",  tone: "empty" },
      { label: "S7",  tone: "empty" },
      { label: "S8",  tone: "empty" },
      { label: "S9",  tone: "empty" },
      { label: "S10", tone: "empty" },
      { label: "S11", tone: "empty" },
      { label: "S12", tone: "empty" },
      { label: "S13", tone: "empty" },
    ],
    leitura: "Antecipação forte — fôlego de sobra, mas o custo de R$ 10,6k machuca se não tiver destino certo pro dinheiro.",
    chatQuery: "Analisa o cenário de antecipar 60% dos recebíveis (R$ 367,2k de caixa, R$ 10,6k de custo). Vale agora?",
    caixaMinComDecisao: { value: "R$ 142,3k", sub: "na S3", tone: "positive" },
    antesDepoisReading: "Dá bastante caixa agora, mas custa caro e pode virar dependência.",
  },
}

export default function CenariosPage() {
  const [pct, setPct] = useState<Pct>(40)
  const data = SCENARIO_DATA[pct]
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

      {/* Destaque — 4 blocos */}
      <div className="mb-6 space-y-3">
        {/* Bloco 1 — Decisão */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue)]">
            <Target className="h-3.5 w-3.5" />
            Decisão em teste
          </div>
          <h2
            className="mt-2 max-w-2xl text-balance text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            Antecipar recebíveis segura agosto?
          </h2>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-[var(--slate-700)]">
            Entra caixa agora, mas a decisão custa margem e pode virar hábito se o aperto voltar.
          </p>

          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Quanto antecipar?
            </p>
            <div className="mt-1.5 flex gap-1.5">
              {([20, 40, 60] as Pct[]).map((v) => {
                const active = pct === v
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setPct(v)}
                    className={
                      active
                        ? "h-7 px-3 text-[11px] font-semibold rounded-full bg-[rgba(21,103,200,0.10)] text-[var(--brand-blue)] transition"
                        : "h-7 px-3 text-[11px] font-semibold rounded-full border border-border text-muted-foreground hover:border-[rgba(21,103,200,0.30)] transition"
                    }
                    style={active ? { border: "0.5px solid rgba(21,103,200,0.40)" } : { borderWidth: "0.5px" }}
                  >
                    {v}%
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Bloco 2 — Caixa antes e depois */}
        <section className="overflow-hidden rounded-2xl border border-border bg-hero-gradient p-4 md:p-5">
          <h3 className="text-base font-bold" style={{ color: "var(--brand-navy)" }}>
            Caixa antes e depois
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <ImpactTile label="Caixa hoje" value={CAIXA_HOJE} tone="neutral" detail="saldo atual" />
            <ImpactTile label="Sem agir" value={CAIXA_MIN_SEM_AGIR.value} tone="negative" detail={CAIXA_MIN_SEM_AGIR.sub} />
            <ImpactTile
              label="Com esta decisão"
              value={data.caixaMinComDecisao.value}
              tone={data.caixaMinComDecisao.tone}
              detail={data.caixaMinComDecisao.sub}
            />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-[var(--slate-700)]">
            {data.antesDepoisReading}
          </p>
        </section>

        {/* Bloco 3 — Consequência da decisão */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <h3 className="text-base font-bold" style={{ color: "var(--brand-navy)" }}>
            Consequência da decisão
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <ImpactTile label="Caixa agora" value={data.caixa} tone="positive" detail="entra em até 2 dias" />
            <ImpactTile label="Custo da decisão" value={data.custo} tone="negative" detail="sai do resultado do mês" />
            <ImpactTile label="Fôlego de caixa" value={data.folego} tone="neutral" detail={data.folegoDetail} />
          </div>
        </section>

        {/* Bloco 4 — Próximas 13 semanas */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <h3 className="text-base font-bold" style={{ color: "var(--brand-navy)" }}>
            Próximas 13 semanas
          </h3>
          <div className="mt-3 grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1">
            {data.weeks.map((w) => {
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
                  style={{ background: hasEffect ? "rgba(21,103,200,0.04)" : "transparent" }}
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {w.label}
                  </span>
                  {hasEffect ? (
                    <span
                      className="text-[9px] font-semibold uppercase leading-tight tracking-[0.06em] text-center"
                      style={{ color }}
                    >
                      {(w as Exclude<WeekEffect, { tone: "empty" }>).text}
                    </span>
                  ) : (
                    <span className="text-[10px] leading-none text-muted-foreground">—</span>
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-[var(--slate-700)]">
            {data.leitura}
          </p>
        </section>

        {/* Link textual pequeno */}
        <div className="flex justify-end pt-1">
          <Link
            href={`/chat?q=${encodeURIComponent(data.chatQuery)}&auto=1`}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--brand-blue)] hover:underline"
          >
            Discutir com o CFOup
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

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
