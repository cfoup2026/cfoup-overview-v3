"use client"

import { useState } from "react"
import Link from "next/link"
import { GitBranch, ArrowUpRight, Target, TrendingDown, TrendingUp, ChevronRight } from "lucide-react"

type Tone = "positive" | "negative" | "neutral"

type DecisionState = {
  caixaMinComDecisao: { value: string; sub: string; tone: "positive" | "negative"; delta: string }
  consequences: {
    caixa:  { value: string; detail: string; tone: Tone }
    custo:  { value: string; detail: string; tone: Tone }
    folego: { value: string; detail: string; tone: Tone }
  }
  trajectoryComDecisao: number[]
  reading: string
  chatPrompt: string
}

type Decision = {
  id: string
  alavanca: string
  question: string
  context: string
  shortSummary: string
  paramLabel: string
  params: { label: string; value: string }[]
  defaultParam: string
  impactSummary: string
  states: Record<string, DecisionState>
}

function toneColor(tone: "positive" | "negative" | "neutral"): string {
  if (tone === "positive") return "var(--brand-green-dark)"
  if (tone === "negative") return "var(--brand-red)"
  return "var(--brand-navy)"
}

const CAIXA_HOJE = "R$ 34,4k"
const SEM_AGIR = { value: "−R$ 25,6k", sub: "ponto de ruptura · S3" }
const TRAJECTORY_SEM_AGIR = [30, 25, -25.6, -30, -45, -52, -60, -70, -75, -80, -85, -88, -92]
const WEEKS_LABELS = ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12","S13"]

