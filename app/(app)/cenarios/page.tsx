"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MessageCircle,
  Clock,
  DollarSign,
  MoveHorizontal,
  TrendingUp,
  Check,
  Lightbulb,
  Plug,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { useCenarios, type Tone } from "@/lib/hooks/use-cenarios"

function toneColor(tone: Tone): string {
  if (tone === "positive") return "var(--brand-green-dark)"
  if (tone === "negative") return "var(--brand-error-soft)"
  return "var(--brand-navy)"
}

// ================================================================
// ESTRUTURA — 4 decisões como template (sem números nem nomes específicos)
// ================================================================

type Decision = {
  id: string
  alavanca: string
  question: string
  context: string
  shortSummary: string
  paramLabel: string
  params: { label: string; value: string }[]
  defaultParam: string
}

const WEEKS_LABELS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13"]

const DECISIONS: Decision[] = [
  {
    id: "antecipar-recebiveis",
    alavanca: "Antecipar recebíveis",
    question: "Antecipar recebíveis cobre o aperto?",
    context: "Entra caixa agora, mas custa margem e pode virar hábito se o aperto voltar.",
    shortSummary: "Cobrir aperto de caixa",
    paramLabel: "Quanto antecipar?",
    params: [
      { label: "20%", value: "20" },
      { label: "40%", value: "40" },
      { label: "60%", value: "60" },
    ],
    defaultParam: "40",
  },
  {
    id: "adiar-fornecedor",
    alavanca: "Adiar fornecedor",
    question: "Adiar fornecedor cobre o aperto?",
    context: "Não custa juros, mas mexe na relação com quem te abastece.",
    shortSummary: "Postergar pagamento sem queimar a relação",
    paramLabel: "Adiar quantos dias?",
    params: [
      { label: "7 dias", value: "7" },
      { label: "15 dias", value: "15" },
      { label: "30 dias", value: "30" },
    ],
    defaultParam: "15",
  },
  {
    id: "reajustar-margem",
    alavanca: "Reajustar margem",
    question: "Reajustar preço recupera margem?",
    context: "Recupera margem, mas o efeito no caixa demora a aparecer.",
    shortSummary: "Corrigir margem sem perder cliente bom",
    paramLabel: "Qual reajuste?",
    params: [
      { label: "+3%", value: "3" },
      { label: "+5%", value: "5" },
      { label: "+8%", value: "8" },
    ],
    defaultParam: "5",
  },
  {
    id: "reduzir-retirada",
    alavanca: "Reduzir retirada",
    question: "Reduzir retirada cobre o mês?",
    context: "Alívio no caixa, mas pesa direto no seu bolso.",
    shortSummary: "Segurar pró-labore pra dar fôlego ao caixa",
    paramLabel: "Quanto reduzir?",
    params: [
      { label: "Manter", value: "manter" },
      { label: "Cortar 50%", value: "metade" },
      { label: "Suspender", value: "zero" },
    ],
    defaultParam: "metade",
  },
]

// ================================================================
// PAGE
// ================================================================

