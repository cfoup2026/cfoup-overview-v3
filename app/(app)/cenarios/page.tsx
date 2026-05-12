"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, Clock, DollarSign, MoveHorizontal, TrendingUp, Check, Lightbulb } from "lucide-react"
import { PageHeader } from "@/components/page-header"

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
  if (tone === "positive") return "var(--brand-green-dark, #0F7A33)"
  if (tone === "negative") return "var(--brand-red, #D14343)"
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
      <PageHeader
        eyebrow="Mesa de Decisão"
        title="Cenários"
        description="Teste impacto no caixa antes de decidir."
      >
        <Link
          href={`/chat?q=${encodeURIComponent(currentState.chatPrompt)}&auto=1`}
          className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-white px-4 py-2.5 text-[13px] font-semibold transition hover:border-[var(--brand-cyan)]"
          style={{ color: "var(--brand-blue)" }}
        >
          <MessageCircle className="h-4 w-4" />
          Discutir com CFOup
        </Link>
      </PageHeader>

      {/* Linha 1: grid 3 colunas */}
      <div className="grid gap-[18px] lg:grid-cols-[1.06fr_1.7fr_0.96fr] mt-3">
        {/* Card DECISÃO */}
        <section className="rounded-[14px] border border-border bg-card p-5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--brand-blue)" }}>
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
            Decisão em teste
          </div>

          <h2
            className="mt-3 text-[17px] font-bold leading-tight tracking-tight"
            style={{ color: "var(--brand-navy)" }}
          >
            {activeDecision.question}
          </h2>
          <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
            {activeDecision.context}
          </p>

          <p className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {activeDecision.paramLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {activeDecision.params.map((p) => {
              const active = activeParam === p.value
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setParam(p.value)}
                  className={
                    active
                      ? "rounded-lg px-3.5 py-2 text-[12px] font-semibold whitespace-nowrap transition"
                      : "rounded-lg border border-border bg-white px-3.5 py-2 text-[12px] font-semibold text-muted-foreground whitespace-nowrap transition hover:border-[var(--brand-cyan)]"
                  }
                  style={
                    active
                      ? {
                          background: "rgba(21,103,200,0.08)",
                          border: "1px solid var(--brand-blue)",
                          color: "var(--brand-blue)",
                        }
                      : undefined
                  }
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          <div className="mt-5 border-t border-[#EEF3F8] pt-4 space-y-3">
            <div className="flex items-center gap-3 text-[13px]" style={{ color: "#3D4D66" }}>
              <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-[#FAFBFD]" style={{ color: "var(--brand-navy)" }}>
                <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span>Caixa: <strong style={{ color: "var(--brand-navy)", fontWeight: 700 }}>{currentState.consequences.caixa.value}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-[13px]" style={{ color: "#3D4D66" }}>
              <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-[#FAFBFD]" style={{ color: "var(--brand-navy)" }}>
                <DollarSign className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span>Custo: <strong style={{ color: "var(--brand-navy)", fontWeight: 700 }}>{currentState.consequences.custo.value}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-[13px]" style={{ color: "#3D4D66" }}>
              <span className="grid h-[30px] w-[30px] place-items-center rounded-lg bg-[#FAFBFD]" style={{ color: "var(--brand-navy)" }}>
                <MoveHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span>Fôlego: <strong style={{ color: "var(--brand-navy)", fontWeight: 700 }}>{currentState.consequences.folego.value}</strong></span>
            </div>
          </div>
        </section>

        {/* Card IMPACTO */}
        <section className="rounded-[14px] border border-border bg-card p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--brand-blue)" }}>
            Impacto no caixa
          </div>

          <div className="mt-4 grid items-center" style={{ gridTemplateColumns: "1fr 48px 1fr" }}>
            {/* Sem agir */}
            <div
              className="rounded-xl border p-5"
              style={{ background: "#FFF5F5", borderColor: "#F2CACA", minHeight: "168px" }}
            >
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--brand-red, #D14343)" }}>
                Sem agir
              </p>
              <p className="mt-2.5 text-[12px]" style={{ color: "#3D4D66" }}>
                menor caixa na S3
              </p>
              <p
                className="mt-3 text-[34px] font-extrabold tabular-nums leading-none tracking-tight"
                style={{ color: "var(--brand-red, #D14343)" }}
              >
                {SEM_AGIR.value}
              </p>
              <p
                className="mt-3 text-[12px] font-semibold"
                style={{ color: "var(--brand-red, #D14343)" }}
              >
                ponto de ruptura na S3
              </p>
            </div>

            {/* Círculo "vs" */}
            <div
              className="z-10 grid h-[42px] w-[42px] place-items-center rounded-full border border-border bg-white text-[10.5px] font-extrabold uppercase tracking-[0.08em]"
              style={{
                color: "var(--brand-navy)",
                marginLeft: "-10px",
                marginRight: "-10px",
                boxShadow: "0 2px 8px rgba(7,29,59,0.06)",
              }}
            >
              vs
            </div>

            {/* Com esta decisão */}
            <div
              className="rounded-xl border p-5"
              style={{
                background: currentState.caixaMinComDecisao.tone === "positive" ? "#F0FAF3" : "#FFF5F5",
                borderColor: currentState.caixaMinComDecisao.tone === "positive" ? "#CFEAD7" : "#F2CACA",
                minHeight: "168px",
              }}
            >
              <p
                className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
                style={{
                  color: currentState.caixaMinComDecisao.tone === "positive" ? "var(--brand-green-dark, #0F7A33)" : "var(--brand-red, #D14343)",
                }}
              >
                Com esta decisão
              </p>
              <p className="mt-2.5 text-[12px]" style={{ color: "#3D4D66" }}>
                menor caixa na S3
              </p>
              <p
                className="mt-3 text-[34px] font-extrabold tabular-nums leading-none tracking-tight"
                style={{
                  color: currentState.caixaMinComDecisao.tone === "positive" ? "var(--brand-green-dark, #0F7A33)" : "var(--brand-red, #D14343)",
                }}
              >
                {currentState.caixaMinComDecisao.value}
              </p>
              <p
                className="mt-3 text-[12px] font-semibold"
                style={{
                  color: currentState.caixaMinComDecisao.tone === "positive" ? "var(--brand-green-dark, #0F7A33)" : "var(--brand-red, #D14343)",
                }}
              >
                {currentState.caixaMinComDecisao.delta}
              </p>
            </div>
          </div>

          <p className="mt-4 px-3 text-center text-[12.5px] italic" style={{ color: "#3D4D66" }}>
            {currentState.reading}
          </p>

          <div
            className="mt-4 grid grid-cols-3 rounded-[10px] border border-border"
            style={{ background: "#FAFBFD" }}
          >
            <div className="p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Caixa hoje
              </p>
              <p
                className="mt-1.5 text-[18px] font-extrabold tabular-nums tracking-tight"
                style={{ color: "var(--brand-navy)" }}
              >
                {CAIXA_HOJE}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">saldo atual</p>
            </div>
            <div className="border-l border-border p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Diferença
              </p>
              <p
                className="mt-1.5 text-[18px] font-extrabold tabular-nums tracking-tight"
                style={{ color: "var(--brand-green-dark, #0F7A33)" }}
              >
                {currentState.caixaMinComDecisao.delta.replace(" vs sem agir", "")}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">melhora no menor caixa</p>
            </div>
            <div className="border-l border-border p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Fôlego
              </p>
              <p
                className="mt-1.5 text-[18px] font-extrabold tabular-nums tracking-tight"
                style={{ color: "var(--brand-navy)" }}
              >
                {currentState.consequences.folego.value}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {currentState.consequences.folego.detail}
              </p>
            </div>
          </div>
        </section>

        {/* Card MESA DE DECISÕES */}
        <aside className="rounded-[14px] border border-border bg-card p-5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--brand-green-dark, #0F7A33)" }}>
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
            Mesa de decisões
          </div>

          <div className="mt-4 space-y-1">
            {DECISIONS.map((d) => {
              const isActive = d.id === activeId
              const paramValue = paramByDecision[d.id]
              const paramLabel = d.params.find((p) => p.value === paramValue)?.label ?? ""

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => activateDecision(d.id)}
                  disabled={isActive}
                  className={
                    isActive
                      ? "flex w-full items-baseline justify-between gap-2 rounded-lg border px-3 py-2.5 text-left cursor-default"
                      : "flex w-full items-baseline justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition hover:bg-[rgba(21,103,200,0.04)]"
                  }
                  style={
                    isActive
                      ? {
                          background: "rgba(54,186,88,0.08)",
                          borderColor: "rgba(54,186,88,0.25)",
                          borderLeftWidth: "3px",
                          borderLeftColor: "var(--brand-green, #36BA58)",
                        }
                      : undefined
                  }
                >
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: isActive ? "var(--brand-green-dark, #0F7A33)" : "var(--brand-ink-muted, #3D4D66)" }}
                  >
                    {d.alavanca}
                  </span>
                  {isActive && (
                    <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                      {paramLabel}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <p className="mt-5 border-t border-[var(--brand-line-soft,#EEF3F8)] pt-3.5 text-[11.5px] leading-snug text-muted-foreground">
            Clique em uma decisão para testar.
          </p>
        </aside>
      </div>

      {/* Linha 2: grid 2 colunas */}
      <div className="grid gap-[18px] lg:grid-cols-[1fr_0.42fr] mt-3">
        {/* Card TRAJETÓRIA */}
        <section className="rounded-[14px] border border-border bg-card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--brand-navy)" }}>
              Trajetória do caixa · 13 semanas
            </p>
            <div className="flex items-center gap-3.5 text-[11px] font-semibold">
              <span style={{ color: "var(--brand-red, #D14343)" }}>── Sem agir</span>
              <span style={{ color: "var(--brand-green-dark, #0F7A33)" }}>── Com esta decisão</span>
            </div>
          </div>

          <div className="relative mt-3.5" style={{ height: "220px" }}>
            <TrajetoriaChart semAgir={TRAJECTORY_SEM_AGIR} comDecisao={currentState.trajectoryComDecisao} />
            <div
              className="absolute rounded-md border bg-white px-2.5 py-1.5 text-[10.5px] font-semibold leading-tight"
              style={{
                color: "var(--brand-red, #D14343)",
                borderColor: "#F2CACA",
                boxShadow: "0 2px 8px rgba(7,29,59,0.05)",
                left: "165px",
                top: "10px",
              }}
            >
              Ponto de ruptura<br />sem agir na S3
            </div>
          </div>
        </section>

        {/* Card CONSEQUÊNCIA */}
        <section className="rounded-[14px] border border-border bg-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--brand-navy)" }}>
            Consequência operacional
          </p>

          <div className="mt-3.5 space-y-3.5">
            <div className="grid items-center gap-3" style={{ gridTemplateColumns: "36px 1fr auto" }}>
              <span
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ background: "rgba(54,186,88,0.12)", color: "var(--brand-green-dark, #0F7A33)" }}
              >
                <TrendingUp className="h-4 w-4" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">Caixa</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{currentState.consequences.caixa.detail}</p>
              </div>
              <span
                className="text-[14px] font-bold tabular-nums whitespace-nowrap"
                style={{ color: toneColor(currentState.consequences.caixa.tone) }}
              >
                {currentState.consequences.caixa.value}
              </span>
            </div>

            <div className="grid items-center gap-3" style={{ gridTemplateColumns: "36px 1fr auto" }}>
              <span
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ background: "rgba(209,67,67,0.10)", color: "var(--brand-red, #D14343)" }}
              >
                <DollarSign className="h-4 w-4" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">Custo</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{currentState.consequences.custo.detail}</p>
              </div>
              <span
                className="text-[14px] font-bold tabular-nums whitespace-nowrap"
                style={{ color: toneColor(currentState.consequences.custo.tone) }}
              >
                {currentState.consequences.custo.value}
              </span>
            </div>

            <div className="grid items-center gap-3" style={{ gridTemplateColumns: "36px 1fr auto" }}>
              <span
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ background: "rgba(21,103,200,0.10)", color: "var(--brand-blue)" }}
              >
                <Check className="h-4 w-4" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">Fôlego</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{currentState.consequences.folego.detail}</p>
              </div>
              <span
                className="text-[14px] font-bold tabular-nums whitespace-nowrap"
                style={{ color: toneColor(currentState.consequences.folego.tone) }}
              >
                {currentState.consequences.folego.value}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Leitura Rápida (rodapé full-width) */}
      <div
        className="mt-3 flex items-start gap-3.5 rounded-[10px] border border-border p-4"
        style={{
          background: "#FAFBFD",
          borderLeftWidth: "3px",
          borderLeftColor: "var(--brand-cyan, #38B8E8)",
        }}
      >
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
          style={{ background: "rgba(56,184,232,0.15)", color: "var(--brand-blue)" }}
        >
          <Lightbulb className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p
            className="text-[10.5px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Leitura rápida
          </p>
          <p className="mt-1 text-[13px] leading-snug" style={{ color: "#0F1B2D" }}>
            {currentState.reading}
          </p>
        </div>
      </div>
    </>
  )
}