const DECISIONS: Decision[] = [
  {
    id: "antecipar-recebiveis",
    alavanca: "Antecipar recebíveis",
    question: "Antecipar recebíveis segura agosto?",
    context: "Entra caixa agora, mas a decisão custa margem e pode virar hábito se o aperto voltar.",
    shortSummary: "Cobrir aperto de caixa antes do pico de venda",
    paramLabel: "Quanto antecipar?",
    params: [{ label: "20%", value: "20" }, { label: "40%", value: "40" }, { label: "60%", value: "60" }],
    defaultParam: "40",
    impactSummary: "+R$ 244,8k caixa / −R$ 7,1k custo",
    states: {
      "20": {
        caixaMinComDecisao: { value: "R$ 12,4k", sub: "na S3", tone: "positive", delta: "+R$ 38k vs sem agir" },
        consequences: {
          caixa:  { value: "+ R$ 122,4k", detail: "entra em até 2 dias",       tone: "positive" },
          custo:  { value: "− R$ 3,6k",   detail: "sai do resultado do mês",   tone: "negative" },
          folego: { value: "8,7 meses",   detail: "ganha cerca de 2 semanas",  tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, 12.4, 5, -5, -10, -15, -25, -30, -40, -45, -55, -65],
        reading: "Ajuda, mas ainda deixa pouco espaço se entrar atraso.",
        chatPrompt: "Analisa antecipar 20% dos recebíveis (R$ 122,4k caixa, R$ 3,6k custo). Vale agora?",
      },
      "40": {
        caixaMinComDecisao: { value: "R$ 78,9k", sub: "na S3", tone: "positive", delta: "+R$ 104,5k vs sem agir" },
        consequences: {
          caixa:  { value: "+ R$ 244,8k", detail: "entra em até 2 dias",     tone: "positive" },
          custo:  { value: "− R$ 7,1k",   detail: "sai do resultado do mês", tone: "negative" },
          folego: { value: "9,1 meses",   detail: "ganha quase 1 mês",       tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, 78.9, 71, 60, 50, 40, 30, 20, 10, 0, -10, -20],
        reading: "Resolve agosto com folga, mas custa R$ 7,1k.",
        chatPrompt: "Analisa antecipar 40% dos recebíveis (R$ 244,8k caixa, R$ 7,1k custo). Vale agora?",
      },
      "60": {
        caixaMinComDecisao: { value: "R$ 142,3k", sub: "na S3", tone: "positive", delta: "+R$ 167,9k vs sem agir" },
        consequences: {
          caixa:  { value: "+ R$ 367,2k", detail: "entra em até 2 dias",          tone: "positive" },
          custo:  { value: "− R$ 10,6k",  detail: "sai do resultado do mês",      tone: "negative" },
          folego: { value: "9,5 meses",   detail: "resolve agosto, aperta set.",  tone: "negative" },
        },
        trajectoryComDecisao: [30, 25, 142.3, 135, 120, 100, 80, 50, 30, 10, -10, -25, -40],
        reading: "Resolve agosto, mas drena setembro porque você puxou pra frente o que entraria depois.",
        chatPrompt: "Analisa antecipar 60% dos recebíveis (R$ 367,2k caixa, R$ 10,6k custo). Vale agora?",
      },
    },
  },
  {
    id: "adiar-fornecedor",
    alavanca: "Adiar fornecedor",
    question: "Adiar fornecedor segura agosto?",
    context: "Não custa juros, mas mexe na relação com quem te abastece.",
    shortSummary: "Postergar pagamento sem queimar a relação",
    paramLabel: "Adiar quantos dias?",
    params: [{ label: "7 dias", value: "7" }, { label: "15 dias", value: "15" }, { label: "30 dias", value: "30" }],
    defaultParam: "15",
    impactSummary: "Sem custo direto / risco relacional",
    states: {
      "7": {
        caixaMinComDecisao: { value: "−R$ 8,2k", sub: "na S3", tone: "negative", delta: "+R$ 17,4k vs sem agir" },
        consequences: {
          caixa:  { value: "R$ 0",       detail: "não entra caixa novo",  tone: "neutral"  },
          custo:  { value: "sem juros",  detail: "fornecedor não cobra",  tone: "positive" },
          folego: { value: "8,3 meses",  detail: "ganha 1 semana",        tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, -8.2, -12, -25, -35, -45, -55, -65, -75, -80, -85, -90],
        reading: "Adia o aperto em uma semana. Pode não bastar se outro pagamento aparecer.",
        chatPrompt: "Vale adiar 7 dias o pagamento do fornecedor pra cobrir o aperto da S3?",
      },
      "15": {
        caixaMinComDecisao: { value: "R$ 12,8k", sub: "na S3", tone: "positive", delta: "+R$ 38,4k vs sem agir" },
        consequences: {
          caixa:  { value: "R$ 0",       detail: "não entra caixa novo",  tone: "neutral"  },
          custo:  { value: "sem juros",  detail: "fornecedor não cobra",  tone: "positive" },
          folego: { value: "8,7 meses",  detail: "ganha 2 semanas",       tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, 12.8, 5, -10, -25, -40, -50, -60, -70, -78, -85, -90],
        reading: "Adiar 15 dias resolve agosto. Confirmar com o fornecedor antes pra não pegar de surpresa.",
        chatPrompt: "Vale adiar 15 dias o pagamento do fornecedor?",
      },
      "30": {
        caixaMinComDecisao: { value: "R$ 56,2k", sub: "na S3", tone: "positive", delta: "+R$ 81,8k vs sem agir" },
        consequences: {
          caixa:  { value: "R$ 0",            detail: "não entra caixa novo",      tone: "neutral"  },
          custo:  { value: "risco relacional", detail: "fornecedor pode reagir",   tone: "negative" },
          folego: { value: "9,0 meses",       detail: "ganha 1 mês",               tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, 56.2, 50, 40, 25, 10, -5, -20, -40, -55, -70, -85],
        reading: "30 dias dá fôlego, mas pode queimar a relação. Avaliar se vale o custo invisível.",
        chatPrompt: "Adiar 30 dias o fornecedor crítico — vale o risco relacional?",
      },
    },
  },
  {
    id: "reajustar-linha-b",
    alavanca: "Reajustar preço da Linha B",
    question: "Reajustar Linha B salva o resultado?",
    context: "Recupera margem, mas o efeito no caixa demora a aparecer.",
    shortSummary: "Corrigir margem sem perder cliente bom",
    paramLabel: "Qual reajuste?",
    params: [{ label: "+3%", value: "3" }, { label: "+5%", value: "5" }, { label: "+8%", value: "8" }],
    defaultParam: "5",
    impactSummary: "+R$ 18,4k/mês se volume segurar",
    states: {
      "3": {
        caixaMinComDecisao: { value: "−R$ 14,2k", sub: "na S3", tone: "negative", delta: "+R$ 11,4k vs sem agir" },
        consequences: {
          caixa:  { value: "R$ 0 agora",  detail: "efeito a partir da S6",   tone: "neutral"  },
          custo:  { value: "risco baixo", detail: "cliente quase não reage", tone: "positive" },
          folego: { value: "8,4 meses",   detail: "ganha 1 semana",          tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, -14.2, -18, -28, -32, -38, -45, -50, -58, -62, -68, -72],
        reading: "Aumento modesto. Segura cliente, mas o caixa só sente o efeito daqui a 30-45 dias.",
        chatPrompt: "Reajustar a Linha B em 3% — vale pra recuperar margem sem espantar cliente?",
      },
      "5": {
        caixaMinComDecisao: { value: "−R$ 3,5k", sub: "na S3", tone: "negative", delta: "+R$ 22,1k vs sem agir" },
        consequences: {
          caixa:  { value: "R$ 0 agora",  detail: "efeito a partir da S5",    tone: "neutral"  },
          custo:  { value: "risco médio", detail: "alguns podem reclamar",    tone: "negative" },
          folego: { value: "8,6 meses",   detail: "ganha 2 semanas",          tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, -3.5, -6, -15, -18, -22, -26, -30, -36, -40, -45, -50],
        reading: "Cresce margem sem espantar volume. O caixa começa a sentir na S5.",
        chatPrompt: "Reajustar a Linha B em 5% — qual o risco de perder cliente?",
      },
      "8": {
        caixaMinComDecisao: { value: "R$ 14,8k", sub: "na S3", tone: "positive", delta: "+R$ 40,4k vs sem agir" },
        consequences: {
          caixa:  { value: "R$ 0 agora",   detail: "efeito a partir da S4",      tone: "neutral"  },
          custo:  { value: "risco alto",   detail: "cliente médio pode sair",    tone: "negative" },
          folego: { value: "8,8 meses",    detail: "ganha 3 semanas",            tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, 14.8, 11, 3, -2, -8, -10, -12, -15, -18, -22, -25],
        reading: "Recupera margem rápido, mas pode perder cliente médio. Avaliar antes quem aguenta o repasse.",
        chatPrompt: "Reajustar a Linha B em 8% — qual o impacto se perder 1-2 clientes médios?",
      },
    },
  },
  {
    id: "reduzir-retirada",
    alavanca: "Reduzir retirada",
    question: "Reduzir retirada cobre o mês?",
    context: "Alívio no caixa, mas pesa direto no seu bolso.",
    shortSummary: "Segurar pró-labore pra dar fôlego ao caixa",
    paramLabel: "Quanto reduzir?",
    params: [{ label: "Manter", value: "manter" }, { label: "Cortar 50%", value: "metade" }, { label: "Suspender", value: "zero" }],
    defaultParam: "metade",
    impactSummary: "+R$ 12,5k a +R$ 25k de fôlego direto",
    states: {
      "manter": {
        caixaMinComDecisao: { value: "−R$ 25,6k", sub: "na S3", tone: "negative", delta: "0 vs sem agir" },
        consequences: {
          caixa:  { value: "R$ 0",       detail: "nada muda",        tone: "neutral"  },
          custo:  { value: "renda intacta", detail: "você mantém os R$ 25k", tone: "positive" },
          folego: { value: "8,2 meses",  detail: "sem mudança",      tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, -25.6, -30, -45, -52, -60, -70, -75, -80, -85, -88, -92],
        reading: "Sem mudança. O caixa quebra do mesmo jeito.",
        chatPrompt: "Mantendo a retirada como está, o que muda no mês?",
      },
      "metade": {
        caixaMinComDecisao: { value: "−R$ 13,1k", sub: "na S3", tone: "negative", delta: "+R$ 12,5k vs sem agir" },
        consequences: {
          caixa:  { value: "+R$ 12,5k", detail: "fica na empresa",   tone: "positive" },
          custo:  { value: "renda menor", detail: "você recebe metade", tone: "negative" },
          folego: { value: "8,4 meses",  detail: "ganha 1 semana",   tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, -13.1, -17, -30, -38, -45, -55, -62, -70, -75, -80, -85],
        reading: "Alivia o caixa, mas pesa no bolso. Solução de um mês, não de hábito.",
        chatPrompt: "Reduzir retirada pela metade este mês — vale a pena?",
      },
      "zero": {
        caixaMinComDecisao: { value: "−R$ 0,6k", sub: "na S3", tone: "negative", delta: "+R$ 25k vs sem agir" },
        consequences: {
          caixa:  { value: "+R$ 25k",   detail: "fica todo na empresa",  tone: "positive" },
          custo:  { value: "renda zero", detail: "você não recebe este mês", tone: "negative" },
          folego: { value: "8,7 meses", detail: "ganha 3 semanas",      tone: "neutral"  },
        },
        trajectoryComDecisao: [30, 25, -0.6, -4, -15, -23, -32, -42, -50, -58, -65, -72, -78],
        reading: "Resolve o aperto sem custo financeiro, mas você fica sem renda este mês.",
        chatPrompt: "Suspender retirada este mês — vale o sacrifício?",
      },
    },
  },
]

export default function CenariosPage() {
  const [activeId, setActiveId] = useState<string>("antecipar-recebiveis")
  const [paramByDecision, setParamByDecision] = useState<Record<string, string>>(
    Object.fromEntries(DECISIONS.map((d) => [d.id, d.defaultParam]))
  )

  const activeDecision = DECISIONS.find((d) => d.id === activeId)!
  const activeParam = paramByDecision[activeId]
  const currentState = activeDecision.states[activeParam]

  function setParam(value: string) {
    setParamByDecision((prev) => ({ ...prev, [activeId]: value }))
  }

  function activateDecision(id: string) {
    setActiveId(id)
  }

  return (
    <>
      <header className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Planejamento
          </p>
          <h1
            className="mt-0.5 text-lg md:text-[1.3rem] font-extrabold leading-tight tracking-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            Cenários
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Teste impacto no caixa antes de decidir.
          </p>
        </div>
      </header>

      {/* Grid 2 colunas: main + aside */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Coluna principal (fluxo de decisão) */}
        <div className="min-w-0 space-y-2">
          {/* Card único: Decisão + Antes/Depois */}
          <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
            {/* Header: Decisão em teste */}
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-blue)]">
              <Target className="h-3 w-3" />
              Decisão em teste
            </div>

            <div className="mt-1.5 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2
                  className="max-w-2xl text-balance text-base md:text-[1.1rem] font-extrabold leading-tight tracking-tight"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {activeDecision.question}
                </h2>
                <p className="mt-1 max-w-2xl text-[11px] leading-snug text-muted-foreground">
                  {activeDecision.context}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">
                  {activeDecision.paramLabel}
                </p>
                <div className="flex gap-1">
                  {activeDecision.params.map((p) => {
                    const active = activeParam === p.value
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setParam(p.value)}
                        className={
                          active
                            ? "h-6 px-2.5 text-[11px] font-semibold rounded-full bg-[rgba(21,103,200,0.10)] text-[var(--brand-blue)] transition whitespace-nowrap"
                            : "h-6 px-2.5 text-[11px] font-semibold rounded-full border border-border text-muted-foreground hover:border-[rgba(21,103,200,0.30)] transition whitespace-nowrap"
                        }
                        style={active ? { border: "0.5px solid rgba(21,103,200,0.40)" } : { borderWidth: "0.5px" }}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="my-4 border-t border-border" />

            {/* Hero antes/depois */}
            <div className="mt-2 grid gap-2 md:grid-cols-3">
              <ImpactTile label="Caixa hoje" value={CAIXA_HOJE} tone="neutral" detail="saldo atual" />
              <ImpactTile label="Sem agir" value={SEM_AGIR.value} tone="negative" detail={SEM_AGIR.sub} />
              <ImpactTile
                label="Com esta decisão"
                value={currentState.caixaMinComDecisao.value}
                tone={currentState.caixaMinComDecisao.tone}
                detail={currentState.caixaMinComDecisao.delta}
              />
            </div>
            <p className="mt-3 text-[12px] leading-snug text-[var(--slate-700)]">
              {currentState.reading}
            </p>
          </section>

          {/* Card: Consequência + Trajetória ladeados */}
          <section className="rounded-2xl border border-border bg-card p-3 md:p-4">
            <div className="grid gap-4 md:grid-cols-[minmax(0,220px)_1fr]">
              {/* Coluna A — Consequência (KPIs verticais tabulares) */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Consequência
                </p>
                <div className="mt-2 flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">
                      Caixa
                    </span>
                    <span
                      className="text-[13px] font-extrabold tabular-nums"
                      style={{ color: toneColor(currentState.consequences.caixa.tone) }}
                    >
                      {currentState.consequences.caixa.value}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">
                      Custo
                    </span>
                    <span
                      className="text-[13px] font-extrabold tabular-nums"
                      style={{ color: toneColor(currentState.consequences.custo.tone) }}
                    >
                      {currentState.consequences.custo.value}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">
                      Fôlego
                    </span>
                    <span
                      className="text-[13px] font-extrabold tabular-nums"
                      style={{ color: toneColor(currentState.consequences.folego.tone) }}
                    >
                      {currentState.consequences.folego.value}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divisor vertical sutil (desktop only) */}
              <div className="relative">
                <span aria-hidden className="hidden md:block absolute -left-2 top-0 h-full w-px bg-border" />

                {/* Coluna B — Trajetória 13 semanas (sparkline compacta) */}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Trajetória · 13 sem
                  </p>
                  <div className="flex items-center gap-3 text-[9.5px] font-semibold uppercase tracking-[0.10em]">
                    <span className="inline-flex items-center gap-1" style={{ color: "var(--brand-red)" }}>
                      <span aria-hidden className="inline-block h-0.5 w-2.5" style={{ background: "var(--brand-red)" }} />
                      Sem agir
                    </span>
                    <span className="inline-flex items-center gap-1" style={{ color: "var(--brand-green-dark)" }}>
                      <span aria-hidden className="inline-block h-0.5 w-2.5" style={{ background: "var(--brand-green-dark)" }} />
                      Com decisão
                    </span>
                  </div>
                </div>
                <Sparkline
                  weeks={WEEKS_LABELS}
                  semAgir={TRAJECTORY_SEM_AGIR}
                  comDecisao={currentState.trajectoryComDecisao}
                />
              </div>
            </div>
          </section>

          {/* Link textual pequeno */}
          <div className="flex justify-end">
            <Link
              href={`/chat?q=${encodeURIComponent(currentState.chatPrompt)}&auto=1`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-blue)] hover:underline"
            >
              Discutir com o CFOup
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Coluna lateral (navegação) */}
        <aside className="lg:sticky lg:top-3 lg:self-start">
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Decisões
              </p>
              <p className="mt-0.5 text-[12px] font-bold" style={{ color: "var(--brand-navy)" }}>
                Em teste e alternativas
              </p>
            </div>

            <ul className="divide-y divide-border">
              {DECISIONS.map((d) => {
                const isActive = d.id === activeId
                const paramValue = paramByDecision[d.id]
                const paramLabel = d.params.find((p) => p.value === paramValue)?.label ?? ""

                if (isActive) {
                  return (
                    <li
                      key={d.id}
                      className="border-l-2 px-3 py-2.5"
                      style={{
                        borderLeftColor: "var(--brand-blue)",
                        background: "rgba(21,103,200,0.05)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-[9.5px] font-bold uppercase tracking-[0.18em]"
                          style={{ color: "var(--brand-blue)" }}
                        >
                          Em teste
                        </span>
                        <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                          {paramLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] font-bold" style={{ color: "var(--brand-navy)" }}>
                        {d.alavanca}
                      </p>
                      <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">
                        {d.shortSummary}
                      </p>
                    </li>
                  )
                }

                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => activateDecision(d.id)}
                      className="group w-full px-3 py-2.5 text-left transition hover:bg-[rgba(21,103,200,0.04)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="text-[12px] font-semibold transition group-hover:text-[var(--brand-blue)]"
                          style={{ color: "var(--brand-navy)" }}
                        >
                          {d.alavanca}
                        </p>
                        <ChevronRight className="h-3 w-3 text-muted-foreground transition group-hover:text-[var(--brand-blue)]" />
                      </div>
                      <p className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">
                        {d.shortSummary}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold tabular-nums text-muted-foreground">
                        {d.impactSummary}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </div>
    </>
  )
}

function Sparkline({
  weeks,
  semAgir,
  comDecisao,
}: {
  weeks: string[]
  semAgir: number[]
  comDecisao: number[]
}) {
  const W = 520
  const H = 56
  const all = [...semAgir, ...comDecisao, 0]
  const min = Math.min(...all)
  const max = Math.max(...all)
  const yMin = min - (max - min) * 0.10
  const yMax = max + (max - min) * 0.10
  const yRange = yMax - yMin || 1

  const xOf = (i: number) => (i / (weeks.length - 1)) * W
  const yOf = (v: number) => H - ((v - yMin) / yRange) * H
  const pts = (vals: number[]) => vals.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ")
  const zeroY = yOf(0)
  const ruptureX = xOf(2)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" style={{ height: 56 }} preserveAspectRatio="none">
      <line x1="0" y1={zeroY} x2={W} y2={zeroY} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1={ruptureX} y1="0" x2={ruptureX} y2={H} stroke="var(--brand-red)" strokeWidth="1" strokeDasharray="2 2" opacity="0.30" />
      <polyline points={pts(semAgir)} fill="none" stroke="var(--brand-red)" strokeWidth="1.5" opacity="0.85" />
      <polyline points={pts(comDecisao)} fill="none" stroke="var(--brand-green-dark)" strokeWidth="1.75" />
    </svg>
  )
}

function ImpactTile({ label, value, tone, detail }: { label: string; value: string; tone: "positive" | "negative" | "neutral"; detail: string }) {
  const color =
    tone === "positive" ? "var(--brand-green-dark)" :
    tone === "negative" ? "var(--brand-red)" :
    "var(--brand-navy)"
  const Icon = tone === "positive" ? TrendingUp : tone === "negative" ? TrendingDown : GitBranch
  return (
    <div className="rounded-xl border border-border bg-white/85 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1.5 text-[1.35rem] font-extrabold leading-none tabular-nums" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-[10.5px] text-muted-foreground">{detail}</p>
    </div>
  )
}