export default function CenariosPage() {
  const [activeId, setActiveId] = useState<string>(DECISIONS[0].id)
  const [paramByDecision, setParamByDecision] = useState<Record<string, string>>(
    Object.fromEntries(DECISIONS.map((d) => [d.id, d.defaultParam])),
  )

  const activeDecision = DECISIONS.find((d) => d.id === activeId)!
  const activeParam = paramByDecision[activeId]
  const { baseline, calculo } = useCenarios(activeId, activeParam)

  function setParam(value: string) {
    setParamByDecision((prev) => ({ ...prev, [activeId]: value }))
  }

  function activateDecision(id: string) {
    setActiveId(id)
  }

  const canSimulate = baseline !== null && calculo !== null

  return (
    <>
      <PageHeader eyebrow="Mesa de Decisão" title="Cenários" description="Teste impacto no caixa antes de decidir.">
        {calculo && (
          <Link
            href={`/chat?q=${encodeURIComponent(calculo.chatPrompt)}&auto=1`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-[13px] font-semibold transition hover:border-[var(--brand-cyan)]"
            style={{ color: "var(--brand-blue)" }}
          >
            <MessageCircle className="h-4 w-4" />
            Discutir com CFOup
          </Link>
        )}
      </PageHeader>

      {/* Linha 1: grid 3 colunas */}
      <div className="grid gap-4 lg:grid-cols-[1.06fr_1.7fr_0.96fr] mt-3">
        {/* Card DECISÃO */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-blue)" }}
          >
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
            Decisão em teste
          </div>

          <h2 className="mt-3 text-[17px] font-bold leading-tight tracking-tight" style={{ color: "var(--brand-navy)" }}>
            {activeDecision.question}
          </h2>
          <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{activeDecision.context}</p>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
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
            {calculo ? (
              <>
                <div className="flex items-center gap-3 text-[13px]" style={{ color: "var(--brand-ink-muted)" }}>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FAFBFD]" style={{ color: "var(--brand-navy)" }}>
                    <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span>
                    Caixa:{" "}
                    <strong style={{ color: "var(--brand-navy)", fontWeight: 700 }}>
                      {calculo.consequences.caixa.value}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[13px]" style={{ color: "var(--brand-ink-muted)" }}>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FAFBFD]" style={{ color: "var(--brand-navy)" }}>
                    <DollarSign className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span>
                    Custo:{" "}
                    <strong style={{ color: "var(--brand-navy)", fontWeight: 700 }}>
                      {calculo.consequences.custo.value}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[13px]" style={{ color: "var(--brand-ink-muted)" }}>
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FAFBFD]" style={{ color: "var(--brand-navy)" }}>
                    <MoveHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span>
                    Fôlego:{" "}
                    <strong style={{ color: "var(--brand-navy)", fontWeight: 700 }}>
                      {calculo.consequences.folego.value}
                    </strong>
                  </span>
                </div>
              </>
            ) : (
              <p className="text-[12.5px] leading-relaxed text-[var(--brand-ink-muted)]">
                Caixa, custo e fôlego aparecem aqui após a simulação com dados conectados.
              </p>
            )}
          </div>
        </section>

        {/* Card IMPACTO */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
            Impacto no caixa
          </div>

          {canSimulate ? (
            <>
              <div className="mt-4 grid items-center" style={{ gridTemplateColumns: "1fr 48px 1fr" }}>
                {/* Sem agir */}
                <div className="rounded-xl border p-5" style={{ background: "#FFF5F5", borderColor: "#F2CACA", minHeight: "168px" }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--brand-error-soft)" }}>
                    Sem agir
                  </p>
                  <p className="mt-2 text-[12px]" style={{ color: "var(--brand-ink-muted)" }}>
                    menor caixa no horizonte
                  </p>
                  <p
                    className="mt-3 text-[34px] font-extrabold tabular-nums leading-none tracking-tight"
                    style={{ color: "var(--brand-error-soft)" }}
                  >
                    {baseline!.semAgir.value}
                  </p>
                  <p className="mt-3 text-[12px] font-semibold" style={{ color: "var(--brand-error-soft)" }}>
                    {baseline!.semAgir.sub}
                  </p>
                </div>

                {/* Círculo "vs" */}
                <div
                  className="z-10 grid h-[42px] w-[42px] place-items-center rounded-full border border-border bg-white text-[10px] font-extrabold uppercase tracking-[0.08em]"
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
                    background: calculo!.caixaMinComDecisao.tone === "positive" ? "#F0FAF3" : "#FFF5F5",
                    borderColor: calculo!.caixaMinComDecisao.tone === "positive" ? "#CFEAD7" : "#F2CACA",
                    minHeight: "168px",
                  }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      color:
                        calculo!.caixaMinComDecisao.tone === "positive"
                          ? "var(--brand-green-dark)"
                          : "var(--brand-error-soft)",
                    }}
                  >
                    Com esta decisão
                  </p>
                  <p className="mt-2 text-[12px]" style={{ color: "var(--brand-ink-muted)" }}>
                    {calculo!.caixaMinComDecisao.sub}
                  </p>
                  <p
                    className="mt-3 text-[34px] font-extrabold tabular-nums leading-none tracking-tight"
                    style={{
                      color:
                        calculo!.caixaMinComDecisao.tone === "positive"
                          ? "var(--brand-green-dark)"
                          : "var(--brand-error-soft)",
                    }}
                  >
                    {calculo!.caixaMinComDecisao.value}
                  </p>
                  <p
                    className="mt-3 text-[12px] font-semibold"
                    style={{
                      color:
                        calculo!.caixaMinComDecisao.tone === "positive"
                          ? "var(--brand-green-dark)"
                          : "var(--brand-error-soft)",
                    }}
                  >
                    {calculo!.caixaMinComDecisao.delta}
                  </p>
                </div>
              </div>

              <p className="mt-4 px-3 text-center text-[12px] italic" style={{ color: "var(--brand-ink-muted)" }}>
                {calculo!.reading}
              </p>

              <div className="mt-4 grid grid-cols-3 rounded-xl border border-border" style={{ background: "#FAFBFD" }}>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Caixa hoje</p>
                  <p className="mt-1.5 text-[18px] font-extrabold tabular-nums tracking-tight" style={{ color: "var(--brand-navy)" }}>
                    {baseline!.caixaHoje}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">saldo atual</p>
                </div>
                <div className="border-l border-border p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Diferença</p>
                  <p
                    className="mt-1.5 text-[18px] font-extrabold tabular-nums tracking-tight"
                    style={{ color: "var(--brand-green-dark)" }}
                  >
                    {calculo!.caixaMinComDecisao.delta.replace(" vs sem agir", "")}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">melhora no menor caixa</p>
                </div>
                <div className="border-l border-border p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Fôlego</p>
                  <p className="mt-1.5 text-[18px] font-extrabold tabular-nums tracking-tight" style={{ color: "var(--brand-navy)" }}>
                    {calculo!.consequences.folego.value}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{calculo!.consequences.folego.detail}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-border p-5" style={{ background: "#FAFBFD" }}>
              <p className="text-[14px] font-bold leading-snug" style={{ color: "var(--brand-navy)" }}>
                Conecte dados para simular cenários com base no caixa real.
              </p>
              <p className="text-[12.5px] leading-relaxed text-[var(--brand-ink-muted)]">
                Os parâmetros da decisão ficam ativos pra você explorar a estrutura. Os valores, a trajetória e a leitura aparecem assim que o banco, sistema de NF-e ou ERP estiverem conectados.
              </p>
              <Link
                href="/conexoes"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold transition hover:border-[var(--brand-blue)]"
                style={{ color: "var(--brand-navy)" }}
              >
                <Plug className="h-3.5 w-3.5" strokeWidth={2.2} />
                Ir para Conexões
              </Link>
            </div>
          )}
        </section>

        {/* Card MESA DE DECISÕES */}
        <aside className="rounded-2xl border border-border bg-card p-5">
          <div
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "var(--brand-green-dark)" }}
          >
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
                      ? "flex w-full items-baseline justify-between gap-2 rounded-lg border px-3 py-2 text-left cursor-default"
                      : "flex w-full items-baseline justify-between gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-[rgba(21,103,200,0.04)]"
                  }
                  style={
                    isActive
                      ? {
                          background: "rgba(54,186,88,0.08)",
                          borderColor: "rgba(54,186,88,0.25)",
                          borderLeftWidth: "3px",
                          borderLeftColor: "var(--brand-green)",
                        }
                      : undefined
                  }
                >
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: isActive ? "var(--brand-green-dark)" : "var(--brand-ink-muted)" }}
                  >
                    {d.alavanca}
                  </span>
                  {isActive && (
                    <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">{paramLabel}</span>
                  )}
                </button>
              )
            })}
          </div>

          <p className="mt-5 border-t border-[var(--brand-line-soft,#EEF3F8)] pt-4 text-[11px] leading-snug text-muted-foreground">
            Clique em uma decisão para testar.
          </p>
        </aside>
      </div>

      {/* Linha 2: grid 2 colunas */}
      <div className="grid gap-4 lg:grid-cols-[1fr_0.42fr] mt-3">
        {/* Card TRAJETÓRIA */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--brand-navy)" }}>
              Trajetória do caixa · 13 semanas
            </p>
            {canSimulate && (
              <div className="flex items-center gap-4 text-[11px] font-semibold">
                <span style={{ color: "var(--brand-error-soft)" }}>── Sem agir</span>
                <span style={{ color: "var(--brand-green-dark)" }}>── Com esta decisão</span>
              </div>
            )}
          </div>

          {canSimulate ? (
            <div className="relative mt-4" style={{ height: "220px" }}>
              <TrajetoriaChart semAgir={baseline!.trajectorySemAgir} comDecisao={calculo!.trajectoryComDecisao} />
            </div>
          ) : (
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--brand-ink-muted)]">
              A trajetória do caixa de 13 semanas aparece quando o banco estiver conectado.
            </p>
          )}
        </section>

        {/* Card CONSEQUÊNCIA */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--brand-navy)" }}>
            Consequência operacional
          </p>

          {calculo ? (
            <div className="mt-4 space-y-4">
              <div className="grid items-center gap-3" style={{ gridTemplateColumns: "36px 1fr auto" }}>
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg"
                  style={{ background: "rgba(54,186,88,0.12)", color: "var(--brand-green-dark)" }}
                >
                  <TrendingUp className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">Caixa</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{calculo.consequences.caixa.detail}</p>
                </div>
                <span
                  className="text-[14px] font-bold tabular-nums whitespace-nowrap"
                  style={{ color: toneColor(calculo.consequences.caixa.tone) }}
                >
                  {calculo.consequences.caixa.value}
                </span>
              </div>

              <div className="grid items-center gap-3" style={{ gridTemplateColumns: "36px 1fr auto" }}>
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg"
                  style={{ background: "rgba(209,67,67,0.10)", color: "var(--brand-error-soft)" }}
                >
                  <DollarSign className="h-4 w-4" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">Custo</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{calculo.consequences.custo.detail}</p>
                </div>
                <span
                  className="text-[14px] font-bold tabular-nums whitespace-nowrap"
                  style={{ color: toneColor(calculo.consequences.custo.tone) }}
                >
                  {calculo.consequences.custo.value}
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
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{calculo.consequences.folego.detail}</p>
                </div>
                <span
                  className="text-[14px] font-bold tabular-nums whitespace-nowrap"
                  style={{ color: toneColor(calculo.consequences.folego.tone) }}
                >
                  {calculo.consequences.folego.value}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--brand-ink-muted)]">
              A consequência operacional aparece após a simulação com dados conectados.
            </p>
          )}
        </section>
      </div>

      {/* Leitura Rápida (rodapé full-width) */}
      <div
        className="mt-3 flex items-start gap-4 rounded-xl border border-border p-4"
        style={{
          background: "#FAFBFD",
          borderLeftWidth: "3px",
          borderLeftColor: "var(--brand-cyan)",
        }}
      >
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
          style={{ background: "rgba(56,184,232,0.15)", color: "var(--brand-blue)" }}
        >
          <Lightbulb className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--brand-blue)" }}>
            Leitura rápida
          </p>
          <p className="mt-1 text-[13px] leading-snug" style={{ color: "#0F1B2D" }}>
            {calculo
              ? calculo.reading
              : "A leitura do CFOup aparece após a simulação com dados conectados."}
          </p>
        </div>
      </div>
    </>
  )
}