function TrajetoriaChart({
  semAgir,
  comDecisao,
}: {
  semAgir: number[]
  comDecisao: number[]
}) {
  const W = 800
  const H = 220
  const xLeft = 50
  const xRight = 780
  const yTop = 10
  const yBottom = 194

  // Y range fixo: -60k a +60k
  const yMin = -60
  const yMax = 60
  const yRange = yMax - yMin
  const innerH = yBottom - yTop

  const xOf = (i: number) => xLeft + (i / (WEEKS_LABELS.length - 1)) * (xRight - xLeft)
  const yOf = (v: number) => yTop + ((yMax - v) / yRange) * innerH

  const pointsStr = (vals: number[]) => vals.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ")

  // S3 band: rect cobrindo a coluna da semana 3
  const s3Center = xOf(2)
  const s3Width = 55
  const s3X = s3Center - s3Width / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
      {/* Y axis labels */}
      <text x="0" y="14" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>R$ 60k</text>
      <text x="0" y="60" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>R$ 30k</text>
      <text x="20" y="106" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>R$ 0</text>
      <text x="0" y="152" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>−R$ 30k</text>
      <text x="0" y="198" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>−R$ 60k</text>

      {/* Grid horizontal */}
      <line x1={xLeft} y1="10" x2={xRight} y2="10" stroke="#EEF3F8" strokeWidth="1" />
      <line x1={xLeft} y1="56" x2={xRight} y2="56" stroke="#EEF3F8" strokeWidth="1" />
      <line x1={xLeft} y1="102" x2={xRight} y2="102" stroke="var(--border)" strokeDasharray="3 3" strokeWidth="1" />
      <line x1={xLeft} y1="148" x2={xRight} y2="148" stroke="#EEF3F8" strokeWidth="1" />
      <line x1={xLeft} y1="194" x2={xRight} y2="194" stroke="#EEF3F8" strokeWidth="1" />

      {/* S3 band */}
      <rect x={s3X} y="5" width={s3Width} height="195" rx="4" style={{ fill: "rgba(209,67,67,0.06)" }} />

      {/* Linhas */}
      <polyline points={pointsStr(semAgir)} fill="none" stroke="var(--brand-red, #D14343)" strokeWidth="2" />
      <polyline points={pointsStr(comDecisao)} fill="none" stroke="var(--brand-green, #36BA58)" strokeWidth="2.25" />

      {/* Pontos sem agir */}
      {semAgir.map((v, i) => (
        <circle key={`r${i}`} cx={xOf(i)} cy={yOf(v)} r="3" style={{ fill: "var(--brand-red, #D14343)" }} />
      ))}

      {/* Pontos com decisão */}
      {comDecisao.map((v, i) => (
        <circle key={`g${i}`} cx={xOf(i)} cy={yOf(v)} r="3" style={{ fill: "var(--brand-green, #36BA58)" }} />
      ))}

      {/* Labels eixo X (S1...S13) */}
      {WEEKS_LABELS.map((label, i) => (
        <text
          key={label}
          x={xOf(i)}
          y="215"
          textAnchor="middle"
          style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 600 }}
        >
          {label}
        </text>
      ))}
    </svg>
  )
}