// ================================================================
// Gráfico SVG — só renderiza quando há baseline e cálculo
// ================================================================

function TrajetoriaChart({ semAgir, comDecisao }: { semAgir: number[]; comDecisao: number[] }) {
  const W = 800
  const H = 220
  const xLeft = 50
  const xRight = 780
  const yTop = 10
  const yBottom = 194

  const yMin = -60
  const yMax = 60
  const yRange = yMax - yMin
  const innerH = yBottom - yTop

  const xOf = (i: number) => xLeft + (i / (WEEKS_LABELS.length - 1)) * (xRight - xLeft)
  const yOf = (v: number) => yTop + ((yMax - v) / yRange) * innerH

  const pointsStr = (vals: number[]) => vals.map((v, i) => `${xOf(i)},${yOf(v)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "100%" }}>
      <text x="0" y="14" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>R$ 60k</text>
      <text x="0" y="60" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>R$ 30k</text>
      <text x="20" y="106" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>R$ 0</text>
      <text x="0" y="152" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>−R$ 30k</text>
      <text x="0" y="198" style={{ fill: "#5B6B82", fontSize: "10px", fontWeight: 500 }}>−R$ 60k</text>

      <line x1={xLeft} y1="10" x2={xRight} y2="10" stroke="#EEF3F8" strokeWidth="1" />
      <line x1={xLeft} y1="56" x2={xRight} y2="56" stroke="#EEF3F8" strokeWidth="1" />
      <line x1={xLeft} y1="102" x2={xRight} y2="102" stroke="var(--border)" strokeDasharray="3 3" strokeWidth="1" />
      <line x1={xLeft} y1="148" x2={xRight} y2="148" stroke="#EEF3F8" strokeWidth="1" />
      <line x1={xLeft} y1="194" x2={xRight} y2="194" stroke="#EEF3F8" strokeWidth="1" />

      <polyline points={pointsStr(semAgir)} fill="none" stroke="var(--brand-error-soft)" strokeWidth="2" />
      <polyline points={pointsStr(comDecisao)} fill="none" stroke="var(--brand-green)" strokeWidth="2.25" />

      {semAgir.map((v, i) => (
        <circle key={`r${i}`} cx={xOf(i)} cy={yOf(v)} r="3" style={{ fill: "var(--brand-error-soft)" }} />
      ))}

      {comDecisao.map((v, i) => (
        <circle key={`g${i}`} cx={xOf(i)} cy={yOf(v)} r="3" style={{ fill: "var(--brand-green)" }} />
      ))}

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
